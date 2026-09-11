import {randomUUID} from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Page} from "@playwright/test";
import {merchantOperationsProjectionSchema} from "../../src/modules/acquiring/operations-api-contracts";
import {supportCaseDetailSchema} from "../../src/modules/cases/api-contracts";
import {headers,merchantDashboard,signIn} from "./helpers/fresh";

async function accessible(page:Page) {
  const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
  expect(result.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
  expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-window.innerWidth)).toBeLessThanOrEqual(1);
}
for(const width of [1440,320])test(`merchant payment support and assigned operator context are accessible at ${width}px`,async({page})=>{
  test.setTimeout(90_000);await page.setViewportSize({width,height:900});await signIn(page.request);
  const dashboard=await merchantDashboard(page.request),unit=dashboard.units.find(row=>row.primaryAccess&&row.name==="Online store")!;
  const response=await page.request.get(`/api/v1/merchants/${unit.id}/operations`);expect(response.status()).toBe(200);
  const payment=merchantOperationsProjectionSchema.parse(await response.json()).payments.find(row=>row.refund)!;
  await page.goto(`/merchants/${unit.id}?tab=help&new=1&payment=${payment.id}`);
  await expect(page.getByRole("heading",{name:"What can we help with?",exact:true})).toBeVisible();await accessible(page);
  await page.getByRole("textbox",{name:"Subject",exact:true}).fill("Payment dates question");await page.getByRole("textbox",{name:"Your explanation",exact:true}).fill("Please explain these payment and refund dates.");await page.getByRole("button",{name:"Review case",exact:true}).click();await accessible(page);
  const created=await page.request.post(`/api/v1/merchants/${unit.id}/cases`,{headers,data:{commandId:randomUUID(),topic:"PAYMENT",subject:`Accessible payment support ${randomUUID().slice(0,8)}`,message:"A fictional question about the recorded payment dates.",paymentId:payment.id}});expect(created.status()).toBe(200);const ticket=supportCaseDetailSchema.parse(await created.json());
  await page.goto(`/merchants/${unit.id}?tab=help&case=${ticket.id}`);await expect(page.getByRole("heading",{name:ticket.subject,exact:true})).toBeVisible();await accessible(page);
  const opener=page.getByRole("button",{name:"Withdraw case",exact:true});await opener.click();const dialog=page.getByRole("dialog",{name:"Withdraw this case?",exact:true});await expect(dialog).toBeVisible();await expect(dialog.getByRole("heading",{level:2})).toBeFocused();await page.keyboard.press("Shift+Tab");expect(await dialog.evaluate(node=>node.contains(document.activeElement))).toBe(true);await accessible(page);await page.keyboard.press("Escape");await expect(dialog).toBeHidden();await expect(opener).toBeFocused();
  await signIn(page.request,"operator");await page.goto(`/operations?case=${ticket.id}`);await expect(page.getByRole("region",{name:"Selected case"})).toContainText(ticket.subject);await expect(page.getByRole("region",{name:"Related payment"})).toContainText(payment.refund!.testReference);await accessible(page);
});
