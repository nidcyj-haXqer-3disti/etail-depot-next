import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";
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
import {
  addMoney, setCardAllowance, addUnfundedCard, publishedMerchantFixture, prepaidPayer,
  publishCustomerLink, payPublished, refundPayment, settleExactPayment,
  operations, getCardholderFunds, getCardSpending, requireFictionalTestDatabase,
} from "./helpers/prepaid-journey";

test.use({actionTimeout:15_000,navigationTimeout:20_000});
test.beforeAll(requireFictionalTestDatabase);
test.afterAll(closeDatabase);

async function syntheticSession(page: Page) {
  // Synthetic identity/session setup in the isolated test DB only. Every service,
  // permission and financial effect below comes from the actual application UI.
  // Separate fictional merchant/operator setup is explicit in its helper.
  const identity = await bindIdentity(`${targets.netlify.canonical_origin}/.netlify/identity`, randomUUID());
  const sessions = new SessionService(sessionRepository, { appEnv: "test", publicOrigin: "http://127.0.0.1:3100" });
  const session = await sessions.issue(identity), pair = session.cookie.split(";", 1)[0]!;
  await page.context().addCookies([{ name: pair.slice(0, pair.indexOf("=")), value: pair.slice(pair.indexOf("=") + 1), domain: "127.0.0.1", path: "/", httpOnly: true, sameSite: "Strict", expires: Math.floor(session.record.expiresAt.getTime() / 1000) }]);
  return { personId: identity.personId, close: () => sessions.logout(pair) };
}

async function join(page: Page, name: string) {
  await page.getByRole("textbox", { name: "Your display name", exact: true }).fill(name);
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  const merchant = new URL(page.url()).pathname === "/merchant-services";
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL(merchant ? /\/merchant-services$/ : /\/cardholder-services$/);
  await expect(page.getByRole("heading", {name: merchant ? "Your terminals" : "Cardholder services", level: 1, exact: true})).toBeVisible();
}

async function capture(page: Page, name: string) {
  if (process.env.ETAIL_JOURNEY_SCREENSHOTS !== "1") return;
  const directory = "artifacts/journey-refinement/after";
  await mkdir(directory, {recursive: true});
  await page.screenshot({path: `${directory}/${name}-${page.viewportSize()?.width ?? 0}.png`, fullPage: !(await page.getByRole("dialog").count())});
}

async function accessible(page: Page) {
  expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}

async function addCard(page: Page, name: string, holderName: string, allowance="0.00") {
  const dashboard=await cardDashboard(page.request), serviceId=dashboard.primaryService!.id;
  const before=await getCardholderFunds(dashboard.person.id,serviceId);
  const card=await addUnfundedCard(page,name,holderName,allowance);
  expect((await getCardholderFunds(dashboard.person.id,serviceId)).available.minor).toBe(before.available.minor);
  return card;
}

