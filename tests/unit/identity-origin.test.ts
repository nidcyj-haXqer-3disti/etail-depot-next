import { describe, expect, it } from "vitest";
import { assertSameOrigin, assertTrustedOrigin } from "../../src/platform/security/origin";
import { assertFixtureIdentityAllowed, type FixtureIdentityContext } from "../../src/modules/identity/fixture";

const canonical = "https://fresh-sandbox.example.test";
const request = (headers: Record<string, string>, method = "POST") => ({ method, headers: new Headers(headers) });

describe("trusted external origin", () => {
  it("accepts the configured browser origin even when internal Host and forwarded headers differ", () => {
    expect(() => assertSameOrigin(request({
      origin: canonical, host: "internal:8888", "x-forwarded-host": "attacker.example.test",
      forwarded: "host=attacker.example.test;proto=http", "sec-fetch-site": "same-origin",
    }), canonical)).not.toThrow();
  });

  it.each([undefined, "null", "https://attacker.example.test", `${canonical}/`, `${canonical}/path`, `${canonical}, https://attacker.example.test`, "not a URL"])("rejects unsafe browser origin %s", (origin) => {
    expect(() => assertSameOrigin(request(origin ? { origin } : {}), canonical)).toThrow("UNTRUSTED_REQUEST_ORIGIN");
  });

  it.each(["POST", "PUT", "PATCH", "DELETE"])("protects every unsafe method %s", (method) => {
    expect(() => assertSameOrigin(request({}, method), canonical)).toThrow();
  });

  it("does not require browser origin on safe reads", () => {
    expect(() => assertSameOrigin(request({}, "GET"), canonical)).not.toThrow();
  });

  it("rejects contradictory cross-site fetch metadata", () => {
    expect(() => assertSameOrigin(request({ origin: canonical, "sec-fetch-site": "cross-site" }), canonical)).toThrow();
  });

  it.each(["http://fresh.example.test", "https://*.netlify.app", "https://fresh.example.test/path", "https://user:password@fresh.example.test", "https://fresh.example.test?token=secret", "https://fresh.example.test#token", "https://127.0.0.1"])("rejects invalid hosted configuration %s", (origin) => {
    expect(() => assertTrustedOrigin(origin, "production")).toThrow();
  });

  it("requires isolated loopback origins for local and test modes", () => {
    expect(assertTrustedOrigin("http://127.0.0.1:3000", "test")).toBe("http://127.0.0.1:3000");
    expect(assertTrustedOrigin("http://[::1]:3000", "local")).toBe("http://[::1]:3000");
    expect(() => assertTrustedOrigin(canonical, "local")).toThrow("LOCAL_ORIGIN_REQUIRED");
  });
});

describe("fixture identity guard", () => {
  const base: FixtureIdentityContext = { appEnv: "test", publicOrigin: "http://127.0.0.1:3000", fixtureIdentityEnabled: true, netlifyRuntime: false };

  it("allows only explicitly enabled isolated local or CI use", () => {
    expect(() => assertFixtureIdentityAllowed(base)).not.toThrow();
    expect(() => assertFixtureIdentityAllowed({ ...base, appEnv: "local" })).not.toThrow();
  });

  it("fails closed for hosted deployment even if fixture enablement is accidentally set", () => {
    expect(() => assertFixtureIdentityAllowed({ ...base, appEnv: "production", publicOrigin: canonical })).toThrow("FIXTURE_IDENTITY_DISABLED");
    expect(() => assertFixtureIdentityAllowed({ ...base, appEnv: "preview", publicOrigin: canonical })).toThrow("FIXTURE_IDENTITY_DISABLED");
    expect(() => assertFixtureIdentityAllowed({ ...base, netlifyRuntime: true })).toThrow("FIXTURE_IDENTITY_DISABLED");
    expect(() => assertFixtureIdentityAllowed({ ...base, fixtureIdentityEnabled: false })).toThrow("FIXTURE_IDENTITY_DISABLED");
    expect(() => assertFixtureIdentityAllowed({ ...base, publicOrigin: canonical })).toThrow("LOCAL_ORIGIN_REQUIRED");
  });
});
