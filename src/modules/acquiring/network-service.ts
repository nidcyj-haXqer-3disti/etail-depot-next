import {createHash} from "node:crypto";
import {and,eq,sql} from "drizzle-orm";
import {z} from "zod";
import {getDb} from "../../platform/database/client";
import {SecurityError} from "../../platform/security/origin";
import type {ScopedTransaction} from "../access/scope";
import {evaluate} from "../policy/evaluate";
import {loadTerminalScope} from "../access/merchant-scope";
import {merchantNow} from "../access/merchant-scope";
import {lockMoneyAccountsForServices} from "../money/service";
import {postJournal} from "../ledger/service";
import {formatMoney} from "../workspace/service";
import {guestPublications} from "./guest-schema";
import {consumeGuestBudget,publicationContext,requireGuestSession} from "./guest-service";
import {merchantTestPayments,merchantTestRefunds} from "./operations-schema";
import {recordMerchantNetworkPayment,recordMerchantNetworkRefund,getMerchantOperations} from "./operations-service";
import {networkPaymentOperations,networkRefundOperations,networkEvents,networkEventEffects} from "./network-schema";
import {sandboxNetworkAdapter} from "./adapters/network-sandbox";
import {startNetworkCheckoutSchema,type StartNetworkCheckout,type PaymentBinding,type RefundBinding,type AcquiringAdapter,type NetworkEvent} from "./network-contracts";
import type {NetworkCheckoutProjection} from "../../shared/network-checkout-response";
type Payment=typeof networkPaymentOperations.$inferSelect;
type Refund=typeof networkRefundOperations.$inferSelect;
const digest=(v:unknown)=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const uuid=(v:string)=>{if(!z.uuid().safeParse(v).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return v.toLowerCase();};
export const networkCapabilities=()=>sandboxNetworkAdapter.capabilities();
export function paymentBinding(row:Payment):PaymentBinding{return {kind:"PAYMENT",operationId:row.id,provider:"ETAIL_SANDBOX_NETWORK",mode:"SANDBOX",providerAccount:row.providerAccount,serviceId:row.serviceId,terminalId:row.terminalId,amountMinor:row.amountMinor.toString(),feeMinor:"0",currency:"USD",instrumentId:row.instrumentId,createdAt:row.createdAt.toISOString()};}
export function refundBinding(row:Refund):RefundBinding{return {kind:"REFUND",operationId:row.id,provider:"ETAIL_SANDBOX_NETWORK",mode:"SANDBOX",providerAccount:row.providerAccount,serviceId:row.serviceId,terminalId:row.terminalId,amountMinor:row.amountMinor.toString(),feeMinor:"0",currency:"USD",createdAt:row.createdAt.toISOString(),providerPaymentId:row.providerPaymentId};}
async function locks(tx:ScopedTransaction,serviceId:string){await lockMoneyAccountsForServices(tx,[serviceId]);await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+serviceId},0))`);}
async function ownOperation(tx:ScopedTransaction,cookie:string|null,publicationId:string,operationId:string){const session=await requireGuestSession(tx,cookie);const [row]=await tx.select().from(networkPaymentOperations).where(and(eq(networkPaymentOperations.id,operationId),eq(networkPaymentOperations.publicationId,publicationId),eq(networkPaymentOperations.guestSessionId,session.id)));if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return row;}
async function projection(tx:ScopedTransaction,row:Payment):Promise<NetworkCheckoutProjection>{const [payment]=await tx.select().from(merchantTestPayments).where(eq(merchantTestPayments.networkOperationId,row.id));const [refund]=payment?await tx.select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,payment.id)):[];return {id:row.id,publicationId:row.publicationId,state:refund?"REFUNDED":payment?"PAID":"PROCESSING",merchantName:row.merchantName,businessName:row.businessName,description:row.description,amount:formatMoney(row.amountMinor),fee:formatMoney(row.feeMinor),instrumentId:row.instrumentId,network:networkCapabilities().instruments.find(v=>v.id===row.instrumentId)!.network,createdAt:row.createdAt.toISOString(),receipt:payment?{paymentId:payment.id,reference:payment.testReference,paidAt:payment.createdAt.toISOString(),refundedAt:refund?.createdAt.toISOString()??null,refundReference:refund?.testReference??null}:null};}
/** Read-only: link previews and return-page loads never submit or reconcile a payment. */
export async function getNetworkCheckout(cookie:string|null,publicationId:string,operationId:string){return getDb().transaction(async tx=>projection(tx,await ownOperation(tx,cookie,uuid(publicationId),uuid(operationId))),{isolationLevel:"repeatable read"});}
export async function prepareNetworkPayment(cookie:string|null,publicationId:string,raw:StartNetworkCheckout){publicationId=uuid(publicationId);const parsed=startNetworkCheckoutSchema.safeParse(raw);if(!parsed.success)throw new SecurityError("INVALID_REQUEST",422);const input={...parsed.data,commandId:uuid(parsed.data.commandId)};await consumeGuestBudget([`network-start:${publicationId}`]);
 const row=await getDb().transaction(async tx=>{const session=await requireGuestSession(tx,cookie);const [publication]=await tx.select().from(guestPublications).where(eq(guestPublications.id,publicationId));if(!publication)throw new SecurityError("RESOURCE_UNAVAILABLE",404);await locks(tx,publication.serviceId);await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"network-command:"+input.commandId},0))`);const requestDigest=digest({sessionId:session.id,publicationId,input});const [old]=await tx.select().from(networkPaymentOperations).where(eq(networkPaymentOperations.id,input.commandId));if(old){if(old.requestDigest!==requestDigest||old.guestSessionId!==session.id)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return old;}
 const context=await publicationContext(tx,publication,true);if(!context?.ready)throw new SecurityError("CHANNEL_NOT_READY",409);const quote=sandboxNetworkAdapter.quote(input.instrumentId,publication.amountMinor.toString());const [saved]=await tx.insert(networkPaymentOperations).values({id:input.commandId,guestSessionId:session.id,publicationId,serviceId:publication.serviceId,terminalId:publication.merchantUnitId,channelId:publication.channelId,channelVersion:publication.channelVersion,channelUsage:publication.usage,gatewayVersion:publication.gatewayVersion,enrollmentVersion:publication.enrollmentVersion,provider:sandboxNetworkAdapter.provider,mode:sandboxNetworkAdapter.mode,providerAccount:`sandbox:${publication.serviceId}`,instrumentId:input.instrumentId,amountMinor:publication.amountMinor,feeMinor:BigInt(quote.feeMinor),currency:quote.currency,description:publication.description,merchantName:publication.merchantName,businessName:publication.primaryMerchantName,requestDigest,createdAt:context.now}).returning();return saved!;}).catch(error=>{const pg=error as {code?:string;constraint?:string;cause?:{code?:string;constraint?:string}};const cause=pg.cause??pg;if(cause.code==="23505"&&cause.constraint==="network_one_time_reservation")throw new SecurityError("CHANNEL_ALREADY_USED",409);throw error;});
 return row;
}
export async function startNetworkCheckout(cookie:string|null,publicationId:string,raw:StartNetworkCheckout){
 const row=await prepareNetworkPayment(cookie,publicationId,raw);
 // Dispatch only after the durable instruction commits. A retry dispatches the same provider operation.
 await reconcileNetworkEvent(await sandboxNetworkAdapter.createPayment(paymentBinding(row)),paymentBinding(row));return getNetworkCheckout(cookie,publicationId,row.id);
}
export async function processNetworkCheckout(cookie:string|null,publicationId:string,operationId:string){const row=await getDb().transaction(tx=>ownOperation(tx,cookie,uuid(publicationId),uuid(operationId)));await consumeGuestBudget([`network-process:${row.id}`]);await completeNetworkPayment(row);return getNetworkCheckout(cookie,publicationId,operationId);}
/** Adapter-only entry: signature and every immutable binding field are verified before storing an event. */
export async function reconcileNetworkEvent(envelope:unknown,binding:PaymentBinding|RefundBinding,adapter:AcquiringAdapter=sandboxNetworkAdapter){const event=adapter.verifyEvent(envelope,binding);return getDb().transaction(async tx=>{
 await locks(tx,event.serviceId);const [payment]=event.kind==="PAYMENT"?await tx.select().from(networkPaymentOperations).where(eq(networkPaymentOperations.id,event.operationId)):[];const [refund]=event.kind==="REFUND"?await tx.select().from(networkRefundOperations).where(eq(networkRefundOperations.id,event.operationId)):[];const actual=payment?paymentBinding(payment):refund?refundBinding(refund):null;if(!actual||digest(actual)!==digest(binding))throw new SecurityError("PROVIDER_BINDING_MISMATCH",422);
 const [old]=await tx.select().from(networkEvents).where(eq(networkEvents.id,event.eventId));if(old&&old.digest!==digest(event))throw new SecurityError("PROVIDER_EVENT_CONFLICT",409);if(!old)await tx.insert(networkEvents).values({id:event.eventId,operationId:event.operationId,kind:event.kind,type:event.type,payload:event,digest:digest(event),receivedAt:await merchantNow(tx)});
 // Always replay dependencies in business order, so an early availability notification is durable but inert.
 const events=await tx.select().from(networkEvents).where(eq(networkEvents.operationId,event.operationId));
 for(const type of (payment?["CAPTURED","FUNDS_AVAILABLE"]:["REFUND_SUCCEEDED","REFUND_FAILED"]) as NetworkEvent["type"][]){const item=events.find(v=>v.type===type);if(!item)continue;const [done]=await tx.select().from(networkEventEffects).where(eq(networkEventEffects.eventId,item.id));if(done)continue;
  if(type==="FUNDS_AVAILABLE"){const capture=events.find(v=>v.type==="CAPTURED");const [captured]=capture?await tx.select().from(networkEventEffects).where(eq(networkEventEffects.eventId,capture.id)):[];if(!captured)continue;}
  const now=await merchantNow(tx);let journalId:string;
  if(payment&&type==="CAPTURED")journalId=await postJournal(tx,{businessKey:`network-capture:${payment.id}`,kind:"NETWORK_CAPTURE",referenceId:payment.id,occurredAt:now,lines:[{serviceId:payment.serviceId,merchantUnitId:payment.terminalId,bucket:"GATEWAY_CLEARING",deltaMinor:-payment.amountMinor},{serviceId:payment.serviceId,merchantUnitId:payment.terminalId,bucket:"MERCHANT_CAPTURE_PENDING",deltaMinor:payment.amountMinor}]});
  else if(payment)journalId=await recordMerchantNetworkPayment(tx,payment,now);
  else journalId=await recordMerchantNetworkRefund(tx,refund!,type==="REFUND_SUCCEEDED",now);
  await tx.insert(networkEventEffects).values({eventId:item.id,journalId,createdAt:now});
 }
 });}
