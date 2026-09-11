import { createHash, randomUUID } from "node:crypto";
import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";
import QRCode from "qrcode";
import { getDb } from "../../platform/database/client";
import { getRuntimeConfig } from "../../platform/config";
import { SecurityError } from "../../platform/security/origin";
import { loadServiceScope, type ScopedTransaction } from "../access/scope";
import { loadMerchantUnitScope, requireMerchantParticipant, merchantNow } from "../access/merchant-scope";
import { requireMerchantApplicant } from "../services/merchant-eligibility";
import { evaluate } from "../policy/evaluate";
import { getBalance, postJournal } from "../ledger/service";
import { formatMoney } from "../workspace/service";
import { merchantProfiles, merchantUnits, paymentChannels } from "./schema";
import { getMerchantWorkspace, merchantChannelVisible } from "./service";
import { channelActivations, merchantOperationCommands, merchantTestPayments, merchantTestPayouts, merchantTestRefunds, testGateways, testMerchantEnrollments } from "./operations-schema";
import { testPayment, testPayout, testRefund } from "./adapters/sandbox";
import { channelActivationSchema, configureTestGatewaySchema, enrollTestMerchantSchema, merchantPayoutSchema, refundMerchantPaymentSchema, simulateMerchantPaymentSchema,
  type ChannelActivation, type ChannelActivationInput, type ConfigureTestGatewayInput, type EnrollTestMerchantInput, type MerchantCheckoutProjection, type MerchantNetworkProjection, type MerchantOperationsProjection, type MerchantPayoutInput, type MerchantTestPayment, type MerchantTestPayout, type RefundMerchantPaymentInput, type SimulateMerchantPaymentInput, type TestGateway, type TestMerchantEnrollment } from "./operations-contracts";

