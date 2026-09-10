import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {serviceMembers,permissionGrants} from "../../src/platform/database/schema";
import {createInvitation,acceptInvitation,getAccessOverview,revokeMemberAccess} from "../../src/modules/access/service";
import {createInvitationSchema,type AccessPermission} from "../../src/modules/access/contracts";
import {loadServiceScope} from "../../src/modules/access/scope";
import {evaluate} from "../../src/modules/policy/evaluate";
import {accessFixture,decision,offer,person} from "../helpers/access";
afterAll(closeDatabase);
const ownCard:AccessPermission[]=["cards.read","cards.hold","cards.purchase","cards.freeze","cards.unfreeze","activity.read"];
it("accepts own-card permissions and removes access on revocation",async()=>{
 const f=await accessFixture(),invite=await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId,ownCard));await acceptInvitation(f.recipient.personId,invite.id,decision());
 const scope=await getDb().transaction(tx=>loadServiceScope(tx,f.recipient.personId,f.serviceId));for(const action of ownCard)expect(evaluate(scope.policy,action).allowed).toBe(true);
 for(const action of ["cards.create","cards.request","cards.manageMembers","balances.read","people.read","payments.read"])expect(evaluate(scope.policy,action).allowed).toBe(false);
 await revokeMemberAccess(f.owner.personId,f.serviceId,f.recipient.personId,decision());await expect(getDb().transaction(tx=>loadServiceScope(tx,f.recipient.personId,f.serviceId))).rejects.toMatchObject({code:"SERVICE_UNAVAILABLE"});
});
it("rejects primary-only permissions, onward delegation and missing prerequisites",async()=>{
 const f=await accessFixture();
 for(const action of ["cards.request","cards.create","cards.manageMembers"] as const)await expect(createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId,["cards.read",action]))).rejects.toMatchObject({code:"SECONDARY_SCOPE_REQUIRED"});
 await expect(createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId,["cards.read","cards.purchase"]))).rejects.toMatchObject({code:"PERMISSION_PREREQUISITE_REQUIRED"});
 await expect(createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId,["cards.read"],"SECONDARY",["cards.read"]))).rejects.toMatchObject({code:"SECONDARY_SCOPE_REQUIRED"});
});
it("stored grants cannot make a secondary the named primary",async()=>{
 const f=await accessFixture();await getDb().insert(serviceMembers).values({serviceId:f.serviceId,personId:f.recipient.personId,state:"ACCEPTED"});await getDb().insert(permissionGrants).values(["cards.read","cards.request","cards.create","people.read","people.invite"].map(action=>({serviceId:f.serviceId,personId:f.recipient.personId,action,delegable:true})));
 const {policy}=await getDb().transaction(tx=>loadServiceScope(tx,f.recipient.personId,f.serviceId));for(const action of ["cards.request","cards.create","people.read","people.invite"])expect(evaluate(policy,action).allowed).toBe(false);
});
it("Cardholder invitation inputs cannot grant Merchant authority",async()=>{
 const f=await accessFixture();for(const action of ["gateway.manage","payments.read","payments.refund","payouts.manage","merchant.read"])expect(createInvitationSchema.safeParse(offer(f.recipient.personId,[action as AccessPermission])).success).toBe(false);
});
it("rechecks primary delegation ceilings when accepting and denies secondary invitations",async()=>{
 const f=await accessFixture(),invite=await createInvitation(f.owner.personId,f.serviceId,offer(f.recipient.personId,ownCard));
 await getDb().update(permissionGrants).set({delegable:false}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.owner.personId),eq(permissionGrants.action,"cards.purchase")));
 await expect(acceptInvitation(f.recipient.personId,invite.id,decision())).rejects.toMatchObject({code:"DELEGATION_CEILING_EXCEEDED"});
 await getDb().update(permissionGrants).set({delegable:true}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.owner.personId),eq(permissionGrants.action,"cards.purchase")));
 await acceptInvitation(f.recipient.personId,invite.id,decision());await expect(createInvitation(f.recipient.personId,f.serviceId,offer((await person()).personId,["cards.read"]))).rejects.toMatchObject({code:"ACTION_DENIED"});
});
it("offers only permitted secondary actions, with one simple relationship label",async()=>{
 const f=await accessFixture(),overview=await getAccessOverview(f.owner.personId,f.serviceId);expect(overview.roleOptions).toEqual(["SECONDARY"]);expect(overview.permissionOptions.every(option=>!option.canDelegate)).toBe(true);for(const action of ["cards.create","cards.manageMembers","gateway.manage","people.read"])expect(overview.permissionOptions.find(option=>option.action===action)).toBeUndefined();
});
