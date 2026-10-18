import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";
import {openMainNavigation} from "./public-header";

for (const width of [1440,390,320]) {
  for(const route of ["/","/credit-card-services","/payment-acceptance-service","/help","/privacy","/terms","/guides/stripe-alternatives","/guides/payment-processing-systems","/guides/what-is-a-chargeback"]) {
    test(`consumer ${route} is readable and accessible at ${width}px`,async({page})=>{
      await page.setViewportSize({width,height:900});
      await page.goto(route);await page.evaluate(()=>document.fonts.ready);
      const question=page.locator("summary:visible:not(.wallet-guide-disclosure > summary):not(.recognition-receipt > summary)").first();
      if(await question.count())await question.click();
      if(route==="/credit-card-services"){
        if(width<851)await page.locator(".wallet-guide-disclosure summary").click();
        await expect(page.locator(".wallet-card-art")).toBeVisible();
      }
      if(route==="/payment-acceptance-service"){
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
  for(const {name:saleType,description,amount,purchase,reference,fulfillment} of [
    {name:"Goods",description:"Homeware set",amount:"$64.00",purchase:"Homeware set · 1 set",reference:"ORDER-1048",fulfillment:[["Delivery","Delivered · 20 Sep"]]},
    {name:"Services",description:"Design services",amount:"$480.00",purchase:"Design services · Project payment",reference:"PROJECT-2086",fulfillment:[["Work completed","19 Sep"]]},
    {name:"Information",description:"Market research briefing",amount:"$35.00",purchase:"Market research · 1 briefing",reference:"BRIEF-3012",fulfillment:[["Supplied","Email · 18 Sep"],["As of","18 Sep, 9:00 AM ET"]]},
  ]){
    test(`${saleType} sharing and purchase recognition remain accessible at ${width}px`,async({page})=>{
      await page.setViewportSize({width,height:900});
      await page.goto("/payment-acceptance-service");
      await page.evaluate(()=>document.fonts.ready);
      const type=page.getByRole("tablist",{name:"What you sell",exact:true}).getByRole("tab",{name:saleType,exact:true});
      await type.click();
      await expect(type).toHaveAttribute("aria-selected","true");
      const figure=page.getByRole("figure",{name:"Illustrated payment journey",exact:true});
      const panel=figure.locator(".sale-type-panel");
      await expect(panel).toHaveAccessibleName(saleType);
      await expect(panel.locator(".payment-request-preview")).toContainText(description);
      await expect(panel.locator(".payment-request-preview")).toContainText(amount);
      await expect(panel.locator(".payment-request-preview")).toContainText(reference);
      const selection=page.locator(".fee-estimate input#addon-sale-records");
      await expect(selection).not.toBeChecked();
      await expect(selection).toHaveAccessibleName("Clarity");
      await expect(selection).toHaveAccessibleDescription(/\S+/);
      const channels=figure.getByRole("tablist",{name:"Ways to share a payment request",exact:true});
      await expect(channels).toHaveAttribute("aria-orientation","horizontal");
      for(const name of ["Copy link","Text","Email","Social","QR code","Website"]){
        const channel=channels.getByRole("tab",{name,exact:true});
        await channel.click();
        await expect(channel).toHaveAttribute("aria-selected","true");
        await expect(channels.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
        await expect(figure.locator(".channel-panel")).toHaveAccessibleName(name);
        await expect(figure.locator(".marketing-channel-journey")).toBeVisible();
        await expect(figure.locator(".channel-medium")).toContainText(description);
        await expect(figure.locator(".channel-medium")).toContainText(amount);
        await expect(figure.locator(".marketing-payment-summary")).toContainText(description);
        await expect(figure.locator(".marketing-payment-summary")).toContainText(amount);
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
        const record=example.locator(".dispute-purchase-details");
        await expect(record.getByRole("term")).toHaveText(["Purchase","Reference",...fulfillment.map(([label])=>label)]);
        await expect(record.getByRole("definition")).toHaveText([purchase,reference,...fulfillment.map(([,value])=>value)]);
        await expect(artwork.locator("figcaption")).toContainText("Example bank screens");
        await expect(selection).toBeChecked();
        const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
        expect(result.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
        expect(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
        if(name==="Customer view"){
          const receipt=example.locator("details.recognition-receipt");
          const summary=receipt.locator("summary");
          await summary.focus();
          await page.keyboard.press("Enter");
          await expect(receipt).not.toHaveAttribute("open");
          await expect(record).toBeHidden();
          const collapsedResult=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
          expect(collapsedResult.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
          await page.keyboard.press("Space");
          await expect(receipt).toHaveAttribute("open","");
          await expect(record).toBeVisible();
          await expect(summary).toBeFocused();
          await expect(selection).toBeChecked();
        }
      }
    });
  }
}
