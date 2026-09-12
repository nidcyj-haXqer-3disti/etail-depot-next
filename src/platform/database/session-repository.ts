import { and, asc, desc, eq, gt, inArray, isNull, lte } from "drizzle-orm";
import type { SessionRepository } from "../../modules/identity";
import type { SessionRecord } from "../../modules/identity/session";
import type { SessionOverview } from "../../modules/identity/security-contracts";
import { SecurityError } from "../security/origin";
import { getDb } from "./client";
import { identityBindings, sessions } from "./schema";
import { identityPasswordResets } from "../../modules/identity/schema";
import { randomUUID } from "node:crypto";
import { refreshVerifiedEmail } from "../../modules/identity/contact-service";

type DatabaseTransaction = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];

/** Session writes always lock binding first, then sessions; never invert this order. */
async function lockIdentity(tx: DatabaseTransaction, identityId: string): Promise<void> {
  const [binding] = await tx.select({ id: identityBindings.id }).from(identityBindings)
    .where(eq(identityBindings.id, identityId)).for("update");
  if (!binding) throw new SecurityError("INVALID_SESSION_IDENTITY", 500);
}

/** Always called after the binding lock, in the same transaction as session insertion. */
async function assertNoPendingReset(tx: DatabaseTransaction, identityId: string): Promise<void> {
  const [reset] = await tx.select({ state: identityPasswordResets.state }).from(identityPasswordResets).where(eq(identityPasswordResets.identityId, identityId));
  if (reset?.state === "RESET_PENDING") throw new SecurityError("PASSWORD_RESET_PENDING", 409);
}

export const sessionRepository: SessionRepository = {
  async insert(record, contact) {
    await getDb().transaction(async (tx) => {
      await lockIdentity(tx, record.identityId);
      await assertNoPendingReset(tx, record.identityId);
      if (contact) await refreshVerifiedEmail(tx, record.identityId, contact);
      await tx.insert(sessions).values(record);
    });
  },
  async findByTokenHash(hash) { return (await getDb().select().from(sessions).where(eq(sessions.tokenHash,hash)))[0] ?? null; },
  async revokeByTokenHash(hash, at) {
    await getDb().transaction(async (tx) => {
      // Historical tokens retain immutable identity/family references after rotation.
      const [previous] = await tx.select({ identityId: sessions.identityId, familyId: sessions.familyId })
        .from(sessions).where(eq(sessions.tokenHash, hash));
      if (!previous) return;
      await lockIdentity(tx, previous.identityId);
      // This statement gets a fresh snapshot after any earlier rotation commits.
      await tx.update(sessions).set({ revokedAt: at }).where(and(
        eq(sessions.identityId, previous.identityId), eq(sessions.familyId, previous.familyId), isNull(sessions.revokedAt),
      ));
    });
  },
  async revokeByIdentity(identityId, at) {
    await getDb().transaction(async (tx) => {
      await lockIdentity(tx, identityId);
      await tx.update(sessions).set({ revokedAt: at }).where(and(eq(sessions.identityId, identityId), isNull(sessions.revokedAt)));
    });
  },
  async rotate(oldHash,newRecord,at) {
    return getDb().transaction(async (tx) => {
      await lockIdentity(tx, newRecord.identityId);
      await assertNoPendingReset(tx, newRecord.identityId);
      const updated=await tx.update(sessions).set({revokedAt:at}).where(and(eq(sessions.tokenHash,oldHash),eq(sessions.identityId,newRecord.identityId),eq(sessions.personId,newRecord.personId),eq(sessions.familyId,newRecord.familyId),eq(sessions.issuedAt,newRecord.issuedAt),eq(sessions.expiresAt,newRecord.expiresAt),isNull(sessions.revokedAt),gt(sessions.expiresAt,at))).returning();
      if(!updated.length) return false;
      await tx.insert(sessions).values(newRecord); return true;
    });
  },
};

