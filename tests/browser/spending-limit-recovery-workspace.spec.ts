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
 const dialog=page.getByRole("dialog"),row=dialog.getByRole("article",{name:"Card spending limit",exact:true});
 await row.getByRole("button",{name:`Change spending limit for ${card.nickname}`,exact:true}).click();
 await row.getByRole("textbox",{name:`New total spending limit for ${card.nickname}`,exact:true}).fill("17.23");
 await row.getByRole("button",{name:"Review spending limit",exact:true}).click();
 await expect(row).toContainText("$17.23");
 await page.route(`**${path}`,async route=>{
  if(route.request().method()!=="PUT"){await route.continue();return;}
  attempts.push({path:new URL(route.request().url()).pathname,body:route.request().postDataJSON()});
  const response=await route.fetch();statuses.push(response.status());
  if(attempts.length===1){expect(response.status()).toBe(200);expect(cardSpendingSchema.parse(await response.json())).toMatchObject({cardId:card.id,allowance:{minor:"1723"},version:2});await route.fulfill({status:200,json:{}});}
  else await route.fulfill({response});
 });
 await row.getByRole("button",{name:"Save spending limit",exact:true}).click();
 await expect(row.getByRole("button",{name:"Retry saved spending limit",exact:true})).toBeEnabled();
 await expect(row.getByRole("button",{name:"Cancel",exact:true})).toHaveCount(0);
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
