import { and,eq } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { services,serviceMembers,permissionGrants } from "../../platform/database/schema";
import { getRuntimeConfig } from "../../platform/config";
import { assertFixtureIdentityAllowed } from "../identity";
/** Explicit isolated-test grants only; repeated preparation preserves revoked choices. */
export async function seedAccessCapabilities(primaryId:string,allowedServiceIds?:readonly string[]) {
 const config=getRuntimeConfig();assertFixtureIdentityAllowed({...config,fixtureIdentityEnabled:config.localFixtureIdentity});
 const owned=await getDb().select({service:services}).from(serviceMembers).innerJoin(services,eq(services.id,serviceMembers.serviceId)).where(and(eq(serviceMembers.personId,primaryId),eq(services.primaryPersonId,primaryId),eq(services.kind,"CARDHOLDER"),eq(serviceMembers.state,"ACCEPTED")));
 for(const {service} of owned){if(allowedServiceIds&&!allowedServiceIds.includes(service.id))continue;for(const action of ["people.read","people.invite","people.changeRole","people.revoke"])await getDb().insert(permissionGrants).values({serviceId:service.id,personId:primaryId,action,delegable:true}).onConflictDoNothing();}
}
