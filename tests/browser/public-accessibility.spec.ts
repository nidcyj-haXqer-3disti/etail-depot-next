import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";
import {openMainNavigation} from "./public-header";

for (const width of [1440,390,320]) {
  for(const route of ["/","/card-services","/payment-services","/help","/privacy","/terms"]) {
    test(`consumer ${route} is readable and accessible at ${width}px`,async({page})=>{
      await page.setViewportSize({width,height:900});
      await page.goto(route);await page.evaluate(()=>document.fonts.ready);
      const question=page.locator("summary:visible:not(.wallet-guide-disclosure > summary)").first();
      if(await question.count())await question.click();
      if(route==="/card-services"){
        if(width<851)await page.locator(".wallet-guide-disclosure summary").click();
        await expect(page.locator(".wallet-card-art")).toBeVisible();
      }
      if(route==="/payment-services"){
        const expand=page.locator(".channel-showcase").getByRole("button",{name:"Show example",exact:true});
        if(await expand.isVisible())await expand.click();
        await expect(page.locator(".marketing-channel-journey")).toBeVisible();
      }
      const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
      expect(result.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
      expect(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
      const nav=await openMainNavigation(page);
      if(width<960){
        const expandedResult=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
        expect(expandedResult.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
      }
      for(const link of await nav.getByRole("link").all()){
        const box=await link.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(width);
      }
    });
  }
}

for(const width of [1440,320]){
  for(const {name:saleType,description,amount,purchase,reference} of [
    {name:"Goods",description:"Homeware set",amount:"$64.00",purchase:"Homeware set · 1 set",reference:"ORDER-1048"},
    {name:"Services",description:"Design services",amount:"$480.00",purchase:"Design services · Project payment",reference:"PROJECT-2086"},
    {name:"Information",description:"Market research briefing",amount:"$35.00",purchase:"Market research · 1 briefing",reference:"BRIEF-3012"},
  ]){
    test(`${saleType} sharing and purchase recognition remain accessible at ${width}px`,async({page})=>{
      await page.setViewportSize({width,height:900});
      await page.goto("/payment-services");
      await page.evaluate(()=>document.fonts.ready);
      const type=page.getByRole("tablist",{name:"What you sell",exact:true}).getByRole("tab",{name:saleType,exact:true});
      await type.click();
      await expect(type).toHaveAttribute("aria-selected","true");
      const panel=page.locator(".sale-type-panel");
      await expect(panel).toHaveAccessibleName(saleType);
      const selection=page.locator(".fee-estimate input#addon-sale-records");
      await expect(selection).not.toBeChecked();
      await expect(selection).toHaveAccessibleName("Dispute readiness");
      await expect(selection).toHaveAccessibleDescription(/\S+/);
      const expand=panel.getByRole("button",{name:"Show example",exact:true});
      if(await expand.isVisible())await expand.click();
      const channels=panel.getByRole("tablist",{name:"Ways to share a payment request",exact:true});
      for(const name of ["Text","Email","Social","QR code","Website"]){
        const channel=channels.getByRole("tab",{name,exact:true});
        await channel.click();
        await expect(channel).toHaveAttribute("aria-selected","true");
        await expect(channels.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
        await expect(panel.locator(".channel-panel")).toHaveAccessibleName(name);
        await expect(panel.locator(".marketing-channel-journey")).toBeVisible();
        await expect(panel.locator(".channel-medium")).toContainText(description);
        await expect(panel.locator(".marketing-payment-summary")).toContainText(description);
        await expect(panel.locator(".marketing-payment-summary")).toContainText(amount);
        await expect(selection).not.toBeChecked();
        const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
        expect(result.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
        expect(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
      }
      await selection.check();
      await expect(selection).toBeChecked();
      const artwork=page.getByRole("figure",{name:"Order Insight purchase recognition example",exact:true});
      const views=artwork.getByRole("group",{name:"Explore purchase recognition",exact:true});
      for(const name of ["Customer view","Bank inquiry"]){
        const button=views.getByRole("button",{name,exact:true});
        await button.click();
        await expect(button).toHaveAttribute("aria-pressed","true");
        await expect(views.locator('button[aria-pressed="true"]')).toHaveCount(1);
        const example=artwork.getByRole("article",{name:`${name} example`,exact:true});
        await expect(example).toBeVisible();
        await expect(example).toContainText(amount);
        await expect(example.getByRole("term")).toHaveText(["Purchase","Reference","Business"]);
        await expect(example.getByRole("definition")).toHaveText([purchase,reference,"Your business"]);
        await expect(artwork.locator("figcaption")).toContainText("Illustrative banking experience");
        await expect(selection).toBeChecked();
        const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
        expect(result.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
        expect(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
      }
    });
  }
}
