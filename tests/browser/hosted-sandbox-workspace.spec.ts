import {payNetworkPublished} from "./helpers/network";
import {createCardUI,inviteCardUI,acceptCardUI,signInVerified} from "./helpers/card-invitation";
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
  addMoney, setCardAllowance, addUnfundedCard, publishedMerchantFixture,
  publishCustomerLink, payPublished, refundPayment, settleExactPayment,
  operations, getCardholderFunds, getCardSpending, requireFictionalTestDatabase,
} from "./helpers/prepaid-journey";

test.use({actionTimeout:15_000,navigationTimeout:20_000});
test.beforeAll(requireFictionalTestDatabase);
test.afterAll(closeDatabase);

async function syntheticSession(page: Page) {
  // Synthetic identity/session setup in the isolated test DB only. Every service,
  // membership and financial effect below comes from canonical application commands.
  // Saved historical card-review fixtures and merchant setup are explicit in their helpers.
  const identity = await bindIdentity(`${targets.netlify.canonical_origin}/.netlify/identity`, randomUUID());
  const sessions = new SessionService(sessionRepository, { appEnv: "test", publicOrigin: "http://127.0.0.1:3100" });
  const session = await sessions.issue(identity), pair = session.cookie.split(";", 1)[0]!;
  await page.context().addCookies([{ name: pair.slice(0, pair.indexOf("=")), value: pair.slice(pair.indexOf("=") + 1), domain: "127.0.0.1", path: "/", httpOnly: true, sameSite: "Strict", expires: Math.floor(session.record.expiresAt.getTime() / 1000) }]);
  return { personId: identity.personId, close: () => sessions.logout(pair) };
}

