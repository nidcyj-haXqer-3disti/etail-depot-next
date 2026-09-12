import { describe, expect, it, vi } from "vitest";
import { NetlifyIdentityAdapter, type NetlifyIdentityConfiguration } from "../../src/modules/identity/adapters/netlify";

const endpoint = "https://fresh-sandbox.example.test/.netlify/identity";
const configuration: NetlifyIdentityConfiguration = {
  appEnv: "production", publicOrigin: "https://fresh-sandbox.example.test", identityEndpoint: endpoint,
  expectedSiteId: "fresh-site-id", runtimeSiteId: "fresh-site-id",
};
const verifiedUser = { id: "new-provider-subject", confirmed_at: "2026-09-08T00:00:00Z", email: "member@example.test" };

function setup(responses: Response[] = []) {
  const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => {
    const response = responses.shift();
    if (!response) throw new Error("upstream failure with secret details");
    return response;
  });
  const runtime = vi.fn(() => ({ url: endpoint, token: "operator-test-value-never-exported" }));
  const adapter = new NetlifyIdentityAdapter(() => configuration, fetcher, runtime);
  return { fetcher, runtime, adapter };
}

describe("Netlify Identity server adapter", () => {
  it("verifies the bound current email with confirmation-required settings and drops provider roles and credentials", async () => {
    const { adapter, fetcher } = setup([
      Response.json({ access_token: "server-only-test-token", refresh_token: "server-only-test-refresh" }),
      Response.json({ ...verifiedUser, app_metadata: { roles: ["admin"] }, user_metadata: { personId: "victim" } }),
      Response.json({ external: { email: true }, autoconfirm: false }),
    ]);
    const identity = await adapter.verifyPassword("member@example.test", "  valid password  ");
    expect(identity).toEqual({ issuer: endpoint, subject: verifiedUser.id, providerConfirmed: true, verifiedEmail: { emailNormalized: verifiedUser.email, provenance: "NETLIFY_USER_CONFIRMED", verifiedAt: new Date(verifiedUser.confirmed_at).toISOString() } });
    expect(fetcher).toHaveBeenCalledTimes(3);
    const [tokenUrl, tokenRequest] = fetcher.mock.calls[0]!;
    expect(tokenUrl).toBe(`${endpoint}/token`);
    expect(new URLSearchParams(tokenRequest!.body as string).get("password")).toBe("  valid password  ");
    expect(tokenRequest).toMatchObject({ redirect: "error", cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer" });
    expect(fetcher.mock.calls[1]).toEqual([`${endpoint}/user`, expect.objectContaining({ headers: { Authorization: "Bearer server-only-test-token" } })]);
    expect(fetcher.mock.calls[2]?.[0]).toBe(`${endpoint}/settings`);
    expect(JSON.stringify(identity)).not.toMatch(/token|email@|admin|victim/);
  });

  it.each([
    { external: { email: true }, autoconfirm: true }, { external: { email: false }, autoconfirm: false },
    { external: { email: true } }, {},
  ])("keeps login but supplies no invitation email proof when confirmation settings are not trusted %#", async settings => {
    const { adapter } = setup([Response.json({ access_token: "test-token" }), Response.json(verifiedUser), Response.json(settings)]);
    expect(await adapter.verifyPassword("different-browser-input@example.test", "password")).toEqual({ issuer: endpoint, subject: verifiedUser.id, providerConfirmed: true });
  });

  it("uses only the provider current email, never browser input, pending email or user metadata", async () => {
    const { adapter } = setup([Response.json({ access_token: "test-token" }), Response.json({ ...verifiedUser, email: " Person+Card@Example.TEST ", new_email: "pending@example.test", user_metadata: { email: "forged@example.test", email_verified: true } }), Response.json({ external: { email: true }, autoconfirm: false })]);
    expect((await adapter.verifyPassword("browser@example.test", "password")).verifiedEmail?.emailNormalized).toBe("person+card@example.test");
  });

  it.each([undefined, "invalid-address", "", null])("does not manufacture a verified contact when current provider email is %s", async email => {
    const { adapter } = setup([Response.json({ access_token: "test-token" }), Response.json({ ...verifiedUser, email, new_email: "pending@example.test", user_metadata: { email: "forged@example.test", email_verified: true } })]);
    expect((await adapter.verifyPassword("browser@example.test", "password")).verifiedEmail).toBeUndefined();
  });

  it("keeps the same email with a new subject a separate identity", async () => {
    const first = setup([Response.json({ access_token: "test-token" }), Response.json(verifiedUser)]);
    const second = setup([Response.json({ access_token: "test-token" }), Response.json({ ...verifiedUser, id: "reregistered-subject" })]);
    const a = await first.adapter.verifyPassword(verifiedUser.email, "valid password");
    const b = await second.adapter.verifyPassword(verifiedUser.email, "valid password");
    expect(a.subject).not.toBe(b.subject);
    expect(a.issuer).toBe(b.issuer);
  });

  it("refuses to trust token exchange success without provider /user verification", async () => {
    const { adapter } = setup([Response.json({ access_token: "test-token" }), new Response("secret rejected", { status: 401 })]);
    await expect(adapter.verifyPassword("member@example.test", "valid password")).rejects.toThrow("INVALID_CREDENTIALS");
  });

  it.each([undefined, null, "", "invalid-date"])("rejects unconfirmed provider identity %s", async (confirmedAt) => {
    const { adapter } = setup([Response.json({ access_token: "test-token" }), Response.json({ ...verifiedUser, confirmed_at: confirmedAt })]);
    await expect(adapter.verifyPassword("member@example.test", "valid password")).rejects.toThrow("INVALID_CREDENTIALS");
  });

  it("fails before network access when the runtime identity issuer or site mismatches", async () => {
    const { adapter, runtime, fetcher } = setup();
    runtime.mockReturnValue({ url: "https://unrelated.example.test/.netlify/identity", token: "never-used" });
    expect(adapter.configurationStatus()).toEqual({ configured: false, reason: "IDENTITY_TARGET_MISMATCH" });
    await expect(adapter.verifyPassword("member@example.test", "valid password")).rejects.toThrow("IDENTITY_TARGET_MISMATCH");
    expect(fetcher).not.toHaveBeenCalled();
    const wrongSite = new NetlifyIdentityAdapter(() => ({ ...configuration, runtimeSiteId: "unrelated-site" }), fetcher, runtime);
    expect(wrongSite.configurationStatus().configured).toBe(false);
  });

  it("does not advertise missing provider configuration as ready", () => {
    const adapter = new NetlifyIdentityAdapter(() => ({ ...configuration, expectedSiteId: null }));
    expect(adapter.configurationStatus()).toEqual({ configured: false, reason: "IDENTITY_NOT_CONFIGURED" });
  });

  it("reads configuration again for each operation", () => {
    let current = configuration;
    const adapter = new NetlifyIdentityAdapter(() => current, fetch, () => ({ url: endpoint }));
    expect(adapter.configurationStatus().configured).toBe(true);
    current = { ...configuration, expectedSiteId: null };
    expect(adapter.configurationStatus().configured).toBe(false);
  });

  it("does not expose upstream exception or response details", async () => {
    const { adapter } = setup();
    const failure = adapter.verifyPassword("member@example.test", "valid password");
    await expect(failure).rejects.toThrow("IDENTITY_UNAVAILABLE");
    await expect(failure).rejects.not.toHaveProperty("cause");
    const invalid = setup([new Response("untrusted upstream diagnostic secret", { status: 500 })]);
    await expect(invalid.adapter.verifyPassword("member@example.test", "valid password")).rejects.toThrow("IDENTITY_UNAVAILABLE");
  });

  it.each(["", "a".repeat(1025)])("rejects empty or oversized passwords before attempting login", async (password) => {
    const { adapter, fetcher } = setup();
    await expect(adapter.verifyPassword("member@example.test", password)).rejects.toThrow("INVALID_CREDENTIALS");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("lets the provider verify existing shorter passwords instead of imposing enrollment rules", async () => {
    const { adapter } = setup([Response.json({ access_token: "test-token" }), Response.json(verifiedUser)]);
    await expect(adapter.verifyPassword(verifiedUser.email, "short")).resolves.toMatchObject({ subject: verifiedUser.id });
  });

  it("uses the one bound remote provider from an explicit local application without browser provider cookies", async () => {
    const { fetcher } = setup([Response.json({ access_token: "test-token" }), Response.json(verifiedUser)]);
    const local = new NetlifyIdentityAdapter(() => ({ ...configuration, appEnv: "local", publicOrigin: "http://127.0.0.1:3100", providerOrigin: configuration.publicOrigin, runtimeSiteId: null, localRemoteProvider: true }), fetcher, () => null);
    expect(local.configurationStatus().configured).toBe(true);
    await expect(local.verifyPassword(verifiedUser.email, "short")).resolves.toEqual({ issuer: endpoint, subject: verifiedUser.id, providerConfirmed: true });
    expect(fetcher.mock.calls[0]?.[0]).toBe(`${endpoint}/token`);
  });

  it.each(["test", "preview", "production"] as const)("does not turn %s into local email mode", (appEnv) => {
    const local = new NetlifyIdentityAdapter(() => ({ ...configuration, appEnv, providerOrigin: configuration.publicOrigin, runtimeSiteId: null, localRemoteProvider: true }), fetch, () => null);
    expect(local.configurationStatus().configured).toBe(false);
  });

  it("checks email login availability from actual settings, independently of signup configuration", async () => {
    const { adapter } = setup([Response.json({ external: { email: true }, disable_signup: true, autoconfirm: false })]);
    expect(await adapter.passwordLoginAvailability()).toEqual({ available: true, reason: "AVAILABLE" });
    expect(await setup([Response.json({ external: { email: false } })]).adapter.passwordLoginAvailability()).toEqual({ available: false, reason: "NOT_CONFIGURED" });
    expect(await setup([new Response(null, { status: 404 })]).adapter.passwordLoginAvailability()).toEqual({ available: false, reason: "UNAVAILABLE" });
  });

  it("distinguishes unavailable providers and upstream rate limiting from rejected credentials", async () => {
    await expect(setup([new Response(null, { status: 404 })]).adapter.verifyPassword(verifiedUser.email, "short")).rejects.toMatchObject({ code: "IDENTITY_UNAVAILABLE", status: 503 });
    await expect(setup([new Response(null, { status: 429 })]).adapter.verifyPassword(verifiedUser.email, "short")).rejects.toMatchObject({ code: "SIGN_IN_RATE_LIMITED", status: 429 });
  });

  it("rejects unbounded or invalid upstream responses without exposing their content", async () => {
    for (const response of [Response.json({ access_token: "x".repeat(66_000) }), Response.json(["private"]), new Response("private malformed body")]) {
      await expect(setup([response]).adapter.verifyPassword(verifiedUser.email, "short")).rejects.toMatchObject({ code: "IDENTITY_INVALID_RESPONSE", status: 503 });
    }
  });
});
