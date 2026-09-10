import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {merchantUnits,paymentChannels,merchantUnitCommands} from "../../src/modules/acquiring/schema";
import {merchantAssignments} from "../../src/modules/access/schema";
import {createChannel,createOwnedSubmerchant,pauseMerchant} from "../../src/modules/acquiring/service";
import {acquiringFixture,paymentInput} from "../helpers/acquiring";
import {merchantAccessFixture} from "../helpers/merchant-access";
afterAll(closeDatabase);
async function rejected(run:()=>Promise<unknown>){await expect(run()).rejects.toSatisfy((error:unknown)=>{let current=error as {code?:string;cause?:unknown};for(let i=0;i<5;i++){if(current?.code==="23514")return true;current=current?.cause as typeof current;}return false;});}
it("merchant identity cannot reparent or change its service while ordinary pause preserves it",async()=>{
 const f=await acquiringFixture(),other=await acquiringFixture();const unit=await createOwnedSubmerchant(f.personId,f.merchantId,{commandId:randomUUID(),displayName:"One child"});
 await rejected(()=>getDb().update(merchantUnits).set({masterId:other.merchantId,masterServiceId:other.serviceId}).where(eq(merchantUnits.id,unit.id)));
 await rejected(()=>getDb().delete(merchantUnits).where(eq(merchantUnits.id,unit.id)));
 expect((await pauseMerchant(f.personId,unit.id,{commandId:randomUUID(),expectedVersion:1,reason:"Paused"})).status).toBe("PAUSED");
 const [receipt]=await getDb().select().from(merchantUnitCommands).where(eq(merchantUnitCommands.merchantUnitId,unit.id));await rejected(()=>getDb().delete(merchantUnitCommands).where(eq(merchantUnitCommands.commandId,receipt!.commandId)));
});
it("channel creator, assignment and merchant attribution are immutable and checked on insertion",async()=>{
 const f=await merchantAccessFixture();const channel=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"CREATOR_PRIVATE"});
 await rejected(()=>getDb().update(paymentChannels).set({creatorId:f.merchant.personId}).where(eq(paymentChannels.id,channel.id)));
 const [row]=await getDb().select().from(paymentChannels).where(eq(paymentChannels.id,channel.id));await rejected(()=>getDb().insert(paymentChannels).values({...row!,id:randomUUID(),creatorId:f.helper.personId}));
 await rejected(()=>getDb().insert(paymentChannels).values({...row!,id:randomUUID(),creatorBasis:"PRIMARY_MEMBER",creatorAssignmentId:null}));
});
it("assignment ancestry cannot change or revive after revocation",async()=>{
 const f=await merchantAccessFixture();const [assignment]=await getDb().select().from(merchantAssignments).where(and(eq(merchantAssignments.merchantUnitId,f.unit.id),eq(merchantAssignments.personId,f.operator.personId)));
 await rejected(()=>getDb().update(merchantAssignments).set({sourcePrimaryPersonId:f.helper.personId}).where(eq(merchantAssignments.id,assignment!.id)));
 await getDb().update(merchantAssignments).set({state:"REVOKED",version:2,revokedAt:new Date()}).where(eq(merchantAssignments.id,assignment!.id));
 await rejected(()=>getDb().update(merchantAssignments).set({state:"ACCEPTED",version:3}).where(eq(merchantAssignments.id,assignment!.id)));
 await rejected(()=>getDb().insert(merchantAssignments).values({...assignment!,id:randomUUID(),personId:f.helper.personId,sourcePrimaryPersonId:f.helper.personId}));
});
