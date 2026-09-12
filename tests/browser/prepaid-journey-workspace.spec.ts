import {randomUUID} from "node:crypto";
import {mkdir} from "node:fs/promises";
import {and,eq} from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Page,type Response,type Route,type TestInfo} from "@playwright/test";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {identityBindings,serviceActivity} from "../../src/platform/database/schema";
import {sessionRepository} from "../../src/platform/database/session-repository";
import {SessionService} from "../../src/modules/identity";
import {operatorServiceAccess} from "../../src/modules/operations/schema";
import {moneyTopups} from "../../src/modules/money/schema";
import {getServiceMoneyAccount} from "../../src/modules/money/service";
import {getCardholderFunds,getCardSpending} from "../../src/modules/workspace/service";
import type {TopupReceipt} from "../../src/modules/workspace/funding-contracts";
import {cardholderDashboardSchema,cardRequestProjectionSchema} from "../../src/modules/workspace/api-contracts";
import {createChannel,updateMerchantSetup,submitMerchantSetup,getMerchantWorkspace} from "../../src/modules/acquiring/service";
import {configureTestGateway,enrollTestMerchant,setChannelActivation,getMerchantOperations} from "../../src/modules/acquiring/operations-service";
import {publishGuestChannel} from "../../src/modules/acquiring/guest-service";
import {cardCheckoutReviewSchema,type CardCheckoutReview} from "../../src/modules/acquiring/card-checkout-contracts";
import {merchantOperationsProjectionSchema,merchantTestPaymentProjectionSchema,merchantSettlementReceiptSchema} from "../../src/modules/acquiring/operations-api-contracts";
import {merchantTestPayments,merchantTestRefunds} from "../../src/modules/acquiring/operations-schema";
import {merchantSettlements,merchantSettlementItems} from "../../src/modules/acquiring/settlement-schema";
import {cardPerson,cardPrimary} from "../helpers/cardholder";
import {acquiringFixture,completeSetup} from "../helpers/acquiring";

const origin="http://127.0.0.1:3100";
test.beforeAll(()=>{
  if(process.env.APP_ENV!=="test"||process.env.ENABLE_REAL_MONEY!=="false"||
    !process.env.DATABASE_URL||new URL(process.env.DATABASE_URL).pathname!=="/etail_depot_next_services_test"){
    throw new Error("This journey requires the guarded fictional test database, never the preview or hosted environment.");
  }
});
test.afterAll(closeDatabase);

async function signIn(page:Page,personId:string){
  const [identity]=await getDb().select().from(identityBindings).where(and(
    eq(identityBindings.personId,personId),
    eq(identityBindings.issuer,"urn:etail:isolated-fixture"),
  ));
  if(!identity)throw new Error("Expected this test's isolated fictional identity.");
  const session=await new SessionService(sessionRepository,{appEnv:"test",publicOrigin:origin}).issue({
    personId,identityId:identity.id,
  });
  const pair=session.cookie.split(";",1)[0]!,separator=pair.indexOf("=");
  await page.context().addCookies([{
    name:pair.slice(0,separator),value:pair.slice(separator+1),domain:"127.0.0.1",path:"/",
    httpOnly:true,sameSite:"Strict",expires:Math.floor(session.record.expiresAt.getTime()/1000),
  }]);
}

/** Only setup is a fixture. Every money movement in the journey uses the actual UI. */
async function publishedMerchant(){
  const merchant=await acquiringFixture();
  const saved=await updateMerchantSetup(
    merchant.personId,merchant.merchantId,merchant.setup.id,
    completeSetup(merchant.setup.version),
  );
  await submitMerchantSetup(merchant.personId,merchant.merchantId,saved.id,{
    commandId:randomUUID(),expectedVersion:saved.version,
  });
  await configureTestGateway(merchant.personId,merchant.merchantId,{
    commandId:randomUUID(),expectedVersion:0,enabled:true,
  });
  await enrollTestMerchant(merchant.personId,merchant.merchantId,{
    commandId:randomUUID(),expectedVersion:0,enabled:true,
  });
  const channel=await createChannel(merchant.personId,merchant.merchantId,{
    commandId:randomUUID(),description:"Ceramic cup order",amountMinor:"1250",
    currency:"USD",usage:"REUSABLE",
    expiresAt:new Date(Date.now()+7*86_400_000).toISOString(),
    presentations:["SMS","EMAIL","INVOICE","BILL","SOCIAL","QR","WEB"],
    visibility:"CREATOR_PRIVATE",
  });
  await setChannelActivation(merchant.personId,merchant.merchantId,channel.id,{
    commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:channel.version,active:true,
  });
  const published=await publishGuestChannel(merchant.personId,merchant.merchantId,channel.id,{
    commandId:randomUUID(),expectedChannelVersion:channel.version,
  });
  if(!published.publication)throw new Error("Canonical merchant publication is missing.");
  const workspace=await getMerchantWorkspace(merchant.personId,merchant.merchantId);
  expect(workspace.merchant.status).toBe("ACTIVE");
  const operatorId=await cardPerson("Robin Deposit Operations");
  await getDb().insert(operatorServiceAccess).values({
    serviceId:merchant.serviceId,personId:operatorId,state:"ACCEPTED",
    canRespond:false,canProcessDeposits:true,
  });
  return {...merchant,channel,publication:published.publication,operatorId,name:workspace.merchant.displayName};
}

