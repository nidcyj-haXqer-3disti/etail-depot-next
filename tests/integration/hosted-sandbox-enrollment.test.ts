import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {afterAll,afterEach,describe,expect,it,vi} from "vitest";
import targets from "../../project-targets.json" with {type:"json"};
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {people,serviceMembers,permissionGrants} from "../../src/platform/database/schema";
import {bindIdentity} from "../../src/modules/services/service";
import {sandboxParticipants} from "../../src/modules/sandbox/schema";
import {startSandbox,getSandboxOverview,findSandboxRecipient,sandboxPersona,requireSandboxParticipant} from "../../src/modules/sandbox/service";
import {operatorServiceAccess} from "../../src/modules/operations/schema";
import {merchantSetupEligibility} from "../../src/modules/services/schema";
const issuer=`${targets.netlify.canonical_origin}/.netlify/identity`;
function production(){vi.stubEnv("APP_ENV","production");vi.stubEnv("SITE_ID",targets.netlify.site_id);vi.stubEnv("ETAIL_PUBLIC_ORIGIN",targets.netlify.canonical_origin);vi.stubEnv("ENABLE_LOCAL_FIXTURE_IDENTITY","false");vi.stubEnv("ENABLE_REAL_MONEY","false");}
afterEach(()=>vi.unstubAllEnvs());afterAll(closeDatabase);
describe("explicit hosted sandbox participation",()=>{
 it("requires an existing canonical identity and deliberate acknowledgement without creating service/operator/real eligibility grants",async()=>{
  const person=await bindIdentity(issuer,randomUUID()),wrong=await bindIdentity("https://wrong.example.test",randomUUID()),fixture=await bindIdentity("urn:etail:isolated-fixture",randomUUID());production();
  const input={commandId:randomUUID(),displayName:"Practice Member",acknowledged:true as const};
  expect(await getSandboxOverview(person.personId)).toMatchObject({joined:false,memberCode:null});
  await expect(startSandbox(person.personId,{...input,acknowledged:false as never})).rejects.toMatchObject({code:"INVALID_REQUEST"});
  for(const id of [wrong.personId,fixture.personId,randomUUID()])await expect(startSandbox(id,input)).rejects.toMatchObject({status:404});
  const state=await startSandbox(person.personId,input);expect(state).toMatchObject({joined:true,displayName:"Practice Member"});expect(state.memberCode).toMatch(/^ED-[A-F0-9]{20}$/);
  expect(await getDb().transaction(tx=>sandboxPersona(tx,person.personId))).toBe("FICTIONAL_ADULT");
  expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId,person.personId))).toEqual([]);
  expect(await getDb().select().from(permissionGrants).where(eq(permissionGrants.personId,person.personId))).toEqual([]);
  expect(await getDb().select().from(operatorServiceAccess).where(eq(operatorServiceAccess.personId,person.personId))).toEqual([]);
  expect(await getDb().select().from(merchantSetupEligibility).where(eq(merchantSetupEligibility.personId,person.personId))).toEqual([]);
 });
 it("makes concurrent retries one enrollment with one stable member code and refuses conflicting replay",async()=>{
  const person=await bindIdentity(issuer,randomUUID()),stranger=await bindIdentity(issuer,randomUUID());production();const input={commandId:randomUUID(),displayName:"Concurrent Member",acknowledged:true as const};
  const results=await Promise.all(Array.from({length:8},()=>startSandbox(person.personId,input)));
  expect(new Set(results.map(r=>r.memberCode)).size).toBe(1);
  expect(await getDb().select().from(sandboxParticipants).where(eq(sandboxParticipants.personId,person.personId))).toHaveLength(1);
  await expect(startSandbox(person.personId,{...input,displayName:"Changed"})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
  await expect(startSandbox(stranger.personId,input)).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
  expect((await getDb().select().from(people).where(eq(people.id,person.personId)))[0]!.displayName).toBe("Concurrent Member");
 });
 it("reveals only an exact opted-in recipient code and rejects unstarted actors, self and invalid lookups",async()=>{
  const actor=await bindIdentity(issuer,randomUUID()),recipient=await bindIdentity(issuer,randomUUID()),unstarted=await bindIdentity(issuer,randomUUID());production();
  const a=await startSandbox(actor.personId,{commandId:randomUUID(),displayName:"Actor",acknowledged:true}),b=await startSandbox(recipient.personId,{commandId:randomUUID(),displayName:"Chosen Member",acknowledged:true});
  expect(await findSandboxRecipient(actor.personId,{code:b.memberCode!.toLowerCase()})).toEqual({id:recipient.personId,displayName:"Chosen Member"});
  for(const query of [{code:a.memberCode},{code:"ED-"+"0".repeat(20)},{code:b.memberCode,all:true},{}])await expect(findSandboxRecipient(actor.personId,query)).rejects.toMatchObject({status:404});
  await expect(findSandboxRecipient(unstarted.personId,{code:b.memberCode})).rejects.toMatchObject({code:"SANDBOX_START_REQUIRED"});
  await expect(getDb().transaction(tx=>requireSandboxParticipant(tx,unstarted.personId))).rejects.toMatchObject({code:"SANDBOX_START_REQUIRED"});
 });
});
