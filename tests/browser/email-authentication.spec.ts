import { createHash, randomUUID } from "node:crypto";
import pg from "pg";
import { expect, test, type Page, type Route } from "@playwright/test";
import { applicationOrigin, fixtureHeader, fixtureOrigin, isolatedDatabase, pinnedIdentityEndpoint, verifyEmailHarnessDatabase } from "../email-harness/guard";

// Deliberately synthetic credentials. No auth recordings, injected sessions or provider SDK stubs.
const password = "synthetic login password 42";
const newPassword = "synthetic changed password 84";
const invalidLoginMessage = "We could not verify your email and password. Check your details. If you just created your login, open the confirmation email first.";
const pool = new pg.Pool({ connectionString: isolatedDatabase, connectionTimeoutMillis: 5000 });
async function control<T>(path: string, data?: unknown): Promise<T> {
  const response = await fetch(`${fixtureOrigin}/control/${path}`, {
    method: data === undefined ? "GET" : "POST", headers: { "x-etail-email-fixture": fixtureHeader, "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data), redirect: "error", signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Isolated provider control failed.");
  return response.json();
}
type FixtureMember = { subject: string; confirmation: string; recovery: string; confirmed: boolean };
async function member(email: string) { return control<FixtureMember>("member", { email }); }
async function submit(page: Page, path: string, button: ReturnType<Page["getByRole"]>) {
  const response = page.waitForResponse(value => value.url() === `${applicationOrigin}/api/v1/auth/${path}` && value.request().method() === "POST");
  await button.click(); return response;
}
async function register(page: Page, email: string, credential = password) {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /^Continue as (primary user|secondary user|support operator)$/ })).toHaveCount(0);
  await expect(page.locator(".fixture-panel")).toHaveCount(0);
  await page.getByRole("button", { name: "Create a login", exact: true }).click();
  const form = page.getByRole("form", { name: "Create your login", exact: true });
  await form.getByLabel("Email address", { exact: true }).fill(email);
  await form.getByLabel("Password", { exact: true }).fill(credential);
  await form.getByLabel("Confirm password", { exact: true }).fill(credential);
  const response = await submit(page, "register", form.getByRole("button", { name: "Create login", exact: true }));
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ registrationRequested: true });
  expect(Boolean((await response.allHeaders())["set-cookie"])).toBe(false);
  const waiting = page.getByRole("form", { name: "Check your email", exact: true });
  await expect(waiting).toBeVisible();
  await expect(waiting.locator("input")).toHaveCount(0);
  await expect(waiting.getByRole("button", { name: "Confirm email", exact: true })).toHaveCount(0);
  await expect(waiting).toContainText("For a new login, open the confirmation email in your inbox or spam folder and follow its link.");
  return member(email);
}
async function confirm(page: Page, confirmation: string) {
  // Exercise the real default provider callback landing and single-use memory bridge.
  // The token is synthetic and immediately stripped; no URL/header/request recording is enabled.
  const priorCalls = (await control<{ calls: string[] }>("calls")).calls.filter(call => call === "POST /verify").length;
  await page.goto(`/#confirmation_token=${confirmation}`);
  await expect(page).toHaveURL(url => url.pathname === "/login" && url.hash === "");
  const form = page.getByRole("form", { name: "Confirm your email", exact: true });
  await expect(form.getByLabel("Confirmation link", { exact: true })).toHaveCount(0);
  expect((await control<{ calls: string[] }>("calls")).calls.filter(call => call === "POST /verify")).toHaveLength(priorCalls);
  const response = await submit(page, "confirm", form.getByRole("button", { name: "Confirm email", exact: true }));
  expect(response.status()).toBe(200); expect(await response.json()).toEqual({ confirmed: true });
  expect(Boolean((await response.allHeaders())["set-cookie"])).toBe(false);
  await expect(page.getByRole("form", { name: "Sign in with email", exact: true })).toBeVisible();
}
async function login(page: Page, email: string, credential: string) {
  const form = page.getByRole("form", { name: "Sign in with email", exact: true });
  await form.getByLabel("Email address", { exact: true }).fill(email);
  await form.getByLabel("Password", { exact: true }).fill(credential);
  return submit(page, "login", form.getByRole("button", { name: "Sign in", exact: true }));
}
async function authenticated(page: Page) {
  await expect(page).toHaveURL(`${applicationOrigin}/services`);
  await expect(page.getByRole("heading", { level: 1, name: "Welcome to Etail Depot", exact: true })).toBeVisible();
  expect((await page.request.get("/api/v1/services")).status()).toBe(200);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Welcome to Etail Depot", exact: true })).toBeVisible();
  expect((await page.request.get("/api/v1/auth/sessions")).status()).toBe(200);
  const cookies = (await page.context().cookies()).filter(cookie => cookie.name === "etail_session");
  expect(cookies.length).toBe(1);
  const cookie = cookies[0]!;
  expect(cookie.httpOnly).toBe(true); expect(cookie.sameSite).toBe("Strict"); expect(cookie.path).toBe("/");
  expect(/^[A-Za-z0-9_-]{43}$/.test(cookie.value)).toBe(true);
  expect(await page.evaluate(() => document.cookie.includes("etail_session"))).toBe(false);
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  return createHash("sha256").update(cookie.value).digest("hex");
}

