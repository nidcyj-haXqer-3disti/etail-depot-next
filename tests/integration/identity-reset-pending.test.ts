import { createHash, randomUUID } from "node:crypto";
import { afterAll, describe, expect, it, vi } from "vitest";
import { eq, sql } from "drizzle-orm";
import { getDb, closeDatabase } from "../../src/platform/database/client";
import { identityBindings, sessions as storedSessions } from "../../src/platform/database/schema";
import { identityPasswordResets } from "../../src/modules/identity/schema";
import { bindIdentity } from "../../src/modules/services/service";
import { SessionService } from "../../src/modules/identity/session";
import { sessionRepository, passwordResetRepository, type PasswordResetAttempt } from "../../src/platform/database/session-repository";
import { NetlifyIdentityAdapter } from "../../src/modules/identity/adapters/netlify";
import { withPasswordAuthentication } from "../../src/modules/identity/password-boundary";
import { signInWithPassword } from "../../src/modules/identity/password-login";

afterAll(closeDatabase);
const origin = "https://new-provider.example.test", issuer = `${origin}/.netlify/identity`;
const cookieHeader = (cookie: string) => cookie.split(";")[0]!;
const makeSessions = () => new SessionService(sessionRepository, { appEnv: "test", publicOrigin: "http://127.0.0.1:3100" });
function resetAdapter(subject: string, update: () => Promise<Response>) {
  const fetcher = vi.fn<typeof fetch>(async (_url, init) => {
    if (init?.method === "PUT") return update();
    if (init?.method === "POST") return Response.json({ access_token: "server-only-test-token" });
    return Response.json({ id: subject, confirmed_at: "2026-09-10T00:00:00Z" });
  });
  const adapter = new NetlifyIdentityAdapter(() => ({ appEnv: "local", publicOrigin: "http://127.0.0.1:3100", providerOrigin: origin, identityEndpoint: issuer, expectedSiteId: "new-provider-id", runtimeSiteId: null, localRemoteProvider: true }), fetcher, () => null);
  return { adapter, fetcher };
}
async function runReset(adapter: NetlifyIdentityAdapter, identityId: string) {
  let attempt: PasswordResetAttempt | null = null;
  return withPasswordAuthentication(() => adapter.resetPassword("recovery-test-token", "new long password", async () => {
    attempt = await passwordResetRepository.begin(identityId);
  }, async () => {
    if (!attempt) throw new Error("Missing reset attempt");
    await passwordResetRepository.complete(attempt);
  }));
}

