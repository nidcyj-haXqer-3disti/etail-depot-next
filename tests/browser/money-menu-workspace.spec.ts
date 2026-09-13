import {randomUUID} from "node:crypto";
import {expect,test,type Page} from "@playwright/test";
import {and,eq} from "drizzle-orm";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {serviceMembers} from "../../src/platform/database/schema";
import {cardPerson,cardPrimary,enrollCardholder,issuePracticeCard} from "../helpers/cardholder";
import {createPrimaryMerchant} from "../../src/modules/services/create-merchant";
import {getMoneyAccountOverview,listOwnedMoneyAccounts,prepareMoneyFunding} from "../../src/modules/money/service";
import {moneyFundingIntents,moneyWithdrawalIntents,moneyTopups,moneyWithdrawals} from "../../src/modules/money/schema";
import {networkCheckoutFixture} from "../helpers/network-checkout";
import {startNetworkCheckout,processNetworkCheckout} from "../../src/modules/acquiring/network-service";
import {getMerchantOperations,createMerchantSettlement} from "../../src/modules/acquiring/operations-service";
import {createCardholderService} from "../../src/modules/services/service";
import {signInPerson} from "./helpers/prepaid";
import {merchantActivityHref,parseMerchantActivityFilters} from "../../src/shared/merchant-activity";

test.afterAll(closeDatabase);

