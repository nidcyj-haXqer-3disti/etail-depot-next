import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {afterAll,expect,it} from "vitest";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {merchantTerminals,paymentChannels,merchantUnitCommands} from "../../src/modules/acquiring/schema";
import {terminalAssignments} from "../../src/modules/access/schema";
import {createChannel,createTerminal,pauseMerchant} from "../../src/modules/acquiring/service";
import {acquiringFixture,paymentInput} from "../helpers/acquiring";
import {merchantAccessFixture} from "../helpers/merchant-access";
afterAll(closeDatabase);
async function rejected(run:()=>Promise<unknown>){await expect(run()).rejects.toSatisfy((error:unknown)=>{let current=error as {code?:string;cause?:unknown};for(let i=0;i<5;i++){if(current?.code==="23514")return true;current=current?.cause as typeof current;}return false;});}
it("merchant identity cannot reparent or change its service while ordinary pause preserves it",async()=>{
 const f=await acquiringFixture(),other=await acquiringFixture();const unit=await createTerminal(f.personId,f.serviceId,{commandId:randomUUID(),displayName:"One terminal"});
 await rejected(()=>getDb().update(merchantTerminals).set({merchantServiceId:other.serviceId}).where(eq(merchantTerminals.id,unit.id)));
 await rejected(()=>getDb().delete(merchantTerminals).where(eq(merchantTerminals.id,unit.id)));
 expect((await pauseMerchant(f.personId,unit.id,{commandId:randomUUID(),expectedVersion:1,reason:"Paused"})).status).toBe("PAUSED");
 const [receipt]=await getDb().select().from(merchantUnitCommands).where(eq(merchantUnitCommands.merchantUnitId,unit.id));await rejected(()=>getDb().delete(merchantUnitCommands).where(eq(merchantUnitCommands.commandId,receipt!.commandId)));
});
it("channel creator, assignment and merchant attribution are immutable and checked on insertion",async()=>{
 const f=await merchantAccessFixture();const channel=await createChannel(f.operator.personId,f.unit.id,{...paymentInput(),presentations:["WEB"],visibility:"CREATOR_PRIVATE"});
 await rejected(()=>getDb().update(paymentChannels).set({creatorId:f.merchant.personId}).where(eq(paymentChannels.id,channel.id)));
 const [row]=await getDb().select().from(paymentChannels).where(eq(paymentChannels.id,channel.id));await rejected(()=>getDb().insert(paymentChannels).values({...row!,id:randomUUID(),creatorId:f.helper.personId}));
 await rejected(()=>getDb().insert(paymentChannels).values({...row!,id:randomUUID(),creatorBasis:"PRIMARY_MEMBER",creatorAssignmentId:null}));
});
it("terminal assignment ownership cannot change or revive after revocation",async()=>{
 const f=await merchantAccessFixture();const [assignment]=await getDb().select().from(terminalAssignments).where(and(eq(terminalAssignments.terminalId,f.unit.id),eq(terminalAssignments.personId,f.operator.personId)));
 await rejected(()=>getDb().update(terminalAssignments).set({grantedByPersonId:f.helper.personId}).where(eq(terminalAssignments.id,assignment!.id)));
 await getDb().update(terminalAssignments).set({state:"REVOKED",version:2,revokedAt:new Date()}).where(eq(terminalAssignments.id,assignment!.id));
 await rejected(()=>getDb().update(terminalAssignments).set({state:"ACCEPTED",version:3}).where(eq(terminalAssignments.id,assignment!.id)));
 await rejected(()=>getDb().insert(terminalAssignments).values({...assignment!,id:randomUUID(),personId:f.helper.personId,grantedByPersonId:f.helper.personId}));
});
