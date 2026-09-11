import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {merchantAssignments,merchantInvitationTerms,merchantPermissionGrants} from "../../src/modules/access/schema";
import {createMerchantInvitation,getMerchantAccessOverview,revokeMerchantInvitation} from "../../src/modules/access/merchant-service";
import {merchantAccessOverviewSchema} from "../../src/modules/access/merchant-api-contracts";
import {merchantNow} from "../../src/modules/access/merchant-scope";
import {merchantAccessFixture,merchantOffer} from "../helpers/merchant-access";
import {acquiringPerson} from "../helpers/acquiring";

afterAll(closeDatabase);

it("shows true bounded invitation counts, keeps old waiting offers first and recovers their exact revoke after they leave the list",async()=>{
 const f=await merchantAccessFixture(),historyPerson=await acquiringPerson();
 const waiting=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId));
 for(let index=0;index<100;index++){
  const past=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(historyPerson.personId));
  await revokeMerchantInvitation(f.merchant.personId,f.unit.id,past.id,{commandId:randomUUID(),expectedVersion:past.version});
 }
 const before=merchantAccessOverviewSchema.parse(await getMerchantAccessOverview(f.merchant.personId,f.unit.id));
 expect(before).toMatchObject({invitationTotal:102,pendingInvitationCount:1,invitationsTruncated:true});
 expect(before.invitations).toHaveLength(100);expect(before.invitations[0]!.id).toBe(waiting.id);
 expect(new Set(before.invitations.map(item=>item.merchantUnitId))).toEqual(new Set([f.unit.id]));
 expect((await getMerchantAccessOverview(f.merchant.personId,f.master.id)).invitationTotal).toBe(0);
 const command={commandId:randomUUID(),expectedVersion:waiting.version};
 const saved=await revokeMerchantInvitation(f.merchant.personId,f.unit.id,waiting.id,command);
 const after=await getMerchantAccessOverview(f.merchant.personId,f.unit.id);
 expect(after).toMatchObject({invitationTotal:102,pendingInvitationCount:0,invitationsTruncated:true});
 expect(after.invitations.some(item=>item.id===waiting.id)).toBe(false);
 expect(await revokeMerchantInvitation(f.merchant.personId,f.unit.id,waiting.id,command)).toMatchObject({id:saved.id,status:"REVOKED",version:saved.version});
},30000);

it("excludes an access-expired offer from waiting counts even while its acceptance deadline is still in the future",async()=>{
 const f=await merchantAccessFixture(),expired=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId));
 const now=await getDb().transaction(merchantNow);
 await getDb().update(merchantInvitationTerms).set({accessExpiresAt:new Date(now.getTime()-1000)}).where(eq(merchantInvitationTerms.invitationId,expired.id));
 const projection=merchantAccessOverviewSchema.parse(await getMerchantAccessOverview(f.merchant.personId,f.unit.id));
 expect(projection).toMatchObject({invitationTotal:2,pendingInvitationCount:0,invitationsTruncated:false});
 expect(projection.invitations.find(item=>item.id===expired.id)).toMatchObject({status:"EXPIRED",canRevoke:false,canRespond:false});
});

it("projects only invitation terms that fit the current delegator expiry without changing any grants",async()=>{
 const f=await merchantAccessFixture();
 const primary=merchantAccessOverviewSchema.parse(await getMerchantAccessOverview(f.merchant.personId,f.unit.id));
 expect(primary.invitationOptions).toEqual({accessDays:[1,7,30],invitationDays:[1,3,7],accessExpiresAt:null});
 const [assignment]=await getDb().select().from(merchantAssignments).where(eq(merchantAssignments.personId,f.operator.personId));
 const grants=await getDb().select().from(merchantPermissionGrants).where(eq(merchantPermissionGrants.assignmentId,assignment!.id));
 const initial=await getMerchantAccessOverview(f.operator.personId,f.unit.id);
 expect(initial.invitationOptions).toEqual({accessDays:[1,7],invitationDays:[1,3,7],accessExpiresAt:assignment!.expiresAt.toISOString()});
 const now=await getDb().transaction(merchantNow),shortExpiry=new Date(now.getTime()+2.5*86400000);
 // Assignment expiry is immutable. Model two already-accepted, shorter-lived
 // assignments as isolated fixtures instead of rewriting a real assignment.
 async function historicalAssignment(expiresAt:Date){
  const person=await acquiringPerson(),id=randomUUID();
  await getDb().insert(merchantAssignments).values({...assignment!,id,personId:person.personId,createdAt:now,expiresAt});
  await getDb().insert(merchantPermissionGrants).values(grants.map(grant=>({...grant,assignmentId:id})));
  return person;
 }
 const shorterPerson=await historicalAssignment(shortExpiry);
 const shorter=await getMerchantAccessOverview(shorterPerson.personId,f.unit.id);
 expect(shorter.canInvite).toBe(true);expect(shorter.invitationOptions).toEqual({accessDays:[1],invitationDays:[1],accessExpiresAt:shortExpiry.toISOString()});
 await expect(createMerchantInvitation(shorterPerson.personId,f.unit.id,merchantOffer(f.helper.personId))).rejects.toMatchObject({code:"DELEGATION_EXPIRY_EXCEEDED"});
 const allowed=await createMerchantInvitation(shorterPerson.personId,f.unit.id,{...merchantOffer(f.helper.personId),expiresInDays:1,accessExpiresInDays:1});
 expect(allowed.status).toBe("PENDING");
 const nearExpiry=new Date(now.getTime()+3*3600000);
 const nearPerson=await historicalAssignment(nearExpiry);
 const noTerm=await getMerchantAccessOverview(nearPerson.personId,f.unit.id);
 expect(noTerm.canInvite).toBe(true);expect(noTerm.invitationOptions).toEqual({accessDays:[],invitationDays:[],accessExpiresAt:nearExpiry.toISOString()});
 expect(noTerm.permissionOptions).toEqual(initial.permissionOptions);
 expect(await getDb().select().from(merchantPermissionGrants).where(eq(merchantPermissionGrants.assignmentId,assignment!.id))).toEqual(grants);
 await expect(createMerchantInvitation(nearPerson.personId,f.unit.id,{...merchantOffer(f.helper.personId),expiresInDays:1,accessExpiresInDays:1})).rejects.toMatchObject({code:"DELEGATION_EXPIRY_EXCEEDED"});
});
