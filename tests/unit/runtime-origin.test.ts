import { describe, expect, it } from "vitest";
import { getRuntimeConfig } from "../../src/platform/config";
import { assertSameOrigin } from "../../src/platform/security/origin";

describe("configured runtime origin", () => {
  it("uses the configured local port for the browser command origin", () => {
    const config = getRuntimeConfig({
      APP_ENV: "local",
      ETAIL_PUBLIC_ORIGIN: "http://127.0.0.1:4000",
      ENABLE_LOCAL_FIXTURE_IDENTITY: "true",
    });
    expect(config.publicOrigin).toBe("http://127.0.0.1:4000");
    expect(config.localFixtureIdentity).toBe(true);
    expect(() => assertSameOrigin(new Request("http://127.0.0.1:4000/api/v1/services", {
      method: "POST",
      headers: { Origin: "http://127.0.0.1:4000", "Sec-Fetch-Site": "same-origin" },
    }), config.publicOrigin)).not.toThrow();
    expect(() => assertSameOrigin(new Request("http://127.0.0.1:4000/api/v1/services", {
      method: "POST",
      headers: { Origin: "http://127.0.0.1:3000", "Sec-Fetch-Site": "same-origin" },
    }), config.publicOrigin)).toThrow("UNTRUSTED_REQUEST_ORIGIN");
  });

  it.each([
    "https://attacker.example",
    "http://127.0.0.1.attacker.example:4000",
    "http://127.0.0.1:4000@attacker.example",
    "http://127.0.0.1:4000/path",
    "http://127.0.0.1:4000?origin=trusted",
    "http://127.0.0.1:4000#trusted",
    "http://0.0.0.0:4000",
  ])("rejects an unsafe local origin: %s", (publicOrigin) => {
    expect(() => getRuntimeConfig({
      APP_ENV: "local",
      ETAIL_PUBLIC_ORIGIN: publicOrigin,
      ENABLE_LOCAL_FIXTURE_IDENTITY: "true",
    })).toThrow();
  });

  it("rejects foreign and missing browser origins despite a forged host", () => {
    const config = getRuntimeConfig({ APP_ENV: "test", ETAIL_PUBLIC_ORIGIN: "http://127.0.0.1:4000" });
    for (const origin of ["https://attacker.example", "null", undefined]) {
      const headers = new Headers({ Host: "127.0.0.1:4000", "X-Forwarded-Host": "127.0.0.1:4000" });
      if (origin !== undefined) headers.set("Origin", origin);
      expect(() => assertSameOrigin(new Request("http://127.0.0.1:4000/api/v1/services", {
        method: "POST", headers,
      }), config.publicOrigin)).toThrow("UNTRUSTED_REQUEST_ORIGIN");
    }
  });
});
