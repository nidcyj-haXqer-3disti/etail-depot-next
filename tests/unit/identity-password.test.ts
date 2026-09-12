import { describe, expect, it, vi } from "vitest";
import targets from "../../project-targets.json";
import { getPasswordIdentityConfiguration } from "../../src/modules/identity/password-configuration";
import { signInWithPassword } from "../../src/modules/identity/password-login";
import { SecurityError } from "../../src/platform/security/origin";

const local = { APP_ENV: "local", ETAIL_PUBLIC_ORIGIN: "http://127.0.0.1:3100", ENABLE_REAL_MONEY: "false" };
const verified = { issuer: `${targets.netlify.canonical_origin}/.netlify/identity`, subject: "verified-provider-subject", providerConfirmed: true as const };
function dependencies() {
  const order: string[] = [];
  const identity = { identityId: "new-identity", personId: "new-person" };
  const issued = { cookie: "opaque-app-cookie", record: { ...identity, tokenHash: "hash", familyId: "family", issuedAt: new Date(), expiresAt: new Date(), revokedAt: null } };
  return {
    order,
    limiter: { consume: vi.fn(async () => { order.push("limit"); }) },
    provider: {
      passwordLoginAvailability: vi.fn(async () => { order.push("availability"); return { available: true, reason: "AVAILABLE" as const }; }),
      verifyPassword: vi.fn(async () => { order.push("verify"); return verified; }),
    },
    bind: vi.fn(async () => { order.push("bind"); return identity; }),
    sessions: {
      logout: vi.fn(async () => { order.push("revoke previous"); return "expired-cookie"; }),
      issue: vi.fn(async () => { order.push("issue"); return issued; }),
    },
  };
}

describe("explicit password configuration", () => {
  it("binds the local browser application to the recorded owned provider, independently of sample identity", () => {
    expect(getPasswordIdentityConfiguration(local)).toMatchObject({ appEnv: "local", publicOrigin: local.ETAIL_PUBLIC_ORIGIN, providerOrigin: targets.netlify.canonical_origin, expectedSiteId: targets.netlify.site_id, runtimeSiteId: null, localRemoteProvider: true });
    expect(getPasswordIdentityConfiguration({ ...local, ENABLE_LOCAL_FIXTURE_IDENTITY: "false" })).toEqual(getPasswordIdentityConfiguration(local));
  });
  const production = { APP_ENV: "production", ETAIL_PUBLIC_ORIGIN: targets.netlify.canonical_origin, SITE_ID: targets.netlify.site_id, ENABLE_REAL_MONEY: "false", ENABLE_LOCAL_FIXTURE_IDENTITY: "false" };
  const productionContext = () => ({ site: { id: targets.netlify.site_id }, deploy: { context: "production" } });
  it("enables the recorded production request without build-only NETLIFY or CONTEXT variables", () => {
    expect(getPasswordIdentityConfiguration(production, productionContext)).toEqual({ appEnv: "production", publicOrigin: targets.netlify.canonical_origin, identityEndpoint: verified.issuer, expectedSiteId: targets.netlify.site_id, runtimeSiteId: targets.netlify.site_id, providerOrigin: targets.netlify.canonical_origin, localRemoteProvider: false });
  });
  it("does not treat production-looking build flags as proof of an actual hosted request", () => {
    expect(() => getPasswordIdentityConfiguration({ ...production, NETLIFY: "true", CONTEXT: "production" })).toThrow("HOSTED_IDENTITY_NOT_READY");
  });
  it.each(["deploy-preview", "branch-deploy", "dev", "", "unknown"])("rejects actual %s context even with production-looking build variables", context => {
    expect(() => getPasswordIdentityConfiguration({ ...production, NETLIFY: "true", CONTEXT: "production" }, () => ({ ...productionContext(), deploy: { context } }))).toThrow("HOSTED_IDENTITY_NOT_READY");
  });
  it.each([undefined, "unrelated-site", targets.denied.netlify_site_ids[0]])("rejects a missing or mismatched request-context site: %s", id => {
    expect(() => getPasswordIdentityConfiguration(production, () => ({ ...productionContext(), site: { id } }))).toThrow("HOSTED_IDENTITY_NOT_READY");
  });
  it("does not need a hosted request context in the isolated local preview", () => {
    const context = vi.fn(() => { throw new Error("No request context in local preview"); });
    expect(getPasswordIdentityConfiguration(local, context).localRemoteProvider).toBe(true);
    expect(context).not.toHaveBeenCalled();
  });
  it("reads the actual context each time, including an async request scope change", () => {
    const context = vi.fn().mockReturnValueOnce(productionContext()).mockReturnValueOnce({ ...productionContext(), deploy: { context: "deploy-preview" } });
    expect(getPasswordIdentityConfiguration(production, context).localRemoteProvider).toBe(false);
    expect(() => getPasswordIdentityConfiguration(production, context)).toThrow("HOSTED_IDENTITY_NOT_READY");
  });
  it.each([
    { APP_ENV: "preview" }, { APP_ENV: "local" }, { APP_ENV: "test" }, { APP_ENV: undefined },
    { SITE_ID: "unrelated-site" }, { SITE_ID: targets.denied.netlify_site_ids[0] }, { SITE_ID: undefined },
    { ETAIL_PUBLIC_ORIGIN: "https://branch--etail-depot-next.netlify.app" }, { ETAIL_PUBLIC_ORIGIN: "https://unrelated.example.test" }, { ETAIL_PUBLIC_ORIGIN: undefined },
    { ENABLE_REAL_MONEY: undefined }, { ENABLE_REAL_MONEY: "true" }, { ENABLE_LOCAL_FIXTURE_IDENTITY: undefined }, { ENABLE_LOCAL_FIXTURE_IDENTITY: "true" },
    { CI: "true" }, { CI: "1" },
  ])("does not let a production-like environment bypass its site, context or sandbox boundary %#", change => {
    expect(() => getPasswordIdentityConfiguration({ ...production, ...change }, productionContext)).toThrow(SecurityError);
  });
  it.each([
    {}, { ...local, APP_ENV: undefined }, { ...local, ETAIL_PUBLIC_ORIGIN: undefined },
    { ...local, APP_ENV: "test" }, { ...local, APP_ENV: "production" }, { ...local, APP_ENV: "preview" },
    { ...local, CI: "true" }, { ...local, CI: "1" }, { ...local, NETLIFY: "true" }, { ...local, SITE_ID: targets.netlify.site_id }, { ...local, CONTEXT: "deploy-preview" },
    { ...local, ETAIL_PUBLIC_ORIGIN: "https://unrelated.example.test" },
  ])("fails closed for missing, hosted, CI or nonlocal environment %#", env => {
    expect(() => getPasswordIdentityConfiguration(env)).toThrow(SecurityError);
  });
});

