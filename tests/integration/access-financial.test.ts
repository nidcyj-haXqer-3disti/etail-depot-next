import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {serviceMembers,permissionGrants} from "../../src/platform/database/schema";
import {createInvitation,acceptInvitation,getAccessOverview,revokeMemberAccess} from "../../src/modules/access/service";
import {createInvitationSchema,CARDHOLDER_ACCESS_PERMISSIONS} from "../../src/modules/access/contracts";
import {loadServiceScope} from "../../src/modules/access/scope";
import {evaluate} from "../../src/modules/policy/evaluate";
import {accessFixture,decision,offer,person} from "../helpers/access";
afterAll(closeDatabase);
it("accepts the fixed own-card role and removes the entire service access on revocation",async()=>{
 const f=await accessFixture(),invite=await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId));await acceptInvitation(f.recipient.personId,invite.id,decision());
 const scope=await getDb().transaction(tx=>loadServiceScope(tx,f.recipient.personId,f.serviceId));for(const action of CARDHOLDER_ACCESS_PERMISSIONS)expect(evaluate(scope.policy,action).allowed).toBe(true);
 for(const action of ["cards.create","cards.request","cards.manageMembers","cardholder.funds.add","cardholder.limits.manage","people.read","payments.read"])expect(evaluate(scope.policy,action).allowed).toBe(false);
 await revokeMemberAccess(f.owner.personId,f.serviceId,f.recipient.personId,decision());await expect(getDb().transaction(tx=>loadServiceScope(tx,f.recipient.personId,f.serviceId))).rejects.toMatchObject({code:"SERVICE_UNAVAILABLE"});
});
it("rejects browser-supplied permission choices and onward delegation instead of offering a permission matrix",async()=>{
 const f=await accessFixture();
 for(const patch of [{permissions:["cards.request"]},{permissions:["cards.read","cards.purchase"]},{delegablePermissions:["cards.read"]},{role:"OWNER"}])await expect(createInvitation(f.owner.personId,f.serviceId,{...offer(f.recipient.personId),...patch})).rejects.toMatchObject({code:"INVALID_REQUEST",status:422});
});
it("stored legacy governance grants cannot promote a holder or remove the fixed own-card rights",async()=>{
 const f=await accessFixture();await getDb().insert(serviceMembers).values({serviceId:f.serviceId,personId:f.recipient.personId,state:"ACCEPTED"});await getDb().insert(permissionGrants).values(["cards.read","cards.request","cards.create","people.read","people.invite"].map(action=>({serviceId:f.serviceId,personId:f.recipient.personId,action,delegable:true})));
 const {policy}=await getDb().transaction(tx=>loadServiceScope(tx,f.recipient.personId,f.serviceId));for(const action of ["cards.request","cards.create","people.read","people.invite"])expect(evaluate(policy,action).allowed).toBe(false);
 for(const action of CARDHOLDER_ACCESS_PERMISSIONS)expect(evaluate(policy,action).allowed).toBe(true);
});
it("Cardholder invitations cannot grant Merchant authority",async()=>{
 const f=await accessFixture();for(const action of ["gateway.manage","payments.read","payments.refund","payouts.manage","merchant.read"])expect(createInvitationSchema.safeParse({...offer(f.recipient.personId),permissions:[action]}).success).toBe(false);
});
it("owner invitation responsibility is independent of legacy delegation flags and cannot be passed onward",async()=>{
 const f=await accessFixture(),invite=await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId));
 await getDb().update(permissionGrants).set({delegable:false}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.owner.personId),eq(permissionGrants.action,"cards.purchase")));
 await acceptInvitation(f.recipient.personId,invite.id,decision());await expect(createInvitation(f.recipient.personId,f.serviceId,offer((await person()).personId))).rejects.toMatchObject({code:"ACTION_DENIED"});
});
it("keeps cardholder access review simple with fixed roles and no editable or delegable grant options",async()=>{
 const f=await accessFixture(),overview=await getAccessOverview(f.owner.personId,f.serviceId);expect(overview).toMatchObject({roleOptions:[],permissionOptions:[],canManage:false});
 expect(overview.people[0]).toMatchObject({role:"OWNER",delegablePermissions:[],canManage:false});
});
