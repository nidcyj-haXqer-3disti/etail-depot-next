import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {serviceMembers} from "../../src/platform/database/schema";
import {terminalAssignments} from "../../src/modules/access/schema";
import {createMerchantInvitation,getMerchantAccessOverview,revokeMerchantAccess,revokeMerchantInvitation} from "../../src/modules/access/merchant-service";
import {acceptInvitation,declineInvitation,listInvitationsForPerson} from "../../src/modules/access/service";
import {createChannel,getMerchantWorkspace} from "../../src/modules/acquiring/service";
import {loadTerminalScope} from "../../src/modules/access/merchant-scope";
import {merchantAccessOverviewSchema,merchantInvitationProjectionSchema} from "../../src/modules/access/merchant-api-contracts";
import {merchantAccessFixture,merchantOffer} from "../helpers/merchant-access";
import {acquiringPerson,paymentInput} from "../helpers/acquiring";
afterAll(closeDatabase);
const decision=(expectedVersion=1)=>({commandId:randomUUID(),expectedVersion});
const scope=(personId:string,id:string)=>getDb().transaction(tx=>loadTerminalScope(tx,personId,id));
it("invitation acceptance grants exact merchant access and never enrolls the recipient in its service",async()=>{
 const f=await merchantAccessFixture(),input=merchantOffer(f.helper.personId);const invitation=merchantInvitationProjectionSchema.parse(await createMerchantInvitation(f.merchant.personId,f.unit.id,input));
 expect((await createMerchantInvitation(f.merchant.personId,f.unit.id,input)).id).toBe(invitation.id);await expect(scope(f.helper.personId,f.unit.id)).rejects.toMatchObject({status:404});
 const stranger=await acquiringPerson();await expect(acceptInvitation(stranger.personId,invitation.id,decision())).rejects.toMatchObject({status:404});
 const accept=decision();expect(await acceptInvitation(f.helper.personId,invitation.id,accept)).toMatchObject({status:"ACCEPTED",hasMerchantAccess:true});expect((await acceptInvitation(f.helper.personId,invitation.id,accept)).version).toBe(2);
 expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId,f.helper.personId))).toEqual([]);
 const channel=await createChannel(f.helper.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"CREATOR_PRIVATE"});expect((await getMerchantWorkspace(f.helper.personId,f.unit.id)).channels.map(row=>row.id)).toContain(channel.id);
 expect(merchantAccessOverviewSchema.safeParse(await getMerchantAccessOverview(f.merchant.personId,f.unit.id)).success).toBe(true);
});
it("decline and revoke are versioned, replayable and create no accepted permission",async()=>{
 for(const action of ["decline","revoke"] as const){const f=await merchantAccessFixture(),invitation=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId)),input=decision();
 if(action==="decline")expect(await declineInvitation(f.helper.personId,invitation.id,input)).toMatchObject({status:"DECLINED"});else{expect(await revokeMerchantInvitation(f.merchant.personId,f.unit.id,invitation.id,input)).toMatchObject({status:"REVOKED"});expect((await revokeMerchantInvitation(f.merchant.personId,f.unit.id,invitation.id,input)).version).toBe(2);}
 await expect(acceptInvitation(f.helper.personId,invitation.id,decision(2))).rejects.toMatchObject({code:"INVITATION_ALREADY_USED"});expect(await getDb().select().from(terminalAssignments).where(eq(terminalAssignments.personId,f.helper.personId))).toEqual([]);
 }
});
it("only the owner invites terminal users and clients cannot select permissions",async()=>{
 const f=await merchantAccessFixture();
 await expect(createMerchantInvitation(f.operator.personId,f.unit.id,merchantOffer(f.helper.personId))).rejects.toMatchObject({code:"ACTION_DENIED"});
 const input=merchantOffer(f.helper.personId);
 await expect(createMerchantInvitation(f.merchant.personId,f.unit.id,{...input,permissions:["payouts.manage"]} as unknown as typeof input)).rejects.toMatchObject({code:"INVALID_REQUEST"});
 const invitation=await createMerchantInvitation(f.merchant.personId,f.unit.id,input);
 await expect(createMerchantInvitation(f.merchant.personId,f.unit.id,{...input,expiresInDays:1})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
 await expect(createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId))).rejects.toMatchObject({code:"PENDING_INVITATION_EXISTS"});
 await acceptInvitation(f.helper.personId,invitation.id,decision());
 await expect(getMerchantAccessOverview(f.helper.personId,f.unit.id)).rejects.toMatchObject({status:403});
});
it("revocation removes one direct assignment without affecting another user or reviving its identity",async()=>{
 const f=await merchantAccessFixture();const invitation=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId));await acceptInvitation(f.helper.personId,invitation.id,decision());
 const operator=(await scope(f.operator.personId,f.unit.id)).assignment!,input=decision(operator.version);
 expect((await revokeMerchantAccess(f.merchant.personId,f.unit.id,operator.id,input)).state).toBe("REVOKED");expect((await revokeMerchantAccess(f.merchant.personId,f.unit.id,operator.id,input)).version).toBe(2);
 await expect(scope(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:404});expect((await scope(f.helper.personId,f.unit.id)).assignment?.personId).toBe(f.helper.personId);
 const next=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.operator.personId));await acceptInvitation(f.operator.personId,next.id,decision());expect((await scope(f.operator.personId,f.unit.id)).assignment!.id).not.toBe(operator.id);
 expect((await listInvitationsForPerson(f.helper.personId)).find(row=>row.id===invitation.id)).toMatchObject({hasMerchantAccess:true});
});
it("an owner membership generation change invalidates invitations and terminal access",async()=>{
 const f=await merchantAccessFixture(),offer=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId));
 await getDb().update(serviceMembers).set({version:2}).where(and(eq(serviceMembers.serviceId,f.merchant.serviceId),eq(serviceMembers.personId,f.merchant.personId)));
 await expect(acceptInvitation(f.helper.personId,offer.id,decision())).rejects.toMatchObject({code:"INVITER_ACCESS_CHANGED"});await expect(scope(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:404});
 expect((await getMerchantWorkspace(f.merchant.personId,f.unit.id)).ownerAccess).toBe(true);
});
it("old custom grants cannot give a terminal user money or access management",async()=>{
 const f=await merchantAccessFixture();const current=await scope(f.operator.personId,f.unit.id);
 expect(current.ownerAccess).toBe(false);expect(current.grants).toContain("disputes.respond");
 expect(current.grants).not.toContain("payouts.manage");expect(current.grants).not.toContain("merchant.people.invite");
 await expect(scope(f.operator.personId,f.master.id)).rejects.toMatchObject({status:404});
});
