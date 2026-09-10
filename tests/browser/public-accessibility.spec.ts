import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";

for (const width of [1440,390,320]) {
  for(const route of ["/","/card-services","/payment-services","/help"]) {
    test(`consumer ${route} is readable and accessible at ${width}px`,async({page})=>{
      await page.setViewportSize({width,height:900});
      await page.goto(route);await page.evaluate(()=>document.fonts.ready);
      const question=page.locator("summary").first();
      if(await question.count())await question.click();
      const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
      expect(result.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
      expect(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
      const nav=page.getByRole("navigation",{name:"Main navigation"});
      await expect(nav).toBeVisible();
      for(const link of await nav.getByRole("link").all()){
        const box=await link.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(width);
      }
    });
  }
}
