import {randomUUID} from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Page} from "@playwright/test";
import {merchantOperationsProjectionSchema} from "../../src/modules/acquiring/operations-api-contracts";
import {activeGuestChannel} from "./helpers/guest";
import {headers} from "./helpers/fresh";
import {freshPrepaidCard,payPublishedWithCard} from "./helpers/prepaid";
import {closeDatabase} from "../../src/platform/database/client";
test.afterAll(closeDatabase);

async function operations(page:Page,merchantId:string){
 const response=await page.request.get(`/api/v1/merchants/${merchantId}/operations`);
 expect(response.status()).toBe(200);return merchantOperationsProjectionSchema.parse(await response.json());
}

test("channel identity, collection filters and exact receipts survive close and reload at 320px",async({page})=>{
 test.setTimeout(90_000);
 const first=await activeGuestChannel(page.request),second=await activeGuestChannel(page.request,"REUSABLE");
 expect(second.merchant.id).toBe(first.merchant.id);
 const {merchant,channel}=first;
 await page.setViewportSize({width:320,height:900});
 await page.goto(`/merchants/${merchant.id}?tab=channels&channel=${channel.id}`);
 const detail=page.getByRole("dialog",{name:"Payment channel details",exact:true});
 await expect(detail.locator(".mch-channel-hero")).toContainText(channel.description);
 await expect(detail.locator(".mch-channel-hero")).toContainText("Ready to collect");
 await detail.getByRole("button",{name:"Close details",exact:true}).click();
 expect(new URL(page.url()).searchParams.has("channel")).toBe(false);
 await page.reload();await expect(detail).toBeHidden();
 await page.getByRole("searchbox",{name:"Search payment channels",exact:true}).fill(second.channel.description);
 await page.getByRole("combobox",{name:"Channel status",exact:true}).selectOption("ACTIVE");
 await expect(page.locator(".mch-channel-list>li")).toHaveCount(1);
 await page.getByRole("button",{name:`View payment channel ${second.channel.description}`,exact:true}).click();
 expect(new URL(page.url()).searchParams.get("channel")).toBe(second.channel.id);
 await page.reload();await expect(detail.locator(".mch-channel-hero")).toContainText(second.channel.description);
 await detail.getByRole("button",{name:"Close details",exact:true}).click();
 await expect(page.getByRole("searchbox",{name:"Search payment channels",exact:true})).toHaveValue(second.channel.description);
 await expect(page.getByRole("combobox",{name:"Channel status",exact:true})).toHaveValue("ACTIVE");
 await expect(page.locator(".mch-channel-list>li")).toHaveCount(1);
 const pub=await page.request.post(`/api/v1/merchants/${merchant.id}/channels/${channel.id}/publication`,{headers,data:{commandId:randomUUID(),expectedChannelVersion:channel.version}});expect(pub.status()).toBe(200);
 const publication=(await pub.json()).publication;
 const payer=await freshPrepaidCard("1840");const paid=await payPublishedWithCard(publication.id,payer);
 const payment=(await operations(page,merchant.id)).payments.find(row=>row.id===paid.receipt!.paymentId)!;
 await page.goto(`/merchants/${merchant.id}?tab=channels&channelSearch=${encodeURIComponent(channel.description)}&channelStatus=USED`);
 await expect(page.locator(".mch-channel-list>li")).toHaveCount(1);
 await expect(page.locator(".mch-channel-list")).toContainText("Already paid");
 await page.getByRole("button",{name:`View payment channel ${channel.description}`,exact:true}).click();
 await expect(detail.getByRole("region",{name:"Payments for this channel",exact:true})).toContainText(payment.testReference);
 await expect(detail.getByRole("link",{name:"Try a practice payment",exact:true})).toHaveCount(0);
 // A paid published link stays saved for its existing receipt but cannot take another payment.
 await expect(detail.locator(".mch-channel-hero")).toContainText("Already paid");
 const savedLink=detail.getByRole("region",{name:"Customer payment link",exact:true});
 await expect(savedLink).toContainText("Link currently unavailable");
 await expect(savedLink).toContainText("This saved link cannot take a new payment right now");
 await expect(savedLink.getByRole("textbox",{name:"Customer payment URL",exact:true})).toHaveValue(publication.publicHref);
 await expect(savedLink.getByRole("link",{name:"Open customer checkout",exact:true})).toHaveCount(0);
 await expect(savedLink.getByRole("button",{name:"Copy payment link",exact:true})).toHaveCount(0);
 await expect(savedLink.getByRole("button",{name:/^Publish (payment link|a new link)$/})).toHaveCount(0);
 await expect(savedLink.getByRole("button",{name:"Revoke payment link",exact:true})).toBeEnabled();
 expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 await detail.getByRole("link",{name:"View payment receipt",exact:true}).click();
 await expect(page.getByRole("dialog",{name:"Payment details",exact:true})).toContainText(payment.testReference);
 expect(new URL(page.url()).searchParams.get("payment")).toBe(payment.id);
 await page.getByRole("link",{name:"View payment channel",exact:true}).click();
 await expect(detail.locator(".mch-channel-hero")).toContainText(channel.description);
 await page.goto(`/merchants/${merchant.id}?tab=channels&channel=${randomUUID()}`);
 await expect(page.getByRole("heading",{name:"This channel is unavailable",exact:true})).toBeVisible();
 await expect(detail).toBeHidden();
});

