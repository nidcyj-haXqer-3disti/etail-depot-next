import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {merchantUnits,paymentChannelCommands} from "../../src/modules/acquiring/schema";
import {createOwnedSubmerchant,createChannel,updateChannel} from "../../src/modules/acquiring/service";
import {acquiringFixture,paymentInput} from "../helpers/acquiring";
afterAll(closeDatabase);
it("concurrent direct submerchant retries share one child without a host lock or consent phase",async()=>{
 const f=await acquiringFixture(),input={commandId:randomUUID(),displayName:"One concurrent child"};const results=await Promise.all(Array.from({length:5},()=>createOwnedSubmerchant(f.personId,f.merchantId,input)));
 expect(new Set(results.map(row=>row.id)).size).toBe(1);expect(results.every(row=>row.status==="ACTIVE")).toBe(true);expect(await getDb().select().from(merchantUnits).where(eq(merchantUnits.masterId,f.merchantId))).toHaveLength(1);
});
it("concurrent channel creation has one effect and competing optimistic edits have one winner",async()=>{
 const f=await acquiringFixture(),input={...paymentInput(),presentations:["WEB"] as ["WEB"],visibility:"CREATOR_PRIVATE" as const};const channels=await Promise.all(Array.from({length:5},()=>createChannel(f.personId,f.merchantId,input)));expect(new Set(channels.map(row=>row.id)).size).toBe(1);
 const results=await Promise.allSettled(["2500","3500"].map(amountMinor=>updateChannel(f.personId,f.merchantId,channels[0]!.id,{...input,commandId:randomUUID(),expectedVersion:1,amountMinor})));
 expect(results.filter(row=>row.status==="fulfilled")).toHaveLength(1);expect(results.find(row=>row.status==="rejected")).toMatchObject({reason:{code:"STALE_VERSION"}});expect(await getDb().select().from(paymentChannelCommands).where(eq(paymentChannelCommands.merchantUnitId,f.merchantId))).toHaveLength(2);
});