function responseFor(page:Page,path:string,method="POST"){
  return page.waitForResponse(response=>
    new URL(response.url()).origin===origin&&
    new URL(response.url()).pathname===path&&response.request().method()===method,
  );
}
async function successful<T>(response:Response,parse:(value:unknown)=>T){
  expect(response.status()).toBe(200);
  return parse(await response.json());
}
async function cardDashboard(page:Page){
  const response=await page.request.get("/api/v1/cardholder-services?cardScope=OWN");
  expect(response.status()).toBe(200);
  return cardholderDashboardSchema.parse(await response.json());
}
async function merchantProjection(page:Page,merchantId:string){
  const response=await page.request.get("/api/v1/merchants/"+merchantId+"/operations");
  expect(response.status()).toBe(200);
  return merchantOperationsProjectionSchema.parse(await response.json());
}
function moneyCard(page:Page,label:string){
  return page.locator(".mop-money-card").filter({has:page.getByText(label,{exact:true})});
}
async function capture(page:Page,info:TestInfo,name:string){
  await mkdir(info.outputDir,{recursive:true});
  const filename=info.outputPath(name+".png");
  await page.screenshot({
    path:filename,fullPage:!(await page.getByRole("dialog").count()),
    animations:"disabled",
  });
  await info.attach(name,{path:filename,contentType:"image/png"});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
}
async function accessible(page:Page,info:TestInfo,name:string){
  const result=await new AxeBuilder({page}).include("main")
    .withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
  await info.attach(name+"-accessibility",{
    body:JSON.stringify({violations:result.violations},null,2),
    contentType:"application/json",
  });
  expect(result.violations).toEqual([]);
}
async function payFromPublishedLink(
  page:Page,
  merchant:Awaited<ReturnType<typeof publishedMerchant>>,
  cardId:string,
){
  await page.goto(merchant.publication.publicHref);
  await expect(page.getByRole("heading",{name:merchant.channel.description,level:1,exact:true})).toBeVisible();
  await page.getByRole("link",{name:"Choose a card",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Choose a card",exact:true})).toBeVisible();
  await page.getByRole("combobox",{name:"Your card",exact:true}).selectOption(cardId);
  const prepared=responseFor(page,"/api/v1/checkout/"+merchant.publication.id+"/card");
  await page.getByRole("button",{name:"Review payment",exact:true}).click();
  const review=await successful(await prepared,value=>cardCheckoutReviewSchema.parse(value));
  expect(review.receipt).toBeNull();
  expect(review.amount.minor).toBe("1250");
  await expect(page).toHaveURL(url=>url.searchParams.get("review")===review.id);
  await page.reload();
  await expect(page.getByRole("heading",{name:"Review your payment",exact:true})).toBeVisible();
  const confirmed=responseFor(page,"/api/v1/checkout/"+merchant.publication.id+"/card/"+review.id);
  await page.getByRole("button",{name:"Pay $12.50",exact:true}).click();
  const paid=await successful(await confirmed,value=>cardCheckoutReviewSchema.parse(value));
  expect(paid.id).toBe(review.id);
  expect(paid.receipt).not.toBeNull();
  await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
  await expect(page.locator("main")).toContainText(paid.receipt!.reference);
  await page.reload();
  await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
  await expect(page.locator("main")).toContainText(paid.receipt!.reference);
  return paid as CardCheckoutReview&{receipt:NonNullable<CardCheckoutReview["receipt"]>};
}

test("a prepaid group funds a connected checkout, refund and separate Merchant settlement",async({page},info)=>{
  test.setTimeout(180_000);
  const primaryName="Taylor Prepaid "+randomUUID().slice(0,8);
  const primary=await cardPrimary(primaryName);
  const merchant=await publishedMerchant();
  const account=await getDb().transaction(tx=>getServiceMoneyAccount(tx,primary.serviceId));
  await signIn(page,primary.personId);
  expect((await cardDashboard(page)).cards).toEqual([]);
  const fundsPath="/api/v1/cardholder-services/"+primary.serviceId;

  await test.step("save a top-up review and recover a committed but lost confirmation",async()=>{
    await page.goto("/cardholder-services");
    await page.getByRole("navigation",{name:"Cards and spending navigation"}).getByText("More",{exact:true}).click();
    await page.getByRole("navigation",{name:"Cards and spending navigation"})
      .getByRole("link",{name:"Add money",exact:true}).click();
    await expect(page.getByRole("heading",{name:"Add money",level:1,exact:true})).toBeVisible();
    await expect(page.locator(".funds-balance")).toContainText("$0.00");
    await page.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill("100.00");
    await page.getByRole("button",{name:"Continue",exact:true}).click();
    await expect(page.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();
    await expect(page).toHaveURL(url=>url.searchParams.has("review"));
    const intentId=new URL(page.url()).searchParams.get("review")!;
    const reviewUrl=page.url();
    await page.reload();
    expect(page.url()).toBe(reviewUrl);
    await expect(page.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();
    expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe("0");

    const confirmPath=fundsPath+"/funds/intents/"+intentId;
    const attempts:Array<{path:string;body:unknown;receiptId:string}>=[];
    const intercept=async(route:Route)=>{
      if(route.request().method()!=="POST"){await route.continue();return;}
      const response=await route.fetch();
      expect(response.status()).toBe(200);
      const receipt=await response.json() as TopupReceipt;
      expect(receipt).toMatchObject({serviceId:primary.serviceId,amount:{minor:"10000"},status:"COMPLETED"});
      attempts.push({
        path:new URL(route.request().url()).pathname,
        body:route.request().postDataJSON(),
        receiptId:receipt.id,
      });
      if(attempts.length===1)await route.abort("failed");
      else await route.fulfill({response});
    };
    await page.route(origin+confirmPath,intercept);
    try{
      await page.getByRole("button",{name:"Confirm and add money",exact:true}).click();
      await expect(page.getByRole("button",{name:"Retry this top-up",exact:true})).toBeVisible();
      expect(page.url()).toBe(reviewUrl);
      expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe("10000");
      expect(await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account.id))).toHaveLength(1);
      await page.getByRole("button",{name:"Retry this top-up",exact:true}).click();
      const confirmation=page.locator('section[aria-labelledby="funding-title"]');
      await expect(confirmation.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();
      await expect(confirmation).toContainText("$100.00");
      expect(attempts).toHaveLength(2);
      expect(attempts[1]).toEqual(attempts[0]);
      expect(attempts[0]!.path).toBe(confirmPath);
      expect(attempts[0]!.body).toEqual({});
    }finally{await page.unroute(origin+confirmPath,intercept);}
    await page.reload();
    await expect(page.locator('section[aria-labelledby="funding-title"]')).toContainText("Money added");
    await expect(page.locator(".funds-balance")).toContainText("$100.00");
    const funds=await getCardholderFunds(primary.personId,primary.serviceId);
    expect(funds.available.minor).toBe("10000");
    expect(funds.topups).toHaveLength(1);
    expect(funds.topups[0]!.id).toBe(attempts[0]!.receiptId);
    await capture(page,info,"01-top-up-confirmed");
  });

  let cardId="";
  await test.step("create a card through the UI with no starting-balance field or funding effect",async()=>{
    const before=await getCardholderFunds(primary.personId,primary.serviceId);
    await page.getByRole("link",{name:"Back to your cards →",exact:true}).click();
    await page.getByRole("link",{name:"Create your first card",exact:true}).click();
    const form=page.getByRole("dialog",{name:"Add card",exact:true});
    await expect(form).toBeVisible();
    await expect(form.getByRole("textbox",{name:/starting balance/i})).toHaveCount(0);
    await expect(form.getByLabel(/starting balance/i)).toHaveCount(0);
    await form.getByRole("textbox",{name:"Card name",exact:true}).fill("Everyday browser card");
    await form.getByRole("textbox",{name:"Total spending limit (USD)",exact:true}).fill("50.00");
    await form.getByRole("button",{name:"Review card",exact:true}).click();
    await expect(form.getByRole("heading",{name:"Review your card",exact:true})).toBeVisible();
    await expect(form).toContainText("Creating a card does not add money.");
    const submission=page.waitForResponse(response=>
      new URL(response.url()).pathname.startsWith(fundsPath+"/card-requests/")&&
      new URL(response.url()).pathname.endsWith("/submit")&&response.request().method()==="POST",
    );
    await form.getByRole("button",{name:"Create card",exact:true}).click();
    const issued=await successful(await submission,value=>cardRequestProjectionSchema.parse(value));
    expect(issued).toMatchObject({status:"ISSUED",holderId:primary.personId});
    expect(issued.issuedCardId).not.toBeNull();
    cardId=issued.issuedCardId!;
    expect(await getCardSpending(primary.personId,primary.serviceId,cardId)).toMatchObject({version:1,allowance:{minor:"5000"},used:{minor:"0"},available:{minor:"5000"}});
    await expect(form).toBeHidden();
    await expect(page.getByRole("region",{name:"Selected card overview",exact:true})).toContainText("Everyday browser card");
    await expect(page.getByRole("link",{name:"Try a purchase",exact:true})).toHaveCount(0);
    await expect(page.getByRole("button",{name:"Make purchase",exact:true})).toHaveCount(0);
    await expect(page.getByRole("textbox",{name:"Purchase description",exact:true})).toHaveCount(0);
    const dashboard=await cardDashboard(page);
    expect(dashboard.cards).toHaveLength(1);
    expect(dashboard.cards[0]).toMatchObject({id:cardId,holderId:primary.personId,available:{minor:"5000"}});
    const after=await getCardholderFunds(primary.personId,primary.serviceId);
    expect(after.available).toEqual(before.available);
    expect(after.topups).toEqual(before.topups);
    expect(after.moneyAccountId).toBe(before.moneyAccountId);
    expect(after.cards.map(card=>card.id)).toEqual([cardId]);
    await capture(page,info,"02-card-created-with-existing-funds");
  });

  const first=await test.step("pay the published merchant link using the card",async()=>{
    const paid=await payFromPublishedLink(page,merchant,cardId);
    expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe("8750");
    expect(await getCardSpending(primary.personId,primary.serviceId,cardId)).toMatchObject({
      used:{minor:"1250"},remaining:{minor:"3750"},available:{minor:"3750"},
    });
    const operations=await getMerchantOperations(merchant.personId,merchant.merchantId);
    expect(operations.availableFunds?.minor).toBe("1250");
    expect(operations.payments).toHaveLength(1);
    expect(operations.payments[0]).toMatchObject({
      id:paid.receipt.paymentId,testReference:paid.receipt.reference,amount:{minor:"1250"},status:"APPROVED",
    });
    await capture(page,info,"03-card-payment-receipt");
    return paid;
  });

  await test.step("refund the exact merchant receipt and return funds to the original group",async()=>{
    await signIn(page,merchant.personId);
    await page.goto("/merchants/"+merchant.merchantId+"?tab=payments&payment="+first.receipt.paymentId);
    let detail=page.getByRole("dialog",{name:"Payment details",exact:true});
    await expect(detail).toBeVisible();
    await expect(detail).toContainText(first.receipt.reference);
    await expect(detail).toContainText("$12.50");
    await page.reload();
    detail=page.getByRole("dialog",{name:"Payment details",exact:true});
    await expect(detail).toContainText(first.receipt.reference);
    await detail.getByRole("button",{name:"Refund payment",exact:true}).click();
    const refund=page.getByRole("dialog",{name:"Refund this payment",exact:true});
    await refund.getByRole("textbox",{name:"Reason for refund",exact:true}).fill("Customer returned the ceramic cup");
    await refund.getByRole("button",{name:"Review refund",exact:true}).click();
    const review=page.getByRole("dialog",{name:"Review full refund",exact:true});
    await expect(review).toContainText(first.receipt.reference);
    const completed=responseFor(page,"/api/v1/merchants/"+merchant.merchantId+"/payments/"+first.receipt.paymentId+"/refund");
    await review.getByRole("button",{name:"Confirm full refund",exact:true}).click();
    const saved=await successful(await completed,value=>merchantTestPaymentProjectionSchema.parse(value));
    expect(saved).toMatchObject({
      id:first.receipt.paymentId,status:"REFUNDED",refund:{amount:{minor:"1250"}},
    });
    await expect(review).toBeHidden();
    expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe("10000");
    expect(await getCardSpending(primary.personId,primary.serviceId,cardId)).toMatchObject({
      used:{minor:"1250"},remaining:{minor:"3750"},available:{minor:"3750"},
    });
    const operations=await merchantProjection(page,merchant.merchantId);
    expect(operations).toMatchObject({
      availableFunds:{minor:"0"},pendingDeposits:{minor:"0"},bankFunds:{minor:"0"},depositReview:null,
    });
    await signIn(page,primary.personId);
    await page.goto("/checkout/"+merchant.publication.id+"/card?review="+first.id);
    await expect(page.getByRole("heading",{name:"Payment refunded",exact:true})).toBeVisible();
    await expect(page.locator("main")).toContainText(first.receipt.reference);
    await expect(page.locator("main")).toContainText("The refund has returned to the original card balance.");
    await capture(page,info,"04-original-payment-refunded");
  });

  const second=await test.step("make a separate payment from the same reusable link",async()=>{
    const paid=await payFromPublishedLink(page,merchant,cardId);
    expect(paid.id).not.toBe(first.id);
    expect(paid.receipt.paymentId).not.toBe(first.receipt.paymentId);
    expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe("8750");
    expect(await getCardSpending(primary.personId,primary.serviceId,cardId)).toMatchObject({
      allowance:{minor:"5000"},used:{minor:"2500"},remaining:{minor:"2500"},available:{minor:"2500"},
    });
    return paid;
  });

  const settlement=await test.step("settle only the unrefunded payment into separate merchant money",async()=>{
    await signIn(page,merchant.personId);
    await page.goto("/merchants/"+merchant.merchantId+"?tab=payments");
    await expect(moneyCard(page,"Ready to move")).toContainText("$12.50");
    const operations=await merchantProjection(page,merchant.merchantId);
    expect(operations.depositReview).toMatchObject({amount:{minor:"1250"},paymentCount:1});
    await page.getByRole("button",{name:"Move to balance",exact:true}).click();
    const request=page.getByRole("dialog",{name:"Move received payments",exact:true});
    await expect(request).toContainText("$12.50");
    await request.getByRole("button",{name:"Review received payments",exact:true}).click();
    const review=page.getByRole("dialog",{name:"Review received payments",exact:true});
    await expect(review).toContainText("Payment balance");
    await expect(review).toContainText("It does not send money to a bank or add money to your card balance.");
    await capture(page,info,"05-owner-reviews-exact-settlement");
    const response=responseFor(page,"/api/v1/merchants/"+merchant.merchantId+"/settlements");
    await review.getByRole("button",{name:"Move to balance",exact:true}).click();
    const saved=await successful(await response,value=>merchantSettlementReceiptSchema.parse(value));
    expect(saved).toMatchObject({terminalId:merchant.merchantId,amount:{minor:"1250"}});
    await expect(review).toBeHidden();
    const after=await merchantProjection(page,merchant.merchantId);
    expect(after).toMatchObject({availableFunds:{minor:"0"},settledFunds:{minor:"0"},pendingDeposits:{minor:"0"},bankFunds:{minor:"1250"},depositReview:null,payouts:[]});
    expect(after.settlements).toHaveLength(1);
    expect(after.settlements[0]).toMatchObject({id:saved.id,reference:saved.reference});
    await page.reload();
    await expect(moneyCard(page,"Payment balance")).toContainText("$12.50");
    await capture(page,info,"06-merchant-money-settled");
    await accessible(page,info,"merchant-money-settled");
    return saved;
  });

  // End-to-end cardinality proof: customer actions above cannot create hidden duplicate money.
  expect(await getDb().select().from(moneyTopups).where(eq(moneyTopups.moneyAccountId,account.id))).toHaveLength(1);
  const payments=await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.merchantUnitId,merchant.merchantId));
  expect(payments.map(payment=>payment.id).sort()).toEqual([first.receipt.paymentId,second.receipt.paymentId].sort());
  expect(await getDb().select().from(merchantTestRefunds).where(eq(merchantTestRefunds.paymentId,first.receipt.paymentId))).toHaveLength(1);
  expect(await getDb().select().from(merchantSettlements).where(eq(merchantSettlements.merchantUnitId,merchant.merchantId))).toHaveLength(1);
  expect(await getDb().select().from(merchantSettlementItems).where(eq(merchantSettlementItems.settlementId,settlement.settlementId))).toMatchObject([
    {paymentId:second.receipt.paymentId,amountMinor:1250n},
  ]);
  const activity=await getDb().select().from(serviceActivity).where(eq(serviceActivity.cardId,cardId));
  expect(activity.filter(row=>row.direction==="DEBIT")).toHaveLength(2);
  expect(activity.filter(row=>row.direction==="CREDIT")).toHaveLength(1);
  expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe("8750");
});
