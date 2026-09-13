import {randomUUID} from "node:crypto";
import {afterAll,expect,it} from "vitest";
import {closeDatabase} from "../../src/platform/database/client";
import {createTerminal,getMerchantWorkspace,getMerchantBusinessDetails,updateMerchantAccountSetup,updateMerchantSetup} from "../../src/modules/acquiring/service";
import {getMerchantDashboard} from "../../src/modules/acquiring/dashboard-service";
import {acquiringFixture,completeSetup} from "../helpers/acquiring";
import {merchantAccessFixture} from "../helpers/merchant-access";

afterAll(closeDatabase);
it("terminal purpose survives creation, reload and exact command replay without inviting or funding anyone",async()=>{
 const f=await acquiringFixture(),before=await getMerchantDashboard(f.personId);
 const input={commandId:randomUUID(),displayName:"A terminal for a future recipient",intendedUse:"OTHER" as const};
 const terminal=await createTerminal(f.personId,f.serviceId,input);
 expect(terminal.intendedUse).toBe("OTHER");
 expect(await createTerminal(f.personId,f.serviceId,input)).toEqual(terminal);
 expect((await getMerchantWorkspace(f.personId,terminal.id)).merchant.intendedUse).toBe("OTHER");
 await expect(createTerminal(f.personId,f.serviceId,{...input,intendedUse:"SELF"})).rejects.toMatchObject({status:409});
 const dashboard=await getMerchantDashboard(f.personId);
 expect(dashboard.units.find(row=>row.id===terminal.id)).toMatchObject({intendedUse:"OTHER",forOthers:true,ownerAccess:true});
 expect(dashboard.moneyAccounts).toEqual(before.moneyAccounts);
 const oldInput={commandId:randomUUID(),displayName:"Existing omitted-purpose protocol"};
 const self=await createTerminal(f.personId,f.serviceId,oldInput);
 expect(self.intendedUse).toBe("SELF");expect(await createTerminal(f.personId,f.serviceId,oldInput)).toEqual(self);
 await expect(createTerminal(f.personId,f.serviceId,{...oldInput,intendedUse:"SELF"})).rejects.toMatchObject({status:409});
});
it("owner use categories respect current assigned recipients while recipients see only their own usable terminal",async()=>{
 const f=await merchantAccessFixture();
 const owner=await getMerchantDashboard(f.merchant.personId),recipient=await getMerchantDashboard(f.operator.personId);
 expect(owner.units.find(row=>row.id===f.unit.id)).toMatchObject({forOthers:true,ownerAccess:true});
 expect(recipient.units).toHaveLength(1);expect(recipient.units[0]).toMatchObject({id:f.unit.id,forOthers:false,ownerAccess:false});
 expect(recipient.moneyAccounts).toEqual([]);
});
it("account settings use the exact business application and the existing command receipt while denying terminal recipients and foreign owners",async()=>{
 const f=await merchantAccessFixture(),other=await acquiringFixture();
 const account=await getMerchantBusinessDetails(f.merchant.personId,f.merchant.serviceId,"SERVICE");
 const terminal=await getMerchantBusinessDetails(f.merchant.personId,f.unit.id);
 expect(account.setup?.id).toBe(terminal.setup?.id);expect(account.merchantId).toBe(f.merchant.serviceId);
 const fields=completeSetup(account.setup!.version);
 const saved=await updateMerchantAccountSetup(f.merchant.personId,f.merchant.serviceId,account.setup!.id,fields);
 expect(await updateMerchantSetup(f.merchant.personId,f.unit.id,account.setup!.id,fields)).toEqual(saved);
 for(const person of [f.operator.personId,other.personId]){
  await expect(getMerchantBusinessDetails(person,f.merchant.serviceId,"SERVICE")).rejects.toMatchObject({status:404});
  await expect(updateMerchantAccountSetup(person,f.merchant.serviceId,saved.id,{...fields,commandId:randomUUID(),expectedVersion:saved.version})).rejects.toMatchObject({status:404});
 }
});
