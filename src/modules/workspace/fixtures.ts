import { createHash } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { getRuntimeConfig } from "../../platform/config";
import { getDb } from "../../platform/database/client";
import { services, serviceMembers, identityBindings, permissionGrants } from "../../platform/database/schema";
import { assertFixtureIdentityAllowed } from "../identity";
import {PRIMARY_CARDHOLDER_PERMISSIONS} from "../services/service";
export function fixtureId(serviceId:string,label:string){const hex=createHash("sha256").update(`${serviceId}:${label}`).digest("hex");return `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20,32)}`;}
/** Explicit isolated-test grants only. Sample cards/history require canonical commands. */
export async function seedWorkspaceService(serviceId:string,primaryId:string){
 const config=getRuntimeConfig();assertFixtureIdentityAllowed({...config,fixtureIdentityEnabled:config.localFixtureIdentity});
 await getDb().transaction(async tx=>{
  const [service]=await tx.select().from(services).where(and(eq(services.id,serviceId),eq(services.kind,"CARDHOLDER"),eq(services.primaryPersonId,primaryId)));
  const [member]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,primaryId),eq(serviceMembers.state,"ACCEPTED")));
  const [identity]=await tx.select().from(identityBindings).where(and(eq(identityBindings.personId,primaryId),eq(identityBindings.issuer,"urn:etail:isolated-fixture")));
  if(!service||!member||!identity)throw new Error("Fixture grants require a named, enrolled Cardholder primary.");
  for(const action of PRIMARY_CARDHOLDER_PERMISSIONS)await tx.insert(permissionGrants).values({serviceId,personId:primaryId,action,delegable:true}).onConflictDoNothing();
 });
}
