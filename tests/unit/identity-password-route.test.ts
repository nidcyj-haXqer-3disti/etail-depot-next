import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SecurityError } from "../../src/platform/security/origin";
const authentication = vi.hoisted(() => ({ passwordLogin: vi.fn(), registerWithPassword: vi.fn(), confirmEmailLink: vi.fn(), requestPasswordRecovery: vi.fn(), resetPasswordFromLink: vi.fn() }));
const { passwordLogin } = authentication;
vi.mock("../../src/modules/identity/password-login", () => authentication);
import { POST } from "../../src/app/api/v1/auth/login/route";
import { POST as register } from "../../src/app/api/v1/auth/register/route";
import { POST as confirm } from "../../src/app/api/v1/auth/confirm/route";
import { POST as recover } from "../../src/app/api/v1/auth/recover/route";
import { POST as reset } from "../../src/app/api/v1/auth/reset-password/route";

const origin = "http://127.0.0.1:3100";
function request(body: string, headers: Record<string, string> = {}) { return new Request(`${origin}/api/v1/auth/login`, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin, ...headers }, body }); }
beforeEach(() => { vi.stubEnv("APP_ENV", "local"); vi.stubEnv("ETAIL_PUBLIC_ORIGIN", origin); Object.values(authentication).forEach(mock => mock.mockReset()); });
afterEach(() => vi.unstubAllEnvs());
describe("email login HTTP boundary", () => {
  it("returns only authenticated state and the HttpOnly app cookie", async () => {
    const cookie = "etail_session=opaque-value; Path=/; HttpOnly; SameSite=Strict";
    passwordLogin.mockResolvedValue(cookie);
    const response = await POST(request(JSON.stringify({ email: "person@example.test", password: " short " }), { cookie: "previous-session" }));
    expect(response.status).toBe(200); expect(await response.json()).toEqual({ authenticated: true });
    expect(response.headers.get("set-cookie")).toBe(cookie); expect(response.headers.get("cache-control")).toContain("no-store");
    expect(passwordLogin).toHaveBeenCalledWith("person@example.test", " short ", "previous-session", expect.anything());
  });
  it("rejects foreign-origin credentials before calling the provider orchestration", async () => {
    const response = await POST(request(JSON.stringify({ email: "person@example.test", password: "password" }), { Origin: "https://foreign.example.test" }));
    expect(response.status).toBe(403); expect(passwordLogin).not.toHaveBeenCalled();
  });
  it.each([
    ["{", 422],
    [JSON.stringify({ email: "person@example.test", password: "", persona: "owner" }), 422],
    [JSON.stringify({ email: "person@example.test", password: "password", personId: "victim" }), 422],
    [" ".repeat(8193), 413],
  ])("rejects malformed, oversized or identity-selecting JSON %#", async (body, status) => {
    const response = await POST(request(body as string)); expect(response.status).toBe(status); expect(passwordLogin).not.toHaveBeenCalled();
  });
  it("keeps authentication failures generic with no cookie or credential echo", async () => {
    passwordLogin.mockRejectedValue(new SecurityError("INVALID_CREDENTIALS", 401));
    const response = await POST(request(JSON.stringify({ email: "person@example.test", password: "private-test-value" })));
    expect(response.status).toBe(401); expect(response.headers.has("set-cookie")).toBe(false);
    const body = await response.text(); expect(body).toContain("INVALID_CREDENTIALS"); expect(body).not.toMatch(/person@example|private-test-value/);
  });
});

describe("registration and email-link HTTP boundaries", () => {
  const routes = [
    { handler: register, body: { email: "person@example.test", password: "long test password" }, result: { registrationRequested: true } },
    { handler: confirm, body: { token: "private-confirmation-token" }, result: { confirmed: true } },
    { handler: recover, body: { email: "person@example.test" }, result: { recoveryRequested: true } },
    { handler: reset, body: { token: "private-recovery-token", password: "new long password" }, result: { passwordReset: true } },
  ];
  it.each(routes)("returns only the minimal result without automatic sign-in %#", async ({ handler, body, result }) => {
    const response = await handler(request(JSON.stringify(body)));
    expect(response.status).toBe(200); expect(await response.json()).toEqual(result); expect(response.headers.has("set-cookie")).toBe(false); expect(response.headers.get("cache-control")).toContain("no-store");
  });
  it.each(routes)("rejects foreign-origin email or token submissions before mutation %#", async ({ handler, body }) => {
    const response = await handler(request(JSON.stringify(body), { Origin: "https://foreign.example.test" }));
    expect(response.status).toBe(403); Object.values(authentication).forEach(mock => expect(mock).not.toHaveBeenCalled());
  });
  it.each(routes)("rejects injected identity and authority fields %#", async ({ handler, body }) => {
    const response = await handler(request(JSON.stringify({ ...body, persona: "owner", personId: "victim" })));
    expect(response.status).toBe(422); Object.values(authentication).forEach(mock => expect(mock).not.toHaveBeenCalled());
  });
});
