import {getServiceMoneyAccount,lockMoneyAccountsForServices,moneyPosition,readServiceMoneyAvailable} from "../money/service";
import { createHash, randomUUID } from "node:crypto";
import { and, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import {serviceActivity} from "../../platform/database/schema";
import {merchantSettlements,merchantSettlementItems,merchantDeposits,merchantDepositEvents,merchantDepositItems,merchantSettlementCredits} from "./settlement-schema";
import {operatorServiceAccess} from "../operations/schema";
import {services} from "../../platform/database/schema";
import {cardCheckoutAttempts} from "./card-checkout-schema";
import { getDb } from "../../platform/database/client";
import { SecurityError } from "../../platform/security/origin";
import { loadServiceScope, type ScopedTransaction } from "../access/scope";
import { loadTerminalScope, merchantNow } from "../access/merchant-scope";
import { requireMerchantApplicant } from "../services/merchant-eligibility";
import { evaluate } from "../policy/evaluate";
import { getBalance, postJournal } from "../ledger/service";
import { formatMoney } from "../workspace/service";
import { merchantProfiles, merchantTerminals, paymentChannels } from "./schema";
import { channelActivations, merchantOperationCommands, merchantTestPayments, merchantTestRefunds, testGateways, testMerchantEnrollments } from "./operations-schema";
import {networkPaymentOperations,networkRefundOperations,networkEvents,networkEventEffects} from "./network-schema";
import { testPayment, testRefund } from "./adapters/sandbox";
import {sandboxNetworkAdapter} from "./adapters/network-sandbox";
import { channelActivationSchema, configureTestGatewaySchema, enrollTestMerchantSchema, refundMerchantPaymentSchema,
  merchantSettlementSchema,type MerchantSettlementInput,type MerchantSettlementReceipt,
  type MerchantPaymentSettings,type ChannelActivation, type ChannelActivationInput, type ConfigureTestGatewayInput, type EnrollTestMerchantInput, type MerchantOperationsProjection, type MerchantTestPayment, type MerchantTestPayout, type RefundMerchantPaymentInput, type TestGateway, type TestMerchantEnrollment } from "./operations-contracts";

type UnitScope=Awaited<ReturnType<typeof loadTerminalScope>>;
type ServiceScope=Awaited<ReturnType<typeof loadServiceScope>>;
type Channel=typeof paymentChannels.$inferSelect;
type Payment=typeof merchantTestPayments.$inferSelect;
type Refund=typeof merchantTestRefunds.$inferSelect;

type Kind=typeof merchantOperationCommands.$inferSelect.kind;
function parse<T>(schema:z.ZodType<T>,raw:unknown):T {const r=schema.safeParse(raw);if(!r.success)throw new SecurityError("INVALID_REQUEST",422);return r.data;}
function uuid(value:string):string {if(!z.uuid().safeParse(value).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return value.toLowerCase();}
function requireAction(scope:UnitScope|ServiceScope,action:string) {if(!evaluate(scope.policy,action).allowed)throw new SecurityError("ACTION_DENIED",403);}
async function adult(tx:ScopedTransaction,personId:string) {try {await requireMerchantApplicant(tx,personId);return true;}catch(error){if(error instanceof SecurityError&&["MERCHANT_APPLICANT_REQUIRED","SANDBOX_START_REQUIRED","SERVICE_UNAVAILABLE"].includes(error.code))return false;throw error;}}
async function responsible(tx:ScopedTransaction,personId:string,serviceId:string,forWrite=false) {
  const scope=await loadServiceScope(tx,personId,serviceId,forWrite);
  if(scope.service.kind!=="MERCHANT"||scope.service.primaryPersonId!==personId)throw new SecurityError("ACTION_DENIED",403);
  return scope;
}
async function management(tx:ScopedTransaction,personId:string,serviceId:string,forWrite=false) {const scope=await responsible(tx,personId,serviceId,forWrite);requireAction(scope,"gateway.manage");await requireMerchantApplicant(tx,personId);return scope;}
async function canManage(tx:ScopedTransaction,personId:string,serviceId:string) {try {await management(tx,personId,serviceId);return true;}catch(error){if(error instanceof SecurityError&&[403,404].includes(error.status))return false;throw error;}}
async function begin(tx:ScopedTransaction,personId:string,scopeKey:string,kind:Kind,input:{commandId:string}) {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"merchant-operation:"+input.commandId.toLowerCase()},0))`);
  const digest=createHash("sha256").update(JSON.stringify({scopeKey,kind,input:{...input,commandId:input.commandId.toLowerCase()}})).digest("hex");
  const [old]=await tx.select().from(merchantOperationCommands).where(eq(merchantOperationCommands.commandId,input.commandId));
  if(old&&(old.actorId!==personId||old.scopeKey!==scopeKey||old.kind!==kind||old.digest!==digest))throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
  return {old,digest};
}
async function finish(tx:ScopedTransaction,personId:string,scopeKey:string,kind:Kind,input:{commandId:string},digest:string,resultId:string) {await tx.insert(merchantOperationCommands).values({commandId:input.commandId.toLowerCase(),actorId:personId,scopeKey,kind,digest,resultId});}
function checkVersion(actual:number,expected:number) {if(actual!==expected)throw new SecurityError("STALE_VERSION",409);}
async function configuration(tx:ScopedTransaction,scope:UnitScope) {
  const [gateway]=await tx.select().from(testGateways).where(eq(testGateways.serviceId,scope.merchantService.id));
  const [enrollment]=await tx.select().from(testMerchantEnrollments).where(and(eq(testMerchantEnrollments.merchantUnitId,scope.terminal.id),eq(testMerchantEnrollments.serviceId,scope.merchantService.id)));
  return {gateway,enrollment,ready:gateway?.mode==="TEST_READY"&&enrollment?.status==="ENROLLED"};
}
function gatewayProjection(serviceId:string,row?:typeof testGateways.$inferSelect):TestGateway {return {serviceId,mode:row?.mode??"NOT_CONFIGURED",processor:"ETAIL_TEST",version:row?.version??0,liveEnabled:false,updatedAt:row?.updatedAt.toISOString()??null};}
function enrollmentProjection(scope:UnitScope,row?:typeof testMerchantEnrollments.$inferSelect):TestMerchantEnrollment {return {merchantUnitId:scope.terminal.id,serviceId:scope.merchantService.id,status:row?.status??"NOT_ENROLLED",version:row?.version??0,updatedAt:row?.updatedAt.toISOString()??null};}
async function channel(tx:ScopedTransaction,scope:UnitScope,personId:string,channelId:string,forWrite=false) {
  uuid(channelId);requireAction(scope,"channels.read");
  const query=tx.select().from(paymentChannels).where(and(eq(paymentChannels.id,channelId),eq(paymentChannels.merchantUnitId,scope.terminal.id),eq(paymentChannels.serviceId,scope.merchantService.id)));
  const [row]=forWrite?await query.for("update"):await query;
  if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  return row;
}
async function activationProjection(tx:ScopedTransaction,scope:UnitScope,row:Channel,eligible:boolean,ready:boolean,now:Date):Promise<ChannelActivation> {
  const [activation]=await tx.select().from(channelActivations).where(eq(channelActivations.channelId,row.id));
  const [used]=row.usage==="ONE_TIME"?await tx.select({id:merchantTestPayments.id}).from(merchantTestPayments).where(and(eq(merchantTestPayments.channelId,row.id),eq(merchantTestPayments.outcome,"APPROVED"))).limit(1):[];
  const state:ChannelActivation["state"]=row.status==="CANCELED"?"DISABLED":used?"USED":row.expiresAt<=now?"EXPIRED":!ready?"NOT_READY":activation?.status==="ACTIVE"?"ACTIVE":"DISABLED";
  const editable=eligible&&evaluate(scope.policy,"channels.update").allowed;
  return {channelId:row.id,merchantUnitId:row.merchantUnitId,version:activation?.version??0,state,canActivate:editable&&ready&&row.status==="DRAFT"&&!used&&row.expiresAt>now&&activation?.status!=="ACTIVE",canDisable:editable&&activation?.status==="ACTIVE"};
}
function paymentProjection(row:Payment,refund:Refund|undefined,canRefund:boolean):MerchantTestPayment {return {id:row.id,merchantUnitId:row.merchantUnitId,channelId:row.channelId,description:row.description,source:row.source??"HISTORICAL",paymentMethod:row.source==="ETAIL_CARD"?"Etail Depot card":row.source==="NETWORK"?"Card":"Saved payment",amount:formatMoney(row.amountMinor),status:refund?"REFUNDED":row.outcome,version:refund?2:1,testReference:row.testReference,createdAt:row.createdAt.toISOString(),feeStatus:"NOT_APPLIED",canRefund:canRefund&&row.outcome==="APPROVED"&&!refund,refundSource:canRefund&&row.outcome==="APPROVED"&&!refund?"COLLECTION_BALANCE":null,refundUnavailableReason:null,refund:refund?{id:refund.id,amount:formatMoney(refund.amountMinor),reason:refund.reason,testReference:refund.testReference,createdAt:refund.createdAt.toISOString()}:null};}
async function batchReview(tx:ScopedTransaction,settlementId:string){
 const items=await tx.select({item:merchantSettlementItems,refund:merchantTestRefunds}).from(merchantSettlementItems).leftJoin(merchantTestRefunds,eq(merchantTestRefunds.paymentId,merchantSettlementItems.paymentId)).where(eq(merchantSettlementItems.settlementId,settlementId)).orderBy(merchantSettlementItems.paymentId);
 const history=await tx.select({deposit:merchantDeposits,event:merchantDepositEvents}).from(merchantDeposits).leftJoin(merchantDepositEvents,eq(merchantDepositEvents.depositId,merchantDeposits.id)).where(eq(merchantDeposits.settlementId,settlementId)).orderBy(merchantDeposits.id);
 const [credit]=await tx.select({id:merchantSettlementCredits.id}).from(merchantSettlementCredits).where(eq(merchantSettlementCredits.settlementId,settlementId));
 const available=items.filter(row=>!row.refund),amountMinor=available.reduce((sum,row)=>sum+row.item.amountMinor,0n);
 const token=createHash("sha256").update(JSON.stringify({settlementId,items:items.map(({item,refund})=>({paymentId:item.paymentId,amount:item.amountMinor.toString(),refundId:refund?.id??null})),history:history.map(({deposit,event})=>({depositId:deposit.id,outcome:event?.outcome??"PENDING",commandId:event?.commandId??null}))})).digest("hex");
 return {items:available.map(({item})=>({paymentId:item.paymentId,amountMinor:item.amountMinor})),amountMinor,token,canRetry:!credit&&history.length>0&&history.every(row=>row.event?.outcome==="FAILED")&&amountMinor>0n};
}
async function refundPosition(tx:ScopedTransaction,paymentId:string){
 const [item]=await tx.select().from(merchantSettlementItems).where(eq(merchantSettlementItems.paymentId,paymentId));
 if(!item)return "MERCHANT_AVAILABLE" as const;
 const [settlement]=await tx.select().from(merchantSettlements).where(eq(merchantSettlements.id,item.settlementId));
 const [credit]=await tx.select().from(merchantSettlementCredits).where(eq(merchantSettlementCredits.settlementId,item.settlementId));
 if(settlement?.moneyAccountId||credit)return "MONEY_AVAILABLE" as const;
 const deposits=await tx.select({event:merchantDepositEvents}).from(merchantDeposits).leftJoin(merchantDepositEvents,eq(merchantDepositEvents.depositId,merchantDeposits.id)).where(eq(merchantDeposits.settlementId,item.settlementId));
 if(deposits.some(row=>!row.event))return null;
 return deposits.some(row=>row.event?.outcome==="COMPLETED")?"MONEY_AVAILABLE" as const:"MERCHANT_SETTLED" as const;
}
async function currentPaymentProjection(tx:ScopedTransaction,row:Payment,refund:Refund|undefined,canRefund:boolean):Promise<MerchantTestPayment>{
 const result=paymentProjection(row,refund,canRefund);
 if(row.networkOperationId){const [operation]=await tx.select().from(networkPaymentOperations).where(eq(networkPaymentOperations.id,row.networkOperationId));result.paymentMethod=operation?({visa:"Visa",mastercard:"Mastercard",amex:"American Express",discover:"Discover"}[operation.instrumentId]):"Card";const [pending]=await tx.select({id:networkRefundOperations.id}).from(networkRefundOperations).leftJoin(networkEvents,and(eq(networkEvents.operationId,networkRefundOperations.id),sql`${networkEvents.type} in ('REFUND_SUCCEEDED','REFUND_FAILED')`)).where(and(eq(networkRefundOperations.paymentOperationId,row.networkOperationId),isNull(networkEvents.id)));if(pending){result.canRefund=false;result.refundSource=null;result.refundUnavailableReason="The refund is processing. Check this payment again for the result.";}}
 if(!result.canRefund)return result;
 const position=await refundPosition(tx,row.id);
 return {...result,canRefund:position!==null,refundSource:position===null?null:position==="MONEY_AVAILABLE"?"GROUP_MONEY":"COLLECTION_BALANCE",refundUnavailableReason:position===null?"This payment is in a deposit that is processing. You can refund it after the deposit completes or is returned.":null};
}
async function payoutProjection(tx:ScopedTransaction,row:typeof merchantDeposits.$inferSelect,allowRetry=false):Promise<MerchantTestPayout>{
 const [event]=await tx.select().from(merchantDepositEvents).where(eq(merchantDepositEvents.depositId,row.id));
 const items=await tx.select({payment:merchantTestPayments,item:merchantDepositItems,refund:merchantTestRefunds}).from(merchantDepositItems).innerJoin(merchantTestPayments,eq(merchantTestPayments.id,merchantDepositItems.paymentId)).leftJoin(merchantTestRefunds,eq(merchantTestRefunds.paymentId,merchantTestPayments.id)).where(eq(merchantDepositItems.depositId,row.id)).orderBy(merchantTestPayments.createdAt,merchantTestPayments.id);
 const retry=allowRetry&&event?.outcome==="FAILED"?await batchReview(tx,row.settlementId):null;
 return {id:row.id,merchantUnitId:row.merchantUnitId,amount:formatMoney(row.amountMinor),status:event?.outcome??"PENDING",testReference:`DEP-${row.id.slice(0,8).toUpperCase()}`,destination:"TEST_DESTINATION",createdAt:row.createdAt.toISOString(),settlementId:row.settlementId,processedAt:event?.createdAt.toISOString()??null,retryReview:retry?.canRetry?{amount:formatMoney(retry.amountMinor),token:retry.token,paymentCount:retry.items.length}:null,payments:items.map(({payment,item,refund})=>({id:payment.id,description:payment.description,reference:payment.testReference,amount:formatMoney(item.amountMinor),refundedAmount:formatMoney(refund?.amountMinor??0n)}))};
}

async function refundAuthority(tx:ScopedTransaction,scope:UnitScope,personId:string) {try {await responsible(tx,personId,scope.merchantService.id);return evaluate(scope.policy,"payments.refund").allowed&&await adult(tx,personId);}catch(error){if(error instanceof SecurityError&&[403,404].includes(error.status))return false;throw error;}}
async function readPayment(tx:ScopedTransaction,scope:UnitScope,paymentId:string) {uuid(paymentId);const [row]=await tx.select().from(merchantTestPayments).where(and(eq(merchantTestPayments.id,paymentId),eq(merchantTestPayments.merchantUnitId,scope.terminal.id),eq(merchantTestPayments.serviceId,scope.merchantService.id)));if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return row;}

export async function getMerchantOperations(personId:string,merchantUnitId:string):Promise<MerchantOperationsProjection> {
  merchantUnitId=uuid(merchantUnitId);
  return getDb().transaction(async tx=>{
    const scope=await loadTerminalScope(tx,personId,merchantUnitId,false,{read:true}),eligible=await adult(tx,personId),config=await configuration(tx,scope),now=await merchantNow(tx);
    const canReadPayments=evaluate(scope.policy,"payments.read").allowed,canConfigureGateway=scope.policy.mode!=="OVERSIGHT"&&await canManage(tx,personId,scope.merchantService.id),canRefund=await refundAuthority(tx,scope,personId);
    let canPayout=false;try {await responsible(tx,personId,scope.merchantService.id);canPayout=eligible&&evaluate(scope.policy,"payouts.manage").allowed;}catch(error){if(!(error instanceof SecurityError&&[403,404].includes(error.status)))throw error;}
    const channels=evaluate(scope.policy,"channels.read").allowed?await tx.select().from(paymentChannels).where(and(eq(paymentChannels.merchantUnitId,merchantUnitId),undefined)).orderBy(desc(paymentChannels.updatedAt),paymentChannels.id):[];
    const payments=canReadPayments?await tx.select().from(merchantTestPayments).where(eq(merchantTestPayments.merchantUnitId,merchantUnitId)).orderBy(desc(merchantTestPayments.createdAt),merchantTestPayments.id):[];
    const refunds=payments.length?await tx.select().from(merchantTestRefunds).where(inArray(merchantTestRefunds.paymentId,payments.map(row=>row.id))):[];
    const payouts=scope.ownerAccess&&canReadPayments?await tx.select().from(merchantDeposits).where(eq(merchantDeposits.merchantUnitId,merchantUnitId)).orderBy(desc(merchantDeposits.createdAt),merchantDeposits.id):[];
    const depositReview=canPayout?await depositCandidates(tx,merchantUnitId,scope.merchantService.id):null;
    const pending=canReadPayments?await tx.select({operation:networkPaymentOperations}).from(networkPaymentOperations).leftJoin(merchantTestPayments,eq(merchantTestPayments.networkOperationId,networkPaymentOperations.id)).where(and(eq(networkPaymentOperations.terminalId,merchantUnitId),isNull(merchantTestPayments.id))):[];
    const processingPayments=pending.map(({operation})=>({id:operation.id,channelId:operation.channelId,description:operation.description,amount:formatMoney(operation.amountMinor),paymentMethod:({visa:"Visa",mastercard:"Mastercard",amex:"American Express",discover:"Discover"}[operation.instrumentId]),createdAt:operation.createdAt.toISOString()}));
    const pendingCardPayments=scope.ownerAccess&&canReadPayments?formatMoney(await getBalance(tx,{serviceId:scope.merchantService.id,merchantUnitId,bucket:"MERCHANT_CAPTURE_PENDING"})):null;
    const projectedChannels:ChannelActivation[]=[];
    for(const row of channels)projectedChannels.push(await activationProjection(tx,scope,row,eligible,config.ready,now));
    const projectedPayments:MerchantTestPayment[]=[];for(const row of payments)projectedPayments.push(await currentPaymentProjection(tx,row,refunds.find(item=>item.paymentId===row.id),canRefund));
    const projectedPayouts:MerchantTestPayout[]=[];for(const row of payouts)projectedPayouts.push(await payoutProjection(tx,row,canPayout));
    return {merchantUnitId,serviceId:scope.merchantService.id,processingPayments,pendingCardPayments,mode:"TEST",liveEnabled:false,feeStatus:"NOT_APPLIED",gateway:gatewayProjection(scope.merchantService.id,config.gateway),enrollment:enrollmentProjection(scope,config.enrollment),channels:projectedChannels,payments:projectedPayments,payouts:projectedPayouts,settlements:scope.ownerAccess?await listSettlementReceipts(tx,merchantUnitId):[],bankFunds:scope.ownerAccess?formatMoney(await readServiceMoneyAvailable(tx,scope.merchantService.id)):null,settledFunds:scope.ownerAccess&&canReadPayments?formatMoney(await getBalance(tx,{serviceId:scope.merchantService.id,merchantUnitId,bucket:"MERCHANT_SETTLED"})):null,pendingDeposits:scope.ownerAccess&&canReadPayments?formatMoney(await getBalance(tx,{serviceId:scope.merchantService.id,merchantUnitId,bucket:"MERCHANT_PAYOUT_PENDING"})):null,availableFunds:scope.ownerAccess&&canReadPayments?formatMoney(await getBalance(tx,{serviceId:scope.merchantService.id,merchantUnitId,bucket:"MERCHANT_AVAILABLE"})):null,canConfigureGateway,canEnroll:canConfigureGateway,canReadPayments,canPayout,depositReview:depositReview&&depositReview.amountMinor>0n?{amount:formatMoney(depositReview.amountMinor),token:depositReview.token,paymentCount:depositReview.payments.length}:null};
  },{isolationLevel:"repeatable read"});
}
async function configureGateway(tx:ScopedTransaction,personId:string,serviceId:string,input:ConfigureTestGatewayInput):Promise<TestGateway>{
 const scopeKey=`service:${serviceId}`;
 await management(tx,personId,serviceId,true);
 const [profile]=await tx.select().from(merchantProfiles).where(eq(merchantProfiles.serviceId,serviceId));
 if(!profile||["RESTRICTED","DECLINED","CLOSED"].includes(profile.status))throw new SecurityError("MERCHANT_UNAVAILABLE",404);
 const receipt=await begin(tx,personId,scopeKey,"GATEWAY",input),[current]=await tx.select().from(testGateways).where(eq(testGateways.serviceId,serviceId));
 if(receipt.old)return gatewayProjection(serviceId,current);
 checkVersion(current?.version??0,input.expectedVersion);const now=await merchantNow(tx),mode=input.enabled?"TEST_READY":"DISABLED";
 const [saved]=current?await tx.update(testGateways).set({mode,version:current.version+1,updatedBy:personId,updatedAt:now}).where(eq(testGateways.serviceId,serviceId)).returning():await tx.insert(testGateways).values({serviceId,mode,updatedBy:personId,createdAt:now,updatedAt:now}).returning();
 await finish(tx,personId,scopeKey,"GATEWAY",input,receipt.digest,serviceId);return gatewayProjection(serviceId,saved);
}
export async function configureTestGateway(personId:string,merchantUnitId:string,raw:ConfigureTestGatewayInput):Promise<TestGateway>{
 merchantUnitId=uuid(merchantUnitId);const input=parse(configureTestGatewaySchema,raw);
 return getDb().transaction(async tx=>{const unit=await loadTerminalScope(tx,personId,merchantUnitId,true);return configureGateway(tx,personId,unit.merchantService.id,input);});
}
export async function configureMerchantAccountGateway(personId:string,serviceId:string,raw:ConfigureTestGatewayInput):Promise<TestGateway>{
 serviceId=uuid(serviceId);const input=parse(configureTestGatewaySchema,raw);
 return getDb().transaction(tx=>configureGateway(tx,personId,serviceId,input));
}
export async function getMerchantPaymentSettings(personId:string,serviceId:string):Promise<MerchantPaymentSettings>{
 serviceId=uuid(serviceId);
 return getDb().transaction(async tx=>{const scope=await responsible(tx,personId,serviceId);requireAction(scope,"acquiring.read");
  const [gateway]=await tx.select().from(testGateways).where(eq(testGateways.serviceId,serviceId)),[profile]=await tx.select().from(merchantProfiles).where(eq(merchantProfiles.serviceId,serviceId));
  return {serviceId,name:scope.service.displayName,gateway:gatewayProjection(serviceId,gateway),canConfigureGateway:!!profile&&!["RESTRICTED","DECLINED","CLOSED"].includes(profile.status)&&await canManage(tx,personId,serviceId),networks:sandboxNetworkAdapter.capabilities().instruments};
 },{isolationLevel:"repeatable read"});
}
export async function enrollTestMerchant(personId:string,merchantUnitId:string,raw:EnrollTestMerchantInput):Promise<TestMerchantEnrollment> {
  merchantUnitId=uuid(merchantUnitId);const input=parse(enrollTestMerchantSchema,raw),scopeKey=`unit:${merchantUnitId}`;
  return getDb().transaction(async tx=>{
    const scope=await loadTerminalScope(tx,personId,merchantUnitId,true);await management(tx,personId,scope.merchantService.id,true);
    const receipt=await begin(tx,personId,scopeKey,"ENROLLMENT",input),config=await configuration(tx,scope);
    if(receipt.old)return enrollmentProjection(scope,config.enrollment);
    checkVersion(config.enrollment?.version??0,input.expectedVersion);
    if(!config.gateway||(input.enabled&&config.gateway.mode!=="TEST_READY"))throw new SecurityError("TEST_GATEWAY_NOT_READY",409);
    const now=await merchantNow(tx),status=input.enabled?"ENROLLED":"DISABLED";
    const [saved]=config.enrollment?await tx.update(testMerchantEnrollments).set({status,version:config.enrollment.version+1,updatedBy:personId,updatedAt:now}).where(eq(testMerchantEnrollments.merchantUnitId,merchantUnitId)).returning():await tx.insert(testMerchantEnrollments).values({merchantUnitId,serviceId:scope.merchantService.id,status,updatedBy:personId,createdAt:now,updatedAt:now}).returning();
    await finish(tx,personId,scopeKey,"ENROLLMENT",input,receipt.digest,merchantUnitId);return enrollmentProjection(scope,saved);
  });
}
export async function setChannelActivation(personId:string,merchantUnitId:string,channelId:string,raw:ChannelActivationInput):Promise<ChannelActivation> {
  merchantUnitId=uuid(merchantUnitId);channelId=uuid(channelId);const input=parse(channelActivationSchema,raw),scopeKey=`channel:${channelId}`;
  return getDb().transaction(async tx=>{
    const scope=await loadTerminalScope(tx,personId,merchantUnitId,true);requireAction(scope,"channels.update");await requireMerchantApplicant(tx,personId);
    const row=await channel(tx,scope,personId,channelId,true),receipt=await begin(tx,personId,scopeKey,"ACTIVATION",input),config=await configuration(tx,scope),now=await merchantNow(tx);
    const projected=await activationProjection(tx,scope,row,true,config.ready,now);
    if(receipt.old)return projected;
    checkVersion(row.version,input.expectedChannelVersion);
    checkVersion(projected.version,input.expectedVersion);
    if(input.active&&!projected.canActivate)throw new SecurityError(projected.state==="USED"?"CHANNEL_ALREADY_USED":"CHANNEL_NOT_READY",409);
    const [current]=await tx.select().from(channelActivations).where(eq(channelActivations.channelId,channelId));
    const status=input.active?"ACTIVE":"DISABLED";
    if(current)await tx.update(channelActivations).set({status,version:current.version+1,updatedBy:personId,updatedAt:now}).where(eq(channelActivations.channelId,channelId));
    else await tx.insert(channelActivations).values({channelId,merchantUnitId,serviceId:scope.merchantService.id,status,updatedBy:personId,createdAt:now,updatedAt:now});
    await finish(tx,personId,scopeKey,"ACTIVATION",input,receipt.digest,channelId);return activationProjection(tx,scope,row,true,config.ready,now);
  });
}
/** Sole merchant payment persistence owner. Callers supply an already locked, currently authorized channel.
 * Authority is the exact authenticated card checkout and its already-posted card activity. */
export async function recordMerchantSandboxPayment(tx:ScopedTransaction,row:Channel,authority:{kind:"CARDHOLDER";actorId:null;guestOrderId:null;cardCheckoutId:string;cardActivityId:string},outcome:"APPROVED"|"DECLINED",gatewayVersion:number,enrollmentVersion:number,now:Date):Promise<Payment>{
  const id=randomUUID(),result=testPayment(id,outcome);
  const journalId=result.outcome==="APPROVED"?await postJournal(tx,{businessKey:`merchant-payment:${id}`,kind:"MERCHANT_PAYMENT",referenceId:id,occurredAt:now,lines:[{serviceId:row.serviceId,merchantUnitId:row.merchantUnitId,bucket:"GATEWAY_CLEARING",deltaMinor:-row.amountMinor},{serviceId:row.serviceId,merchantUnitId:row.merchantUnitId,bucket:"MERCHANT_AVAILABLE",deltaMinor:row.amountMinor}]}):null;
  const [saved]=await tx.insert(merchantTestPayments).values({id,serviceId:row.serviceId,merchantUnitId:row.merchantUnitId,channelId:row.id,actorId:authority.actorId,guestOrderId:authority.guestOrderId,cardCheckoutId:authority.cardCheckoutId,cardActivityId:authority.cardActivityId,channelVersion:row.version,channelUsage:row.usage,description:row.description,amountMinor:row.amountMinor,currency:"USD",outcome:result.outcome,testReference:result.testReference,gatewayVersion,enrollmentVersion,journalId,createdAt:now}).returning();
  return saved!;
}
export async function refundMerchantPayment(personId:string,merchantUnitId:string,paymentId:string,raw:RefundMerchantPaymentInput):Promise<MerchantTestPayment> {
  merchantUnitId=uuid(merchantUnitId);paymentId=uuid(paymentId);const input=parse(refundMerchantPaymentSchema,raw),scopeKey=`payment:${paymentId}`;
  const [networkHint]=await getDb().select({id:merchantTestPayments.networkOperationId}).from(merchantTestPayments).where(and(eq(merchantTestPayments.id,paymentId),eq(merchantTestPayments.merchantUnitId,merchantUnitId)));
  if(networkHint?.id){const operationId=await prepareMerchantNetworkRefund(personId,merchantUnitId,paymentId,input);const {dispatchNetworkRefund}=await import("./network-service");await dispatchNetworkRefund(operationId);return getDb().transaction(async tx=>{const scope=await loadTerminalScope(tx,personId,merchantUnitId);requireAction(scope,"payments.read");const payment=await readPayment(tx,scope,paymentId),[refund]=await tx.select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,paymentId));if(!refund)throw new SecurityError("REFUND_RETURNED",409);return currentPaymentProjection(tx,payment,refund,await refundAuthority(tx,scope,personId));});}
  return getDb().transaction(async tx=>{
    const [hint]=await tx.select().from(merchantTestPayments).where(and(eq(merchantTestPayments.id,paymentId),eq(merchantTestPayments.merchantUnitId,merchantUnitId)));
    const [cardPayment]=hint?.cardCheckoutId?await tx.select().from(cardCheckoutAttempts).where(eq(cardCheckoutAttempts.id,hint.cardCheckoutId)):[];
    await lockMoneyAccountsForServices(tx,[hint?.serviceId,cardPayment?.cardServiceId].filter((id):id is string=>!!id));
    for(const serviceId of [...new Set([hint?.serviceId,cardPayment?.cardServiceId].filter((id):id is string=>!!id))].sort())await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+serviceId},0))`);
    const scope=await loadTerminalScope(tx,personId,merchantUnitId,true);requireAction(scope,"payments.refund");await responsible(tx,personId,scope.merchantService.id,true);await requireMerchantApplicant(tx,personId);
    const payment=await readPayment(tx,scope,paymentId),receipt=await begin(tx,personId,scopeKey,"REFUND",input),[current]=await tx.select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,paymentId));
    if(receipt.old)return paymentProjection(payment,current,true);
    checkVersion(current?2:1,input.expectedVersion);
    if(payment.outcome!=="APPROVED"||current)throw new SecurityError("PAYMENT_NOT_REFUNDABLE",409);
    const id=randomUUID(),result=testRefund(id),now=await merchantNow(tx);
    const position=await refundPosition(tx,paymentId);if(position===null)throw new SecurityError("REFUND_DEPOSIT_RESERVED",409);
    const account=await getServiceMoneyAccount(tx,scope.merchantService.id);
    const journalId=await postJournal(tx,{businessKey:`merchant-refund:${paymentId}`,kind:"MERCHANT_REFUND",referenceId:id,occurredAt:now,lines:[{...(position==="MONEY_AVAILABLE"?moneyPosition(account.id):{serviceId:scope.merchantService.id,merchantUnitId,bucket:position}),deltaMinor:-payment.amountMinor},{serviceId:scope.merchantService.id,merchantUnitId,bucket:"GATEWAY_CLEARING",deltaMinor:payment.amountMinor}]});
    const [saved]=await tx.insert(merchantTestRefunds).values({id,paymentId,merchantUnitId,serviceId:scope.merchantService.id,actorId:personId,amountMinor:payment.amountMinor,currency:"USD",reason:input.reason,testReference:result.testReference,journalId,createdAt:now}).returning();
    if(cardPayment){
      const payerAccount=await getServiceMoneyAccount(tx,cardPayment.cardServiceId);
      await postJournal(tx,{businessKey:`card-refund:${paymentId}`,kind:"CARD_REFUND",referenceId:id,occurredAt:now,lines:[{serviceId:cardPayment.cardServiceId,cardId:cardPayment.cardId,bucket:"CARD_SPENT",deltaMinor:-payment.amountMinor},{...moneyPosition(payerAccount.id),deltaMinor:payment.amountMinor}]});
      await tx.insert(serviceActivity).values({id,serviceId:cardPayment.cardServiceId,cardId:cardPayment.cardId,title:payment.description,category:"Card refund",occurredAt:now,status:"POSTED",direction:"CREDIT",amountMinor:payment.amountMinor,description:"Refund returned to your card group’s prepaid balance."});
    }
    await finish(tx,personId,scopeKey,"REFUND",input,receipt.digest,id);return paymentProjection(payment,saved,true);
  });
}
async function depositCandidates(tx:ScopedTransaction,merchantUnitId:string,serviceId:string){
 const payments=await tx.select({payment:merchantTestPayments}).from(merchantTestPayments).leftJoin(merchantSettlementItems,eq(merchantSettlementItems.paymentId,merchantTestPayments.id)).leftJoin(merchantTestRefunds,eq(merchantTestRefunds.paymentId,merchantTestPayments.id)).where(and(eq(merchantTestPayments.merchantUnitId,merchantUnitId),eq(merchantTestPayments.serviceId,serviceId),eq(merchantTestPayments.outcome,"APPROVED"),isNull(merchantSettlementItems.paymentId),isNull(merchantTestRefunds.id),sql`not exists (select 1 from network_refund_operations r where r."paymentOperationId"=${merchantTestPayments.networkOperationId} and not exists (select 1 from network_events e where e."operationId"=r.id and e.type='REFUND_FAILED'))`,sql`${merchantTestPayments.createdAt}>=(select "activatedAt" from prepaid_cutover where id='D69')`)).orderBy(merchantTestPayments.createdAt,merchantTestPayments.id);
 const amountMinor=payments.reduce((sum,row)=>sum+row.payment.amountMinor,0n),token=createHash("sha256").update(JSON.stringify({serviceId,merchantUnitId,payments:payments.map(({payment})=>({id:payment.id,amount:payment.amountMinor.toString()}))})).digest("hex");
 return {payments,amountMinor,token};
}
function settlementReceipt(row:{id:string;merchantUnitId:string;moneyAccountId:string;amountMinor:bigint;createdAt:Date},settlementId=row.id):MerchantSettlementReceipt{return {id:row.id,terminalId:row.merchantUnitId,settlementId,moneyAccountId:row.moneyAccountId,amount:formatMoney(row.amountMinor),reference:`SET-${row.id.slice(0,8).toUpperCase()}`,createdAt:row.createdAt.toISOString()};}
async function listSettlementReceipts(tx:ScopedTransaction,terminalId:string){
 const settled=await tx.select().from(merchantSettlements).where(and(eq(merchantSettlements.merchantUnitId,terminalId),sql`${merchantSettlements.moneyAccountId} is not null`)).orderBy(desc(merchantSettlements.createdAt));
 const credits=await tx.select().from(merchantSettlementCredits).where(eq(merchantSettlementCredits.merchantUnitId,terminalId)).orderBy(desc(merchantSettlementCredits.createdAt));
 return [...settled.map(row=>settlementReceipt({...row,moneyAccountId:row.moneyAccountId!})),...credits.map(row=>settlementReceipt(row,row.settlementId))].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}
