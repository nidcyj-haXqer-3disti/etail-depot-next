import {randomUUID} from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";
import {eq} from "drizzle-orm";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {cardPerson,cardPrimary,enrollCardholder} from "../helpers/cardholder";
import {createPrimaryMerchant} from "../../src/modules/services/create-merchant";
import {getMoneyAccountOverview,listOwnedMoneyAccounts,addMoneyFunds} from "../../src/modules/money/service";
import {moneyTopups,moneyWithdrawals} from "../../src/modules/money/schema";
import {operatorServiceAccess} from "../../src/modules/operations/schema";
import {signInPerson} from "./helpers/prepaid";
import {headers} from "./helpers/fresh";
test.afterAll(closeDatabase);

test("owner adds card money, reviews a withdrawal and keeps merchant money separate",async({page})=>{
 const owner=await cardPrimary("Money owner"),merchant=await createPrimaryMerchant(owner.personId,{commandId:randomUUID(),displayName:"Separate merchant"});
 const accounts=await listOwnedMoneyAccounts(owner.personId),card=accounts.find(a=>a.serviceKind==="CARDHOLDER")!,business=accounts.find(a=>a.serviceKind==="MERCHANT")!;
 expect(card.id).not.toBe(business.id);expect(business.services[0]!.id).toBe(merchant.serviceId);
 await signInPerson(page,owner.personId);await page.goto(`/money-accounts/${card.id}?task=add`);
 await page.getByRole("textbox",{name:"Amount (USD)"}).fill("125.50");await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.getByRole("button",{name:"Confirm and add money",exact:true})).toBeVisible();await expect(page).toHaveURL(url=>!!url.searchParams.get("review"));const reviewUrl=page.url();await page.reload();
 await page.getByRole("button",{name:"Confirm and add money",exact:true}).click();await expect(page.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();
 await page.goto(reviewUrl);await expect(page.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();
 expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 expect(await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,card.id))).toHaveLength(1);
 expect((await getMoneyAccountOverview(owner.personId,business.id)).available.minor).toBe("0");
 await page.goto(`/money-accounts/${card.id}?task=withdraw`);await page.getByRole("textbox",{name:"Amount (USD)"}).fill("25.50");await page.getByRole("button",{name:"Continue",exact:true}).click();
 await page.getByRole("button",{name:"Confirm withdrawal",exact:true}).click();await expect(page.getByRole("heading",{name:"Withdrawal requested",exact:true})).toBeVisible();
 expect(await getMoneyAccountOverview(owner.personId,card.id)).toMatchObject({available:{minor:"10000"},pendingWithdrawals:{minor:"2550"}});
 expect((await getMoneyAccountOverview(owner.personId,business.id)).available.minor).toBe("0");
 const ownQueue=await page.request.post(`/api/v1/operations/money-withdrawals/${(await getDb().select().from(moneyWithdrawals).where(eq(moneyWithdrawals.moneyAccountId,card.id)))[0]!.id}`,{headers,data:{commandId:randomUUID(),outcome:"COMPLETED"}});expect(ownQueue.status()).toBe(403);
 const operator=await cardPerson("Withdrawal reviewer");await getDb().insert(operatorServiceAccess).values({serviceId:owner.serviceId,personId:operator,state:"ACCEPTED",canRespond:false,canProcessDeposits:true});
 await signInPerson(page,operator);await page.goto("/operations/money-withdrawals");await page.getByRole("button",{name:"Return money",exact:true}).click();await page.getByRole("button",{name:"Confirm result",exact:true}).click();
 await expect(page.getByText("No withdrawals are waiting for your review.")).toBeVisible();expect(await getMoneyAccountOverview(owner.personId,card.id)).toMatchObject({available:{minor:"12550"},pendingWithdrawals:{minor:"0"}});
});

test("a holder can open their profile but cannot view the owner's money or saved review",async({page})=>{
 const owner=await cardPrimary("Private money owner"),holder=await cardPerson("Invited cardholder");await enrollCardholder(owner.personId,owner.serviceId,holder);
 const [account]=await listOwnedMoneyAccounts(owner.personId);await signInPerson(page,holder);
 await page.goto("/profile");await expect(page.getByRole("heading",{name:"Your profile",exact:true})).toBeVisible();
 expect((await page.request.get(`/api/v1/money-accounts/${account!.id}`)).status()).toBe(404);
 await page.goto(`/money-accounts/${account!.id}`);await expect(page.getByRole("heading",{name:"This money account is unavailable",exact:true})).toBeVisible();
 await expect(page.getByRole("link",{name:"Withdraw",exact:true})).toHaveCount(0);
});