type UnitScope=Awaited<ReturnType<typeof loadMerchantUnitScope>>;
type ServiceScope=Awaited<ReturnType<typeof loadServiceScope>>;
type Channel=typeof paymentChannels.$inferSelect;
type Payment=typeof merchantTestPayments.$inferSelect;
type Refund=typeof merchantTestRefunds.$inferSelect;
type Payout=typeof merchantTestPayouts.$inferSelect;
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
  const [gateway]=await tx.select().from(testGateways).where(eq(testGateways.serviceId,scope.masterService.id));
  const [enrollment]=await tx.select().from(testMerchantEnrollments).where(and(eq(testMerchantEnrollments.merchantUnitId,scope.unit.id),eq(testMerchantEnrollments.serviceId,scope.masterService.id)));
  return {gateway,enrollment,ready:gateway?.mode==="TEST_READY"&&enrollment?.status==="ENROLLED"};
}
function gatewayProjection(serviceId:string,row?:typeof testGateways.$inferSelect):TestGateway {return {serviceId,mode:row?.mode??"NOT_CONFIGURED",processor:"ETAIL_TEST",version:row?.version??0,liveEnabled:false,updatedAt:row?.updatedAt.toISOString()??null};}
function enrollmentProjection(scope:UnitScope,row?:typeof testMerchantEnrollments.$inferSelect):TestMerchantEnrollment {return {merchantUnitId:scope.unit.id,serviceId:scope.masterService.id,status:row?.status??"NOT_ENROLLED",version:row?.version??0,updatedAt:row?.updatedAt.toISOString()??null};}
async function channel(tx:ScopedTransaction,scope:UnitScope,personId:string,channelId:string,forWrite=false) {
  uuid(channelId);requireAction(scope,"channels.read");
  const query=tx.select().from(paymentChannels).where(and(eq(paymentChannels.id,channelId),eq(paymentChannels.merchantUnitId,scope.unit.id),eq(paymentChannels.serviceId,scope.masterService.id)));
  const [row]=forWrite?await query.for("update"):await query;
  if(!row||!merchantChannelVisible(row,personId,scope.primaryAccess))throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  return row;
}
async function activationProjection(tx:ScopedTransaction,scope:UnitScope,row:Channel,eligible:boolean,ready:boolean,now:Date):Promise<ChannelActivation> {
  const [activation]=await tx.select().from(channelActivations).where(eq(channelActivations.channelId,row.id));
  const [used]=row.usage==="ONE_TIME"?await tx.select({id:merchantTestPayments.id}).from(merchantTestPayments).where(and(eq(merchantTestPayments.channelId,row.id),eq(merchantTestPayments.outcome,"APPROVED"))).limit(1):[];
  const state:ChannelActivation["state"]=row.status==="CANCELED"?"DISABLED":used?"USED":row.expiresAt<=now?"EXPIRED":!ready?"NOT_READY":activation?.status==="ACTIVE"?"ACTIVE":"DISABLED";
  const editable=eligible&&evaluate(scope.policy,"channels.update").allowed;
  const canSimulate=eligible&&state==="ACTIVE"&&evaluate(scope.policy,"payments.simulate").allowed;
  return {channelId:row.id,merchantUnitId:row.merchantUnitId,version:activation?.version??0,state,canActivate:editable&&ready&&row.status==="DRAFT"&&!used&&row.expiresAt>now&&activation?.status!=="ACTIVE",canDisable:editable&&activation?.status==="ACTIVE",canSimulate,previewHref:canSimulate?`/pay/${row.id}`:null};
}
function paymentProjection(row:Payment,refund:Refund|undefined,canRefund:boolean):MerchantTestPayment {return {id:row.id,merchantUnitId:row.merchantUnitId,channelId:row.channelId,description:row.description,amount:formatMoney(row.amountMinor),status:refund?"REFUNDED":row.outcome,version:refund?2:1,testReference:row.testReference,createdAt:row.createdAt.toISOString(),feeStatus:"NOT_APPLIED",canRefund:canRefund&&row.outcome==="APPROVED"&&!refund,refund:refund?{id:refund.id,amount:formatMoney(refund.amountMinor),reason:refund.reason,testReference:refund.testReference,createdAt:refund.createdAt.toISOString()}:null};}
function payoutProjection(row:Payout):MerchantTestPayout {return {id:row.id,merchantUnitId:row.merchantUnitId,amount:formatMoney(row.amountMinor),status:"COMPLETED",testReference:row.testReference,destination:"TEST_DESTINATION",createdAt:row.createdAt.toISOString()};}
async function refundAuthority(tx:ScopedTransaction,scope:UnitScope,personId:string) {try {await responsible(tx,personId,scope.masterService.id);return evaluate(scope.policy,"payments.refund").allowed&&await adult(tx,personId);}catch(error){if(error instanceof SecurityError&&[403,404].includes(error.status))return false;throw error;}}
async function readPayment(tx:ScopedTransaction,scope:UnitScope,paymentId:string) {uuid(paymentId);const [row]=await tx.select().from(merchantTestPayments).where(and(eq(merchantTestPayments.id,paymentId),eq(merchantTestPayments.merchantUnitId,scope.unit.id),eq(merchantTestPayments.serviceId,scope.masterService.id)));if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return row;}