async function join(page: Page, name: string) {
  await page.getByRole("textbox", { name: "Your name", exact: true }).fill(name);
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  const merchant = new URL(page.url()).pathname === "/merchant-services";
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL(merchant ? /\/merchant-services$/ : /\/cardholder-services$/);
  await expect(page.getByRole("heading", {name: merchant ? "Overview" : "Account home", level: 1, exact: true})).toBeVisible();
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

async function addCard(page: Page, name: string, allowance="0.00") {
  const dashboard=await cardDashboard(page.request), serviceId=dashboard.primaryService!.id;
  const before=await getCardholderFunds(dashboard.person.id,serviceId);
  const card=await addUnfundedCard(page,name,allowance);
  expect((await getCardholderFunds(dashboard.person.id,serviceId)).available.minor).toBe(before.available.minor);
  return card;
}


test("email member creates cards, reviews support and reports, and shares an exact card invitation", async ({ page, browser }) => {
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
    await page.getByRole("button", { name: "Open a card account", exact: true }).click();
    await expect(page.getByRole("link",{name:"Add card",exact:true})).toBeVisible();
    await accessible(page);
    await capture(page, "cardholder-first-card-form");
    const card = await addCard(page, "My hosted practice card");
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
    const dialog=page.getByRole("dialog");
    for (const action of ["Freeze", "Unfreeze"] as const) {
      await page.getByRole("region",{name:"Card controls",exact:true}).getByRole("button", { name: `${action} card`, exact: true }).click();
      await dialog.getByRole("button", { name: `${action} card`, exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(page.getByRole("region",{name:"Card controls",exact:true}).getByRole("button", { name: action === "Freeze" ? "Unfreeze card" : "Freeze card", exact: true })).toBeVisible();
    }
    await page.keyboard.press("Escape");
    await page.goto(`/cardholder-services?focus=${card.id}`);
    await expect(page.getByRole("region", { name: "Selected card overview", exact: true })).toContainText("$19.75");
    await accessible(page);
    await page.getByRole("region",{name:"Card management details",exact:true}).getByRole("link", { name: /Statements & reports/ }).click();
    await expect(page.locator("main")).toContainText(checkout.publication.merchantName);
    expect(payment.reference).toBeTruthy();
    const downloading = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download CSV", exact: true }).click();
    expect((await downloading).suggestedFilename()).toMatch(/^etail-card-activity-/);
    await page.goto(`/cardholder-services?focus=${card.id}`);
    await page.getByRole("region",{name:"Card management details",exact:true}).getByRole("link",{name:"Notification preferences",exact:true}).click();
    await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/settings"&&url.searchParams.get("focus")===card.id);
    await page.getByRole("checkbox").first().uncheck();
    await page.getByRole("button", { name: "Save preferences", exact: true }).click();
    await expect(page.locator("main")).toContainText("Notification preferences saved");
    await page.reload();
    await expect(page.getByRole("checkbox").first()).not.toBeChecked();
    await page.goto(`/cardholder-services?focus=${card.id}`);
    await page.getByRole("region",{name:"Card management details",exact:true}).getByRole("link",{name:"Help with this card",exact:true}).click();
    await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/help"&&url.searchParams.get("focus")===card.id);
    await page.getByRole("button", { name: "Start a case", exact: true }).click();
    await page.getByRole("textbox", { name: "Subject", exact: true }).fill("My hosted card question");
    await page.getByRole("textbox", { name: "Your explanation", exact: true }).fill("Please explain my sandbox purchase controls.");
    await page.getByRole("button", { name: "Review case", exact: true }).click();
    await page.getByRole("button", { name: "Create case", exact: true }).click();
    await expect(page.getByRole("heading", { name: "My hosted card question", exact: true })).toBeVisible();

    await startSandbox(secondary.personId, { commandId: randomUUID(), displayName: secondName, acknowledged: true });
    const recipientEmail=`hosted-card-${randomUUID()}@example.test`;
    await signInVerified(secondaryPage,secondary.personId,recipientEmail);
    expect((await cardDashboard(page.request)).primaryService!.id).toBe(serviceId);
    const secondaryCard=await createCardUI(page,"Invited hosted card","25.00");
    expect(secondaryCard.assignmentState).toBe("UNASSIGNED");
    expect((await secondaryPage.request.get(`/api/v1/cardholder-services/${serviceId}/workspace`)).status()).toBe(404);
    await capture(page,"cardholder-created-before-invitation");
    const invitationId=await inviteCardUI(page,secondaryCard.id,recipientEmail);
    await acceptCardUI(secondaryPage,invitationId);
    expect((await cardDashboard(secondaryPage.request)).primaryService).toBeNull();
    await accessible(secondaryPage);
    expect(secondaryCard.available.minor).toBe("2500");
    expect((await getCardholderFunds(identity.personId,serviceId)).available.minor).toBe("4475");
    expect(await getCardSpending(identity.personId,serviceId,secondaryCard.id)).toMatchObject({
      allowance:{minor:"2500"},used:{minor:"0"},available:{minor:"2500"},
    });
    await secondaryPage.goto(`/cardholder-services?focus=${secondaryCard.id}`);
    await expect(secondaryPage.getByRole("heading",{name:"No cards available",exact:true})).toHaveCount(0);
    await expect(secondaryPage.getByRole("region", { name: "Selected card overview", exact: true })).toContainText("Invited hosted card");
    expect((await cardDashboard(secondaryPage.request)).cards.map(row => row.id)).toEqual([secondaryCard.id]);
    expect((await merchantDashboard(secondaryPage.request)).units).toEqual([]);
    expect((await secondaryPage.request.get(`/api/v1/cardholder-services/${serviceId}/funds`)).status()).toBe(403);
    await expect(secondaryPage.getByRole("navigation",{name:"Cards and spending navigation"}).getByRole("link",{name:"Account balance",exact:true})).toHaveCount(0);
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

  try {
    await page.goto("/merchant-services");
    await join(page, "Hosted shop primary");
    await page.getByRole("button", { name: "Add your business", exact: true }).click();
    await page.getByRole("textbox", { name: "Business name", exact: true }).fill(name);
    await page.getByRole("dialog").getByRole("button", { name: "Add your business", exact: true }).click();
    await expect(page.getByRole("region",{name:"Selected payment terminal",exact:true}).getByRole("heading", { name, level: 1, exact: true })).toBeVisible();
    const master = (await merchantDashboard(page.request)).units.find(unit => unit.ownerAccess && unit.name === name)!;
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
    await page.goto(`/merchants/${master.id}?tab=verification`);
    await page.getByRole("button", { name: "Enable payments", exact: true }).click();
    await page.getByRole("dialog", { name: "Enable payments?", exact: true }).getByRole("button", { name: "Enable payments", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Your payments are ready", exact: true })).toBeVisible();
    const createRequest = page.getByRole("link", { name: "Create payment request", exact: true });
    await createRequest.focus();
    await expect(createRequest).toBeInViewport({ratio: 1});
    await capture(page, "merchant-setup-ready");
    await accessible(page);

    await page.getByRole("link", { name: "Create payment request", exact: true }).click();
    const channelForm = page.getByRole("dialog", { name: "New payment request", exact: true });
    await expect(channelForm.getByRole("button", {name: "Review request", exact: true})).toBeInViewport({ratio: 1});
    await channelForm.getByRole("textbox", { name: "What is this payment for?", exact: true }).fill("Hosted seven-channel order");
    await channelForm.getByRole("textbox", { name: "Amount (USD)", exact: true }).fill("12.50");
    await channelForm.getByText("More options · use and expiry", { exact: true }).click();
    await channelForm.getByRole("combobox", { name: "Request use", exact: true }).selectOption("REUSABLE");
    await channelForm.getByLabel("Expires at (UTC)", { exact: true }).fill(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16));
    for (const label of ["SMS / text", "Email", "Invoice", "Bill", "Social media", "QR code", "Website link"]) await channelForm.getByRole("checkbox", { name: label, exact: true }).setChecked(true);
    await expect(channelForm.getByRole("button", {name: "Review request", exact: true})).toBeInViewport({ratio: 1});
    await capture(page, "merchant-channel-form");
    await channelForm.getByRole("button", { name: "Review request", exact: true }).click();
    const saving = page.waitForResponse(response => new URL(response.url()).pathname === `/api/v1/merchants/${master.id}/channels` && response.request().method() === "POST");
    await page.getByRole("dialog", { name: "Review payment request", exact: true }).getByRole("button", { name: "Save payment request", exact: true }).click();
    const response = await saving; expect(response.status()).toBe(200);
    const channel = paymentChannelSchema.parse(await response.json());
    expect(channel.presentations).toHaveLength(7);
    const channelDetails=page.getByRole("dialog",{name:"Payment request details",exact:true});
    await channelDetails.getByRole("button",{name:"Allow payments",exact:true}).click();
    await page.getByRole("dialog",{name:"Allow payments for this request?",exact:true}).getByRole("button",{name:"Confirm setting",exact:true}).click();
    await expect(channelDetails.getByRole("heading",{name:"Your request can accept payments",exact:true})).toBeVisible();
    await expect(channelDetails.getByRole("link",{name:"Try a practice payment",exact:true})).toHaveCount(0);
    const publication=await publishCustomerLink(page,master.id,channel.id);
    await capture(page,"merchant-published-channel");
    await accessible(page);

    const first=await payNetworkPublished(payerPage,publication);
    await capture(payerPage,"merchant-customer-checkout-receipt");
    await page.goto(`/merchants/${master.id}?tab=payments&payment=${first.paymentId}`);
    await expect(page.getByRole("dialog",{name:"Payment details",exact:true})).toContainText(first.reference);
    await capture(page,"merchant-receipt");
    const payment=await refundPayment(page,master.id,first.paymentId,first.reference);
    await payerPage.goto(first.url);
    await expect(payerPage.getByRole("heading",{name:"Payment refunded",exact:true})).toBeVisible();
    const second=await payNetworkPublished(payerPage,publication);
    expect(second.paymentId).not.toBe(first.paymentId);
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
    expect((await payerPage.request.get("/api/v1/merchants/dashboard")).status()).toBe(401);

    await page.goto(`/merchant-services?section=merchants`);
    await page.getByRole("button", { name: "Create terminal", exact: true }).click();
    await page.getByRole("dialog",{name:"Create terminal",exact:true}).getByRole("radio",{name:/^For your use/}).check();
    await page.getByRole("textbox", { name: "Payment terminal name", exact: true }).fill("Hosted delegated shop");
    await page.getByRole("dialog").getByRole("button", { name: "Create terminal", exact: true }).click();
    await expect(page.getByRole("region",{name:"Selected payment terminal",exact:true}).getByRole("heading", { name: "Hosted delegated shop", level: 1, exact: true })).toBeVisible();
    const sub = (await merchantDashboard(page.request)).units.find(unit => unit.name === "Hosted delegated shop")!;
    await startSandbox(colleague.personId, { commandId: randomUUID(), displayName: colleagueName, acknowledged: true });
    const colleagueEmail=`hosted-terminal-${randomUUID()}@example.test`;await signInVerified(colleaguePage,colleague.personId,colleagueEmail);
    await page.goto(`/merchants/${sub.id}?tab=people`);
    await page.getByRole("button", { name: "Invite a person", exact: true }).click();
    const invite = page.getByRole("dialog", { name: "Invite a person", exact: true });
    await invite.getByRole("textbox", { name: "Recipient email", exact: true }).fill(colleagueEmail);
    await expect(invite.getByRole("checkbox")).toHaveCount(0);
    await invite.getByRole("button", { name: "Review invitation", exact: true }).click();
    await page.getByRole("dialog", { name: "Review payment access", exact: true }).getByRole("button", { name: "Save invitation", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button",{name:"Share invitation",exact:true}).click();
    const invitationLink=page.getByRole("dialog",{name:"Share invitation",exact:true}).getByRole("textbox",{name:"Invitation link",exact:true});await expect(invitationLink).toBeVisible();const invitationId=new URL(await invitationLink.inputValue()).pathname.split("/").at(-1)!;
    await colleaguePage.goto(`/invitations/${invitationId}`);await colleaguePage.getByRole("button",{name:"Accept invitation",exact:true}).click();await colleaguePage.getByRole("link",{name:"Open your payment terminal",exact:true}).click();await expect(colleaguePage).toHaveURL(new RegExp(`/merchants/${sub.id}`));
    expect((await merchantDashboard(colleaguePage.request)).units.map(unit => unit.id)).toEqual([sub.id]);
    expect((await cardDashboard(colleaguePage.request)).profiles).toEqual([]);
    await colleaguePage.goto(`/merchants/${sub.id}?tab=payments`);
    await expect(colleaguePage.getByRole("region",{name:"Selected payment terminal",exact:true}).getByRole("heading", { name: "Hosted delegated shop", level: 1, exact: true })).toBeVisible();
    await expect(colleaguePage.getByRole("button", { name: "Review settlement", exact: true })).toHaveCount(0);
    expect((await colleaguePage.request.get(`/api/v1/merchants/${master.id}/operations`)).status()).toBe(404);
    await expect(colleaguePage.locator("main")).not.toContainText(payment.testReference);
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
  } finally {
    await identity.close(); await colleague.close();
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
    await page.getByRole("button", { name: "Add your business", exact: true }).click();
    await page.getByRole("textbox", { name: "Business name", exact: true }).fill(name);
    await page.getByRole("dialog").getByRole("button", { name: "Add your business", exact: true }).click();
    await expect(page.getByRole("region",{name:"Selected payment terminal",exact:true}).getByRole("heading", { name, exact: true, level: 1 })).toBeVisible();
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
      await page.getByRole("group",{name:"Terminal sections",exact:true}).getByRole("link",{name:"Terminal controls",exact:true}).click();
      const controls=page.getByRole("region",{name:"Terminal controls",exact:true}).locator(":scope > details");
      if(await controls.getAttribute("open")===null)await controls.locator(":scope > summary").click();
      await expect(page.getByRole("navigation",{name:"Payment terminal navigation"})).toHaveCount(0);
      await expect(page).toHaveURL(url=>url.pathname===`/merchants/${merchantId}`&&url.hash==="#terminal-verification");
      await page.getByRole("button", { name: "Enable payments", exact: true }).click();
      const dialog = page.getByRole("dialog", { name: "Enable payments?", exact: true });
      await dialog.getByRole("button", { name: "Enable payments", exact: true }).click();
      await expect(dialog.getByRole("alert")).toContainText("We have not yet confirmed whether payments are enabled for this terminal");
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
    await page.getByRole("button", { name: "Create terminal", exact: true }).click();
    await page.getByRole("dialog",{name:"Create terminal",exact:true}).getByRole("radio",{name:/^For your use/}).check();
    await page.getByRole("textbox", { name: "Payment terminal name", exact: true }).fill(`${name} branch`);
    await page.getByRole("dialog").getByRole("button", { name: "Create terminal", exact: true }).click();
    await expect(page.getByRole("region",{name:"Selected payment terminal",exact:true}).getByRole("heading", { name: `${name} branch`, exact: true, level: 1 })).toBeVisible();
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
