import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

// Read-only release acceptance. Never creates an account or sends an email.
const targets = JSON.parse(await readFile(new URL("../project-targets.json", import.meta.url), "utf8"));
const origin = targets.netlify.canonical_origin;
assert.equal(targets.netlify.site_id, "cbbb6c24-9dbc-43a2-9234-e4357b5b5280");
assert.equal(origin, "https://etail-depot-next.netlify.app");
const browser = await chromium.launch();
let checkpoint = "provider settings availability";
try {
  const context = await browser.newContext({ serviceWorkers: "block" });
  await context.route("**/*", route => ["GET", "HEAD"].includes(route.request().method()) ? route.continue() : route.abort());
  const response = await context.request.get(`${origin}/.netlify/identity/settings`, { timeout: 20_000, maxRedirects: 0 });
  assert.equal(response.status(), 200, "The email provider settings must be available.");
  assert.equal(response.url(), `${origin}/.netlify/identity/settings`);
  const settings = await response.json();
  checkpoint = "email sign-in enabled";
  assert.equal(settings.external?.email, true, "Email sign-in must be enabled.");
  checkpoint = "registration open";
  assert.equal(settings.disable_signup, false, "Registration must be open.");
  checkpoint = "email confirmation required";
  assert.equal(settings.autoconfirm, false, "Email confirmation must be required; automatic confirmation disables application registration.");
  checkpoint = "enabled sign-in form";
  const page = await context.newPage();
  await page.goto(`${origin}/login`, { waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).origin, origin);
  assert.equal(new URL(page.url()).pathname, "/login");
  const login = page.getByRole("form", { name: "Sign in with email", exact: true });
  await login.waitFor();
  assert.equal(await login.getByRole("button", { name: "Sign in", exact: true }).isEnabled(), true, "Sign in must be usable.");
  checkpoint = "enabled registration form";
  await page.getByRole("button", { name: "Create a login", exact: true }).click();
  const registration = page.getByRole("form", { name: "Create your login", exact: true });
  await registration.waitFor();
  assert.equal(await registration.getByLabel("Email address", { exact: true }).isEnabled(), true, "Registration email input must be usable.");
  assert.equal(await registration.getByRole("button", { name: "Create login", exact: true }).isEnabled(), true, "Create login must be usable.");
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), siteId: targets.netlify.site_id, origin, emailEnabled: true, registrationOpen: true, confirmationRequired: true, signInControlsEnabled: true, registrationControlsEnabled: true, scope: "Read-only availability; does not verify mailbox delivery or a real password login." }));
} catch {
  // Never emit assertion diffs, provider response bodies or browser state.
  console.error(`Hosted email acceptance failed: ${checkpoint}.`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
