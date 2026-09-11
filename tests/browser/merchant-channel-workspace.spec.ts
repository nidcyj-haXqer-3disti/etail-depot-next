import {randomUUID} from "node:crypto";
import {expect,test,type Page} from "@playwright/test";
import {paymentChannelSchema} from "../../src/modules/acquiring/api-contracts";
import {merchantOperationsProjectionSchema,merchantTestPaymentProjectionSchema,merchantTestPayoutProjectionSchema} from "../../src/modules/acquiring/operations-api-contracts";
import {merchantDashboard,signIn} from "./helpers/fresh";

const formats=[['SMS','SMS / text'],['EMAIL','Email'],['INVOICE','Invoice'],['BILL','Bill'],['SOCIAL','Social media'],['QR','QR code'],['WEB','Website link']] as const;
async function operations(page:Page,merchantId:string){const response=await page.request.get(`/api/v1/merchants/${merchantId}/operations`);expect(response.status()).toBe(200);return merchantOperationsProjectionSchema.parse(await response.json());}
async function approve(page:Page,merchantId:string,channelId:string){
 await page.getByRole("button",{name:"Pay $12.50 with test funds",exact:true}).click();
 const review=page.getByRole("dialog",{name:"Review sandbox payment",exact:true});await expect(review).toContainText("$12.50");
 const pending=page.waitForResponse(response=>new URL(response.url()).pathname===`/api/v1/merchants/${merchantId}/channels/${channelId}/test-payments`&&response.request().method()==="POST");
 await review.getByRole("button",{name:"Confirm sandbox payment",exact:true}).click();const response=await pending;expect(response.status()).toBe(200);
 const payment=merchantTestPaymentProjectionSchema.parse(await response.json());expect(payment).toMatchObject({merchantUnitId:merchantId,channelId,status:"APPROVED",amount:{minor:"1250",currency:"USD"}});
 await expect(review).toBeHidden();await expect(page.getByRole("region",{name:"Sandbox payment result"})).toContainText(payment.testReference);return payment;
}

