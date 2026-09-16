import {prepareCardCheckout} from "../../src/modules/acquiring/card-checkout-service";
import {fundCardGroup} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { identityBindings, permissionGrants } from "../../src/platform/database/schema";
import { SessionService } from "../../src/modules/identity";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { controlCard, getCardholderFunds } from "../../src/modules/workspace/service";
import { cardholderDashboardSchema } from "../../src/modules/workspace/api-contracts";
import { cardPerson, cardPrimary, enrollCardholder, issuePracticeCard } from "../helpers/cardholder";
import {freshPublishedPayment,openSavedCardReview} from "./helpers/prepaid";

const origin = "http://127.0.0.1:3100";
test.afterAll(closeDatabase);

async function signIn(page: Page, personId: string) {
  const [identity] = await getDb().select().from(identityBindings).where(and(eq(identityBindings.personId, personId), eq(identityBindings.issuer, "urn:etail:isolated-fixture")));
  if (!identity) throw new Error("Expected an isolated fictional identity");
  const session = await new SessionService(sessionRepository, { appEnv: "test", publicOrigin: origin }).issue({ personId, identityId: identity.id });
  const pair = session.cookie.split(";", 1)[0]!;
  await page.context().addCookies([{ name: pair.slice(0, pair.indexOf("=")), value: pair.slice(pair.indexOf("=") + 1), domain: "127.0.0.1", path: "/", httpOnly: true, sameSite: "Strict", expires: Math.floor(session.record.expiresAt.getTime() / 1000) }]);
}

async function dashboard(page: Page, scope = "ALL", search = "") {
  const query = new URLSearchParams({ cardScope: scope, cardSearch: search });
  const response = await page.request.get(`/api/v1/cardholder-services?${query}`);
  expect(response.status()).toBe(200);
  return cardholderDashboardSchema.parse(await response.json());
}

