import { and, eq } from "drizzle-orm";
import type { ScopedTransaction } from "../access/scope";
import { identityBindings } from "../../platform/database/schema";
import { getRuntimeConfig } from "../../platform/config";
import { SecurityError } from "../../platform/security/origin";
import { assertFixtureIdentityAllowed } from "../identity";
import { merchantSetupEligibility } from "./schema";

export async function requireMerchantApplicant(tx: ScopedTransaction, personId: string) {
  const config=getRuntimeConfig();
  assertFixtureIdentityAllowed({...config,fixtureIdentityEnabled:config.localFixtureIdentity});
  const [binding]=await tx.select({id:identityBindings.id}).from(identityBindings).where(and(eq(identityBindings.personId,personId),eq(identityBindings.issuer,"urn:etail:isolated-fixture")));
  const [persona]=await tx.select().from(merchantSetupEligibility).where(eq(merchantSetupEligibility.personId,personId)).for("share");
  if(!binding || persona?.personaKind!=="FICTIONAL_ADULT") throw new SecurityError("MERCHANT_APPLICANT_REQUIRED",403);
}