async function acceptOnlyInvitation(page: Page) {
  await page.goto("/shared-access");
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
    await expect(page.getByRole("heading", { name: "Choose where to start.", exact: true })).toBeVisible();
    await accessible(page);
    await join(page, name);
    await expect(page.getByRole("link", { name: "Open customer care", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Open cardholder services", exact: true }).click();
    await expect(page.getByRole("link",{name:"Create your first card",exact:true})).toBeVisible();
    await accessible(page);
    await capture(page, "cardholder-first-card-form");
    const card = await addCard(page, "My hosted practice card", name);
    await capture(page, "cardholder-created-card");
    expect(card.available.minor).toBe("0");
    const serviceId=(await cardDashboard(page.request)).primaryService!.id;
    await addMoney(page,serviceId,"50.00");
    await setCardAllowance(page,serviceId,card.id,card.nickname,"25.00");
    const checkout=await publishedMerchantFixture("525","Sandbox groceries");
    const payment=await payPublished(page,checkout.publication,card.id);
    expect((await getCardholderFunds(identity.personId,serviceId)).available.minor).toBe("4475");
    expect(await getCardSpending(identity.personId,serviceId,card.id)).toMatchObject({
      used:{minor:"525"},remaining:{minor:"1975"},available:{minor:"1975"},
    });
    await page.goto(`/cardholder-services?focus=${card.id}`);
    await expect(page.getByRole("link",{name:"Try a purchase",exact:true})).toHaveCount(0);
    await page.getByRole("link",{name:"Card controls",exact:true}).click();
    const dialog=page.getByRole("dialog");
    for (const action of ["Freeze", "Unfreeze"] as const) {
      await dialog.getByRole("button", { name: action, exact: true }).click();
      await dialog.getByRole("button", { name: `${action} card`, exact: true }).click();
      await expect(dialog.getByRole("button", { name: action === "Freeze" ? "Unfreeze" : "Freeze", exact: true })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await page.goto(`/cardholder-services?focus=${card.id}`);
    await expect(page.getByRole("region", { name: "Selected card overview", exact: true })).toContainText("$19.75");
    await accessible(page);
    await page.getByRole("link",{name:"Card controls",exact:true}).click();
    await page.getByRole("dialog").getByRole("link", { name: /Statements & reports/ }).click();
    await expect(page.locator("main")).toContainText(checkout.publication.merchantName);
    expect(payment.reference).toBeTruthy();
    const downloading = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download CSV", exact: true }).click();
    expect((await downloading).suggestedFilename()).toMatch(/^etail-card-activity-/);
    await page.goto(`/cardholder-services?focus=${card.id}`);
    await page.getByRole("link",{name:"Card controls",exact:true}).click();
    await page.getByRole("dialog").getByRole("link",{name:"Notification preferences",exact:true}).click();
    await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/settings"&&url.searchParams.get("focus")===card.id);
    await page.getByRole("checkbox").first().uncheck();
    await page.getByRole("button", { name: "Save preferences", exact: true }).click();
    await expect(page.locator("main")).toContainText("Notification preferences saved");
    await page.reload();
    await expect(page.getByRole("checkbox").first()).not.toBeChecked();
    await page.goto(`/cardholder-services?focus=${card.id}`);
    await page.getByRole("link",{name:"Card controls",exact:true}).click();
    await page.getByRole("dialog").getByRole("link",{name:"Help with this card",exact:true}).click();
    await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/help"&&url.searchParams.get("focus")===card.id);
    await page.getByRole("button", { name: "Start a case", exact: true }).click();
    await page.getByRole("textbox", { name: "Subject", exact: true }).fill("My hosted card question");
    await page.getByRole("textbox", { name: "Your explanation", exact: true }).fill("Please explain my sandbox purchase controls.");
    await page.getByRole("button", { name: "Review case", exact: true }).click();
    await page.getByRole("button", { name: "Create case", exact: true }).click();
    await expect(page.getByRole("heading", { name: "My hosted card question", exact: true })).toBeVisible();

    const joined = await startSandbox(secondary.personId, { commandId: randomUUID(), displayName: secondName, acknowledged: true });
    expect((await cardDashboard(page.request)).primaryService!.id).toBe(serviceId);
    await page.goto(`/cardholder-services?manage=${serviceId}`);
    await page.getByRole("button", { name: "Invite a person", exact: true }).click();
    const invite = page.getByRole("dialog", { name: "Invite a cardholder", exact: true });
    await invite.getByRole("textbox", { name: "Member code", exact: true }).fill(joined.memberCode!);
    await invite.getByRole("button", { name: "Find member", exact: true }).click();
    await expect(invite).toContainText(`Selected: ${secondName}`);
    await expect(invite).toContainText("After they accept, add cards in their name");
    await expect(invite.getByRole("radio")).toHaveCount(0);
    await invite.getByRole("button", { name: "Review invitation", exact: true }).click();
    await page.getByRole("dialog", { name: "Review invitation", exact: true }).getByRole("button", { name: "Save invitation", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await acceptOnlyInvitation(secondaryPage);
    await secondaryPage.goto("/cardholder-services");
    const waiting=secondaryPage.getByRole("region",{name:"You’re connected",exact:true});
    await expect(waiting).toContainText(`Cards with ${name}`);
    await expect(waiting).toContainText("INVITATION ACCEPTED");
    await expect(waiting).toContainText("Your card will appear here when the account owner adds it");
    await expect(secondaryPage.getByRole("button",{name:"Open cardholder services",exact:true})).toBeHidden();
    await secondaryPage.getByText("Optional: start your own card group",{exact:true}).click();
    await expect(secondaryPage.getByRole("button",{name:"Open cardholder services",exact:true})).toBeVisible();
    await secondaryPage.getByText("Optional: start your own card group",{exact:true}).click();
    expect((await cardDashboard(secondaryPage.request)).primaryService).toBeNull();
    await secondaryPage.reload();
    await expect(waiting).toBeVisible();
    await accessible(secondaryPage);
    expect((await getCardholderFunds(identity.personId,serviceId)).available.minor).toBe("4475");
    await page.goto(`/cardholder-services?view=cardholders&person=${secondary.personId}`);
    await expect(page.locator(".access-cardholder")).toContainText("No cards yet");
    await capture(page, "cardholder-accepted-before-card");
    await page.getByRole("link", {name: `Add card for ${secondName}`, exact: true}).click();
    await expect(page.getByRole("dialog").getByRole("radio", {name: new RegExp(secondName)})).toBeChecked();
    const secondaryCard = await addCard(page, "Invited hosted card", secondName,"25.00");
    expect(secondaryCard.available.minor).toBe("2500");
    expect((await getCardholderFunds(identity.personId,serviceId)).available.minor).toBe("4475");
    expect(await getCardSpending(identity.personId,serviceId,secondaryCard.id)).toMatchObject({
      allowance:{minor:"2500"},used:{minor:"0"},available:{minor:"2500"},
    });
    await secondaryPage.goto(`/cardholder-services?focus=${secondaryCard.id}`);
    await expect(waiting).toHaveCount(0);
    await expect(secondaryPage.getByRole("region", { name: "Selected card overview", exact: true })).toContainText("Invited hosted card");
    expect((await cardDashboard(secondaryPage.request)).cards.map(row => row.id)).toEqual([secondaryCard.id]);
    expect((await merchantDashboard(secondaryPage.request)).units).toEqual([]);
    expect((await secondaryPage.request.get(`/api/v1/cardholder-services/${serviceId}/funds`)).status()).toBe(403);
    await expect(secondaryPage.getByRole("navigation",{name:"Cardholder navigation"}).getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
    await secondaryPage.goto(`/cardholder-services?focus=${card.id}`);
    await expect(secondaryPage.getByRole("heading", { name: "This card is unavailable", exact: true })).toBeVisible();
    expect((await merchantDashboard(page.request)).units).toEqual([]);
  } finally { await identity.close(); await secondary.close(); await secondaryContext.close(); }
});

test("email merchant enrolls, publishes checkout, refunds, settles and shares only one terminal", async ({ page, browser }) => {
  test.setTimeout(180_000);
  const identity = await syntheticSession(page);
  const colleagueContext = await browser.newContext({ baseURL: "http://127.0.0.1:3100", viewport: page.viewportSize() });
  const colleaguePage = await colleagueContext.newPage(), colleague = await syntheticSession(colleaguePage);
  const name = `Hosted sample shop ${randomUUID().slice(0, 8)}`, colleagueName = "Hosted merchant colleague";
  const payerContext=await browser.newContext({baseURL:"http://127.0.0.1:3100",viewport:page.viewportSize()});
  const payerPage=await payerContext.newPage();
  const payer=await prepaidPayer(payerPage,"Hosted checkout customer "+randomUUID().slice(0,8));
  try {
    await page.goto("/merchant-services");
    await join(page, "Hosted shop primary");
    await page.getByRole("button", { name: "Create merchant", exact: true }).click();
    await page.getByRole("textbox", { name: "Merchant name", exact: true }).fill(name);
    await page.getByRole("dialog").getByRole("button", { name: "Create merchant", exact: true }).click();
    await expect(page.getByRole("heading", { name, level: 1, exact: true })).toBeVisible();
    const master = (await merchantDashboard(page.request)).units.find(unit => unit.ownerAccess && unit.name === name)!;
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
    await page.goto(`/merchants/${master.id}?tab=verification`);
    await page.getByRole("button", { name: "Enable payments", exact: true }).click();
    await page.getByRole("dialog", { name: "Enable payments?", exact: true }).getByRole("button", { name: "Enable payments", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Your payments are ready", exact: true })).toBeVisible();
    await expect(page.getByRole("link", {name: "Create payment channel", exact: true})).toBeInViewport({ratio: 1});
    await capture(page, "merchant-setup-ready");
    await accessible(page);

    await page.getByRole("link", { name: "Create payment channel", exact: true }).click();
    const channelForm = page.getByRole("dialog", { name: "New payment channel", exact: true });
    await expect(channelForm.getByRole("button", {name: "Review channel", exact: true})).toBeInViewport({ratio: 1});
    await channelForm.getByRole("textbox", { name: "Channel name or purpose", exact: true }).fill("Hosted seven-channel order");
    await channelForm.getByRole("textbox", { name: "Amount (USD)", exact: true }).fill("12.50");
    await channelForm.getByText("More options · use and expiry", { exact: true }).click();
    await channelForm.getByRole("combobox", { name: "Request use", exact: true }).selectOption("REUSABLE");
    await channelForm.getByLabel("Expires at (UTC)", { exact: true }).fill(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16));
    for (const label of ["SMS / text", "Email", "Invoice", "Bill", "Social media", "QR code", "Website link"]) await channelForm.getByRole("checkbox", { name: label, exact: true }).setChecked(true);
    await expect(channelForm.getByRole("button", {name: "Review channel", exact: true})).toBeInViewport({ratio: 1});
    await capture(page, "merchant-channel-form");
    await channelForm.getByRole("button", { name: "Review channel", exact: true }).click();
    const saving = page.waitForResponse(response => new URL(response.url()).pathname === `/api/v1/merchants/${master.id}/channels` && response.request().method() === "POST");
    await page.getByRole("dialog", { name: "Review payment channel", exact: true }).getByRole("button", { name: "Save payment channel", exact: true }).click();
    const response = await saving; expect(response.status()).toBe(200);
    const channel = paymentChannelSchema.parse(await response.json());
    expect(channel.presentations).toHaveLength(7);
    const channelDetails=page.getByRole("dialog",{name:"Payment channel details",exact:true});
    await channelDetails.getByRole("button",{name:"Turn on channel",exact:true}).click();
    await page.getByRole("dialog",{name:"Turn on this channel?",exact:true}).getByRole("button",{name:"Confirm setting",exact:true}).click();
    await expect(channelDetails.getByRole("heading",{name:"Your channel is ready",exact:true})).toBeVisible();
    await expect(channelDetails.getByRole("link",{name:"Try a practice payment",exact:true})).toHaveCount(0);
    const publication=await publishCustomerLink(page,master.id,channel.id);
    await capture(page,"merchant-published-channel");
    await accessible(page);
    const first=await payPublished(payerPage,publication,payer.card.id);
    await capture(payerPage,"merchant-customer-checkout-receipt");
    expect((await getCardholderFunds(payer.personId,payer.serviceId)).available.minor).toBe("3750");
    await page.goto(`/merchants/${master.id}?tab=payments&payment=${first.paymentId}`);
    await expect(page.getByRole("dialog",{name:"Payment details",exact:true})).toContainText(first.reference);
    await capture(page,"merchant-receipt");
    const payment=await refundPayment(page,master.id,first.paymentId,first.reference);
    expect((await getCardholderFunds(payer.personId,payer.serviceId)).available.minor).toBe("5000");
    expect((await getCardSpending(payer.personId,payer.serviceId,payer.card.id)).used.minor).toBe("1250");
    await payerPage.goto(`/checkout/${publication.id}/card?review=${first.review.id}`);
    await expect(payerPage.getByRole("heading",{name:"Payment refunded",exact:true})).toBeVisible();
    const second=await payPublished(payerPage,publication,payer.card.id);
    expect(second.paymentId).not.toBe(first.paymentId);
    expect((await getCardholderFunds(payer.personId,payer.serviceId)).available.minor).toBe("3750");
    expect(await getCardSpending(payer.personId,payer.serviceId,payer.card.id)).toMatchObject({
      allowance:{minor:"5000"},used:{minor:"2500"},available:{minor:"2500"},
    });
    const settlement=await settleExactPayment(page,master.id,second.paymentId);
    expect(settlement.amount.minor).toBe("1250");
    const afterSettlement=await operations(page,master.id);
    expect(afterSettlement).toMatchObject({availableFunds:{minor:"0"},pendingDeposits:{minor:"0"},bankFunds:{minor:"1250"}});
    const moneyResponse=await page.request.get(`/api/v1/money-accounts/${settlement.moneyAccountId}`);
    expect(moneyResponse.status()).toBe(200);
    expect(await moneyResponse.json()).toMatchObject({id:settlement.moneyAccountId,serviceKind:"MERCHANT",available:{minor:"1250"}});
    expect(afterSettlement.settlements.filter(row=>row.id===settlement.id)).toHaveLength(1);
    await page.goto("/operations/money-withdrawals");
    await expect(page.getByRole("heading",{name:"Access required",exact:true})).toBeVisible();
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
    expect((await merchantDashboard(payerPage.request)).units).toEqual([]);

    await page.goto(`/merchant-services?section=merchants`);
    await page.getByRole("button", { name: "Add terminal", exact: true }).click();
    await page.getByRole("textbox", { name: "Terminal name", exact: true }).fill("Hosted delegated shop");
    await page.getByRole("dialog").getByRole("button", { name: "Add terminal", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Hosted delegated shop", level: 1, exact: true })).toBeVisible();
    const sub = (await merchantDashboard(page.request)).units.find(unit => unit.name === "Hosted delegated shop")!;
    const joined = await startSandbox(colleague.personId, { commandId: randomUUID(), displayName: colleagueName, acknowledged: true });
    await page.goto(`/merchants/${sub.id}?tab=people`);
    await page.getByRole("button", { name: "Invite a person", exact: true }).click();
    const invite = page.getByRole("dialog", { name: "Invite a person", exact: true });
    await invite.getByRole("textbox", { name: "Member code", exact: true }).fill(joined.memberCode!);
    await invite.getByRole("button", { name: "Find member", exact: true }).click();
    await expect(invite).toContainText(`Selected: ${colleagueName}`);
    await expect(invite.getByRole("checkbox")).toHaveCount(0);
    await invite.getByRole("button", { name: "Review invitation", exact: true }).click();
    await page.getByRole("dialog", { name: "Review terminal invitation", exact: true }).getByRole("button", { name: "Save invitation", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await acceptOnlyInvitation(colleaguePage);
    expect((await merchantDashboard(colleaguePage.request)).units.map(unit => unit.id)).toEqual([sub.id]);
    expect((await cardDashboard(colleaguePage.request)).profiles).toEqual([]);
    await colleaguePage.goto(`/merchants/${sub.id}?tab=payments`);
    await expect(colleaguePage.getByRole("heading", { name: "Hosted delegated shop", level: 1, exact: true })).toBeVisible();
    await expect(colleaguePage.getByRole("button", { name: "Settle payments", exact: true })).toHaveCount(0);
    expect((await colleaguePage.request.get(`/api/v1/merchants/${master.id}/operations`)).status()).toBe(404);
    await expect(colleaguePage.locator("main")).not.toContainText(payment.testReference);
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
  } finally {
    await identity.close(); await colleague.close(); await payer.close();
    await colleagueContext.close(); await payerContext.close();
  }
});

test("merchant setup recovers lost connection responses without repeating processing or reopening paused payments", async ({ page }) => {
  test.setTimeout(180_000);
  const identity = await syntheticSession(page), name = `Setup recovery ${randomUUID().slice(0, 8)}`;
  const enrollmentAttempts = new Map<string, string[]>(), lostResponses = new Set<string>();
  let processingWrites = 0;
  try {
    await page.goto("/merchant-services"); await join(page, "Setup recovery primary");
    await page.getByRole("button", { name: "Create merchant", exact: true }).click();
    await page.getByRole("textbox", { name: "Merchant name", exact: true }).fill(name);
    await page.getByRole("dialog").getByRole("button", { name: "Create merchant", exact: true }).click();
    await expect(page.getByRole("heading", { name, exact: true, level: 1 })).toBeVisible();
    const primary = (await merchantDashboard(page.request)).units.find(unit => unit.ownerAccess && unit.name === name)!;
    await page.route("**/api/v1/merchants/*/gateway", async route => {
      if (route.request().method() === "PUT") processingWrites += 1;
      await route.continue();
    });
    await page.route("**/api/v1/merchants/*/test-enrollment", async route => {
      if (route.request().method() !== "PUT") { await route.continue(); return; }
      const path = new URL(route.request().url()).pathname;
      const commands = enrollmentAttempts.get(path) ?? [];
      commands.push((route.request().postDataJSON() as { commandId: string }).commandId); enrollmentAttempts.set(path, commands);
      if (!lostResponses.has(path)) {
        // Commit through the actual endpoint, then lose only its HTTP response.
        // Recovery must ask the same command for its result, never repeat the effect.
        lostResponses.add(path);
        const response = await route.fetch(); expect(response.status()).toBe(200);
        await route.abort("failed");
      } else await route.continue();
    });
    async function enableAndRecover(merchantId: string) {
      const settings=page.getByRole("navigation",{name:"Merchant navigation"}).getByRole("link",{name:"Settings",exact:true});
      await settings.click();
      await expect(settings).toHaveAttribute("aria-current","page");
      await expect(page).toHaveURL(new RegExp(`/merchants/${merchantId}\\?tab=verification`));
      await page.getByRole("button", { name: "Enable payments", exact: true }).click();
      const dialog = page.getByRole("dialog", { name: "Enable payments?", exact: true });
      await dialog.getByRole("button", { name: "Enable payments", exact: true }).click();
      await expect(dialog.getByRole("alert")).toContainText("This merchant’s connection is not yet confirmed");
      await page.getByRole("button", { name: "Retry payment setup", exact: true }).click();
      await expect(dialog).toBeHidden();
      await expect(page.getByRole("region", {name: /^(Payment setup|Getting started with payments)$/})).toContainText(/Your payments are ready|Payments are ready/);
      const commands = enrollmentAttempts.get(`/api/v1/merchants/${merchantId}/test-enrollment`)!;
      expect(commands).toHaveLength(2); expect(commands[1]).toBe(commands[0]);
      const result = await page.request.get(`/api/v1/merchants/${merchantId}/operations`);
      expect(result.status()).toBe(200);
      const operations = await result.json() as { gateway: { mode: string; version: number }; enrollment: { status: string; version: number } };
      expect(operations.gateway).toMatchObject({ mode: "TEST_READY", version: 1 });
      expect(operations.enrollment).toMatchObject({ status: "ENROLLED", version: 1 });
    }
    await enableAndRecover(primary.id); expect(processingWrites).toBe(1);
    await page.goto(`/merchant-services?section=merchants`);
    await page.getByRole("button", { name: "Add terminal", exact: true }).click();
    await page.getByRole("textbox", { name: "Terminal name", exact: true }).fill(`${name} branch`);
    await page.getByRole("dialog").getByRole("button", { name: "Add terminal", exact: true }).click();
    await expect(page.getByRole("heading", { name: `${name} branch`, exact: true, level: 1 })).toBeVisible();
    const sub = (await merchantDashboard(page.request)).units.find(unit => unit.name === `${name} branch`)!;
    await enableAndRecover(sub.id); expect(processingWrites).toBe(1);
    await page.goto(`/merchants/${primary.id}?tab=verification`);
    await page.getByText("Advanced payment settings", { exact: true }).click();
    await page.getByRole("button", { name: "Turn off payments", exact: true }).click();
    await page.getByRole("dialog", { name: "Turn off payments?", exact: true }).getByRole("button", { name: "Confirm setting", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.goto(`/merchants/${sub.id}?tab=channels`);
    await expect(page.getByRole("heading", { name: "Payments need your attention", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Enable payments", exact: true })).toHaveCount(0);
    expect(processingWrites).toBe(2);
    const paused = await page.request.get(`/api/v1/merchants/${sub.id}/operations`);
    expect((await paused.json() as { gateway: { mode: string } }).gateway.mode).toBe("DISABLED");
  } finally { await identity.close(); }
});
