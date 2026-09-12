import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {serviceMembers,services} from "../../src/platform/database/schema";
import {createCardholderService} from "../../src/modules/services/service";
import {createTerminal,createChannel,getMerchantWorkspace,pauseMerchant,resumeMerchant,getMerchantDirectory} from "../../src/modules/acquiring/service";
import {getMerchantDashboard} from "../../src/modules/acquiring/dashboard-service";
import {merchantAccessFixture} from "../helpers/merchant-access";
import {paymentInput} from "../helpers/acquiring";
afterAll(closeDatabase);
it("owner sees every terminal while users see only their exact assignments",async()=>{
 const f=await merchantAccessFixture(),sibling=await createTerminal(f.merchant.personId,f.merchant.serviceId,{commandId:randomUUID(),displayName:"Other terminal"});
 const own=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["WEB","QR"],visibility:"ASSIGNED"});
 const other=await createChannel(f.merchant.personId,sibling.id,{...paymentInput(),description:"Other terminal order",presentations:["WEB"],visibility:"ASSIGNED"});
 expect((await getMerchantWorkspace(f.merchant.personId,f.unit.id))).toMatchObject({ownerAccess:true,serviceRole:"OWNER"});
 expect((await getMerchantWorkspace(f.operator.personId,f.unit.id)).channels.map(row=>row.id)).toEqual([own.id]);
 for(const id of [f.master.id,sibling.id,randomUUID(),"invalid"])await expect(getMerchantWorkspace(f.operator.personId,id)).rejects.toMatchObject({status:404});
 expect((await getMerchantDirectory(f.operator.personId)).units.map(row=>row.id)).toEqual([f.unit.id]);
 const dashboard=await getMerchantDashboard(f.operator.personId);expect(dashboard.moneyAccounts).toEqual([]);expect(dashboard.units.map(row=>row.id)).toEqual([f.unit.id]);expect(JSON.stringify(dashboard)).not.toContain(other.id);expect(JSON.stringify(dashboard)).not.toContain("Other terminal");
 expect((await getMerchantDashboard(f.merchant.personId)).merchants).toHaveLength(1);
});
it("terminals pause independently, retain owner history and resume without a parent hierarchy",async()=>{
 const f=await merchantAccessFixture(),input={...paymentInput(),presentations:["WEB"] as ["WEB"],visibility:"ASSIGNED" as const};await createChannel(f.operator.personId,f.unit.id,input);
 const otherPause=await pauseMerchant(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:1,reason:"Pause main counter"});
 expect((await getMerchantWorkspace(f.operator.personId,f.unit.id)).canCreateChannel).toBe(true);
 const pause=await pauseMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:1,reason:"Stop this terminal"});
 await expect(getMerchantWorkspace(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:404});expect((await getMerchantWorkspace(f.merchant.personId,f.unit.id)).channels).toHaveLength(1);
 await resumeMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:pause.version,reason:"Reopen terminal"});expect((await getMerchantWorkspace(f.operator.personId,f.unit.id)).canCreateChannel).toBe(true);expect((await getMerchantWorkspace(f.merchant.personId,f.master.id)).merchant.version).toBe(otherPause.version);
});
it("card membership and terminal access are independent, but changed owner authority invalidates old terminal assignments",async()=>{
 const f=await merchantAccessFixture(),card=await createCardholderService(f.operator.personId,{commandId:randomUUID(),displayName:"Independent cards"});
 await getDb().update(serviceMembers).set({state:"REVOKED",version:2}).where(eq(serviceMembers.serviceId,card.serviceId));expect((await getMerchantWorkspace(f.operator.personId,f.unit.id)).canCreateChannel).toBe(true);
 await getDb().update(serviceMembers).set({version:2}).where(and(eq(serviceMembers.serviceId,f.merchant.serviceId),eq(serviceMembers.personId,f.merchant.personId)));await expect(getMerchantWorkspace(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:404});
});
it("a suspended merchant stops all terminals while the owner can read saved history",async()=>{
 const f=await merchantAccessFixture();await getDb().update(services).set({status:"SUSPENDED"}).where(eq(services.id,f.merchant.serviceId));
 await expect(getMerchantWorkspace(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:404});expect((await getMerchantWorkspace(f.merchant.personId,f.unit.id)).canCreateChannel).toBe(false);
 await expect(createChannel(f.merchant.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"ASSIGNED"})).rejects.toMatchObject({status:404});
});
