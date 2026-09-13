import {checkPublishedSharing} from "./helpers/payment-sharing";
import {customerRouteQuery} from "../../src/shared/customer-routes";
import {randomUUID} from "node:crypto";
import {expect,test} from "@playwright/test";
import {closeDatabase} from "../../src/platform/database/client";
import {paymentChannelSchema} from "../../src/modules/acquiring/api-contracts";
import {cardDashboard} from "./helpers/fresh";
import {
  origin,requireFictionalTestDatabase,readyMerchantFixture,isolatedSession,
  publishCustomerLink,operations,refundPayment,settleExactPayment,
  responseFor,
} from "./helpers/prepaid-journey";

import {payNetworkPublished} from "./helpers/network";
const formats=[['SMS','SMS / text'],['EMAIL','Email'],['INVOICE','Invoice'],['BILL','Bill'],['SOCIAL','Social media'],['QR','QR code'],['WEB','Website link']] as const;
test.beforeAll(requireFictionalTestDatabase);
test.afterAll(closeDatabase);

test("seven sharing formats keep one published channel and exact network receipts, refund and settlement",async({page,browser})=>{
  test.setTimeout(180_000);
  const merchant=await readyMerchantFixture();
  const merchantSession=await isolatedSession(page,merchant.personId);
  const payerContext=await browser.newContext({baseURL:origin,viewport:page.viewportSize()});
  const payerPage=await payerContext.newPage();
  const merchantId=merchant.merchantId,name="Seven format order "+randomUUID().slice(0,8);
  try{
    const before=await operations(page,merchantId);
    expect(before).toMatchObject({
      gateway:{mode:"TEST_READY"},enrollment:{status:"ENROLLED"},canPayout:true,
      availableFunds:{minor:"0"},pendingDeposits:{minor:"0"},bankFunds:{minor:"0"},
    });
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
    expect((await payerPage.request.get("/api/v1/merchants/dashboard")).status()).toBe(401);
    await page.goto(`/merchants/${merchantId}?tab=channels`);
    await page.getByRole("button",{name:"New payment request",exact:true}).click();
    const form=page.getByRole("dialog",{name:"New payment request",exact:true});
    await expect(form.getByRole("button",{name:"Review request",exact:true})).toBeInViewport({ratio:1});
    await form.getByRole("textbox",{name:"What is this payment for?",exact:true}).fill(name);
    await form.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill("12.50");
    await form.getByText("More options · use and expiry",{exact:true}).click();
    await form.getByRole("combobox",{name:"Request use",exact:true}).selectOption("REUSABLE");
    await form.getByLabel("Expires at (UTC)",{exact:true}).fill(new Date(Date.now()+7*86_400_000).toISOString().slice(0,16));
    for(const [,label] of formats)await form.getByRole("checkbox",{name:label,exact:true}).check();
    await expect(form.getByRole("button",{name:"Review request",exact:true})).toBeInViewport({ratio:1});
    await form.getByRole("button",{name:"Review request",exact:true}).click();
    const review=page.getByRole("dialog",{name:"Review payment request",exact:true});
    await expect(review).toContainText(name);await expect(review).toContainText("$12.50");
    await expect(review.getByRole("tablist",{name:"Preview sharing methods",exact:true}).getByRole("tab")).toHaveCount(7);
    await expect(review.getByRole("group",{name:"Card networks",exact:true})).toContainText("Visa");
    await expect(review.getByRole("link",{name:"Preview payment page",exact:true})).toHaveCount(0);
    const saving=responseFor(page,`/api/v1/merchants/${merchantId}/channels`);
    await review.getByRole("button",{name:"Save payment request",exact:true}).click();
    const saved=await saving;expect(saved.status()).toBe(200);
    const channel=paymentChannelSchema.parse(await saved.json());
    expect(channel).toMatchObject({merchantUnitId:merchantId,description:name,usage:"REUSABLE",amount:{minor:"1250",currency:"USD"},visibility:"ASSIGNED"});
    expect(new Set(channel.presentations)).toEqual(new Set(formats.map(([value])=>value)));
    const details=page.getByRole("dialog",{name:"Payment request details",exact:true});
    await expect(details).toContainText(name);
    await details.getByRole("button",{name:"Allow payments",exact:true}).click();
    const activation=page.getByRole("dialog",{name:"Allow payments for this request?",exact:true});
    await expect(activation).toContainText(name);await expect(activation).toContainText("$12.50");
    await activation.getByRole("button",{name:"Confirm setting",exact:true}).click();
    await expect(activation).toBeHidden();
    await expect(details.getByRole("heading",{name:"Payment collection",exact:true})).toBeVisible();
    await expect(details.getByRole("link",{name:"Try a practice payment",exact:true})).toHaveCount(0);
    const publication=await publishCustomerLink(page,merchantId,channel.id);
    expect(publication).toMatchObject({description:name,amount:{minor:"1250"},usage:"REUSABLE"});
    await page.reload();
    expect(new URL(page.url()).pathname).toBe(`/merchant-services/terminals/${merchantId}/channels/${channel.id}`);
    await checkPublishedSharing(page,publication);
    await expect(details.getByRole("textbox",{name:"Payment link",exact:true})).toHaveValue(publication.publicHref);
    await details.getByText("Request details",{exact:true}).click();
    for(const [,label] of formats)await expect(details.locator("details").filter({has:page.getByText("Request details",{exact:true})})).toContainText(label);
    // The seven configured formats share this published checkout. No email/text delivery is simulated.
    const first=await payNetworkPublished(payerPage,publication);
    await page.goto(`/merchants/${merchantId}?tab=payments`);
    await page.getByRole("button",{name:"New payment request",exact:true}).click();
    await expect(page).toHaveURL(url=>url.pathname===`/merchant-services/terminals/${merchantId}/channels/new`&&!url.searchParams.has("payment"));
    await page.getByRole("dialog",{name:"New payment request",exact:true}).getByRole("button",{name:"Discard changes",exact:true}).click();
    await expect(page).toHaveURL(url=>url.pathname===`/merchant-services/terminals/${merchantId}`&&!url.searchParams.has("new"));
    await page.getByRole("searchbox",{name:"Search payments",exact:true}).fill(first.reference);
    await page.getByRole("button",{name:`View approved payment ${name} ${first.reference}`,exact:true}).click();
    await expect(page).toHaveURL(url=>url.pathname===`/merchant-services/terminals/${merchantId}/payments`&&url.searchParams.get("payment")===first.paymentId&&!url.searchParams.has("channel"));
    const receipt=page.getByRole("dialog",{name:"Payment details",exact:true});
    await expect(receipt).toContainText(first.reference);await page.reload();await expect(receipt).toContainText(first.reference);
    expect(customerRouteQuery(new URL(page.url()).pathname,new URL(page.url()).searchParams).get("payment")).toBe(first.paymentId);
    expect(new URL(page.url()).searchParams.get("q")).toBe(first.reference);
    const returned=await refundPayment(page,merchantId,first.paymentId,first.reference);
    expect(returned.refund?.amount.minor).toBe("1250");
    expect((await operations(page,merchantId)).availableFunds?.minor).toBe("0");
    await payerPage.goto(first.url);
    await expect(payerPage.getByRole("heading",{name:"Payment refunded",exact:true})).toBeVisible();
    await expect(payerPage.locator("main")).toContainText(first.reference);

    const second=await payNetworkPublished(payerPage,publication);
    expect(second.paymentId).not.toBe(first.paymentId);
    const settlement=await settleExactPayment(page,merchantId,second.paymentId);
    expect(settlement.amount.minor).toBe("1250");
    await page.reload();
    const final=await operations(page,merchantId);
    expect(final).toMatchObject({availableFunds:{minor:"0"},pendingDeposits:{minor:"0"},bankFunds:{minor:"1250"}});
    expect(final.payments.filter(item=>item.channelId===channel.id)).toHaveLength(2);
    expect(final.payments.filter(item=>item.channelId===channel.id).every(item=>item.source==="NETWORK"&&item.paymentMethod==="Visa")).toBe(true);
    expect(final.payments.find(item=>item.id===first.paymentId)?.refund?.testReference).toBe(returned.refund!.testReference);
    expect(final.settlements.filter(item=>item.id===settlement.id)).toHaveLength(1);
    expect(final.payouts).toEqual([]);
    expect((await cardDashboard(page.request)).profiles).toEqual([]);
    expect((await payerPage.request.get("/api/v1/merchants/dashboard")).status()).toBe(401);
  }finally{
    await merchantSession.close();
    await payerContext.close();
  }
});

