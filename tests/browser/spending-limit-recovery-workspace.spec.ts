import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {permissionGrants} from "../../src/platform/database/schema";
import {getCardholderFunds,getCardSpending} from "../../src/modules/workspace/service";
import {cardLimitChanges} from "../../src/modules/workspace/funding-schema";
import {moneyFundingIntents,moneyTopups} from "../../src/modules/money/schema";
import {getServiceMoneyAccount} from "../../src/modules/money/service";
import {ledgerEntries} from "../../src/modules/ledger/schema";
import {cardSpendingSchema} from "../../src/shared/funding-response";
import {issuePracticeCard} from "../helpers/cardholder";
import {freshPrepaidCard,signInPerson} from "./helpers/prepaid";

test.afterAll(closeDatabase);

test("a lost card allowance result hides card details after denial and retries without adding money",async({page})=>{
 test.setTimeout(90_000);
 const {primary,card}=await freshPrepaidCard("2500","1000");
 const account=await getDb().transaction(tx=>getServiceMoneyAccount(tx,primary.serviceId));
 expect(await getCardSpending(primary.personId,primary.serviceId,card.id)).toMatchObject({allowance:{minor:"1000"},version:1});
 const linesBefore=await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.moneyAccountId,account.id)).orderBy(ledgerEntries.id);
 const historyWhere=and(eq(cardLimitChanges.serviceId,primary.serviceId),eq(cardLimitChanges.cardId,card.id));
 const historyBefore=await getDb().select().from(cardLimitChanges).where(historyWhere).orderBy(cardLimitChanges.version);
 const prefix=`/api/v1/cardholder-services/${primary.serviceId}`,path=`${prefix}/cards/${card.id}/spending-limit`;
 const attempts:Array<{path:string;body:unknown}>=[],statuses:number[]=[],fundingWrites:string[]=[];
 page.on("request",request=>{const pathname=new URL(request.url()).pathname;if(!["GET","HEAD"].includes(request.method())&&(pathname.startsWith(`${prefix}/funds`)||pathname.includes("/money-accounts/")))fundingWrites.push(pathname);});
 await signInPerson(page,primary.personId);
 await page.goto(`/cardholder-services?card=${card.id}`);
 const dialog=page.getByRole("dialog"),row=page.getByRole("region",{name:"Card management details",exact:true}).getByRole("article",{name:"Card spending limit",exact:true});
 await row.getByRole("button",{name:`Change spending limit for ${card.nickname}`,exact:true}).click();
 await expect(row.getByRole("textbox",{name:"Total limit (USD)",exact:true})).toBeFocused();
 await row.getByRole("textbox",{name:"Total limit (USD)",exact:true}).fill("17.23");
 await row.getByRole("button",{name:"Review",exact:true}).click();
 await expect(row).toContainText("$17.23");
 await page.route(`**${path}`,async route=>{
  if(route.request().method()!=="PUT"){await route.continue();return;}
  attempts.push({path:new URL(route.request().url()).pathname,body:route.request().postDataJSON()});
  const response=await route.fetch();statuses.push(response.status());
  if(attempts.length===1){expect(response.status()).toBe(200);expect(cardSpendingSchema.parse(await response.json())).toMatchObject({cardId:card.id,allowance:{minor:"1723"},version:2});await route.fulfill({status:200,json:{}});}
  else await route.fulfill({response});
 });
 await row.getByRole("button",{name:"Save limit",exact:true}).click();
 await expect(row.getByRole("button",{name:"Retry saved spending limit",exact:true})).toBeEnabled();
 await expect(row.getByRole("button",{name:"Cancel",exact:true})).toHaveCount(0);
 await page.getByRole("navigation",{name:"Cards and spending navigation",exact:true}).getByRole("link",{name:"Cards",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname===`/cardholder-services/cards/${card.id}`&&!url.searchParams.has("card"));
 await expect(row.getByRole("button",{name:"Retry saved spending limit",exact:true})).toBeEnabled();
 const grant=and(eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.personId,primary.personId),eq(permissionGrants.action,"cardholder.limits.manage"));
 expect(await getDb().update(permissionGrants).set({state:"REVOKED"}).where(grant).returning({action:permissionGrants.action})).toEqual([{action:"cardholder.limits.manage"}]);
 await row.getByRole("button",{name:"Retry saved spending limit",exact:true}).click();
 await expect.poll(()=>statuses.length).toBe(2);expect(statuses).toEqual([200,403]);
 await expect(dialog).toContainText("Current access no longer allows this card action");
 await expect(dialog).not.toContainText(card.nickname);await expect(dialog.locator(".funds-person")).toHaveCount(0);await expect(dialog.getByRole("textbox")).toHaveCount(0);
 const retry=dialog.getByRole("button",{name:"Retry saved card limit",exact:true});await expect(retry).toBeEnabled();
 await page.setViewportSize({width:320,height:568});
 expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 await getDb().update(permissionGrants).set({state:"ACCEPTED"}).where(grant);
 await retry.click();await expect(row.locator(".funds-limit-value")).toHaveText("$17.23");
 expect(statuses).toEqual([200,403,200]);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
 expect(attempts[0]!.body).toMatchObject({expectedVersion:1,allowanceMinor:"1723"});expect(fundingWrites).toEqual([]);
 expect(await getCardSpending(primary.personId,primary.serviceId,card.id)).toMatchObject({allowance:{minor:"1723"},version:2});
 const history=await getDb().select().from(cardLimitChanges).where(historyWhere).orderBy(cardLimitChanges.version);
 expect(history).toHaveLength(historyBefore.length+1);expect(history.at(-1)).toMatchObject({version:2,allowanceMinor:1723n});
 expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.moneyAccountId,account.id)).orderBy(ledgerEntries.id)).toEqual(linesBefore);
 expect(await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account.id))).toHaveLength(1);
 expect(await getDb().select().from(moneyFundingIntents).where(eq(moneyFundingIntents.moneyAccountId,account.id))).toEqual([]);
 expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe("2500");
 await page.reload();await expect(row.locator(".funds-limit-value")).toHaveText("$17.23");
});


