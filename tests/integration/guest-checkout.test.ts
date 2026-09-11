import {createHash,randomBytes,randomUUID} from "node:crypto";
import {and,eq,sql} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {ledgerEntries} from "../../src/modules/ledger/schema";
import {merchantAssignments} from "../../src/modules/access/schema";
import {createMerchantInvitation,revokeMerchantAccess} from "../../src/modules/access/merchant-service";
import {acceptInvitation} from "../../src/modules/access/service";
import {MERCHANT_PERMISSIONS} from "../../src/modules/access/merchant-contracts";
import {paymentChannels} from "../../src/modules/acquiring/schema";
import {guestAttempts,guestOrders,guestPublications,guestSessions} from "../../src/modules/acquiring/guest-schema";
import {merchantOperationCommands,merchantTestPayments} from "../../src/modules/acquiring/operations-schema";
import {createChannel,updateChannel,pauseMerchant} from "../../src/modules/acquiring/service";
import {configureTestGateway,enrollTestMerchant,setChannelActivation,refundMerchantPayment,simulateMerchantPayment} from "../../src/modules/acquiring/operations-service";
import {ensureGuestSession,publishGuestChannel,revokeGuestPublication,getGuestPublicationManagement,getPublicGuestRequest,createGuestOrder,getGuestOrder,prepareGuestAttempt,confirmGuestAttempt} from "../../src/modules/acquiring/guest-service";
import {guestOrderProjectionSchema,guestPublicationManagementSchema,publicGuestRequestSchema} from "../../src/modules/acquiring/guest-contracts";
import {merchantAccessFixture,merchantOffer} from "../helpers/merchant-access";
import {paymentInput} from "../helpers/acquiring";
afterAll(closeDatabase);
async function browser(){const result=await ensureGuestSession(null);if(!result.setCookie)throw new Error("Guest session was not created");return result.setCookie.split(";")[0];}
async function ready(usage:"ONE_TIME"|"REUSABLE"="REUSABLE"){
 const f=await merchantAccessFixture();await configureTestGateway(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});await enrollTestMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
 const fields={...paymentInput(),usage,description:"Guest ceramic order",presentations:["WEB" as const,"QR" as const],visibility:"CREATOR_PRIVATE" as const};
 const channel=await createChannel(f.operator.personId,f.unit.id,fields);await setChannelActivation(f.operator.personId,f.unit.id,channel.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:channel.version,active:true});
 const input={commandId:randomUUID(),expectedChannelVersion:channel.version};const managed=guestPublicationManagementSchema.parse(await publishGuestChannel(f.operator.personId,f.unit.id,channel.id,input));
 return {...f,channel,fields,publishInput:input,publication:managed.publication!};
}
async function review(cookie:string,publicationId:string,outcome:"APPROVED"|"DECLINED"="APPROVED"){
 const create={commandId:randomUUID()},order=await createGuestOrder(cookie,publicationId,create),prepare={commandId:randomUUID(),expectedVersion:order.version,outcome};
 const reviewed=await prepareGuestAttempt(cookie,order.id,prepare);return {order,reviewed,create,prepare};
}

it("persists guest review/receipt and retries one canonical payment without a person or financial authority",async()=>{
 const f=await ready(),cookie=await browser();
 const publicRequest=publicGuestRequestSchema.parse(await getPublicGuestRequest(f.publication.id));expect(publicRequest.canStart).toBe(true);expect(publicRequest.publication.amount.minor).toBe("1250");
 expect(Object.keys(publicRequest.publication)).not.toContain("serviceId");expect(Object.keys(publicRequest.publication)).not.toContain("publisherId");
 expect((await publishGuestChannel(f.operator.personId,f.unit.id,f.channel.id,f.publishInput)).publication?.id).toBe(f.publication.id);
 const r=await review(cookie,f.publication.id);expect(r.reviewed).toMatchObject({status:"REVIEW",canConfirm:true,attempt:{id:r.prepare.commandId},receipt:null});
 expect((await createGuestOrder(cookie,f.publication.id,r.create)).id).toBe(r.order.id);expect((await prepareGuestAttempt(cookie,r.order.id,r.prepare)).attempt?.id).toBe(r.prepare.commandId);
 await expect(prepareGuestAttempt(cookie,r.order.id,{...r.prepare,outcome:"DECLINED"})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
 const results=await Promise.all([confirmGuestAttempt(cookie,r.order.id,r.prepare.commandId),confirmGuestAttempt(cookie,r.order.id,r.prepare.commandId)]);
 expect(new Set(results.map(result=>result.receipt?.paymentId)).size).toBe(1);const paid=guestOrderProjectionSchema.parse(await getGuestOrder(cookie,r.order.id));expect(paid).toMatchObject({status:"APPROVED",canConfirm:false,canPrepare:false,receipt:{amount:{minor:"1250"}}});
 const [payment]=await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.id,paid.receipt!.paymentId));expect(payment).toMatchObject({actorId:null,guestOrderId:r.order.id});
 const entries=await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,f.merchant.serviceId));expect(entries).toHaveLength(2);
 const stopped=await revokeGuestPublication(f.operator.personId,f.unit.id,f.channel.id,f.publication.id,{commandId:randomUUID(),expectedVersion:f.publication.version});expect(stopped.publication?.state).toBe("REVOKED");
 expect((await confirmGuestAttempt(cookie,r.order.id,r.prepare.commandId)).receipt?.paymentId).toBe(paid.receipt?.paymentId);
 await refundMerchantPayment(f.merchant.personId,f.unit.id,paid.receipt!.paymentId,{commandId:randomUUID(),expectedVersion:1,reason:"Guest requested sandbox refund"});
 expect(await getGuestOrder(cookie,r.order.id)).toMatchObject({status:"REFUNDED",canPrepare:false,receipt:{status:"REFUNDED",refund:{amount:{minor:"1250"}}}});
 await expect(simulateMerchantPayment(f.helper.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedChannelVersion:f.channel.version,outcome:"APPROVED"})).rejects.toMatchObject({status:404});
});

