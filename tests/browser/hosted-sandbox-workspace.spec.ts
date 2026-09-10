import { randomUUID } from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import targets from "../../project-targets.json" with { type: "json" };
import { bindIdentity } from "../../src/modules/services/service";
import { startSandbox } from "../../src/modules/sandbox/service";
import { SessionService } from "../../src/modules/identity/session";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { closeDatabase } from "../../src/platform/database/client";
import { cardDashboard, merchantDashboard } from "./helpers/fresh";
import { paymentChannelSchema } from "../../src/modules/acquiring/api-contracts";
import { merchantTestPaymentProjectionSchema, merchantTestPayoutProjectionSchema } from "../../src/modules/acquiring/operations-api-contracts";

test.afterAll(closeDatabase);

async function syntheticSession(page: Page) {
  // Synthetic identity/session setup in the isolated test DB only. Every service,
  // permission and financial effect below comes from the actual application UI.
  const identity = await bindIdentity(`${targets.netlify.canonical_origin}/.netlify/identity`, randomUUID());
  const sessions = new SessionService(sessionRepository, { appEnv: "test", publicOrigin: "http://127.0.0.1:3100" });
  const session = await sessions.issue(identity), pair = session.cookie.split(";", 1)[0]!;
  await page.context().addCookies([{ name: pair.slice(0, pair.indexOf("=")), value: pair.slice(pair.indexOf("=") + 1), domain: "127.0.0.1", path: "/", httpOnly: true, sameSite: "Strict", expires: Math.floor(session.record.expiresAt.getTime() / 1000) }]);
  return { personId: identity.personId, close: () => sessions.logout(pair) };
}

async function join(page: Page, name: string) {
  await page.getByRole("textbox", { name: "Your display name", exact: true }).fill(name);
  await page.getByRole("checkbox", { name: "I understand this is a sandbox. Cards, balances, payments and verification are simulated. No real money moves.", exact: true }).check();
  await page.getByRole("button", { name: "Start sandbox", exact: true }).click();
  await expect(page.getByRole("complementary", { name: "Your sandbox member code", exact: true })).toBeVisible();
}

async function accessible(page: Page) {
  expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}

