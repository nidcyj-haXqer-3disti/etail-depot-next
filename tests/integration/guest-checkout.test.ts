import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {guestPublications} from "../../src/modules/acquiring/guest-schema";
import {guestPublicationManagementSchema,publicGuestRequestSchema} from "../../src/modules/acquiring/guest-contracts";
import {getGuestPublicationManagement,getPublicGuestRequest,publishGuestChannel,revokeGuestPublication} from "../../src/modules/acquiring/guest-service";
import {updateChannel,pauseMerchant} from "../../src/modules/acquiring/service";
import {setChannelActivation} from "../../src/modules/acquiring/operations-service";
import {createMerchantInvitation,getMerchantAccessOverview,revokeMerchantAccess} from "../../src/modules/access/merchant-service";
import {acceptInvitation} from "../../src/modules/access/service";
import {merchantOffer} from "../helpers/merchant-access";
import {terminalCheckoutFixture,payTerminal} from "../helpers/terminal-checkout";
import {prepareCardCheckout,confirmCardCheckout,getCardCheckoutReview} from "../../src/modules/acquiring/card-checkout-service";
afterAll(closeDatabase);
it("public payment details disclose only the published request and preserve exact authenticated receipts after revocation",async()=>{
 const f=await terminalCheckoutFixture(),publication=publicGuestRequestSchema.parse(await getPublicGuestRequest(f.publication.id));expect(publication).toMatchObject({canStart:true,publication:{amount:{minor:"1250"}}});
 for(const key of ["serviceId","publisherId","payerId","moneyAccountId"])expect(publication.publication).not.toHaveProperty(key);
 const prepared=await prepareCardCheckout(f.payer.personId,f.publication.id,{commandId:randomUUID(),cardServiceId:f.payer.serviceId,cardId:f.card.id,expectedCardVersion:f.card.version});const paid=await confirmCardCheckout(f.payer.personId,f.publication.id,prepared.id);
 const input={commandId:randomUUID(),expectedVersion:f.publication.version};const revoked=await revokeGuestPublication(f.operator.personId,f.unit.id,f.channel.id,f.publication.id,input);expect(revoked.publication?.state).toBe("REVOKED");expect(await revokeGuestPublication(f.operator.personId,f.unit.id,f.channel.id,f.publication.id,input)).toEqual(revoked);
 expect((await getPublicGuestRequest(f.publication.id)).canStart).toBe(false);expect((await getCardCheckoutReview(f.payer.personId,f.publication.id,prepared.id)).receipt?.paymentId).toBe(paid.receipt?.paymentId);await expect(getCardCheckoutReview(f.helper.personId,f.publication.id,prepared.id)).rejects.toMatchObject({status:404});
});
it("channel edits invalidate an old review without changing the immutable published amount",async()=>{
 const f=await terminalCheckoutFixture(),prepared=await prepareCardCheckout(f.payer.personId,f.publication.id,{commandId:randomUUID(),cardServiceId:f.payer.serviceId,cardId:f.card.id,expectedCardVersion:1});
 await setChannelActivation(f.operator.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedVersion:1,expectedChannelVersion:1,active:false});
 const edited=await updateChannel(f.operator.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedVersion:1,description:f.channel.description,amountMinor:"2500",currency:"USD",usage:"REUSABLE",expiresAt:f.channel.expiresAt,presentations:f.channel.presentations,visibility:"ASSIGNED"});
 await setChannelActivation(f.operator.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedVersion:2,expectedChannelVersion:edited.version,active:true});
 expect((await getPublicGuestRequest(f.publication.id)).publication.amount.minor).toBe("1250");expect((await getPublicGuestRequest(f.publication.id)).canStart).toBe(false);await expect(confirmCardCheckout(f.payer.personId,f.publication.id,prepared.id)).rejects.toBeDefined();
 const next=await publishGuestChannel(f.operator.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedChannelVersion:edited.version});expect(next.publication?.amount.minor).toBe("2500");expect(next.publication?.id).not.toBe(f.publication.id);
});
it("removed and reinvited terminal access never revives an earlier publication",async()=>{
 const f=await terminalCheckoutFixture(),access=await getMerchantAccessOverview(f.merchant.personId,f.unit.id),assignment=access.people.find(row=>row.personId===f.operator.personId)!;
 await revokeMerchantAccess(f.merchant.personId,f.unit.id,assignment.id,{commandId:randomUUID(),expectedVersion:assignment.version});expect((await getPublicGuestRequest(f.publication.id)).canStart).toBe(false);
 const invite=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.operator.personId));await acceptInvitation(f.operator.personId,invite.id,{commandId:randomUUID(),expectedVersion:invite.version});expect((await getPublicGuestRequest(f.publication.id)).canStart).toBe(false);
 const next=guestPublicationManagementSchema.parse(await publishGuestChannel(f.operator.personId,f.unit.id,f.channel.id,{commandId:randomUUID(),expectedChannelVersion:f.channel.version}));expect(next.publication?.id).not.toBe(f.publication.id);expect(next.publication?.state).toBe("AVAILABLE");
});
it("terminal assignment scopes publication management and paused terminals preserve publication snapshots",async()=>{
 const f=await terminalCheckoutFixture();await payTerminal(f);await expect(getGuestPublicationManagement(f.operator.personId,f.master.id,f.channel.id)).rejects.toMatchObject({status:404});await expect(getGuestPublicationManagement(f.helper.personId,f.unit.id,f.channel.id)).rejects.toMatchObject({status:404});
 const [before]=await getDb().select().from(guestPublications).where(eq(guestPublications.id,f.publication.id));await pauseMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:1,reason:"Pause terminal"});expect((await getPublicGuestRequest(f.publication.id)).canStart).toBe(false);expect((await getDb().select().from(guestPublications).where(eq(guestPublications.id,f.publication.id)))[0]).toEqual(before);
 await expect(getDb().update(guestPublications).set({amountMinor:1n}).where(eq(guestPublications.id,f.publication.id))).rejects.toThrow();
});