it("isolates guest browsers, supports separate reusable orders and persists a declined attempt before a new review",async()=>{
 const f=await ready(),a=await browser(),b=await browser(),r=await review(a,f.publication.id,"DECLINED");
 await expect(getGuestOrder(null,r.order.id)).rejects.toMatchObject({code:"GUEST_SESSION_REQUIRED"});await expect(getGuestOrder(b,r.order.id)).rejects.toMatchObject({status:404});
 await expect(confirmGuestAttempt(b,r.order.id,r.prepare.commandId)).rejects.toMatchObject({status:404});await expect(getGuestOrder(`${a}; ${a}`,r.order.id)).rejects.toMatchObject({code:"GUEST_SESSION_REQUIRED"});
 await expect(createGuestOrder(b,f.publication.id,r.create)).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
 const declined=await confirmGuestAttempt(a,r.order.id,r.prepare.commandId);expect(declined).toMatchObject({status:"DECLINED",canPrepare:true,receipt:{status:"DECLINED"}});
 expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,f.merchant.serviceId))).toEqual([]);
 const second=await prepareGuestAttempt(a,r.order.id,{commandId:randomUUID(),expectedVersion:declined.version,outcome:"APPROVED"});await confirmGuestAttempt(a,r.order.id,second.attempt!.id);
 const other=await review(b,f.publication.id);await confirmGuestAttempt(b,other.order.id,other.prepare.commandId);
 const payments=await getDb().select().from(merchantTestPayments).where(and(eq(merchantTestPayments.merchantUnitId,f.unit.id),eq(merchantTestPayments.outcome,"APPROVED")));expect(payments).toHaveLength(2);expect(new Set(payments.map(payment=>payment.guestOrderId)).size).toBe(2);
 expect(await ensureGuestSession(a)).toEqual({setCookie:null});
});

it("allows exactly one approved order on a one-time channel under simultaneous guest confirmations",async()=>{
 const f=await ready("ONE_TIME"),a=await browser(),b=await browser(),first=await review(a,f.publication.id),second=await review(b,f.publication.id);
 const results=await Promise.allSettled([confirmGuestAttempt(a,first.order.id,first.prepare.commandId),confirmGuestAttempt(b,second.order.id,second.prepare.commandId)]);
 expect(results.filter(result=>result.status==="fulfilled")).toHaveLength(1);expect(results.filter(result=>result.status==="rejected")).toHaveLength(1);
 expect(await getDb().select().from(merchantTestPayments).where(and(eq(merchantTestPayments.channelId,f.channel.id),eq(merchantTestPayments.outcome,"APPROVED")))).toHaveLength(1);
 expect((await getPublicGuestRequest(f.publication.id)).canStart).toBe(false);
});

it("invalidates channel revisions and publisher lineage without changing the immutable reviewed order",async()=>{
 const f=await ready(),cookie=await browser(),r=await review(cookie,f.publication.id);
 await setChannelActivation(f.operator.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedVersion:1,expectedChannelVersion:f.channel.version,active:false});
 const edited=await updateChannel(f.operator.personId,f.unit.id,f.channel.id,{...f.fields,commandId:randomUUID(),expectedVersion:f.channel.version,amountMinor:"2500"});
 await setChannelActivation(f.operator.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedVersion:2,expectedChannelVersion:edited.version,active:true});
 expect((await getGuestOrder(cookie,r.order.id)).amount.minor).toBe("1250");expect((await getPublicGuestRequest(f.publication.id)).canStart).toBe(false);await expect(confirmGuestAttempt(cookie,r.order.id,r.prepare.commandId)).rejects.toMatchObject({code:"GUEST_PAYMENT_UNAVAILABLE"});
 const next=await publishGuestChannel(f.operator.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedChannelVersion:edited.version});expect(next.publication?.amount.minor).toBe("2500");expect(next.publication?.id).not.toBe(f.publication.id);
 const nextOrder=await review(cookie,next.publication!.id);
 await getDb().update(merchantAssignments).set({state:"REVOKED",version:2,revokedAt:new Date()}).where(and(eq(merchantAssignments.personId,f.operator.personId),eq(merchantAssignments.merchantUnitId,f.unit.id)));
 await expect(confirmGuestAttempt(cookie,nextOrder.order.id,nextOrder.prepare.commandId)).rejects.toMatchObject({code:"GUEST_PAYMENT_UNAVAILABLE"});expect((await getPublicGuestRequest(next.publication!.id)).canStart).toBe(false);
 expect((await getGuestPublicationManagement(f.merchant.personId,f.unit.id,f.channel.id)).canPublish).toBe(true);
 expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,f.merchant.serviceId))).toEqual([]);
});

