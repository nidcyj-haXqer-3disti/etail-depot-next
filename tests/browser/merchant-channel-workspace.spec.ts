import {randomUUID} from "node:crypto";
import {expect,test} from "@playwright/test";
import {closeDatabase} from "../../src/platform/database/client";
import {paymentChannelSchema} from "../../src/modules/acquiring/api-contracts";
import {cardDashboard,merchantDashboard} from "./helpers/fresh";
import {
  origin,requireFictionalTestDatabase,readyMerchantFixture,isolatedSession,prepaidPayer,
  publishCustomerLink,payPublished,operations,refundPayment,settleExactPayment,
  getCardholderFunds,getCardSpending,responseFor,
} from "./helpers/prepaid-journey";

const formats=[['SMS','SMS / text'],['EMAIL','Email'],['INVOICE','Invoice'],['BILL','Bill'],['SOCIAL','Social media'],['QR','QR code'],['WEB','Website link']] as const;
test.beforeAll(requireFictionalTestDatabase);
test.afterAll(closeDatabase);

test("seven sharing formats keep one published channel and exact prepaid receipts, refund and settlement",async({page,browser})=>{
  test.setTimeout(180_000);
  const merchant=await readyMerchantFixture();
  const merchantSession=await isolatedSession(page,merchant.personId);
  const payerContext=await browser.newContext({baseURL:origin,viewport:page.viewportSize()});
  const payerPage=await payerContext.newPage();
  const payer=await prepaidPayer(payerPage,"Channel checkout customer "+randomUUID().slice(0,8));
  const merchantId=merchant.merchantId,name="Seven format order "+randomUUID().slice(0,8);
  try{
    const before=await operations(page,merchantId);
    expect(before).toMatchObject({
      gateway:{mode:"TEST_READY"},enrollment:{status:"ENROLLED"},canPayout:true,
      availableFunds:{minor:"0"},pendingDeposits:{minor:"0"},bankFunds:{minor:"0"},
    });
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
    expect((await merchantDashboard(payerPage.request)).units).toEqual([]);
    await page.goto(`/merchants/${merchantId}?tab=channels`);
    await page.getByRole("button",{name:"New payment channel",exact:true}).click();
    const form=page.getByRole("dialog",{name:"New payment channel",exact:true});
    await expect(form.getByRole("button",{name:"Review channel",exact:true})).toBeInViewport({ratio:1});
    await form.getByRole("textbox",{name:"Channel name or purpose",exact:true}).fill(name);
    await form.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill("12.50");
    await form.getByText("More options · use and expiry",{exact:true}).click();
    await form.getByRole("combobox",{name:"Request use",exact:true}).selectOption("REUSABLE");
    await form.getByLabel("Expires at (UTC)",{exact:true}).fill(new Date(Date.now()+7*86_400_000).toISOString().slice(0,16));
    for(const [,label] of formats)await form.getByRole("checkbox",{name:label,exact:true}).check();
    await expect(form.getByRole("button",{name:"Review channel",exact:true})).toBeInViewport({ratio:1});
    await form.getByRole("button",{name:"Review channel",exact:true}).click();
    const review=page.getByRole("dialog",{name:"Review payment channel",exact:true});
    await expect(review).toContainText(name);await expect(review).toContainText("$12.50");
    for(const [,label] of formats)await expect(review).toContainText(label);
    const saving=responseFor(page,`/api/v1/merchants/${merchantId}/channels`);
    await review.getByRole("button",{name:"Save payment channel",exact:true}).click();
    const saved=await saving;expect(saved.status()).toBe(200);
    const channel=paymentChannelSchema.parse(await saved.json());
    expect(channel).toMatchObject({merchantUnitId:merchantId,description:name,usage:"REUSABLE",amount:{minor:"1250",currency:"USD"},visibility:"ASSIGNED"});
    expect(new Set(channel.presentations)).toEqual(new Set(formats.map(([value])=>value)));
    const details=page.getByRole("dialog",{name:"Payment channel details",exact:true});
    await expect(details).toContainText(name);
    await details.getByRole("button",{name:"Turn on channel",exact:true}).click();
    const activation=page.getByRole("dialog",{name:"Turn on this channel?",exact:true});
    await expect(activation).toContainText(name);await expect(activation).toContainText("$12.50");
    await activation.getByRole("button",{name:"Confirm setting",exact:true}).click();
    await expect(activation).toBeHidden();
    await expect(details.getByRole("heading",{name:"Your channel is ready",exact:true})).toBeVisible();
    await expect(details.getByRole("link",{name:"Try a practice payment",exact:true})).toHaveCount(0);
    const publication=await publishCustomerLink(page,merchantId,channel.id);
    expect(publication).toMatchObject({description:name,amount:{minor:"1250"},usage:"REUSABLE"});
    await page.reload();
    expect(new URL(page.url()).searchParams.get("channel")).toBe(channel.id);
    await expect(details.getByRole("textbox",{name:"Customer payment URL",exact:true})).toHaveValue(publication.publicHref);
    await details.getByText("Channel details",{exact:true}).click();
    for(const [,label] of formats)await expect(details.locator("details").filter({has:page.getByText("Channel details",{exact:true})})).toContainText(label);
    // The seven configured formats share this published checkout. No email/text delivery is simulated.
    const first=await payPublished(payerPage,publication,payer.card.id);
    expect((await getCardholderFunds(payer.personId,payer.serviceId)).available.minor).toBe("3750");
    expect((await getCardSpending(payer.personId,payer.serviceId,payer.card.id)).used.minor).toBe("1250");
    await page.goto(`/merchants/${merchantId}?tab=payments`);
    await page.getByRole("searchbox",{name:"Search payments",exact:true}).fill(first.reference);
    await page.getByRole("button",{name:`View approved payment ${name} ${first.reference}`,exact:true}).click();
    const receipt=page.getByRole("dialog",{name:"Payment details",exact:true});
    await expect(receipt).toContainText(first.reference);await page.reload();await expect(receipt).toContainText(first.reference);
    expect(new URL(page.url()).searchParams.get("payment")).toBe(first.paymentId);
    expect(new URL(page.url()).searchParams.get("q")).toBe(first.reference);
    const returned=await refundPayment(page,merchantId,first.paymentId,first.reference);
    expect(returned.refund?.amount.minor).toBe("1250");
    expect((await operations(page,merchantId)).availableFunds?.minor).toBe("0");
    expect((await getCardholderFunds(payer.personId,payer.serviceId)).available.minor).toBe("5000");
    expect((await getCardSpending(payer.personId,payer.serviceId,payer.card.id)).used.minor).toBe("1250");
    await payerPage.goto(`/checkout/${publication.id}/card?review=${first.review.id}`);
    await expect(payerPage.getByRole("heading",{name:"Payment refunded",exact:true})).toBeVisible();
    await expect(payerPage.locator("main")).toContainText(first.reference);

    const second=await payPublished(payerPage,publication,payer.card.id);
    expect(second.paymentId).not.toBe(first.paymentId);
    expect((await getCardholderFunds(payer.personId,payer.serviceId)).available.minor).toBe("3750");
    expect(await getCardSpending(payer.personId,payer.serviceId,payer.card.id)).toMatchObject({
      allowance:{minor:"5000"},used:{minor:"2500"},available:{minor:"2500"},
    });
    const settlement=await settleExactPayment(page,merchantId,second.paymentId);
    expect(settlement.amount.minor).toBe("1250");
    await page.reload();
    const final=await operations(page,merchantId);
    expect(final).toMatchObject({availableFunds:{minor:"0"},pendingDeposits:{minor:"0"},bankFunds:{minor:"1250"}});
    expect(final.payments.filter(item=>item.channelId===channel.id)).toHaveLength(2);
    expect(final.payments.find(item=>item.id===first.paymentId)?.refund?.testReference).toBe(returned.refund!.testReference);
    expect(final.settlements.filter(item=>item.id===settlement.id)).toHaveLength(1);
    expect(final.payouts).toEqual([]);
    expect((await getCardholderFunds(payer.personId,payer.serviceId)).available.minor).toBe("3750");
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
    expect((await merchantDashboard(payerPage.request)).units).toEqual([]);
  }finally{
    await merchantSession.close();await payer.close();
    await payerContext.close();
  }
});
