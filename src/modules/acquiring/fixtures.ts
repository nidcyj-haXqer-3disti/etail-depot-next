import { and,eq } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { identityBindings } from "../../platform/database/schema";
import { getRuntimeConfig } from "../../platform/config";
import { assertFixtureIdentityAllowed } from "../identity";
import { merchantSetupEligibility } from "../services/schema";

/** Explicit isolated fixture seeding only. Never called by login, a read or a Merchant creation command. */
export async function seedAcquiringFixtures(ownerId:string,viewerId:string) {
  const config=getRuntimeConfig();assertFixtureIdentityAllowed({...config,fixtureIdentityEnabled:config.localFixtureIdentity});
  await getDb().transaction(async tx=>{
    for(const [personId,subject] of [[ownerId,"owner"],[viewerId,"viewer"]]) {
      const [binding]=await tx.select({id:identityBindings.id}).from(identityBindings).where(and(eq(identityBindings.personId,personId!),eq(identityBindings.issuer,"urn:etail:isolated-fixture"),eq(identityBindings.subject,subject!)));
      if(!binding)throw new Error("Acquiring fixtures require the named isolated personas.");
      await tx.insert(merchantSetupEligibility).values({personId:personId!,personaKind:"FICTIONAL_ADULT"}).onConflictDoNothing();
    }
  });
}
