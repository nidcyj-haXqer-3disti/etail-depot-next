import {randomUUID} from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Page} from "@playwright/test";
import {supportCaseListSchema} from "../../src/modules/cases/api-contracts";
import {cardholderTaskHref} from "../../src/ui/cardholder-routing";
import {cardDashboard,signIn} from "./helpers/fresh";
import {createMerchantViaApi} from "../helpers/merchant-api";

async function accessibleRecovery(page:Page){
 expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
}

test("a lost merchant status change remains owned after closing its dialog and has a private denied-access exit",async({page})=>{
 test.setTimeout(90_000);await signIn(page.request);
 const merchant=await createMerchantViaApi(page.request,`Status recovery ${randomUUID().slice(0,8)}`),reason=`Private pause explanation ${randomUUID()}`;
 await page.goto(`/merchants/${merchant.merchantId}?tab=verification`);
 await page.getByRole("button",{name:"Pause terminal",exact:true}).click();
 const review=page.getByRole("dialog",{name:"Pause this terminal?",exact:true});
 await review.getByRole("textbox",{name:"Reason for this change",exact:true}).fill(reason);
 const requests:unknown[]=[];let savedVersion=0;
 await page.route(`**/api/v1/merchants/${merchant.merchantId}/pause`,async route=>{
  requests.push(route.request().postDataJSON());
  if(requests.length===1){const response=await route.fetch();expect(response.status()).toBe(200);savedVersion=(await response.json()).version;await route.abort("failed");}
  else await route.fulfill({status:403,json:{error:{code:"ACTION_DENIED"}}});
 });
 await review.getByRole("button",{name:"Confirm pause",exact:true}).click();
 await expect(review.getByRole("button",{name:"Retry saved change",exact:true})).toBeVisible();
 await expect(page.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toHaveCount(0);
 await review.getByRole("button",{name:"Cancel",exact:true}).click();await expect(review).toBeHidden();
 await expect(page.locator(".mn-navigation-boundary")).toHaveAttribute("data-pending","true");
 const before=page.url();await page.locator("header a[href]").first().dispatchEvent("click");expect(page.url()).toBe(before);
 await page.getByRole("button",{name:"Continue status change",exact:true}).click();
 await review.getByRole("button",{name:"Retry saved change",exact:true}).click();
 const recovery=page.getByRole("region",{name:"Terminal status recovery",exact:true});
 await expect(recovery).toContainText("Leaving does not cancel or confirm the change.");
 await expect(recovery).not.toContainText(reason);await expect(recovery.getByRole("textbox")).toHaveCount(0);
 await recovery.getByRole("button",{name:"Retry saved change",exact:true}).click();
 await expect(recovery.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toBeEnabled();
 expect(requests).toHaveLength(3);expect(requests[1]).toEqual(requests[0]);expect(requests[2]).toEqual(requests[0]);
 const saved=await page.request.get(`/api/v1/merchants/${merchant.merchantId}`).then(response=>response.json());
 expect(saved.merchant).toMatchObject({status:"PAUSED",version:savedVersion});
 await accessibleRecovery(page);
 await recovery.getByRole("button",{name:"Leave unconfirmed request",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname==="/services");await expect(page.getByRole("heading",{name:"Your services",exact:true})).toBeVisible();
});

for(const service of ["merchant","cardholder"] as const){
 test(`${service} support retains a previously unknown request through conflict and access denial without exposing its text`,async({page})=>{
  test.setTimeout(90_000);await signIn(page.request);
  let path:string,href:string;
  if(service==="merchant"){
   const merchant=await createMerchantViaApi(page.request,`Support recovery ${randomUUID().slice(0,8)}`);
   path=`/api/v1/merchants/${merchant.merchantId}/cases`;href=`/merchants/${merchant.merchantId}?tab=help&new=1`;
  }else{
   const dashboard=await cardDashboard(page.request),card=dashboard.cards.find(item=>item.holderId===dashboard.person.id)!;
   path=`/api/v1/cardholder-services/${card.serviceId}/cases`;href=cardholderTaskHref("help",{cardId:card.id},{new:"1"});
  }
  const subject=`Private ${service} question ${randomUUID().slice(0,8)}`,message=`Fictional private explanation ${randomUUID()}`;
  await page.goto(href);await page.getByRole("textbox",{name:"Subject",exact:true}).fill(subject);
  await page.getByRole("textbox",{name:"Your explanation",exact:true}).fill(message);
  await page.getByRole("button",{name:"Review case",exact:true}).click();
  const requests:unknown[]=[];
  await page.route(`**${path}`,async route=>{
   if(route.request().method()!=="POST"){await route.continue();return;}
   requests.push(route.request().postDataJSON());
   if(requests.length===1){const saved=await route.fetch();expect(saved.status()).toBe(200);await route.abort("failed");}
   else await route.fulfill({status:requests.length===2?409:403,json:{error:{code:requests.length===2?"STALE_VERSION":"ACTION_DENIED"}}});
  });
  await page.getByRole("button",{name:"Create case",exact:true}).click();
  await expect(page.getByRole("button",{name:"Retry same request",exact:true})).toBeVisible();
  await expect(page.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toHaveCount(0);
  if(service==="merchant"){
   await expect(page.locator(".mn-navigation-boundary")).toHaveAttribute("data-pending","true");
   const before=page.url();await page.locator("header a[href]").first().dispatchEvent("click");expect(page.url()).toBe(before);
  }
  await page.getByRole("button",{name:"Retry same request",exact:true}).click();
  await expect(page.getByRole("button",{name:"Retry same request",exact:true})).toBeEnabled();
  await expect(page.getByRole("button",{name:"Create case",exact:true})).toBeDisabled();
  await page.getByRole("button",{name:"Retry same request",exact:true}).click();
  const recovery=page.getByRole("region",{name:"Support request recovery",exact:true});
  await expect(recovery).toContainText("Leaving does not cancel or confirm the request.");
  await expect(recovery).not.toContainText(subject);await expect(recovery).not.toContainText(message);
  await expect(recovery.getByRole("textbox")).toHaveCount(0);await expect(recovery.getByRole("region",{name:"Related payment",exact:true})).toHaveCount(0);
  await recovery.getByRole("button",{name:"Retry same request",exact:true}).click();
  await expect(recovery.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toBeEnabled();
  expect(requests).toHaveLength(4);for(const request of requests.slice(1))expect(request).toEqual(requests[0]);
  const listed=supportCaseListSchema.parse(await page.request.get(`${path}?q=${encodeURIComponent(subject)}`).then(response=>response.json()));
  expect(listed.cases.filter(item=>item.subject===subject)).toHaveLength(1);
  await accessibleRecovery(page);
  await recovery.getByRole("button",{name:"Leave unconfirmed request",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname==="/services");await expect(recovery).toBeHidden();
 });
}