test("cardholder navigation separates account money from cards and keeps holder preferences private", async ({page}) => {
  const primary=await cardPrimary(`Simple primary ${randomUUID().slice(0,8)}`),holder=await cardPerson("Simple secondary");
  await enrollCardholder(primary.personId,primary.serviceId,holder);
  await fundCardGroup(primary.personId,primary.serviceId,"8500");


  const own=await issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Simple everyday card", undefined, "4000");
  const shared=await issuePracticeCard(primary.personId, primary.serviceId, holder, "Simple shared card", undefined, "2500");
  const funds=await getCardholderFunds(primary.personId,primary.serviceId);
  await signIn(page,primary.personId);
  await page.goto(`/cardholder-services?focus=${own.card.id}`);
  const navigation=page.getByRole("navigation",{name:"Cards and spending navigation",exact:true});
  await expect(navigation.getByRole("link")).toHaveText(["Account home","Cards","Activity","Account settings"]);
  const overview=page.getByRole("region",{name:"Selected card overview",exact:true});
  await expect(overview.locator(".ch-focus-balance")).toContainText("Available on this card");
  await expect(overview.locator(".ch-focus-balance")).toContainText("$40.00");
  await expect(page.getByRole("region",{name:"Card controls",exact:true}).getByRole("button",{name:"Freeze card",exact:true})).toBeVisible();
  const group=page.getByRole("region",{name:"Card account balance",exact:true});
  await expect(group).toHaveCount(0);
  await expect(navigation.getByRole("link",{name:"Cards",exact:true})).toHaveAttribute("aria-current","page");
  await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
  await expect(page.getByRole("link",{name:"Add card",exact:true})).toHaveCount(0);
  const totalAllowance=overview.getByText(/^Total spending limit/);
  await expect(totalAllowance).toHaveCount(1);
  await expect(totalAllowance).toBeVisible();
  await expect(overview.locator(".ch-limit-summary>div").filter({hasText:"Total spending limit"}).locator("dd")).toHaveText("$40.00");
  await expect(page.getByRole("link",{name:/^(Manage card|Managed cards|Card settings)$/})).toHaveCount(0);
  await expect(page.getByRole("region",{name:"Card management details",exact:true}).getByRole("article",{name:"Card spending limit",exact:true})).toContainText("$40.00");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("region",{name:"Cardholder",exact:true})).toContainText("This card is for your use.");
  await expect(page.getByRole("heading",{name:"Recent activity",exact:true})).toBeVisible();
  await expect(navigation.getByText("More",{exact:true})).toHaveCount(0);
  await expect(navigation.getByRole("link",{name:"Account settings",exact:true})).toHaveAttribute("href",`/cardholder-services/settings?context=${primary.serviceId}`);
  await navigation.getByRole("link",{name:"Cards",exact:true}).click();
  const cardNavigation=page.getByRole("navigation",{name:"Card management",exact:true});
  await expect(cardNavigation.getByRole("link")).toHaveText(["Card list","Cardholders","Card history"]);
  await expect(page.getByRole("link",{name:"Add card",exact:true})).toHaveCount(1);
  await expect(cardNavigation.getByRole("link",{name:"Card history",exact:true})).toHaveAttribute("href","/cardholder-services/card-requests");
  await cardNavigation.getByRole("link",{name:"Card history",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/card-requests"&&!url.searchParams.has("view")&&!url.searchParams.has("focus"));
  await expect(navigation.getByRole("link",{name:"Cards",exact:true})).toHaveAttribute("aria-current","page");
  await expect(cardNavigation.getByRole("link",{name:"Card history",exact:true})).toHaveAttribute("aria-current","page");
  await navigation.getByRole("link",{name:"Account home",exact:true}).click();
  await expect(overview).toHaveCount(0);
  await expect(group).toContainText("Available to spend");await expect(group).toContainText("$85.00");
  await expect(group.getByRole("link",{name:"Add money",exact:true})).toHaveAttribute("href",`/money-accounts/${funds.moneyAccountId}/add-money`);
  await expect(group.getByRole("link",{name:"Money activity",exact:true})).toHaveAttribute("href",`/money-accounts/${funds.moneyAccountId}`);
  await expect(page.getByRole("combobox",{name:"Selected card",exact:true})).toHaveCount(0);
  await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(1);
  await expect(page.getByRole("link",{name:/^(Withdraw|Return unused money)$/})).toHaveCount(0);
  await expect(navigation.getByRole("link",{name:"Account balance",exact:true})).toHaveCount(0);
  await expect(page.getByRole("link",{name:"Add card",exact:true})).toHaveCount(0);
  await expect(cardNavigation).toHaveCount(0);
  await group.getByRole("link",{name:"Add money",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname===`/money-accounts/${funds.moneyAccountId}/add-money`&&!url.searchParams.has("task"));
  await expect(page.getByRole("heading",{name:"Add money",level:1,exact:true})).toBeVisible();
  await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
  await expect(navigation.getByRole("link",{name:"Account home",exact:true})).toHaveAttribute("aria-current","page");
  await navigation.getByRole("link",{name:"Account settings",exact:true}).click();
  await expect(page).toHaveURL(new RegExp(`/cardholder-services/settings\\?context=${primary.serviceId}$`));
  await expect(page.getByRole("heading",{name:"Account settings",level:1,exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Account details",level:2,exact:true})).toBeVisible();
  await expect(page.locator("main")).not.toContainText("Signed in as");
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await expect(page.locator("main")).toContainText("Prepaid card balance");
  await expect(page.getByRole("link",{name:"Return unused money",exact:true})).toHaveAttribute("href",`/money-accounts/${funds.moneyAccountId}/withdraw`);

  await page.goto(`/cardholder-services?card=${shared.card.id}`);
  const allowance=page.getByRole("region",{name:"Card management details",exact:true}).getByRole("article",{name:"Card spending limit",exact:true});
  await expect(allowance).toContainText("$25.00");
  const limitGrant=and(eq(permissionGrants.personId,primary.personId),eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.action,"cardholder.limits.manage"));
  expect(await getDb().update(permissionGrants).set({state:"REVOKED"}).where(limitGrant).returning({action:permissionGrants.action})).toHaveLength(1);
  await page.reload();await expect(allowance).toHaveCount(0);
  expect(await getDb().update(permissionGrants).set({state:"ACCEPTED"}).where(limitGrant).returning({action:permissionGrants.action})).toHaveLength(1);
  await page.reload();await expect(allowance).toBeVisible();

  await signIn(page,holder);await page.goto(`/cardholder-services?focus=${shared.card.id}`);
  await expect(overview.locator(".ch-focus-balance")).toContainText("$25.00");
  await expect(page.locator("main")).not.toContainText(own.card.nickname);
  await expect(group).toHaveCount(0);
  await expect(page.getByRole("article",{name:"Card spending limit",exact:true})).toHaveCount(0);
  await expect(page.getByRole("button",{name:"Invite cardholder",exact:true})).toHaveCount(0);
  await expect(navigation.getByRole("link")).toHaveText(["Account home","Cards","Activity","Preferences"]);
  await expect(navigation.getByRole("link",{name:"Account balance",exact:true})).toHaveCount(0);
  await expect(navigation.getByRole("link",{name:"Account settings",exact:true})).toHaveCount(0);
  await expect(navigation.getByRole("link",{name:"Preferences",exact:true})).toHaveAttribute("href",`/cardholder-services/cards/${shared.card.id}/settings`);
  await navigation.getByRole("link",{name:"Cards",exact:true}).click();
  await expect(page.getByRole("navigation",{name:"Card management",exact:true})).toHaveCount(0);
  await expect(page.getByRole("navigation",{name:"Card ownership",exact:true})).toHaveCount(0);
  await expect(page.getByRole("searchbox",{name:"Search your cards",exact:true})).toBeVisible();
  await expect(page.getByRole("link",{name:"Add card",exact:true})).toHaveCount(0);
  await page.goto(`/cardholder-services?${new URLSearchParams({view:"cards",cardScope:"MANAGED",cardSearch:shared.card.nickname})}`);
  await expect(page.locator(".ch-card")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(own.card.nickname);
  await page.getByRole("link",{name:"View your cards",exact:true}).click();
  await expect(page).toHaveURL(url=>url.searchParams.get("cardScope")==="ALL"&&url.searchParams.get("cardSearch")===shared.card.nickname);
  await expect(page.getByRole("searchbox",{name:"Search your cards",exact:true})).toHaveValue(shared.card.nickname);
  await expect(page.locator(".ch-card")).toHaveCount(1);
  await expect(page.locator(".ch-card")).toContainText(shared.card.nickname);
  await expect(page.locator("main")).not.toContainText(own.card.nickname);
  await navigation.getByRole("link",{name:"Preferences",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Preferences",level:1,exact:true})).toBeVisible();
  await expect(page.getByRole("link",{name:"Return unused money",exact:true})).toHaveCount(0);
  await page.getByRole("button",{name:"Find a task",exact:true}).click();
  await expect(page.getByRole("dialog").getByRole("link",{name:/^Add money /})).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.locator("main")).not.toContainText(own.card.nickname);
  await page.setViewportSize({width:320,height:900});
  expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
});

test("account overview stays separate while named card categories survive filters, search and reload", async ({ page }) => {
  test.setTimeout(120_000);
  const primary = await cardPrimary(`Avery ${randomUUID().slice(0, 8)}`);
  const otherPrimary = await cardPrimary(`Casey ${randomUUID().slice(0, 8)}`);
  const managedHolder = await cardPerson("Jordan Filters");
  await enrollCardholder(primary.personId, primary.serviceId, managedHolder);
  await enrollCardholder(otherPrimary.personId, otherPrimary.serviceId, primary.personId);
  const own = await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"4200");return issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Everyday in my name", undefined, "2400");})();
  const received = await (async()=>{await fundCardGroup(otherPrimary.personId,otherPrimary.serviceId,"7300");return issuePracticeCard(otherPrimary.personId, otherPrimary.serviceId, primary.personId, "Shared travel in my name", undefined, "3100");})();
  const managed = await (async()=>{return issuePracticeCard(primary.personId, primary.serviceId, managedHolder, "Jordan daily card", undefined, "1800");})();
  const funds=await getCardholderFunds(primary.personId,primary.serviceId);
  await signIn(page, primary.personId);

  await page.goto("/cardholder-services");
  const groupBalance=page.getByRole("region",{name:"Card account balance",exact:true});
  const account=page.getByRole("region",{name:"Your card account",exact:true});
  await expect(groupBalance).toContainText("$42.00");
  await expect(account.locator(".ch-account-counts>div").filter({hasText:"Cards in this account"}).locator("dd")).toHaveText("2");
  await expect(page.getByRole("combobox",{name:"Selected card",exact:true})).toHaveCount(0);
  const selected=page.getByRole("region",{name:"Selected card overview",exact:true});
  await expect(selected).toHaveCount(0);
  await account.getByRole("link",{name:"View cards",exact:true}).click();
  for(const card of [own.card,received.card,managed.card])await expect(page.getByRole("link",{name:new RegExp(`^Open ${card.nickname},`)})).toBeVisible();
  await page.getByRole("link",{name:new RegExp(`^Open ${received.card.nickname},`)}).click();
  await expect(page).toHaveURL(url=>url.pathname===`/cardholder-services/cards/${received.card.id}`&&!url.searchParams.has("view")&&!url.searchParams.has("focus"));
  await expect(selected).toContainText(received.card.nickname);
  await expect(selected).toContainText(`Account owner: ${(await dashboard(page)).profiles.find(profile=>profile.id===otherPrimary.serviceId)!.primaryName}`);
  await expect(selected.locator(".ch-focus-balance")).toContainText("$31.00");
  await expect(groupBalance).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText("$73.00");
  await page.reload();await expect(groupBalance).toHaveCount(0);await expect(selected).toContainText(received.card.nickname);
  const navigation=page.getByRole("navigation",{name:"Cards and spending navigation",exact:true});
  await expect(navigation.getByRole("link",{name:"Account balance",exact:true})).toHaveCount(0);
  await expect(navigation.getByRole("link",{name:"Account settings",exact:true})).toHaveAttribute("href",`/cardholder-services/settings?context=${primary.serviceId}`);
  await page.getByRole("button",{name:"Find a task",exact:true}).click();
  const tasks=page.getByRole("dialog",{name:"What would you like to do?",exact:true});
  const cardsTask=tasks.getByRole("link",{name:"Cards Add a card, assign its cardholder or manage its spending limit",exact:true});
  await expect(cardsTask).toHaveAttribute("href","/cardholder-services/cards");
  await expect(tasks.getByRole("link",{name:/^Cardholders Manage people/})).toHaveAttribute("href","/cardholder-services/cardholders");
  await expect(tasks.getByRole("link",{name:/^Card history Continue saved/})).toHaveAttribute("href","/cardholder-services/card-requests");
  await expect(tasks.getByRole("link",{name:/^Find a transaction Search/})).toHaveAttribute("href",`/cardholder-services/cards/${received.card.id}/activity`);
  await expect(tasks.getByRole("link",{name:/^Account settings Account information/})).toHaveAttribute("href",`/cardholder-services/settings?context=${primary.serviceId}`);
  await expect(tasks.getByRole("link",{name:/^Add money Add money/})).toHaveAttribute("href",`/money-accounts/${funds.moneyAccountId}/add-money`);
  await cardsTask.click();
  await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/cards"&&!url.searchParams.has("view")&&!url.searchParams.has("focus"));
  await expect(page.getByRole("heading",{name:"Cards",level:1,exact:true})).toBeVisible();
  await expect(page.getByRole("link",{name:"Add card",exact:true})).toHaveCount(1);
  await expect(selected).toHaveCount(0);
  await navigation.getByRole("link",{name:"Account home",exact:true}).click();
  await expect(page).toHaveURL(url=>!url.searchParams.has("focus"));
  await expect(groupBalance).toContainText("$42.00");
  await expect(selected).toHaveCount(0);
  await expect(navigation.getByRole("link",{name:"Activity",exact:true})).toHaveAttribute("href",`/cardholder-services/activity?context=${primary.serviceId}`);
  await expect(page.locator("main")).not.toContainText("$73.00");

  const groups = [
    { scope: "OWN", label: /^For your use/, names: [own.card.nickname, received.card.nickname], ids: [own.card.id, received.card.id] },
    { scope: "MANAGED", label: /^For others/, names: [managed.card.nickname], ids: [managed.card.id] },
    { scope: "ALL", label: /^All cards/, names: [own.card.nickname, received.card.nickname, managed.card.nickname], ids: [own.card.id, received.card.id, managed.card.id] },
  ];
  await page.goto("/cardholder-services?view=cards");
  for (const group of groups) {
    await page.getByRole("navigation", { name: "Card ownership", exact: true }).getByRole("link", { name: group.label }).click();
    await expect(page).toHaveURL(new RegExp(`cardScope=${group.scope}`));
    await expect(page.locator(".ch-card")).toHaveCount(group.ids.length);
    for (const name of group.names) {
      const row=page.locator(".ch-card").filter({hasText:name});
      await expect(row).toHaveCount(1);
      await expect(row.locator(".ch-list-card-name>strong")).toHaveText(name);
      await expect(row.locator(".ch-list-card-name>span")).toContainText("Ending ");
    }
    await page.reload();
    expect(new URL(page.url()).searchParams.get("cardScope")).toBe(group.scope);
    await expect(page.locator(".ch-card")).toHaveCount(group.ids.length);
    const result = await dashboard(page, group.scope);
    expect(result.cards.map(card => card.id).sort()).toEqual([...group.ids].sort());
    expect(result).toMatchObject({ cardScope: group.scope, ownCardCount: 2, managedCardCount: 1, cardMatchCount: group.ids.length });
  }

  await page.getByRole("searchbox", { name: "Search your cards", exact: true }).fill("Jordan");
  await page.getByRole("button", { name: "Search cards", exact: true }).click();
  await expect(page).toHaveURL(/cardSearch=Jordan/);
  await expect(page.locator(".ch-card")).toHaveCount(1);
  await expect(page.locator(".ch-card")).toContainText(managed.card.nickname);
  await page.reload();
  await expect(page.getByRole("searchbox", { name: "Search your cards", exact: true })).toHaveValue("Jordan");
  const searched = await dashboard(page, "ALL", "Jordan");
  expect(searched).toMatchObject({ ownCardCount: 2, managedCardCount: 1, cardMatchCount: 1, cardSearch: "Jordan" });
  expect(searched.cards.map(card => card.id)).toEqual([managed.card.id]);
  await page.locator(".ch-card").getByRole("link", { name: /^Open Jordan daily card/ }).click();
  await expect(page.getByRole("region", { name: "Selected card overview", exact: true })).toContainText(managed.card.nickname);
  await page.getByRole("navigation", { name: "Cards and spending navigation" }).getByRole("link", { name: "Cards", exact: true }).click();
  await expect(page.getByRole("searchbox", { name: "Search your cards", exact: true })).toHaveValue("Jordan");
  await expect(page.locator(".ch-card")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Card ownership" }).getByRole("link", { name: /^All cards/ })).toHaveAttribute("aria-current", "page");
  await page.goto(`/cardholder-services?view=overview&focus=${managed.card.id}&cardScope=MANAGED&cardSearch=Jordan&page=1`);
  await expect(page.getByRole("heading",{name:"This card page is unavailable",level:1,exact:true})).toBeVisible();
  await expect(selected).toHaveCount(0);await expect(groupBalance).toHaveCount(0);
  // Account home cannot also select a card. The explicit card path retains its own list filters.
  await page.goto(`/cardholder-services/cards/${managed.card.id}?cardScope=MANAGED&cardSearch=Jordan&page=1`);
  await expect(page.getByRole("region", { name: "Selected card overview", exact: true })).toContainText(managed.card.nickname);
  await page.getByRole("navigation", { name: "Cards and spending navigation" }).getByRole("link", { name: "Cards", exact: true }).click();
  expect(new URL(page.url()).searchParams.get("page")).toBe("1");
  expect(new URL(page.url()).searchParams.get("cardScope")).toBe("MANAGED");
  await expect(page.getByRole("searchbox", { name: "Search your cards", exact: true })).toHaveValue("Jordan");
  await page.goto(`/cardholder-services/settings?focus=${received.card.id}`);
  await expect(page.getByRole("heading",{name:"Preferences",level:1,exact:true})).toBeVisible();
  await expect(page.getByRole("link",{name:"Return unused money",exact:true})).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText("$73.00");
  await page.getByRole("button",{name:"Find a task",exact:true}).click();
  await expect(page.getByRole("dialog").getByRole("link",{name:/^Add money Add money/})).toHaveAttribute("href",`/money-accounts/${funds.moneyAccountId}/add-money`);
  await page.keyboard.press("Escape");
});

test("an owned card pays at a published checkout while another holder's card offers named oversight", async ({ page }) => {
  const primary = await cardPrimary(`Morgan ${randomUUID().slice(0, 8)}`), holder = await cardPerson("Jamie Ownership");
  await enrollCardholder(primary.personId, primary.serviceId, holder);
  const owned = await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"4000");return issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Z My own card", undefined, "2300");})();
  const managed = await (async()=>{return issuePracticeCard(primary.personId, primary.serviceId, holder, "A Jamie card", undefined, "1700");})();
  await signIn(page, primary.personId);
  await page.goto("/cardholder-services");
  const overview = page.getByRole("region", { name: "Selected card overview", exact: true });
  // Home must remain the account overview; neither alphabetical order nor an
  // own card changes the screen into an implicitly selected card.
  await expect(overview).toHaveCount(0);
  await page.getByRole("region",{name:"Your card account",exact:true}).getByRole("link",{name:"View cards",exact:true}).click();
  await page.getByRole("link",{name:new RegExp(`^Open ${owned.card.nickname},`)}).click();
  await expect(overview).toContainText(owned.card.nickname);
  await expect(overview.getByText("FOR YOUR USE", { exact: true })).toBeVisible();
  await expect(overview.getByRole("link", { name: "Try a purchase", exact: true })).toHaveCount(0);
  const merchant=await freshPublishedPayment("2300","Use the exact remaining card allowance");
  await openSavedCardReview(page,merchant.publication.id,owned.card.id);
  await page.getByRole("button",{name:"Pay $23.00",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
  await page.goto(`/cardholder-services?focus=${owned.card.id}`);
  await expect(overview).toContainText("No spending available");
  // Reaching the card's allowance never strands them in a removed purchase task.
  const ownControls=page.getByRole("region",{name:"Card controls",exact:true});
  const ownDialog=page.getByRole("dialog");
  await expect(page.getByRole("textbox",{name:"Purchase description",exact:true})).toHaveCount(0);
  await ownControls.getByRole("button", { name: "Freeze card", exact: true }).click();
  await ownDialog.getByRole("button", { name: "Freeze card", exact: true }).click();
  await expect(ownDialog).toHaveCount(0);
  await expect(ownControls.getByRole("button", { name: "Unfreeze card", exact: true })).toBeVisible();

  await page.getByRole("link",{name:"Back to card list",exact:true}).click();
  await page.getByRole("link",{name:new RegExp(`^Open ${managed.card.nickname},`)}).click();
  await expect(overview).toContainText("Jamie Ownership");
  await expect(overview.getByRole("link", { name: "Try a purchase", exact: true })).toHaveCount(0);
  await expect(overview).toContainText("Jamie Ownership’s card");
  await expect(overview).toContainText("Only Jamie Ownership can use this card");
  await expect(page.getByRole("textbox", { name: "Purchase description", exact: true })).toHaveCount(0);
  await expect(page.getByRole("region",{name:"Card controls",exact:true}).getByRole("button", { name: "Freeze card", exact: true })).toBeEnabled();
  await expect(prepareCardCheckout(primary.personId,merchant.publication.id,{commandId:randomUUID(),cardServiceId:primary.serviceId,cardId:managed.card.id,expectedCardVersion:managed.card.version})).rejects.toMatchObject({status:404});
  const result = await dashboard(page);
  expect(result.cards.find(card => card.id === owned.card.id)).toMatchObject({ available: { minor: "0" }, status: "FROZEN", canPurchase: false });
  expect(result.cards.find(card => card.id === managed.card.id)).toMatchObject({ available: { minor: "1700" }, canPurchase: false, purchaseAvailability: { code: "OTHER_CARDHOLDER" } });
});

test("owner-frozen holder cards stay their own with an accurate explanation and no foreign data at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  const primary = await cardPrimary(`Restricted primary ${randomUUID().slice(0, 8)}`), holder = await cardPerson("Riley Restricted");
  await enrollCardholder(primary.personId, primary.serviceId, holder);
  const foreign = await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"3600");return issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Private primary card", "200", "1500");})();
  const own = await (async()=>{return issuePracticeCard(primary.personId, primary.serviceId, holder, "Riley travel card", "100", "2100");})();
  await controlCard(primary.personId,primary.serviceId,own.card.id,{commandId:randomUUID(),expectedVersion:own.card.version,action:"freeze"});
  await signIn(page, holder);
  await page.goto("/cardholder-services");
  await expect(page.getByRole("region",{name:"Your card account",exact:true})).toHaveCount(0);
  await page.getByRole("link",{name:new RegExp(`^Open ${own.card.nickname},`)}).click();
  const overview = page.getByRole("region", { name: "Selected card overview", exact: true });
  await expect(overview).toContainText(own.card.nickname);
  await expect(overview.getByText("FOR YOUR USE", { exact: true })).toBeVisible();
  await expect(overview).toContainText("This card is frozen");
  await expect(page.locator("main")).not.toContainText(foreign.card.nickname);
  await expect(page.getByRole("link", { name: "People", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Try a purchase", exact: true })).toHaveCount(0);
  await expect(overview).toContainText("Ask your account owner to review the freeze");
  await expect(overview).not.toContainText("Only the person named on this card");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect((await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  const result = await dashboard(page, "OWN");
  expect(result).toMatchObject({ ownCardCount: 1, managedCardCount: 0, cardMatchCount: 1 });
  expect(result.cards.map(card => card.id)).toEqual([own.card.id]);
  expect(result.cards[0]).toMatchObject({ canPurchase: false, purchaseAvailability: { code: "FROZEN" } });
  expect((await dashboard(page, "MANAGED")).cards).toEqual([]);
  await page.goto(`/cardholder-services?focus=${foreign.card.id}`);
  await expect(page.getByRole("heading", { name: "This card is unavailable", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Selected card overview", exact: true })).toHaveCount(0);
});

test("a lost checkout response keeps the exact saved review and recovers one matching card and merchant payment", async ({ page }) => {
  test.setTimeout(90_000);
  const primary=await cardPrimary(`Recovery ${randomUUID().slice(0,8)}`);
  await fundCardGroup(primary.personId,primary.serviceId,"900");

  const own=await issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Purchase recovery card", undefined, "900");
  const merchant=await freshPublishedPayment("325","One purchase despite an interrupted connection");
  await signIn(page,primary.personId);
  const saved=await openSavedCardReview(page,merchant.publication.id,own.card.id);
  const attempts:Array<{url:string;body:unknown}>=[];
  await page.route(`**${saved.confirmPath}`,async route=>{
    if(route.request().method()!=="POST"){await route.continue();return;}
    attempts.push({url:new URL(route.request().url()).pathname,body:route.request().postDataJSON()});
    if(attempts.length===1){const response=await route.fetch();expect(response.status()).toBe(200);await route.abort("connectionfailed");}
    else await route.continue();
  });
  await page.getByRole("button",{name:"Pay $3.25",exact:true}).click();
  const retry=page.getByRole("button",{name:"Check payment again",exact:true});
  await expect(retry).toBeEnabled();
  await expect(page.getByRole("link",{name:"Reload cards and choose again",exact:true})).toHaveCount(0);
  await expect(page.getByRole("combobox",{name:"Your card",exact:true})).toHaveCount(0);
  expect(page.url()).toBe(saved.url);
  expect(attempts).toHaveLength(1);
  await retry.click();
  await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
  expect(attempts).toHaveLength(2);expect(attempts[1]).toEqual(attempts[0]);
  const response=await page.request.get(saved.confirmPath);expect(response.status()).toBe(200);
  const confirmed=await response.json();expect(confirmed.id).toBe(saved.reviewId);expect(confirmed.receipt).not.toBeNull();
  await expect(page.locator("main")).toContainText(confirmed.receipt.reference);
  await page.reload();await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
  await expect(page.locator("main")).toContainText(confirmed.receipt.reference);expect(page.url()).toBe(saved.url);
  const result=await dashboard(page);
  expect(result.cards.find(card=>card.id===own.card.id)).toMatchObject({available:{minor:"575"}});
  expect(result.activity.filter(item=>item.cardId===own.card.id&&item.direction==="DEBIT")).toHaveLength(1);
});

test("a recipient with several cards in one account opens Activity without choosing a card first",async({page})=>{
 const primary=await cardPrimary(`Shared activity ${randomUUID().slice(0,8)}`),holder=await cardPerson("Shared activity holder");
 await enrollCardholder(primary.personId,primary.serviceId,holder);
 await fundCardGroup(primary.personId,primary.serviceId,"7500");
 const first=await issuePracticeCard(primary.personId,primary.serviceId,holder,"Shared groceries",undefined,"2500");
 const second=await issuePracticeCard(primary.personId,primary.serviceId,holder,"Shared travel",undefined,"2500");
 const privateCard=await issuePracticeCard(primary.personId,primary.serviceId,primary.personId,"Private owner card",undefined,"2500");
 await signIn(page,holder);await page.goto("/cardholder-services");
 const navigation=page.getByRole("navigation",{name:"Cards and spending navigation",exact:true});
 await expect(page.getByRole("region",{name:"Selected card overview",exact:true})).toHaveCount(0);
 await expect(navigation.getByRole("link",{name:"Activity",exact:true})).toHaveAttribute("href",`/cardholder-services/activity?context=${primary.serviceId}`);
 await expect(navigation.getByRole("link",{name:"Preferences",exact:true})).toHaveAttribute("href",`/cardholder-services/settings?context=${primary.serviceId}`);
 await navigation.getByRole("link",{name:"Activity",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Activity",level:1,exact:true})).toBeVisible();
 const cardOptions=page.getByRole("combobox",{name:"Card",exact:true}).locator("option");
 await expect(cardOptions).toHaveText(["All available cards",`${first.card.nickname} · ${first.card.lastFour}`,`${second.card.nickname} · ${second.card.lastFour}`]);
 await expect(page.locator("main")).not.toContainText(privateCard.card.nickname);
 await expect(navigation.getByRole("link",{name:"Account balance",exact:true})).toHaveCount(0);
 await page.reload();await expect(page.getByRole("heading",{name:"Activity",level:1,exact:true})).toBeVisible();
 const other=await cardPrimary(`Separate activity ${randomUUID().slice(0,8)}`);
 await enrollCardholder(other.personId,other.serviceId,holder);
 await issuePracticeCard(other.personId,other.serviceId,holder,"Separate account card",undefined,"1500");
 await page.goto("/cardholder-services");
 await expect(navigation.getByRole("link",{name:"Activity",exact:true})).toHaveAttribute("href","/cardholder-services/activity");
 await navigation.getByRole("link",{name:"Activity",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Choose a card to continue",exact:true})).toBeVisible();
});

test("historical top-up receipt keeps its exact owner account menu and remains private",async({page})=>{
 const primary=await cardPrimary(`Receipt navigation ${randomUUID().slice(0,8)}`),holder=await cardPerson("Receipt viewer");
 await enrollCardholder(primary.personId,primary.serviceId,holder);
 await fundCardGroup(primary.personId,primary.serviceId,"5700");
 const funds=await getCardholderFunds(primary.personId,primary.serviceId),receipt=funds.topups[0]!;
 expect(receipt).toBeTruthy();
 const path=`/cardholder-services/funds/receipts/${receipt.id}?service=${primary.serviceId}`;
 await signIn(page,primary.personId);await page.goto(path);
 const navigation=page.getByRole("navigation",{name:"Cards and spending navigation",exact:true});
 await expect(navigation.getByRole("link")).toHaveText(["Account home","Cards","Activity","Account settings"]);
 await expect(navigation.getByRole("link",{name:"Account home",exact:true})).toHaveAttribute("aria-current","page");
 await expect(navigation.getByRole("link",{name:"Account home",exact:true})).toHaveAttribute("href","/cardholder-services");
 await expect(navigation.getByRole("link",{name:"Account balance",exact:true})).toHaveCount(0);
 await expect(navigation.getByRole("link",{name:"Account settings",exact:true})).toHaveAttribute("href",`/cardholder-services/settings?context=${primary.serviceId}`);
 await expect(navigation.getByRole("link",{name:"Activity",exact:true})).toHaveAttribute("href",`/cardholder-services/activity?context=${primary.serviceId}`);
 await expect(page.getByRole("region",{name:"Top-up receipt",exact:true})).toContainText(receipt.reference);
 await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
 await page.reload();await expect(page.getByRole("region",{name:"Top-up receipt",exact:true})).toContainText(receipt.reference);
 await signIn(page,holder);await page.goto(path);
 await expect(page.getByRole("heading",{name:"This receipt is unavailable",exact:true})).toBeVisible();
 await expect(page.locator("main")).not.toContainText(receipt.reference);
 await expect(page.getByRole("region",{name:"Top-up receipt",exact:true})).toHaveCount(0);
});
