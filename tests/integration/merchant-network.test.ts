import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {permissionGrants,serviceMembers,services} from "../../src/platform/database/schema";
import {createCardholderService} from "../../src/modules/services/service";
import {createOwnedSubmerchant,createChannel,getMerchantWorkspace,pauseMerchant,resumeMerchant,getMerchantDirectory} from "../../src/modules/acquiring/service";
import {getMerchantDashboard} from "../../src/modules/acquiring/dashboard-service";
import {getMerchantNetwork,getMerchantOperations,configureTestGateway,enrollTestMerchant,setChannelActivation,simulateMerchantPayment} from "../../src/modules/acquiring/operations-service";
import {merchantAccessFixture} from "../helpers/merchant-access";
import {paymentInput} from "../helpers/acquiring";
afterAll(closeDatabase);
it("primary sees its exact network including creator-private channels; a submerchant sees only its assigned unit",async()=>{
 const f=await merchantAccessFixture();const sibling=await createOwnedSubmerchant(f.merchant.personId,f.master.id,{commandId:randomUUID(),displayName:"Private sibling"});
 const own=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["WEB","QR"],visibility:"CREATOR_PRIVATE"});
 const other=await createChannel(f.merchant.personId,sibling.id,{...paymentInput(),description:"Sibling private",presentations:["WEB"],visibility:"CREATOR_PRIVATE"});
 expect((await getMerchantNetwork(f.merchant.personId,f.master.id)).channels.map(row=>row.id).sort()).toEqual([own.id,other.id].sort());
 expect((await getMerchantWorkspace(f.merchant.personId,f.unit.id))).toMatchObject({primaryAccess:true,serviceRole:"SUB"});
 expect((await getMerchantWorkspace(f.operator.personId,f.unit.id)).channels.map(row=>row.id)).toEqual([own.id]);
 for(const id of [f.master.id,sibling.id,randomUUID(),"invalid"])await expect(getMerchantWorkspace(f.operator.personId,id)).rejects.toMatchObject({status:404});
 await expect(getMerchantNetwork(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:404});
 expect((await getMerchantDirectory(f.operator.personId)).units.map(row=>row.id)).toEqual([f.unit.id]);
 const dashboard=await getMerchantDashboard(f.operator.personId);expect(dashboard.primaryNetworks).toEqual([]);expect(dashboard.delegatedUnitIds).toEqual([f.unit.id]);expect(JSON.stringify(dashboard)).not.toContain(other.id);expect(JSON.stringify(dashboard)).not.toContain("Private sibling");
});
it("pausing a primary stops descendant operations and saved retries while primary history remains readable",async()=>{
 const f=await merchantAccessFixture(),input={...paymentInput(),presentations:["WEB"] as ["WEB"],visibility:"CREATOR_PRIVATE" as const};const channel=await createChannel(f.operator.personId,f.unit.id,input);
 await configureTestGateway(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});await enrollTestMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});await setChannelActivation(f.operator.personId,f.unit.id,channel.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:1,active:true});
 const payment={commandId:randomUUID(),expectedChannelVersion:1,outcome:"APPROVED" as const};const paid=await simulateMerchantPayment(f.operator.personId,f.unit.id,channel.id,payment);
 const pause={commandId:randomUUID(),expectedVersion:1,reason:"Stop collections"};expect((await pauseMerchant(f.merchant.personId,f.master.id,pause)).status).toBe("PAUSED");expect((await pauseMerchant(f.merchant.personId,f.master.id,pause)).version).toBe(2);
 await expect(createChannel(f.operator.personId,f.unit.id,input)).rejects.toMatchObject({status:404});await expect(simulateMerchantPayment(f.operator.personId,f.unit.id,channel.id,payment)).rejects.toMatchObject({status:404});
 const history=await getMerchantOperations(f.merchant.personId,f.unit.id);expect(history.payments[0]?.id).toBe(paid.id);expect(history).toMatchObject({canPayout:false,canConfigureGateway:false});
 expect((await getMerchantWorkspace(f.merchant.personId,f.unit.id)).canCreateChannel).toBe(false);
});
it("Cardholder membership revocation cannot revoke merchant-specific access or ancestry",async()=>{
 const f=await merchantAccessFixture();const card=await createCardholderService(f.operator.personId,{commandId:randomUUID(),displayName:"Independent card service"});
 await getDb().update(serviceMembers).set({state:"REVOKED",version:2}).where(eq(serviceMembers.serviceId,card.serviceId));
 expect((await getMerchantWorkspace(f.operator.personId,f.unit.id)).canCreateChannel).toBe(true);
 expect((await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"CREATOR_PRIVATE"})).merchantUnitId).toBe(f.unit.id);
});
it("primary hierarchy visibility never invents a payment read grant",async()=>{
 const f=await merchantAccessFixture();await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,f.merchant.serviceId),eq(permissionGrants.action,"payments.read")));
 const network=await getMerchantNetwork(f.merchant.personId,f.master.id);expect(network).toMatchObject({canReadPayments:false,availableFunds:null,payments:[],payouts:[]});expect(network.units).toHaveLength(2);
 const dashboard=await getMerchantDashboard(f.merchant.personId);for(const entry of [...dashboard.units,...dashboard.views])expect(entry.totals).toMatchObject({available:null,settled:null,pending:null,bank:null});
});

it("resume restores only current explicit submerchant authority and keeps independently paused children stopped",async()=>{
 const f=await merchantAccessFixture();
 const pauseChild=await pauseMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:1,reason:"Pause this collection unit"});
 const pausePrimary=await pauseMerchant(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:1,reason:"Pause the network"});
 await expect(resumeMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:pauseChild.version,reason:"Too early"})).rejects.toMatchObject({code:"PRIMARY_MERCHANT_PAUSED",status:409});
 const resume={commandId:randomUUID(),expectedVersion:pausePrimary.version,reason:"Resume the network"};
 expect(await resumeMerchant(f.merchant.personId,f.master.id,resume)).toMatchObject({status:"ACTIVE",version:3});
 expect(await resumeMerchant(f.merchant.personId,f.master.id,resume)).toMatchObject({status:"ACTIVE",version:3});
 await expect(getMerchantWorkspace(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:404});
 await resumeMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:pauseChild.version,reason:"Resume the collection unit"});
 expect((await getMerchantWorkspace(f.operator.personId,f.unit.id)).canCreateChannel).toBe(true);
 expect((await getMerchantWorkspace(f.merchant.personId,f.unit.id)).timeline.map(row=>row.label)).toEqual(expect.arrayContaining(["Merchant created","Merchant paused","Merchant resumed"]));
 await pauseMerchant(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:3,reason:"Review delegated access"});
 await getDb().update(serviceMembers).set({version:2}).where(and(eq(serviceMembers.serviceId,f.merchant.serviceId),eq(serviceMembers.personId,f.merchant.personId)));
 await resumeMerchant(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:4,reason:"Resume with reviewed permissions"});
 await expect(getMerchantWorkspace(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:404});
});
it("a suspended Merchant service stops operating commands without affecting independent Cardholder services",async()=>{
 const f=await merchantAccessFixture();
 await getDb().update(services).set({status:"SUSPENDED"}).where(eq(services.id,f.merchant.serviceId));
 await expect(getMerchantWorkspace(f.operator.personId,f.unit.id)).rejects.toMatchObject({status:404});
 const primary=await getMerchantWorkspace(f.merchant.personId,f.unit.id);expect(primary.canCreateChannel).toBe(false);
 await expect(createChannel(f.merchant.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"CREATOR_PRIVATE"})).rejects.toMatchObject({status:404});
});