test("sharing rejects a mismatched publication, recovers its exact link and respects unpublished state",async({page})=>{
 const {networkCheckoutFixture}=await import("../helpers/network-checkout"),fixture=await networkCheckoutFixture();
 const session=await isolatedSession(page,fixture.personId);
 const path=`**/api/v1/merchants/${fixture.merchantId}/channels/${fixture.channel.id}/publication`;
 let invalid:"origin"|"channel"|"amount"|null="origin";
 await page.route(path,async route=>{
  if(route.request().method()!=="GET"){await route.continue();return;}
  const response=await route.fetch(),data=await response.json();
  await route.fulfill({response,json:invalid==="channel"?{...data,channelId:randomUUID()}:invalid==="origin"?{...data,publication:{...data.publication,publicHref:`https://unrelated.invalid/checkout/${fixture.publication.id}`}}:invalid==="amount"?{...data,publication:{...data.publication,amount:{minor:"1",currency:"USD",formatted:"$0.01"}}}:data});
 });
 try{
  await page.goto(`/merchant-services/terminals/${fixture.merchantId}/channels/${fixture.channel.id}`);
  const dialog=page.getByRole("dialog",{name:"Payment request details",exact:true}),share=dialog.getByRole("region",{name:"Customer payment link",exact:true});
  for(const failure of ["origin","channel","amount"] as const){
   invalid=failure;await share.getByRole("button",{name:"Reload link settings",exact:true}).click();
   await expect(share.getByRole("alert")).toContainText("could not be confirmed");
   await expect(share.getByRole("textbox",{name:"Payment link",exact:true})).toHaveCount(0);
   await expect(share.getByRole("tablist")).toHaveCount(0);
   await expect(share.getByRole("link",{name:"Preview payment page",exact:true})).toHaveCount(0);
  }
  invalid=null;await share.getByRole("button",{name:"Reload link settings",exact:true}).click();
  await expect(share.getByRole("textbox",{name:"Payment link",exact:true})).toHaveValue(fixture.publication.publicHref);
  await share.getByRole("button",{name:"Turn off payment link",exact:true}).click();
  await share.getByRole("button",{name:"Turn off link",exact:true}).click();
  await expect(share).toContainText("Link turned off");
  await expect(share.getByRole("tablist")).toHaveCount(0);
  await expect(share.getByRole("button",{name:"Copy payment link",exact:true})).toHaveCount(0);
  await expect(share.getByRole("textbox",{name:"Payment link",exact:true})).toHaveValue(fixture.publication.publicHref);
  await page.reload();await expect(share).toContainText("Link turned off");
 }finally{await session.close();}
});

