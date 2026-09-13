import {expect,test} from "@playwright/test";
import {closeDatabase} from "../../src/platform/database/client";
import {getMerchantPaymentSettings,getMerchantOperations} from "../../src/modules/acquiring/operations-service";
import {acquiringFixture} from "../helpers/acquiring";
import {merchantAccessFixture} from "../helpers/merchant-access";
import {isolatedSession,requireFictionalTestDatabase} from "./helpers/prepaid-journey";

test.beforeAll(requireFictionalTestDatabase);test.afterAll(closeDatabase);
test("business payment acceptance retries the same saved request while terminal settings remain separate",async({page})=>{
 const f=await acquiringFixture(),session=await isolatedSession(page,f.personId),attempts:unknown[]=[];
 try{
  await page.goto(`/merchant-services/${f.serviceId}/settings`);
  const acceptance=page.getByRole("region",{name:"Business payment acceptance",exact:true});
  await expect(acceptance.getByRole("group",{name:"Card networks",exact:true})).toContainText("American Express");
  await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toHaveCount(0);
  await expect(page.getByRole("link",{name:"View balance and payouts",exact:true})).toHaveAttribute("href",`/merchant-services?view=merchant%3A${f.serviceId}`);
  await page.route(`**/api/v1/merchant-services/${f.serviceId}/payment-settings`,async route=>{
   if(route.request().method()!=="PUT"){await route.continue();return;}
   attempts.push(route.request().postDataJSON());if(attempts.length===2){await route.fulfill({status:403,json:{error:{code:"ACTION_DENIED"}}});return;}const response=await route.fetch();expect(response.status()).toBe(200);
   if(attempts.length===1)await route.abort("failed");else await route.fulfill({response});
  });
  await acceptance.getByRole("button",{name:"Turn on business payments",exact:true}).click();
  const dialog=page.getByRole("dialog",{name:"Turn on business payments?",exact:true});
  await expect(dialog).toContainText("Each terminal and payment link must also be enabled");
  await dialog.getByRole("button",{name:"Confirm payment setting",exact:true}).click();
  await expect(dialog.getByRole("button",{name:"Check payment setting again",exact:true})).toBeVisible();
  await expect(page.locator(".mn-navigation-boundary")).toHaveAttribute("data-pending","true");
  const current=page.url();await page.getByRole("link",{name:"Manage terminals",exact:true}).dispatchEvent("click");expect(page.url()).toBe(current);
  await page.keyboard.press("Escape");await expect(dialog).toBeVisible();
  await dialog.getByRole("button",{name:"Check payment setting again",exact:true}).click();
  await expect(dialog).toBeHidden();await expect(page.getByRole("heading",{name:"Account controls unavailable",exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Reload account settings",exact:true}).click();
  await expect(dialog).toBeVisible();await expect(dialog).toContainText("Each terminal and payment link must also be enabled");
  await expect(page.getByRole("dialog",{name:"Turn off business payments?",exact:true})).toHaveCount(0);
  await dialog.getByRole("button",{name:"Check payment setting again",exact:true}).click();
  await expect(dialog).toBeHidden();expect(attempts).toHaveLength(3);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
  await expect(acceptance.getByRole("button",{name:"Turn off business payments",exact:true})).toBeVisible();
  expect((await getMerchantPaymentSettings(f.personId,f.serviceId)).gateway).toMatchObject({mode:"TEST_READY",version:1});
  expect((await getMerchantOperations(f.personId,f.merchantId)).enrollment.status).toBe("NOT_ENROLLED");
  await page.reload();await expect(acceptance.getByRole("button",{name:"Turn off business payments",exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 }finally{await session.close();}
});
test("a terminal recipient cannot open business payment controls or acquire owner authority",async({page})=>{
 const f=await merchantAccessFixture(),session=await isolatedSession(page,f.operator.personId);
 try{
  await page.goto(`/merchant-services/${f.merchant.serviceId}/settings`);
  await expect(page.getByRole("region",{name:"Business payment acceptance",exact:true})).toHaveCount(0);
  await expect(page.getByRole("button",{name:/Turn (on|off) business payments/})).toHaveCount(0);
  expect((await page.request.get(`/api/v1/merchant-services/${f.merchant.serviceId}/payment-settings`)).status()).toBe(404);
  await page.goto(`/merchant-services/terminals/${f.unit.id}`);
  await expect(page.getByRole("region",{name:"Selected payment terminal",exact:true})).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Merchant account navigation",exact:true}).getByRole("link",{name:"Account settings",exact:true})).toHaveCount(0);
 }finally{await session.close();}
});
