import {createHash} from "node:crypto";
import {and,eq,gt,isNull,lte,sql} from "drizzle-orm";
import targets from "../../../project-targets.json" with {type:"json"};
import {getDb} from "../../platform/database/client";
import {eventOutbox,identityBindings,people,sessions} from "../../platform/database/schema";
import {SecurityError} from "../../platform/security/origin";
import {personalProfileSchema,updatePersonalProfileSchema,type PersonalProfile} from "../../shared/personal-profile";
import type {ScopedTransaction} from "../access/scope";
import {sandboxFixturesAllowed} from "../sandbox/service";
import {identityVerifiedEmails} from "./contact-schema";
import {profileCommands} from "./profile-schema";
import type {SessionRecord} from "./session";

async function requireCurrentPerson(tx:ScopedTransaction,session:SessionRecord) {
  const now=new Date();
  // Match session rotation/revocation's binding -> session lock order.
  const [binding]=await tx.select().from(identityBindings).where(and(eq(identityBindings.id,session.identityId),eq(identityBindings.personId,session.personId))).for("share");
  if(!binding || !(binding.issuer===`${targets.netlify.canonical_origin}/.netlify/identity` || binding.issuer==="urn:etail:isolated-fixture"&&sandboxFixturesAllowed()))throw new SecurityError("AUTHENTICATION_REQUIRED",401);
  const [current]=await tx.select().from(sessions)
    .where(and(eq(sessions.tokenHash,session.tokenHash),eq(sessions.identityId,session.identityId),eq(sessions.personId,session.personId),isNull(sessions.revokedAt),gt(sessions.expiresAt,now),lte(sessions.issuedAt,now))).for("share");
  if(!current)throw new SecurityError("AUTHENTICATION_REQUIRED",401);
}
async function projection(tx:ScopedTransaction,session:SessionRecord):Promise<PersonalProfile> {
  const [person]=await tx.select().from(people).where(eq(people.id,session.personId));
  if(!person)throw new SecurityError("AUTHENTICATION_REQUIRED",401);
  const [email]=await tx.select().from(identityVerifiedEmails).where(eq(identityVerifiedEmails.identityId,session.identityId));
  return personalProfileSchema.parse({personId:person.id,displayName:person.displayName,version:person.version,
    signInEmail:email?{address:email.emailNormalized,verifiedAt:email.verifiedAt.toISOString()}:null});
}
export async function getPersonalProfile(session:SessionRecord) {
  return getDb().transaction(async tx=>{await requireCurrentPerson(tx,session);return projection(tx,session);});
}
export async function updatePersonalProfile(session:SessionRecord,raw:unknown) {
  const parsed=updatePersonalProfileSchema.safeParse(raw);
  if(!parsed.success)throw new SecurityError("INVALID_REQUEST",422);
  const input=parsed.data;
  // The displayed person is a stale-editor precondition, never a source of authority.
  if(input.expectedPersonId!==session.personId)throw new SecurityError("PROFILE_PERSON_CHANGED",403);
  const digest=createHash("sha256").update(JSON.stringify({personId:session.personId,expectedVersion:input.expectedVersion,displayName:input.displayName})).digest("hex");
  return getDb().transaction(async tx=>{
    await requireCurrentPerson(tx,session);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"profile-command:"+input.commandId},0))`);
    // Share enrollment's person lock so its first display-name write advances the same version.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"sandbox-person:"+session.personId},0))`);
    const [receipt]=await tx.select().from(profileCommands).where(eq(profileCommands.commandId,input.commandId));
    if(receipt){
      if(receipt.personId!==session.personId||receipt.digest!==digest)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
      return {commandId:input.commandId,savedVersion:receipt.savedVersion,profile:await projection(tx,session)};
    }
    const [person]=await tx.select().from(people).where(eq(people.id,session.personId)).for("update");
    if(!person||person.version!==input.expectedVersion)throw new SecurityError("STALE_VERSION",409);
    const savedVersion=person.version+1;
    await tx.update(people).set({displayName:input.displayName,version:savedVersion}).where(eq(people.id,session.personId));
    await tx.insert(profileCommands).values({commandId:input.commandId,personId:session.personId,digest,savedVersion});
    await tx.insert(eventOutbox).values({businessKey:`profile-updated:${input.commandId}`,kind:"identity.profile_updated",aggregateId:session.personId});
    return {commandId:input.commandId,savedVersion,profile:await projection(tx,session)};
  });
}
