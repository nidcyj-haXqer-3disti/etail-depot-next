import { createHash, randomUUID } from "node:crypto";
import { and, asc, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../platform/database/client";
import { serviceActivity, cards } from "../../platform/database/schema";
import { requireSandboxParticipant } from "../sandbox/service";
import { SecurityError } from "../../platform/security/origin";
import { loadServiceScope, type ScopedTransaction } from "../access/scope";
import { loadTerminalScope } from "../access/merchant-scope";
import { evaluate } from "../policy/evaluate";
import { canReadCardholderActivity } from "../workspace/service";
import { supportCases, supportCaseMessages, supportCaseCommands } from "./schema";
import { readSupportPayment } from "./payment-context";
import { createSupportCaseSchema, createMerchantSupportCaseSchema, addSupportMessageSchema, withdrawSupportCaseSchema, supportCaseQuerySchema, type CreateSupportCaseCommand, type CreateMerchantSupportCaseCommand, type AddSupportMessageCommand, type WithdrawSupportCaseCommand, type SupportCaseQuery, type SupportCaseSummary, type SupportCaseDetail, type SupportCaseList } from "./contracts";

type Target={kind:"CARDHOLDER";serviceId:string}|{kind:"MERCHANT";merchantId:string};
type Scope={serviceId:string;target:Target;canRead:boolean;canManage:boolean;cardholder:Awaited<ReturnType<typeof loadServiceScope>>|null;merchant:Awaited<ReturnType<typeof loadTerminalScope>>|null};
type CaseRow=typeof supportCases.$inferSelect;
async function supportScope(tx:ScopedTransaction,personId:string,target:Target,write=false):Promise<Scope> {
  try {await requireSandboxParticipant(tx,personId);}catch(error){if(error instanceof SecurityError)throw new SecurityError("SUPPORT_UNAVAILABLE",404);throw error;}
  if(target.kind==="MERCHANT") {
    const merchant=await loadTerminalScope(tx,personId,target.merchantId,write,{read:true});
    const allowed=evaluate(merchant.policy,"merchant.read").allowed;
    return {serviceId:merchant.merchantService.id,target,merchant,cardholder:null,canRead:allowed,canManage:allowed};
  }
  const cardholder=await loadServiceScope(tx,personId,target.serviceId,write);
  if(cardholder.service.kind!=="CARDHOLDER")throw new SecurityError("SUPPORT_UNAVAILABLE",404);
  return {serviceId:target.serviceId,target,cardholder,merchant:null,canRead:evaluate(cardholder.policy,"support.cases.read").allowed,canManage:evaluate(cardholder.policy,"support.cases.manage").allowed};
}
function validate<T>(schema:z.ZodType<T>,input:unknown):T {const result=schema.safeParse(input);if(!result.success)throw new SecurityError("INVALID_REQUEST",422);return result.data;}
function requireAction(scope:Scope,write=false){if(!(write?scope.canManage:scope.canRead))throw new SecurityError("ACTION_DENIED",403);}
const ownerWhere=(personId:string,scope:Scope)=>and(eq(supportCases.serviceId,scope.serviceId),eq(supportCases.creatorId,personId),eq(supportCases.serviceKind,scope.target.kind),scope.target.kind==="MERCHANT"?eq(supportCases.merchantUnitId,scope.target.merchantId):isNull(supportCases.merchantUnitId));
function summary(row:CaseRow,scope:Scope,lastAuthor?:string):SupportCaseSummary {return {id:row.id,serviceId:row.serviceId,reference:row.reference,topic:row.topic,subject:row.subject,status:row.status,version:row.version,createdAt:row.createdAt.toISOString(),updatedAt:row.updatedAt.toISOString(),canUpdate:row.status==="OPEN"&&scope.canManage,nextActor:row.status!=="OPEN"?"NONE":lastAuthor==="SUPPORT"?"CUSTOMER":"SUPPORT",delivery:"SANDBOX_SUPPORT",privacy:"CUSTOMER_AND_ASSIGNED_SUPPORT"};}
async function ownedCase(tx:ScopedTransaction,personId:string,scope:Scope,id:string,write=false) {
  if(!z.uuid().safeParse(id).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const query=tx.select().from(supportCases).where(and(ownerWhere(personId,scope),eq(supportCases.id,id)));
  const [row]=write?await query.for("update"):await query;
  if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return row;
}
async function detail(tx:ScopedTransaction,scope:Scope,row:CaseRow):Promise<SupportCaseDetail> {
  const messages=await tx.select().from(supportCaseMessages).where(and(eq(supportCaseMessages.caseId,row.id),eq(supportCaseMessages.creatorId,row.creatorId),eq(supportCaseMessages.serviceId,row.serviceId))).orderBy(asc(supportCaseMessages.sequence));
  let transaction:SupportCaseDetail["transaction"]=null;
  if(row.transactionId&&scope.cardholder&&evaluate(scope.cardholder.policy,"activity.read").allowed) {
    const [activity]=await tx.select({id:serviceActivity.id,title:serviceActivity.title,cardId:serviceActivity.cardId,holderId:cards.holderId,assignmentState:cards.assignmentState}).from(serviceActivity).leftJoin(cards,and(eq(cards.id,serviceActivity.cardId),eq(cards.serviceId,serviceActivity.serviceId))).where(and(eq(serviceActivity.id,row.transactionId),eq(serviceActivity.serviceId,row.serviceId)));
    if(activity&&canReadCardholderActivity(scope.cardholder.policy,activity))transaction={id:activity.id,title:activity.title};
  }
  const payment=row.paymentId&&row.merchantUnitId&&scope.merchant&&evaluate(scope.merchant.policy,"payments.read").allowed?await readSupportPayment(tx,row.paymentId,row.merchantUnitId,row.serviceId):null;
  return {...summary(row,scope,messages.at(-1)?.authorKind),transaction,transactionUnavailable:Boolean(row.transactionId&&!transaction),payment,paymentUnavailable:Boolean(row.paymentId&&!payment),messages:messages.map(item=>({id:item.id,kind:item.kind,body:item.body,sequence:item.sequence,createdAt:item.createdAt.toISOString(),author:item.authorKind==="SUPPORT"?"SUPPORT":"YOU"}))};
}
async function listCases(personId:string,target:Target,raw:SupportCaseQuery):Promise<SupportCaseList> {
  const query=validate(supportCaseQuerySchema,raw);
  return getDb().transaction(async tx=>{
    const scope=await supportScope(tx,personId,target);requireAction(scope);
    if(query.cursor)await ownedCase(tx,personId,scope,query.cursor);
    const needle=`%${query.q.replace(/[\\%_]/g,"\\$&")}%`;
    const rows=await tx.select().from(supportCases).where(and(ownerWhere(personId,scope),query.status?eq(supportCases.status,query.status):undefined,query.q?or(ilike(supportCases.subject,needle),ilike(supportCases.reference,needle)):undefined,
      query.cursor?sql`(${supportCases.createdAt},${supportCases.id}) < (select "createdAt", id from support_cases where id=${query.cursor})`:undefined)).orderBy(desc(supportCases.createdAt),desc(supportCases.id)).limit(26);
    const page=rows.slice(0,25);
    const lastMessages=page.length?await tx.selectDistinctOn([supportCaseMessages.caseId],{caseId:supportCaseMessages.caseId,author:supportCaseMessages.authorKind}).from(supportCaseMessages).where(and(inArray(supportCaseMessages.caseId,page.map(row=>row.id)),eq(supportCaseMessages.creatorId,personId),eq(supportCaseMessages.serviceId,scope.serviceId))).orderBy(supportCaseMessages.caseId,desc(supportCaseMessages.sequence)):[];
    return {cases:page.map(row=>summary(row,scope,lastMessages.find(message=>message.caseId===row.id)?.author)),nextCursor:rows.length>25?page.at(-1)!.id:null,canCreate:scope.canManage};
  },{isolationLevel:"repeatable read"});
}
async function getCase(personId:string,target:Target,id:string):Promise<SupportCaseDetail> {
  return getDb().transaction(async tx=>{const scope=await supportScope(tx,personId,target);requireAction(scope);return detail(tx,scope,await ownedCase(tx,personId,scope,id));},{isolationLevel:"repeatable read"});
}
async function execute<T extends {commandId:string}>(personId:string,target:Target,kind:string,targetId:string|null,input:T,mutate:(tx:ScopedTransaction,scope:Scope)=>Promise<CaseRow>):Promise<SupportCaseDetail> {
  return getDb().transaction(async tx=>{
    const scope=await supportScope(tx,personId,target,true);requireAction(scope,true);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"support-command:"+input.commandId},0))`);
    // Preserve existing Cardholder receipt digests; Merchant commands also bind the exact unit.
    const digest=createHash("sha256").update(JSON.stringify({kind,targetId,input,...(target.kind==="MERCHANT"?{merchantId:target.merchantId}:{})})).digest("hex");
    const [receipt]=await tx.select().from(supportCaseCommands).where(eq(supportCaseCommands.commandId,input.commandId));
    if(receipt) {
      if(receipt.serviceId!==scope.serviceId||receipt.creatorId!==personId||receipt.kind!==kind||receipt.digest!==digest)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
      return detail(tx,scope,await ownedCase(tx,personId,scope,receipt.caseId));
    }
    const row=await mutate(tx,scope);
    await tx.insert(supportCaseCommands).values({commandId:input.commandId,caseId:row.id,serviceId:scope.serviceId,creatorId:personId,kind,digest});
    return detail(tx,scope,row);
  });
}
async function createCase(personId:string,target:Target,input:CreateSupportCaseCommand|CreateMerchantSupportCaseCommand) {
  return execute(personId,target,"create",null,input,async(tx,scope)=>{
    const transactionId="transactionId" in input?input.transactionId:null,paymentId="paymentId" in input?input.paymentId:null;
    if(transactionId) {
      if(!scope.cardholder||!evaluate(scope.cardholder.policy,"activity.read").allowed)throw new SecurityError("ACTION_DENIED",403);
      const [transaction]=await tx.select({id:serviceActivity.id,cardId:serviceActivity.cardId,holderId:cards.holderId,assignmentState:cards.assignmentState}).from(serviceActivity).leftJoin(cards,and(eq(cards.id,serviceActivity.cardId),eq(cards.serviceId,serviceActivity.serviceId))).where(and(eq(serviceActivity.id,transactionId),eq(serviceActivity.serviceId,scope.serviceId))).for("share",{of:serviceActivity});
      if(!transaction||!canReadCardholderActivity(scope.cardholder.policy,transaction))throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    }
    if(paymentId) {
      if(!scope.merchant||!evaluate(scope.merchant.policy,"payments.read").allowed)throw new SecurityError("ACTION_DENIED",403);
      if(!await readSupportPayment(tx,paymentId,scope.merchant.terminal.id,scope.serviceId))throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    }
    const id=randomUUID();
    const [row]=await tx.insert(supportCases).values({id,serviceId:scope.serviceId,serviceKind:target.kind,creatorId:personId,transactionId,paymentId,merchantUnitId:target.kind==="MERCHANT"?target.merchantId:null,topic:input.topic,subject:input.subject,reference:`CASE-${id.toUpperCase()}`}).returning();
    await tx.insert(supportCaseMessages).values({caseId:id,serviceId:scope.serviceId,creatorId:personId,authorId:personId,authorKind:"CUSTOMER",kind:"OPENED",body:input.message,sequence:1});
    return row!;
  });
}
async function updateCase(personId:string,target:Target,id:string,input:AddSupportMessageCommand|WithdrawSupportCaseCommand,withdraw:boolean) {
  return execute(personId,target,withdraw?"withdraw":"message",id,input,async(tx,scope)=>{
    const row=await ownedCase(tx,personId,scope,id,true);
    if(row.version!==input.expectedVersion)throw new SecurityError("STALE_VERSION",409);
    if(row.status!=="OPEN")throw new SecurityError("INVALID_STATE",422);
    if(!withdraw&&row.version>=100)throw new SecurityError("MESSAGE_LIMIT_REACHED",422);
    const [updated]=await tx.update(supportCases).set({status:withdraw?"WITHDRAWN":"OPEN",version:row.version+1,updatedAt:sql`clock_timestamp()`}).where(eq(supportCases.id,id)).returning();
    await tx.insert(supportCaseMessages).values({caseId:id,serviceId:scope.serviceId,creatorId:personId,authorId:personId,authorKind:"CUSTOMER",kind:withdraw?"WITHDRAWN":"MESSAGE",body:"reason" in input?input.reason:input.message,sequence:updated!.version});
    return updated!;
  });
}
export const listSupportCases=(personId:string,serviceId:string,query:SupportCaseQuery)=>listCases(personId,{kind:"CARDHOLDER",serviceId},query);
export const getSupportCase=(personId:string,serviceId:string,id:string)=>getCase(personId,{kind:"CARDHOLDER",serviceId},id);
export const createSupportCase=(personId:string,serviceId:string,raw:CreateSupportCaseCommand)=>createCase(personId,{kind:"CARDHOLDER",serviceId},validate(createSupportCaseSchema,raw));
export const addSupportMessage=(personId:string,serviceId:string,id:string,raw:AddSupportMessageCommand)=>updateCase(personId,{kind:"CARDHOLDER",serviceId},id,validate(addSupportMessageSchema,raw),false);
export const withdrawSupportCase=(personId:string,serviceId:string,id:string,raw:WithdrawSupportCaseCommand)=>updateCase(personId,{kind:"CARDHOLDER",serviceId},id,validate(withdrawSupportCaseSchema,raw),true);
export const listMerchantSupportCases=(personId:string,merchantId:string,query:SupportCaseQuery)=>listCases(personId,{kind:"MERCHANT",merchantId},query);
export const getMerchantSupportCase=(personId:string,merchantId:string,id:string)=>getCase(personId,{kind:"MERCHANT",merchantId},id);
export const createMerchantSupportCase=(personId:string,merchantId:string,raw:CreateMerchantSupportCaseCommand)=>createCase(personId,{kind:"MERCHANT",merchantId},validate(createMerchantSupportCaseSchema,raw));
export const addMerchantSupportMessage=(personId:string,merchantId:string,id:string,raw:AddSupportMessageCommand)=>updateCase(personId,{kind:"MERCHANT",merchantId},id,validate(addSupportMessageSchema,raw),false);
export const withdrawMerchantSupportCase=(personId:string,merchantId:string,id:string,raw:WithdrawSupportCaseCommand)=>updateCase(personId,{kind:"MERCHANT",merchantId},id,validate(withdrawSupportCaseSchema,raw),true);

export async function getMerchantSupportPaymentPreview(personId:string,merchantId:string,paymentId:string) {
  return getDb().transaction(async tx=>{
    const scope=await supportScope(tx,personId,{kind:"MERCHANT",merchantId});
    requireAction(scope);
    if(!scope.merchant||!evaluate(scope.merchant.policy,"payments.read").allowed)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    const payment=await readSupportPayment(tx,paymentId,merchantId,scope.serviceId);
    if(!payment)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    return payment;
  },{isolationLevel:"repeatable read"});
}