it("a revoked link receipt remains exact after a new link is published and cannot be replayed by another actor",async()=>{
 const {networkCheckoutFixture}=await import("../helpers/network-checkout"),{acquiringPerson}=await import("../helpers/acquiring"),{guestPublicationCommands}=await import("../../src/modules/acquiring/guest-schema");
 const f=await networkCheckoutFixture(),other=await acquiringPerson(),input={commandId:randomUUID(),expectedVersion:f.publication.version};
 const revoked=await revokeGuestPublication(f.personId,f.merchantId,f.channel.id,f.publication.id,input);
 expect(revoked.revocation).toMatchObject({commandId:input.commandId,publicationId:f.publication.id,status:"REVOKED"});
 const next=await publishGuestChannel(f.personId,f.merchantId,f.channel.id,{commandId:randomUUID(),expectedChannelVersion:f.channel.version});
 expect(next.publication!.id).not.toBe(f.publication.id);
 const replayed=await revokeGuestPublication(f.personId,f.merchantId,f.channel.id,f.publication.id,input);
 expect(replayed.revocation).toEqual(revoked.revocation);expect(replayed.publication).toEqual(next.publication);expect(replayed.publication!.state).toBe("AVAILABLE");
 expect(await getDb().select().from(guestPublicationCommands).where(eq(guestPublicationCommands.commandId,input.commandId))).toHaveLength(1);
 expect(await getGuestPublicationManagement(f.personId,f.merchantId,f.channel.id)).not.toHaveProperty("revocation");
 await expect(revokeGuestPublication(other.personId,f.merchantId,f.channel.id,f.publication.id,input)).rejects.toMatchObject({status:404});
 expect((await getPublicGuestRequest(f.publication.id)).canStart).toBe(false);expect((await getPublicGuestRequest(next.publication!.id)).canStart).toBe(true);
});