export interface PasswordResetAttempt { identityId: string; attemptId: string }
/** Reuses binding → reset marker → sessions ordering; no provider credential is persisted. */
export const passwordResetRepository = {
  async begin(identityId: string): Promise<PasswordResetAttempt> {
    return getDb().transaction(async tx => {
      await lockIdentity(tx, identityId);
      await assertNoPendingReset(tx, identityId);
      const attemptId = randomUUID(), now = new Date();
      await tx.insert(identityPasswordResets).values({ identityId, attemptId, state: "RESET_PENDING", startedAt: now, completedAt: null })
        .onConflictDoUpdate({ target: identityPasswordResets.identityId, set: { attemptId, state: "RESET_PENDING", startedAt: now, completedAt: null } });
      await tx.update(sessions).set({ revokedAt: now }).where(and(eq(sessions.identityId, identityId), isNull(sessions.revokedAt)));
      return { identityId, attemptId };
    });
  },
  /** Call only after a definite successful response for this exact external update. */
  async complete(attempt: PasswordResetAttempt): Promise<void> {
    await getDb().transaction(async tx => {
      await lockIdentity(tx, attempt.identityId);
      const [reset] = await tx.select().from(identityPasswordResets).where(eq(identityPasswordResets.identityId, attempt.identityId)).for("update");
      if (reset?.state !== "RESET_PENDING" || reset.attemptId !== attempt.attemptId) throw new SecurityError("PASSWORD_RESET_PENDING", 409);
      const now = new Date();
      await tx.update(sessions).set({ revokedAt: now }).where(and(eq(sessions.identityId, attempt.identityId), isNull(sessions.revokedAt)));
      await tx.update(identityPasswordResets).set({ state: "COMPLETE", completedAt: now }).where(eq(identityPasswordResets.identityId, attempt.identityId));
    });
  },
};

/** Reuses the existing session store and binding-first lock order; never exposes credentials. */
async function withCurrentSession<T>(current: SessionRecord, work: (tx: DatabaseTransaction, now: Date) => Promise<T>): Promise<T> {
  return getDb().transaction(async tx => {
    await tx.select({ id: identityBindings.id }).from(identityBindings)
      .where(eq(identityBindings.personId, current.personId)).orderBy(asc(identityBindings.id)).for("update");
    const now = new Date();
    const [live] = await tx.select({ id: sessions.familyId }).from(sessions).where(and(
      eq(sessions.tokenHash, current.tokenHash), eq(sessions.personId, current.personId),
      eq(sessions.identityId, current.identityId), eq(sessions.familyId, current.familyId),
      isNull(sessions.revokedAt), gt(sessions.expiresAt, now), lte(sessions.issuedAt, now),
    ));
    if (!live) throw new SecurityError("AUTHENTICATION_REQUIRED", 401);
    return work(tx, now);
  });
}
async function activeSessions(tx: DatabaseTransaction, current: SessionRecord, now: Date): Promise<SessionOverview> {
  const rows = await tx.select({ id: sessions.familyId, issuedAt: sessions.issuedAt, expiresAt: sessions.expiresAt })
    .from(sessions).where(and(eq(sessions.personId, current.personId), isNull(sessions.revokedAt), gt(sessions.expiresAt, now), lte(sessions.issuedAt, now)))
    .orderBy(desc(eq(sessions.familyId, current.familyId)), desc(sessions.issuedAt), asc(sessions.familyId)).limit(101);
  return { sessions: rows.slice(0, 100).map(row => ({ id: row.id, current: row.id === current.familyId, signedInAt: row.issuedAt.toISOString(), expiresAt: row.expiresAt.toISOString() })), moreAvailable: rows.length > 100 };
}
export const sessionSecurityRepository = {
  list(current: SessionRecord) { return withCurrentSession(current, (tx, now) => activeSessions(tx, current, now)); },
  revoke(current: SessionRecord, familyIds: readonly string[]) {
    return withCurrentSession(current, async (tx, now) => {
      if (familyIds.includes(current.familyId)) throw new SecurityError("USE_SIGN_OUT", 422);
      const targets = await tx.selectDistinct({ id: sessions.familyId }).from(sessions)
        .where(and(eq(sessions.personId, current.personId), inArray(sessions.familyId, [...familyIds])));
      if (targets.length !== familyIds.length) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
      // Replays name the same families. They cannot terminate a later independent sign-in.
      await tx.update(sessions).set({ revokedAt: now }).where(and(
        eq(sessions.personId, current.personId), inArray(sessions.familyId, [...familyIds]), isNull(sessions.revokedAt),
      ));
      return activeSessions(tx, current, now);
    });
  },
};