export async function getMerchantOperations(personId:string,merchantUnitId:string):Promise<MerchantOperationsProjection> {
  merchantUnitId=uuid(merchantUnitId);
  return getDb().transaction(async tx=>{
    const scope=await loadMerchantUnitScope(tx,personId,merchantUnitId,false,{read:true}),eligible=await adult(tx,personId),config=await configuration(tx,scope),now=await merchantNow(tx);
    const canReadPayments=evaluate(scope.policy,"payments.read").allowed,canConfigureGateway=scope.policy.mode!=="OVERSIGHT"&&await canManage(tx,personId,scope.masterService.id),canRefund=await refundAuthority(tx,scope,personId);
    let canPayout=false;try {await responsible(tx,personId,scope.masterService.id);canPayout=eligible&&evaluate(scope.policy,"payouts.manage").allowed;}catch(error){if(!(error instanceof SecurityError&&[403,404].includes(error.status)))throw error;}
    const channels=evaluate(scope.policy,"channels.read").allowed?await tx.select().from(paymentChannels).where(and(eq(paymentChannels.merchantUnitId,merchantUnitId),scope.primaryAccess?undefined:or(eq(paymentChannels.creatorId,personId),eq(paymentChannels.visibility,"ASSIGNED")))).orderBy(desc(paymentChannels.updatedAt),paymentChannels.id):[];
    const payments=canReadPayments?await tx.select().from(merchantTestPayments).where(eq(merchantTestPayments.merchantUnitId,merchantUnitId)).orderBy(desc(merchantTestPayments.createdAt),merchantTestPayments.id):[];
    const refunds=payments.length?await tx.select().from(merchantTestRefunds).where(inArray(merchantTestRefunds.paymentId,payments.map(row=>row.id))):[];
    const payouts=canReadPayments?await tx.select().from(merchantTestPayouts).where(eq(merchantTestPayouts.merchantUnitId,merchantUnitId)).orderBy(desc(merchantTestPayouts.createdAt),merchantTestPayouts.id):[];
    const projectedChannels:ChannelActivation[]=[];
    for(const row of channels)projectedChannels.push(await activationProjection(tx,scope,row,eligible,config.ready,now));
    return {merchantUnitId,serviceId:scope.masterService.id,mode:"TEST",liveEnabled:false,feeStatus:"NOT_APPLIED",gateway:gatewayProjection(scope.masterService.id,config.gateway),enrollment:enrollmentProjection(scope,config.enrollment),channels:projectedChannels,payments:payments.map(row=>paymentProjection(row,refunds.find(item=>item.paymentId===row.id),canRefund)),payouts:payouts.map(payoutProjection),availableFunds:canReadPayments?formatMoney(await getBalance(tx,{serviceId:scope.masterService.id,merchantUnitId,bucket:"MERCHANT_AVAILABLE"})):null,canConfigureGateway,canEnroll:canConfigureGateway,canReadPayments,canPayout};
  });
}
/** An aggregate is a primary-service permission, never a consequence of a shared unit ID. */
export async function getMerchantNetwork(personId:string,primaryUnitId:string):Promise<MerchantNetworkProjection> {
  primaryUnitId=uuid(primaryUnitId);
  async function rootScope() {
    return getDb().transaction(async tx=>{
      const scope=await loadMerchantUnitScope(tx,personId,primaryUnitId,false,{mode:"OVERSIGHT"});
      if(!scope.primaryAccess||scope.unit.kind!=="MASTER"||scope.unit.id!==scope.master.id)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
      return scope;
    });
  }
  const root=await rootScope();
  const units=await getDb().select({id:merchantUnits.id}).from(merchantUnits).where(and(eq(merchantUnits.masterServiceId,root.masterService.id),or(eq(merchantUnits.id,primaryUnitId),eq(merchantUnits.masterId,primaryUnitId)))).orderBy(merchantUnits.displayName,merchantUnits.id);
  const workspaces=await Promise.all(units.map(unit=>getMerchantWorkspace(personId,unit.id)));
  const operations=await Promise.all(units.map(unit=>getMerchantOperations(personId,unit.id)));
  const current=await rootScope();
  const canReadPayments=evaluate(current.policy,"payments.read").allowed;
  const balances=canReadPayments?operations.flatMap(operation=>operation.availableFunds?[{merchantUnitId:operation.merchantUnitId,availableFunds:operation.availableFunds}]:[]):[];
  return {primary:{id:primaryUnitId,serviceId:root.masterService.id,displayName:root.masterService.displayName},units:workspaces.map(workspace=>workspace.merchant),channels:workspaces.flatMap(workspace=>workspace.channels),payments:canReadPayments?operations.flatMap(operation=>operation.payments).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)||a.id.localeCompare(b.id)):[],payouts:canReadPayments?operations.flatMap(operation=>operation.payouts).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)||a.id.localeCompare(b.id)):[],availableFunds:canReadPayments?formatMoney(balances.reduce((sum,balance)=>sum+BigInt(balance.availableFunds.minor),0n)):null,balances,canReadPayments};
}
/** A signed-in preview resolves no public payer or financial-service authority. */
export async function getMerchantCheckout(personId:string,channelId:string):Promise<MerchantCheckoutProjection> {
  channelId=uuid(channelId);
  const merchantUnitId=await getDb().transaction(async tx=>{
    await requireMerchantParticipant(tx,personId);
    const [hint]=await tx.select({merchantUnitId:paymentChannels.merchantUnitId}).from(paymentChannels).where(eq(paymentChannels.id,channelId));
    if(!hint)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    const scope=await loadMerchantUnitScope(tx,personId,hint.merchantUnitId);
    await channel(tx,scope,personId,channelId);
    return scope.unit.id;
  });
  const workspace=await getMerchantWorkspace(personId,merchantUnitId),operations=await getMerchantOperations(personId,merchantUnitId);
  const row=workspace.channels.find(item=>item.id===channelId),activation=operations.channels.find(item=>item.channelId===channelId);
  if(!row||!activation)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const previewUrl=new URL(`/pay/${row.id}`,getRuntimeConfig().publicOrigin).href;
  const qrDataUrl=row.presentations.includes("QR")?await QRCode.toDataURL(previewUrl,{width:256,margin:4,errorCorrectionLevel:"M",color:{dark:"#073b3f",light:"#ffffff"}}):null;
  return {workspace,channel:row,activation,previewUrl,qrDataUrl};
}
export async function configureTestGateway(personId:string,merchantUnitId:string,raw:ConfigureTestGatewayInput):Promise<TestGateway> {
  merchantUnitId=uuid(merchantUnitId);const input=parse(configureTestGatewaySchema,raw);
  return getDb().transaction(async tx=>{
    const unit=await loadMerchantUnitScope(tx,personId,merchantUnitId,true);
    const serviceId=unit.masterService.id,scopeKey=`service:${serviceId}`;
    await management(tx,personId,serviceId,true);
    const [profile]=await tx.select().from(merchantProfiles).where(eq(merchantProfiles.serviceId,serviceId));
    if(!profile||["RESTRICTED","DECLINED","CLOSED"].includes(profile.status))throw new SecurityError("MERCHANT_UNAVAILABLE",404);
    const receipt=await begin(tx,personId,scopeKey,"GATEWAY",input),[current]=await tx.select().from(testGateways).where(eq(testGateways.serviceId,serviceId));
    if(receipt.old)return gatewayProjection(serviceId,current);
    checkVersion(current?.version??0,input.expectedVersion);const now=await merchantNow(tx),mode=input.enabled?"TEST_READY":"DISABLED";
    const [saved]=current?await tx.update(testGateways).set({mode,version:current.version+1,updatedBy:personId,updatedAt:now}).where(eq(testGateways.serviceId,serviceId)).returning():await tx.insert(testGateways).values({serviceId,mode,updatedBy:personId,createdAt:now,updatedAt:now}).returning();
    await finish(tx,personId,scopeKey,"GATEWAY",input,receipt.digest,serviceId);return gatewayProjection(serviceId,saved);
  });
}
export async function enrollTestMerchant(personId:string,merchantUnitId:string,raw:EnrollTestMerchantInput):Promise<TestMerchantEnrollment> {
  merchantUnitId=uuid(merchantUnitId);const input=parse(enrollTestMerchantSchema,raw),scopeKey=`unit:${merchantUnitId}`;
  return getDb().transaction(async tx=>{
    const scope=await loadMerchantUnitScope(tx,personId,merchantUnitId,true);await management(tx,personId,scope.masterService.id,true);
    const receipt=await begin(tx,personId,scopeKey,"ENROLLMENT",input),config=await configuration(tx,scope);
    if(receipt.old)return enrollmentProjection(scope,config.enrollment);
    checkVersion(config.enrollment?.version??0,input.expectedVersion);
    if(!config.gateway||(input.enabled&&config.gateway.mode!=="TEST_READY"))throw new SecurityError("TEST_GATEWAY_NOT_READY",409);
    const now=await merchantNow(tx),status=input.enabled?"ENROLLED":"DISABLED";
    const [saved]=config.enrollment?await tx.update(testMerchantEnrollments).set({status,version:config.enrollment.version+1,updatedBy:personId,updatedAt:now}).where(eq(testMerchantEnrollments.merchantUnitId,merchantUnitId)).returning():await tx.insert(testMerchantEnrollments).values({merchantUnitId,serviceId:scope.masterService.id,status,updatedBy:personId,createdAt:now,updatedAt:now}).returning();
    await finish(tx,personId,scopeKey,"ENROLLMENT",input,receipt.digest,merchantUnitId);return enrollmentProjection(scope,saved);
  });
}
export async function setChannelActivation(personId:string,merchantUnitId:string,channelId:string,raw:ChannelActivationInput):Promise<ChannelActivation> {
  merchantUnitId=uuid(merchantUnitId);channelId=uuid(channelId);const input=parse(channelActivationSchema,raw),scopeKey=`channel:${channelId}`;
  return getDb().transaction(async tx=>{
    const scope=await loadMerchantUnitScope(tx,personId,merchantUnitId,true);requireAction(scope,"channels.update");await requireMerchantApplicant(tx,personId);
    const row=await channel(tx,scope,personId,channelId,true),receipt=await begin(tx,personId,scopeKey,"ACTIVATION",input),config=await configuration(tx,scope),now=await merchantNow(tx);
    const projected=await activationProjection(tx,scope,row,true,config.ready,now);
    if(receipt.old)return projected;
    checkVersion(row.version,input.expectedChannelVersion);
    checkVersion(projected.version,input.expectedVersion);
    if(input.active&&!projected.canActivate)throw new SecurityError(projected.state==="USED"?"CHANNEL_ALREADY_USED":"CHANNEL_NOT_READY",409);
    const [current]=await tx.select().from(channelActivations).where(eq(channelActivations.channelId,channelId));
    const status=input.active?"ACTIVE":"DISABLED";
    if(current)await tx.update(channelActivations).set({status,version:current.version+1,updatedBy:personId,updatedAt:now}).where(eq(channelActivations.channelId,channelId));
    else await tx.insert(channelActivations).values({channelId,merchantUnitId,serviceId:scope.masterService.id,status,updatedBy:personId,createdAt:now,updatedAt:now});
    await finish(tx,personId,scopeKey,"ACTIVATION",input,receipt.digest,channelId);return activationProjection(tx,scope,row,true,config.ready,now);
  });
}
/** Sole merchant payment persistence owner. Callers supply an already locked, currently authorized channel.
 * Guest authority is an exact persisted order, never an impersonated merchant person. */
