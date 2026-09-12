import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {permissionGrants} from "../../src/platform/database/schema";
import {moneyFundingIntents,moneyTopups} from "../../src/modules/money/schema";
import {getCardholderFunds} from "../../src/modules/workspace/service";
import {getServiceMoneyAccount} from "../../src/modules/money/service";
import {ledgerEntries,ledgerJournals} from "../../src/modules/ledger/schema";
import {fundingIntentSchema,topupReceiptSchema} from "../../src/shared/funding-response";
import {cardPrimary} from "../helpers/cardholder";
import {signInPerson} from "./helpers/prepaid";

test.afterAll(closeDatabase);

for(const phase of ["review","confirmation"] as const)test(`malformed funding ${phase} preserves the saved request through access denial and adds money once`,async({page})=>{
 test.setTimeout(90_000);
 const name=`Funding recovery ${randomUUID().slice(0,8)}`,primary=await cardPrimary(name),amount="4237";
 const account=await getDb().transaction(tx=>getServiceMoneyAccount(tx,primary.serviceId));
 await signInPerson(page,primary.personId);
 const base=`/api/v1/cardholder-services/${primary.serviceId}/funds/intents`;
 await page.goto(`/cardholder-services/funds?service=${primary.serviceId}`);
 await expect(page.getByRole("heading",{name:"Add money",level:1,exact:true})).toBeVisible();
 const panel=page.locator('section[aria-labelledby="funding-title"]');
 await page.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill("42.37");
 let intentId="",savedUrl="",path=base,firstReceiptId="";
 if(phase==="confirmation"){
  await panel.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(panel.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();
  await expect(page).toHaveURL(/review=[0-9a-f-]{36}/);
  savedUrl=page.url();intentId=new URL(savedUrl).searchParams.get("review")!;path=`${base}/${intentId}`;
  await page.reload();expect(page.url()).toBe(savedUrl);
  await expect(panel.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();
  expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe("0");
 }
 const attempts:Array<{path:string;body:unknown}>=[],statuses:number[]=[];
 await page.route(`**${path}`,async route=>{
  if(route.request().method()!=="POST"){await route.continue();return;}
  attempts.push({path:new URL(route.request().url()).pathname,body:route.request().postDataJSON()});
  const response=await route.fetch();statuses.push(response.status());
  if(attempts.length===1){
   expect(response.status()).toBe(200);
   if(phase==="review"){
    const saved=fundingIntentSchema.parse(await response.json());intentId=saved.id;
    expect(saved).toMatchObject({serviceId:primary.serviceId,amount:{minor:amount},receipt:null});
   }else{
    const saved=topupReceiptSchema.parse(await response.json());firstReceiptId=saved.id;
    expect(saved).toMatchObject({serviceId:primary.serviceId,amount:{minor:amount},status:"COMPLETED"});
   }
   // The real command has committed. This is valid JSON with an invalid success
   // shape, so a JSON parser alone cannot safely treat it as a confirmed result.
   await route.fulfill({status:200,json:{}});
  }else await route.fulfill({response});
 });
 await panel.getByRole("button",{name:phase==="review"?"Continue":"Confirm and add money",exact:true}).click();
 const retryLabel=phase==="review"?"Retry review":"Retry this top-up";
 await expect(panel.getByRole("button",{name:retryLabel,exact:true})).toBeEnabled();
 await expect(panel.getByRole("heading",{name:"Money added",exact:true})).toHaveCount(0);
 if(phase==="review"){
  await expect(page.getByRole("textbox",{name:"Amount (USD)",exact:true})).toBeDisabled();
  expect(new URL(page.url()).searchParams.has("review")).toBe(false);
  expect(attempts[0]!.body).toMatchObject({commandId:intentId,amountMinor:amount,currency:"USD",source:"SANDBOX_BANK"});
 }else{
  expect(page.url()).toBe(savedUrl);expect(attempts[0]!.body).toEqual({});
  await expect(panel.getByRole("link",{name:"Change amount",exact:true})).toHaveCount(0);
  await expect(panel.getByRole("link",{name:"Add more money",exact:true})).toHaveCount(0);
 }
 const storedIntents=await getDb().select().from(moneyFundingIntents).where(eq(moneyFundingIntents.moneyAccountId,account.id));
 expect(storedIntents).toHaveLength(1);expect(storedIntents[0]!.id).toBe(intentId);
 let topups=await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account.id));
 expect(topups).toHaveLength(phase==="review"?0:1);
 if(phase==="confirmation")expect(topups[0]!.id).toBe(firstReceiptId);
 expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe(phase==="review"?"0":amount);
 const grant=and(eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.personId,primary.personId),eq(permissionGrants.action,"cardholder.funds.read"));
 expect(await getDb().update(permissionGrants).set({state:"REVOKED"}).where(grant).returning({action:permissionGrants.action})).toEqual([{action:"cardholder.funds.read"}]);
 await panel.getByRole("button",{name:retryLabel,exact:true}).click();
 await expect.poll(()=>statuses.length).toBe(2);expect(statuses).toEqual([200,403]);
 await expect(page.getByRole("heading",{name:"Funding access unavailable",exact:true})).toBeVisible();
 const main=page.locator("main");
 await expect(main).not.toContainText(name);await expect(main).not.toContainText("$42.37");
 await expect(main).not.toContainText("Funding balance");await expect(main).not.toContainText("Total card allowance");
 await expect(page.locator(".funds-balance,.funds-history")).toHaveCount(0);
 await expect(page.getByRole("textbox",{name:"Amount (USD)",exact:true})).toHaveCount(0);
 await expect(page.getByRole("link",{name:"Change amount",exact:true})).toHaveCount(0);
 const retry=page.getByRole("button",{name:"Retry saved funding request",exact:true});await expect(retry).toBeEnabled();
 if(firstReceiptId)await expect(main).not.toContainText(`ADD-${firstReceiptId.slice(0,8).toUpperCase()}`);
 const viewport=page.viewportSize();await page.setViewportSize({width:320,height:568});
 expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 if(viewport)await page.setViewportSize(viewport);
 expect(await getDb().update(permissionGrants).set({state:"ACCEPTED"}).where(grant).returning({action:permissionGrants.action})).toEqual([{action:"cardholder.funds.read"}]);
 await retry.click();
 if(phase==="review"){
  await expect(panel.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();
  await expect(page).toHaveURL(url=>url.searchParams.get("review")===intentId);
  savedUrl=page.url();
  expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe("0");
  await page.reload();expect(page.url()).toBe(savedUrl);
  await expect(panel).toContainText("$42.37");
  await panel.getByRole("button",{name:"Confirm and add money",exact:true}).click();
 }
 await expect(panel.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();
 expect(statuses).toEqual([200,403,200]);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
 expect(new URL(page.url()).searchParams.get("review")).toBe(intentId);expect(page.url()).toBe(savedUrl);
 const read=await page.request.get(`${base}/${intentId}`);expect(read.status()).toBe(200);
 const saved=fundingIntentSchema.parse(await read.json());expect(saved.id).toBe(intentId);expect(saved.receipt).not.toBeNull();
 expect(saved.receipt).toMatchObject({serviceId:primary.serviceId,amount:{minor:amount},status:"COMPLETED"});
 if(firstReceiptId)expect(saved.receipt!.id).toBe(firstReceiptId);
 expect(saved.receipt!.id).toBe(storedIntents[0]!.confirmCommandId);
 await expect(panel).toContainText(saved.receipt!.reference);
 await page.reload();expect(page.url()).toBe(savedUrl);
 await expect(panel.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();
 await expect(panel).toContainText(saved.receipt!.reference);await expect(page.locator(".funds-balance")).toContainText("$42.37");
 topups=await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account.id));
 expect(topups).toHaveLength(1);expect(topups[0]!.id).toBe(saved.receipt!.id);
 expect(await getDb().select().from(moneyFundingIntents).where(eq(moneyFundingIntents.moneyAccountId,account.id))).toHaveLength(1);
 const journals=await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.referenceId,saved.receipt!.id));
 expect(journals).toHaveLength(1);expect(journals[0]!.kind).toBe("MONEY_FUNDING");
 const lines=await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.moneyAccountId,account.id));
 expect(lines).toHaveLength(2);expect(lines.reduce((sum,line)=>sum+line.deltaMinor,0n)).toBe(0n);
 expect(lines.find(line=>line.bucket==="MONEY_AVAILABLE")?.deltaMinor).toBe(4237n);
 const funds=await getCardholderFunds(primary.personId,primary.serviceId);
 expect(funds.available.minor).toBe(amount);expect(funds.cards).toEqual([]);
 await page.goto(`/cardholder-services/funds/receipts/${saved.receipt!.id}?service=${primary.serviceId}`);
 await expect(page.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();await expect(page.locator("main")).toContainText(saved.receipt!.reference);
});
