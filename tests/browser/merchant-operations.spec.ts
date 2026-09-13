import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Page} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {merchantTestRefunds} from "../../src/modules/acquiring/operations-schema";
import {merchantSettlements,merchantSettlementItems} from "../../src/modules/acquiring/settlement-schema";
import {readServiceMoneyAvailable} from "../../src/modules/money/service";
import {cardCheckoutReviewSchema} from "../../src/modules/acquiring/card-checkout-contracts";
import {cardDashboard} from "./helpers/fresh";
import {signInPerson} from "./helpers/prepaid";
import {additionalPublishedPayment,freshConnectedPayment,merchantOperations,payPublishedMerchant} from "./helpers/merchant-payments";

test.afterAll(closeDatabase);
async function reviewSettlement(page:Page,terminalId:string,amount:string,count:number){
 const terminalName=(await page.getByRole("region",{name:"Selected payment terminal",exact:true}).getByRole("heading",{level:1}).innerText()).trim();
 await page.goto(`/merchant-services?section=funds&view=unit:${terminalId}`);
 await page.locator(".money-incoming > summary").click();
 await page.getByRole("region",{name:`Settlement for ${terminalName}`,exact:true}).getByRole("button",{name:"Review settlement",exact:true}).click();
 const details=page.getByRole("dialog",{name:"Settle received payments",exact:true});
 await expect(details).toContainText(amount);
 await expect(details.locator("dl>div").filter({has:page.getByText("Payments included",{exact:true})})).toContainText(String(count));
 await expect(details.getByRole("textbox")).toHaveCount(0);
 await details.getByRole("button",{name:"Review settlement",exact:true}).click();
 const review=page.getByRole("dialog",{name:"Review settlement",exact:true});
 await expect(review).toContainText("Settlement and payout are separate steps.");
 return review;
}

test("a connected payment and full refund keep exact receipts and one atomic refund through a lost result",async({page})=>{
 test.setTimeout(90_000);
 const f=await freshConnectedPayment(page),m=f.merchant;
 expect((await merchantOperations(page,m.unit.id)).availableFunds?.minor).toBe("1250");
 await page.goto(`/merchants/${m.unit.id}?tab=payments&payment=${f.payment.id}`);
 const receipt=page.getByRole("dialog",{name:"Payment details",exact:true});
 await expect(receipt).toContainText(f.review.receipt!.reference);
 await receipt.getByRole("button",{name:"Refund payment",exact:true}).click();
 const details=page.getByRole("dialog",{name:"Refund this payment",exact:true});
 await details.getByRole("textbox",{name:"Reason for refund",exact:true}).fill("Customer canceled this fictional order");
 await details.getByRole("button",{name:"Review refund",exact:true}).click();
 const review=page.getByRole("dialog",{name:"Review full refund",exact:true}),bodies:unknown[]=[];
 const path=`/api/v1/merchants/${m.unit.id}/payments/${f.payment.id}/refund`;
 await page.route(`**${path}`,async route=>{
  bodies.push(route.request().postDataJSON());const response=await route.fetch();expect(response.status()).toBe(200);
  if(bodies.length===1)await route.abort("failed");else await route.fulfill({response});
 });
 await review.getByRole("button",{name:"Confirm full refund",exact:true}).click();
 await expect(review.getByRole("button",{name:"Check request again",exact:true})).toBeEnabled();
 await page.keyboard.press("Escape");await expect(review).toBeVisible();
 const pendingUrl=page.url();await page.locator("header a[href]").first().dispatchEvent("click");expect(page.url()).toBe(pendingUrl);
 await review.getByRole("button",{name:"Check request again",exact:true}).click();
 await expect(review).toBeHidden();expect(bodies).toHaveLength(2);expect(bodies[1]).toEqual(bodies[0]);
 const after=await merchantOperations(page,m.unit.id);
 expect(after.availableFunds?.minor).toBe("0");expect(after.payments).toHaveLength(1);
 expect(after.payments[0]).toMatchObject({id:f.payment.id,status:"REFUNDED",refund:{amount:{minor:"1250"}}});
 expect(await getDb().select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,f.payment.id))).toHaveLength(1);
 await page.goto(`/merchants/${m.unit.id}?tab=payments&activity=refunds&q=${f.payment.testReference}&payment=${f.payment.id}`);
 await expect(receipt).toContainText("Customer canceled this fictional order");
 await page.reload();await expect(receipt).toContainText(after.payments[0]!.refund!.testReference);
 await signInPerson(page,f.payer.primary.personId);
 expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.payer.primary.serviceId))).toBe(10000n);
 expect((await cardDashboard(page.request)).cards.find(card=>card.id===f.payer.card.id)?.available.minor).toBe("8750");
 // Group funds are restored, while the total card allowance remains consumed.
 const payerReview=cardCheckoutReviewSchema.parse(await(await page.request.get(f.confirmPath)).json());
 expect(payerReview.receipt?.refundedAt).not.toBeNull();
 await page.goto(f.url);await expect(page.getByRole("heading",{name:"Payment refunded",exact:true})).toBeVisible();
 await expect(page.locator("main")).toContainText("returned to the original card balance");
});


