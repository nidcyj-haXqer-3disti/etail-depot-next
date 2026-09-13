import {createHash,randomBytes,randomUUID} from "node:crypto";
import {and,desc,eq,isNull,lt,sql} from "drizzle-orm";
import {z} from "zod";
import {getDb} from "../../platform/database/client";
import {getRuntimeConfig} from "../../platform/config";
import {SecurityError} from "../../platform/security/origin";
import {loadTerminalScope,merchantNow} from "../access/merchant-scope";
import type {ScopedTransaction} from "../access/scope";
import {requireMerchantApplicant} from "../services/merchant-eligibility";
import {evaluate} from "../policy/evaluate";
import {formatMoney} from "../workspace/service";
import {networkPaymentOperations} from "./network-schema";
import {paymentChannels} from "./schema";
import {channelActivations,testGateways,testMerchantEnrollments,merchantTestPayments,merchantTestRefunds,merchantOperationCommands} from "./operations-schema";
import {guestPublications,guestPublicationCommands,guestSessions,guestOrders,guestAttempts,guestRequestBudgets} from "./guest-schema";
import {publishGuestChannelSchema,revokeGuestPublicationSchema,type PublishGuestChannelInput,type RevokeGuestPublicationInput,type GuestPublication,type GuestPublicationManagement,type PublicGuestRequest,type GuestOrderProjection} from "./guest-contracts";