test("seven channel formats share one saved request, with an exact receipt, full refund and bounded transfer",async({page})=>{
 test.setTimeout(120_000);await signIn(page.request);
 const dashboard=await merchantDashboard(page.request),primary=dashboard.units.find(unit=>unit.kind==="MASTER"&&unit.primaryAccess&&unit.name==="Etail Studio");expect(primary).toBeTruthy();
 const merchantId=primary!.id,before=await operations(page,merchantId);expect(before.gateway.mode).toBe("TEST_READY");expect(before.enrollment.status).toBe("ENROLLED");expect(before.canPayout).toBe(true);
 const name=`Seven format order ${randomUUID().slice(0,8)}`;
 await page.goto(`/merchants/${merchantId}?tab=channels`);
 await page.getByRole("button",{name:"New payment channel",exact:true}).click();
 const form=page.getByRole("dialog",{name:"New payment channel",exact:true});
 await expect(form.getByRole("button",{name:"Review channel",exact:true})).toBeInViewport({ratio:1});
 await form.getByRole("textbox",{name:"Channel name or purpose",exact:true}).fill(name);
 await form.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill("12.50");
 await form.getByText("More options · use, expiry and access",{exact:true}).click();
 await form.getByRole("combobox",{name:"Request use",exact:true}).selectOption("REUSABLE");
 await form.getByLabel("Expires at (UTC)",{exact:true}).fill(new Date(Date.now()+7*86400000).toISOString().slice(0,16));
 for(const [,label] of formats)await form.getByRole("checkbox",{name:label,exact:true}).setChecked(true);
 await form.getByRole("combobox",{name:"Channel visibility",exact:true}).selectOption("CREATOR_PRIVATE");
 await expect(form.getByRole("button",{name:"Review channel",exact:true})).toBeInViewport({ratio:1});
 await form.getByRole("button",{name:"Review channel",exact:true}).click();
 const review=page.getByRole("dialog",{name:"Review payment channel",exact:true});await expect(review).toContainText(name);await expect(review).toContainText("$12.50");
 for(const [,label] of formats)await expect(review).toContainText(label);
 const saving=page.waitForResponse(response=>new URL(response.url()).pathname===`/api/v1/merchants/${merchantId}/channels`&&response.request().method()==="POST");
 await review.getByRole("button",{name:"Save payment channel",exact:true}).click();const saved=await saving;expect(saved.status()).toBe(200);
 const channel=paymentChannelSchema.parse(await saved.json());expect(channel).toMatchObject({merchantUnitId:merchantId,description:name,usage:"REUSABLE",amount:{minor:"1250",currency:"USD"},visibility:"CREATOR_PRIVATE"});expect(new Set(channel.presentations)).toEqual(new Set(formats.map(([value])=>value)));
 const details=page.getByRole("dialog",{name:"Payment channel details",exact:true});await expect(details).toContainText(name);
 const row=page.getByRole("listitem").filter({has:page.getByText(name,{exact:true})});
 await row.getByRole("button",{name:"Turn on channel",exact:true}).click();
 const activation=page.getByRole("dialog",{name:"Turn on this channel?",exact:true});await expect(activation).toContainText(name);await expect(activation).toContainText("$12.50");
 await activation.getByRole("button",{name:"Confirm setting",exact:true}).click();await expect(activation).toBeHidden();
 await row.getByRole("link",{name:"Try a practice payment",exact:true}).click();await page.waitForURL(url=>url.pathname===`/pay/${channel.id}`);
 await expect(page.getByRole("heading",{name,level:1,exact:true})).toBeVisible();
 await page.getByText("Preview sharing formats",{exact:true}).click();
 const presentation=page.getByRole("region",{name:"Channel presentation preview"});
 for(const [value] of formats){
  await presentation.getByRole("combobox",{name:"Preview format",exact:true}).selectOption(value);
  await expect(presentation.getByRole("link",{name:"Open payment preview",exact:true})).toHaveAttribute("href",new RegExp(`/pay/${channel.id}$`));
  await expect(presentation).toContainText("Preview only · Not published or sent");
  if(value==="QR")await expect(presentation.getByRole("img",{name:"QR code for this sandbox payment preview",exact:true})).toBeVisible();
  else await expect(presentation).toContainText("$12.50");
 }
 const payment=await approve(page,merchantId,channel.id);
 await page.getByRole("link",{name:"← Back to merchant payments",exact:true}).click();await page.waitForURL(url=>url.pathname===`/merchants/${merchantId}`&&url.searchParams.get("tab")==="payments");
 await page.getByRole("searchbox",{name:"Search payments",exact:true}).fill(payment.testReference);
 await page.getByRole("button",{name:`View approved payment ${name} ${payment.testReference}`,exact:true}).click();
 const receipt=page.getByRole("dialog",{name:"Payment details",exact:true});await expect(receipt).toContainText(payment.testReference);await page.reload();await expect(receipt).toContainText(payment.testReference);
 expect(new URL(page.url()).searchParams.get("payment")).toBe(payment.id);expect(new URL(page.url()).searchParams.get("q")).toBe(payment.testReference);
 await receipt.getByRole("button",{name:"Refund payment",exact:true}).click();
 const refund=page.getByRole("dialog",{name:"Refund this payment",exact:true});await refund.getByRole("textbox",{name:"Reason for refund",exact:true}).fill("Practice order returned in full");await refund.getByRole("button",{name:"Review refund",exact:true}).click();
 const refundReview=page.getByRole("dialog",{name:"Review full refund",exact:true});await expect(refundReview).toContainText("$12.50");await expect(refundReview).toContainText(payment.testReference);
 const refunding=page.waitForResponse(response=>new URL(response.url()).pathname===`/api/v1/merchants/${merchantId}/payments/${payment.id}/refund`&&response.request().method()==="POST");
 await refundReview.getByRole("button",{name:"Confirm full refund",exact:true}).click();const refunded=await refunding;expect(refunded.status()).toBe(200);const returned=merchantTestPaymentProjectionSchema.parse(await refunded.json());expect(returned).toMatchObject({id:payment.id,status:"REFUNDED",refund:{amount:{minor:"1250"}}});await expect(refundReview).toBeHidden();
 expect((await operations(page,merchantId)).availableFunds!.minor).toBe(before.availableFunds!.minor);
 // A second real sandbox checkout funds the transfer; this test never borrows another unit's funds.
 await page.goto(`/pay/${channel.id}`);const funding=await approve(page,merchantId,channel.id);expect(funding.id).not.toBe(payment.id);
 await page.getByRole("link",{name:"← Back to merchant payments",exact:true}).click();await page.waitForURL(url=>url.pathname===`/merchants/${merchantId}`&&url.searchParams.get("tab")==="payments");
 await page.getByRole("button",{name:"Transfer out",exact:true}).click();const transfer=page.getByRole("dialog",{name:"Transfer out",exact:true});
 await transfer.getByRole("textbox",{name:"Transfer amount (USD)",exact:true}).fill("1.00");await transfer.getByRole("button",{name:"Review transfer",exact:true}).click();
 const transferReview=page.getByRole("dialog",{name:"Review transfer out",exact:true});await expect(transferReview).toContainText("$1.00");await expect(transferReview).toContainText("No money leaves the sandbox.");
 const transferring=page.waitForResponse(response=>new URL(response.url()).pathname===`/api/v1/merchants/${merchantId}/payouts`&&response.request().method()==="POST");
 await transferReview.getByRole("button",{name:"Confirm sandbox transfer",exact:true}).click();const transferred=await transferring;expect(transferred.status()).toBe(200);const payout=merchantTestPayoutProjectionSchema.parse(await transferred.json());expect(payout).toMatchObject({merchantUnitId:merchantId,status:"COMPLETED",amount:{minor:"100",currency:"USD"},destination:"TEST_DESTINATION"});await expect(transferReview).toBeHidden();
 await page.getByRole("navigation",{name:"Payment activity views"}).getByRole("button",{name:"Transfers",exact:true}).click();await page.getByRole("searchbox",{name:"Search transfers",exact:true}).fill(payout.testReference);await page.reload();await expect(page.getByRole("table")).toContainText(payout.testReference);
 const final=await operations(page,merchantId);expect(final.availableFunds!.minor).toBe((BigInt(before.availableFunds!.minor)+1150n).toString());expect(final.payments.filter(item=>item.channelId===channel.id)).toHaveLength(2);expect(final.payments.find(item=>item.id===payment.id)?.refund?.testReference).toBe(returned.refund!.testReference);expect(final.payouts.filter(item=>item.id===payout.id)).toHaveLength(1);
});