test("unconfirmed card limits survive browser navigation in the same tab and sign-out asks before revoking the session",async({page})=>{
 test.setTimeout(120_000);
 const {primary,card}=await freshPrepaidCard("2500","1000");
 const other=await issuePracticeCard(primary.personId,primary.serviceId,primary.personId,`Other retained-scope card ${randomUUID().slice(0,8)}`,undefined,"500");
 await signInPerson(page,primary.personId);
 await page.goto("/cardholder-services?view=cards");
 const openCard=()=>page.getByRole("link",{name:new RegExp(`^Open ${card.nickname},`)}).click();
 await openCard();
 const row=page.getByRole("region",{name:"Card management details",exact:true}).getByRole("article",{name:"Card spending limit",exact:true});
 const path=`/api/v1/cardholder-services/${primary.serviceId}/cards/${card.id}/spending-limit`;
 const attempts:unknown[]=[];let logoutPosts=0;
 await page.route(`**${path}`,async route=>{
  if(route.request().method()!=="PUT"){await route.continue();return;}
  attempts.push(route.request().postDataJSON());const result=await route.fetch();expect(result.status()).toBe(200);
  if(attempts.length===1||attempts.length===3)await route.fulfill({status:200,json:{}});else await route.fulfill({response:result});
 });
 await page.route("**/api/v1/auth/logout",async route=>{
  logoutPosts++;
  if(logoutPosts===1)await route.fulfill({status:503,json:{error:{code:"TEMPORARILY_UNAVAILABLE"}}});
  else await route.continue();
 });
 const changeLimit=async(amount:string)=>{
  await row.getByRole("button",{name:`Change spending limit for ${card.nickname}`,exact:true}).click();
  await expect(row.getByRole("textbox",{name:"Total limit (USD)",exact:true})).toBeFocused();
  await row.getByRole("textbox",{name:"Total limit (USD)",exact:true}).fill(amount);
  await row.getByRole("button",{name:"Review",exact:true}).click();
  await row.getByRole("button",{name:"Save limit",exact:true}).click();
  await expect(row.getByRole("button",{name:"Retry saved spending limit",exact:true})).toBeEnabled();
 };
 await changeLimit("17.23");
 // Native same-document history is allowed: the exact request outlives its React owner.
 await page.goBack();await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/cards"&&!url.searchParams.has("view")&&!url.searchParams.has("focus"));
 await page.getByRole("link",{name:new RegExp(`^Open ${other.card.nickname},`)}).click();
 await expect(page.getByRole("button",{name:"Retry saved spending limit",exact:true})).toHaveCount(0);
 await expect(page.getByRole("article",{name:"Card spending limit",exact:true}).getByRole("button",{name:`Change spending limit for ${other.card.nickname}`,exact:true})).toBeVisible();
 await page.getByRole("link",{name:"Back to card list",exact:true}).click();await openCard();
 await expect(row.getByRole("button",{name:"Retry saved spending limit",exact:true})).toBeEnabled();
 await expect(row).toContainText("$17.23");expect(attempts).toHaveLength(1);
 await row.getByRole("link",{name:"Leave unconfirmed request",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/cards"&&!url.searchParams.has("view")&&!url.searchParams.has("focus"));
 await openCard();await expect(row.getByRole("button",{name:"Retry saved spending limit",exact:true})).toBeEnabled();
 const signOut=async()=>{await page.getByLabel("Profile and help",{exact:true}).click();await page.getByRole("button",{name:"Sign out",exact:true}).click();};
 await signOut();
 const leave=page.getByRole("dialog",{name:"Sign out with an unconfirmed card change?",exact:true});
 await expect(leave).toBeVisible();expect(logoutPosts).toBe(0);
 await expect(leave).not.toContainText(card.nickname);await expect(leave).not.toContainText("17.23");
 await page.keyboard.press("Escape");await expect(leave).toHaveCount(0);expect(logoutPosts).toBe(0);
 await row.getByRole("button",{name:"Retry saved spending limit",exact:true}).click();
 await expect(row.getByRole("button",{name:"Retry saved spending limit",exact:true})).toHaveCount(0);
 expect(attempts).toHaveLength(2);expect(attempts[1]).toEqual(attempts[0]);
 expect(attempts[0]).toMatchObject({expectedVersion:1,allowanceMinor:"1723"});
 await expect(row.locator(".funds-limit-value")).toHaveText("$17.23");
 await changeLimit("18.00");await signOut();await expect(leave).toBeVisible();expect(logoutPosts).toBe(0);
 await leave.getByRole("button",{name:"Sign out anyway",exact:true}).click();
 await expect(leave).toContainText("We could not confirm sign-out");expect(logoutPosts).toBe(1);
 await leave.getByRole("button",{name:"Stay signed in",exact:true}).click();
 await expect(leave).toHaveCount(0);
 await expect(page.getByRole("navigation",{name:"Your account",exact:true})).toBeVisible();
 await expect(page.getByRole("button",{name:"Sign out",exact:true})).toBeFocused();
 await expect(row.getByRole("button",{name:"Retry saved spending limit",exact:true})).toBeEnabled();
 // Deliberately leaving an unconfirmed change must still allow secure sign-out.
 await page.getByRole("button",{name:"Sign out",exact:true}).click();await leave.getByRole("button",{name:"Sign out anyway",exact:true}).click();
 await expect(page).toHaveURL(/\/login$/);expect(logoutPosts).toBe(2);
 expect((await page.request.get(`/api/v1/cardholder-services/${primary.serviceId}/workspace`)).status()).toBe(401);
 expect(await getCardSpending(primary.personId,primary.serviceId,card.id)).toMatchObject({allowance:{minor:"1800"},version:3});
 expect(attempts).toHaveLength(3);
});