async function addCard(page: Page, name: string, holderName: string) {
  await page.getByRole("link", { name: "Add card", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Start card request", exact: true }).click();
  await dialog.getByRole("radio", { name: new RegExp(holderName) }).check();
  await dialog.getByRole("button", { name: "Continue", exact: true }).click();
  await dialog.getByRole("textbox", { name: "Card name", exact: true }).fill(name);
  await dialog.getByRole("textbox", { name: "Starting balance (USD)", exact: true }).fill("25.00");
  await dialog.getByRole("button", { name: "Save & review", exact: true }).click();
  await expect(dialog).toContainText("$25.00");
  await dialog.getByRole("button", { name: "Create card", exact: true }).click();
  await expect(dialog).toContainText("Your card is ready");
  await dialog.getByRole("link", { name: /Open card/ }).click();
  await expect(page.getByRole("dialog")).toContainText(name);
  const card = (await cardDashboard(page.request)).cards.find(item => item.nickname === name)!;
  expect(card.available.minor).toBe("2500");
  return card;
}

async function acceptOnlyInvitation(page: Page) {
  await page.goto("/services");
  await page.getByRole("button", { name: "Review invitation", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Accept this access", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("main")).toContainText("You accepted access to");
}

test("email member starts a sandbox and uses cards, support, reports and a named secondary invitation", async ({ page, browser }) => {
  test.setTimeout(180_000);
  const identity = await syntheticSession(page);
  const secondaryContext = await browser.newContext({ baseURL: "http://127.0.0.1:3100", viewport: page.viewportSize() });
  const secondaryPage = await secondaryContext.newPage(), secondary = await syntheticSession(secondaryPage);
  const name = `Sandbox primary ${randomUUID().slice(0, 8)}`, secondName = `Sandbox secondary ${randomUUID().slice(0, 8)}`;
  try {
    await page.goto("/services");
    await expect(page.getByRole("heading", { name: "Try the whole journey.", exact: true })).toBeVisible();
    await accessible(page);
    await join(page, name);
    await expect(page.getByRole("link", { name: "Open customer care", exact: true })).toHaveCount(0);
    await page.getByRole("link", { name: /YOUR CARDS & SPENDING Cardholder services/ }).click();
    await page.getByRole("button", { name: "Set up cardholder services", exact: true }).click();
    await expect(page.getByRole("link", { name: "Add card", exact: true })).toBeVisible();
    const card = await addCard(page, "My hosted practice card", name);
    const dialog = page.getByRole("dialog"), purchase = dialog.getByRole("region", { name: "Card purchase", exact: true });
    await purchase.getByRole("textbox", { name: "Purchase description", exact: true }).fill("Sandbox groceries");
    await purchase.getByRole("textbox", { name: "Purchase amount (USD)", exact: true }).fill("5.25");
    await purchase.getByRole("button", { name: "Make purchase", exact: true }).click();
    await expect(purchase).toContainText("$5.25 purchase recorded");
    await expect(purchase).toContainText("$19.75");
    for (const action of ["Freeze", "Unfreeze"] as const) {
      await dialog.getByRole("button", { name: action, exact: true }).click();
      await dialog.getByRole("button", { name: `${action} card`, exact: true }).click();
      await expect(dialog.getByRole("button", { name: action === "Freeze" ? "Unfreeze" : "Freeze", exact: true })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await page.goto(`/cardholder-services?focus=${card.id}`);
    await expect(page.getByRole("region", { name: "Selected card overview", exact: true })).toContainText("$19.75");
    await accessible(page);
    await page.getByRole("link", { name: /Statements & reports/ }).click();
    await expect(page.locator("main")).toContainText("Sandbox groceries");
    const downloading = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download CSV", exact: true }).click();
    expect((await downloading).suggestedFilename()).toMatch(/^etail-card-activity-/);
    await page.goto(`/cardholder-services?focus=${card.id}`);
    await page.getByRole("link", { name: /Notification preferences/ }).click();
    await page.getByRole("checkbox").first().uncheck();
    await page.getByRole("button", { name: "Save preferences", exact: true }).click();
    await expect(page.locator("main")).toContainText("Notification preferences saved");
    await page.reload();
    await expect(page.getByRole("checkbox").first()).not.toBeChecked();
    await page.goto(`/cardholder-services?focus=${card.id}`);
    await page.getByRole("link", { name: /Help & support/ }).click();
    await page.getByRole("button", { name: "Start a case", exact: true }).click();
    await page.getByRole("textbox", { name: "Subject", exact: true }).fill("My hosted card question");
    await page.getByRole("textbox", { name: "Your explanation", exact: true }).fill("Please explain my sandbox purchase controls.");
    await page.getByRole("button", { name: "Review case", exact: true }).click();
    await page.getByRole("button", { name: "Create case", exact: true }).click();
    await expect(page.getByRole("heading", { name: "My hosted card question", exact: true })).toBeVisible();

    const joined = await startSandbox(secondary.personId, { commandId: randomUUID(), displayName: secondName, acknowledged: true });
    const data = await cardDashboard(page.request), serviceId = data.primaryService!.id;
    await page.goto(`/cardholder-services?manage=${serviceId}`);
    await page.getByRole("button", { name: "Invite a person", exact: true }).click();
    const invite = page.getByRole("dialog", { name: "Invite a person", exact: true });
    await invite.getByRole("textbox", { name: "Member code", exact: true }).fill(joined.memberCode!);
    await invite.getByRole("button", { name: "Find member", exact: true }).click();
    await expect(invite).toContainText(`Selected: ${secondName}`);
    for (const label of ["View cards", "Be selected as a cardholder", "Make purchases", "View activity"]) await invite.getByRole("checkbox", { name: new RegExp(`^${label}`) }).check();
    await invite.getByRole("button", { name: "Review access", exact: true }).click();
    await page.getByRole("dialog", { name: "Review cardholder access", exact: true }).getByRole("button", { name: "Save invitation", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await acceptOnlyInvitation(secondaryPage);
    await page.goto(`/cardholder-services?focus=${card.id}`);
    const secondaryCard = await addCard(page, "Invited hosted card", secondName);
    await secondaryPage.goto(`/cardholder-services?focus=${secondaryCard.id}`);
    await expect(secondaryPage.getByRole("region", { name: "Selected card overview", exact: true })).toContainText("Invited hosted card");
    expect((await cardDashboard(secondaryPage.request)).cards.map(row => row.id)).toEqual([secondaryCard.id]);
    expect((await merchantDashboard(secondaryPage.request)).units).toEqual([]);
    await secondaryPage.goto(`/cardholder-services?focus=${card.id}`);
    await expect(secondaryPage.getByRole("heading", { name: "This card is unavailable", exact: true })).toBeVisible();
    expect((await merchantDashboard(page.request)).units).toEqual([]);
  } finally { await identity.close(); await secondary.close(); await secondaryContext.close(); }
});

test("email merchant starts from empty setup and completes a channel, receipt, refund, transfer and scoped invitation", async ({ page, browser }) => {
  test.setTimeout(180_000);
  const identity = await syntheticSession(page);
  const colleagueContext = await browser.newContext({ baseURL: "http://127.0.0.1:3100", viewport: page.viewportSize() });
  const colleaguePage = await colleagueContext.newPage(), colleague = await syntheticSession(colleaguePage);
  const name = `Hosted sample shop ${randomUUID().slice(0, 8)}`, colleagueName = "Hosted merchant colleague";
  try {
    await page.goto("/merchant-services");
    await join(page, "Hosted shop primary");
    await page.getByRole("button", { name: "Create a primary merchant", exact: true }).click();
    await page.getByRole("textbox", { name: "Primary merchant name", exact: true }).fill(name);
    await page.getByRole("button", { name: "Review merchant", exact: true }).click();
    await page.getByRole("button", { name: "Create primary merchant", exact: true }).click();
    await expect(page.getByRole("heading", { name, level: 1, exact: true })).toBeVisible();
    const master = (await merchantDashboard(page.request)).units.find(unit => unit.kind === "MASTER")!;
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
    await page.goto(`/merchants/${master.id}?tab=verification`);
    await page.getByRole("button", { name: "Turn on payments", exact: true }).click();
    await page.getByRole("dialog", { name: "Turn on sandbox payments?", exact: true }).getByRole("button", { name: "Confirm setting", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Turn off payments", exact: true })).toBeEnabled();
    await page.getByRole("button", { name: "Connect merchant", exact: true }).click();
    await page.getByRole("dialog", { name: "Connect this merchant?", exact: true }).getByRole("button", { name: "Confirm setting", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Disconnect merchant", exact: true })).toBeEnabled();
    await accessible(page);

    await page.goto(`/merchants/${master.id}?tab=channels`);
    await page.getByRole("button", { name: "New payment channel", exact: true }).click();
    const channelForm = page.getByRole("dialog", { name: "New payment channel", exact: true });
    await channelForm.getByRole("textbox", { name: "Channel name or purpose", exact: true }).fill("Hosted seven-channel order");
    await channelForm.getByRole("textbox", { name: "Amount (USD)", exact: true }).fill("12.50");
    await channelForm.getByRole("combobox", { name: "Request use", exact: true }).selectOption("REUSABLE");
    await channelForm.getByLabel("Expires at (UTC)", { exact: true }).fill(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16));
    for (const label of ["SMS / text", "Email", "Invoice", "Bill", "Social media", "QR code", "Website link"]) await channelForm.getByRole("checkbox", { name: label, exact: true }).setChecked(true);
    await channelForm.getByRole("button", { name: "Review channel", exact: true }).click();
    const saving = page.waitForResponse(response => new URL(response.url()).pathname === `/api/v1/merchants/${master.id}/channels` && response.request().method() === "POST");
    await page.getByRole("dialog", { name: "Review payment channel", exact: true }).getByRole("button", { name: "Save payment channel", exact: true }).click();
    const response = await saving; expect(response.status()).toBe(200);
    const channel = paymentChannelSchema.parse(await response.json());
    expect(channel.presentations).toHaveLength(7);
    await page.getByRole("dialog", { name: "Payment channel details", exact: true }).getByRole("link", { name: "Open payment setup", exact: true }).click();
    const row = page.getByRole("listitem").filter({ has: page.getByText("Hosted seven-channel order", { exact: true }) });
    await row.getByRole("button", { name: "Turn on channel", exact: true }).click();
    await page.getByRole("dialog", { name: "Turn on this channel?", exact: true }).getByRole("button", { name: "Confirm setting", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(row.getByRole("button", { name: "Turn off channel", exact: true })).toBeEnabled();
    await row.getByRole("link", { name: "Preview payment", exact: true }).click();
    await page.getByRole("combobox", { name: "Preview format", exact: true }).selectOption("QR");
    await expect(page.getByRole("img", { name: "QR code for this sandbox payment preview", exact: true })).toBeVisible();
    async function approve() {
      await page.getByRole("button", { name: "Try approved payment", exact: true }).click();
      const pending = page.waitForResponse(item => new URL(item.url()).pathname === `/api/v1/merchants/${master.id}/channels/${channel.id}/test-payments` && item.request().method() === "POST");
      await page.getByRole("dialog", { name: "Review sandbox payment", exact: true }).getByRole("button", { name: "Confirm sandbox payment", exact: true }).click();
      const result = await pending; expect(result.status()).toBe(200);
      const payment = merchantTestPaymentProjectionSchema.parse(await result.json());
      await expect(page.getByRole("region", { name: "Sandbox payment result", exact: true })).toContainText(payment.testReference);
      return payment;
    }
    const payment = await approve();
    await page.getByRole("link", { name: "← Back to merchant payments", exact: true }).click();
    await page.getByRole("button", { name: `View approved payment Hosted seven-channel order ${payment.testReference}`, exact: true }).click();
    const receipt = page.getByRole("dialog", { name: "Payment details", exact: true });
    await expect(receipt).toContainText(payment.testReference);
    await page.reload(); await expect(receipt).toContainText(payment.testReference);
    await receipt.getByRole("button", { name: "Refund payment", exact: true }).click();
    await page.getByRole("textbox", { name: "Reason for refund", exact: true }).fill("Sandbox order returned");
    await page.getByRole("button", { name: "Review refund", exact: true }).click();
    await page.getByRole("dialog", { name: "Review full refund", exact: true }).getByRole("button", { name: "Confirm full refund", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.goto(`/pay/${channel.id}`); await approve();
    await page.getByRole("link", { name: "← Back to merchant payments", exact: true }).click();
    await page.getByRole("button", { name: "Transfer out", exact: true }).click();
    await page.getByRole("textbox", { name: "Transfer amount (USD)", exact: true }).fill("1.00");
    await page.getByRole("button", { name: "Review transfer", exact: true }).click();
    const transferring = page.waitForResponse(item => new URL(item.url()).pathname === `/api/v1/merchants/${master.id}/payouts` && item.request().method() === "POST");
    await page.getByRole("dialog", { name: "Review transfer out", exact: true }).getByRole("button", { name: "Confirm sandbox transfer", exact: true }).click();
    const transferred = await transferring; expect(transferred.status()).toBe(200);
    const payout = merchantTestPayoutProjectionSchema.parse(await transferred.json());
    expect(payout).toMatchObject({ amount: { minor: "100" }, status: "COMPLETED", destination: "TEST_DESTINATION" });
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await page.goto(`/merchant-services?view=unit:${master.id}`);
    await page.getByRole("button", { name: "Add submerchant", exact: true }).click();
    await page.getByRole("textbox", { name: "Submerchant name", exact: true }).fill("Hosted delegated shop");
    await page.getByRole("button", { name: "Review merchant", exact: true }).click();
    await page.getByRole("button", { name: "Create submerchant", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Hosted delegated shop", level: 1, exact: true })).toBeVisible();
    const sub = (await merchantDashboard(page.request)).units.find(unit => unit.name === "Hosted delegated shop")!;
    const joined = await startSandbox(colleague.personId, { commandId: randomUUID(), displayName: colleagueName, acknowledged: true });
    await page.goto(`/merchants/${sub.id}?tab=people`);
    await page.getByRole("button", { name: "Invite person", exact: true }).click();
    const invite = page.getByRole("dialog", { name: "Invite a person", exact: true });
    await invite.getByRole("textbox", { name: "Member code", exact: true }).fill(joined.memberCode!);
    await invite.getByRole("button", { name: "Find member", exact: true }).click();
    await expect(invite).toContainText(`Selected: ${colleagueName}`);
    await invite.getByRole("group", { name: "What can this person do?", exact: true }).getByRole("checkbox", { name: "View payments", exact: true }).check();
    await invite.getByRole("button", { name: "Review invitation", exact: true }).click();
    await page.getByRole("dialog", { name: "Review merchant invitation", exact: true }).getByRole("button", { name: "Save invitation", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await acceptOnlyInvitation(colleaguePage);
    expect((await merchantDashboard(colleaguePage.request)).units.map(unit => unit.id)).toEqual([sub.id]);
    expect((await cardDashboard(colleaguePage.request)).profiles).toEqual([]);
    await colleaguePage.goto(`/merchants/${sub.id}?tab=payments`);
    await expect(colleaguePage.getByRole("heading", { name: "Hosted delegated shop", level: 1, exact: true })).toBeVisible();
    await expect(colleaguePage.getByRole("button", { name: "Transfer out", exact: true })).toHaveCount(0);
    await expect(colleaguePage.locator("main")).not.toContainText(payment.testReference);
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
  } finally { await identity.close(); await colleague.close(); await colleagueContext.close(); }
});