test("uncertain channel activation keeps its command and the outer channel open until confirmed",async({page})=>{
 test.setTimeout(90_000);
 const {merchant,channel}=await activeGuestChannel(page.request,"REUSABLE");
 const current=(await operations(page,merchant.id)).channels.find(row=>row.channelId===channel.id)!;
 expect((await page.request.put(`/api/v1/merchants/${merchant.id}/channels/${channel.id}/activation`,{headers,data:{commandId:randomUUID(),expectedVersion:current.version,expectedChannelVersion:channel.version,active:false}})).status()).toBe(200);
 await page.goto(`/merchants/${merchant.id}?tab=channels&channel=${channel.id}`);
 const detail=page.getByRole("dialog",{name:"Payment channel details",exact:true});
 await expect(detail.locator(".mch-channel-hero")).toContainText("Off");
 const requests:unknown[]=[];let savedVersion=0;
 await page.route(`**/api/v1/merchants/${merchant.id}/channels/${channel.id}/activation`,async route=>{
  requests.push(route.request().postDataJSON());const response=await route.fetch();expect(response.status()).toBe(200);
  savedVersion=(await response.json()).version;
  if(requests.length===1)await route.abort("failed");else await route.fulfill({response});
 });
 await detail.getByRole("button",{name:"Turn on channel",exact:true}).click();
 const review=page.getByRole("dialog",{name:"Turn on this channel?",exact:true});
 await review.getByRole("button",{name:"Confirm setting",exact:true}).click();
 await expect(review.getByRole("button",{name:"Retry same request",exact:true})).toBeVisible();
 await page.keyboard.press("Escape");await expect(review).toBeVisible();
 await expect(detail.getByRole("button",{name:"Close details",exact:true})).toBeDisabled();
 await review.getByRole("button",{name:"Retry same request",exact:true}).click();
 await expect(review).toBeHidden();await expect(detail.locator(".mch-channel-hero")).toContainText("Ready to collect");
 await expect(detail.getByRole("button",{name:"Publish payment link",exact:true})).toBeEnabled();
 expect(requests).toHaveLength(2);expect(requests[1]).toEqual(requests[0]);
 expect((await operations(page,merchant.id)).channels.find(row=>row.channelId===channel.id)?.version).toBe(savedVersion);
 await detail.getByRole("button",{name:"Close details",exact:true}).click();await expect(detail).toBeHidden();
});