test("exact settlement survives a lost result and credits merchant money once while card money stays separate",async({page})=>{
 test.setTimeout(120_000);
 const f=await freshConnectedPayment(page),m=f.merchant;
 const second=await payPublishedMerchant(page,await additionalPublishedPayment(m,"750"),f.payer);
 const before=await merchantOperations(page,m.unit.id);
 expect(before.depositReview).toMatchObject({amount:{minor:"2000"},paymentCount:2});
 await page.goto(`/merchants/${m.unit.id}?tab=payments`);
 const review=await reviewSettlement(page,m.unit.id,"$20.00",2),bodies:unknown[]=[];
 await page.route(`**/api/v1/merchants/${m.unit.id}/settlements`,async route=>{
  bodies.push(route.request().postDataJSON());const response=await route.fetch();expect(response.status()).toBe(200);
  if(bodies.length===1)await route.abort("failed");else await route.fulfill({response});
 });
 await review.getByRole("button",{name:"Confirm settlement",exact:true}).click();
 await expect(review.getByRole("button",{name:"Check request again",exact:true})).toBeEnabled();
 await page.keyboard.press("Escape");await expect(review).toBeVisible();
 const pendingUrl=page.url();await page.locator("header a[href]").first().dispatchEvent("click");expect(page.url()).toBe(pendingUrl);
 await review.getByRole("button",{name:"Check request again",exact:true}).click();
 await expect(review).toBeHidden();expect(bodies).toHaveLength(2);expect(bodies[1]).toEqual(bodies[0]);
 expect(bodies[0]).toMatchObject({reviewToken:before.depositReview!.token});expect(bodies[0]).not.toHaveProperty("amountMinor");
 const after=await merchantOperations(page,m.unit.id);
 expect(after).toMatchObject({availableFunds:{minor:"0"},pendingDeposits:{minor:"0"},bankFunds:{minor:"2000"},depositReview:null,payouts:[]});
 expect(after.settlements).toHaveLength(1);
 expect(await getDb().select().from(merchantSettlements).where(eq(merchantSettlements.merchantUnitId,m.unit.id))).toHaveLength(1);
 const items=await getDb().select().from(merchantSettlementItems).where(eq(merchantSettlementItems.settlementId,after.settlements[0]!.settlementId));
 expect(new Set(items.map(item=>item.paymentId))).toEqual(new Set([f.payment.id,second.payment.id]));
 expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.payer.primary.serviceId))).toBe(8000n);
 await page.reload();await page.locator(".money-incoming > summary").click();await expect(page.getByRole("region",{name:`Settlement for ${m.unit.displayName}`,exact:true}).getByRole("button",{name:"Review settlement",exact:true})).toBeDisabled();
 await page.setViewportSize({width:320,height:900});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
});

test("a settlement result for a different terminal remains unconfirmed and exact retry recovers the saved receipt",async({page})=>{
 test.setTimeout(90_000);const f=await freshConnectedPayment(page),m=f.merchant;
 await page.goto(`/merchants/${m.unit.id}?tab=payments`);
 const review=await reviewSettlement(page,m.unit.id,"$12.50",1),bodies:unknown[]=[];
 await page.route(`**/api/v1/merchants/${m.unit.id}/settlements`,async route=>{
  bodies.push(route.request().postDataJSON());const response=await route.fetch();expect(response.status()).toBe(200);
  if(bodies.length===1)await route.fulfill({status:200,json:{...await response.json(),terminalId:randomUUID()}});else await route.fulfill({response});
 });
 await review.getByRole("button",{name:"Confirm settlement",exact:true}).click();
 await expect(review.getByRole("button",{name:"Check request again",exact:true})).toBeEnabled();
 await expect(review).toContainText("couldn’t confirm this payment result");
 await review.getByRole("button",{name:"Check request again",exact:true}).click();await expect(review).toBeHidden();
 expect(bodies[1]).toEqual(bodies[0]);expect((await merchantOperations(page,m.unit.id)).settlements).toHaveLength(1);
});

test("new collections invalidate an open settlement review and require the updated exact batch",async({page,browser})=>{
 test.setTimeout(120_000);const f=await freshConnectedPayment(page),m=f.merchant,before=await merchantOperations(page,m.unit.id);
 await page.goto(`/merchants/${m.unit.id}?tab=payments`);const review=await reviewSettlement(page,m.unit.id,"$12.50",1);
 const other=await browser.newContext({baseURL:"http://127.0.0.1:3100"});
 try{await payPublishedMerchant(await other.newPage(),await additionalPublishedPayment(m,"500"),f.payer);}finally{await other.close();}
 const requests:{commandId:string;reviewToken:string}[]=[],statuses:number[]=[];
 await page.route(`**/api/v1/merchants/${m.unit.id}/settlements`,async route=>{requests.push(route.request().postDataJSON());const response=await route.fetch();statuses.push(response.status());await route.fulfill({response});});
 await review.getByRole("button",{name:"Confirm settlement",exact:true}).click();
 await expect(review).toContainText("New payments or refunds changed the amount ready to move.");
 await expect(review.getByRole("button",{name:"Confirm settlement",exact:true})).toBeDisabled();
 expect(statuses).toEqual([409]);expect(requests[0]!.reviewToken).toBe(before.depositReview!.token);
 expect(await getDb().select().from(merchantSettlements).where(eq(merchantSettlements.merchantUnitId,m.unit.id))).toEqual([]);
 await review.getByRole("button",{name:"Reload payment status",exact:true}).click();await expect(review).toContainText("$17.50");
 await review.getByRole("button",{name:"Confirm settlement",exact:true}).click();await expect(review).toBeHidden();
 expect(statuses).toEqual([409,200]);expect(requests[1]!.commandId).not.toBe(requests[0]!.commandId);expect(requests[1]!.reviewToken).not.toBe(requests[0]!.reviewToken);
 const after=await merchantOperations(page,m.unit.id);expect(after.settlements).toHaveLength(1);expect(after.bankFunds?.minor).toBe("1750");
});
