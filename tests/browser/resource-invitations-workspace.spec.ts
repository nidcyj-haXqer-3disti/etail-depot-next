import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import targets from "../../project-targets.json" with { type: "json" };
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { cards, serviceMembers } from "../../src/platform/database/schema";
import { serviceInvitations, terminalAssignments } from "../../src/modules/access/schema";
import { bindIdentity } from "../../src/modules/services/service";
import { getCardholderFunds, getWorkspace, startCardRequest, submitCardRequest, updateCardRequest } from "../../src/modules/workspace/service";
import { createTerminal } from "../../src/modules/acquiring/service";
import { getMerchantDashboard } from "../../src/modules/acquiring/dashboard-service";
import { cardPerson, cardPrimary, issuePracticeCard } from "../helpers/cardholder";
import { acquiringFixture } from "../helpers/acquiring";
import { signInVerified } from "./helpers/card-invitation";

const origin = "http://127.0.0.1:3100";
test.afterAll(closeDatabase);
async function accessible(page: Page) {
  expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}
async function unassignedCard(owner: {personId: string; serviceId: string}) {
  const request = await startCardRequest(owner.personId, owner.serviceId, { commandId: randomUUID() });
  const saved = await updateCardRequest(owner.personId, owner.serviceId, request.id, { commandId: randomUUID(), expectedVersion: request.version, holderId: null, nickname: "Recipient travel card", format: "VIRTUAL", allowanceMinor: "2500" });
  const issued = await submitCardRequest(owner.personId, owner.serviceId, saved.id, { commandId: randomUUID(), expectedVersion: saved.version });
  if (!issued.issuedCardId || issued.status !== "ISSUED") throw new Error("Canonical fixture card creation failed");
  return issued.issuedCardId;
}
async function sharedLink(page: Page, email: string) {
  const ready = page.getByRole("region", { name: "Share invitation", exact: true });
  await expect(ready).toBeVisible();
  // Substitute only OS share/clipboard transports; never open a mail app or read the user's clipboard.
  await page.evaluate(() => {
    const writes: string[] = [], shares: ShareData[] = [];
    Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async (value: string) => { writes.push(value); } });
    Object.defineProperty(navigator, "share", { configurable: true, value: async (value: ShareData) => { shares.push(value); throw new DOMException("Canceled synthetic share", "AbortError"); } });
    Object.defineProperty(window, "__invitationShareTransport", { configurable: true, value: { writes, shares } });
  });
  const opener=ready.getByRole("button",{name:"Share invitation",exact:true});
  await opener.click();
  const sharing=page.getByRole("dialog",{name:"Share invitation",exact:true});
  await expect(sharing).toBeVisible();
  const link = sharing.getByRole("textbox", { name: "Invitation link", exact: true });
  await expect(link).toHaveValue(new RegExp(`^${origin}/invitations/[a-f0-9-]{36}$`));
  const href = await link.inputValue();
  expect(new URL(href).search).toBe(""); expect(new URL(href).hash).toBe("");
  const emailHref = await sharing.getByRole("link", { name: "Email", exact: true }).getAttribute("href");
  expect(emailHref).toMatch(/^mailto:/); expect(decodeURIComponent(emailHref!)).toContain(email); expect(decodeURIComponent(emailHref!)).toContain(href);
  const sms = await sharing.getByRole("link", { name: "Text message", exact: true }).getAttribute("href");
  expect(sms).toMatch(/^sms:/); expect(decodeURIComponent(sms!)).toContain(href);
  const social=sharing.getByRole("link",{name:"WhatsApp (opens a new window)",exact:true});
  await expect(social).toHaveAttribute("href",new RegExp("^https://wa\\.me/"));
  expect(decodeURIComponent((await social.getAttribute("href"))!)).toContain(href);
  await sharing.getByRole("button", { name: "Copy link", exact: true }).click();
  await expect(sharing).toContainText("Invitation link copied. No message has been sent.");
  await sharing.getByRole("button", { name: "More apps", exact: true }).click();
  await expect(sharing).toContainText("Sharing canceled. You can still copy the link.");
  const transport = await page.evaluate(() => Reflect.get(window, "__invitationShareTransport") as { writes: string[]; shares: ShareData[] });
  expect(transport.writes).toEqual([href]); expect(transport.shares).toHaveLength(1);
  expect(transport.shares[0]!.title).toMatch(/^Your Etail Depot(?: card| payment terminal)? invitation$/);
  expect(transport.shares[0]!.url).toBe(href); expect(transport.shares[0]!.text).toContain(email); expect(transport.shares[0]!.text).toContain(href);
  await accessible(page);
  await page.screenshot({path:test.info().outputPath("invitation-share-sheet.png"),animations:"disabled"});
  const viewport=page.viewportSize();
  if(viewport&&viewport.width!==320){await page.setViewportSize({width:320,height:900});await accessible(page);await page.screenshot({path:test.info().outputPath("invitation-share-sheet-320.png"),animations:"disabled"});await page.setViewportSize(viewport);}
  await page.keyboard.press("Escape"); await expect(sharing).toHaveCount(0); await expect(opener).toBeFocused();
  return href;
}

