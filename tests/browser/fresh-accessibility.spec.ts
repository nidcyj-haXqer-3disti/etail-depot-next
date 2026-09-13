import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Locator,type Page} from "@playwright/test";
import {merchantOperationsProjectionSchema} from "../../src/modules/acquiring/operations-api-contracts";
import {operatorQueueSchema} from "../../src/modules/operations/api-contracts";
import {merchantDashboard,openCardholder,signIn} from "./helpers/fresh";

async function accessible(page:Page,label:string) {
 await test.step(label,async()=>{
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.locator("header .account-menu > summary")).toHaveCount(1);
  const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
  expect(result.violations.map(({id,impact,nodes})=>({id,impact,nodes:nodes.map(node=>({target:node.target,summary:node.failureSummary}))})),label).toEqual([]);
  expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-window.innerWidth),`${label}: no horizontal page overflow`).toBeLessThanOrEqual(1);
 });
}
async function dialogKeyboard(page:Page,dialog:Locator) {
 await expect(dialog).toBeVisible();
 await expect(dialog.getByRole("heading",{level:2})).toBeFocused();
 await page.keyboard.press("Shift+Tab");
 expect(await dialog.evaluate(node=>node.contains(document.activeElement))).toBe(true);
 await page.keyboard.press("Tab");
 expect(await dialog.evaluate(node=>node.contains(document.activeElement))).toBe(true);
}

for(const width of [1440,320]) {
 for(const persona of ["owner","viewer"] as const) {
  test(`${persona === "owner" ? "owner" : "cardholder"} Cardholder dashboard, controls and activity are accessible at ${width}px`,async({page})=>{
   test.setTimeout(90_000);await page.setViewportSize({width,height:900});
   const {card}=await openCardholder(page,persona);
   await expect(page.getByRole("region",{name:"Selected card overview"})).toContainText(card.nickname);
   await accessible(page,"Cardholder overview");
   await page.getByRole("region",{name:"Card controls",exact:true}).getByRole("button",{name:"Freeze card",exact:true}).click();
   const dialog=page.getByRole("dialog",{name:"Freeze card?",exact:true});
   await dialogKeyboard(page,dialog);await accessible(page,"Exact card controls dialog");
   await page.keyboard.press("Escape");await expect(dialog).toBeHidden();
   await page.goto("/cardholder-services?view=cards");
   await expect(page.getByRole("searchbox",{name:"Search your cards"})).toBeVisible();
   await accessible(page,"Visible cards list");
   await page.goto(`/cardholder-services/activity?focus=${card.id}`);
   await expect(page.getByRole("heading",{name:"Card activity",exact:true})).toBeVisible();
   await accessible(page,"Exact card activity");
  });
  test(`${persona === "owner" ? "merchant owner" : "assigned terminal"} overview, payment views and setup are accessible at ${width}px`,async({page})=>{
   test.setTimeout(120_000);await page.setViewportSize({width,height:900});await signIn(page.request,persona);
   const dashboard=await merchantDashboard(page.request);
   const unit=dashboard.units.find(row=>persona==="owner"?row.ownerAccess&&row.name==="Online store":!row.ownerAccess);
   expect(unit).toBeTruthy();expect(unit!.ownerAccess).toBe(persona==="owner");
   await page.goto(`/merchant-services?view=unit:${unit!.id}`);
   await expect(page.getByRole("heading",{name:"Overview",exact:true})).toBeVisible();
   await accessible(page,"Authorized Merchant overview");
   const response=await page.request.get(`/api/v1/merchants/${unit!.id}/operations`);expect(response.status()).toBe(200);
   const operations=merchantOperationsProjectionSchema.parse(await response.json());
   expect(operations.canReadPayments).toBe(true);expect(operations.payments.length).toBeGreaterThan(0);
   expect(operations.canConfigureGateway).toBe(persona==="owner");expect(operations.canPayout).toBe(persona==="owner");
   await page.goto(`/merchants/${unit!.id}?tab=payments`);
   await expect(page.getByRole("region",{name:"Selected payment terminal",exact:true}).getByRole("heading",{name:unit!.name,level:1,exact:true})).toBeVisible();
   await expect(page.getByRole("navigation",{name:"Payment terminal navigation"})).toHaveCount(0);
   await expect(page.getByRole("searchbox",{name:"Search payments",exact:true})).toBeVisible();
   await accessible(page,"Merchant payments");
   const payment=operations.payments[0]!;
   const opener=page.getByRole("button",{name:`View ${payment.status.toLowerCase()} payment ${payment.description} ${payment.testReference}`,exact:true});
   await opener.click();
   const dialog=page.getByRole("dialog",{name:"Payment details",exact:true});
   await dialogKeyboard(page,dialog);await expect(dialog).toContainText(payment.testReference);
   await accessible(page,"Exact payment receipt dialog");
   await page.keyboard.press("Escape");await expect(dialog).toBeHidden();await expect(opener).toBeFocused();
   for(const view of persona==="owner"?["Refunds","Deposits"]:["Refunds"]) {
    await page.getByRole("navigation",{name:"Payment activity views"}).getByRole("button",{name:view,exact:true}).click();
    await expect(page.getByRole("searchbox",{name:`Search ${view.toLowerCase()}`,exact:true})).toBeVisible();
    await accessible(page,`Merchant ${view.toLowerCase()}`);
   }
   if(persona==="owner") {
    await page.getByRole("group",{name:"Terminal sections",exact:true}).getByRole("link",{name:"Terminal controls",exact:true}).click();
    const controls=page.getByRole("region",{name:"Terminal controls",exact:true}).locator(":scope > details");
    if(await controls.getAttribute("open")===null)await controls.locator(":scope > summary").click();
    await expect(page.getByRole("region",{name:"Selected payment terminal",exact:true}).getByRole("heading",{name:unit!.name,level:1,exact:true})).toBeVisible();
    await expect(page.getByRole("heading",{name:"Your payments are ready",exact:true})).toBeVisible();
    await accessible(page,"Merchant payment setup");
   } else {
    await expect(page.getByRole("navigation",{name:"Payment activity views"}).getByRole("button",{name:"Deposits",exact:true})).toHaveCount(0);
    await expect(page.getByRole("navigation",{name:"Merchant account navigation"}).getByRole("link",{name:"Account settings",exact:true})).toHaveCount(0);
    await expect(page.getByRole("region",{name:"Terminal controls",exact:true})).toHaveCount(0);
    await expect(page.getByRole("button",{name:"Review settlement",exact:true})).toHaveCount(0);
    await expect(page.getByRole("region",{name:"Current available balance",exact:true})).toHaveCount(0);
   }
  });
 }
 test(`operator queue and exact assigned case are accessible at ${width}px`,async({page})=>{
  test.setTimeout(60_000);await page.setViewportSize({width,height:900});await signIn(page.request,"operator");
  const response=await page.request.get("/api/v1/operations/cases");expect(response.status()).toBe(200);
  const queue=operatorQueueSchema.parse(await response.json());expect(queue.length).toBeGreaterThan(0);
  await page.goto("/operations");await expect(page.getByRole("heading",{name:"Customer care",exact:true})).toBeVisible();
  await accessible(page,"Operator assigned queue");
  const item=queue.find(row=>row.status==="OPEN")??queue[0]!;
  await page.goto(`/operations?case=${item.id}`);
  await expect(page.getByRole("region",{name:"Selected case"}).getByRole("heading",{name:item.subject,exact:true})).toBeVisible();
  await expect(page.locator(".ops-detail-heading")).toContainText(item.customer);
  await accessible(page,"Operator assigned case and response form");
 });
}