test("an inaccessible saved channel request keeps its exact retry and offers an explained exit",async({page})=>{
 test.setTimeout(90_000);
 const {merchant}=await activeGuestChannel(page.request),description=`Recovery channel ${randomUUID().slice(0,8)}`;
 await page.goto(`/merchants/${merchant.id}?tab=channels&new=1`);
 const edit=page.getByRole("dialog",{name:"New payment channel",exact:true});
 await edit.getByRole("textbox",{name:"Channel name or purpose",exact:true}).fill(description);
 await edit.getByRole("textbox",{name:"Amount (USD)",exact:true}).fill("12.50");
 await edit.getByRole("button",{name:"Review channel",exact:true}).click();
 const review=page.getByRole("dialog",{name:"Review payment channel",exact:true}),requests:unknown[]=[];
 await page.route(`**/api/v1/merchants/${merchant.id}/channels`,async route=>{
  requests.push(route.request().postDataJSON());
  if(requests.length===1){const response=await route.fetch();expect(response.status()).toBe(200);await route.abort("failed");}
  else await route.fulfill({status:403,json:{error:{code:"ACTION_DENIED"}}});
 });
 await review.getByRole("button",{name:"Save payment channel",exact:true}).click();
 await review.getByRole("button",{name:"Retry same request",exact:true}).click();
 await expect(review.getByRole("button",{name:"Reload channels",exact:true})).toBeVisible();
 // Simulate a fresh server denial without changing the other browser fixtures' grants.
 await page.route(`**/api/v1/merchants/${merchant.id}`,route=>route.fulfill({status:403,json:{error:{code:"ACTION_DENIED"}}}));
 await review.getByRole("button",{name:"Reload channels",exact:true}).click();
 await expect(review).toBeHidden();
 await expect(page.getByText("Your current access no longer includes this request’s details.",{exact:false})).toBeVisible();
 await expect(page.getByText(description,{exact:true})).toHaveCount(0);
 await page.getByRole("button",{name:"Retry same request",exact:true}).click();
 await expect(page.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toBeEnabled();
 expect(requests).toHaveLength(3);expect(requests[1]).toEqual(requests[0]);expect(requests[2]).toEqual(requests[0]);
 const records=await page.request.get(`/api/v1/merchants/${merchant.id}`).then(response=>response.json());
 expect(records.channels.filter((channel:{description:string})=>channel.description===description)).toHaveLength(1);
 await page.getByRole("button",{name:"Leave unconfirmed request",exact:true}).click();
 await expect(page).toHaveURL(/\/merchant-services$/);
});

test("an inaccessible activation preserves the unknown command without trapping the merchant workspace",async({page})=>{
 test.setTimeout(90_000);
 const {merchant,channel}=await activeGuestChannel(page.request,"REUSABLE");
 await page.goto(`/merchants/${merchant.id}?tab=channels&channel=${channel.id}`);
 const detail=page.getByRole("dialog",{name:"Payment channel details",exact:true}),requests:unknown[]=[];
 await page.route(`**/api/v1/merchants/${merchant.id}/channels/${channel.id}/activation`,async route=>{
  requests.push(route.request().postDataJSON());
  if(requests.length===1){const response=await route.fetch();expect(response.status()).toBe(200);await route.abort("failed");}
  else await route.fulfill({status:403,json:{error:{code:"ACTION_DENIED"}}});
 });
 await detail.getByRole("button",{name:"Turn off channel",exact:true}).click();
 const review=page.getByRole("dialog",{name:"Turn off this channel?",exact:true});
 await review.getByRole("button",{name:"Confirm setting",exact:true}).click();
 await review.getByRole("button",{name:"Retry same request",exact:true}).click();
 await expect(review.getByRole("button",{name:"Reload payment status",exact:true})).toBeVisible();
 await page.route(`**/api/v1/merchants/${merchant.id}/operations`,route=>route.fulfill({status:403,json:{error:{code:"ACTION_DENIED"}}}));
 await review.getByRole("button",{name:"Reload payment status",exact:true}).click();
 await expect(review).toBeHidden();
 await expect(detail.getByText("Leaving does not cancel or confirm the request.",{exact:false})).toBeVisible();
 await detail.getByRole("button",{name:"Retry same request",exact:true}).click();
 await expect(detail.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toBeEnabled();
 expect(requests).toHaveLength(3);expect(requests[1]).toEqual(requests[0]);expect(requests[2]).toEqual(requests[0]);
 expect((await operations(page,merchant.id)).channels.find(row=>row.channelId===channel.id)?.state).toBe("DISABLED");
 await detail.getByRole("button",{name:"Leave unconfirmed request",exact:true}).click();
 await expect(page).toHaveURL(/\/merchant-services$/);
});



test("a hidden publication recovers through the same link controls without exposing its details",async({page})=>{
 test.setTimeout(90_000);
 const {merchant,channel}=await activeGuestChannel(page.request,"REUSABLE"),requests:unknown[]=[];
 await page.goto(`/merchants/${merchant.id}?tab=channels&channel=${channel.id}`);
 const detail=page.getByRole("dialog",{name:"Payment channel details",exact:true});
 await detail.getByRole("button",{name:"Publish payment link",exact:true}).click();
 await page.route(`**/api/v1/merchants/${merchant.id}/channels/${channel.id}/publication`,async route=>{
  if(route.request().method()!=="POST"){await route.continue();return;}
  requests.push(route.request().postDataJSON());
  if(requests.length===1){const response=await route.fetch();expect(response.status()).toBe(200);await route.abort("failed");}
  else await route.fulfill({status:403,json:{error:{code:"ACTION_DENIED"}}});
 });
 await detail.getByRole("button",{name:"Confirm publication",exact:true}).click();
 await detail.getByRole("button",{name:"Retry same link request",exact:true}).click();
 await expect(detail.getByRole("button",{name:"Reload channels",exact:true})).toBeVisible();
 await page.route(`**/api/v1/merchants/${merchant.id}`,route=>route.fulfill({status:403,json:{error:{code:"ACTION_DENIED"}}}));
 await detail.getByRole("button",{name:"Reload channels",exact:true}).click();
 await expect(detail).toBeHidden();
 const recovery=page.getByRole("region",{name:"Saved link request",exact:true});
 await expect(recovery).toBeVisible();
 await expect(page.getByText(channel.description,{exact:true})).toHaveCount(0);
 await expect(page.getByRole("textbox",{name:"Customer payment URL",exact:true})).toHaveCount(0);
 await recovery.getByRole("button",{name:"Retry same link request",exact:true}).click();
 await expect(page.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toBeEnabled();
 expect(requests).toHaveLength(3);expect(requests[1]).toEqual(requests[0]);expect(requests[2]).toEqual(requests[0]);
 await page.getByRole("button",{name:"Leave unconfirmed request",exact:true}).click();
 await expect(page).toHaveURL(/\/merchant-services$/);
});