test("email-bound card sharing returns a new recipient to the exact invitation and recovers the same saved response", async ({ page, browser }) => {
  test.setTimeout(120_000);
  const owner = await cardPrimary("Invitation card owner"), cardId = await unassignedCard(owner);
  const privateCard = await issuePracticeCard(owner.personId, owner.serviceId, owner.personId, "Owner private card", undefined, "9000");
  const email = `card-${randomUUID()}@example.test`;
  await signInVerified(page, owner.personId);
  await page.goto(`${origin}/cards/${cardId}/invite`);
  await expect(page.getByRole("heading", { name: "Invite cardholder", exact: true })).toBeVisible();
  const createPath = `**/api/v1/cardholder-services/${owner.serviceId}/cards/${cardId}/invitations`, createBodies: string[] = [];
  await page.route(createPath, async route => {
    createBodies.push(route.request().postData()!);
    const result = await route.fetch(); expect(result.ok()).toBe(true);
    if (createBodies.length === 1) await route.fulfill({ status: 200, contentType: "application/json", body: "{" });
    else await route.fulfill({ response: result });
  });
  await page.getByRole("textbox", { name: "Their email address", exact: true }).fill(email.toUpperCase());
  await page.getByRole("button", { name: "Create invitation", exact: true }).click();
  await expect(page.getByRole("button", { name: "Check invitation request again", exact: true })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Their email address", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Check invitation request again", exact: true }).click();
  const href = await sharedLink(page, email), invitationId = new URL(href).pathname.split("/").at(-1)!;
  expect(createBodies).toHaveLength(2); expect(createBodies[1]).toBe(createBodies[0]);
  expect(await getDb().select().from(serviceInvitations).where(eq(serviceInvitations.cardId, cardId))).toHaveLength(1);
  await accessible(page);
  const anonymous = await browser.newContext({ viewport: page.viewportSize() ?? undefined });
  const recipientContext = await browser.newContext({ viewport: page.viewportSize() ?? undefined });
  const wrongContext = await browser.newContext({ viewport: page.viewportSize() ?? undefined });
  try {
    const anonymousPage = await anonymous.newPage(); await anonymousPage.goto(href);
    await expect(anonymousPage.getByRole("heading", { name: "You’ve been invited", exact: true })).toBeVisible();
    await expect(anonymousPage.locator("main")).not.toContainText("Recipient travel card");
    await expect(anonymousPage.locator("main")).not.toContainText(email);
    const anonymousResponse = await anonymous.request.get(`${origin}/api/v1/invitations/${invitationId}`);
    expect(anonymousResponse.status()).toBe(401); expect(await anonymousResponse.text()).not.toContain(cardId);
    const next = new URL((await anonymousPage.getByRole("link", { name: "Create a login", exact: true }).getAttribute("href"))!, origin).searchParams.get("next");
    expect(next).toBe(`/invitations/${invitationId}`);
    const stranger = await cardPerson("Wrong invitation recipient"), wrongPage = await wrongContext.newPage();
    await signInVerified(wrongPage, stranger, `wrong-${randomUUID()}@example.test`); await wrongPage.goto(href);
    await expect(wrongPage.getByRole("heading", { name: "This invitation isn’t available", exact: true })).toBeVisible();
    await expect(wrongPage.locator("main")).not.toContainText("Recipient travel card");
    expect((await wrongContext.request.get(`${origin}/api/v1/invitations/${invitationId}`)).status()).toBe(404);
    // Synthetic authenticated provider identity; no real registration, email, or provider request.
    const recipient = await bindIdentity(`${targets.netlify.canonical_origin}/.netlify/identity`, randomUUID(), "New member");
    const recipientPage = await recipientContext.newPage(); await signInVerified(recipientPage, recipient.personId, email);
    await recipientPage.goto(href);
    await expect(recipientPage.getByRole("heading", { name: "Finish your profile", exact: true })).toBeVisible();
    await expect(recipientPage.getByRole("button", { name: "Accept invitation", exact: true })).toHaveCount(0);
    await expect(recipientPage.getByRole("radio")).toHaveCount(0);
    await recipientPage.getByRole("textbox", { name: "Your name", exact: true }).fill("Invited card recipient");
    await expect(recipientPage.getByRole("button", { name: "Continue", exact: true })).toBeDisabled();
    await recipientPage.getByRole("checkbox", { name: "I understand this is a sandbox and no real money will move.", exact: true }).check();
    await recipientPage.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(recipientPage).toHaveURL(href);
    await expect(recipientPage.getByRole("heading", { name: "Your card invitation", exact: true })).toBeVisible();
    expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId, recipient.personId))).toEqual([]);
    await expect(recipientPage.locator("main")).toContainText("Total spending limit: $25.00");
    await accessible(recipientPage);
    const acceptBodies: string[] = [];
    await recipientPage.route(`**/api/v1/invitations/${invitationId}/accept`, async route => {
      acceptBodies.push(route.request().postData()!);
      const response = await route.fetch();
      expect(response.status()).toBe(acceptBodies.length === 2 ? 401 : 200);
      if (acceptBodies.length === 1) await route.fulfill({ status: 200, contentType: "application/json", body: "{" });
      else await route.fulfill({ response });
    });
    await recipientPage.getByRole("button", { name: "Accept invitation", exact: true }).click();
    await expect(recipientPage.getByRole("button", { name: "Check your response again", exact: true })).toBeVisible();
    await expect(recipientPage.getByRole("link", { name: "Open your card", exact: true })).toHaveCount(0);
    await expect(recipientPage.locator("main")).not.toContainText(/SyntaxError|Unexpected end|JSON.parse|TypeError/);
    await recipientContext.clearCookies();
    await recipientPage.getByRole("button", { name: "Check your response again", exact: true }).click();
    await expect(recipientPage.getByRole("heading", { name: "Invitation unavailable", exact: true })).toBeVisible();
    await expect(recipientPage.locator("main")).not.toContainText("Recipient travel card");
    await expect(recipientPage.getByRole("button", { name: "Check your response again", exact: true })).toBeVisible();
    await signInVerified(recipientPage, recipient.personId, email);
    await recipientPage.getByRole("button", { name: "Check your response again", exact: true }).click();
    await expect(recipientPage.getByRole("link", { name: "Open your card", exact: true })).toBeVisible();
    expect(acceptBodies).toHaveLength(3); expect(acceptBodies[1]).toBe(acceptBodies[0]); expect(acceptBodies[2]).toBe(acceptBodies[0]);
    const [assigned] = await getDb().select().from(cards).where(eq(cards.id, cardId));
    expect(assigned).toMatchObject({ holderId: recipient.personId, assignmentState: "ACCEPTED" });
    expect((await getWorkspace(recipient.personId, owner.serviceId)).cards.map(row => row.id)).toEqual([cardId]);
    expect((await getCardholderFunds(owner.personId, owner.serviceId)).available.minor).toBe("0");
    await recipientPage.getByRole("link", { name: "Open your card", exact: true }).click();
    await expect(recipientPage).toHaveURL(`${origin}/cardholder-services/cards/${cardId}`);
    await expect(recipientPage.locator("main")).not.toContainText("Owner private card");
    const ownWorkspace = await recipientContext.request.get(`${origin}/api/v1/cardholder-services/${owner.serviceId}/workspace`);
    expect(ownWorkspace.status()).toBe(200);
    const ownData = await ownWorkspace.text(); expect(ownData).toContain(cardId); expect(ownData).not.toContain(privateCard.card.id); expect(ownData).not.toContain("Owner private card");
    await recipientPage.reload(); await expect(recipientPage.locator("main")).toContainText("Recipient travel card");
  } finally { await anonymous.close(); await recipientContext.close(); await wrongContext.close(); }
});