describe("unresolved remote password updates", () => {
  it("retains the exact-identity barrier across timeout, lock release, late provider commit, elapsed time and another reset", async () => {
    const subject = randomUUID(), identity = await bindIdentity(issuer, subject);
    // An independent binding to the same Person must remain usable.
    const [other] = await getDb().insert(identityBindings).values({ issuer: "https://other-provider.example.test/.netlify/identity", subject: randomUUID(), personId: identity.personId }).returning();
    const otherIdentity = { identityId: other!.id, personId: identity.personId };
    const sessions = makeSessions(), old = await sessions.issue(identity), unrelated = await sessions.issue(otherIdentity);
    let providerPassword = "old password";
    const { adapter, fetcher } = resetAdapter(subject, async () => { throw new Error("Response timed out while provider may still commit"); });
    await expect(runReset(adapter, identity.identityId)).rejects.toMatchObject({ code: "IDENTITY_UNAVAILABLE" });
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(await sessions.authenticate(cookieHeader(old.cookie))).toBeNull();
    expect(await sessions.authenticate(cookieHeader(unrelated.cookie))).not.toBeNull();
    const [pending] = await getDb().select().from(identityPasswordResets).where(eq(identityPasswordResets.identityId, identity.identityId));
    expect(pending).toMatchObject({ state: "RESET_PENDING", completedAt: null });
    const verifiedLogin = () => withPasswordAuthentication(() => signInWithPassword("person@example.test", providerPassword, null, {
      limiter: { consume: async () => undefined },
      provider: { passwordLoginAvailability: async () => ({ available: true, reason: "AVAILABLE" }), verifyPassword: async () => ({ issuer, subject, providerConfirmed: true }) },
      bind: async () => identity, sessions: makeSessions(),
    }));
    // A successful old-password verification after lock release cannot issue a session.
    await expect(verifiedLogin()).rejects.toMatchObject({ code: "PASSWORD_RESET_PENDING", status: 409 });
    // The provider commits late. Even a verified new password cannot clear an unresolved write.
    providerPassword = "new long password";
    await expect(verifiedLogin()).rejects.toMatchObject({ code: "PASSWORD_RESET_PENDING", status: 409 });
    await getDb().update(identityPasswordResets).set({ startedAt: sql`clock_timestamp() - interval '30 days'` }).where(eq(identityPasswordResets.identityId, identity.identityId));
    await expect(makeSessions().issue(identity)).rejects.toMatchObject({ code: "PASSWORD_RESET_PENDING" });
    const later = resetAdapter(subject, async () => Response.json({ id: subject }));
    await expect(runReset(later.adapter, identity.identityId)).rejects.toMatchObject({ code: "PASSWORD_RESET_PENDING" });
    expect(later.fetcher).toHaveBeenCalledTimes(2); // The later PUT was never dispatched.
    expect((await getDb().select().from(identityPasswordResets).where(eq(identityPasswordResets.identityId, identity.identityId)))[0]!.attemptId).toBe(pending!.attemptId);
    await expect(makeSessions().issue(otherIdentity)).resolves.toHaveProperty("cookie");
  });

  it("commits the barrier and revocation before PUT, then clears only definite success for that exact attempt", async () => {
    const subject = randomUUID(), identity = await bindIdentity(issuer, subject), sessions = makeSessions();
    const old = await sessions.issue(identity);
    const { adapter } = resetAdapter(subject, async () => {
      expect((await getDb().select().from(identityPasswordResets).where(eq(identityPasswordResets.identityId, identity.identityId)))[0]).toMatchObject({ state: "RESET_PENDING" });
      expect(await sessions.authenticate(cookieHeader(old.cookie))).toBeNull();
      await expect(makeSessions().issue(identity)).rejects.toMatchObject({ code: "PASSWORD_RESET_PENDING" });
      return Response.json({ id: subject });
    });
    await runReset(adapter, identity.identityId);
    const [complete] = await getDb().select().from(identityPasswordResets).where(eq(identityPasswordResets.identityId, identity.identityId));
    expect(complete).toMatchObject({ state: "COMPLETE", completedAt: expect.any(Date) });
    expect(await sessions.authenticate(cookieHeader(old.cookie))).toBeNull();
    const current = await sessions.issue(identity); expect(await sessions.authenticate(cookieHeader(current.cookie))).not.toBeNull();
    const next = await passwordResetRepository.begin(identity.identityId);
    await expect(passwordResetRepository.complete({ identityId: identity.identityId, attemptId: complete!.attemptId })).rejects.toMatchObject({ code: "PASSWORD_RESET_PENDING" });
    expect((await getDb().select().from(identityPasswordResets).where(eq(identityPasswordResets.identityId, identity.identityId)))[0]!.attemptId).toBe(next.attemptId);
    expect(await sessions.authenticate(cookieHeader(current.cookie))).toBeNull();
  });

  it("orders reset begin and session insertion atomically under the binding lock", async () => {
    for (let index = 0; index < 8; index++) {
      const identity = await bindIdentity(issuer, randomUUID()), sessions = makeSessions();
      const result = await Promise.allSettled([sessions.issue(identity), passwordResetRepository.begin(identity.identityId)]);
      expect(result[1]!.status).toBe("fulfilled");
      const issued = result[0]!;
      if (issued.status === "fulfilled" && "cookie" in issued.value) expect(await sessions.authenticate(cookieHeader(issued.value.cookie))).toBeNull();
      else if (issued.status === "rejected") expect(issued.reason).toMatchObject({ code: "PASSWORD_RESET_PENDING" });
      const rows = await getDb().select().from(storedSessions).where(eq(storedSessions.identityId, identity.identityId));
      expect(rows.every(row => row.revokedAt !== null)).toBe(true);
    }
  });

  it("also prevents canonical session rotation under a pending reset", async () => {
    const identity = await bindIdentity(issuer, randomUUID()), sessions = makeSessions(), previous = await sessions.issue(identity);
    await passwordResetRepository.begin(identity.identityId);
    await expect(sessionRepository.rotate(previous.record.tokenHash, { ...previous.record, tokenHash: createHash("sha256").update(randomUUID()).digest("hex") }, new Date())).rejects.toMatchObject({ code: "PASSWORD_RESET_PENDING" });
  });
});
