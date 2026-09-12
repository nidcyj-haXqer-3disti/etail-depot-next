import {publishGuestChannel,getPublicGuestRequest} from "../../src/modules/acquiring/guest-service";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, expect, it, vi } from "vitest";
import targets from "../../project-targets.json" with { type: "json" };
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { identityBindings, services } from "../../src/platform/database/schema";
import { bindIdentity, listServicesForPerson,createCardholderService } from "../../src/modules/services/service";
import { createPrimaryMerchant } from "../../src/modules/services/create-merchant";
import { startSandbox } from "../../src/modules/sandbox/service";
import { createChannel, createTerminal, getMerchantBusinessDetails, getMerchantDirectory, getMerchantWorkspace, pauseMerchant, submitMerchantSetup, updateMerchantSetup } from "../../src/modules/acquiring/service";
import { configureTestGateway, createMerchantSettlement, enrollTestMerchant, getMerchantOperations, refundMerchantPayment, setChannelActivation } from "../../src/modules/acquiring/operations-service";
import { channelPresentationSchema } from "../../src/modules/acquiring/contracts";
import { getMerchantDashboard } from "../../src/modules/acquiring/dashboard-service";
import { createMerchantInvitation, getMerchantAccessOverview, revokeMerchantAccess } from "../../src/modules/access/merchant-service";
import { acceptInvitation } from "../../src/modules/access/service";
import { terminalAssignments } from "../../src/modules/access/schema";
import { operatorServiceAccess } from "../../src/modules/operations/schema";
import { merchantOffer } from "../helpers/merchant-access";
import { completeSetup, paymentInput } from "../helpers/acquiring";

import {fundCardGroup,issuePracticeCard} from "../helpers/cardholder";
import {getWorkspace} from "../../src/modules/workspace/service";
import {prepareCardCheckout,confirmCardCheckout} from "../../src/modules/acquiring/card-checkout-service";
import {readServiceMoneyAvailable} from "../../src/modules/money/service";
const issuer = `${targets.netlify.canonical_origin}/.netlify/identity`;

beforeAll(() => {
  // The runner has verified this isolated native test database. Only runtime policy
  // flags change below; no hosted database, Identity account or provider is called.
  expect(process.env.APP_ENV).toBe("test");
  getDb();
  vi.stubEnv("APP_ENV", "production");
  vi.stubEnv("SITE_ID", targets.netlify.site_id);
  vi.stubEnv("NETLIFY", "true");
  vi.stubEnv("ETAIL_PUBLIC_ORIGIN", targets.netlify.canonical_origin);
  vi.stubEnv("ENABLE_LOCAL_FIXTURE_IDENTITY", "false");
});
afterAll(async () => { vi.unstubAllEnvs(); await closeDatabase(); });