test("a terminal email invitation shares one terminal and revocation removes its recipient's current access", async ({ page, browser }) => {
  test.setTimeout(120_000);
  const merchant = await acquiringFixture();
  const terminal = await createTerminal(merchant.personId, merchant.serviceId, { commandId: randomUUID(), displayName: "Invited collection terminal" });
  const recipient = await cardPerson("Invited terminal recipient"), email = `terminal-${randomUUID()}@example.test`;
  await signInVerified(page, merchant.personId); await page.goto(`${origin}/merchants/${terminal.id}?tab=people`);
  await page.getByRole("button", { name: "Invite a person", exact: true }).click();
  await page.getByRole("dialog").getByRole("textbox", { name: "Recipient email", exact: true }).fill(email);
  await page.getByRole("dialog").getByRole("button", { name: "Review invitation", exact: true }).click();
  const review = page.getByRole("dialog", { name: "Review payment access", exact: true });
  await expect(review).toContainText(email); await expect(review).toContainText("Invited collection terminal");
  await review.getByRole("button", { name: "Save invitation", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const href = await sharedLink(page, email), invitationId = new URL(href).pathname.split("/").at(-1)!;
  await accessible(page);
  const context = await browser.newContext({ viewport: page.viewportSize() ?? undefined });
  try {
    const recipientPage = await context.newPage(); await signInVerified(recipientPage, recipient, email); await recipientPage.goto(href);
    await expect(recipientPage.getByRole("heading", { name: "Your payment terminal invitation", exact: true })).toBeVisible();
    await expect(recipientPage.locator("main")).toContainText("The account owner manages the payment balance, refunds and access.");
    await recipientPage.getByRole("button", { name: "Accept invitation", exact: true }).click();
    await recipientPage.getByRole("link", { name: "Open your payment terminal", exact: true }).click();
    await expect(recipientPage).toHaveURL(`${origin}/merchant-services/terminals/${terminal.id}/payments`);
    const dashboard = await getMerchantDashboard(recipient);
    expect(dashboard.units.map(row => row.id)).toEqual([terminal.id]); expect(dashboard.moneyAccounts).toEqual([]);
    expect(await getDb().select().from(terminalAssignments).where(and(eq(terminalAssignments.terminalId, terminal.id), eq(terminalAssignments.personId, recipient)))).toHaveLength(1);
    expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId, recipient))).toEqual([]);
    expect((await context.request.get(`${origin}/api/v1/merchants/${merchant.merchantId}`)).status()).toBe(404);
    expect((await context.request.get(`${origin}/api/v1/merchants/${terminal.id}/access`)).status()).toBe(403);
    await accessible(recipientPage);
    await page.reload();
    await page.locator(".mp-person").filter({ hasText: "Invited terminal recipient" }).getByRole("button", { name: "Remove access", exact: true }).click();
    await page.getByRole("dialog", { name: "Remove payment access?", exact: true }).getByRole("button", { name: "Confirm removal", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect((await context.request.get(`${origin}/api/v1/merchants/${terminal.id}`)).status()).toBe(404);
    await recipientPage.goto(href);
    await expect(recipientPage.getByRole("link", { name: "Open your payment terminal", exact: true })).toHaveCount(0);
    expect((await context.request.get(`${origin}/api/v1/invitations/${invitationId}`)).status()).toBe(200);
    await expect(recipientPage.getByRole("button", { name: "Accept invitation", exact: true })).toHaveCount(0);
  } finally { await context.close(); }
});
