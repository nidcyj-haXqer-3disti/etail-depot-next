import {randomUUID} from "node:crypto";
import {expect,test} from "@playwright/test";
import {merchantDashboard,signIn} from "./helpers/fresh";
import {createMerchantViaApi} from "../helpers/merchant-api";

for(const kind of ["primary","submerchant"] as const){
 test(`an unconfirmed ${kind} creation retains one request and permits an explained exit after access denial`,async({page})=>{
  test.setTimeout(90_000);
  await signIn(page.request);
  const primaryName=`Recovery parent ${randomUUID().slice(0,8)}`;
  const primary=kind==="submerchant"?await createMerchantViaApi(page.request,primaryName):null;
  const name=`Private ${kind} request ${randomUUID().slice(0,8)}`;
  await page.goto(`/merchant-services?section=merchants${primary?`&view=network:${primary.merchantId}`:""}`);
  if(primary)await page.getByRole("article",{name:`Merchant tools for ${primaryName}`,exact:true}).getByText(`Manage ${primaryName}`,{exact:true}).click();
  await page.getByRole("button",{name:primary?"Add submerchant":"Create merchant",exact:true}).click();
  const edit=page.getByRole("dialog",{name:primary?"Name your submerchant":"Name your merchant",exact:true});
  await edit.getByRole("textbox",{name:primary?"Submerchant name":"Primary merchant name",exact:true}).fill(name);
  await expect(edit.getByRole("button",{name:"Review merchant",exact:true})).toHaveCount(0);
  await expect(edit).toContainText("collections, refunds and deposits");
  await expect(edit).toContainText("Cards are set up separately");
  expect((await merchantDashboard(page.request)).units.filter(unit=>unit.name===name)).toEqual([]);
  const path=primary?`/api/v1/merchants/${primary.merchantId}/submerchants`:"/api/v1/merchants",requests:unknown[]=[];
  await page.route(`**${path}`,async route=>{
   if(route.request().method()!=="POST"){await route.continue();return;}
   requests.push(route.request().postDataJSON());
   if(requests.length===1){const saved=await route.fetch();expect(saved.status()).toBe(200);await route.abort("failed");}
   else await route.fulfill({status:primary?404:403,json:{error:{code:"ACTION_DENIED"}}});
  });
  await edit.getByRole("button",{name:primary?"Add submerchant":"Create merchant",exact:true}).click();
  await expect(edit.getByRole("button",{name:"Retry same merchant request",exact:true})).toBeVisible();
  await expect(edit.getByRole("textbox",{name:primary?"Submerchant name":"Primary merchant name",exact:true})).toBeDisabled();
  await expect(page.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toHaveCount(0);
  await expect(page.locator(".mn-navigation-boundary")).toHaveAttribute("data-pending","true");
  const before=page.url();await page.locator("header a[href]").first().dispatchEvent("click");expect(page.url()).toBe(before);
  await edit.getByRole("button",{name:"Retry same merchant request",exact:true}).click();
  const recovery=page.getByRole("dialog",{name:"Merchant request unavailable",exact:true});
  await expect(recovery.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toBeEnabled();
  await expect(recovery).toContainText("Leaving does not cancel or confirm the request.");
  await expect(recovery).not.toContainText(name);
  await expect(recovery.getByRole("textbox")).toHaveCount(0);
  await recovery.getByRole("button",{name:"Retry same merchant request",exact:true}).click();
  await expect(recovery.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toBeEnabled();
  expect(requests).toHaveLength(3);expect(requests[1]).toEqual(requests[0]);expect(requests[2]).toEqual(requests[0]);
  const saved=(await merchantDashboard(page.request)).units.filter(unit=>unit.name===name);
  expect(saved).toHaveLength(1);expect(saved[0].kind).toBe(primary?"SUB":"MASTER");
  if(primary)expect(saved[0].primaryId).toBe(primary.merchantId);
  await recovery.getByRole("button",{name:"Leave unconfirmed request",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname==="/services");
  await expect(recovery).toBeHidden();
  await expect(page.getByRole("heading",{name:"Your services",exact:true})).toBeVisible();
  await expect(page.locator(".mn-navigation-boundary[data-pending]")).toHaveCount(0);
 });
}