export async function recordMerchantSandboxPayment(tx:ScopedTransaction,row:Channel,authority:{kind:"MERCHANT";actorId:string;guestOrderId:null}|{kind:"GUEST_ORDER";actorId:null;guestOrderId:string},outcome:"APPROVED"|"DECLINED",gatewayVersion:number,enrollmentVersion:number,now:Date):Promise<Payment>{
  const id=randomUUID(),result=testPayment(id,outcome);
  const journalId=result.outcome==="APPROVED"?await postJournal(tx,{businessKey:`merchant-payment:${id}`,kind:"MERCHANT_PAYMENT",referenceId:id,lines:[{serviceId:row.serviceId,merchantUnitId:row.merchantUnitId,bucket:"GATEWAY_CLEARING",deltaMinor:-row.amountMinor},{serviceId:row.serviceId,merchantUnitId:row.merchantUnitId,bucket:"MERCHANT_AVAILABLE",deltaMinor:row.amountMinor}]}):null;
  const [saved]=await tx.insert(merchantTestPayments).values({id,serviceId:row.serviceId,merchantUnitId:row.merchantUnitId,channelId:row.id,actorId:authority.actorId,guestOrderId:authority.guestOrderId,channelVersion:row.version,channelUsage:row.usage,description:row.description,amountMinor:row.amountMinor,currency:"USD",outcome:result.outcome,testReference:result.testReference,gatewayVersion,enrollmentVersion,journalId,createdAt:now}).returning();
  return saved!;
}
export async function simulateMerchantPayment(personId:string,merchantUnitId:string,channelId:string,raw:SimulateMerchantPaymentInput):Promise<MerchantTestPayment> {
  merchantUnitId=uuid(merchantUnitId);channelId=uuid(channelId);const input=parse(simulateMerchantPaymentSchema,raw),scopeKey=`channel:${channelId}`;
  return getDb().transaction(async tx=>{
    const scope=await loadMerchantUnitScope(tx,personId,merchantUnitId,true);requireAction(scope,"payments.simulate");await requireMerchantApplicant(tx,personId);
    const row=await channel(tx,scope,personId,channelId,true),receipt=await begin(tx,personId,scopeKey,"PAYMENT",input),canRefund=await refundAuthority(tx,scope,personId);
    if(receipt.old) {const old=await readPayment(tx,scope,receipt.old.resultId),[refund]=await tx.select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,old.id));return paymentProjection(old,refund,canRefund);}
    checkVersion(row.version,input.expectedChannelVersion);
    const config=await configuration(tx,scope),now=await merchantNow(tx),activation=await activationProjection(tx,scope,row,true,config.ready,now);
    if(!activation.canSimulate)throw new SecurityError(activation.state==="USED"?"CHANNEL_ALREADY_USED":"CHANNEL_NOT_READY",409);
    const saved=await recordMerchantSandboxPayment(tx,row,{kind:"MERCHANT",actorId:personId,guestOrderId:null},input.outcome,config.gateway!.version,config.enrollment!.version,now);
    const id=saved.id;
    await finish(tx,personId,scopeKey,"PAYMENT",input,receipt.digest,id);return paymentProjection(saved!,undefined,canRefund);
  });
}
export async function refundMerchantPayment(personId:string,merchantUnitId:string,paymentId:string,raw:RefundMerchantPaymentInput):Promise<MerchantTestPayment> {
  merchantUnitId=uuid(merchantUnitId);paymentId=uuid(paymentId);const input=parse(refundMerchantPaymentSchema,raw),scopeKey=`payment:${paymentId}`;
  return getDb().transaction(async tx=>{
    const scope=await loadMerchantUnitScope(tx,personId,merchantUnitId,true);requireAction(scope,"payments.refund");await responsible(tx,personId,scope.masterService.id,true);await requireMerchantApplicant(tx,personId);
    const payment=await readPayment(tx,scope,paymentId),receipt=await begin(tx,personId,scopeKey,"REFUND",input),[current]=await tx.select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,paymentId));
    if(receipt.old)return paymentProjection(payment,current,true);
    checkVersion(current?2:1,input.expectedVersion);
    if(payment.outcome!=="APPROVED"||current)throw new SecurityError("PAYMENT_NOT_REFUNDABLE",409);
    const id=randomUUID(),result=testRefund(id),now=await merchantNow(tx);
    const journalId=await postJournal(tx,{businessKey:`merchant-refund:${paymentId}`,kind:"MERCHANT_REFUND",referenceId:id,lines:[{serviceId:scope.masterService.id,merchantUnitId,bucket:"MERCHANT_AVAILABLE",deltaMinor:-payment.amountMinor},{serviceId:scope.masterService.id,merchantUnitId,bucket:"GATEWAY_CLEARING",deltaMinor:payment.amountMinor}]});
    const [saved]=await tx.insert(merchantTestRefunds).values({id,paymentId,merchantUnitId,serviceId:scope.masterService.id,actorId:personId,amountMinor:payment.amountMinor,currency:"USD",reason:input.reason,testReference:result.testReference,journalId,createdAt:now}).returning();
    await finish(tx,personId,scopeKey,"REFUND",input,receipt.digest,id);return paymentProjection(payment,saved,true);
  });
}
export async function createMerchantPayout(personId:string,merchantUnitId:string,raw:MerchantPayoutInput):Promise<MerchantTestPayout> {
  merchantUnitId=uuid(merchantUnitId);const input=parse(merchantPayoutSchema,raw),scopeKey=`unit:${merchantUnitId}`;
  return getDb().transaction(async tx=>{
    const scope=await loadMerchantUnitScope(tx,personId,merchantUnitId,true);requireAction(scope,"payouts.manage");await responsible(tx,personId,scope.masterService.id,true);await requireMerchantApplicant(tx,personId);
    const receipt=await begin(tx,personId,scopeKey,"PAYOUT",input);
    if(receipt.old) {const [old]=await tx.select().from(merchantTestPayouts).where(and(eq(merchantTestPayouts.id,receipt.old.resultId),eq(merchantTestPayouts.merchantUnitId,merchantUnitId)));if(!old)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return payoutProjection(old);}
    const config=await configuration(tx,scope);if(!config.ready)throw new SecurityError("TEST_GATEWAY_NOT_READY",409);
    const id=randomUUID(),amountMinor=BigInt(input.amountMinor),result=testPayout(id),now=await merchantNow(tx);
    const journalId=await postJournal(tx,{businessKey:`merchant-payout:${id}`,kind:"MERCHANT_PAYOUT",referenceId:id,lines:[{serviceId:scope.masterService.id,merchantUnitId,bucket:"MERCHANT_AVAILABLE",deltaMinor:-amountMinor},{serviceId:scope.masterService.id,merchantUnitId,bucket:"PAYOUT_CLEARING",deltaMinor:amountMinor}]});
    const [saved]=await tx.insert(merchantTestPayouts).values({id,serviceId:scope.masterService.id,merchantUnitId,actorId:personId,amountMinor,currency:"USD",testReference:result.testReference,journalId,createdAt:now}).returning();
    await finish(tx,personId,scopeKey,"PAYOUT",input,receipt.digest,id);return payoutProjection(saved!);
  });
}