test.beforeAll(verifyEmailHarnessDatabase);
test.beforeEach(async ({ page }) => {
  await control("reset", {});
  // The guard has verified the marked disposable DB. Keep other application records intact.
  await pool.query("DELETE FROM password_login_throttle");
  await page.route("**/*", async route => {
    if (new URL(route.request().url()).origin !== applicationOrigin) await route.abort("blockedbyclient");
    else await route.continue();
  });
});
test.afterAll(async () => { await pool.end(); });

test("registration, root confirmation callback and password sign-in persist a real session across reload", async ({ page }) => {
  const email = `email-e2e-${randomUUID()}@example.test`;
  const fixture = await register(page, email);
  expect((await pool.query("SELECT id FROM identity_bindings WHERE issuer=$1 AND subject=$2", [pinnedIdentityEndpoint(), fixture.subject])).rowCount).toBe(0);
  expect((await page.request.get("/api/v1/services")).status()).toBe(401);
  await confirm(page, fixture.confirmation);
  expect((await page.request.get("/api/v1/services")).status()).toBe(401);
  const response = await login(page, email, password);
  // Successful sign-in replaces the document, which may discard its response body.
  // Verify the received status/cookie and the actual persisted session below.
  expect(response.status()).toBe(200);
  expect(/^etail_session=[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; SameSite=Strict; Max-Age=28800$/.test((await response.allHeaders())["set-cookie"] ?? "")).toBe(true);
  const hash = await authenticated(page);
  const { rows } = await pool.query(`SELECT s."issuedAt", s."expiresAt", s."revokedAt", b.issuer, b.subject,
      (SELECT count(*)::int FROM service_members m WHERE m."personId"=s."personId") AS memberships
      FROM app_sessions s JOIN identity_bindings b ON b.id=s."identityId" WHERE s."tokenHash"=$1`, [hash]);
  expect(rows.length).toBe(1); expect(rows[0].subject).toBe(fixture.subject); expect(rows[0].issuer).toBe(pinnedIdentityEndpoint());
  expect(rows[0].issuedAt instanceof Date).toBe(true); expect(rows[0].expiresAt instanceof Date).toBe(true);
  expect(rows[0].revokedAt).toBeNull(); expect(rows[0].memberships).toBe(0);
  const { calls } = await control<{ calls: string[] }>("calls");
  expect(calls).toEqual(expect.arrayContaining(["POST /signup", "POST /verify", "POST /token", "GET /user"]));
});

test("unconfirmed and incorrect passwords receive actual route errors without creating a session", async ({ page }) => {
  const email = `email-e2e-${randomUUID()}@example.test`;
  const fixture = await register(page, email);
  await page.getByRole("button", { name: "Back to sign in", exact: true }).click();
  const unconfirmed = await login(page, email, password);
  expect(unconfirmed.status()).toBe(401); expect((await unconfirmed.json()).error.code).toBe("INVALID_CREDENTIALS");
  const alert = page.getByRole("main").getByRole("alert");
  await expect(alert).toHaveText(invalidLoginMessage);
  await expect(alert).toBeFocused();
  await expect(page.getByRole("form", { name: "Sign in with email", exact: true }).getByLabel("Password", { exact: true })).toHaveValue("");
  expect((await page.context().cookies()).some(cookie => cookie.name.includes("etail_session"))).toBe(false);
  await confirm(page, fixture.confirmation);
  const invalid = await login(page, email, "incorrect synthetic password");
  expect(invalid.status()).toBe(401); expect((await invalid.json()).error.code).toBe("INVALID_CREDENTIALS");
  // An incorrect password has identical guidance; the UI does not reveal account confirmation state.
  await expect(alert).toHaveText(invalidLoginMessage);
  await expect(alert).toBeFocused();
  expect((await page.request.get("/api/v1/services")).status()).toBe(401);
  expect((await pool.query("SELECT id FROM identity_bindings WHERE issuer=$1 AND subject=$2", [pinnedIdentityEndpoint(), fixture.subject])).rowCount).toBe(0);
});

test("confirmed duplicate registration gives neutral guidance and leaves the original password unchanged", async ({ page }) => {
  const email = `email-e2e-${randomUUID()}@example.test`;
  const fixture = await register(page, email);
  await confirm(page, fixture.confirmation);
  await register(page, email, newPassword);
  const notice = page.getByRole("main").getByRole("status").filter({ hasText: "Your request was received." });
  await expect(notice).toContainText("If you already have a login, use your existing password or reset it.");
  await expect(page.getByRole("button", { name: "Forgot your password?", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Request a new confirmation email", exact: true })).toHaveCount(0);
  expect((await page.context().cookies()).some(cookie => cookie.name.includes("etail_session"))).toBe(false);
  await page.getByRole("button", { name: "Back to sign in", exact: true }).click();
  expect((await login(page, email, newPassword)).status()).toBe(401);
  await expect(page.getByRole("main").getByRole("alert")).toHaveText(invalidLoginMessage);
  expect((await login(page, email, password)).status()).toBe(200);
  await authenticated(page);
  const { calls } = await control<{ calls: string[] }>("calls");
  expect(calls.filter(call => call === "POST /signup")).toHaveLength(2);
  expect(calls.filter(call => call === "POST /verify")).toHaveLength(1);
  expect(calls.filter(call => call === "POST /token")).toHaveLength(2);
});

test("an emailed confirmation overrides registration mode and preserves checkout return after a lost acknowledgement", async ({ page }) => {
  const email = `email-e2e-${randomUUID()}@example.test`;
  const fixture = await register(page, email);
  const destination = `/checkout/${randomUUID()}/card?review=${randomUUID()}`;
  const confirmationRoute = `${applicationOrigin}/api/v1/auth/confirm`;
  let requests = 0;
  await page.route(confirmationRoute, async route => {
    requests += 1;
    const response = await route.fetch();
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({confirmed:true});
    await route.abort("connectionfailed");
  });
  await page.goto(`/login?mode=register&next=${encodeURIComponent(destination)}#confirmation_token=${fixture.confirmation}`);
  const form = page.getByRole("form", {name:"Confirm your email",exact:true});
  await expect(form).toBeVisible();
  await expect(page).toHaveURL(url=>url.hash===""&&url.searchParams.get("next")===destination);
  await expect(form.locator("input")).toHaveCount(0);
  expect(requests).toBe(0);
  expect((await control<{calls:string[]}>("calls")).calls).not.toContain("POST /verify");
  await form.getByRole("button", {name:"Confirm email",exact:true}).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("We could not confirm the result. Try signing in with your email and password. If confirmation is still needed, open the link in your latest confirmation email again.");
  expect(requests).toBe(1);
  expect((await member(email)).confirmed).toBe(true);
  expect((await page.request.get("/api/v1/services")).status()).toBe(401);
  expect(await page.evaluate(()=>localStorage.length+sessionStorage.length)).toBe(0);
  await page.getByRole("button", {name:"Back to sign in",exact:true}).click();
  expect((await login(page,email,password)).status()).toBe(200);
  // This checks the authentication return destination only; no checkout or
  // payment fixture is created, and the unknown checkout stays unavailable.
  await expect(page).toHaveURL(`${applicationOrigin}${destination}`);
  expect((await page.request.get("/api/v1/auth/sessions")).status()).toBe(200);
  expect(requests).toBe(1);
  expect((await control<{calls:string[]}>("calls")).calls.filter(call=>call==="POST /verify")).toHaveLength(1);
});

test("confirmation-setting drift blocks signup at submit and clears after availability is checked", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Create a login", exact: true }).click();
  const form = page.getByRole("form", { name: "Create your login", exact: true });
  await form.getByLabel("Email address", { exact: true }).fill(`email-e2e-${randomUUID()}@example.test`);
  await form.getByLabel("Password", { exact: true }).fill(password);
  await form.getByLabel("Confirm password", { exact: true }).fill(password);
  // Change settings after the page was rendered: the server command must check again.
  await control("settings", { autoconfirm: true });
  const response = await submit(page, "register", form.getByRole("button", { name: "Create login", exact: true }));
  expect(response.status()).toBe(503); expect((await response.json()).error.code).toBe("EMAIL_CONFIRMATION_REQUIRED");
  await expect(page.getByRole("main").getByRole("alert")).toBeVisible();
  await expect(page.locator("#registration-readiness")).toHaveText("Creating a login is temporarily unavailable. If you already have a login, return to sign in.");
  await expect(form.getByRole("button", { name: "Create login", exact: true })).toBeDisabled();
  expect((await control<{ calls: string[] }>("calls")).calls).not.toContain("POST /signup");
  expect((await page.context().cookies()).some(cookie => cookie.name.includes("etail_session"))).toBe(false);
  await control("settings", { autoconfirm: false });
  await page.getByRole("button", { name: "Check availability", exact: true }).click();
  await expect(form.getByRole("button", { name: "Create login", exact: true })).toBeEnabled();
  expect((await control<{ calls: string[] }>("calls")).calls).not.toContain("POST /signup");
  await expect(form.getByLabel("Password", { exact: true })).toHaveValue("");
  await form.getByLabel("Password", { exact: true }).fill(password);
  await form.getByLabel("Confirm password", { exact: true }).fill(password);
  expect((await submit(page, "register", form.getByRole("button", { name: "Create login", exact: true }))).status()).toBe(200);
  await expect(page.getByRole("form", { name: "Check your email", exact: true })).toBeVisible();
  expect((await control<{ calls: string[] }>("calls")).calls.filter(call => call === "POST /signup")).toHaveLength(1);
});

test("UI edge case: an intercepted signup response cannot double-submit or resend after a timeout", async ({ page }) => {
  const email = `email-e2e-${randomUUID()}@example.test`;
  await page.goto("/login?mode=register");
  const form = page.getByRole("form", { name: "Create your login", exact: true });
  await form.getByLabel("Email address", { exact: true }).fill(email);
  await form.getByLabel("Password", { exact: true }).fill(password);
  await form.getByLabel("Confirm password", { exact: true }).fill(password);
  await page.clock.install();
  let requests = 0;
  let received!: (status: number) => void;
  const receivedResponse = new Promise<number>(resolve => { received = resolve; });
  let release!: () => void;
  const heldResponse = new Promise<void>(resolve => { release = resolve; });
  const registrationRoute = `${applicationOrigin}/api/v1/auth/register`;
  const intercept = async (route: Route) => {
    requests += 1;
    // Transport interception only for this UI edge case: the real route and provider
    // execute once, but its response is withheld to simulate a lost acknowledgement.
    const response = await route.fetch();
    received(response.status());
    await heldResponse;
    await route.abort("failed").catch(() => { /* The client's timeout may already have aborted it. */ });
  };
  await page.route(registrationRoute, intercept);
  try {
    await form.evaluate(element => {
      // Deliberately dispatch both handlers in one turn. Native validation on a
      // second click could otherwise hide a missing synchronous submission guard.
      element.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      element.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(await receivedResponse).toBe(200);
    expect(requests).toBe(1);
    await expect(form.getByRole("button", { name: "Please wait…", exact: true })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Back to sign in", exact: true })).toBeDisabled();
    await page.getByRole("banner").getByRole("link", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL(url => url.pathname === "/login" && url.search === "");
    await expect(form).toBeVisible();
    await expect(form.getByRole("button", { name: "Please wait…", exact: true })).toBeDisabled();
    await expect(page.getByRole("form", { name: "Sign in with email", exact: true })).toHaveCount(0);
    expect((await control<{ calls: string[] }>("calls")).calls.filter(call => call === "POST /signup")).toHaveLength(1);
    await page.clock.fastForward(30_001);
    const alert = page.getByRole("main").getByRole("alert");
    await expect(alert).toContainText("This is taking longer than expected.");
    await expect(alert).toContainText("Check your inbox and spam folder before trying again.");
    await expect(alert).toBeFocused();
    await expect(form.getByRole("button", { name: "Create login", exact: true })).toBeEnabled();
    await expect(form.getByLabel("Password", { exact: true })).toHaveValue("");
    await expect(form.getByLabel("Confirm password", { exact: true })).toHaveValue("");
    await page.clock.fastForward(60_000);
    expect(requests).toBe(1);
    expect((await control<{ calls: string[] }>("calls")).calls.filter(call => call === "POST /signup")).toHaveLength(1);
    expect((await member(email)).confirmed).toBe(false);
    expect((await page.context().cookies()).some(cookie => cookie.name.includes("etail_session"))).toBe(false);
  } finally {
    release();
    await page.unroute(registrationRoute, intercept);
  }
});

test("recovery callback changes the password, revokes the prior session and permits a fresh sign-in", async ({ page, playwright }) => {
  const email = `email-e2e-${randomUUID()}@example.test`;
  const fixture = await register(page, email); await confirm(page, fixture.confirmation);
  expect((await login(page, email, password)).status()).toBe(200);
  await authenticated(page);
  const oldSession = (await page.context().cookies()).find(cookie => cookie.name === "etail_session")!;
  const previous = await playwright.request.newContext({ baseURL: applicationOrigin, extraHTTPHeaders: { Cookie: `${oldSession.name}=${oldSession.value}` } });
  try {
    await page.goto("/login");
    await page.getByRole("button", { name: "Forgot your password?", exact: true }).click();
    const recover = page.getByRole("form", { name: "Reset your password", exact: true });
    await recover.getByLabel("Email address", { exact: true }).fill(email);
    const requested = await submit(page, "recover", recover.getByRole("button", { name: "Send reset email", exact: true }));
    expect(requested.status()).toBe(200);
    const waiting = page.getByRole("form", { name: "Check your email", exact: true });
    await expect(waiting).toBeVisible();
    await expect(waiting.locator("input")).toHaveCount(0);
    await expect(waiting.getByRole("button", { name: "Save new password", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Request a new reset email", exact: true })).toBeVisible();
    await expect(page.getByRole("main").getByRole("status")).toHaveText("If this email has a login, a reset email has been requested.");
    const recovery = (await member(email)).recovery;
    await page.goto(`/#recovery_token=${recovery}`);
    await expect(page).toHaveURL(url => url.pathname === "/login" && url.hash === "");
    const reset = page.getByRole("form", { name: "Choose a new password", exact: true });
    await reset.getByLabel("New password", { exact: true }).fill(newPassword);
    await reset.getByLabel("Confirm password", { exact: true }).fill(newPassword);
    const changed = await submit(page, "reset-password", reset.getByRole("button", { name: "Save new password", exact: true }));
    expect(changed.status()).toBe(200); expect(await changed.json()).toEqual({ passwordReset: true });
    expect((await previous.get("/api/v1/services")).status()).toBe(401);
    await expect(page.getByRole("form", { name: "Sign in with email", exact: true })).toBeVisible();
    expect((await login(page, email, password)).status()).toBe(401);
    expect((await login(page, email, newPassword)).status()).toBe(200);
    await authenticated(page);
    const { rows } = await pool.query(`SELECT r.state FROM identity_password_resets r
      JOIN identity_bindings b ON b.id=r."identityId" WHERE b.issuer=$1 AND b.subject=$2`, [pinnedIdentityEndpoint(), fixture.subject]);
    expect(rows.map(row => row.state)).toEqual(["COMPLETE"]);
    expect((await control<{ calls: string[] }>("calls")).calls).toContain("PUT /user");
  } finally { await previous.dispose(); }
});

test("reset guidance separates an expired link from an unresolved password change", async ({ page }) => {
  // UI transport cases only. No reset request is forwarded to the application or provider.
  const cases = [
    { code: "IDENTITY_UNAVAILABLE", status: 503, lost: false, message: "We could not confirm the password change. Contact the site owner to review it before trying to sign in or requesting another reset email." },
    { code: "LOST_RESPONSE", status: 0, lost: true, message: "We could not confirm the password change. Contact the site owner to review it before trying to sign in or requesting another reset email." },
    { code: "INVALID_EMAIL_LINK", status: 401, lost: false, message: "This reset link is invalid or has expired. Request a new reset email and open its link to choose your password." },
    { code: "PASSWORD_RESET_PENDING", status: 409, lost: false, message: "Your password change needs review before you can sign in. Contact the site owner. A new reset email cannot clear this block." },
  ];
  const resetRoute = `${applicationOrigin}/api/v1/auth/reset-password`;
  for (const scenario of cases) {
    let requests = 0;
    const intercept = async (route: Route) => {
      requests += 1;
      if (scenario.lost) await route.abort("failed");
      else await route.fulfill({ status: scenario.status, contentType: "application/json", body: JSON.stringify({ error: { code: scenario.code, requestId: "synthetic-reset-guidance" } }) });
    };
    await page.route(resetRoute, intercept);
    try {
      await page.goto("/login#recovery_token=synthetic-unredeemed-link");
      const form = page.getByRole("form", { name: "Choose a new password", exact: true });
      await expect(form).toBeVisible();
      await expect(page).toHaveURL(url => url.pathname === "/login" && url.hash === "");
      await form.getByLabel("New password", { exact: true }).fill(newPassword);
      await form.getByLabel("Confirm password", { exact: true }).fill(newPassword);
      await form.getByRole("button", { name: "Save new password", exact: true }).click();
      const alert = page.getByRole("main").getByRole("alert");
      await expect(alert).toHaveText(scenario.message);
      await expect(alert).toBeFocused();
      await expect(form.getByLabel("New password", { exact: true })).toHaveValue("");
      await expect(form.getByLabel("Confirm password", { exact: true })).toHaveValue("");
      expect(requests).toBe(1);
      if (scenario.code === "INVALID_EMAIL_LINK") {
        await page.getByRole("button", { name: "Request a new reset email", exact: true }).click();
        await expect(page.getByRole("form", { name: "Reset your password", exact: true })).toBeVisible();
      }
    } finally { await page.unroute(resetRoute, intercept); }
  }
  expect((await control<{ calls: string[] }>("calls")).calls.every(call => call.startsWith("GET "))).toBe(true);
  expect((await page.context().cookies()).some(cookie => cookie.name.includes("etail_session"))).toBe(false);
});

test("email callbacks remain private across a pending request and a refreshed login page", async ({ page }) => {
  // Run this same browser journey against both the production build and the
  // guarded dev server, where React replays effects under Strict Mode.
  const resetRoute = `${applicationOrigin}/api/v1/auth/reset-password`;
  const requestedTokens: string[] = [];
  let releaseFirst!: () => void;
  const pendingResponse = new Promise<void>(resolve => { releaseFirst = resolve; });
  const intercept = async (route: Route) => {
    requestedTokens.push(route.request().postDataJSON().token);
    if (requestedTokens.length === 1) await pendingResponse;
    await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: { code: "IDENTITY_UNAVAILABLE", requestId: "synthetic-callback-review" } }) });
  };
  await page.route(resetRoute, intercept);
  try {
    await page.goto("/login#recovery_token=synthetic-original-link");
    const form = page.getByRole("form", { name: "Choose a new password", exact: true });
    const cleanLogin = (url: URL) => url.pathname === "/login" && url.hash === "";
    await expect(form).toBeVisible();
    await expect(form.getByLabel("Password reset link", { exact: true })).toHaveCount(0);
    await expect(page).toHaveURL(cleanLogin);
    await form.getByLabel("New password", { exact: true }).fill(newPassword);
    await form.getByLabel("Confirm password", { exact: true }).fill(newPassword);
    await form.getByRole("button", { name: "Save new password", exact: true }).click();
    await expect.poll(() => requestedTokens.length).toBe(1);

    // A second callback must be scrubbed, but cannot replace a request already
    // being processed or submit anything automatically.
    await page.goto("/login#recovery_token=synthetic-next-link");
    await expect(page).toHaveURL(cleanLogin);
    await expect(page.getByRole("main").getByRole("alert")).toHaveText("Wait for your current request to finish, then open the email link again.");
    expect(requestedTokens).toEqual(["synthetic-original-link"]);
    releaseFirst();
    await expect(form.getByRole("button", { name: "Save new password", exact: true })).toBeEnabled();

    // Readiness refresh must not restore the consumed fragment. Reopening the
    // second email then supplies that exact new link only after an explicit save.
    await page.getByRole("button", { name: "Check availability", exact: true }).click();
    await expect(page.getByRole("button", { name: "Check availability", exact: true })).toBeEnabled();
    await expect(page).toHaveURL(cleanLogin);
    await page.goto("/login#recovery_token=synthetic-next-link");
    await expect(page).toHaveURL(cleanLogin);
    await expect(page.getByText("Your email link is ready. Continue below.", { exact: true })).toBeVisible();
    await form.getByLabel("New password", { exact: true }).fill(newPassword);
    await form.getByLabel("Confirm password", { exact: true }).fill(newPassword);
    await form.getByRole("button", { name: "Save new password", exact: true }).click();
    await expect.poll(() => requestedTokens.length).toBe(2);
    await expect(form.getByRole("button", { name: "Save new password", exact: true })).toBeEnabled();
    await expect(page.getByRole("main").getByRole("alert")).toHaveText("We could not confirm the password change. Contact the site owner to review it before trying to sign in or requesting another reset email.");
    expect(requestedTokens).toEqual(["synthetic-original-link", "synthetic-next-link"]);
    await expect(page).toHaveURL(cleanLogin);
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
    expect((await page.context().cookies()).some(cookie => cookie.name.includes("etail_session"))).toBe(false);
    expect((await control<{ calls: string[] }>("calls")).calls.every(call => call.startsWith("GET "))).toBe(true);
  } finally {
    releaseFirst();
    await page.unroute(resetRoute, intercept);
  }
});

test("sign-out revokes the actual email session, protects both services and permits a fresh sign-in", async ({ page, playwright }) => {
  const email = `email-e2e-${randomUUID()}@example.test`;
  const fixture = await register(page, email); await confirm(page, fixture.confirmation);
  expect((await login(page, email, password)).status()).toBe(200);
  const oldHash = await authenticated(page);
  const oldSession = (await page.context().cookies()).find(cookie => cookie.name === "etail_session")!;
  const previous = await playwright.request.newContext({ baseURL: applicationOrigin, extraHTTPHeaders: { Cookie: `${oldSession.name}=${oldSession.value}` } });
  try {
    const response = await submit(page, "logout", page.getByRole("button", { name: "Sign out", exact: true }));
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(`${applicationOrigin}/login`);
    await expect(page.getByRole("form", { name: "Sign in with email", exact: true })).toBeVisible();
    expect((await page.context().cookies()).some(cookie => cookie.name.includes("etail_session"))).toBe(false);
    for (const route of ["/api/v1/services", "/api/v1/cardholder-services", "/api/v1/merchants/dashboard", "/api/v1/auth/sessions"]) {
      expect((await page.request.get(route)).status()).toBe(401);
      expect((await previous.get(route)).status()).toBe(401);
    }
    for (const route of ["/services", "/cardholder-services", "/merchant-services"]) {
      await page.goto(route); await expect(page).toHaveURL(`${applicationOrigin}/login`);
      await expect(page.getByRole("form", { name: "Sign in with email", exact: true })).toBeVisible();
    }
    const { rows } = await pool.query('SELECT "revokedAt" FROM app_sessions WHERE "tokenHash"=$1', [oldHash]);
    expect(rows).toHaveLength(1); expect(rows[0].revokedAt instanceof Date).toBe(true);
    expect((await login(page, email, password)).status()).toBe(200);
    const newHash = await authenticated(page); expect(newHash).not.toBe(oldHash);
    expect((await previous.get("/api/v1/services")).status()).toBe(401);
  } finally { await previous.dispose(); }
});

test("an expired application session protects both services and password sign-in restores a fresh session", async ({ page, playwright }) => {
  const email = `email-e2e-${randomUUID()}@example.test`;
  const fixture = await register(page, email); await confirm(page, fixture.confirmation);
  expect((await login(page, email, password)).status()).toBe(200);
  const oldHash = await authenticated(page);
  const oldSession = (await page.context().cookies()).find(cookie => cookie.name === "etail_session")!;
  const previous = await playwright.request.newContext({ baseURL: applicationOrigin, extraHTTPHeaders: { Cookie: `${oldSession.name}=${oldSession.value}` } });
  try {
    // Expire only this test-created session in the verified disposable database.
    // The browser still sends its original cookie, so the server must enforce expiry.
    const expired = await pool.query(`UPDATE app_sessions s
      SET "issuedAt"=clock_timestamp()-interval '2 minutes', "expiresAt"=clock_timestamp()-interval '1 second'
      FROM identity_bindings b
      WHERE s."identityId"=b.id AND s."tokenHash"=$1 AND b.issuer=$2 AND b.subject=$3
      RETURNING s."expiresAt", s."revokedAt"`, [oldHash, pinnedIdentityEndpoint(), fixture.subject]);
    expect(expired.rowCount).toBe(1);
    expect(expired.rows[0].expiresAt instanceof Date).toBe(true);
    expect(expired.rows[0].revokedAt).toBeNull();
    for (const route of ["/api/v1/services", "/api/v1/cardholder-services", "/api/v1/merchants/dashboard", "/api/v1/auth/sessions"]) {
      expect((await page.request.get(route)).status()).toBe(401);
      expect((await previous.get(route)).status()).toBe(401);
    }
    for (const route of ["/services", "/cardholder-services", "/merchant-services"]) {
      await page.goto(route); await expect(page).toHaveURL(`${applicationOrigin}/login`);
      await expect(page.getByRole("form", { name: "Sign in with email", exact: true })).toBeVisible();
    }
    expect((await login(page, email, password)).status()).toBe(200);
    const newHash = await authenticated(page); expect(newHash).not.toBe(oldHash);
    for (const route of ["/api/v1/cardholder-services", "/api/v1/merchants/dashboard"]) {
      expect((await page.request.get(route)).status()).toBe(200);
      expect((await previous.get(route)).status()).toBe(401);
    }
    const { rows } = await pool.query('SELECT "expiresAt">clock_timestamp() AS active, "revokedAt" FROM app_sessions WHERE "tokenHash"=$1', [newHash]);
    expect(rows).toHaveLength(1); expect(rows[0].active).toBe(true); expect(rows[0].revokedAt).toBeNull();
  } finally { await previous.dispose(); }
});

test("a stalled sign-out acknowledgement times out without duplicate requests and safely retries the already revoked session", async ({ page }) => {
  const email = `email-e2e-${randomUUID()}@example.test`;
  const fixture = await register(page, email); await confirm(page, fixture.confirmation);
  expect((await login(page, email, password)).status()).toBe(200);
  const sessionHash = await authenticated(page);
  await page.clock.install();
  let requests = 0;
  let committed!: () => void;
  const saved = new Promise<void>(resolve => { committed = resolve; });
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  const logoutRoute = `${applicationOrigin}/api/v1/auth/logout`;
  const intercept = async (route: Route) => {
    requests += 1;
    const response = await route.fetch(); expect(response.status()).toBe(200);
    if (requests === 1) {
      expect(await response.json()).toEqual({ signedOut: true }); committed();
      await held; await route.abort("failed").catch(() => { /* The bounded client may already have aborted this acknowledgement. */ });
    } else await route.fulfill({ response });
  };
  await page.route(logoutRoute, intercept);
  try {
    await page.getByRole("button", { name: "Sign out", exact: true }).evaluate(button => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
    await saved;
    expect(requests).toBe(1);
    await expect(page.getByRole("button", { name: "Signing out…", exact: true })).toBeDisabled();
    const { rows } = await pool.query('SELECT "revokedAt" FROM app_sessions WHERE "tokenHash"=$1', [sessionHash]);
    expect(rows).toHaveLength(1); expect(rows[0].revokedAt instanceof Date).toBe(true);
    expect((await page.request.get("/api/v1/services")).status()).toBe(401);
    await page.clock.fastForward(30_001);
    await expect(page.locator(".logout-control").getByRole("alert")).toHaveText("Sign-out is taking longer than expected. We could not confirm it. Please try Sign out again.");
    await expect(page.getByRole("button", { name: "Sign out", exact: true })).toBeEnabled();
    await expect(page).toHaveURL(`${applicationOrigin}/services`);
    await page.clock.fastForward(60_000); expect(requests).toBe(1);
    release();
    const response = await submit(page, "logout", page.getByRole("button", { name: "Sign out", exact: true }));
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(`${applicationOrigin}/login`);
    expect(requests).toBe(2);
    expect((await page.context().cookies()).some(cookie => cookie.name.includes("etail_session"))).toBe(false);
    expect((await page.request.get("/api/v1/cardholder-services")).status()).toBe(401);
    expect((await page.request.get("/api/v1/merchants/dashboard")).status()).toBe(401);
  } finally { release(); await page.unroute(logoutRoute, intercept); }
});

test("malformed or rejected sign-out responses keep the current page until an actual acknowledgement", async ({ page }) => {
  const email = `email-e2e-${randomUUID()}@example.test`;
  const fixture = await register(page, email); await confirm(page, fixture.confirmation);
  expect((await login(page, email, password)).status()).toBe(200);
  await authenticated(page);
  const logoutRoute = `${applicationOrigin}/api/v1/auth/logout`;
  const responses = [
    { status: 200, contentType: "application/json", body: "{" },
    { status: 200, contentType: "application/json", body: JSON.stringify({ signedOut: false }) },
    { status: 200, contentType: "application/json", body: JSON.stringify({ authenticated: true }) },
    { status: 401, contentType: "application/json", body: JSON.stringify({ error: { code: "AUTHENTICATION_REQUIRED" } }) },
  ];
  let requests = 0;
  const intercept = async (route: Route) => {
    const synthetic = responses[requests++];
    // These transport failures never reach the server; only the final explicit retry logs out.
    if (synthetic) await route.fulfill(synthetic);
    else await route.continue();
  };
  await page.route(logoutRoute, intercept);
  try {
    for (let index = 0; index < responses.length; index++) {
      await page.getByRole("button", { name: "Sign out", exact: true }).click();
      await expect.poll(() => requests).toBe(index + 1);
      await expect(page.locator(".logout-control").getByRole("alert")).toHaveText("We could not confirm sign-out. Please try Sign out again.");
      await expect(page).toHaveURL(`${applicationOrigin}/services`);
      await expect(page.getByRole("button", { name: "Sign out", exact: true })).toBeEnabled();
      expect((await page.request.get("/api/v1/services")).status()).toBe(200);
    }
    const response = await submit(page, "logout", page.getByRole("button", { name: "Sign out", exact: true }));
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(`${applicationOrigin}/login`);
    expect(requests).toBe(responses.length + 1);
    expect((await page.request.get("/api/v1/services")).status()).toBe(401);
  } finally { await page.unroute(logoutRoute, intercept); }
});
