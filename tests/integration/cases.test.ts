import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import { getDb, closeDatabase } from "../../src/platform/database/client";
import { services, serviceMembers, permissionGrants } from "../../src/platform/database/schema";
import { bindIdentity } from "../../src/modules/services/service";
import {cardPrimary,issuePracticeCard} from "../helpers/cardholder";
import { getWorkspace } from "../../src/modules/workspace/service";
import { createSupportCase, listSupportCases, getSupportCase, addSupportMessage, withdrawSupportCase } from "../../src/modules/cases/service";
import { supportCaseDetailSchema, supportCaseListSchema } from "../../src/modules/cases/api-contracts";
import { supportCases, supportCaseMessages } from "../../src/modules/cases/schema";
afterAll(closeDatabase);
async function fixture() {const primary=await cardPrimary("Support tester");await issuePracticeCard(primary.personId,primary.serviceId,primary.personId,"Support card","10000","1251");return {...primary,workspace:await getWorkspace(primary.personId,primary.serviceId)};}
async function viewer(serviceId:string) {
  const actor=await bindIdentity("urn:etail:isolated-fixture",randomUUID(),"Fictional private support viewer");
  await getDb().insert(serviceMembers).values({serviceId,personId:actor.personId,state:"ACCEPTED"});
  return actor.personId;
}
const input=(subject="Question about my service")=>({commandId:randomUUID(),topic:"SERVICE" as const,subject,message:"This is a fictional support question.",transactionId:null});
describe("private support case lifecycle",()=>{
  it("persists create, update and reasoned withdrawal without financial effects",async()=>{
    const {personId,serviceId,workspace}=await fixture();
    const opened=await createSupportCase(personId,serviceId,input());supportCaseDetailSchema.parse(opened);
    expect(opened).toMatchObject({status:"OPEN",version:1,canUpdate:true,privacy:"CUSTOMER_AND_ASSIGNED_SUPPORT",delivery:"SANDBOX_SUPPORT",nextActor:"SUPPORT"});
    expect(opened.messages).toHaveLength(1);expect(opened.messages[0]).toMatchObject({kind:"OPENED",author:"YOU"});
    const updated=await addSupportMessage(personId,serviceId,opened.id,{commandId:randomUUID(),expectedVersion:1,message:"A further detail"});
    expect(updated).toMatchObject({status:"OPEN",version:2});expect(updated.messages.map(row=>row.body)).toContain("A further detail");
    const closed=await withdrawSupportCase(personId,serviceId,opened.id,{commandId:randomUUID(),expectedVersion:2,reason:"I no longer need this question reviewed."});
    expect(closed).toMatchObject({status:"WITHDRAWN",version:3,canUpdate:false,nextActor:"NONE"});
    expect((await getSupportCase(personId,serviceId,opened.id)).messages.map(row=>row.kind)).toEqual(["OPENED","MESSAGE","WITHDRAWN"]);
    await expect(addSupportMessage(personId,serviceId,opened.id,{commandId:randomUUID(),expectedVersion:3,message:"Not allowed after withdrawal"})).rejects.toThrow("INVALID_STATE");
    const after=await getWorkspace(personId,serviceId);expect(after.activity).toEqual(workspace.activity);expect(after.cards).toEqual(workspace.cards);
  });
  it("lets a Viewer manage only their own cases; an Owner cannot read their messages",async()=>{
    const a=await fixture(),b=await fixture();const personId=await viewer(a.serviceId);
    const own=await createSupportCase(personId,a.serviceId,input("Private Viewer question"));
    expect((await listSupportCases(a.personId,a.serviceId,{q:""})).cases).toEqual([]);
    await expect(getSupportCase(a.personId,a.serviceId,own.id)).rejects.toThrow("RESOURCE_UNAVAILABLE");
    await expect(addSupportMessage(a.personId,a.serviceId,own.id,{commandId:randomUUID(),expectedVersion:1,message:"Owner cannot do this"})).rejects.toThrow("RESOURCE_UNAVAILABLE");
    await expect(getSupportCase(personId,b.serviceId,own.id)).rejects.toThrow("SERVICE_UNAVAILABLE");
    await expect(getSupportCase(b.personId,b.serviceId,own.id)).rejects.toThrow("RESOURCE_UNAVAILABLE");
    expect((await getSupportCase(personId,a.serviceId,own.id)).canUpdate).toBe(true);
  });
  it("authorizes linked transaction context now, and redacts it after read permission is revoked",async()=>{
    const a=await fixture(),b=await fixture();const transaction=a.workspace.activity[0]!;
    await expect(createSupportCase(a.personId,a.serviceId,{...input(),transactionId:b.workspace.activity[0]!.id})).rejects.toThrow("RESOURCE_UNAVAILABLE");
    const opened=await createSupportCase(a.personId,a.serviceId,{...input(),topic:"TRANSACTION",transactionId:transaction.id});
    expect(opened.transaction).toEqual({id:transaction.id,title:transaction.title});
    await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,a.serviceId),eq(permissionGrants.personId,a.personId),eq(permissionGrants.action,"activity.read")));
    const redacted=await getSupportCase(a.personId,a.serviceId,opened.id);expect(redacted.transaction).toBeNull();expect(redacted.transactionUnavailable).toBe(true);
    await expect(createSupportCase(a.personId,a.serviceId,{...input(),transactionId:transaction.id})).rejects.toThrow("ACTION_DENIED");
    expect((await addSupportMessage(a.personId,a.serviceId,opened.id,{commandId:randomUUID(),expectedVersion:1,message:"I can still update my own support text."})).transaction).toBeNull();
  });
  it("deduplicates simultaneous commands, rejects altered retries and orders competing versions",async()=>{
    const {personId,serviceId}=await fixture();const command=input();
    const [first,replay]=await Promise.all([createSupportCase(personId,serviceId,command),createSupportCase(personId,serviceId,command)]);
    expect(replay.id).toBe(first.id);expect(replay.messages).toHaveLength(1);
    await expect(createSupportCase(personId,serviceId,{...command,subject:"Changed payload"})).rejects.toThrow("IDEMPOTENCY_CONFLICT");
    const change={commandId:randomUUID(),expectedVersion:1,message:"One saved update"};
    const updates=await Promise.all([addSupportMessage(personId,serviceId,first.id,change),addSupportMessage(personId,serviceId,first.id,change)]);expect(updates.map(row=>row.version)).toEqual([2,2]);
    const competing=await Promise.allSettled([addSupportMessage(personId,serviceId,first.id,{commandId:randomUUID(),expectedVersion:2,message:"One competing action"}),withdrawSupportCase(personId,serviceId,first.id,{commandId:randomUUID(),expectedVersion:2,reason:"Another competing action"})]);
    expect(competing.filter(row=>row.status==="fulfilled")).toHaveLength(1);expect(competing.filter(row=>row.status==="rejected")).toHaveLength(1);
    const latest=await getSupportCase(personId,serviceId,first.id);expect(latest.version).toBe(3);expect(latest.messages).toHaveLength(3);
    expect((await createSupportCase(personId,serviceId,command)).version).toBe(3);
  });
  it("rechecks service membership and closure before reads, writes and retry receipts",async()=>{
    const {personId,serviceId}=await fixture();const command=input(),opened=await createSupportCase(personId,serviceId,command);
    await getDb().update(serviceMembers).set({state:"REVOKED"}).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,personId)));
    await expect(getSupportCase(personId,serviceId,opened.id)).rejects.toThrow("SERVICE_UNAVAILABLE");
    await expect(createSupportCase(personId,serviceId,command)).rejects.toThrow("SERVICE_UNAVAILABLE");
    await getDb().update(serviceMembers).set({state:"ACCEPTED"}).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,personId)));
    await getDb().update(services).set({status:"CLOSED"}).where(eq(services.id,serviceId));
    await expect(listSupportCases(personId,serviceId,{q:""})).rejects.toThrow("SERVICE_UNAVAILABLE");
    expect((await getDb().select().from(supportCaseMessages).where(eq(supportCaseMessages.caseId,opened.id)))).toHaveLength(1);
  });
  it("pages creator-private searches without duplicate rows and treats wildcard characters literally",async()=>{
    const {personId,serviceId}=await fixture();const made=[];
    for(let i=0;i<27;i++)made.push(await createSupportCase(personId,serviceId,input(`Batch ${i} 100%_`)));
    const first=await listSupportCases(personId,serviceId,{q:"100%_"});supportCaseListSchema.parse(first);expect(first.cases).toHaveLength(25);expect(first.nextCursor).toBeTruthy();
    const second=await listSupportCases(personId,serviceId,{q:"100%_",cursor:first.nextCursor!});expect(second.cases).toHaveLength(2);expect(second.nextCursor).toBeNull();expect(new Set([...first.cases,...second.cases].map(row=>row.id)).size).toBe(27);
    const closed=made[0]!;await withdrawSupportCase(personId,serviceId,closed.id,{commandId:randomUUID(),expectedVersion:1,reason:"Done with this question."});
    expect((await listSupportCases(personId,serviceId,{q:"",status:"WITHDRAWN"})).cases.map(row=>row.id)).toEqual([closed.id]);
    const stranger=await fixture();await expect(listSupportCases(stranger.personId,stranger.serviceId,{q:"",cursor:first.nextCursor!})).rejects.toThrow("RESOURCE_UNAVAILABLE");
    expect((await getDb().select().from(supportCases).where(eq(supportCases.serviceId,serviceId)))).toHaveLength(27);
  });
});