/** Owner settles an exact reviewed batch into the shared money account. Terminal access cannot move money. */
export async function createMerchantSettlement(personId:string,merchantUnitId:string,raw:MerchantSettlementInput):Promise<MerchantSettlementReceipt>{
 merchantUnitId=uuid(merchantUnitId);const input=parse(merchantSettlementSchema,raw),scopeKey=`terminal:${merchantUnitId}`;
 return getDb().transaction(async tx=>{
  const [terminal]=await tx.select().from(merchantTerminals).where(eq(merchantTerminals.id,merchantUnitId));if(!terminal)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  await lockMoneyAccountsForServices(tx,[terminal.merchantServiceId]);
  const scope=await loadTerminalScope(tx,personId,merchantUnitId,true);requireAction(scope,"payouts.manage");await responsible(tx,personId,scope.merchantService.id,true);await requireMerchantApplicant(tx,personId);
  const receipt=await begin(tx,personId,scopeKey,"SETTLEMENT",input),account=await getServiceMoneyAccount(tx,scope.merchantService.id);
  if(receipt.old){const saved=(await listSettlementReceipts(tx,merchantUnitId)).find(row=>row.id===receipt.old!.resultId);if(!saved)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return saved;}
  const now=await merchantNow(tx);
  if(input.settlementId){
   const [batch]=await tx.select().from(merchantSettlements).where(and(eq(merchantSettlements.id,input.settlementId),eq(merchantSettlements.merchantUnitId,merchantUnitId),eq(merchantSettlements.serviceId,scope.merchantService.id))).for("update");
   if(!batch||batch.moneyAccountId)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
   const [already]=await tx.select().from(merchantSettlementCredits).where(eq(merchantSettlementCredits.settlementId,batch.id));if(already)throw new SecurityError("SETTLEMENT_ALREADY_CREDITED",409);
   const reviewed=await batchReview(tx,batch.id);if(!reviewed.canRetry||input.reviewToken!==reviewed.token)throw new SecurityError("DEPOSIT_REVIEW_CHANGED",409);
   const id=randomUUID(),journalId=await postJournal(tx,{businessKey:`merchant-settlement-credit:${id}`,kind:"MERCHANT_SETTLEMENT",referenceId:id,occurredAt:now,lines:[{serviceId:scope.merchantService.id,merchantUnitId,bucket:"MERCHANT_SETTLED",deltaMinor:-reviewed.amountMinor},{...moneyPosition(account.id),deltaMinor:reviewed.amountMinor}]});
   const [credit]=await tx.insert(merchantSettlementCredits).values({id,settlementId:batch.id,moneyAccountId:account.id,serviceId:scope.merchantService.id,merchantUnitId,amountMinor:reviewed.amountMinor,actorId:personId,journalId,createdAt:now}).returning();
   await finish(tx,personId,scopeKey,"SETTLEMENT",input,receipt.digest,id);return settlementReceipt(credit!,batch.id);
  }
  const {payments,amountMinor,token}=await depositCandidates(tx,merchantUnitId,scope.merchantService.id);if(amountMinor<=0n)throw new SecurityError("NO_PAYMENTS_TO_SETTLE",409);if(input.reviewToken!==token)throw new SecurityError("DEPOSIT_REVIEW_CHANGED",409);
  const id=randomUUID(),journalId=await postJournal(tx,{businessKey:`settlement:${id}`,kind:"MERCHANT_SETTLEMENT",referenceId:id,occurredAt:now,lines:[{serviceId:scope.merchantService.id,merchantUnitId,bucket:"MERCHANT_AVAILABLE",deltaMinor:-amountMinor},{...moneyPosition(account.id),deltaMinor:amountMinor}]});
  const [saved]=await tx.insert(merchantSettlements).values({id,moneyAccountId:account.id,serviceId:scope.merchantService.id,merchantUnitId,amountMinor,actorId:personId,journalId,createdAt:now}).returning();
  await tx.insert(merchantSettlementItems).values(payments.map(({payment})=>({paymentId:payment.id,settlementId:id,serviceId:scope.merchantService.id,merchantUnitId,amountMinor:payment.amountMinor})));
  await finish(tx,personId,scopeKey,"SETTLEMENT",input,receipt.digest,id);return settlementReceipt({...saved!,moneyAccountId:account.id});
 });
}
async function depositOperator(tx:ScopedTransaction,personId:string,serviceId:string){
 const [row]=await tx.select({assignment:operatorServiceAccess,service:services}).from(operatorServiceAccess).innerJoin(services,eq(services.id,operatorServiceAccess.serviceId)).where(and(eq(operatorServiceAccess.personId,personId),eq(operatorServiceAccess.serviceId,serviceId))).for("share");
 const grants=row?.assignment.canProcessDeposits?["support.operator.read","payments.operator.process"]:[];
 if(!row||!evaluate({targetKind:"OPERATOR_SERVICE",actorPersonId:personId,assignmentPersonId:row.assignment.personId,serviceId,resourceServiceId:serviceId,state:row.assignment.state,serviceStatus:row.service.status,grants},"payments.operator.process").allowed)throw new SecurityError("ACTION_DENIED",403);
}
export async function getDepositProcessingQueue(personId:string){return getDb().transaction(async tx=>{
 const assignments=await tx.select().from(operatorServiceAccess).where(and(eq(operatorServiceAccess.personId,personId),eq(operatorServiceAccess.state,"ACCEPTED"),eq(operatorServiceAccess.canProcessDeposits,true)));const result=[];
 for(const assignment of assignments){await depositOperator(tx,personId,assignment.serviceId);const rows=await tx.select({deposit:merchantDeposits,name:merchantTerminals.displayName}).from(merchantDeposits).innerJoin(merchantTerminals,eq(merchantTerminals.id,merchantDeposits.merchantUnitId)).leftJoin(merchantDepositEvents,eq(merchantDepositEvents.depositId,merchantDeposits.id)).where(and(eq(merchantDeposits.serviceId,assignment.serviceId),isNull(merchantDepositEvents.depositId))).orderBy(merchantDeposits.createdAt).limit(100);for(const row of rows)result.push({...await payoutProjection(tx,row.deposit),merchantName:row.name});}return result;
 },{isolationLevel:"repeatable read"});}
