import { createHash, randomBytes } from "node:crypto";
import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import targets from "../../../project-targets.json" with { type: "json" };
import { getRuntimeConfig } from "../../platform/config";
import { getDb } from "../../platform/database/client";
import { identityBindings, people, eventOutbox } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import type { ScopedTransaction } from "../access/scope";
import { assertFixtureIdentityAllowed } from "../identity/fixture";
import { merchantSetupEligibility } from "../services/schema";
import { sandboxParticipants } from "./schema";
import { sandboxRecipientQuerySchema, startSandboxSchema, type SandboxOverview } from "./contracts";

const providerIssuer=`${targets.netlify.canonical_origin}/.netlify/identity`;
const fixtureIssuer="urn:etail:isolated-fixture";
export function sandboxFixturesAllowed() {
  const config=getRuntimeConfig();
  try {assertFixtureIdentityAllowed({...config,fixtureIdentityEnabled:config.localFixtureIdentity});return true;}
  catch(error){if(error instanceof SecurityError&&error.code==="FIXTURE_IDENTITY_DISABLED")return false;throw error;}
}
async function identity(tx:ScopedTransaction,personId:string) {
  const fixtures=sandboxFixturesAllowed();
  const rows=await tx.select({id:people.id,displayName:people.displayName,issuer:identityBindings.issuer}).from(identityBindings)
    .innerJoin(people,eq(people.id,identityBindings.personId)).where(and(eq(identityBindings.personId,personId),inArray(identityBindings.issuer,[providerIssuer,...(fixtures?[fixtureIssuer]:[])])));
  const person=rows.find(row=>row.issuer===providerIssuer)??rows[0];
  if(!person)throw new SecurityError("SERVICE_UNAVAILABLE",404);
  return {person,fixture:person.issuer===fixtureIssuer};
}
export async function requireSandboxParticipant(tx:ScopedTransaction,personId:string) {
  const current=await identity(tx,personId);
  if(current.fixture)return current.person;
  const [row]=await tx.select().from(sandboxParticipants).where(eq(sandboxParticipants.personId,personId)).for("share");
  if(!row?.acknowledged)throw new SecurityError("SANDBOX_START_REQUIRED",403);
  return current.person;
}
export async function isSandboxParticipant(tx:ScopedTransaction,personId:string) {
  try {await requireSandboxParticipant(tx,personId);return true;}
  catch(error){if(error instanceof SecurityError&&[403,404].includes(error.status))return false;throw error;}
}
export async function sandboxPersona(tx:ScopedTransaction,personId:string):Promise<"FICTIONAL_ADULT"|"FICTIONAL_SUPERVISED"|null> {
  let current:Awaited<ReturnType<typeof identity>>;
  try {current=await identity(tx,personId);}catch(error){if(error instanceof SecurityError&&error.code==="SERVICE_UNAVAILABLE")return null;throw error;}
  if(current.fixture){const [row]=await tx.select().from(merchantSetupEligibility).where(eq(merchantSetupEligibility.personId,personId)).for("share");return row?.personaKind??null;}
  const [row]=await tx.select().from(sandboxParticipants).where(eq(sandboxParticipants.personId,personId)).for("share");
  // This is the simulated adult product scenario, not a claim about the person's age.
  return row?.acknowledged?"FICTIONAL_ADULT":null;
}
export async function requireSandboxAdult(tx:ScopedTransaction,personId:string) {
  await requireSandboxParticipant(tx,personId);
  if(await sandboxPersona(tx,personId)!=="FICTIONAL_ADULT")throw new SecurityError("MERCHANT_APPLICANT_REQUIRED",403);
}
export async function sandboxOverviewInTransaction(tx:ScopedTransaction,personId:string):Promise<SandboxOverview> {
 const current=await identity(tx,personId);
 const [participant]=await tx.select().from(sandboxParticipants).where(eq(sandboxParticipants.personId,personId));
 return {joined:current.fixture||!!participant?.acknowledged,displayName:current.person.displayName,memberCode:participant?.memberCode??null};
}
export async function getSandboxOverview(personId:string){return getDb().transaction(tx=>sandboxOverviewInTransaction(tx,personId));}
export async function startSandbox(personId:string,raw:z.input<typeof startSandboxSchema>):Promise<SandboxOverview> {
 const parsed=startSandboxSchema.safeParse(raw);if(!parsed.success)throw new SecurityError("INVALID_REQUEST",422);
 const input=parsed.data,digest=createHash("sha256").update(JSON.stringify({personId,displayName:input.displayName,acknowledged:input.acknowledged})).digest("hex");
 return getDb().transaction(async tx=>{
  await identity(tx,personId);
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"sandbox-join:"+input.commandId},0))`);
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"sandbox-person:"+personId},0))`);
  const [receipt]=await tx.select().from(sandboxParticipants).where(eq(sandboxParticipants.commandId,input.commandId));
  if(receipt&&(receipt.personId!==personId||receipt.digest!==digest))throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
  const [existing]=await tx.select().from(sandboxParticipants).where(eq(sandboxParticipants.personId,personId));
  if(!existing){
   await tx.insert(sandboxParticipants).values({personId,commandId:input.commandId,digest,memberCode:`ED-${randomBytes(10).toString("hex").toUpperCase()}`,acknowledged:true});
   await tx.update(people).set({displayName:input.displayName,version:sql`${people.version}+1`}).where(eq(people.id,personId));
   await tx.insert(eventOutbox).values({businessKey:`sandbox-started:${personId}`,kind:"sandbox.started",aggregateId:personId});
  }
  return sandboxOverviewInTransaction(tx,personId);
 });
}
/** A voluntarily shared code identifies one recipient; it never grants access or lists members. */
export async function findSandboxRecipient(personId:string,raw:unknown) {
 const parsed=sandboxRecipientQuerySchema.safeParse(raw);if(!parsed.success)throw new SecurityError("RECIPIENT_UNAVAILABLE",404);
 return getDb().transaction(async tx=>{
  await requireSandboxParticipant(tx,personId);
  const [row]=await tx.select({id:people.id,displayName:people.displayName}).from(sandboxParticipants).innerJoin(people,eq(people.id,sandboxParticipants.personId)).where(eq(sandboxParticipants.memberCode,parsed.data.code));
  if(!row||row.id===personId)throw new SecurityError("RECIPIENT_UNAVAILABLE",404);
  await requireSandboxParticipant(tx,row.id);return row;
 });
}
