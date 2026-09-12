import {randomUUID} from "node:crypto";
import {afterAll,expect,it} from "vitest";
import {closeDatabase} from "../../src/platform/database/client";
import {createMerchantInvitation,getMerchantAccessOverview,revokeMerchantInvitation} from "../../src/modules/access/merchant-service";
import {merchantAccessOverviewSchema} from "../../src/modules/access/merchant-api-contracts";
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
 expect(new Set(before.invitations.map(item=>item.terminalId))).toEqual(new Set([f.unit.id]));
 expect((await getMerchantAccessOverview(f.merchant.personId,f.master.id)).invitationTotal).toBe(0);
 const command={commandId:randomUUID(),expectedVersion:waiting.version};
 const saved=await revokeMerchantInvitation(f.merchant.personId,f.unit.id,waiting.id,command);
 const after=await getMerchantAccessOverview(f.merchant.personId,f.unit.id);
 expect(after).toMatchObject({invitationTotal:102,pendingInvitationCount:0,invitationsTruncated:true});
 expect(after.invitations.some(item=>item.id===waiting.id)).toBe(false);
 expect(await revokeMerchantInvitation(f.merchant.personId,f.unit.id,waiting.id,command)).toMatchObject({id:saved.id,status:"REVOKED",version:saved.version});
},30000);

it("shows fixed direct access without invitation or delegation settings",async()=>{
 const f=await merchantAccessFixture(),overview=merchantAccessOverviewSchema.parse(await getMerchantAccessOverview(f.merchant.personId,f.unit.id));
 expect(overview.controllers).toEqual([{personId:f.merchant.personId,displayName:expect.any(String),basis:"OWNER_MEMBER"}]);
 expect(overview.people).toHaveLength(1);expect(overview.people[0]).toMatchObject({personId:f.operator.personId,expiresAt:null,canRevoke:true});
 expect(overview.people[0]!.permissions).toContain("disputes.respond");expect(overview.people[0]!.permissions).not.toContain("payments.refund");
 expect(overview).not.toHaveProperty("permissionOptions");expect(overview).not.toHaveProperty("invitationOptions");
 await expect(getMerchantAccessOverview(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:403});
});