it("enforces immutable guest snapshots, exact actor/order origins, expired sessions and paused payment acceptance",async()=>{
 const f=await ready(),cookie=await browser(),r=await review(cookie,f.publication.id);
 await expect(getDb().update(guestOrders).set({amountMinor:1n}).where(eq(guestOrders.id,r.order.id))).rejects.toThrow();
 await expect(getDb().update(guestAttempts).set({outcome:"DECLINED"}).where(eq(guestAttempts.id,r.prepare.commandId))).rejects.toThrow();
 await expect(getDb().update(guestPublications).set({description:"Changed after publication"}).where(eq(guestPublications.id,f.publication.id))).rejects.toThrow();
 await expect(getDb().insert(merchantOperationCommands).values({commandId:randomUUID(),actorId:f.operator.personId,guestOrderId:r.order.id,scopeKey:`guest-order:${r.order.id}`,kind:"PAYMENT",digest:"0".repeat(64),resultId:randomUUID()})).rejects.toThrow();
 await expect(getDb().insert(merchantOperationCommands).values({commandId:randomUUID(),actorId:null,guestOrderId:null,scopeKey:`guest-order:${r.order.id}`,kind:"PAYMENT",digest:"0".repeat(64),resultId:randomUUID()})).rejects.toThrow();
 await pauseMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:f.unit.version,reason:"Pause guest acceptance"});await expect(confirmGuestAttempt(cookie,r.order.id,r.prepare.commandId)).rejects.toMatchObject({code:"GUEST_PAYMENT_UNAVAILABLE"});
 const expiredToken=randomBytes(32).toString("base64url");await getDb().insert(guestSessions).values({id:randomUUID(),tokenHash:createHash("sha256").update(expiredToken).digest("hex"),createdAt:new Date(Date.now()-7200000),expiresAt:new Date(Date.now()-3600000)});
 await expect(getGuestOrder(`etail_guest=${expiredToken}`,r.order.id)).rejects.toMatchObject({code:"GUEST_SESSION_REQUIRED"});
 const snapshot=await getDb().execute(sql`select count(*)::int as total from merchant_guest_orders where id=${r.order.id}`);expect(snapshot.rows[0].total).toBe(1);
 expect((await getDb().select().from(paymentChannels).where(eq(paymentChannels.id,f.channel.id)))[0].amountMinor).toBe(1250n);
});

it("does not revive an old publication after canonical revocation and same-permission reinvitation",async()=>{
 const f=await ready(),cookie=await browser(),r=await review(cookie,f.publication.id);
 const [assignment]=await getDb().select().from(merchantAssignments).where(and(eq(merchantAssignments.personId,f.operator.personId),eq(merchantAssignments.merchantUnitId,f.unit.id),eq(merchantAssignments.state,"ACCEPTED")));
 await revokeMerchantAccess(f.merchant.personId,f.unit.id,assignment.id,{commandId:randomUUID(),expectedVersion:assignment.version});
 const invitation=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.operator.personId,[...MERCHANT_PERMISSIONS],[...MERCHANT_PERMISSIONS]));await acceptInvitation(f.operator.personId,invitation.id,{commandId:randomUUID(),expectedVersion:invitation.version});
 expect((await getPublicGuestRequest(f.publication.id)).canStart).toBe(false);await expect(confirmGuestAttempt(cookie,r.order.id,r.prepare.commandId)).rejects.toMatchObject({code:"GUEST_PAYMENT_UNAVAILABLE"});
 const replacement=await publishGuestChannel(f.operator.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedChannelVersion:f.channel.version});expect(replacement.publication?.state).toBe("AVAILABLE");expect(replacement.publication?.id).not.toBe(f.publication.id);
});

it("shares one-time uniqueness between the existing signed-in command and a guest confirmation",async()=>{
 const f=await ready("ONE_TIME"),cookie=await browser(),r=await review(cookie,f.publication.id);
 const results=await Promise.allSettled([confirmGuestAttempt(cookie,r.order.id,r.prepare.commandId),simulateMerchantPayment(f.operator.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedChannelVersion:f.channel.version,outcome:"APPROVED"})]);
 expect(results.filter(result=>result.status==="fulfilled")).toHaveLength(1);expect(results.filter(result=>result.status==="rejected")).toHaveLength(1);
 expect(await getDb().select().from(merchantTestPayments).where(and(eq(merchantTestPayments.channelId,f.channel.id),eq(merchantTestPayments.outcome,"APPROVED")))).toHaveLength(1);
 expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,f.merchant.serviceId))).toHaveLength(2);
});
