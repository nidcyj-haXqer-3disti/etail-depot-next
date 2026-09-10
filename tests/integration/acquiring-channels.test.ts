import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {permissionGrants} from "../../src/platform/database/schema";
import {createOwnedSubmerchant,getMerchantWorkspace,createChannel,updateChannel} from "../../src/modules/acquiring/service";
import {merchantUnits,merchantUnitCommands} from "../../src/modules/acquiring/schema";
import {acquiringFixture,paymentInput} from "../helpers/acquiring";
import {merchantAccessFixture} from "../helpers/merchant-access";
afterAll(closeDatabase);
it("a primary creates several named submerchants directly and retries one command to one unit",async()=>{
 const f=await acquiringFixture(),input={commandId:randomUUID(),displayName:"Market stall"};const first=await createOwnedSubmerchant(f.personId,f.merchantId,input);
 expect(first).toMatchObject({kind:"SUB",status:"ACTIVE",master:{id:f.merchantId,serviceId:f.serviceId}});expect(await createOwnedSubmerchant(f.personId,f.merchantId,input)).toEqual(first);
 const next=await createOwnedSubmerchant(f.personId,f.merchantId,{commandId:randomUUID(),displayName:"Online shop"});expect(next.id).not.toBe(first.id);
 expect(await getDb().select().from(merchantUnits).where(eq(merchantUnits.masterId,f.merchantId))).toHaveLength(2);
 expect(await getDb().select().from(merchantUnitCommands).where(eq(merchantUnitCommands.commandId,input.commandId))).toHaveLength(1);
 const other=await acquiringFixture();await expect(createOwnedSubmerchant(other.personId,f.merchantId,{commandId:randomUUID(),displayName:"Foreign"})).rejects.toMatchObject({status:404});
 await expect(createOwnedSubmerchant(f.personId,first.id,{commandId:randomUUID(),displayName:"Nested"})).rejects.toMatchObject({code:"ACTION_DENIED"});
 await expect(createOwnedSubmerchant(f.personId,f.merchantId,{...input,displayName:"Changed"})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
 await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.action,"merchant.units.create")));
 await expect(createOwnedSubmerchant(f.personId,f.merchantId,input)).rejects.toMatchObject({code:"ACTION_DENIED"});
});
it("primary oversight preserves creator provenance and explicit channel sharing boundaries",async()=>{
 const f=await merchantAccessFixture();const channel=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["SMS","EMAIL","INVOICE","BILL","SOCIAL","QR","WEB"],visibility:"CREATOR_PRIVATE"});
 const owner=await getMerchantWorkspace(f.merchant.personId,f.unit.id);expect(owner.channels[0]).toMatchObject({id:channel.id,creatorId:f.operator.personId,canEdit:true});expect(owner.allowedPresentations).toHaveLength(7);
 const saved=await updateChannel(f.merchant.personId,f.unit.id,channel.id,{...paymentInput(),expectedVersion:1,presentations:["WEB"],visibility:"CREATOR_PRIVATE",amountMinor:"1234"});expect(saved.amount.minor).toBe("1234");expect(saved.creatorId).toBe(f.operator.personId);
 await expect(updateChannel(f.merchant.personId,f.unit.id,channel.id,{...paymentInput(),expectedVersion:2,presentations:["WEB"],visibility:"ASSIGNED"})).rejects.toMatchObject({code:"ACTION_DENIED"});
});