test("a lost revocation recovers its exact acknowledgment while a newer payment link stays available",async({page})=>{
 const {networkCheckoutFixture}=await import("../helpers/network-checkout"),{headers}=await import("./helpers/fresh"),f=await networkCheckoutFixture();
 const session=await isolatedSession(page,f.personId),bodies:unknown[]=[];
 let firstRevocationCommitted=false;
 try{
  await page.goto(`/merchant-services/terminals/${f.merchantId}/channels/${f.channel.id}`);
  const share=page.getByRole("dialog",{name:"Payment request details",exact:true}).getByRole("region",{name:"Customer payment link",exact:true});
  await page.route(`**/api/v1/merchants/${f.merchantId}/channels/${f.channel.id}/publication/${f.publication.id}/revoke`,async route=>{
   bodies.push(route.request().postDataJSON());const response=await route.fetch();expect(response.status()).toBe(200);const result=await response.json();
   if(bodies.length===1){firstRevocationCommitted=true;await route.abort("failed");}else await route.fulfill({response,json:bodies.length===2?{...result,revocation:{...result.revocation,publicationId:randomUUID()}}:result});
  });
  await share.getByRole("button",{name:"Turn off payment link",exact:true}).click();await share.getByRole("button",{name:"Turn off link",exact:true}).click();
  await expect.poll(()=>firstRevocationCommitted).toBe(true);
  await expect(share.getByRole("button",{name:"Check link request again",exact:true})).toBeEnabled();
  const created=await page.request.post(`/api/v1/merchants/${f.merchantId}/channels/${f.channel.id}/publication`,{headers,data:{commandId:randomUUID(),expectedChannelVersion:f.channel.version}});expect(created.status()).toBe(200);const current=(await created.json()).publication;
  expect(current.id).not.toBe(f.publication.id);
  await share.getByRole("button",{name:"Check link request again",exact:true}).click();
  await expect(share.getByRole("alert")).toContainText("could not be confirmed");await expect(share.getByRole("button",{name:"Check link request again",exact:true})).toBeVisible();
  await share.getByRole("button",{name:"Check link request again",exact:true}).click();
  await expect(share.getByRole("button",{name:"Check link request again",exact:true})).toHaveCount(0);
  await expect(share).toContainText("The selected payment link is turned off. The current link is shown below.");
  await expect(share.getByRole("textbox",{name:"Payment link",exact:true})).toHaveValue(current.publicHref);await expect(share.getByRole("link",{name:"Preview payment page",exact:true})).toHaveAttribute("href",current.publicHref);
  expect(bodies).toHaveLength(3);expect(bodies[1]).toEqual(bodies[0]);expect(bodies[2]).toEqual(bodies[0]);
  expect((await(await page.request.get(`/api/v1/guest/publications/${f.publication.id}`)).json()).canStart).toBe(false);
  expect((await(await page.request.get(`/api/v1/guest/publications/${current.id}`)).json()).canStart).toBe(true);
 }finally{await session.close();}
});

