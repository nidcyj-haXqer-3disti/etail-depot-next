import {and,eq} from "drizzle-orm";
import {expect,test} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {merchantTestPayments} from "../../src/modules/acquiring/operations-schema";
import {cardCheckoutReviewSchema} from "../../src/modules/acquiring/card-checkout-contracts";
import {getWorkspace} from "../../src/modules/workspace/service";
import {freshPrepaidCard,freshPublishedPayment,prepareSavedCardReview,signInPerson} from "./helpers/prepaid";

test.afterAll(closeDatabase);

test("a saved card review loads before confirmation and retains its exact receipt",async({page})=>{
 test.setTimeout(60_000);
 const {primary,card}=await freshPrepaidCard("900");
 const merchant=await freshPublishedPayment("325");
 await signInPerson(page,primary.personId);
 const checkoutPath=`/checkout/${merchant.publication.id}/card`;
 const confirmationPath=`/api/v1/checkout/${merchant.publication.id}/card/`;
 const prepared=await prepareSavedCardReview(page,merchant.publication.id,card.id);
 await page.goto(checkoutPath);await expect(page).toHaveURL(url=>url.pathname===`/checkout/${merchant.publication.id}`);
 await expect(page.getByRole("combobox",{name:"Your card",exact:true})).toHaveCount(0);
 expect((await page.request.post(`/api/v1/checkout/${merchant.publication.id}/card`,{headers:{Origin:"http://127.0.0.1:3100","Content-Type":"application/json"},data:{}})).status()).toBe(404);
 await page.goto("/services");
 await expect(page.getByRole("button",{name:"Pay $3.25",exact:true})).toHaveCount(0);
 let release=()=>{},navigationCaptured=false,confirmations=0;
 const held=new Promise<void>(resolve=>{release=resolve;});
 page.on("request",request=>{if(request.method()==="POST"&&new URL(request.url()).pathname.startsWith(confirmationPath))confirmations++;});
 await page.route(url=>url.pathname===checkoutPath&&url.searchParams.has("review"),async route=>{
  const response=await route.fetch();
  expect(response.status()).toBe(200);navigationCaptured=true;
  // Delay the exact saved page without inventing or posting a financial result.
  await held;await route.fulfill({response});
 });
 let navigating:Promise<unknown>|undefined;
 try{
  navigating=page.goto(`${checkoutPath}?review=${prepared.id}`);
  await expect.poll(()=>navigationCaptured).toBe(true);
  // While navigation is held, verify the actual application effects without asking
  // Playwright to query a document whose replacement is intentionally pending.
  expect(confirmations).toBe(0);
  expect(await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.channelId,merchant.channel.id))).toHaveLength(0);
  release();await navigating;
  await expect(page).toHaveURL(url=>url.searchParams.get("review")===prepared.id);
  const pay=page.getByRole("button",{name:"Pay $3.25",exact:true});
  await expect(pay).toBeEnabled();
  await pay.click();
  await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
  const url=page.url(),id=new URL(url).searchParams.get("review");expect(id).not.toBeNull();
  const response=await page.request.get(`${confirmationPath}${id}`);expect(response.status()).toBe(200);
  const saved=cardCheckoutReviewSchema.parse(await response.json());expect(saved.receipt).not.toBeNull();
  await expect(page.locator("main")).toContainText(saved.receipt!.reference);
  await page.reload();
  await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
  await expect(page.locator("main")).toContainText(saved.receipt!.reference);expect(page.url()).toBe(url);
  expect(confirmations).toBe(1);
  const workspace=await getWorkspace(primary.personId,primary.serviceId);
  expect(workspace.cards.find(row=>row.id===card.id)?.available.minor).toBe("575");
  expect(workspace.activity.filter(row=>row.cardId===card.id&&row.direction==="DEBIT")).toHaveLength(1);
  expect(await getDb().select().from(merchantTestPayments).where(and(eq(merchantTestPayments.channelId,merchant.channel.id),eq(merchantTestPayments.cardCheckoutId,saved.id)))).toHaveLength(1);
 }finally{release();await navigating?.catch(()=>{});}
});
