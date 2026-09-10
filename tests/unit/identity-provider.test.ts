import { describe, expect, it, vi } from "vitest";
import { NetlifyIdentityAdapter, type NetlifyIdentityConfiguration } from "../../src/modules/identity/adapters/netlify";

const endpoint = "https://fresh-sandbox.example.test/.netlify/identity";
const configuration: NetlifyIdentityConfiguration = {
  appEnv: "preview", publicOrigin: "https://fresh-sandbox.example.test", identityEndpoint: endpoint,
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
  it("verifies through the bound issuer and drops email, provider roles and credentials", async () => {
    const { adapter, fetcher } = setup([
      Response.json({ access_token: "server-only-test-token", refresh_token: "server-only-test-refresh" }),
      Response.json({ ...verifiedUser, app_metadata: { roles: ["admin"] }, user_metadata: { personId: "victim" } }),
    ]);
    const identity = await adapter.verifyPassword("member@example.test", "  valid password  ");
    expect(identity).toEqual({ issuer: endpoint, subject: verifiedUser.id, emailVerified: true });
    expect(fetcher).toHaveBeenCalledTimes(2);
    const [tokenUrl, tokenRequest] = fetcher.mock.calls[0]!;
    expect(tokenUrl).toBe(`${endpoint}/token`);
    expect(new URLSearchParams(tokenRequest!.body as string).get("password")).toBe("  valid password  ");
    expect(tokenRequest).toMatchObject({ redirect: "error", cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer" });
    expect(fetcher.mock.calls[1]).toEqual([`${endpoint}/user`, expect.objectContaining({ headers: { Authorization: "Bearer server-only-test-token" } })]);
    expect(JSON.stringify(identity)).not.toMatch(/token|email@|admin|victim/);
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

  it("rejects short passwords without trimming or attempting login", async () => {
    const { adapter, fetcher } = setup();
    await expect(adapter.verifyPassword("member@example.test", "short")).rejects.toThrow("INVALID_CREDENTIALS");
    expect(fetcher).not.toHaveBeenCalled();
  });
});
