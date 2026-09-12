import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {expect,test} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {moneyFundingIntents,moneyTopups} from "../../src/modules/money/schema";
import {getCardholderFunds} from "../../src/modules/workspace/service";
import {getServiceMoneyAccount} from "../../src/modules/money/service";
import {ledgerEntries,ledgerJournals} from "../../src/modules/ledger/schema";
import {fundingIntentSchema,topupReceiptSchema} from "../../src/shared/funding-response";
import {cardPrimary} from "../helpers/cardholder";
import {signInPerson} from "./helpers/prepaid";

test.afterAll(closeDatabase);

test("funding waits for its saved review navigation before confirming and recovers one committed top-up",async({page})=>{
 const primary=await cardPrimary(`Funding navigation ${randomUUID().slice(0,8)}`),amount="7361";
 const account=await getDb().transaction(tx=>getServiceMoneyAccount(tx,primary.serviceId));
 await signInPerson(page,primary.personId);
 const base=`/api/v1/cardholder-services/${primary.serviceId}/funds/intents`;
 await page.goto(`/cardholder-services/funds?service=${primary.serviceId}`);
 const panel=page.locator('section[aria-labelledby="funding-title"]');
 await expect(panel.getByRole("heading",{name:"Add money",exact:true})).toBeVisible();
 let releaseNavigation!:()=>void;
 const navigationGate=new Promise<void>(resolve=>{releaseNavigation=resolve;});
 let heldReviewId="",navigationHeld=false;
 await page.route(url=>url.pathname==="/cardholder-services/funds"&&url.searchParams.has("review"),async route=>{
  if(route.request().method()!=="GET"||route.request().headers().rsc!=="1"||heldReviewId){await route.continue();return;}
  heldReviewId=new URL(route.request().url()).searchParams.get("review")!;
  // Obtain the actual saved review from the server, but hold its RSC response
  // so the original amount form has not yet remounted under the review key.
  const response=await route.fetch();
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/x-component");
  navigationHeld=true;
  await navigationGate;
  await route.fulfill({response});
 });
 const confirmations:Array<{path:string;body:unknown}>=[];
 let preparedId="",receiptId="";
 await page.route(`**${base}**`,async route=>{
  if(route.request().method()!=="POST"){await route.continue();return;}
  const path=new URL(route.request().url()).pathname;
  const response=await route.fetch();expect(response.status()).toBe(200);
  if(path===base){
   const saved=fundingIntentSchema.parse(await response.json());
   preparedId=saved.id;
   expect(saved).toMatchObject({serviceId:primary.serviceId,amount:{minor:amount},receipt:null});
   await route.fulfill({response});return;
  }
  confirmations.push({path,body:route.request().postDataJSON()});
  const receipt=topupReceiptSchema.parse(await response.json());
  expect(receipt).toMatchObject({serviceId:primary.serviceId,amount:{minor:amount},status:"COMPLETED"});
  if(confirmations.length===1){receiptId=receipt.id;await route.abort("connectionfailed");}
  else{expect(receipt.id).toBe(receiptId);await route.fulfill({response});}
 });
 await page.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill("73.61");
 const confirm=panel.getByRole("button",{name:"Confirm and add money",exact:true});
 try{
  await panel.getByRole("button",{name:"Continue",exact:true}).click();
  await expect.poll(()=>navigationHeld).toBe(true);
  expect(heldReviewId).toBe(preparedId);
  await expect(panel.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();
  await expect(confirm).toBeDisabled();
  await expect(confirm).toHaveAttribute("aria-busy","true");
  await expect(panel.getByRole("link",{name:"Change amount",exact:true})).toHaveCount(0);
  await confirm.evaluate(button=>(button as HTMLButtonElement).click());
  expect(confirmations).toHaveLength(0);
  expect(await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account.id))).toHaveLength(0);
  expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe("0");
 }finally{releaseNavigation();}
 await expect(page).toHaveURL(url=>url.searchParams.get("review")===preparedId);
 await expect(confirm).toBeEnabled();
 const savedUrl=page.url();
 await confirm.click();
 const retry=panel.getByRole("button",{name:"Retry this top-up",exact:true});
 await expect(retry).toBeEnabled();
 await expect(panel.getByRole("heading",{name:"Money added",exact:true})).toHaveCount(0);
 await expect(panel.getByRole("link",{name:"Change amount",exact:true})).toHaveCount(0);
 expect(confirmations).toEqual([{path:`${base}/${preparedId}`,body:{}}]);
 expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe(amount);
 await retry.click();
 await expect(panel.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();
 expect(confirmations).toHaveLength(2);expect(confirmations[1]).toEqual(confirmations[0]);
 expect(page.url()).toBe(savedUrl);
 const read=await page.request.get(`${base}/${preparedId}`);expect(read.status()).toBe(200);
 const saved=fundingIntentSchema.parse(await read.json());
 expect(saved.receipt?.id).toBe(receiptId);
 await expect(panel).toContainText(saved.receipt!.reference);
 await page.reload();expect(page.url()).toBe(savedUrl);
 await expect(panel.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();
 await expect(panel).toContainText(saved.receipt!.reference);
 const intents=await getDb().select().from(moneyFundingIntents).where(eq(moneyFundingIntents.moneyAccountId,account.id));
 expect(intents).toHaveLength(1);expect(intents[0]!.id).toBe(preparedId);expect(intents[0]!.confirmCommandId).toBe(receiptId);
 const topups=await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account.id));
 expect(topups).toHaveLength(1);expect(topups[0]!.id).toBe(receiptId);
 const journals=await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.referenceId,receiptId));
 expect(journals).toHaveLength(1);expect(journals[0]!.kind).toBe("MONEY_FUNDING");
 const entries=await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.moneyAccountId,account.id));
 expect(entries).toHaveLength(2);expect(entries.reduce((sum,line)=>sum+line.deltaMinor,0n)).toBe(0n);
 expect(entries.find(line=>line.bucket==="MONEY_AVAILABLE")?.deltaMinor).toBe(7361n);
 expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe(amount);
});
