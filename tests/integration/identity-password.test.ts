import { createHash, randomUUID } from "node:crypto";
import { afterAll, describe, expect, it, vi } from "vitest";
import { eq, sql } from "drizzle-orm";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { identityBindings, serviceMembers, permissionGrants } from "../../src/platform/database/schema";
import { bindIdentity, listServicesForPerson } from "../../src/modules/services/service";
import { merchantSetupEligibility } from "../../src/modules/services/schema";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { SessionService } from "../../src/modules/identity/session";
import { signInWithPassword } from "../../src/modules/identity/password-login";
import { passwordAttemptLimiter } from "../../src/modules/identity/password-throttle";
import { passwordLoginThrottle } from "../../src/modules/identity/schema";
import { withPasswordAuthentication } from "../../src/modules/identity/password-boundary";
import { SecurityError } from "../../src/platform/security/origin";
import { merchantAssignments } from "../../src/modules/access/schema";
import { operatorServiceAccess } from "../../src/modules/operations/schema";

afterAll(closeDatabase);
const globalKey = createHash("sha256").update("password-login:global").digest("hex");
describe("persistent password login boundaries", () => {
  it("serializes delayed password verification and reset, rejects overlapping work promptly, and releases on failure", async () => {
    const identity = await bindIdentity("https://new-provider.example.test/.netlify/identity", randomUUID());
    const sessions = new SessionService(sessionRepository, { appEnv: "test", publicOrigin: "http://127.0.0.1:3100" });
    let entered!: () => void, continueVerification!: () => void;
    const started = new Promise<void>(resolve => { entered = resolve; });
    const continueAfter = new Promise<void>(resolve => { continueVerification = resolve; });
    let activePassword = "old password";
    const login = withPasswordAuthentication(() => signInWithPassword("person@example.test", "old password", null, {
      limiter: { consume: async () => undefined },
      provider: { passwordLoginAvailability: async () => ({ available: true, reason: "AVAILABLE" }), verifyPassword: async () => { entered(); await continueAfter; if (activePassword !== "old password") throw new SecurityError("INVALID_CREDENTIALS", 401); return { issuer: "https://new-provider.example.test/.netlify/identity", subject: "same-provider-person", providerConfirmed: true }; } },
      bind: async () => identity, sessions,
    }));
    await started;
    try {
      await expect(withPasswordAuthentication(async () => { throw new Error("Overlapping reset must never execute"); })).rejects.toMatchObject({ code: "AUTHENTICATION_BUSY", status: 409 });
    } finally { continueVerification(); }
    const cookie = await login;
    expect(await sessions.authenticate(cookie.split(";")[0]!)).not.toBeNull();
    await withPasswordAuthentication(async () => {
      await sessions.revokeIdentity(identity.identityId);
      await expect(withPasswordAuthentication(async () => sessions.issue(identity))).rejects.toMatchObject({ code: "AUTHENTICATION_BUSY", status: 409 });
      activePassword = "new password";
    });
    expect(await sessions.authenticate(cookie.split(";")[0]!)).toBeNull();
    await expect(withPasswordAuthentication(async () => { throw new Error("Provider timed out"); })).rejects.toThrow("Provider timed out");
    await expect(withPasswordAuthentication(async () => "released")).resolves.toBe("released");
  });
  it("allows ten concurrent attempts across normalized login names, rejects excess, and expires using the database clock", async () => {
    // This test-only database contains no real sign-in traffic. Other application data stays intact.
    expect(process.env.APP_ENV).toBe("test");
    await getDb().delete(passwordLoginThrottle);
    const email = `login-${randomUUID()}@example.test`;
    const results = await Promise.allSettled(Array.from({ length: 24 }, (_, index) => passwordAttemptLimiter.consume(index % 2 ? `  ${email.toUpperCase()}  ` : email)));
    expect(results.filter(result => result.status === "fulfilled")).toHaveLength(10);
    for (const result of results) if (result.status === "rejected") expect(result.reason).toMatchObject({ code: "SIGN_IN_RATE_LIMITED", status: 429 });
    const rows = await getDb().select().from(passwordLoginThrottle);
    expect(rows).toHaveLength(2); expect(rows.every(row => /^[a-f0-9]{64}$/.test(row.key) && row.attempts === 10)).toBe(true);
    expect(JSON.stringify(rows)).not.toContain(email);
    await getDb().update(passwordLoginThrottle).set({ windowStartedAt: sql`clock_timestamp() - interval '16 minutes'` });
    await expect(passwordAttemptLimiter.consume(email)).resolves.toBeUndefined();
    expect((await getDb().select().from(passwordLoginThrottle)).every(row => row.attempts === 1)).toBe(true);
  });

  it("enforces a shared upstream budget across different login names and retains counters between limiter calls", async () => {
    await getDb().delete(passwordLoginThrottle);
    await getDb().insert(passwordLoginThrottle).values({ key: globalKey, attempts: 58 });
    const results = await Promise.allSettled(Array.from({ length: 6 }, () => passwordAttemptLimiter.consume(`${randomUUID()}@example.test`)));
    expect(results.filter(result => result.status === "fulfilled")).toHaveLength(2);
    expect(results.filter(result => result.status === "rejected")).toHaveLength(4);
    expect((await getDb().select().from(passwordLoginThrottle).where(eq(passwordLoginThrottle.key, globalKey)))[0]!.attempts).toBe(60);
    await expect(passwordAttemptLimiter.consume(`${randomUUID()}@example.test`)).rejects.toMatchObject({ status: 429 });
    await getDb().delete(passwordLoginThrottle);
  });

  it("binds verified provider identity to an empty member, never a sample identity, and replaces only the previous browser session", async () => {
    const subject = randomUUID();
    const oldIdentity = await bindIdentity("urn:etail:isolated-fixture", subject);
    const service = new SessionService(sessionRepository, { appEnv: "test", publicOrigin: "http://127.0.0.1:3100" });
    const old = await service.issue(oldIdentity);
    const separate = await service.issue(oldIdentity);
    const issuer = "https://new-provider.example.test/.netlify/identity";
    const provider = { passwordLoginAvailability: async () => ({ available: true, reason: "AVAILABLE" as const }), verifyPassword: async () => ({ issuer, subject, providerConfirmed: true as const }) };
    const cookie = await signInWithPassword("owner@example.test", "provider-verified-in-this-test", old.cookie.split(";")[0]!, { provider, limiter: { consume: async () => undefined }, bind: bindIdentity, sessions: service });
    expect(cookie).toContain("HttpOnly; SameSite=Strict"); expect(cookie).not.toMatch(/owner@example|provider-verified|access_token|refresh_token/);
    const current = await service.authenticate(cookie.split(";")[0]!); expect(current).not.toBeNull(); expect(current!.personId).not.toBe(oldIdentity.personId);
    expect(await service.authenticate(old.cookie.split(";")[0]!)).toBeNull(); expect(await service.authenticate(separate.cookie.split(";")[0]!)).not.toBeNull();
    expect((await getDb().select().from(identityBindings).where(eq(identityBindings.id, current!.identityId)))[0]).toMatchObject({ issuer, subject });
    expect(await listServicesForPerson(current!.personId)).toEqual([]);
    expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId, current!.personId))).toEqual([]);
    expect(await getDb().select().from(permissionGrants).where(eq(permissionGrants.personId, current!.personId))).toEqual([]);
    expect(await getDb().select().from(merchantSetupEligibility).where(eq(merchantSetupEligibility.personId, current!.personId))).toEqual([]);
    await service.logout(cookie.split(";")[0]!); await service.logout(separate.cookie.split(";")[0]!);
  });

  it("completes first sign-in through the authentication lock, durable limiter, binding and HTTPS session without granting services", async () => {
    expect(process.env.APP_ENV).toBe("test");
    await getDb().delete(passwordLoginThrottle);
    const email = `first-login-${randomUUID()}@example.test`;
    const issuer = "https://new-provider.example.test/.netlify/identity", subject = randomUUID();
    const service = new SessionService(sessionRepository, { appEnv: "production", publicOrigin: "https://fresh-auth.example.test" });
    // Only upstream verification is substituted; every application/database step is real.
    const provider = {
      passwordLoginAvailability: vi.fn(async () => ({ available: true, reason: "AVAILABLE" as const })),
      verifyPassword: vi.fn(async () => ({ issuer, subject, providerConfirmed: true as const })),
    };
    const cookie = await withPasswordAuthentication(() => signInWithPassword(email, "synthetic-verified-password", null, {
      provider, limiter: passwordAttemptLimiter, bind: bindIdentity, sessions: service,
    }));
    const cookieHeader = cookie.split(";")[0]!;
    try {
      expect(provider.passwordLoginAvailability).toHaveBeenCalledOnce();
      expect(provider.verifyPassword).toHaveBeenCalledExactlyOnceWith(email, "synthetic-verified-password");
      expect(cookie).toMatch(/^__Host-etail_session=[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; SameSite=Strict; Max-Age=28800; Secure$/);
      expect(cookie).not.toMatch(/synthetic-verified-password|access_token|refresh_token|Domain=/);
      const current = await service.authenticate(cookieHeader);
      expect(current).not.toBeNull();
      expect(current!.issuedAt).toBeInstanceOf(Date); expect(current!.expiresAt).toBeInstanceOf(Date);
      expect((await getDb().select().from(identityBindings).where(eq(identityBindings.id, current!.identityId)))[0]).toMatchObject({ issuer, subject, personId: current!.personId });
      const budgets = await getDb().select().from(passwordLoginThrottle);
      expect(budgets).toHaveLength(2);
      expect(budgets.every(row => /^[a-f0-9]{64}$/.test(row.key) && row.attempts === 1)).toBe(true);
      expect(JSON.stringify(budgets)).not.toContain(email);
      expect(await listServicesForPerson(current!.personId)).toEqual([]);
      expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId, current!.personId))).toEqual([]);
      expect(await getDb().select().from(permissionGrants).where(eq(permissionGrants.personId, current!.personId))).toEqual([]);
      expect(await getDb().select().from(merchantAssignments).where(eq(merchantAssignments.personId, current!.personId))).toEqual([]);
      expect(await getDb().select().from(operatorServiceAccess).where(eq(operatorServiceAccess.personId, current!.personId))).toEqual([]);
      expect(await getDb().select().from(merchantSetupEligibility).where(eq(merchantSetupEligibility.personId, current!.personId))).toEqual([]);
    } finally {
      await service.logout(cookieHeader);
    }
    expect(await service.authenticate(cookieHeader)).toBeNull();
  });
});
