import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {paymentChannels} from "../../src/modules/acquiring/schema";
import {createChannel,pauseMerchant} from "../../src/modules/acquiring/service";
import {getMerchantDashboard} from "../../src/modules/acquiring/dashboard-service";
import {configureTestGateway,enrollTestMerchant,setChannelActivation} from "../../src/modules/acquiring/operations-service";
import {merchantAccessFixture} from "../helpers/merchant-access";
import {paymentInput} from "../helpers/acquiring";
afterAll(closeDatabase);
it("directs owner setup and terminal daily work without showing terminal users money controls",async()=>{
 const f=await merchantAccessFixture(),unit=async(personId:string)=>(await getMerchantDashboard(personId)).units.find(row=>row.id===f.unit.id)!;
 expect((await unit(f.merchant.personId)).collectionAvailability.code).toBe("SETUP_REQUIRED");expect((await unit(f.operator.personId)).collectionAvailability.code).toBe("OWNER_ACTION_REQUIRED");
 await configureTestGateway(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});await enrollTestMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
 expect((await unit(f.operator.personId)).collectionAvailability.code).toBe("CHANNEL_REQUIRED");
 const channel=await createChannel(f.merchant.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"ASSIGNED"});
 expect((await unit(f.operator.personId)).collectionAvailability.code).toBe("CHANNEL_REVIEW_REQUIRED");
 await setChannelActivation(f.operator.personId,f.unit.id,channel.id,{commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:1,active:true});
 expect((await unit(f.operator.personId)).collectionAvailability.code).toBe("READY");expect((await unit(f.operator.personId)).totals.available).toBeNull();
 await getDb().update(paymentChannels).set({expiresAt:new Date(Date.now()-1000)}).where(eq(paymentChannels.id,channel.id));expect((await unit(f.operator.personId)).collectionAvailability.code).toBe("CHANNEL_REVIEW_REQUIRED");
});
it("pausing one terminal removes only its users' active access",async()=>{
 const f=await merchantAccessFixture();await pauseMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:1,reason:"Pause terminal"});
 expect((await getMerchantDashboard(f.operator.personId)).units).toEqual([]);
 const owner=await getMerchantDashboard(f.merchant.personId);expect(owner.units).toHaveLength(2);expect(owner.units.find(row=>row.id===f.unit.id)?.collectionAvailability.code).toBe("PAUSED");expect(owner.units.find(row=>row.id===f.master.id)?.collectionAvailability.code).toBe("SETUP_REQUIRED");
});