export async function processMerchantDeposit(personId:string,depositId:string,raw:{commandId:string;outcome:"COMPLETED"|"FAILED"}):Promise<MerchantTestPayout>{
 depositId=uuid(depositId);const parsed=parse(z.object({commandId:z.uuid(),outcome:z.enum(["COMPLETED","FAILED"])}).strict(),raw),input={...parsed,commandId:uuid(parsed.commandId)};
 return getDb().transaction(async tx=>{const [deposit]=await tx.select().from(merchantDeposits).where(eq(merchantDeposits.id,depositId));if(!deposit)throw new SecurityError("RESOURCE_UNAVAILABLE",404);await lockMoneyAccountsForServices(tx,[deposit.serviceId]);await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:"+deposit.serviceId},0))`);await depositOperator(tx,personId,deposit.serviceId);await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${input.commandId},0))`);const [old]=await tx.select().from(merchantDepositEvents).where(or(eq(merchantDepositEvents.depositId,depositId),eq(merchantDepositEvents.commandId,input.commandId)));if(old){if(old.depositId!==depositId||old.commandId!==input.commandId||old.actorId!==personId||old.outcome!==input.outcome)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return payoutProjection(tx,deposit);}
 const account=await getServiceMoneyAccount(tx,deposit.serviceId);
 const now=await merchantNow(tx),journalId=await postJournal(tx,{businessKey:`deposit-result:${depositId}`,kind:input.outcome==="COMPLETED"?"MERCHANT_PAYOUT":"DEPOSIT_RELEASE",referenceId:depositId,occurredAt:now,lines:[{serviceId:deposit.serviceId,merchantUnitId:deposit.merchantUnitId,bucket:"MERCHANT_PAYOUT_PENDING",deltaMinor:-deposit.amountMinor},{...(input.outcome==="COMPLETED"?moneyPosition(account.id):{serviceId:deposit.serviceId,merchantUnitId:deposit.merchantUnitId,bucket:"MERCHANT_SETTLED" as const}),deltaMinor:deposit.amountMinor}]});await tx.insert(merchantDepositEvents).values({depositId,commandId:input.commandId,actorId:personId,outcome:input.outcome,journalId,createdAt:now});return payoutProjection(tx,deposit);
 });
}