async function emailParticipant() {
  const identity = await bindIdentity(issuer, randomUUID(), "Synthetic sandbox merchant");
  await startSandbox(identity.personId, { commandId: randomUUID(), displayName: "Practice merchant owner", acknowledged: true });
  return identity;
}
async function merchant() {
  const identity = await emailParticipant();
  const created = await createPrimaryMerchant(identity.personId, { commandId: randomUUID(), displayName: "Practice ceramics" });
  return { ...identity, ...created };
}
async function readyChannel(personId: string, merchantId: string) {
  const channel = await createChannel(personId, merchantId, { ...paymentInput(), usage: "REUSABLE", presentations: [...channelPresentationSchema.options], visibility: "ASSIGNED" });
  await configureTestGateway(personId, merchantId, { commandId: randomUUID(), expectedVersion: 0, enabled: true });
  await enrollTestMerchant(personId, merchantId, { commandId: randomUUID(), expectedVersion: 0, enabled: true });
  await setChannelActivation(personId, merchantId, channel.id, { commandId: randomUUID(), expectedChannelVersion: channel.version, expectedVersion: 0, active: true });
  return channel;
}
async function hostedPayer(){const person=await emailParticipant();const service=await createCardholderService(person.personId,{commandId:randomUUID(),displayName:"Shopping cards"});await fundCardGroup(person.personId,service.serviceId,"10000");const issued=await issuePracticeCard(person.personId,service.serviceId,person.personId,"Shopping",undefined,"10000");return {...person,serviceId:service.serviceId,card:issued.card};}
async function pay(person:Awaited<ReturnType<typeof hostedPayer>>,publicationId:string){const card=(await getWorkspace(person.personId,person.serviceId)).cards.find(row=>row.id===person.card.id)!;const review=await prepareCardCheckout(person.personId,publicationId,{commandId:randomUUID(),cardServiceId:person.serviceId,cardId:card.id,expectedCardVersion:card.version});const result=await confirmCardCheckout(person.personId,publicationId,review.id);if(!result.receipt)throw new Error("Payment receipt missing");return result.receipt;}
it("hosted email participants complete merchant setup, all seven channels, card checkout, settlement and refund",async()=>{
 const f=await merchant(),payer=await hostedPayer();
 const setup=(await getMerchantBusinessDetails(f.personId,f.merchantId)).setup!,saved=await updateMerchantSetup(f.personId,f.merchantId,setup.id,completeSetup(setup.version));expect((await submitMerchantSetup(f.personId,f.merchantId,setup.id,{commandId:randomUUID(),expectedVersion:saved.version})).status).toBe("PENDING_LOCAL_REVIEW");
 const terminal=await createTerminal(f.personId,f.serviceId,{commandId:randomUUID(),displayName:"Pop-up shop"}),channel=await readyChannel(f.personId,terminal.id);expect(channel.presentations).toEqual(channelPresentationSchema.options);
 const published=await publishGuestChannel(f.personId,terminal.id,channel.id,{commandId:randomUUID(),expectedChannelVersion:channel.version});expect(published.publication?.publicHref).toBe(`${targets.netlify.canonical_origin}/checkout/${published.publication!.id}`);expect((await getPublicGuestRequest(published.publication!.id)).canStart).toBe(true);
 const first=await pay(payer,published.publication!.id),second=await pay(payer,published.publication!.id);
 await refundMerchantPayment(f.personId,terminal.id,first.paymentId,{commandId:randomUUID(),expectedVersion:1,reason:"Returned order"});
 const receipt=await createMerchantSettlement(f.personId,terminal.id,{commandId:randomUUID(),reviewToken:(await getMerchantOperations(f.personId,terminal.id)).depositReview!.token});expect(receipt.amount.minor).toBe("1250");
 expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.serviceId))).toBe(1250n);expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,payer.serviceId))).toBe(8750n);
 expect((await getMerchantOperations(f.personId,terminal.id)).payments.map(row=>row.id).sort()).toEqual([first.paymentId,second.paymentId].sort());expect((await getMerchantDashboard(f.personId)).units).toHaveLength(2);
 expect(await getDb().select().from(identityBindings).where(eq(identityBindings.personId,f.personId))).toMatchObject([{issuer}]);expect((await listServicesForPerson(f.personId)).map(row=>row.kind)).toEqual(["MERCHANT"]);expect(await getDb().select().from(operatorServiceAccess).where(eq(operatorServiceAccess.personId,f.personId))).toEqual([]);
});
it("requires explicit sandbox participation before service enrollment and rejects another issuer",async()=>{
 const email=await bindIdentity(issuer,randomUUID());expect((await getMerchantDashboard(email.personId)).units).toEqual([]);expect((await getMerchantDashboard(email.personId)).canCreateMerchant).toBe(false);
 await expect(createPrimaryMerchant(email.personId,{commandId:randomUUID(),displayName:"Unenrolled"})).rejects.toMatchObject({status:403});expect(await getDb().select().from(services).where(eq(services.primaryPersonId,email.personId))).toEqual([]);
 const untrusted=await bindIdentity("https://unrelated.example.test/.netlify/identity",randomUUID());await expect(startSandbox(untrusted.personId,{commandId:randomUUID(),displayName:"Untrusted",acknowledged:true})).rejects.toMatchObject({status:404});
 const fixture=await bindIdentity("urn:etail:isolated-fixture",randomUUID());await expect(createPrimaryMerchant(fixture.personId,{commandId:randomUUID(),displayName:"Disabled fixture"})).rejects.toMatchObject({status:404});
});
it("invited email users operate one terminal without membership or money access, then lose access on removal",async()=>{
 const f=await merchant(),helper=await emailParticipant(),terminal=await createTerminal(f.personId,f.serviceId,{commandId:randomUUID(),displayName:"Helper counter"});await readyChannel(f.personId,terminal.id);
 const invitation=await createMerchantInvitation(f.personId,terminal.id,merchantOffer(helper.personId));await acceptInvitation(helper.personId,invitation.id,{commandId:randomUUID(),expectedVersion:invitation.version});expect((await getMerchantDirectory(helper.personId)).units.map(row=>row.id)).toEqual([terminal.id]);
 const input={...paymentInput(),presentations:["WEB"] as ["WEB"],visibility:"ASSIGNED" as const};const channel=await createChannel(helper.personId,terminal.id,input);expect(await createChannel(helper.personId,terminal.id,input)).toEqual(channel);
 expect(await getMerchantOperations(helper.personId,terminal.id)).toMatchObject({canPayout:false,canConfigureGateway:false,availableFunds:null,bankFunds:null});await expect(getMerchantWorkspace(helper.personId,f.merchantId)).rejects.toMatchObject({status:404});await expect(createMerchantSettlement(helper.personId,terminal.id,{commandId:randomUUID(),reviewToken:"0".repeat(64)})).rejects.toMatchObject({status:403});expect(await listServicesForPerson(helper.personId)).toEqual([]);
 const assignment=(await getMerchantAccessOverview(f.personId,terminal.id)).people.find(row=>row.personId===helper.personId)!;await revokeMerchantAccess(f.personId,terminal.id,assignment.id,{commandId:randomUUID(),expectedVersion:assignment.version});await expect(createChannel(helper.personId,terminal.id,input)).rejects.toMatchObject({status:404});expect((await getDb().select().from(terminalAssignments).where(eq(terminalAssignments.id,assignment.id)))[0]?.state).toBe("REVOKED");
});
it("hosted terminal creation retries are unique and paused terminals retain only owner history",async()=>{
 const f=await merchant(),input={commandId:randomUUID(),displayName:"One terminal"};const terminals=await Promise.all(Array.from({length:4},()=>createTerminal(f.personId,f.serviceId,input)));expect(new Set(terminals.map(row=>row.id)).size).toBe(1);
 await pauseMerchant(f.personId,terminals[0]!.id,{commandId:randomUUID(),expectedVersion:1,reason:"Pause counter"});expect((await getMerchantWorkspace(f.personId,terminals[0]!.id)).canCreateChannel).toBe(false);await expect(createChannel(f.personId,terminals[0]!.id,{...paymentInput(),presentations:["WEB"],visibility:"ASSIGNED"})).rejects.toMatchObject({status:404});
});