test("a mismatched funding receipt stays unconfirmed and retry uses the same saved review",async({page})=>{
 const owner=await cardPrimary("Receipt owner"),[account]=await listOwnedMoneyAccounts(owner.personId);await signInPerson(page,owner.personId);
 await page.goto(`/money-accounts/${account!.id}?task=add`);await page.getByRole("textbox",{name:"Amount (USD)"}).fill("10");await page.getByRole("button",{name:"Continue",exact:true}).click();await expect(page.getByRole("button",{name:"Confirm and add money",exact:true})).toBeVisible();
 await expect(page).toHaveURL(url=>!!url.searchParams.get("review"));
 const review=new URL(page.url()).searchParams.get("review")!,path=`**/api/v1/money-accounts/${account!.id}/funding/intents/${review}`;let altered=false;
 await page.route(path,async route=>{if(route.request().method()!=="POST"||altered)return route.continue();altered=true;const response=await route.fetch(),body=await response.json();await route.fulfill({response,json:{...body,id:randomUUID()}});});
 await page.getByRole("button",{name:"Confirm and add money",exact:true}).click();await expect(page.getByText("We couldn’t verify this receipt. Retry this same request.")).toBeVisible();
 await expect(page.getByRole("heading",{name:"Money added",exact:true})).toHaveCount(0);await page.getByRole("button",{name:"Retry this same request",exact:true}).click();await expect(page.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();
 expect(await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account!.id))).toHaveLength(1);
});

for(const task of ["add","withdraw"] as const)test(`${task} waits for the saved review before confirmation`,async({page})=>{
 const owner=await cardPrimary(`Navigation ${task}`),[account]=await listOwnedMoneyAccounts(owner.personId);
 if(task==="withdraw")await addMoneyFunds(owner.personId,account!.id,{commandId:randomUUID(),amountMinor:"5000"});
 const before=await getMoneyAccountOverview(owner.personId,account!.id),path=`/money-accounts/${account!.id}`;
 await signInPerson(page,owner.personId);await page.goto(`${path}?task=${task}`);
 let release!:()=>void,held=false,reviewId="",confirmations=0;
 const gate=new Promise<void>(resolve=>{release=resolve;});
 await page.route(url=>url.pathname===path&&url.searchParams.has("review"),async route=>{
  if(route.request().headers().rsc!=="1"||held)return route.continue();
  reviewId=new URL(route.request().url()).searchParams.get("review")!;
  const response=await route.fetch();expect(response.status()).toBe(200);held=true;await gate;await route.fulfill({response});
 });
 await page.route(`**/api/v1${path}/${task==="add"?"funding":"withdrawals"}/intents/*`,async route=>{if(route.request().method()==="POST")confirmations++;await route.continue();});
 const confirm=page.getByRole("button",{name:task==="add"?"Confirm and add money":"Confirm withdrawal",exact:true});
 await page.getByRole("textbox",{name:"Amount (USD)"}).fill("10.00");
 try{
  await page.getByRole("button",{name:"Continue",exact:true}).click();await expect.poll(()=>held).toBe(true);
  await expect(confirm).toBeDisabled();await expect(page.getByRole("link",{name:"Change amount",exact:true})).toHaveCount(0);
  await confirm.evaluate(button=>(button as HTMLButtonElement).click());expect(confirmations).toBe(0);
  expect((await getMoneyAccountOverview(owner.personId,account!.id)).available).toEqual(before.available);
 }finally{release();}
 await expect(page).toHaveURL(url=>url.searchParams.get("review")===reviewId);await expect(confirm).toBeEnabled();await confirm.click();
 await expect(page.getByRole("heading",{name:task==="add"?"Money added":"Withdrawal requested",exact:true})).toBeVisible();expect(confirmations).toBe(1);
 await page.reload();await expect(page.getByRole("heading",{name:task==="add"?"Money added":"Withdrawal requested",exact:true})).toBeVisible();expect(confirmations).toBe(1);
});

test("an oversized withdrawal can be corrected after a definitive rejection",async({page})=>{
 const owner=await cardPrimary("Correct withdrawal"),[account]=await listOwnedMoneyAccounts(owner.personId);
 await addMoneyFunds(owner.personId,account!.id,{commandId:randomUUID(),amountMinor:"1000"});await signInPerson(page,owner.personId);
 await page.goto(`/money-accounts/${account!.id}?task=withdraw`);const amount=page.getByRole("textbox",{name:"Amount (USD)"});
 await amount.fill("50.00");await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page.locator("main").getByRole("alert")).toContainText("There isn’t enough available money");await expect(amount).toBeEnabled();
 expect((await getMoneyAccountOverview(owner.personId,account!.id)).available.minor).toBe("1000");
 expect(await getDb().select().from(moneyWithdrawals).where(eq(moneyWithdrawals.moneyAccountId,account!.id))).toHaveLength(0);
 await amount.fill("5.00");await page.getByRole("button",{name:"Continue",exact:true}).click();await expect(page).toHaveURL(url=>!!url.searchParams.get("review"));
 await page.getByRole("button",{name:"Confirm withdrawal",exact:true}).click();await expect(page.getByRole("heading",{name:"Withdrawal requested",exact:true})).toBeVisible();
 expect(await getMoneyAccountOverview(owner.personId,account!.id)).toMatchObject({available:{minor:"500"},pendingWithdrawals:{minor:"500"}});
});
