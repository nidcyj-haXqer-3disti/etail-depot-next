import { afterEach, describe, expect, it, vi } from "vitest";
import { applicationOrigin, assertEmailHarnessEnvironment, fixtureOrigin, isolatedDatabase, pinnedIdentityEndpoint } from "../email-harness/guard";

const environment = { APP_ENV: "test", ENABLE_REAL_MONEY: "false", DATABASE_URL: isolatedDatabase };
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });
describe("isolated email browser harness boundaries", () => {
  it("requires the exact disposable local target and refuses hosted, CI, preview and real-money configurations", () => {
    expect(() => assertEmailHarnessEnvironment(environment)).not.toThrow();
    for (const override of [
      { APP_ENV: "production" }, { CI: "true" }, { ENABLE_REAL_MONEY: "true" },
      { DATABASE_URL: isolatedDatabase.replace("_test", "_preview") },
      { DATABASE_URL: isolatedDatabase.replace("etail_local", "etail_ci") },
      { DATABASE_URL: `${isolatedDatabase}?sslmode=disable` },
      ...["NETLIFY", "SITE_ID", "CONTEXT", "URL", "NETLIFY_DB_URL", "NETLIFY_DATABASE_URL"].map(key => ({ [key]: "present" })),
    ]) expect(() => assertEmailHarnessEnvironment({ ...environment, ...override })).toThrow();
    expect(pinnedIdentityEndpoint()).toBe("https://etail-depot-next.netlify.app/.netlify/identity");
  });

  it("intercepts only pinned known provider requests and never falls through to external transport", async () => {
    for (const key of ["CI", "NETLIFY", "SITE_ID", "CONTEXT", "URL", "NETLIFY_DB_URL", "NETLIFY_DATABASE_URL"]) vi.stubEnv(key, "");
    for (const [key, value] of Object.entries({ ...environment, APP_ENV: "local", ETAIL_PUBLIC_ORIGIN: applicationOrigin, ENABLE_LOCAL_FIXTURE_IDENTITY: "false" })) vi.stubEnv(key, value);
    const network = vi.fn<typeof fetch>(async () => new Response("{}", { headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", network);
    await import("../email-harness/provider-preload");
    const intercept = globalThis.fetch;
    await intercept(`${pinnedIdentityEndpoint()}/settings`);
    expect(network.mock.calls[0]?.[0]).toBe(`${fixtureOrigin}/provider/settings`);
    network.mockClear();
    for (const url of [
      `${pinnedIdentityEndpoint()}/admin/users`, `${pinnedIdentityEndpoint()}/settings?unexpected=1`,
      `${pinnedIdentityEndpoint()}/settings#unexpected`, "https://etail-depot-next.netlify.app/other",
      "https://other-provider.example.test/.netlify/identity/settings", `${fixtureOrigin}/control/reset`,
    ]) await expect(intercept(url)).rejects.toThrow();
    await expect(intercept(`${pinnedIdentityEndpoint()}/signup`, { method: "DELETE" })).rejects.toThrow();
    expect(network).not.toHaveBeenCalled();
  });
});