test("a saved publication retry reports current unavailability instead of promising a shareable link",async({page})=>{
 const {networkCheckoutFixture}=await import("../helpers/network-checkout"),{headers}=await import("./helpers/fresh"),f=await networkCheckoutFixture();
 const session=await isolatedSession(page,f.personId),bodies:unknown[]=[];
 let firstPublicationCommitted=false;
 try{
  expect((await page.request.post(`/api/v1/merchants/${f.merchantId}/channels/${f.channel.id}/publication/${f.publication.id}/revoke`,{headers,data:{commandId:randomUUID(),expectedVersion:f.publication.version}})).status()).toBe(200);
  await page.goto(`/merchant-services/terminals/${f.merchantId}/channels/${f.channel.id}`);
  const share=page.getByRole("dialog",{name:"Payment request details",exact:true}).getByRole("region",{name:"Customer payment link",exact:true});
  await page.route(`**/api/v1/merchants/${f.merchantId}/channels/${f.channel.id}/publication`,async route=>{
   if(route.request().method()!=="POST"){await route.continue();return;}
   bodies.push(route.request().postDataJSON());const response=await route.fetch();expect(response.status()).toBe(200);if(bodies.length===1){firstPublicationCommitted=true;await route.abort("failed");}else await route.fulfill({response});
  });
  await share.getByRole("button",{name:"Create a new payment link",exact:true}).click();await share.getByRole("button",{name:"Create payment link",exact:true}).click();
  await expect.poll(()=>firstPublicationCommitted).toBe(true);
  await expect(share.getByRole("button",{name:"Check link request again",exact:true})).toBeEnabled();
  expect((await page.request.put(`/api/v1/merchant-services/${f.serviceId}/payment-settings`,{headers,data:{commandId:randomUUID(),expectedVersion:1,enabled:false}})).status()).toBe(200);
  await share.getByRole("button",{name:"Check link request again",exact:true}).click();
  await expect(share.getByRole("button",{name:"Check link request again",exact:true})).toHaveCount(0);
  await expect(share).toContainText("Your saved link request is confirmed. This payment link is currently unavailable.");
  await expect(page.getByRole("dialog",{name:"Payment request details",exact:true}).getByRole("heading",{name:"Payment collection",exact:true})).toBeVisible();
  await expect(page.getByRole("dialog",{name:"Payment request details",exact:true})).not.toContainText("Your request can accept payments");
  await expect(share).not.toContainText("Your payment link is ready to share.");await expect(share.getByRole("link",{name:"Preview payment page",exact:true})).toHaveCount(0);await expect(share.getByRole("tablist")).toHaveCount(0);
  expect(bodies).toHaveLength(2);expect(bodies[1]).toEqual(bodies[0]);
 }finally{await session.close();}
});
