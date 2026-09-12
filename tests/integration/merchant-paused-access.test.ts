import {randomUUID} from "node:crypto";
import {eq,sql} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {merchantTerminals} from "../../src/modules/acquiring/schema";
import {createChannel,getMerchantWorkspace,pauseMerchant,resumeMerchant} from "../../src/modules/acquiring/service";
import {createMerchantInvitation,getMerchantAccessOverview,revokeMerchantAccess,revokeMerchantInvitation} from "../../src/modules/access/merchant-service";
import {acceptInvitation} from "../../src/modules/access/service";
import {invitationPermissions,serviceInvitations,terminalAssignments,terminalInvitationTerms} from "../../src/modules/access/schema";
import {TERMINAL_PERMISSIONS} from "../../src/modules/access/merchant-contracts";
import {merchantAccessFixture,merchantOffer} from "../helpers/merchant-access";
import {paymentInput} from "../helpers/acquiring";

afterAll(closeDatabase);
const command=(expectedVersion:number)=>({commandId:randomUUID(),expectedVersion});

it("the owner can remove a terminal user while paused without reopening it, and the same revocation replays",async()=>{
 const f=await merchantAccessFixture();
 const assignment=(await getMerchantAccessOverview(f.merchant.personId,f.unit.id)).people.find(person=>person.personId===f.operator.personId)!;
 const paused=await pauseMerchant(f.merchant.personId,f.unit.id,{...command(f.unit.version),reason:"Pause collection while reviewing access"});
 expect((await getMerchantAccessOverview(f.merchant.personId,f.unit.id)).people.find(person=>person.id===assignment.id)).toMatchObject({state:"UNAVAILABLE",canRevoke:true});
 await expect(revokeMerchantAccess(f.operator.personId,f.unit.id,assignment.id,command(assignment.version))).rejects.toMatchObject({status:404});
 const revoke=command(assignment.version);
 const removed=await revokeMerchantAccess(f.merchant.personId,f.unit.id,assignment.id,revoke);
 expect(removed).toMatchObject({id:assignment.id,state:"REVOKED",version:assignment.version+1,canRevoke:false});
 expect(await revokeMerchantAccess(f.merchant.personId,f.unit.id,assignment.id,revoke)).toEqual(removed);
 expect((await getDb().select().from(merchantTerminals).where(eq(merchantTerminals.id,f.unit.id)))[0]).toMatchObject({status:"PAUSED",version:paused.version});
 await expect(createChannel(f.merchant.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"ASSIGNED"})).rejects.toMatchObject({status:404});
 await resumeMerchant(f.merchant.personId,f.unit.id,{...command(paused.version),reason:"Resume after access review"});
 await expect(getMerchantWorkspace(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:404});
});

it("the owner can cancel a pending invitation while paused, but cannot invite or accept new terminal access",async()=>{
 const f=await merchantAccessFixture();
 const offer=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId));
 const paused=await pauseMerchant(f.merchant.personId,f.unit.id,{...command(f.unit.version),reason:"Pause collection while reviewing invitation"});
 const overview=await getMerchantAccessOverview(f.merchant.personId,f.unit.id);
 expect(overview.canInvite).toBe(false);
 expect(overview.invitations.find(invitation=>invitation.id===offer.id)).toMatchObject({canRevoke:true,canRespond:false});
 await expect(createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId))).rejects.toMatchObject({status:404});
 await expect(acceptInvitation(f.helper.personId,offer.id,command(offer.version))).rejects.toMatchObject({code:"INVITER_ACCESS_CHANGED"});
 await expect(revokeMerchantInvitation(f.operator.personId,f.unit.id,offer.id,command(offer.version))).rejects.toMatchObject({status:404});
 const revoke=command(offer.version);
 const removed=await revokeMerchantInvitation(f.merchant.personId,f.unit.id,offer.id,revoke);
 expect(removed).toMatchObject({id:offer.id,status:"REVOKED",version:offer.version+1,canRevoke:false});
 expect(await revokeMerchantInvitation(f.merchant.personId,f.unit.id,offer.id,revoke)).toEqual(removed);
 expect((await getDb().select().from(merchantTerminals).where(eq(merchantTerminals.id,f.unit.id)))[0]).toMatchObject({status:"PAUSED",version:paused.version});
 await resumeMerchant(f.merchant.personId,f.unit.id,{...command(paused.version),reason:"Resume after invitation review"});
 await expect(acceptInvitation(f.helper.personId,offer.id,command(removed.version))).rejects.toMatchObject({code:"INVITATION_ALREADY_USED"});
});

it("a retained invitation whose access period expires first does not block a fresh owner invitation",async()=>{
 const f=await merchantAccessFixture(),oldId=randomUUID();
 // Retained invitations may have an access expiry before their invitation deadline.
 // Build that valid persisted shape under the current guards and let real time expire it.
 await getDb().transaction(async tx=>{
  await tx.insert(serviceInvitations).values({id:oldId,targetKind:"MERCHANT_TERMINAL",merchantUnitId:f.unit.id,inviterId:f.merchant.personId,recipientId:f.helper.personId,createdAt:sql`clock_timestamp()`,expiresAt:sql`clock_timestamp()+interval '7 days'`});
  await tx.insert(terminalInvitationTerms).values({invitationId:oldId,terminalId:f.unit.id,grantedByPersonId:f.merchant.personId,ownerMembershipVersion:1,accessExpiresAt:sql`clock_timestamp()+interval '50 milliseconds'`});
  await tx.insert(invitationPermissions).values(TERMINAL_PERMISSIONS.map(action=>({invitationId:oldId,action,delegable:false})));
  await tx.execute(sql`select pg_sleep(0.075)`);
 });
 expect((await getMerchantAccessOverview(f.merchant.personId,f.unit.id)).invitations.find(invitation=>invitation.id===oldId)).toMatchObject({status:"EXPIRED",canRespond:false,canRevoke:false});
 await expect(acceptInvitation(f.helper.personId,oldId,command(1))).rejects.toMatchObject({code:"INVITATION_EXPIRED"});
 const fresh=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId));
 expect(fresh).toMatchObject({status:"PENDING",accessExpiresAt:null,canRespond:false});
 expect(fresh.id).not.toBe(oldId);
 expect((await getDb().select().from(serviceInvitations).where(eq(serviceInvitations.id,oldId)))[0]).toMatchObject({status:"EXPIRED",version:2});
 expect(await getDb().select().from(terminalAssignments).where(eq(terminalAssignments.personId,f.helper.personId))).toEqual([]);
 await expect(acceptInvitation(f.helper.personId,oldId,command(2))).rejects.toMatchObject({code:"INVITATION_ALREADY_USED"});
 await acceptInvitation(f.helper.personId,fresh.id,command(fresh.version));
 const assigned=await getDb().select().from(terminalAssignments).where(eq(terminalAssignments.personId,f.helper.personId));
 expect(assigned).toHaveLength(1);expect(assigned[0]).toMatchObject({terminalId:f.unit.id,grantedByPersonId:f.merchant.personId,state:"ACCEPTED",expiresAt:null});
});
