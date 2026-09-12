import { and, asc, eq, gt, sql } from "drizzle-orm";
import { normalizeVerifiedEmail } from "../../shared/verified-email";
export { normalizeVerifiedEmail } from "../../shared/verified-email";
import type { ScopedTransaction } from "../access/scope";
import { identityBindings } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { identityVerifiedEmails } from "./contact-schema";

export type EmailProvenance = "NETLIFY_USER_CONFIRMED";
export interface VerifiedEmailContact { emailNormalized: string; provenance: EmailProvenance; verifiedAt: string }
export interface ProviderContactObservation { issuer: string; subject: string; verifiedEmail?: VerifiedEmailContact }
function validateProof(proof: VerifiedEmailContact): void {
  if (normalizeVerifiedEmail(proof.emailNormalized) !== proof.emailNormalized || proof.provenance !== "NETLIFY_USER_CONFIRMED" || !Number.isFinite(Date.parse(proof.verifiedAt)) || Date.parse(proof.verifiedAt) > Date.now()) throw new SecurityError("INVALID_VERIFIED_CONTACT", 503);
}

/** Binding is already locked. Contact refresh and the new session commit together. */
export async function refreshVerifiedEmail(tx: ScopedTransaction, identityId: string, observation: ProviderContactObservation): Promise<void> {
  const [binding] = await tx.select().from(identityBindings).where(eq(identityBindings.id, identityId));
  if (!binding || binding.issuer !== observation.issuer || binding.subject !== observation.subject) throw new SecurityError("INVALID_VERIFIED_CONTACT", 503);
  const proof = observation.verifiedEmail;
  if (proof) validateProof(proof);
  if (!proof) { await tx.delete(identityVerifiedEmails).where(eq(identityVerifiedEmails.identityId, identityId)); return; }
  const observedAt = new Date();
  await tx.insert(identityVerifiedEmails).values({ identityId, ...proof, verifiedAt: new Date(proof.verifiedAt), observedAt })
    .onConflictDoUpdate({ target: identityVerifiedEmails.identityId, set: { ...proof, verifiedAt: new Date(proof.verifiedAt), observedAt } });
}

/** Server-only, current provider observations. An invitation URL or submitted email is never proof. */
export async function getVerifiedEmails(tx: ScopedTransaction, personId: string): Promise<string[]> {
  // Same binding -> contact order as login. A claim keeps this proof stable
  // through commit; a concurrent contact refresh must wait or precede the read.
  await tx.select({ id: identityBindings.id }).from(identityBindings).where(eq(identityBindings.personId, personId)).orderBy(asc(identityBindings.id)).for("share");
  const rows = await tx.select({ email: identityVerifiedEmails.emailNormalized }).from(identityVerifiedEmails)
    .innerJoin(identityBindings, eq(identityBindings.id, identityVerifiedEmails.identityId))
    .where(and(eq(identityBindings.personId, personId), gt(identityVerifiedEmails.observedAt, sql`clock_timestamp()-interval '8 hours'`))).for("share", { of: identityVerifiedEmails });
  return [...new Set(rows.map(row => row.email))];
}