describe("password verification to canonical session", () => {
  it("budgets first, verifies actual issuer/subject, rotates the old browser session, and returns only its opaque cookie", async () => {
    const deps = dependencies();
    expect(await signInWithPassword("member@example.test", "existing password", "old-cookie", deps)).toBe("opaque-app-cookie");
    expect(deps.order).toEqual(["limit", "availability", "verify", "bind", "revoke previous", "issue"]);
    expect(deps.bind).toHaveBeenCalledExactlyOnceWith(verified.issuer, verified.subject);
    expect(deps.sessions.issue).toHaveBeenCalledExactlyOnceWith({ identityId: "new-identity", personId: "new-person" }, { issuer: verified.issuer, subject: verified.subject });
    expect(deps.sessions.logout).toHaveBeenCalledExactlyOnceWith("old-cookie");
  });
  it("does not send any credential or bind an identity after exhausting the durable budget", async () => {
    const deps = dependencies(); deps.limiter.consume.mockRejectedValue(new SecurityError("SIGN_IN_RATE_LIMITED", 429));
    await expect(signInWithPassword("member@example.test", "password", null, deps)).rejects.toMatchObject({ status: 429 });
    expect(deps.provider.passwordLoginAvailability).not.toHaveBeenCalled(); expect(deps.provider.verifyPassword).not.toHaveBeenCalled(); expect(deps.bind).not.toHaveBeenCalled();
  });
  it("does not issue or revoke sessions on incorrect credentials", async () => {
    const deps = dependencies(); deps.provider.verifyPassword.mockRejectedValue(new SecurityError("INVALID_CREDENTIALS", 401));
    await expect(signInWithPassword("member@example.test", "wrong", "existing-cookie", deps)).rejects.toMatchObject({ status: 401 });
    expect(deps.limiter.consume).toHaveBeenCalledOnce(); expect(deps.bind).not.toHaveBeenCalled(); expect(deps.sessions.logout).not.toHaveBeenCalled(); expect(deps.sessions.issue).not.toHaveBeenCalled();
  });
  it("cannot exchange a provider result for a sample persona", async () => {
    const deps = dependencies(); deps.provider.verifyPassword.mockResolvedValue({ ...verified, issuer: "urn:etail:isolated-fixture" });
    await expect(signInWithPassword("owner@example.test", "password", null, deps)).rejects.toMatchObject({ code: "INVALID_VERIFIED_IDENTITY" });
    expect(deps.bind).not.toHaveBeenCalled(); expect(deps.sessions.issue).not.toHaveBeenCalled();
  });
});