/** The owner command reserves funds before dispatch. Retry calls the same original-provider refund. */
export async function dispatchNetworkRefund(operationId:string){const [row]=await getDb().select().from(networkRefundOperations).where(eq(networkRefundOperations.id,operationId));if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);const [finished]=await getDb().select().from(networkEvents).innerJoin(networkEventEffects,eq(networkEventEffects.eventId,networkEvents.id)).where(eq(networkEvents.operationId,row.id));if(finished)return;const binding=refundBinding(row);await reconcileNetworkEvent(await sandboxNetworkAdapter.refund(binding),binding);}

async function completeNetworkPayment(row:Payment){const binding=paymentBinding(row);await reconcileNetworkEvent(await sandboxNetworkAdapter.createPayment(binding),binding);await reconcileNetworkEvent(await sandboxNetworkAdapter.retrievePayment(binding),binding);}
/** Terminal access may check an existing payment, never choose its result or move its funds. */
export async function processMerchantNetworkCheckout(personId:string,terminalId:string,operationId:string){terminalId=uuid(terminalId);operationId=uuid(operationId);const row=await getDb().transaction(async tx=>{const scope=await loadTerminalScope(tx,personId,terminalId,false,{read:true});if(!evaluate(scope.policy,"payments.read").allowed)throw new SecurityError("ACTION_DENIED",403);const [operation]=await tx.select().from(networkPaymentOperations).where(and(eq(networkPaymentOperations.id,operationId),eq(networkPaymentOperations.terminalId,terminalId),eq(networkPaymentOperations.serviceId,scope.merchantService.id)));if(!operation)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return operation;});await completeNetworkPayment(row);return getMerchantOperations(personId,terminalId);}
