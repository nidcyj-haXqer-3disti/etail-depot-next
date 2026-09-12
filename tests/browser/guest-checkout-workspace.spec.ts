import {expect,test} from "@playwright/test";
import {closeDatabase} from "../../src/platform/database/client";
import {cardCheckoutReviewSchema} from "../../src/shared/card-checkout-response";
import {merchantOperationsProjectionSchema} from "../../src/modules/acquiring/operations-api-contracts";
import {publishedGuestChannel} from "./helpers/guest";
import {freshPrepaidCard,openSavedCardReview,signInPerson} from "./helpers/prepaid";
test.afterAll(closeDatabase);

test("published customer link requires sign-in, preserves a private card receipt and stops new payments after revocation",async({page,browser})=>{
 test.setTimeout(90_000);
 const {merchant,channel,publication}=await publishedGuestChannel(page.request,"REUSABLE");
 const qr=await page.request.get(`/api/v1/guest/publications/${publication.id}/qr`);expect(qr.status()).toBe(200);expect(qr.headers()["content-type"]).toBe("image/png");expect(qr.headers()["cache-control"]).toContain("no-store");expect((await qr.body()).subarray(0,8).toString("hex")).toBe("89504e470d0a1a0a");
 const payer=await freshPrepaidCard("3680");
 const context=await browser.newContext({baseURL:"http://127.0.0.1:3100",viewport:page.viewportSize()??undefined}),customer=await context.newPage();
 try{
  await customer.goto(publication.publicHref);await expect(customer.getByRole("heading",{name:channel.description,exact:true})).toBeVisible();
  await customer.getByRole("link",{name:"Choose a card",exact:true}).click();await expect(customer).toHaveURL(/\/login\?next=/);
  expect(new URL(customer.url()).searchParams.get("next")).toBe(`/checkout/${publication.id}/card`);
  await signInPerson(customer,payer.primary.personId);
  const saved=await openSavedCardReview(customer,publication.id,payer.card.id);
  await customer.reload();await expect(customer.getByRole("heading",{name:"Review your payment",exact:true})).toBeVisible();
  await customer.getByRole("button",{name:"Pay $18.40",exact:true}).click();await expect(customer.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
  const response=await customer.request.get(saved.confirmPath);expect(response.status()).toBe(200);const receipt=cardCheckoutReviewSchema.parse(await response.json()).receipt!;
  await customer.reload();await expect(customer.locator("main")).toContainText(receipt.reference);
  expect(await customer.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,cookie:document.cookie}))).toEqual({local:0,session:0,cookie:""});
  const outsider=await browser.newContext({baseURL:"http://127.0.0.1:3100"});try{expect((await outsider.request.get(saved.confirmPath)).status()).toBe(401);const outside=await outsider.newPage();await outside.goto(saved.url);await expect(outside).toHaveURL(/\/login\?next=/);await expect(outside.locator("main")).not.toContainText(receipt.reference);}finally{await outsider.close();}
  const activity=await page.request.get(`/api/v1/merchants/${merchant.id}/operations`);expect(activity.status()).toBe(200);const payments=merchantOperationsProjectionSchema.parse(await activity.json()).payments.filter(row=>row.channelId===channel.id);expect(payments).toHaveLength(1);expect(payments[0]!.id).toBe(receipt.paymentId);
  await page.goto(`/merchants/${merchant.id}?tab=channels&channel=${channel.id}`);const links=page.getByRole("region",{name:"Customer payment link",exact:true});
  await links.getByRole("button",{name:"Turn off payment link",exact:true}).click();await links.getByRole("button",{name:"Turn off link",exact:true}).click();await expect(links.getByText("Link turned off",{exact:true})).toBeVisible();
  expect((await page.request.get(`/api/v1/guest/publications/${publication.id}/qr`)).status()).toBe(404);
  await customer.reload();await expect(customer.locator("main")).toContainText(receipt.reference);
  await customer.goto(publication.publicHref);await expect(customer.getByRole("link",{name:"Choose a card",exact:true})).toHaveCount(0);
 }finally{await context.close();}
});
