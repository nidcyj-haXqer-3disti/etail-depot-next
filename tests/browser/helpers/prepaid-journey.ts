import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import {expect,type Page} from "@playwright/test";
import {getDb} from "../../../src/platform/database/client";
import {identityBindings} from "../../../src/platform/database/schema";
import {sessionRepository} from "../../../src/platform/database/session-repository";
import {SessionService} from "../../../src/modules/identity/session";
import {merchantSettlementItems} from "../../../src/modules/acquiring/settlement-schema";
import {getCardholderFunds,getCardSpending} from "../../../src/modules/workspace/service";
import {createChannel,updateMerchantSetup,submitMerchantSetup} from "../../../src/modules/acquiring/service";
import {configureTestGateway,enrollTestMerchant,setChannelActivation} from "../../../src/modules/acquiring/operations-service";
import {publishGuestChannel} from "../../../src/modules/acquiring/guest-service";
import {guestPublicationManagementSchema,type GuestPublication} from "../../../src/modules/acquiring/guest-contracts";
import {moneyFundingIntentSchema,moneyTopupReceiptSchema,moneyOverviewSchema} from "../../../src/shared/money-response";
import {cardCheckoutReviewSchema} from "../../../src/modules/acquiring/card-checkout-contracts";
import {merchantOperationsProjectionSchema,merchantTestPaymentProjectionSchema,merchantSettlementReceiptSchema} from "../../../src/modules/acquiring/operations-api-contracts";
import {cardPrimary} from "../../helpers/cardholder";
import {acquiringFixture,completeSetup} from "../../helpers/acquiring";
import {cardDashboard} from "./fresh";
import {prepareSavedCardReview} from "./prepaid";

