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
import {cardCheckoutReviewSchema} from "../../../src/modules/acquiring/card-checkout-contracts";
import {merchantOperationsProjectionSchema,merchantTestPaymentProjectionSchema,merchantSettlementReceiptSchema} from "../../../src/modules/acquiring/operations-api-contracts";
import {cardPrimary} from "../../helpers/cardholder";
import {acquiringFixture,completeSetup} from "../../helpers/acquiring";
import {cardDashboard} from "./fresh";

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
  await expect(page.getByRole("heading",{name:"Add money",level:1,exact:true})).toBeVisible();
  await page.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill(amount);
  await page.getByRole("button",{name:"Continue",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();
  // Review state renders before router.replace finishes; reload only the saved review URL.
  await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/funds"&&url.searchParams.get("service")===serviceId&&/^[0-9a-f-]{36}$/.test(url.searchParams.get("review")??""));
  const intentId=new URL(page.url()).searchParams.get("review");
  expect(intentId).toBeTruthy();
  await page.reload();
  await expect(page.getByRole("heading",{name:"Review your top-up",exact:true})).toBeVisible();
  const confirming=responseFor(page,`/api/v1/cardholder-services/${serviceId}/funds/intents/${intentId}`);
  await page.getByRole("button",{name:"Confirm and add money",exact:true}).click();
  expect((await confirming).status()).toBe(200);
  await expect(page.locator('section[aria-labelledby="funding-title"]')).toContainText("Money added");
}
export async function setCardAllowance(page:Page,serviceId:string,cardId:string,name:string,amount="25.00"){
  await page.goto(`/cardholder-services?card=${cardId}`);
  const control=page.getByRole("dialog").getByRole("article",{name:"Card allowance",exact:true});
  await control.getByRole("button",{name:"Change allowance for "+name,exact:true}).click();
  await control.getByRole("textbox",{name:"New total allowance for "+name,exact:true}).fill(amount);
  await control.getByRole("button",{name:"Review allowance",exact:true}).click();
  await expect(control).toContainText("This does not add money or reset previous spending.");
  const saving=responseFor(page,`/api/v1/cardholder-services/${serviceId}/cards/${cardId}/spending-limit`,"PUT");
  await control.getByRole("button",{name:"Save allowance",exact:true}).click();
  expect((await saving).status()).toBe(200);
  await expect(control.locator(".funds-limit-value")).toHaveText("$"+amount);
}
export async function addUnfundedCard(page:Page,name:string,holderName:string,allowance="0.00"){
  if(!(await page.getByRole("dialog").count())){
    await page.getByRole("link",{name:/^(Add card|Create your first card)$/}).click();
  }
  const dialog=page.getByRole("dialog");
  const holder=dialog.getByRole("radio",{name:new RegExp(holderName)});
  if(await holder.count())await holder.check();
  await dialog.getByRole("textbox",{name:"Card name",exact:true}).fill(name);
  await dialog.getByRole("textbox",{name:"Total card allowance (USD)",exact:true}).fill(allowance);
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
  const card=await addUnfundedCard(page,"Prepaid checkout card",name,"50.00");
  expect((await getCardholderFunds(primary.personId,primary.serviceId)).available.minor).toBe(before.available.minor);
  expect(card.available.minor).toBe("5000");
  return {...primary,card,close:session.close};
}
export async function publishCustomerLink(page:Page,merchantId:string,channelId:string){
  const details=page.getByRole("dialog",{name:"Payment channel details",exact:true});
  await details.getByRole("button",{name:"Publish payment link",exact:true}).click();
  const publishing=responseFor(page,`/api/v1/merchants/${merchantId}/channels/${channelId}/publication`);
  await details.getByRole("button",{name:"Confirm publication",exact:true}).click();
  const result=await publishing;expect(result.status()).toBe(200);
  const management=guestPublicationManagementSchema.parse(await result.json());
  expect(management.publication?.state).toBe("AVAILABLE");
  const publication=management.publication!;
  await expect(details.getByRole("textbox",{name:"Customer payment URL",exact:true})).toHaveValue(publication.publicHref);
  await expect(details.getByRole("link",{name:"Open customer checkout",exact:true})).toHaveAttribute("href",publication.publicHref);
  return publication;
}
export async function payPublished(page:Page,publication:GuestPublication,cardId:string){
  await page.goto(publication.publicHref);
  await expect(page.getByRole("heading",{name:publication.description,level:1,exact:true})).toBeVisible();
  await page.getByRole("link",{name:"Continue to payment",exact:true}).click();
  await page.getByRole("combobox",{name:"Your card",exact:true}).selectOption(cardId);
  const preparing=responseFor(page,`/api/v1/checkout/${publication.id}/card`);
  await page.getByRole("button",{name:"Review payment",exact:true}).click();
  const prepared=await preparing;expect(prepared.status()).toBe(200);
  const review=cardCheckoutReviewSchema.parse(await prepared.json());
  expect(review.receipt).toBeNull();
  await expect(page).toHaveURL(url=>url.searchParams.get("review")===review.id);
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
  await page.goto(`/merchants/${merchantId}?tab=payments`);
  await page.getByRole("button",{name:"Settle payments",exact:true}).click();
  await page.getByRole("dialog",{name:"Settle payments",exact:true}).getByRole("button",{name:"Review settlement",exact:true}).click();
  const review=page.getByRole("dialog",{name:"Review settlement",exact:true});
  await expect(review).toContainText("Merchant money");
  await expect(review).toContainText("Card money stays separate.");
  const requesting=responseFor(page,`/api/v1/merchants/${merchantId}/settlements`);
  await review.getByRole("button",{name:"Settle payments",exact:true}).click();
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