/** Canonical merchant payment writer for a verified availability event. No card ledger is involved. */
export async function recordMerchantNetworkPayment(tx:ScopedTransaction,operation:typeof networkPaymentOperations.$inferSelect,now:Date){
 const journalId=await postJournal(tx,{businessKey:`network-available:${operation.id}`,kind:"NETWORK_AVAILABLE",referenceId:operation.id,occurredAt:now,lines:[{serviceId:operation.serviceId,merchantUnitId:operation.terminalId,bucket:"MERCHANT_CAPTURE_PENDING",deltaMinor:-operation.amountMinor},{serviceId:operation.serviceId,merchantUnitId:operation.terminalId,bucket:"MERCHANT_AVAILABLE",deltaMinor:operation.amountMinor}]});
 await tx.insert(merchantTestPayments).values({id:operation.id,networkOperationId:operation.id,serviceId:operation.serviceId,merchantUnitId:operation.terminalId,channelId:operation.channelId,channelVersion:operation.channelVersion,channelUsage:operation.channelUsage,description:operation.description,amountMinor:operation.amountMinor,currency:"USD",outcome:"APPROVED",testReference:`TEST-NET-${operation.id.toUpperCase()}`,gatewayVersion:operation.gatewayVersion,enrollmentVersion:operation.enrollmentVersion,journalId,createdAt:now});return journalId;
}
export async function prepareMerchantNetworkRefund(personId:string,terminalId:string,paymentId:string,input:RefundMerchantPaymentInput){
 return getDb().transaction(async tx=>{const [payment]=await tx.select().from(merchantTestPayments).where(and(eq(merchantTestPayments.id,paymentId),eq(merchantTestPayments.merchantUnitId,terminalId)));if(!payment?.networkOperationId)throw new SecurityError("RESOURCE_UNAVAILABLE",404);await lockMoneyAccountsForServices(tx,[payment.serviceId]);const scope=await loadTerminalScope(tx,personId,terminalId,true);requireAction(scope,"payments.refund");await responsible(tx,personId,payment.serviceId,true);await requireMerchantApplicant(tx,personId);const receipt=await begin(tx,personId,`payment:${paymentId}`,"REFUND",input);if(receipt.old)return receipt.old.resultId;
 const [existing]=await tx.select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,paymentId));checkVersion(existing?2:1,input.expectedVersion);if(existing||payment.outcome!=="APPROVED")throw new SecurityError("PAYMENT_NOT_REFUNDABLE",409);
 const previous=await tx.select().from(networkRefundOperations).where(eq(networkRefundOperations.paymentOperationId,payment.networkOperationId));for(const old of previous){const [failed]=await tx.select().from(networkEvents).innerJoin(networkEventEffects,eq(networkEventEffects.eventId,networkEvents.id)).where(and(eq(networkEvents.operationId,old.id),eq(networkEvents.type,"REFUND_FAILED")));if(!failed)throw new SecurityError("REFUND_PROCESSING",409);}
 const [operation]=await tx.select().from(networkPaymentOperations).where(eq(networkPaymentOperations.id,payment.networkOperationId));const position=await refundPosition(tx,payment.id);if(!operation||!position)throw new SecurityError("PAYMENT_NOT_REFUNDABLE",409);const now=await merchantNow(tx),account=await getServiceMoneyAccount(tx,payment.serviceId),id=input.commandId.toLowerCase();
 const reservationJournalId=await postJournal(tx,{businessKey:`network-refund-reserve:${id}`,kind:"NETWORK_REFUND_RESERVE",referenceId:id,occurredAt:now,lines:[{...(position==="MONEY_AVAILABLE"?moneyPosition(account.id):{serviceId:payment.serviceId,merchantUnitId:terminalId,bucket:position}),deltaMinor:-payment.amountMinor},{serviceId:payment.serviceId,merchantUnitId:terminalId,bucket:"MERCHANT_REFUND_PENDING",deltaMinor:payment.amountMinor}]});
 await tx.insert(networkRefundOperations).values({id,paymentOperationId:operation.id,actorId:personId,serviceId:payment.serviceId,terminalId,provider:operation.provider,mode:operation.mode,providerAccount:operation.providerAccount,providerPaymentId:`SANDBOX-PAY-${operation.id}`,amountMinor:payment.amountMinor,feeMinor:0n,currency:"USD",sourceBucket:position,reason:input.reason,requestDigest:receipt.digest,reservationJournalId,createdAt:now});await finish(tx,personId,`payment:${paymentId}`,"REFUND",input,receipt.digest,id);return id;
 });
}
/** A verified original-provider result completes a reserved refund, even if access changed after dispatch. */
export async function recordMerchantNetworkRefund(tx:ScopedTransaction,operation:typeof networkRefundOperations.$inferSelect,succeeded:boolean,now:Date){
 const [opposite]=await tx.select().from(networkEvents).innerJoin(networkEventEffects,eq(networkEventEffects.eventId,networkEvents.id)).where(and(eq(networkEvents.operationId,operation.id),eq(networkEvents.type,succeeded?"REFUND_FAILED":"REFUND_SUCCEEDED")));if(opposite)throw new SecurityError("PROVIDER_EVENT_CONFLICT",409);
 const account=await getServiceMoneyAccount(tx,operation.serviceId);const destination=succeeded?{serviceId:operation.serviceId,merchantUnitId:operation.terminalId,bucket:"GATEWAY_CLEARING" as const}:operation.sourceBucket==="MONEY_AVAILABLE"?moneyPosition(account.id):{serviceId:operation.serviceId,merchantUnitId:operation.terminalId,bucket:operation.sourceBucket};
 const journalId=await postJournal(tx,{businessKey:`network-refund-result:${operation.id}`,kind:succeeded?"NETWORK_REFUND_COMPLETE":"NETWORK_REFUND_RELEASE",referenceId:operation.id,occurredAt:now,lines:[{serviceId:operation.serviceId,merchantUnitId:operation.terminalId,bucket:"MERCHANT_REFUND_PENDING",deltaMinor:-operation.amountMinor},{...destination,deltaMinor:operation.amountMinor}]});
 if(succeeded)await tx.insert(merchantTestRefunds).values({id:operation.id,paymentId:operation.paymentOperationId,networkRefundOperationId:operation.id,merchantUnitId:operation.terminalId,serviceId:operation.serviceId,actorId:operation.actorId,amountMinor:operation.amountMinor,currency:"USD",reason:operation.reason,testReference:`TEST-NET-REF-${operation.id.toUpperCase()}`,journalId,createdAt:now});return journalId;
}