async function cardMenu(page:Page){
 const navigation=page.getByRole("navigation",{name:"Cards and spending navigation",exact:true});
 await expect(navigation).toBeVisible();
 await expect(navigation.getByRole("link")).toHaveText(["Account home","Cards","Activity","Account settings"]);
 await expect(navigation.getByRole("link",{name:"Account home",exact:true})).toHaveAttribute("aria-current","page");
 await expect(navigation.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
 return navigation;
}

async function merchantMenu(page:Page,filters:URLSearchParams){
 const navigation=page.getByRole("navigation",{name:"Merchant account navigation",exact:true});
 await expect(navigation).toBeVisible();
 await expect(navigation.getByRole("link")).toHaveText(["Overview","Terminals","Account settings"]);
 await expect(navigation.getByRole("link",{name:"Overview",exact:true})).toHaveAttribute("aria-current","page");
 for(const label of ["Overview","Terminals","Account settings"]){
  const target=new URL((await navigation.getByRole("link",{name:label,exact:true}).getAttribute("href"))!,"http://127.0.0.1:3100");
  expect(target.pathname).toBe("/merchant-services");
  for(const [key,value] of filters)expect(target.searchParams.get(key)).toBe(value);
 }
 return navigation;
}

function moneyUrl(accountId:string,returnTo:string,values:Record<string,string>={}){
 return `/money-accounts/${accountId}?${new URLSearchParams({history:"payouts",...values,returnTo})}`;
}

test("card account menu stays with the top-up review and receipt without duplicate Add money actions",async({page})=>{
 const owner=await cardPrimary("Card menu owner"),[account]=await listOwnedMoneyAccounts(owner.personId);
 const path=`/money-accounts/${account!.id}`;
 await signInPerson(page,owner.personId);await page.goto("/cardholder-services");
 await cardMenu(page);
 await expect(page.getByRole("link",{name:"Return unused money",exact:true})).toHaveCount(0);
 await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(1);
 await page.getByRole("link",{name:"Add money",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Add money",exact:true})).toBeVisible();await cardMenu(page);
 await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
 await expect(page.getByRole("link",{name:"Cancel and return",exact:true})).toHaveAttribute("href","/cardholder-services");
 await page.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill("9999999999.99");
 await page.getByRole("button",{name:"Continue",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname===path&&url.searchParams.get("task")==="add"&&!!url.searchParams.get("review"));
 const reviewUrl=page.url();
 await expect(page.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();await cardMenu(page);
 await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
 expect((await getMoneyAccountOverview(owner.personId,account!.id)).available.minor).toBe("0");
 await page.reload();await cardMenu(page);
 let confirmations=0;
 page.on("request",request=>{if(request.method()==="POST"&&new URL(request.url()).pathname.startsWith(`/api/v1${path}/funding/intents/`))confirmations++;});
 await page.getByRole("button",{name:"Confirm and add money",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();await cardMenu(page);
 await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
 await page.reload();await expect(page.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();await cardMenu(page);
 await page.setViewportSize({width:320,height:900});
 await expect(page.locator(".money-receipt-amount")).toHaveText("$9,999,999,999.99");
 for(const area of [page.locator(".money-balance"),page.locator(".money-receipt-amount")])expect(await area.evaluate(node=>node.scrollWidth<=node.clientWidth+1)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await page.goto(reviewUrl);await expect(page.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();
 expect(confirmations).toBe(1);
 expect(await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account!.id))).toHaveLength(1);
 expect((await getMoneyAccountOverview(owner.personId,account!.id)).available.minor).toBe("999999999999");
 await page.getByRole("link",{name:"View money activity",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname===path&&!url.search);
 await cardMenu(page);await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
 await page.getByRole("navigation",{name:"Cards and spending navigation",exact:true}).getByRole("link",{name:"Account home",exact:true}).click();
 await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveAttribute("href",`${path}?task=add`);
 await page.getByRole("navigation",{name:"Cards and spending navigation",exact:true}).getByRole("link",{name:"Account settings",exact:true}).click();
 await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
 await page.getByRole("link",{name:"Return unused money",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname===path&&url.searchParams.get("task")==="withdraw");
 await expect(page.getByRole("heading",{name:"Return unused money",exact:true})).toBeVisible();
 await cardMenu(page);
});

async function settleCustomerPayment(f:Awaited<ReturnType<typeof networkCheckoutFixture>>){
 const pending=await startNetworkCheckout(f.cookie,f.publication.id,{commandId:randomUUID(),instrumentId:"visa"});
 await processNetworkCheckout(f.cookie,f.publication.id,pending.id);
 const operations=await getMerchantOperations(f.personId,f.merchantId);
 await createMerchantSettlement(f.personId,f.merchantId,{commandId:randomUUID(),reviewToken:operations.depositReview!.token});
}

test.describe("merchant money retains the payment investigation",()=>{
 let ownerId:string,accountId:string,cardAccountId:string,returnTo:string,filters:URLSearchParams;
 test.beforeAll(async()=>{
  test.setTimeout(180_000);
  const merchant=await networkCheckoutFixture();ownerId=merchant.personId;
  await createCardholderService(ownerId,{commandId:randomUUID(),displayName:"Owner cards"});
  const accounts=await listOwnedMoneyAccounts(ownerId);
  accountId=accounts.find(account=>account.serviceKind==="MERCHANT")!.id;
  cardAccountId=accounts.find(account=>account.serviceKind==="CARDHOLDER")!.id;
  filters=new URLSearchParams({view:`unit:${merchant.merchantId}`,activity:"payments",period:"custom",from:"2026-09-01",to:"2026-09-12",q:"Order & garden",status:"COLLECTED",page:"2"});
  returnTo=merchantActivityHref(parseMerchantActivityFilters(filters),{section:"overview"});
  // Real customer payments and reviewed settlements create both history pages.
  for(let index=0;index<51;index++)await settleCustomerPayment(merchant);
 });

 for(const task of ["withdraw"] as const)test(`${task} keeps merchant context through amount, review, receipt and history`,async({page})=>{
  const before=await getMoneyAccountOverview(ownerId,accountId);
  const beforeCount=(await getDb().select().from(moneyWithdrawals).where(eq(moneyWithdrawals.moneyAccountId,accountId))).length;
  await signInPerson(page,ownerId);await page.goto(returnTo);
  await merchantMenu(page,filters);
  await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
  await page.getByRole("link",{name:"Request payout",exact:true}).click();
  await expect(page).toHaveURL(url=>url.searchParams.get("returnTo")===returnTo&&url.searchParams.get("task")===task);
  await merchantMenu(page,filters);
  await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
  await expect(page.getByRole("link",{name:"Request payout",exact:true})).toHaveCount(0);
  await expect(page.getByRole("link",{name:"Cancel and return",exact:true})).toHaveAttribute("href",returnTo);
  await page.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill("2.50");
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page).toHaveURL(url=>url.searchParams.get("returnTo")===returnTo&&url.searchParams.get("task")===task&&!!url.searchParams.get("review"));
  const reviewId=new URL(page.url()).searchParams.get("review")!;
  await merchantMenu(page,filters);
  await expect(page.getByRole("link",{name:"Change amount",exact:true})).toHaveAttribute("href",moneyUrl(accountId,returnTo,{task}));
  expect((await getMoneyAccountOverview(ownerId,accountId)).available.minor).toBe(before.available.minor);
  await page.reload();await merchantMenu(page,filters);
  await page.getByRole("button",{name:"Confirm payout",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Payout requested",exact:true})).toBeVisible();
  await merchantMenu(page,filters);
  await expect(page.getByRole("link",{name:"Back to payout history",exact:true})).toHaveAttribute("href",moneyUrl(accountId,returnTo));
  await page.reload();await expect(page).toHaveURL(url=>url.searchParams.get("returnTo")===returnTo&&url.searchParams.get("review")===reviewId);
  await page.getByRole("link",{name:"Back to payout history",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname===`/money-accounts/${accountId}`&&url.searchParams.get("returnTo")===returnTo&&!url.searchParams.has("task")&&!url.searchParams.has("review"));
  const historyReceipt=page.locator(`.money-payout-history a[href*="review=${reviewId}"]`);
  const receiptTarget=new URL((await historyReceipt.getAttribute("href"))!,"http://127.0.0.1:3100");
  expect(receiptTarget.pathname).toBe(`/money-accounts/${accountId}`);expect(receiptTarget.searchParams.get("returnTo")).toBe(returnTo);expect(receiptTarget.searchParams.get("review")).toBe(reviewId);
  await historyReceipt.click();await expect(page.getByRole("heading",{name:"Payout requested",exact:true})).toBeVisible();await merchantMenu(page,filters);
  const after=await getMoneyAccountOverview(ownerId,accountId);
  expect(BigInt(after.available.minor)-BigInt(before.available.minor)).toBe(-250n);
  expect((await getDb().select().from(moneyWithdrawals).where(eq(moneyWithdrawals.moneyAccountId,accountId))).length).toBe(beforeCount+1);
  expect((await getMoneyAccountOverview(ownerId,cardAccountId)).available.minor).toBe("0");
  const back=page.getByRole("link",{name:"← Your payments",exact:true});await expect(back).toHaveAttribute("href",returnTo);
  await back.click();await expect(page).toHaveURL(url=>url.pathname==="/merchant-services"&&[...filters].every(([key,value])=>url.searchParams.get(key)===value));
 });

 test("history tabs show one list, reset their page and retain the original terminal, dates and search",async({page})=>{
  const before=await getMoneyAccountOverview(ownerId,accountId);
  await signInPerson(page,ownerId);await page.goto(moneyUrl(accountId,returnTo));
  const tabs=page.getByRole("navigation",{name:"Balance history",exact:true});
  await expect(page.getByRole("heading",{name:"Payout history",exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Balance activity",exact:true})).toHaveCount(0);
  await tabs.getByRole("link",{name:"Balance activity",exact:true}).click();
  await expect(page).toHaveURL(url=>url.searchParams.get("history")==="balance"&&url.searchParams.get("page")==="0"&&url.searchParams.get("returnTo")===returnTo);
  await expect(page.getByRole("heading",{name:"Payout history",exact:true})).toHaveCount(0);
  const pages=page.getByRole("navigation",{name:"Money activity pages",exact:true});
  await expect(pages.getByRole("link",{name:"Older activity",exact:true})).toHaveAttribute("href",moneyUrl(accountId,returnTo,{history:"balance",page:"1"}));
  await pages.getByRole("link",{name:"Older activity",exact:true}).click();
  await expect(page).toHaveURL(url=>url.searchParams.get("page")==="1"&&url.searchParams.get("returnTo")===returnTo);await merchantMenu(page,filters);
  await page.reload();await expect(pages).toContainText("Page 2");
  await expect(pages.getByRole("link",{name:"Newer activity",exact:true})).toHaveAttribute("href",moneyUrl(accountId,returnTo,{history:"balance",page:"0"}));
  await pages.getByRole("link",{name:"Newer activity",exact:true}).click();
  await expect(page).toHaveURL(url=>url.searchParams.get("page")==="0"&&url.searchParams.get("returnTo")===returnTo);await merchantMenu(page,filters);
  await pages.getByRole("link",{name:"Older activity",exact:true}).click();
  await expect(page).toHaveURL(url=>url.searchParams.get("history")==="balance"&&url.searchParams.get("page")==="1");
  await tabs.getByRole("link",{name:"Payout history",exact:true}).click();
  await expect(page).toHaveURL(url=>url.searchParams.get("history")==="payouts"&&url.searchParams.get("page")==="0"&&url.searchParams.get("returnTo")===returnTo);
  await expect(tabs.getByRole("link",{name:"Payout history",exact:true})).toHaveAttribute("aria-current","page");
  await expect(page.getByRole("heading",{name:"Payout history",exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Balance activity",exact:true})).toHaveCount(0);
  await expect(pages).toHaveCount(0);
  await page.reload();await expect(tabs.getByRole("link",{name:"Payout history",exact:true})).toHaveAttribute("aria-current","page");
  expect((await getMoneyAccountOverview(ownerId,accountId)).available).toEqual(before.available);
 });
});

test("invalid, external and cross-service money return destinations fail closed",async({page})=>{
 const owner=await cardPrimary("Money return owner"),merchant=await createPrimaryMerchant(owner.personId,{commandId:randomUUID(),displayName:"Money return business"});
 const accounts=await listOwnedMoneyAccounts(owner.personId),card=accounts.find(account=>account.serviceKind==="CARDHOLDER")!,business=accounts.find(account=>account.serviceKind==="MERCHANT")!;
 await signInPerson(page,owner.personId);
 const cases=[
  moneyUrl(business.id,"https://example.test/merchant-services",{task:"add"}),
  moneyUrl(business.id,"/merchant-services?activity=unknown",{task:"add"}),
  moneyUrl(business.id,"/cardholder-services",{task:"withdraw"}),
  moneyUrl(card.id,`/merchant-services?view=merchant:${merchant.serviceId}`,{task:"add"}),
  `${moneyUrl(business.id,"/merchant-services",{task:"add"})}&returnTo=%2Fmerchant-services`,
 ];
 for(const path of cases){
  await page.goto(path);
  await expect(page.getByRole("heading",{name:"This money account is unavailable",exact:true})).toBeVisible();
  expect(new URL(page.url()).origin).toBe("http://127.0.0.1:3100");
  await expect(page.getByRole("textbox",{name:"Amount (USD)",exact:true})).toHaveCount(0);
  await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
  await expect(page.getByRole("navigation",{name:"Merchant account navigation",exact:true})).toHaveCount(0);
 }
 expect((await getMoneyAccountOverview(owner.personId,card.id)).available.minor).toBe("0");
 expect((await getMoneyAccountOverview(owner.personId,business.id)).available.minor).toBe("0");
});

test("an invited holder has no account balance menu or access to its owner's money review",async({page})=>{
 const owner=await cardPrimary("Menu privacy owner"),holder=await cardPerson("Menu invited holder");
 await enrollCardholder(owner.personId,owner.serviceId,holder);
 const {card}=await issuePracticeCard(owner.personId,owner.serviceId,holder,"Only my card",undefined,"2500");
 const [account]=await listOwnedMoneyAccounts(owner.personId),review=await prepareMoneyFunding(owner.personId,account!.id,{commandId:randomUUID(),amountMinor:"5000"});
 await signInPerson(page,holder);await page.goto(`/cardholder-services?focus=${card.id}`);
 const navigation=page.getByRole("navigation",{name:"Cards and spending navigation",exact:true});
 await expect(navigation).toBeVisible();await expect(navigation.getByRole("link",{name:"Account balance",exact:true})).toHaveCount(0);
 await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
 for(const path of [`/money-accounts/${account!.id}`,`/money-accounts/${account!.id}?task=add&review=${review.id}`]){
  await page.goto(path);await expect(page.getByRole("heading",{name:"This money account is unavailable",exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Card balance",exact:true})).toHaveCount(0);
  await expect(page.getByRole("button",{name:"Confirm and add money",exact:true})).toHaveCount(0);
 }
 expect((await page.request.get(`/api/v1/money-accounts/${account!.id}`)).status()).toBe(404);
 expect((await page.request.get(`/api/v1/money-accounts/${account!.id}/funding/intents/${review.id}`)).status()).toBe(404);
 expect((await getMoneyAccountOverview(owner.personId,account!.id)).available.minor).toBe("0");
});

for(const phase of ["review","confirmation"] as const)test(`merchant can deliberately leave a denied ${phase} while its original payout request stays intact`,async({page})=>{
 const merchant=await networkCheckoutFixture(),ownerId=merchant.personId;
 await settleCustomerPayment(merchant);
 const [account]=await listOwnedMoneyAccounts(ownerId),base=`/api/v1/money-accounts/${account!.id}/withdrawals/intents`;
 await signInPerson(page,ownerId);
 await page.goto(moneyUrl(account!.id,"/merchant-services?activity=payments&period=all",{task:"withdraw"}));
 await page.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill("12.34");
 let reviewId="";
 if(phase==="confirmation"){
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page).toHaveURL(url=>!!url.searchParams.get("review"));
  reviewId=new URL(page.url()).searchParams.get("review")!;
 }
 const endpoint=phase==="review"?base:`${base}/${reviewId}`;
 const attempts:Array<{path:string;body:unknown}>=[],statuses:number[]=[];
 await page.route(`**${endpoint}`,async route=>{
  if(route.request().method()!=="POST")return route.continue();
  attempts.push({path:new URL(route.request().url()).pathname,body:route.request().postDataJSON()});
  const response=await route.fetch();statuses.push(response.status());
  if(attempts.length===1){
   expect(response.status()).toBe(200);
   const saved=await response.json();if(phase==="review")reviewId=saved.id;
   await route.fulfill({status:200,json:{}});
  }else await route.fulfill({response});
 });
 await page.getByRole("button",{name:phase==="review"?"Continue":"Confirm payout",exact:true}).click();
 const retryLabel=phase==="review"?"Retry the same review":"Retry this same request";
 await expect(page.getByRole("button",{name:retryLabel,exact:true})).toBeEnabled();
 const expectedWithdrawals=phase==="review"?0:1;
 expect(await getDb().select().from(moneyWithdrawals).where(eq(moneyWithdrawals.moneyAccountId,account!.id))).toHaveLength(expectedWithdrawals);
 const membership=and(eq(serviceMembers.serviceId,merchant.serviceId),eq(serviceMembers.personId,ownerId));
 expect(await getDb().update(serviceMembers).set({state:"REVOKED"}).where(membership).returning({personId:serviceMembers.personId})).toEqual([{personId:ownerId}]);
 try{
  await page.getByRole("button",{name:retryLabel,exact:true}).click();
  await expect(page.getByRole("heading",{name:"Account balance unavailable",exact:true})).toBeVisible();
  expect(statuses).toEqual([200,404]);expect(attempts[1]).toEqual(attempts[0]);
  const main=page.locator("main");
  await expect(main).not.toContainText(account!.displayName);await expect(main).not.toContainText("$12.34");
  await expect(page.locator(".money-balance,.money-history")).toHaveCount(0);
  await expect(page.getByRole("textbox",{name:"Amount (USD)",exact:true})).toHaveCount(0);
  await expect(main).toContainText("An unconfirmed request may already have been saved. Leaving does not cancel it.");
  await expect(page.locator(".mn-navigation-boundary")).toHaveAttribute("data-pending","true");
  const savedUrl=page.url();
  // Ordinary service navigation remains guarded; leaving is an explicit choice.
  await page.getByRole("navigation",{name:"Merchant account navigation",exact:true}).getByRole("link",{name:"Overview",exact:true}).click();
  expect(page.url()).toBe(savedUrl);await expect(page.getByRole("heading",{name:"Account balance unavailable",exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Leave for now",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname==="/services");
  await expect(page.getByRole("heading",{name:"Your dashboard",exact:true})).toBeVisible();
  const intents=await getDb().select().from(moneyWithdrawalIntents).where(eq(moneyWithdrawalIntents.moneyAccountId,account!.id));
  expect(intents).toHaveLength(1);expect(intents[0]!.id).toBe(reviewId);
  const withdrawals=await getDb().select().from(moneyWithdrawals).where(eq(moneyWithdrawals.moneyAccountId,account!.id));
  expect(withdrawals).toHaveLength(expectedWithdrawals);if(phase==="confirmation")expect(withdrawals[0]!.amountMinor).toBe(1234n);
  expect(attempts).toHaveLength(2);
 }finally{
  await getDb().update(serviceMembers).set({state:"ACCEPTED"}).where(membership);
 }
 expect((await getMoneyAccountOverview(ownerId,account!.id)).available.minor).toBe(phase==="review"?"1250":"16");
});


test("retired Merchant funding links keep saved reviews readable without creating new money",async({page})=>{
 const f=await networkCheckoutFixture(),[account]=await listOwnedMoneyAccounts(f.personId),reviewId=randomUUID();
 // An unposted historical review remains evidence. This fixture creates no funding command or ledger entry.
 await getDb().insert(moneyFundingIntents).values({id:reviewId,moneyAccountId:account!.id,actorId:f.personId,amountMinor:1234n,confirmCommandId:randomUUID(),createdAt:new Date()});
 await signInPerson(page,f.personId);
 let posts=0;page.on("request",request=>{if(request.method()==="POST"&&new URL(request.url()).pathname.includes(`/money-accounts/${account!.id}/funding/`))posts++;});
 for(const path of [moneyUrl(account!.id,"/merchant-services?section=funds",{task:"add"}),moneyUrl(account!.id,"/merchant-services?section=funds",{task:"add",review:reviewId})]){
  await page.goto(path);await expect(page.getByRole("heading",{name:"Funding review",exact:true})).toBeVisible();
  await expect(page.locator("main")).toContainText("Adding money is no longer available.");
  await expect(page.getByRole("textbox",{name:"Amount (USD)",exact:true})).toHaveCount(0);
  await expect(page.getByRole("button",{name:"Confirm and add money",exact:true})).toHaveCount(0);
  await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(0);
 }
 await expect(page.locator(".money-task")).toContainText("$12.34");
 expect(posts).toBe(0);expect((await getMoneyAccountOverview(f.personId,account!.id)).available.minor).toBe("0");
 expect(await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account!.id))).toHaveLength(0);
});
