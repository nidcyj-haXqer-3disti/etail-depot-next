import {randomUUID} from "node:crypto";
import {afterAll,expect,it} from "vitest";
import {eq} from "drizzle-orm";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {serviceMembers} from "../../src/platform/database/schema";
import {merchantOperationCommands} from "../../src/modules/acquiring/operations-schema";
import {getMerchantPaymentSettings,configureMerchantAccountGateway,configureTestGateway,getMerchantOperations} from "../../src/modules/acquiring/operations-service";
import {acquiringFixture} from "../helpers/acquiring";
import {merchantAccessFixture} from "../helpers/merchant-access";
afterAll(closeDatabase);
it("exact business acceptance shares the existing gateway command, version and terminal state",async()=>{
 const f=await acquiringFixture(),initial=await getMerchantPaymentSettings(f.personId,f.serviceId);
 expect(initial).toMatchObject({serviceId:f.serviceId,canConfigureGateway:true,gateway:{serviceId:f.serviceId,mode:"NOT_CONFIGURED",version:0}});
 expect(initial.networks.map(n=>n.id)).toEqual(["visa","mastercard","amex","discover"]);
 const input={commandId:randomUUID(),expectedVersion:0,enabled:true};const saved=await configureMerchantAccountGateway(f.personId,f.serviceId,input);
 expect(saved).toMatchObject({serviceId:f.serviceId,mode:"TEST_READY",version:1});
 expect(await configureTestGateway(f.personId,f.merchantId,input)).toEqual(saved);
 expect(await configureMerchantAccountGateway(f.personId,f.serviceId,input)).toEqual(saved);
 expect(await getDb().select().from(merchantOperationCommands).where(eq(merchantOperationCommands.commandId,input.commandId))).toHaveLength(1);
 expect((await getMerchantOperations(f.personId,f.merchantId)).enrollment.status).toBe("NOT_ENROLLED");
 await expect(configureMerchantAccountGateway(f.personId,f.serviceId,{...input,enabled:false})).rejects.toMatchObject({status:409});
 await expect(configureMerchantAccountGateway(f.personId,f.serviceId,{commandId:randomUUID(),expectedVersion:0,enabled:false})).rejects.toMatchObject({status:409});
 const disabled=await configureMerchantAccountGateway(f.personId,f.serviceId,{commandId:randomUUID(),expectedVersion:1,enabled:false});expect(disabled.mode).toBe("DISABLED");
 expect((await getMerchantOperations(f.personId,f.merchantId))).toMatchObject({gateway:{mode:"DISABLED"},availableFunds:{minor:"0"},bankFunds:{minor:"0"},payments:[]});
});
it("terminal recipients and foreign owners cannot read or alter business acceptance, including exact retries",async()=>{
 const f=await merchantAccessFixture(),other=await acquiringFixture(),input={commandId:randomUUID(),expectedVersion:0,enabled:true};
 await configureMerchantAccountGateway(f.merchant.personId,f.merchant.serviceId,input);
 for(const actor of [f.operator.personId,other.personId]){
  await expect(getMerchantPaymentSettings(actor,f.merchant.serviceId)).rejects.toMatchObject({status:404});
  await expect(configureMerchantAccountGateway(actor,f.merchant.serviceId,input)).rejects.toMatchObject({status:404});
 }
 await getDb().update(serviceMembers).set({state:"REVOKED"}).where(eq(serviceMembers.personId,f.merchant.personId));
 await expect(getMerchantPaymentSettings(f.merchant.personId,f.merchant.serviceId)).rejects.toMatchObject({status:404});
 await expect(configureMerchantAccountGateway(f.merchant.personId,f.merchant.serviceId,input)).rejects.toMatchObject({status:404});
 expect(await getDb().select().from(merchantOperationCommands).where(eq(merchantOperationCommands.commandId,input.commandId))).toHaveLength(1);
});
