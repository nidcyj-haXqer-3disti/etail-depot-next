import {customerHref} from "../../shared/customer-routes";
import {createHash,randomUUID} from "node:crypto";
import {and,desc,eq,inArray,sql} from "drizzle-orm";
import {z} from "zod";
import {getDb} from "../../platform/database/client";
import {cards,services} from "../../platform/database/schema";
import {SecurityError} from "../../platform/security/origin";
import type {ScopedTransaction} from "../access/scope";
import {loadTerminalScope,merchantNow} from "../access/merchant-scope";
import {loadCardholderWorkspaceScope,formatMoney} from "../workspace/service";
import {evaluate} from "../policy/evaluate";
import {merchantTerminals} from "../acquiring/schema";
import {merchantTestPayments,merchantTestRefunds} from "../acquiring/operations-schema";
import {cardCheckoutAttempts} from "../acquiring/card-checkout-schema";
import {operatorServiceAccess} from "../operations/schema";
import {merchantDisputes,merchantDisputeMessages,merchantDisputeCommands} from "./schema";
import {openDisputeSchema,respondDisputeSchema,reviewDisputeSchema,type OpenDisputeInput,type RespondDisputeInput,type ReviewDisputeInput,type DisputeProjection} from "./contracts";
type Row=typeof merchantDisputes.$inferSelect;
const unavailable=()=>new SecurityError("RESOURCE_UNAVAILABLE",404);
function id(value:string){if(!z.uuid().safeParse(value).success)throw unavailable();return value.toLowerCase();}
function parse<T>(schema:z.ZodType<T>,value:unknown){const result=schema.safeParse(value);if(!result.success)throw new SecurityError("INVALID_REQUEST",422);return result.data;}
async function ownPayment(tx:ScopedTransaction,personId:string,paymentId:string,write=false){
 const [row]=await tx.select({payment:merchantTestPayments,checkout:cardCheckoutAttempts}).from(merchantTestPayments).innerJoin(cardCheckoutAttempts,eq(cardCheckoutAttempts.id,merchantTestPayments.cardCheckoutId)).where(and(eq(merchantTestPayments.id,paymentId),eq(cardCheckoutAttempts.payerId,personId)));
 if(!row||row.payment.outcome!=="APPROVED")throw unavailable();
 const scope=await loadCardholderWorkspaceScope(tx,personId,row.checkout.cardServiceId,write);
 if(!evaluate(scope.policy,"cards.read").allowed)throw unavailable();
 const [card]=await tx.select().from(cards).where(and(eq(cards.id,row.checkout.cardId),eq(cards.serviceId,row.checkout.cardServiceId),eq(cards.holderId,personId)));if(!card)throw unavailable();return row;
}
async function operatorScope(tx:ScopedTransaction,personId:string,serviceId:string,write=false){
 if(write)await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`operator:${serviceId}:${personId}`},0))`);
 const query=tx.select({assignment:operatorServiceAccess,service:services}).from(operatorServiceAccess).innerJoin(services,eq(services.id,operatorServiceAccess.serviceId)).where(and(eq(operatorServiceAccess.personId,personId),eq(operatorServiceAccess.serviceId,serviceId)));
 const [row]=write?await query.for("share"):await query;
 const scope={targetKind:"OPERATOR_SERVICE" as const,actorPersonId:personId,assignmentPersonId:row?.assignment.personId??"",serviceId,resourceServiceId:serviceId,state:row?.assignment.state??"REVOKED" as const,serviceStatus:row?.service.status??"CLOSED",grants:row?.assignment.canResolveDisputes?["support.operator.read","disputes.operator.read","disputes.operator.resolve"]:[]};
 if(!evaluate(scope,"disputes.operator.read").allowed)throw unavailable();return scope;
}
async function project(tx:ScopedTransaction,row:Row,canRespond=false,canReview=false,merchant=false):Promise<DisputeProjection>{
 const [payment]=await tx.select().from(merchantTestPayments).where(eq(merchantTestPayments.id,row.paymentId));const [terminal]=await tx.select().from(merchantTerminals).where(eq(merchantTerminals.id,row.terminalId));if(!payment||!terminal)throw unavailable();
 const [refund]=await tx.select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,row.paymentId));
 const messages=await tx.select().from(merchantDisputeMessages).where(eq(merchantDisputeMessages.disputeId,row.id)).orderBy(merchantDisputeMessages.sequence);
 return {id:row.id,paymentId:row.paymentId,terminalId:row.terminalId,serviceId:row.serviceId,reference:`DIS-${row.id.slice(0,8).toUpperCase()}`,paymentReference:payment.testReference,paymentRefundedAt:refund?.createdAt.toISOString()??null,refundReference:refund?.testReference??null,terminalName:terminal.displayName,description:payment.description,amount:formatMoney(row.amountMinor),reason:row.reason,status:row.status,resolution:row.resolution,version:row.version,createdAt:row.createdAt.toISOString(),updatedAt:row.updatedAt.toISOString(),canRespond:canRespond&&row.status==="NEEDS_RESPONSE",canReview:canReview&&row.status!=="RESOLVED",paymentHref:merchant?customerHref(`/merchants/${row.terminalId}`,{tab:"payments",payment:row.paymentId}):null,messages:messages.map(message=>({id:message.id,kind:message.kind,authorRole:message.authorRole,message:message.message,evidence:message.evidence,createdAt:message.createdAt.toISOString()}))};
}
async function receipt(tx:ScopedTransaction,actorId:string,kind:string,resourceId:string,input:{commandId:string}){
 await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"dispute-command:"+input.commandId},0))`);const digest=createHash("sha256").update(JSON.stringify({kind,resourceId,input})).digest("hex");
 const [old]=await tx.select().from(merchantDisputeCommands).where(eq(merchantDisputeCommands.commandId,input.commandId));if(old&&(old.actorId!==actorId||old.kind!==kind||old.digest!==digest))throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return {old,digest};
}
export async function getPayerDispute(personId:string,paymentId:string){paymentId=id(paymentId);return getDb().transaction(async tx=>{await ownPayment(tx,personId,paymentId);const [row]=await tx.select().from(merchantDisputes).where(eq(merchantDisputes.paymentId,paymentId));const [refund]=await tx.select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,paymentId));return {paymentId,canOpen:!row&&!refund,dispute:row?await project(tx,row):null};},{isolationLevel:"repeatable read"});}
export async function openPaymentDispute(personId:string,paymentId:string,raw:OpenDisputeInput){paymentId=id(paymentId);const input=parse(openDisputeSchema,raw);return getDb().transaction(async tx=>{
 const {payment}=await ownPayment(tx,personId,paymentId,true);await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"dispute-payment:"+paymentId},0))`);const command=await receipt(tx,personId,"OPEN",paymentId,input);
 const [row]=await tx.select().from(merchantDisputes).where(eq(merchantDisputes.paymentId,paymentId)).for("update");if(command.old){if(!row||row.id!==command.old.disputeId)throw unavailable();return project(tx,row);}
 const [refund]=await tx.select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,paymentId));if(row||refund)throw new SecurityError("PAYMENT_DISPUTE_UNAVAILABLE",409);
 const now=await merchantNow(tx),disputeId=randomUUID();const [saved]=await tx.insert(merchantDisputes).values({id:disputeId,paymentId,terminalId:payment.merchantUnitId,serviceId:payment.serviceId,payerId:personId,reason:input.reason,amountMinor:payment.amountMinor,status:"NEEDS_RESPONSE",createdAt:now,updatedAt:now}).returning();
 await tx.insert(merchantDisputeMessages).values({id:randomUUID(),disputeId,actorId:personId,kind:"OPENED",authorRole:"PAYER",message:input.message,evidence:"",sequence:1,createdAt:now});await tx.insert(merchantDisputeCommands).values({commandId:input.commandId,disputeId,actorId:personId,kind:"OPEN",digest:command.digest,createdAt:now});return project(tx,saved!);
 });}
export async function listTerminalDisputes(personId:string,terminalId:string){terminalId=id(terminalId);return getDb().transaction(async tx=>{const scope=await loadTerminalScope(tx,personId,terminalId,false,{read:true});if(!evaluate(scope.policy,"disputes.read").allowed)throw unavailable();const rows=await tx.select().from(merchantDisputes).where(eq(merchantDisputes.terminalId,terminalId)).orderBy(desc(merchantDisputes.updatedAt),merchantDisputes.id);return Promise.all(rows.map(row=>project(tx,row,evaluate(scope.policy,"disputes.respond").allowed,false,true)));},{isolationLevel:"repeatable read"});}
export async function respondToTerminalDispute(personId:string,terminalId:string,disputeId:string,raw:RespondDisputeInput){terminalId=id(terminalId);disputeId=id(disputeId);const input=parse(respondDisputeSchema,raw);return getDb().transaction(async tx=>{
 const scope=await loadTerminalScope(tx,personId,terminalId,true);if(!evaluate(scope.policy,"disputes.respond").allowed)throw new SecurityError("ACTION_DENIED",403);
 const [row]=await tx.select().from(merchantDisputes).where(and(eq(merchantDisputes.id,disputeId),eq(merchantDisputes.terminalId,terminalId))).for("update");if(!row)throw unavailable();const command=await receipt(tx,personId,"RESPOND",disputeId,input);if(command.old)return project(tx,row,true,false,true);if(row.version!==input.expectedVersion)throw new SecurityError("STALE_VERSION",409);if(row.status!=="NEEDS_RESPONSE")throw new SecurityError("DISPUTE_NOT_WAITING",409);
 const now=await merchantNow(tx);const [saved]=await tx.update(merchantDisputes).set({status:"IN_REVIEW",version:row.version+1,updatedAt:now}).where(eq(merchantDisputes.id,disputeId)).returning();await tx.insert(merchantDisputeMessages).values({id:randomUUID(),disputeId,actorId:personId,kind:"RESPONSE",authorRole:scope.ownerAccess?"OWNER":"TERMINAL_USER",message:input.message,evidence:input.evidence,sequence:row.version+1,createdAt:now});await tx.insert(merchantDisputeCommands).values({commandId:input.commandId,disputeId,actorId:personId,kind:"RESPOND",digest:command.digest,createdAt:now});return project(tx,saved!,true,false,true);
 });}
export async function getOperatorDisputes(personId:string){return getDb().transaction(async tx=>{
 const assignments=await tx.select().from(operatorServiceAccess).where(and(eq(operatorServiceAccess.personId,personId),eq(operatorServiceAccess.state,"ACCEPTED"),eq(operatorServiceAccess.canResolveDisputes,true)));const ids:string[]=[];for(const assignment of assignments){try{await operatorScope(tx,personId,assignment.serviceId);ids.push(assignment.serviceId);}catch(error){if(!(error instanceof SecurityError&&error.status===404))throw error;}}
 if(!ids.length)throw unavailable();const rows=await tx.select().from(merchantDisputes).where(inArray(merchantDisputes.serviceId,ids)).orderBy(desc(merchantDisputes.updatedAt),merchantDisputes.id);return Promise.all(rows.map(row=>project(tx,row,false,true,false)));
 },{isolationLevel:"repeatable read"});}
export async function resolveMerchantDispute(personId:string,disputeId:string,raw:ReviewDisputeInput){disputeId=id(disputeId);const input=parse(reviewDisputeSchema,raw);return getDb().transaction(async tx=>{
 const [hint]=await tx.select().from(merchantDisputes).where(eq(merchantDisputes.id,disputeId));if(!hint)throw unavailable();const scope=await operatorScope(tx,personId,hint.serviceId,true);if(!evaluate(scope,"disputes.operator.resolve").allowed)throw new SecurityError("ACTION_DENIED",403);
 const [row]=await tx.select().from(merchantDisputes).where(eq(merchantDisputes.id,disputeId)).for("update");if(!row)throw unavailable();const command=await receipt(tx,personId,"REVIEW",disputeId,input);if(command.old)return project(tx,row,false,true);if(row.version!==input.expectedVersion)throw new SecurityError("STALE_VERSION",409);if(row.status==="RESOLVED")throw new SecurityError("DISPUTE_CLOSED",409);
 const more=input.outcome==="MORE_INFORMATION",now=await merchantNow(tx);const [saved]=await tx.update(merchantDisputes).set({status:more?"NEEDS_RESPONSE":"RESOLVED",resolution:more?null:input.outcome as "CLOSED_NO_REFUND"|"REFUND_RECOMMENDED",version:row.version+1,updatedAt:now}).where(eq(merchantDisputes.id,disputeId)).returning();await tx.insert(merchantDisputeMessages).values({id:randomUUID(),disputeId,actorId:personId,kind:more?"MORE_INFORMATION":"RESOLVED",authorRole:"OPERATOR",message:input.message,evidence:"",sequence:row.version+1,createdAt:now});await tx.insert(merchantDisputeCommands).values({commandId:input.commandId,disputeId,actorId:personId,kind:"REVIEW",digest:command.digest,createdAt:now});return project(tx,saved!,false,true);
 });}
