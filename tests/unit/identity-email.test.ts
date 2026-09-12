import { describe, expect, it, vi } from "vitest";
import { NetlifyIdentityAdapter } from "../../src/modules/identity/adapters/netlify";
import { holdEmailLink, parseEmailLink, takeEmailLink } from "../../src/ui/identity-email-link";
const origin = "https://new-owned-provider.example.test";
const endpoint = `${origin}/.netlify/identity`;
const user = { id: "provider-person", confirmed_at: "2026-09-10T00:00:00Z" };
const settings = () => Response.json({ external: { email: true }, disable_signup: false, autoconfirm: false });
function setup(responses: Response[]) {
  const fetcher = vi.fn<typeof fetch>(async () => { const next = responses.shift(); if (!next) throw new Error("No mock response"); return next; });
  const adapter = new NetlifyIdentityAdapter(() => ({ appEnv: "local", publicOrigin: "http://127.0.0.1:3100", providerOrigin: origin, identityEndpoint: endpoint, expectedSiteId: "new-owned-site", runtimeSiteId: null, localRemoteProvider: true }), fetcher, () => null);
  return { adapter, fetcher };
}
describe("first-time email lifecycle", () => {
  it("registers only with confirmation required and sends no browser-controlled roles or redirect", async () => {
    const { adapter, fetcher } = setup([settings(), Response.json({ id: user.id, confirmation_sent_at: "2026-09-10T00:00:00Z" })]);
    await expect(adapter.register("person@example.test", "long test password")).resolves.toBeUndefined();
    expect(fetcher.mock.calls[1]?.[0]).toBe(`${endpoint}/signup`);
    expect(JSON.parse(fetcher.mock.calls[1]?.[1]?.body as string)).toEqual({ email: "person@example.test", password: "long test password" });
    expect(fetcher.mock.calls[1]?.[1]?.headers).toEqual({ "Content-Type": "application/json", Referer: `${origin}/login` });
  });
  it.each([
    { external: { email: true }, disable_signup: false, autoconfirm: true },
    { external: { email: true }, disable_signup: true, autoconfirm: false },
    { external: { email: false }, disable_signup: false, autoconfirm: false },
  ])("refuses registration before outbound signup when confirmation is missing or signup/email disabled %#", async setting => {
    const { adapter, fetcher } = setup([Response.json(setting)]);
    await expect(adapter.register("person@example.test", "long test password")).rejects.toMatchObject({ code: "EMAIL_CONFIRMATION_REQUIRED", status: 503 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("does not call unexpected auto-confirmation a completed secure signup", async () => {
    const { adapter } = setup([settings(), Response.json({ ...user, access_token: "should-never-be-exposed" })]);
    await expect(adapter.register("person@example.test", "long test password")).rejects.toMatchObject({ code: "EMAIL_CONFIRMATION_REQUIRED" });
  });
  it("returns neutral completion for the recognized existing-login response without returning its content", async () => {
    const { adapter } = setup([settings(), Response.json({ code: 400, msg: "A user with this email address has already been registered" }, { status: 400 })]);
    await expect(adapter.register("person@example.test", "long test password")).resolves.toBeUndefined();
  });
  it("verifies confirmation token and /user, but returns no session, token or identity to the browser", async () => {
    const { adapter, fetcher } = setup([Response.json({ access_token: "private-token", refresh_token: "private-refresh" }), Response.json(user)]);
    expect(await adapter.confirmEmail("confirmation-test-token")).toBeUndefined();
    expect(JSON.parse(fetcher.mock.calls[0]?.[1]?.body as string)).toEqual({ type: "signup", token: "confirmation-test-token" });
    expect(fetcher.mock.calls[1]?.[0]).toBe(`${endpoint}/user`);
  });
  it("reports invalid and expired links without leaking provider diagnostics", async () => {
    const { adapter } = setup([new Response("private provider detail", { status: 404 })]);
    await expect(adapter.confirmEmail("spent-test-token")).rejects.toMatchObject({ code: "INVALID_EMAIL_LINK", status: 401 });
  });
  it("distinguishes an expired recovery link before reset revocation or password update begins", async () => {
    const { adapter, fetcher } = setup([new Response("private provider detail", { status: 404 })]);
    const begin = vi.fn(async () => undefined), complete = vi.fn(async () => undefined);
    await expect(adapter.resetPassword("expired-recovery-token", "new long password", begin, complete)).rejects.toMatchObject({ code: "INVALID_EMAIL_LINK", status: 401 });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetcher.mock.calls[0]?.[1]?.body as string)).toEqual({ type: "recovery", token: "expired-recovery-token" });
    expect(begin).not.toHaveBeenCalled(); expect(complete).not.toHaveBeenCalled();
  });
  it("requests recovery generically without exposing whether an email exists", async () => {
    const { adapter, fetcher } = setup([Response.json({})]);
    expect(await adapter.requestRecovery("person@example.test")).toBeUndefined();
    expect(fetcher.mock.calls[0]?.[0]).toBe(`${endpoint}/recover`);
  });
  it("verifies recovery identity, revokes existing app sessions before password update, and never exports provider credentials", async () => {
    const { adapter, fetcher } = setup([Response.json({ access_token: "private-token" }), Response.json(user), Response.json(user)]);
    const revoke = vi.fn(async identity => { expect(identity).toEqual({ issuer: endpoint, subject: user.id, providerConfirmed: true }); expect(fetcher).toHaveBeenCalledTimes(2); });
    const complete = vi.fn(async () => { expect(fetcher).toHaveBeenCalledTimes(3); });
    expect(await adapter.resetPassword("recovery-test-token", "new long password", revoke, complete)).toBeUndefined();
    expect(revoke).toHaveBeenCalledOnce();
    expect(complete).toHaveBeenCalledOnce();
    expect(JSON.parse(fetcher.mock.calls[0]?.[1]?.body as string)).toEqual({ type: "recovery", token: "recovery-test-token" });
    expect(fetcher.mock.calls[2]?.[1]).toMatchObject({ method: "PUT", headers: { Authorization: "Bearer private-token" } });
    expect(JSON.parse(fetcher.mock.calls[2]?.[1]?.body as string)).toEqual({ password: "new long password" });
  });
  it("does not change a provider password if app-session revocation cannot complete", async () => {
    const { adapter, fetcher } = setup([Response.json({ access_token: "private-token" }), Response.json(user)]);
    const complete = vi.fn(async () => undefined);
    await expect(adapter.resetPassword("recovery-test-token", "new long password", async () => { throw new Error("Cannot revoke"); }, complete)).rejects.toThrow("Cannot revoke");
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(complete).not.toHaveBeenCalled();
  });
  it.each([new Response(null, { status: 500 }), Response.json({ id: "different-user" })])("does not clear a reset barrier on a failed or ambiguous provider update %#", async response => {
    const { adapter } = setup([Response.json({ access_token: "private-token" }), Response.json(user), response]);
    const begin = vi.fn(async () => undefined), complete = vi.fn(async () => undefined);
    await expect(adapter.resetPassword("recovery-test-token", "new long password", begin, complete)).rejects.toThrow();
    expect(begin).toHaveBeenCalledOnce(); expect(complete).not.toHaveBeenCalled();
  });
  it("retains the barrier when an outbound password update loses its response", async () => {
    const { adapter } = setup([Response.json({ access_token: "private-token" }), Response.json(user)]);
    const begin = vi.fn(async () => undefined), complete = vi.fn(async () => undefined);
    await expect(adapter.resetPassword("recovery-test-token", "new long password", begin, complete)).rejects.toMatchObject({ code: "IDENTITY_UNAVAILABLE" });
    expect(begin).toHaveBeenCalledOnce(); expect(complete).not.toHaveBeenCalled();
  });
});
describe("email callback input", () => {
  it("accepts only the final owned-origin confirmation/recovery link or current fragment", () => {
    expect(parseEmailLink(`${origin}/#confirmation_token=test-token`, origin)).toEqual({ kind: "confirmation", token: "test-token" });
    expect(parseEmailLink(`${origin}/login#recovery_token=test-token`, origin)).toEqual({ kind: "recovery", token: "test-token" });
    expect(parseEmailLink("#confirmation_token=test-token", origin, true)).toEqual({ kind: "confirmation", token: "test-token" });
  });
  it.each([
    "https://foreign.example.test/#confirmation_token=test-token", `${origin}/other#confirmation_token=test-token`, `${origin}/?token=private#confirmation_token=test-token`,
    `${origin}/#confirmation_token=one&confirmation_token=two`, `${origin}/#recovery_token=one&confirmation_token=two`, `${origin}/#access_token=token`,
    `${origin}/#confirmation_token=`, `${origin}/#confirmation_token=bad%0Atoken`, `https://person:password@new-owned-provider.example.test/#confirmation_token=test-token`,
  ])("rejects unrelated, duplicate, malformed and token-in-query links %#", link => { expect(parseEmailLink(link, origin)).toBeNull(); });
  it("consumes a same-tab memory handoff only once", () => {
    holdEmailLink({ kind: "confirmation", token: "memory-test-token" });
    expect(takeEmailLink()).toEqual({ kind: "confirmation", token: "memory-test-token" }); expect(takeEmailLink()).toBeNull();
    holdEmailLink({ kind: "invalid" }); expect(takeEmailLink()).toEqual({ kind: "invalid" }); expect(takeEmailLink()).toBeNull();
  });
});
