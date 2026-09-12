import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { expect, test } from "@playwright/test";
import targets from "../../project-targets.json" with { type: "json" };
import { bindIdentity } from "../../src/modules/services/service";
import { SessionService } from "../../src/modules/identity/session";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { permissionGrants, serviceMembers, services } from "../../src/platform/database/schema";
import { merchantSetupEligibility } from "../../src/modules/services/schema";
import { cardDashboard, merchantDashboard } from "./helpers/fresh";

test.afterAll(closeDatabase);
test("a newly signed-in provider member gets a clear service choice without automatic enrollment", async ({ page }) => {
  // Isolated test setup only: no production user, upstream request or application auth bypass.
  const identity = await bindIdentity(`${targets.netlify.canonical_origin}/.netlify/identity`, randomUUID(), "New synthetic member");
  const sessions = new SessionService(sessionRepository, { appEnv: "test", publicOrigin: "http://127.0.0.1:3100" });
  const session = await sessions.issue(identity);
  const pair = session.cookie.split(";", 1)[0]!;
  await page.context().addCookies([{ name: pair.slice(0, pair.indexOf("=")), value: pair.slice(pair.indexOf("=") + 1), domain: "127.0.0.1", path: "/", httpOnly: true, sameSite: "Strict", expires: Math.floor(session.record.expiresAt.getTime() / 1000) }]);
  try {
    await page.goto("/services");
    await expect(page.getByRole("heading", { name: "Welcome to Etail Depot", exact: true })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Cardholder services", exact: true })).toBeChecked();
    await page.getByRole("radio", { name: "Merchant services", exact: true }).check();
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeEnabled();
    await page.getByRole("textbox", { name: "Your display name", exact: true }).fill("");
    await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeDisabled();
    await expect(page.locator("main")).not.toContainText("Your invitation inbox couldn’t load");
    await expect(page.getByRole("link", { name: "Open customer care", exact: true })).toHaveCount(0);
    await page.getByRole("navigation", { name: "Services", exact: true }).getByRole("link", { name: "Cardholder services", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Cards for you and your people", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your cardholder dashboard couldn’t load", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Set up my cards", exact: true })).toHaveCount(0);
    expect(await cardDashboard(page.request)).toMatchObject({ canCreatePrimary: false, cards: [], primaryService: null });
    await page.goto("/services");
    await page.getByRole("navigation", { name: "Services", exact: true }).getByRole("link", { name: "Merchant services", exact: true }).click();
    await expect(page.getByRole("heading", { name: "More ways to get paid", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Merchant services couldn’t load", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Create merchant", exact: true })).toHaveCount(0);
    expect(await merchantDashboard(page.request)).toMatchObject({ canCreateMerchant: false, units: [], moneyAccounts: [] });
    await page.reload();
    await expect(page.getByRole("heading", { name: "More ways to get paid", exact: true })).toBeVisible();
    expect(await getDb().select().from(services).where(eq(services.primaryPersonId, identity.personId))).toEqual([]);
    expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId, identity.personId))).toEqual([]);
    expect(await getDb().select().from(permissionGrants).where(eq(permissionGrants.personId, identity.personId))).toEqual([]);
    expect(await getDb().select().from(merchantSetupEligibility).where(eq(merchantSetupEligibility.personId, identity.personId))).toEqual([]);
  } finally {
    await sessions.logout(pair);
  }
});
