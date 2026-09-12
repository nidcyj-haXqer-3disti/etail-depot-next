import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {serviceMembers} from "../../src/platform/database/schema";
import {createTerminal,getMerchantWorkspace,createChannel,updateChannel} from "../../src/modules/acquiring/service";
import {merchantTerminals,merchantUnitCommands} from "../../src/modules/acquiring/schema";
import {acquiringFixture,paymentInput} from "../helpers/acquiring";
import {merchantAccessFixture} from "../helpers/merchant-access";
afterAll(closeDatabase);
it("owner creates several flat terminals and revoked ownership blocks retries",async()=>{
 const f=await acquiringFixture(),input={commandId:randomUUID(),displayName:"Market stall"};const first=await createTerminal(f.personId,f.serviceId,input);
 expect(first).toMatchObject({status:"ACTIVE",merchant:{serviceId:f.serviceId}});expect(await createTerminal(f.personId,f.serviceId,input)).toEqual(first);
 const next=await createTerminal(f.personId,f.serviceId,{commandId:randomUUID(),displayName:"Online shop"});expect(next.id).not.toBe(first.id);
 expect(await getDb().select().from(merchantTerminals).where(eq(merchantTerminals.merchantServiceId,f.serviceId))).toHaveLength(3);
 expect(await getDb().select().from(merchantUnitCommands).where(eq(merchantUnitCommands.commandId,input.commandId))).toHaveLength(1);
 await expect(createTerminal(f.personId,f.serviceId,{...input,displayName:"Changed"})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
 await getDb().update(serviceMembers).set({state:"REVOKED",version:2}).where(and(eq(serviceMembers.serviceId,f.serviceId),eq(serviceMembers.personId,f.personId)));
 await expect(createTerminal(f.personId,f.serviceId,input)).rejects.toMatchObject({status:404});
});
it("channels retain creator provenance while all assigned users work within their terminal",async()=>{
 const f=await merchantAccessFixture();const channel=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["SMS","EMAIL","INVOICE","BILL","SOCIAL","QR","WEB"],visibility:"ASSIGNED"});
 const owner=await getMerchantWorkspace(f.merchant.personId,f.unit.id);expect(owner.channels[0]).toMatchObject({id:channel.id,creatorId:f.operator.personId,canEdit:true,visibility:"ASSIGNED"});expect(owner.allowedPresentations).toHaveLength(7);
 const saved=await updateChannel(f.merchant.personId,f.unit.id,channel.id,{...paymentInput(),expectedVersion:1,presentations:["WEB"],visibility:"ASSIGNED",amountMinor:"1234"});expect(saved.amount.minor).toBe("1234");expect(saved.creatorId).toBe(f.operator.personId);
 expect((await getMerchantWorkspace(f.operator.personId,f.unit.id)).channels[0]?.id).toBe(channel.id);
 await expect(getMerchantWorkspace(f.helper.personId,f.unit.id)).rejects.toMatchObject({status:404});
});
