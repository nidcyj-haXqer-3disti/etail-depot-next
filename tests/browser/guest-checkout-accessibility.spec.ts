import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Page} from "@playwright/test";
import {closeDatabase} from "../../src/platform/database/client";
import {networkCheckoutFixture} from "../helpers/network-checkout";
test.afterAll(closeDatabase);
async function accessible(page:Page){const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();expect(result.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-window.innerWidth)).toBeLessThanOrEqual(1);}
for(const width of [1440,320])test(`public card selection, processing recovery and saved receipt are accessible at ${width}px`,async({page})=>{
 test.setTimeout(90_000);await page.setViewportSize({width,height:900});const f=await networkCheckoutFixture();await page.goto(f.publication.publicHref);await expect(page.getByRole("radio",{name:"Visa",exact:true})).toBeVisible();await accessible(page);
 await page.getByRole("radio",{name:"Visa",exact:true}).focus();await page.keyboard.press("ArrowRight");await expect(page.getByRole("radio",{name:"Mastercard",exact:true})).toBeChecked();
 const path=`**/api/v1/guest/publications/${f.publication.id}/payments/*/process`;await page.route(path,route=>route.abort());await page.getByRole("button",{name:"Pay $12.50",exact:true}).click();await expect(page.locator("main").getByRole("alert")).toBeVisible();await accessible(page);await page.unroute(path);await page.getByRole("button",{name:"Check payment status",exact:true}).click();await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();await accessible(page);await page.reload();await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();await accessible(page);
});