export const origin="http://127.0.0.1:3100";
export function requireFictionalTestDatabase(){
  if(process.env.APP_ENV!=="test"||process.env.ENABLE_REAL_MONEY!=="false"||
    !process.env.DATABASE_URL||new URL(process.env.DATABASE_URL).pathname!=="/etail_depot_next_services_test"){
    throw new Error("Prepaid browser fixtures require the isolated fictional test database.");
  }
}
export async function isolatedSession(page:Page,personId:string){
  requireFictionalTestDatabase();
  const [identity]=await getDb().select().from(identityBindings).where(and(
    eq(identityBindings.personId,personId),eq(identityBindings.issuer,"urn:etail:isolated-fixture"),
  ));
  if(!identity)throw new Error("Expected this test's isolated identity.");
  const sessions=new SessionService(sessionRepository,{appEnv:"test",publicOrigin:origin});
  const session=await sessions.issue({personId,identityId:identity.id});
  const pair=session.cookie.split(";",1)[0]!,split=pair.indexOf("=");
  await page.context().addCookies([{
    name:pair.slice(0,split),value:pair.slice(split+1),domain:"127.0.0.1",path:"/",
    httpOnly:true,sameSite:"Strict",expires:Math.floor(session.record.expiresAt.getTime()/1000),
  }]);
  return {close:()=>sessions.logout(pair)};
}
export function responseFor(page:Page,path:string,method="POST"){
  return page.waitForResponse(response=>new URL(response.url()).pathname===path&&response.request().method()===method);
}
/** Setup owns no customer money and grants no other person either service. */
export async function readyMerchantFixture(){
  requireFictionalTestDatabase();
  const merchant=await acquiringFixture();
  const saved=await updateMerchantSetup(merchant.personId,merchant.merchantId,merchant.setup.id,completeSetup(merchant.setup.version));
  await submitMerchantSetup(merchant.personId,merchant.merchantId,saved.id,{commandId:randomUUID(),expectedVersion:saved.version});
  await configureTestGateway(merchant.personId,merchant.merchantId,{commandId:randomUUID(),expectedVersion:0,enabled:true});
  await enrollTestMerchant(merchant.personId,merchant.merchantId,{commandId:randomUUID(),expectedVersion:0,enabled:true});
  return merchant;
}
export async function publishedMerchantFixture(amountMinor="1250",description="Fictional prepaid order"){
  const merchant=await readyMerchantFixture();
  const channel=await createChannel(merchant.personId,merchant.merchantId,{
    commandId:randomUUID(),description,amountMinor,currency:"USD",usage:"REUSABLE",
    expiresAt:new Date(Date.now()+7*86_400_000).toISOString(),
    presentations:["SMS","EMAIL","INVOICE","BILL","SOCIAL","QR","WEB"],visibility:"CREATOR_PRIVATE",
  });
  await setChannelActivation(merchant.personId,merchant.merchantId,channel.id,{
    commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:channel.version,active:true,
  });
  const result=await publishGuestChannel(merchant.personId,merchant.merchantId,channel.id,{
    commandId:randomUUID(),expectedChannelVersion:channel.version,
  });
  if(!result.publication)throw new Error("Fixture publication is unavailable.");
  return {...merchant,channel,publication:result.publication};
}
export async function addMoney(page:Page,serviceId:string,amount="50.00"){
  await page.goto(`/cardholder-services/funds?service=${serviceId}`);
  await expect(page).toHaveURL(url=>/^\/money-accounts\/[0-9a-f-]{36}$/.test(url.pathname)&&!url.search);
  const base=new URL(page.url()).pathname,moneyAccountId=base.split("/").at(-1)!;
  const accountResponse=await page.request.get(`/api/v1${base}`);expect(accountResponse.status()).toBe(200);
  const account=moneyOverviewSchema.parse(await accountResponse.json());
  expect(account).toMatchObject({id:moneyAccountId,serviceKind:"CARDHOLDER",services:[{id:serviceId,kind:"CARDHOLDER"}],canAddMoney:true});
  await expect(page.getByRole("heading",{name:"Account activity",level:1,exact:true})).toBeVisible();
  await page.getByRole("navigation",{name:"Cards and spending navigation",exact:true}).getByRole("link",{name:"Account home",exact:true}).click();
  const homeBalance=page.getByRole("region",{name:"Card account balance",exact:true});
  await expect(homeBalance).toContainText(account.available.formatted);
  await expect(homeBalance.getByRole("link",{name:"Add money",exact:true})).toHaveAttribute("href",`${base}/add-money`);
  await expect(page.getByRole("link",{name:"Add money",exact:true})).toHaveCount(1);
  await homeBalance.getByRole("link",{name:"Add money",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname===`${base}/add-money`&&!url.searchParams.has("task")&&!url.searchParams.has("review"));
  await expect(page.getByRole("heading",{name:"Add money",level:1,exact:true})).toBeVisible();
  const panel=page.locator('section[aria-labelledby="money-task-title"]');
  await expect(panel.getByRole("heading",{name:"How much would you like to add?",exact:true})).toBeVisible();
  await panel.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill(amount);
  const preparing=responseFor(page,`/api/v1${base}/funding/intents`);
  await panel.getByRole("button",{name:"Continue",exact:true}).click();
  const prepared=await preparing;expect(prepared.status()).toBe(200);
  const intent=moneyFundingIntentSchema.parse(await prepared.json());expect(intent.moneyAccountId).toBe(moneyAccountId);
  await expect(panel.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();
  // Reload only after the exact saved review URL finishes navigating.
  await expect(page).toHaveURL(url=>url.pathname===`${base}/add-money`&&!url.searchParams.has("task")&&url.searchParams.get("review")===intent.id);
  await page.reload();
  await expect(panel.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();
  const confirming=responseFor(page,`/api/v1${base}/funding/intents/${intent.id}`);
  await panel.getByRole("button",{name:"Confirm and add money",exact:true}).click();
  const confirmed=await confirming;expect(confirmed.status()).toBe(200);
  const receipt=moneyTopupReceiptSchema.parse(await confirmed.json());
  expect(receipt).toMatchObject({id:intent.receiptId,moneyAccountId,amount:intent.amount,status:"COMPLETED"});
  await expect(panel.getByRole("heading",{name:"Money added",exact:true})).toBeVisible();
  await expect(panel).toContainText(receipt.reference);
}
export async function setCardAllowance(page:Page,serviceId:string,cardId:string,name:string,amount="25.00"){
  await page.goto(`/cardholder-services?card=${cardId}`);
  const control=page.getByRole("region",{name:"Card management details",exact:true}).getByRole("article",{name:"Card spending limit",exact:true});
  await control.getByRole("button",{name:"Change spending limit for "+name,exact:true}).click();
  await control.getByRole("textbox",{name:"New total spending limit for "+name,exact:true}).fill(amount);
  await control.getByRole("button",{name:"Review spending limit",exact:true}).click();
  await expect(control).toContainText("It does not add money or reset past spending, including refunded purchases.");
  const saving=responseFor(page,`/api/v1/cardholder-services/${serviceId}/cards/${cardId}/spending-limit`,"PUT");
  await control.getByRole("button",{name:"Save spending limit",exact:true}).click();
  expect((await saving).status()).toBe(200);
  await expect(control.locator(".funds-limit-value")).toHaveText("$"+amount);
}
export async function addUnfundedCard(page:Page,name:string,allowance="0.00"){
  if(!(await page.getByRole("dialog").count())){
    await page.getByRole("navigation",{name:"Cards and spending navigation",exact:true}).getByRole("link",{name:"Cards",exact:true}).click();
    await page.getByRole("link",{name:"Add card",exact:true}).click();
  }
  const dialog=page.getByRole("dialog");
  await expect(dialog.getByRole("radio",{name:/For someone else/})).toBeChecked();
  await dialog.getByRole("radio",{name:/^For your use/}).check();
  await dialog.getByRole("textbox",{name:"Card name",exact:true}).fill(name);
  await dialog.getByRole("textbox",{name:"Total spending limit (USD)",exact:true}).fill(allowance);
  await expect(dialog.getByRole("textbox",{name:"Starting balance (USD)",exact:true})).toHaveCount(0);
  await dialog.getByRole("button",{name:"Review card",exact:true}).click();
  await expect(dialog).toContainText("Creating a card does not add money.");
  await dialog.getByRole("button",{name:"Create card",exact:true}).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("region",{name:"Selected card overview",exact:true})).toContainText(name);
  const card=(await cardDashboard(page.request)).cards.find(row=>row.nickname===name);
  expect(card).toBeTruthy();
  return card!;
}
/** Empty service fixture; funding, total allowance and card all use actual UI commands. */
export async function prepaidPayer(page:Page,name:string){
  const primary=await cardPrimary(name),session=await isolatedSession(page,primary.personId);
  await addMoney(page,primary.serviceId,"50.00");
  await page.goto("/cardholder-services");
  const before=await getCardholderFunds(primary.personId,primary.serviceId);
  const card=await addUnfundedCard(page,"Prepaid checkout card","50.00");
  expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe(before.available.minor);
  expect(card.available.minor).toBe("5000");
  return {...primary,card,close:session.close};
}
export async function publishCustomerLink(page:Page,merchantId:string,channelId:string){
  const details=page.getByRole("dialog",{name:"Payment request details",exact:true});
  await details.getByRole("button",{name:"Create payment link",exact:true}).click();
  const publishing=responseFor(page,`/api/v1/merchants/${merchantId}/channels/${channelId}/publication`);
  await details.getByRole("button",{name:"Create payment link",exact:true}).click();
  const result=await publishing;expect(result.status()).toBe(200);
  const management=guestPublicationManagementSchema.parse(await result.json());
  expect(management.publication?.state).toBe("AVAILABLE");
  const publication=management.publication!;
  await expect(details.getByRole("textbox",{name:"Payment link",exact:true})).toHaveValue(publication.publicHref);
  await expect(details.getByRole("link",{name:"Preview payment page",exact:true})).toHaveAttribute("href",publication.publicHref);
  return publication;
}
export async function payPublished(page:Page,publication:GuestPublication,cardId:string){
  await page.goto(publication.publicHref);
  await expect(page.getByRole("heading",{name:publication.description,level:1,exact:true})).toBeVisible();
  const review=await prepareSavedCardReview(page,publication.id,cardId);expect(review.receipt).toBeNull();
  await page.goto(`/checkout/${publication.id}/card?review=${review.id}`);
  await expect(page.getByRole("heading",{name:"Review your payment",exact:true})).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading",{name:"Review your payment",exact:true})).toBeVisible();
  const confirming=responseFor(page,`/api/v1/checkout/${publication.id}/card/${review.id}`);
  await page.getByRole("button",{name:"Pay "+publication.amount.formatted,exact:true}).click();
  const confirmed=await confirming;expect(confirmed.status()).toBe(200);
  const paid=cardCheckoutReviewSchema.parse(await confirmed.json());
  expect(paid.id).toBe(review.id);expect(paid.receipt).not.toBeNull();
  await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
  await expect(page.locator("main")).toContainText(paid.receipt!.reference);
  return {review:paid,paymentId:paid.receipt!.paymentId,reference:paid.receipt!.reference};
}
export async function operations(page:Page,merchantId:string){
  const response=await page.request.get(`/api/v1/merchants/${merchantId}/operations`);
  expect(response.status()).toBe(200);return merchantOperationsProjectionSchema.parse(await response.json());
}
export async function refundPayment(page:Page,merchantId:string,paymentId:string,reference:string){
  await page.goto(`/merchants/${merchantId}?tab=payments&payment=${paymentId}`);
  const receipt=page.getByRole("dialog",{name:"Payment details",exact:true});
  await expect(receipt).toContainText(reference);
  await page.reload();await expect(receipt).toContainText(reference);
  await receipt.getByRole("button",{name:"Refund payment",exact:true}).click();
  const form=page.getByRole("dialog",{name:"Refund this payment",exact:true});
  await form.getByRole("textbox",{name:"Reason for refund",exact:true}).fill("Fictional order returned in full");
  await form.getByRole("button",{name:"Review refund",exact:true}).click();
  const review=page.getByRole("dialog",{name:"Review full refund",exact:true});
  await expect(review).toContainText(reference);
  const refunding=responseFor(page,`/api/v1/merchants/${merchantId}/payments/${paymentId}/refund`);
  await review.getByRole("button",{name:"Confirm full refund",exact:true}).click();
  const response=await refunding;expect(response.status()).toBe(200);
  const payment=merchantTestPaymentProjectionSchema.parse(await response.json());
  expect(payment).toMatchObject({id:paymentId,status:"REFUNDED"});
  await expect(page.getByRole("dialog")).toHaveCount(0);return payment;
}
export async function settleExactPayment(page:Page,merchantId:string,paymentId:string){
  await page.goto(`/merchant-services?section=funds&view=unit:${merchantId}`);
  await page.locator(".money-incoming > summary").click();
  await page.getByRole("region",{name:/^Settlement for /}).getByRole("button",{name:"Review settlement",exact:true}).click();
  await page.getByRole("dialog",{name:"Settle received payments",exact:true}).getByRole("button",{name:"Review settlement",exact:true}).click();
  const review=page.getByRole("dialog",{name:"Review settlement",exact:true});
  await expect(review).toContainText("Merchant available balance");
  await expect(review).toContainText("Settlement and payout are separate steps.");
  const requesting=responseFor(page,`/api/v1/merchants/${merchantId}/settlements`);
  await review.getByRole("button",{name:"Confirm settlement",exact:true}).click();
  const result=await requesting;expect(result.status()).toBe(200);
  const receipt=merchantSettlementReceiptSchema.parse(await result.json());
  expect(receipt.terminalId).toBe(merchantId);
  const items=await getDb().select().from(merchantSettlementItems).where(eq(merchantSettlementItems.settlementId,receipt.settlementId));
  expect(items.map(item=>item.paymentId)).toEqual([paymentId]);
  await expect(review).toBeHidden();
  expect((await operations(page,merchantId)).bankFunds?.minor).toBe(receipt.amount.minor);
  return receipt;
}
export {getCardholderFunds,getCardSpending};
