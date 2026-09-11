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
  addMoney, setMonthlyLimit, addUnfundedCard, publishedMerchantFixture, prepaidPayer,
  publishCustomerLink, payPublished, refundPayment, requestExactDeposit, assignedDepositOperator,
  completeDeposit, operations, getCardholderFunds, getPersonSpending, requireFictionalTestDatabase,
} from "./helpers/prepaid-journey";

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
  await page.getByRole("checkbox", { name: "I understand this is a sandbox. Cards, balances, payments and verification are simulated. No real money moves.", exact: true }).check();
  const merchant = new URL(page.url()).pathname === "/merchant-services";
  await page.getByRole("button", { name: merchant ? "Continue to payments" : "Continue to cards", exact: true }).click();
  await expect(page).toHaveURL(merchant ? /\/merchant-services$/ : /\/cardholder-services$/);
  await expect(page.getByRole("heading", {name: merchant ? "Merchant overview" : "Cardholder services", level: 1, exact: true})).toBeVisible();
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

async function addCard(page: Page, name: string, holderName: string) {
  const dashboard=await cardDashboard(page.request), serviceId=dashboard.primaryService!.id;
  const before=await getCardholderFunds(dashboard.person.id,serviceId);
  const card=await addUnfundedCard(page,name,holderName);
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
    await expect(page.getByRole("heading", { name: "Let’s get you started.", exact: true })).toBeVisible();
    await accessible(page);
    await join(page, name);
    await expect(page.getByRole("link", { name: "Open customer care", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Create your first card", exact: true }).click();
    await expect(page.getByRole("dialog").getByRole("textbox", {name: "Card name", exact: true})).toBeVisible();
    await accessible(page);
    await capture(page, "cardholder-first-card-form");
    const card = await addCard(page, "My hosted practice card", name);
    await capture(page, "cardholder-created-card");
    expect(card.available.minor).toBe("0");
    const serviceId=(await cardDashboard(page.request)).primaryService!.id;
    await addMoney(page,serviceId,"50.00");
    await setMonthlyLimit(page,serviceId,identity.personId,name,"25.00");
    const checkout=await publishedMerchantFixture("525","Sandbox groceries");
    const payment=await payPublished(page,checkout.publication,card.id);
    expect((await getCardholderFunds(identity.personId,serviceId)).available.minor).toBe("4475");
    expect(await getPersonSpending(identity.personId,serviceId,identity.personId)).toMatchObject({
      spentThisMonth:{minor:"525"},remainingThisMonth:{minor:"1975"},available:{minor:"1975"},
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
    const invite = page.getByRole("dialog", { name: "Invite a person", exact: true });
    await invite.getByRole("textbox", { name: "Member code", exact: true }).fill(joined.memberCode!);
    await invite.getByRole("button", { name: "Find member", exact: true }).click();
    await expect(invite).toContainText(`Selected: ${secondName}`);
    await expect(invite).toContainText("Purchases allowed on their own cards");
    await expect(invite.getByRole("radio")).toHaveCount(0);
    await invite.getByRole("button", { name: "Review access", exact: true }).click();
    await page.getByRole("dialog", { name: "Review cardholder access", exact: true }).getByRole("button", { name: "Save invitation", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await acceptOnlyInvitation(secondaryPage);
    await secondaryPage.goto("/cardholder-services");
    const waiting=secondaryPage.getByRole("region",{name:"Your primary is preparing your card",exact:true});
    await expect(waiting).toContainText(`Cards with ${name}`);
    await expect(waiting).toContainText("INVITATION ACCEPTED");
    await expect(waiting).toContainText("Your card will appear here when your primary cardholder creates it");
    await expect(secondaryPage.getByRole("button",{name:"Create your first card",exact:true})).toBeHidden();
    await secondaryPage.getByText("Optional: start your own card group",{exact:true}).click();
    await expect(secondaryPage.getByRole("button",{name:"Create your first card",exact:true})).toBeVisible();
    await secondaryPage.getByText("Optional: start your own card group",{exact:true}).click();
    expect((await cardDashboard(secondaryPage.request)).primaryService).toBeNull();
    await secondaryPage.reload();
    await expect(waiting).toBeVisible();
    await accessible(secondaryPage);
    await setMonthlyLimit(page,serviceId,secondary.personId,secondName,"25.00");
    expect((await getCardholderFunds(identity.personId,serviceId)).available.minor).toBe("4475");
    await page.goto(`/cardholder-services?view=cardholders&focus=${card.id}`);
    await page.locator("button.ws-person-row").filter({hasText:secondName}).click();
    await expect(page.getByRole("region",{name:`Cards for ${secondName}`,exact:true})).toContainText("Ready for their first card");
    await capture(page, "cardholder-accepted-before-card");
    await page.getByRole("region",{name:`Cards for ${secondName}`,exact:true}).getByRole("link", {name: "Add their first card →", exact: true}).click();
    await expect(page.getByRole("dialog").getByRole("radio", {name: new RegExp(secondName)})).toBeChecked();
    const secondaryCard = await addCard(page, "Invited hosted card", secondName);
    expect(secondaryCard.available.minor).toBe("2500");
    expect((await getCardholderFunds(identity.personId,serviceId)).available.minor).toBe("4475");
    expect(await getPersonSpending(identity.personId,serviceId,secondary.personId)).toMatchObject({
      monthlyLimit:{minor:"2500"},spentThisMonth:{minor:"0"},available:{minor:"2500"},
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

test("email merchant enrolls, publishes a prepaid checkout, refunds, requests a deposit and shares only its submerchant", async ({ page, browser }) => {
  test.setTimeout(180_000);
  const identity = await syntheticSession(page);
  const colleagueContext = await browser.newContext({ baseURL: "http://127.0.0.1:3100", viewport: page.viewportSize() });
  const colleaguePage = await colleagueContext.newPage(), colleague = await syntheticSession(colleaguePage);
  const name = `Hosted sample shop ${randomUUID().slice(0, 8)}`, colleagueName = "Hosted merchant colleague";
  const payerContext=await browser.newContext({baseURL:"http://127.0.0.1:3100",viewport:page.viewportSize()});
  const payerPage=await payerContext.newPage();
  const payer=await prepaidPayer(payerPage,"Hosted checkout customer "+randomUUID().slice(0,8));
  const operatorContext=await browser.newContext({baseURL:"http://127.0.0.1:3100",viewport:page.viewportSize()});
  const operatorPage=await operatorContext.newPage();
  let operator:Awaited<ReturnType<typeof assignedDepositOperator>>|null=null;
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
    await page.getByRole("button", { name: "Enable sandbox payments", exact: true }).click();
    await page.getByRole("dialog", { name: "Enable sandbox payments?", exact: true }).getByRole("button", { name: "Enable sandbox payments", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Your sandbox payments are ready", exact: true })).toBeVisible();
    await expect(page.getByRole("link", {name: "Create payment channel", exact: true})).toBeInViewport({ratio: 1});
    await capture(page, "merchant-setup-ready");
    await accessible(page);

    await page.getByRole("link", { name: "Create payment channel", exact: true }).click();
    const channelForm = page.getByRole("dialog", { name: "New payment channel", exact: true });
    await expect(channelForm.getByRole("button", {name: "Review channel", exact: true})).toBeInViewport({ratio: 1});
    await channelForm.getByRole("textbox", { name: "Channel name or purpose", exact: true }).fill("Hosted seven-channel order");
    await channelForm.getByRole("textbox", { name: "Amount (USD)", exact: true }).fill("12.50");
    await channelForm.getByText("More options · use, expiry and access", { exact: true }).click();
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
    expect((await getPersonSpending(payer.personId,payer.serviceId,payer.personId)).spentThisMonth.minor).toBe("1250");
    await payerPage.goto(`/checkout/${publication.id}/card?review=${first.review.id}`);
    await expect(payerPage.getByRole("heading",{name:"Payment refunded",exact:true})).toBeVisible();
    const second=await payPublished(payerPage,publication,payer.card.id);
    expect(second.paymentId).not.toBe(first.paymentId);
    expect((await getCardholderFunds(payer.personId,payer.serviceId)).available.minor).toBe("3750");
    expect(await getPersonSpending(payer.personId,payer.serviceId,payer.personId)).toMatchObject({
      monthlyLimit:{minor:"5000"},spentThisMonth:{minor:"2500"},available:{minor:"2500"},
    });
    const payout=await requestExactDeposit(page,master.id,second.paymentId);
    expect(payout.amount.minor).toBe("1250");
    expect((await operations(page,master.id)).pendingDeposits?.minor).toBe("1250");
    await page.goto("/operations/deposits");
    await expect(page.getByRole("heading",{name:"Operator access required",exact:true})).toBeVisible();
    operator=await assignedDepositOperator(operatorPage,channel.serviceId);
    await completeDeposit(operatorPage,payout.id,payout.testReference);
    const afterDeposit=await operations(page,master.id);
    expect(afterDeposit).toMatchObject({availableFunds:{minor:"0"},pendingDeposits:{minor:"0"},bankFunds:{minor:"1250"}});
    expect(afterDeposit.payouts.filter(row=>row.id===payout.id)).toHaveLength(1);
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
    expect((await merchantDashboard(payerPage.request)).units).toEqual([]);

    await page.goto(`/merchant-services?view=unit:${master.id}`);
    await page.getByRole("link", { name: "Merchants & people", exact: true }).click();
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
    await invite.getByText("Customize access", {exact:true}).click();
    for(const label of ["Create channels","Edit channels","Share channels"])await invite.locator(".mp-permission-options").getByRole("checkbox",{name:new RegExp(`^${label}`)}).uncheck();
    await invite.getByRole("button", { name: "Review invitation", exact: true }).click();
    await page.getByRole("dialog", { name: "Review merchant invitation", exact: true }).getByRole("button", { name: "Save invitation", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await acceptOnlyInvitation(colleaguePage);
    expect((await merchantDashboard(colleaguePage.request)).units.map(unit => unit.id)).toEqual([sub.id]);
    expect((await cardDashboard(colleaguePage.request)).profiles).toEqual([]);
    await colleaguePage.goto(`/merchants/${sub.id}?tab=payments`);
    await expect(colleaguePage.getByRole("heading", { name: "Hosted delegated shop", level: 1, exact: true })).toBeVisible();
    await expect(colleaguePage.getByRole("button", { name: "Request deposit", exact: true })).toHaveCount(0);
    expect((await colleaguePage.request.get(`/api/v1/merchants/${master.id}/operations`)).status()).toBe(404);
    await expect(colleaguePage.locator("main")).not.toContainText(payment.testReference);
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
  } finally {
    await identity.close(); await colleague.close(); await payer.close(); if(operator)await operator.close();
    await colleagueContext.close(); await payerContext.close(); await operatorContext.close();
  }
});

test("merchant setup recovers lost connection responses without repeating processing or reopening paused payments", async ({ page }) => {
  test.setTimeout(180_000);
  const identity = await syntheticSession(page), name = `Setup recovery ${randomUUID().slice(0, 8)}`;
  const enrollmentAttempts = new Map<string, string[]>(), lostResponses = new Set<string>();
  let processingWrites = 0;
  try {
    await page.goto("/merchant-services"); await join(page, "Setup recovery primary");
    await page.getByRole("button", { name: "Create a primary merchant", exact: true }).click();
    await page.getByRole("textbox", { name: "Primary merchant name", exact: true }).fill(name);
    await page.getByRole("button", { name: "Review merchant", exact: true }).click();
    await page.getByRole("button", { name: "Create primary merchant", exact: true }).click();
    await expect(page.getByRole("heading", { name, exact: true, level: 1 })).toBeVisible();
    const primary = (await merchantDashboard(page.request)).units.find(unit => unit.kind === "MASTER")!;
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
      await page.getByRole("button", { name: "Enable sandbox payments", exact: true }).click();
      const dialog = page.getByRole("dialog", { name: "Enable sandbox payments?", exact: true });
      await dialog.getByRole("button", { name: "Enable sandbox payments", exact: true }).click();
      await expect(dialog.getByRole("alert")).toContainText("This merchant’s connection is not yet confirmed");
      await page.getByRole("button", { name: "Retry payment setup", exact: true }).click();
      await expect(dialog).toBeHidden();
      await expect(page.getByRole("region", {name: /^(Payment setup|Getting started with payments)$/})).toContainText(/Your sandbox payments are ready|Sandbox payments are ready/);
      const commands = enrollmentAttempts.get(`/api/v1/merchants/${merchantId}/test-enrollment`)!;
      expect(commands).toHaveLength(2); expect(commands[1]).toBe(commands[0]);
      const result = await page.request.get(`/api/v1/merchants/${merchantId}/operations`);
      expect(result.status()).toBe(200);
      const operations = await result.json() as { gateway: { mode: string; version: number }; enrollment: { status: string; version: number } };
      expect(operations.gateway).toMatchObject({ mode: "TEST_READY", version: 1 });
      expect(operations.enrollment).toMatchObject({ status: "ENROLLED", version: 1 });
    }
    await enableAndRecover(primary.id); expect(processingWrites).toBe(1);
    await page.goto(`/merchant-services?view=unit:${primary.id}`);
    await page.getByRole("link", { name: "Merchants & people", exact: true }).click();
    await page.getByRole("button", { name: "Add submerchant", exact: true }).click();
    await page.getByRole("textbox", { name: "Submerchant name", exact: true }).fill(`${name} branch`);
    await page.getByRole("button", { name: "Review merchant", exact: true }).click();
    await page.getByRole("button", { name: "Create submerchant", exact: true }).click();
    await expect(page.getByRole("heading", { name: `${name} branch`, exact: true, level: 1 })).toBeVisible();
    const sub = (await merchantDashboard(page.request)).units.find(unit => unit.kind === "SUB")!;
    await enableAndRecover(sub.id); expect(processingWrites).toBe(1);
    await page.goto(`/merchants/${primary.id}?tab=verification`);
    await page.getByText("Advanced payment settings", { exact: true }).click();
    await page.getByRole("button", { name: "Turn off payments", exact: true }).click();
    await page.getByRole("dialog", { name: "Turn off sandbox payments?", exact: true }).getByRole("button", { name: "Confirm setting", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.goto(`/merchants/${sub.id}?tab=channels`);
    await expect(page.getByRole("heading", { name: "Payments need your attention", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Enable sandbox payments", exact: true })).toHaveCount(0);
    expect(processingWrites).toBe(2);
    const paused = await page.request.get(`/api/v1/merchants/${sub.id}/operations`);
    expect((await paused.json() as { gateway: { mode: string } }).gateway.mode).toBe("DISABLED");
  } finally { await identity.close(); }
});
