import {randomUUID} from "node:crypto";
import {afterAll,expect,it} from "vitest";
import {and,eq} from "drizzle-orm";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {serviceMembers,permissionGrants} from "../../src/platform/database/schema";
import {serviceInvitations,accessCommands} from "../../src/modules/access/schema";
import {createInvitation,acceptInvitation,declineInvitation,revokeInvitation,revokeMemberAccess,getAccessOverview,listInvitationsForPerson} from "../../src/modules/access/service";
import {CARDHOLDER_ACCESS_PERMISSIONS} from "../../src/modules/access/contracts";
import {getWorkspace} from "../../src/modules/workspace/service";
import {accessOverviewSchema,invitationProjectionSchema} from "../../src/modules/access/api-contracts";
import {accessFixture,person,offer,decision} from "../helpers/access";
afterAll(closeDatabase);
it("saves one named invitation and accepts only for its recipient",async()=>{
 const f=await accessFixture(),other=await person(),input=offer(f.recipient.personId),invite=invitationProjectionSchema.parse(await createInvitation(f.owner.personId,f.serviceId,input));
 expect((await createInvitation(f.owner.personId,f.serviceId,input)).id).toBe(invite.id);expect(await getDb().select().from(accessCommands).where(eq(accessCommands.commandId,input.commandId))).toHaveLength(1);expect(await listInvitationsForPerson(other.personId)).toEqual([]);
 await expect(acceptInvitation(other.personId,invite.id,decision())).rejects.toMatchObject({code:"INVITATION_UNAVAILABLE"});await expect(getWorkspace(f.recipient.personId,f.serviceId)).rejects.toMatchObject({code:"SERVICE_UNAVAILABLE"});
 const accept=decision();expect(await acceptInvitation(f.recipient.personId,invite.id,accept)).toMatchObject({status:"ACCEPTED",version:2,hasServiceAccess:true});expect(await acceptInvitation(f.recipient.personId,invite.id,accept)).toMatchObject({version:2});
 const view=await getWorkspace(f.recipient.personId,f.serviceId);expect(view.cards).toEqual([]);expect(view.activity).toEqual([]);expect(view.people).toEqual([]);accessOverviewSchema.parse(await getAccessOverview(f.owner.personId,f.serviceId));
});
it("rejects duplicate pending invitations, changed retries and unbound recipients",async()=>{
 const f=await accessFixture(),input=offer(f.recipient.personId);await createInvitation(f.owner.personId,f.serviceId,input);await expect(createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId))).rejects.toMatchObject({code:"PENDING_INVITATION_EXISTS"});await expect(createInvitation(f.owner.personId,f.serviceId,{...input,expiresInDays:7})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});await expect(createInvitation(f.owner.personId,f.serviceId,offer(randomUUID()))).rejects.toMatchObject({code:"RECIPIENT_UNAVAILABLE"});
});
it("decline, sender revocation and exact expiry prevent membership",async()=>{
 for(const mode of ["decline","revoke","expire"] as const){const f=await accessFixture(),invite=await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId));if(mode==="decline")await declineInvitation(f.recipient.personId,invite.id,decision());if(mode==="revoke")await revokeInvitation(f.owner.personId,f.serviceId,invite.id,decision());if(mode==="expire")await getDb().update(serviceInvitations).set({createdAt:new Date("2000-01-01Z"),expiresAt:new Date("2000-01-02Z")}).where(eq(serviceInvitations.id,invite.id));await expect(acceptInvitation(f.recipient.personId,invite.id,decision(mode==="expire"?1:2))).rejects.toThrow();expect(await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,f.serviceId),eq(serviceMembers.personId,f.recipient.personId)))).toEqual([]);expect((await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId))).id).not.toBe(invite.id);}
});
it("pending invitations cannot grant data access or carry injected governance settings",async()=>{
 const f=await accessFixture();await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId));
 await expect(getWorkspace(f.recipient.personId,f.serviceId)).rejects.toMatchObject({status:404});
 const injected={...offer(f.recipient.personId),permissions:["cards.create"],role:"OWNER"};
 await expect(createInvitation(f.owner.personId,f.serviceId,injected)).rejects.toMatchObject({code:"INVALID_REQUEST",status:422});
 expect(await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,f.serviceId),eq(serviceMembers.personId,f.recipient.personId)))).toEqual([]);
 expect(await getDb().select().from(permissionGrants).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.recipient.personId)))).toEqual([]);
});
it("gives accepted cardholders fixed own-card rights and revokes them with exact version and retry checks",async()=>{
 const f=await accessFixture(),invite=await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId));await acceptInvitation(f.recipient.personId,invite.id,decision());
 const view=await getAccessOverview(f.owner.personId,f.serviceId),member=view.people.find(p=>p.id===f.recipient.personId)!;
 expect(view).toMatchObject({canManage:false,permissionOptions:[],roleOptions:[]});
 expect(member).toMatchObject({role:"CARDHOLDER",state:"ACCEPTED",version:1,canManage:false,canRevoke:true,delegablePermissions:[]});
 expect([...member.permissions].sort()).toEqual([...CARDHOLDER_ACCESS_PERMISSIONS].sort());
 await expect(revokeMemberAccess(f.owner.personId,f.serviceId,f.recipient.personId,decision(2))).rejects.toMatchObject({code:"STALE_VERSION"});
 const command=decision(1),revoked=await revokeMemberAccess(f.owner.personId,f.serviceId,f.recipient.personId,command);
 expect(await revokeMemberAccess(f.owner.personId,f.serviceId,f.recipient.personId,command)).toEqual(revoked);
 expect(revoked).toMatchObject({state:"REVOKED",version:2,permissions:[],canRevoke:false});
 expect((await getAccessOverview(f.owner.personId,f.serviceId)).history[0]).toMatchObject({label:"Cardholder access removed",personId:f.recipient.personId});
 expect(await getDb().select().from(permissionGrants).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.recipient.personId),eq(permissionGrants.state,"ACCEPTED")))).toEqual([]);
});
it("checks inviter authority at acceptance and protects the account owner",async()=>{
 const f=await accessFixture(),invite=await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId));await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.owner.personId),eq(permissionGrants.action,"people.invite")));expect((await listInvitationsForPerson(f.recipient.personId))[0]).toMatchObject({canRespond:false,permissions:[...CARDHOLDER_ACCESS_PERMISSIONS],delegablePermissions:[]});await expect(acceptInvitation(f.recipient.personId,invite.id,decision())).rejects.toMatchObject({code:"INVITER_ACCESS_CHANGED"});await expect(revokeMemberAccess(f.owner.personId,f.serviceId,f.owner.personId,decision())).rejects.toMatchObject({code:"TARGET_ACCESS_PROTECTED"});
});
it("rechecks current owner authority before replaying an accepted invitation",async()=>{
 const f=await accessFixture(),invite=await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId)),command=decision();
 await acceptInvitation(f.recipient.personId,invite.id,command);
 await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.owner.personId),eq(permissionGrants.action,"people.invite")));
 await expect(acceptInvitation(f.recipient.personId,invite.id,command)).rejects.toMatchObject({code:"INVITER_ACCESS_CHANGED",status:409});
 expect((await getDb().select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,f.serviceId),eq(serviceMembers.personId,f.recipient.personId))))[0]).toMatchObject({state:"ACCEPTED",version:1});
});