type Scope=Awaited<ReturnType<typeof loadTerminalScope>>;
type Publication=typeof guestPublications.$inferSelect;
type Order=typeof guestOrders.$inferSelect;
type GuestSession=typeof guestSessions.$inferSelect;
const hash=(value:string)=>createHash("sha256").update(value).digest("hex");
const digest=(value:unknown)=>hash(JSON.stringify(value));
function id(value:string){if(!z.uuid().safeParse(value).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return value.toLowerCase();}
function parse<T>(schema:z.ZodType<T>,raw:unknown):T{const result=schema.safeParse(raw);if(!result.success)throw new SecurityError("INVALID_REQUEST",422);return result.data;}
function denied(){return new SecurityError("GUEST_PAYMENT_UNAVAILABLE",409);}
function guestCookieName(){return getRuntimeConfig().publicOrigin.startsWith("https:")?"__Host-etail_guest":"etail_guest";}
function cookieToken(header:string|null){
 if(header&&header.length>16384)return null;
 const values=(header??"").split(";").map(value=>value.trim()).filter(value=>value.startsWith(`${guestCookieName()}=`)).map(value=>value.slice(value.indexOf("=")+1));
 return values.length===1&&/^[A-Za-z0-9_-]{43}$/.test(values[0])?values[0]:null;
}
export async function requireGuestSession(tx:ScopedTransaction,cookieHeader:string|null):Promise<GuestSession>{
 const token=cookieToken(cookieHeader);if(!token)throw new SecurityError("GUEST_SESSION_REQUIRED",401);
 const [row]=await tx.select().from(guestSessions).where(eq(guestSessions.tokenHash,hash(token))).for("share");
 if(!row||row.expiresAt<=await merchantNow(tx))throw new SecurityError("GUEST_SESSION_REQUIRED",401);return row;
}
/** Durable public-write budgets are independent of identity/email limits; only hashes are retained. */
export async function consumeGuestBudget(keys:string[]){
 await getDb().transaction(async tx=>{
  const now=await merchantNow(tx),budgets=[{key:hash("guest-global"),limit:600},...keys.map(key=>({key:hash(`guest:${key}`),limit:60}))].sort((a,b)=>a.key.localeCompare(b.key));
  for(const budget of budgets)await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"guest-budget:"+budget.key},0))`);
  await tx.delete(guestRequestBudgets).where(lt(guestRequestBudgets.windowStartedAt,new Date(now.getTime()-86400000)));
  for(const budget of budgets){const [old]=await tx.select().from(guestRequestBudgets).where(eq(guestRequestBudgets.key,budget.key));const current=!!old&&old.windowStartedAt.getTime()>now.getTime()-60000;
   if(current&&old.attempts>=budget.limit)throw new SecurityError("GUEST_RATE_LIMITED",429);
   if(old)await tx.update(guestRequestBudgets).set({attempts:current?old.attempts+1:1,windowStartedAt:current?old.windowStartedAt:now}).where(eq(guestRequestBudgets.key,budget.key));
   else await tx.insert(guestRequestBudgets).values({key:budget.key,attempts:1,windowStartedAt:now});
  }
 });
}
/** Return the cookie only to a trusted HTTP Set-Cookie caller; never include it in a projection. */
export async function ensureGuestSession(cookieHeader:string|null):Promise<{setCookie:string|null}>{
 getRuntimeConfig();
 try{await getDb().transaction(tx=>requireGuestSession(tx,cookieHeader));return {setCookie:null};}catch(error){if(!(error instanceof SecurityError&&error.code==="GUEST_SESSION_REQUIRED"))throw error;}
 await consumeGuestBudget(["session-create"]);
 const token=randomBytes(32).toString("base64url");
 await getDb().transaction(async tx=>{const now=await merchantNow(tx);await tx.insert(guestSessions).values({id:randomUUID(),tokenHash:hash(token),createdAt:now,expiresAt:new Date(now.getTime()+86400000)});});
 return {setCookie:`${guestCookieName()}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400${getRuntimeConfig().publicOrigin.startsWith("https:")?"; Secure":""}`};
}
function lineage(scope:Scope){
 return digest({ownerPersonId:scope.merchantService.primaryPersonId,ownerMembershipVersion:scope.ownerMember?.version,terminalId:scope.terminal.id,terminalVersion:scope.terminal.version,serviceVersion:scope.merchantService.version,owner:scope.ownerAccess,grants:[...scope.grants].sort(),assignment:scope.assignment?{id:scope.assignment.id,version:scope.assignment.version,ownerMembershipVersion:scope.assignment.ownerMembershipVersion,expiresAt:scope.assignment.expiresAt?.toISOString()??null}:null});
}
async function merchantContext(tx:ScopedTransaction,personId:string,merchantId:string,channelId:string,forWrite=false){
 const scope=await loadTerminalScope(tx,personId,merchantId,forWrite,{read:!forWrite});
 if(!evaluate(scope.policy,"channels.read").allowed)throw new SecurityError("ACTION_DENIED",403);
 const query=tx.select().from(paymentChannels).where(and(eq(paymentChannels.id,channelId),eq(paymentChannels.merchantUnitId,merchantId),eq(paymentChannels.serviceId,scope.merchantService.id)));
 const [channel]=forWrite?await query.for("update"):await query;
 if(!channel)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
 const [gateway]=await tx.select().from(testGateways).where(eq(testGateways.serviceId,scope.merchantService.id));
 const [enrollment]=await tx.select().from(testMerchantEnrollments).where(eq(testMerchantEnrollments.merchantUnitId,merchantId));
 const [activation]=await tx.select().from(channelActivations).where(eq(channelActivations.channelId,channelId));
 const [used]=channel.usage==="ONE_TIME"?await tx.select({id:merchantTestPayments.id}).from(merchantTestPayments).where(and(eq(merchantTestPayments.channelId,channelId),eq(merchantTestPayments.outcome,"APPROVED"))).limit(1):[];
 const [reserved]=channel.usage==="ONE_TIME"?await tx.select({id:networkPaymentOperations.id}).from(networkPaymentOperations).where(eq(networkPaymentOperations.channelId,channelId)).limit(1):[];
 let adult=true;try{await requireMerchantApplicant(tx,personId);}catch(error){if(error instanceof SecurityError&&[403,404].includes(error.status))adult=false;else throw error;}
 const now=await merchantNow(tx),canShare=adult&&evaluate(scope.policy,"channels.share").allowed;
 const ready=canShare&&channel.status==="DRAFT"&&channel.expiresAt>now&&!Boolean(used)&&!Boolean(reserved)&&gateway?.mode==="TEST_READY"&&enrollment?.status==="ENROLLED"&&activation?.status==="ACTIVE";
 return {scope,channel,gateway,enrollment,activation,ready,canShare,now};
}
export async function publicationContext(tx:ScopedTransaction,row:Publication,forWrite=false){
 try{
  const current=await merchantContext(tx,row.publisherId,row.merchantUnitId,row.channelId,forWrite);
  if(forWrite){const [latest]=await tx.select().from(guestPublications).where(eq(guestPublications.id,row.id)).for("share");if(!latest)return null;row=latest;}
  const ready=current.ready&&!row.revokedAt&&row.expiresAt>current.now&&row.channelVersion===current.channel.version&&row.activationVersion===current.activation?.version&&row.gatewayVersion===current.gateway?.version&&row.enrollmentVersion===current.enrollment?.version&&row.authorityDigest===lineage(current.scope);
  return {...current,ready};
 }catch(error){if(error instanceof SecurityError&&[403,404].includes(error.status))return null;throw error;}
}
function publicationProjection(row:Publication,available:boolean):GuestPublication{return {id:row.id,version:row.version,state:row.revokedAt?"REVOKED":available?"AVAILABLE":"UNAVAILABLE",publicHref:new URL(`/checkout/${row.id}`,getRuntimeConfig().publicOrigin).href,merchantName:row.merchantName,primaryMerchantName:row.primaryMerchantName,description:row.description,amount:formatMoney(row.amountMinor),usage:row.usage,expiresAt:row.expiresAt.toISOString(),mode:"SANDBOX",feeStatus:"NOT_APPLIED"};}
async function managementProjection(tx:ScopedTransaction,personId:string,merchantId:string,channelId:string):Promise<GuestPublicationManagement>{
 const current=await merchantContext(tx,personId,merchantId,channelId);
 const [publication]=await tx.select().from(guestPublications).where(eq(guestPublications.channelId,channelId)).orderBy(desc(guestPublications.createdAt),desc(guestPublications.id)).limit(1);
 const live=publication?(await publicationContext(tx,publication))?.ready??false:false;
 return {channelId,publication:publication?publicationProjection(publication,live):null,canPublish:current.ready&&!live,canRevoke:current.canShare&&!!publication&&!publication.revokedAt};
}
export async function getGuestPublicationManagement(personId:string,merchantId:string,channelId:string){merchantId=id(merchantId);channelId=id(channelId);return getDb().transaction(tx=>managementProjection(tx,personId,merchantId,channelId),{isolationLevel:"repeatable read"});}
export async function publishGuestChannel(personId:string,merchantId:string,channelId:string,raw:PublishGuestChannelInput):Promise<GuestPublicationManagement>{
 merchantId=id(merchantId);channelId=id(channelId);const input=parse(publishGuestChannelSchema,raw),requestDigest=digest({personId,merchantId,channelId,input});
 return getDb().transaction(async tx=>{
  const current=await merchantContext(tx,personId,merchantId,channelId,true);if(!current.canShare)throw new SecurityError("ACTION_DENIED",403);
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"guest-publication-command:"+input.commandId},0))`);
  const [receipt]=await tx.select().from(guestPublicationCommands).where(eq(guestPublicationCommands.commandId,input.commandId));
  if(receipt){if(receipt.actorId!==personId||receipt.kind!=="PUBLISH"||receipt.digest!==requestDigest)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return managementProjection(tx,personId,merchantId,channelId);}
  if(current.channel.version!==input.expectedChannelVersion)throw new SecurityError("STALE_VERSION",409);if(!current.ready)throw denied();
  const [old]=await tx.select().from(guestPublications).where(and(eq(guestPublications.channelId,channelId),isNull(guestPublications.revokedAt))).for("update");
  if(old&&(await publicationContext(tx,old))?.ready)throw new SecurityError("CHANNEL_ALREADY_PUBLISHED",409);
  if(old)await tx.update(guestPublications).set({revokedAt:current.now,version:old.version+1}).where(eq(guestPublications.id,old.id));
  const publicationId=randomUUID();
  await tx.insert(guestPublications).values({id:publicationId,channelId,merchantUnitId:merchantId,serviceId:current.scope.merchantService.id,publisherId:personId,authorityDigest:lineage(current.scope),requestDigest,channelVersion:current.channel.version,activationVersion:current.activation!.version,gatewayVersion:current.gateway!.version,enrollmentVersion:current.enrollment!.version,merchantName:current.scope.terminal.displayName,primaryMerchantName:current.scope.merchantService.displayName,description:current.channel.description,amountMinor:current.channel.amountMinor,currency:"USD",usage:current.channel.usage,createdAt:current.now,expiresAt:current.channel.expiresAt});
  await tx.insert(guestPublicationCommands).values({commandId:input.commandId,publicationId,actorId:personId,kind:"PUBLISH",digest:requestDigest,createdAt:current.now});
  return managementProjection(tx,personId,merchantId,channelId);
 });
}
export async function revokeGuestPublication(personId:string,merchantId:string,channelId:string,publicationId:string,raw:RevokeGuestPublicationInput){
 merchantId=id(merchantId);channelId=id(channelId);publicationId=id(publicationId);const input=parse(revokeGuestPublicationSchema,raw),requestDigest=digest({personId,merchantId,channelId,publicationId,input});
 return getDb().transaction(async tx=>{
  const current=await merchantContext(tx,personId,merchantId,channelId,true);if(!current.canShare)throw new SecurityError("ACTION_DENIED",403);
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"guest-publication-command:"+input.commandId},0))`);
  const [row]=await tx.select().from(guestPublications).where(and(eq(guestPublications.id,publicationId),eq(guestPublications.channelId,channelId))).for("update");if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const [receipt]=await tx.select().from(guestPublicationCommands).where(eq(guestPublicationCommands.commandId,input.commandId));
  if(receipt){if(receipt.actorId!==personId||receipt.kind!=="REVOKE"||receipt.digest!==requestDigest||receipt.publicationId!==publicationId)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);return {...await managementProjection(tx,personId,merchantId,channelId),revocation:{commandId:receipt.commandId,publicationId:receipt.publicationId,status:"REVOKED" as const,confirmedAt:receipt.createdAt.toISOString()}};}
  if(row.version!==input.expectedVersion)throw new SecurityError("STALE_VERSION",409);if(row.revokedAt)throw denied();
  await tx.update(guestPublications).set({revokedAt:current.now,version:row.version+1}).where(eq(guestPublications.id,row.id));
  await tx.insert(guestPublicationCommands).values({commandId:input.commandId,publicationId,actorId:personId,kind:"REVOKE",digest:requestDigest,createdAt:current.now});return {...await managementProjection(tx,personId,merchantId,channelId),revocation:{commandId:input.commandId,publicationId,status:"REVOKED" as const,confirmedAt:current.now.toISOString()}};
 });
}
export async function getPublicGuestRequest(publicationId:string):Promise<PublicGuestRequest>{
 publicationId=id(publicationId);return getDb().transaction(async tx=>{const [row]=await tx.select().from(guestPublications).where(eq(guestPublications.id,publicationId));if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);const ready=(await publicationContext(tx,row))?.ready??false;return {publication:publicationProjection(row,ready),canStart:ready};},{isolationLevel:"repeatable read"});
}
async function ownedOrder(tx:ScopedTransaction,guest:GuestSession,orderId:string,forWrite=false){
 const query=tx.select().from(guestOrders).where(and(eq(guestOrders.id,orderId),eq(guestOrders.guestSessionId,guest.id)));const [row]=forWrite?await query.for("update"):await query;
 if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return row;
}
async function orderProjection(tx:ScopedTransaction,guest:GuestSession,order:Order):Promise<GuestOrderProjection>{
 const attempts=await tx.select().from(guestAttempts).where(eq(guestAttempts.orderId,order.id)).orderBy(desc(guestAttempts.sequence));const attempt=attempts[0];
 const [command]=attempt?await tx.select().from(merchantOperationCommands).where(and(eq(merchantOperationCommands.commandId,attempt.id),eq(merchantOperationCommands.guestOrderId,order.id))):[];
 const [payment]=command?await tx.select().from(merchantTestPayments).where(and(eq(merchantTestPayments.id,command.resultId),eq(merchantTestPayments.guestOrderId,order.id))):[];
 const [refund]=payment?await tx.select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,payment.id)):[];
 const [publication]=await tx.select().from(guestPublications).where(eq(guestPublications.id,order.publicationId));const now=await merchantNow(tx);
 const ready=order.expiresAt>now&&!!publication&&(await publicationContext(tx,publication))?.ready===true;
 const status=payment?(refund?"REFUNDED":payment.outcome):!ready?"UNAVAILABLE":attempt?"REVIEW":"READY";
 return {id:order.id,version:attempts.length+1,publicationId:order.publicationId,merchantName:order.merchantName,primaryMerchantName:order.primaryMerchantName,description:order.description,amount:formatMoney(order.amountMinor),expiresAt:order.expiresAt.toISOString(),receiptAccessExpiresAt:guest.expiresAt.toISOString(),createdAt:order.createdAt.toISOString(),status,canPrepare:false,canConfirm:false,freshRequestHref:`/checkout/${order.publicationId}`,mode:"SANDBOX",feeStatus:"NOT_APPLIED",attempt:attempt?{id:attempt.id,outcome:attempt.outcome,createdAt:attempt.createdAt.toISOString()}:null,receipt:payment?{paymentId:payment.id,reference:payment.testReference,status:refund?"REFUNDED":payment.outcome,amount:formatMoney(payment.amountMinor),createdAt:payment.createdAt.toISOString(),refund:refund?{amount:formatMoney(refund.amountMinor),reference:refund.testReference,createdAt:refund.createdAt.toISOString()}:null}:null};
}
export async function getGuestOrder(cookieHeader:string|null,orderId:string){orderId=id(orderId);return getDb().transaction(async tx=>{const guest=await requireGuestSession(tx,cookieHeader);return orderProjection(tx,guest,await ownedOrder(tx,guest,orderId));},{isolationLevel:"repeatable read"});}
