import { and, eq, inArray } from "drizzle-orm";
import targets from "../../../project-targets.json" with { type: "json" };
import { getRuntimeConfig } from "../../platform/config";
import { identityBindings, people } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import type { ScopedTransaction } from "../access/scope";
import { assertFixtureIdentityAllowed } from "../identity";
import { requireMerchantApplicant } from "./merchant-eligibility";
import { isSandboxParticipant } from "../sandbox/service";

/** Reading a signed-in service entrance never enrolls a person or grants demo eligibility. */
export async function requireServiceReader(tx: ScopedTransaction, personId: string) {
  const config = getRuntimeConfig();
  let fixturesAllowed = false;
  try {
    assertFixtureIdentityAllowed({ ...config, fixtureIdentityEnabled: config.localFixtureIdentity });
    fixturesAllowed = true;
  } catch (error) {
    if (!(error instanceof SecurityError && error.code === "FIXTURE_IDENTITY_DISABLED")) throw error;
  }
  const fixtureIssuer = "urn:etail:isolated-fixture";
  const issuers = [`${targets.netlify.canonical_origin}/.netlify/identity`, ...(fixturesAllowed ? [fixtureIssuer] : [])];
  const rows = await tx.select({ id: people.id, displayName: people.displayName, issuer: identityBindings.issuer })
    .from(identityBindings).innerJoin(people, eq(people.id, identityBindings.personId))
    .where(and(eq(identityBindings.personId, personId), inArray(identityBindings.issuer, issuers)));
  const person = rows[0];
  if (!person) throw new SecurityError("SERVICE_UNAVAILABLE", 404);
  let canCreatePrimary = false;
  if (await isSandboxParticipant(tx, personId)) {
    try { await requireMerchantApplicant(tx, personId); canCreatePrimary = true; }
    catch (error) { if (!(error instanceof SecurityError && error.code === "MERCHANT_APPLICANT_REQUIRED")) throw error; }
  }
  return { person: { id: person.id, displayName: person.displayName }, canCreatePrimary };
}
