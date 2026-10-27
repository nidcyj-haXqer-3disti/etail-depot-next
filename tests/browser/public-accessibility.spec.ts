import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Page} from "@playwright/test";
import {openMainNavigation} from "./public-header";

const publicRoutes = ["/", "/docs", "/docs/merchant-onboarding", "/docs/integration-access", "/docs/checkout", "/docs/payment-requests", "/docs/payment-status", "/docs/refunds-and-disputes", "/docs/payouts", "/docs/webhooks", "/docs/testing-and-launch", "/software-partners", "/online-businesses", "/credit-card-services", "/payment-acceptance-service", "/help", "/privacy", "/terms", "/guides"];

for (const width of [1440,390,320]) {
  for(const route of publicRoutes) {
    test(`consumer ${route} is readable and accessible at ${width}px`,async({page})=>{
      await page.setViewportSize({width,height:900});
      const errors: string[] = [];
      page.on("pageerror",error=>errors.push(error.message));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(()=>document.fonts.ready);
      await expect(page.getByRole("heading",{level:1})).toHaveCount(1);
      const brokenImages = await page.locator("img").evaluateAll(images=>images.flatMap(image=>image instanceof HTMLImageElement && (!image.complete || image.naturalWidth===0) ? [image.currentSrc || image.src] : []));
      expect(brokenImages).toEqual([]);
      const question=page.locator("main summary:visible:not(.wallet-guide-disclosure > summary)").first();
      if(await question.count())await question.click();
      if(route==="/credit-card-services"){
        if(width<851)await page.locator(".wallet-guide-disclosure summary").click();
        await expect(page.locator(".wallet-card-art")).toBeVisible();
      }
      if(route==="/online-businesses"){
        await expect(page.locator(".payment-service-explorer")).toBeVisible();
        await expect(page.getByRole("tablist",{name:"Payment journey views",exact:true}).getByRole("tab",{name:"Checkout",exact:true})).toHaveAttribute("aria-selected","true");
      }
      const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
      expect(result.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
      expect(result.incomplete.filter(({id})=>id==="aria-prohibited-attr").map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
      expect(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
      expect(errors).toEqual([]);
      const nav=await openMainNavigation(page);
      if(width<960){
        const expandedResult=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
        expect(expandedResult.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
        expect(expandedResult.incomplete.filter(({id})=>id==="aria-prohibited-attr")).toEqual([]);
      }
      for(const link of await nav.locator("a:visible, summary:visible").all()){
        const box=await link.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(width);
      }
    });
  }
}

async function expectAccessible(page: Page) {
  const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
  expect(result.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
      expect(result.incomplete.filter(({id})=>id==="aria-prohibited-attr").map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);
  expect(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
}

for(const width of [1440,320]){
  test(`payment checkout, records and payout remain keyboard accessible at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto("/online-businesses");
    await page.evaluate(()=>document.fonts.ready);
    const explorer=page.locator(".payment-service-explorer");
    const views=explorer.getByRole("tablist",{name:"Payment journey views",exact:true});
    const checkout=explorer.getByRole("tabpanel",{name:"Checkout",exact:true});
    const methods=checkout.getByRole("tablist",{name:"Checkout payment method",exact:true});
    await expect(views.getByRole("tab")).toHaveText(["Onboarding","Checkout","Card record","Card payout"]);
    await expect(methods.getByRole("tab")).toHaveText(["Card","Bank payment"]);
    await methods.getByRole("tab",{name:"Card",exact:true}).focus();
    for(const [index,name] of ["Card","Bank payment"].entries()){
      if(index>0)await page.keyboard.press("ArrowRight");
      const method=methods.getByRole("tab",{name,exact:true});
      const panel=checkout.getByRole("tabpanel",{name,exact:true});
      await expect(method).toBeFocused();
      await expect(method).toHaveAttribute("aria-selected","true");
      await expect(method).toHaveAttribute("tabindex","0");
      await expect(methods.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
      await expect(methods.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
      await expect(method).toHaveAttribute("aria-controls",await panel.getAttribute("id") as string);
      await expect(panel).toBeVisible();
      await expect(panel.getByRole("term")).toContainText(name==="Card"?["Email","Card number","Expiry","Security code","Name on card","Country","ZIP code"]:["Email","Account holder","Routing number","Account number","Account type"]);
      await expect(panel).toContainText("$100.00");
      await page.keyboard.press("Tab");
      await expect(panel).toBeFocused();
      await expectAccessible(page);
      await method.focus();
    }
    await page.keyboard.press("Home");
    await expect(methods.getByRole("tab",{name:"Card",exact:true})).toBeFocused();
    await page.keyboard.press("End");
    await expect(methods.getByRole("tab",{name:"Bank payment",exact:true})).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(methods.getByRole("tab",{name:"Card",exact:true})).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(methods.getByRole("tab",{name:"Bank payment",exact:true})).toBeFocused();

    await views.getByRole("tab",{name:"Checkout",exact:true}).focus();
    await page.keyboard.press("ArrowRight");
    for(const [index,name] of ["Card record","Card payout"].entries()){
      if(index>0)await page.keyboard.press("End");
      const tab=views.getByRole("tab",{name,exact:true});
      const panel=explorer.getByRole("tabpanel",{name,exact:true});
      await expect(tab).toBeFocused();
      await expect(tab).toHaveAttribute("aria-selected","true");
      await expect(views.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
      await expect(views.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
      await expect(tab).toHaveAttribute("aria-controls",await panel.getAttribute("id") as string);
      await expect(panel).toBeVisible();
      await page.keyboard.press("Tab");
      await expect(panel).toBeFocused();
      await expectAccessible(page);
      const summaries=name==="Card record"?["Refunds","Disputes","If the result is unclear"]:["How to check a deposit"];
      await expect(panel.locator("summary")).toHaveText(summaries);
      for(const disclosure of await panel.locator("details").all()){
        const summary=disclosure.locator("summary");
        const body=disclosure.locator("p");
        await summary.focus();
        await page.keyboard.press("Enter");
        await expect(disclosure).toHaveAttribute("open","");
        await expect(body).toBeVisible();
        await expectAccessible(page);
        await page.keyboard.press("Space");
        await expect(disclosure).not.toHaveAttribute("open");
        await expect(body).toBeHidden();
        await expect(summary).toBeFocused();
      }
      await tab.focus();
    }
    await page.keyboard.press("Home");
    await expect(views.getByRole("tab",{name:"Onboarding",exact:true})).toBeFocused();
    await expect(explorer.getByRole("tabpanel",{name:"Onboarding",exact:true})).toBeVisible();
    await expectAccessible(page);
    await page.keyboard.press("ArrowLeft");
    await expect(views.getByRole("tab",{name:"Card payout",exact:true})).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(views.getByRole("tab",{name:"Onboarding",exact:true})).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(views.getByRole("tab",{name:"Checkout",exact:true})).toBeFocused();
  });

  test(`payment fees, FAQs and operation disclosures remain accessible at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto("/payment-acceptance-service");
    await page.evaluate(()=>document.fonts.ready);
    const amount=page.locator(".fee-estimate").getByLabel("Payment amount USD");
    await expect(amount).toHaveAccessibleDescription(/\S+/);
    await amount.focus();
    await amount.fill("480");
    await expect(amount).toBeFocused();
    await expect(page.locator(".fee-net")).toContainText("$465.78");
    await expectAccessible(page);
    for(const disclosure of [
      page.locator(".offer-details"),
      page.locator("#payment-records .payment-operation-details"),
      page.locator("#payouts .payment-operation-details"),
      page.locator("#refunds-and-disputes details").nth(0),
      page.locator("#refunds-and-disputes details").nth(1),
      ...await page.locator(".public-faq-section details").all(),
    ]){
      const summary=disclosure.locator("summary");
      await summary.focus();
      await page.keyboard.press("Enter");
      await expect(disclosure).toHaveAttribute("open","");
      await expect(disclosure.locator("p").first()).toBeVisible();
      await expect(amount).toHaveValue("480");
      await expectAccessible(page);
      await page.keyboard.press("Space");
      await expect(disclosure).not.toHaveAttribute("open");
      await expect(disclosure.locator("p").first()).toBeHidden();
      await expect(summary).toBeFocused();
    }
    await amount.fill("0");
    await expect(amount).toHaveAttribute("aria-invalid", "true");
    await expect(amount).toHaveAccessibleDescription(/Enter an amount from/);
    await expectAccessible(page);
    await amount.fill("100");
    await expect(amount).toHaveAttribute("aria-invalid", "false");
    await expectAccessible(page);
  });

  test(`both wallet guides and their steps remain keyboard accessible at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto("/credit-card-services");
    await page.evaluate(()=>document.fonts.ready);
    const disclosure=page.locator(".wallet-guide-disclosure");
    const summary=disclosure.locator("summary");
    if(await disclosure.getAttribute("open")===null){
      await summary.focus();
      await page.keyboard.press("Enter");
    }
    const wallets=disclosure.getByRole("tablist",{name:"Wallet preview options",exact:true});
    await wallets.getByRole("tab",{name:"Apple Wallet",exact:true}).focus();
    for(const [index,name] of ["Apple Wallet","Google Wallet"].entries()){
      if(index>0)await page.keyboard.press("ArrowRight");
      const wallet=wallets.getByRole("tab",{name,exact:true});
      const panel=disclosure.getByRole("tabpanel",{name,exact:true});
      await expect(wallet).toBeFocused();
      await expect(wallet).toHaveAttribute("aria-selected","true");
      await expect(wallets.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
      await expect(wallet).toHaveAttribute("aria-controls",await panel.getAttribute("id") as string);
      await page.keyboard.press("Tab");
      await expect(panel).toBeFocused();
      for(const step of await panel.getByRole("button",{name:/^Show step /}).all()){
        await step.focus();
        await page.keyboard.press("Space");
        await expect(step).toHaveAttribute("aria-pressed","true");
        await expect(panel.locator('button[aria-pressed="true"]')).toHaveCount(1);
        await expect(step).toBeFocused();
        await expectAccessible(page);
      }
      await wallet.focus();
    }
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(disclosure).not.toHaveAttribute("open");
    await expect(disclosure.locator(".wallet-card-art")).toBeHidden();
    await page.keyboard.press("Space");
    await expect(disclosure).toHaveAttribute("open","");
    await expect(summary).toBeFocused();
    await expect(disclosure.getByRole("tabpanel",{name:"Google Wallet",exact:true})).toBeVisible();
    await expectAccessible(page);
  });
}


for (const width of [1440, 390, 320]) {
  test(`ISO 20022 collection, table and code remain accessible at ${width}px`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/guides/iso-20022");
    const alphabet = page.getByRole("navigation", {name:"Code sets by first letter"});
    await alphabet.getByRole("link", {name:"P", exact:true}).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#sets-p$/);
    await expect(page.locator("#sets-p")).toBeInViewport();
    await expectAccessible(page);
    // Purpose is the largest registered-code table in this release.
    const purpose = page.locator('main a[href="/guides/iso-20022/purpose"]');
    await purpose.focus(); await page.keyboard.press("Enter");
    await expect(page.getByRole("table")).toHaveCount(1);
    await expect(page.getByRole("columnheader")).toHaveText(["Code", "Published name and definition"]);
    await expect(page.locator("tbody tr")).toHaveCount(366);
    await expectAccessible(page);
    await page.goto("/guides/iso-20022/payment-transaction-status/acsp");
    const peers = page.locator("#other-code-sets details");
    await peers.locator("summary").focus(); await page.keyboard.press("Enter");
    await expect(peers).toHaveAttribute("open", "");
    await expect(peers.locator('a[href="/guides/iso-20022/payment-group-status/acsp"]')).toBeVisible();
    await expectAccessible(page);
    await page.keyboard.press("Space");
    await expect(peers).not.toHaveAttribute("open");
    await expect(peers.locator("summary")).toBeFocused();
  });

  test(`ISO 8583 tables, code identity and source notes remain accessible at ${width}px`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/guides/iso-8583");
    await expectAccessible(page);
    const fields = page.locator('main a[href="/guides/iso-8583/fields"]');
    await fields.focus(); await page.keyboard.press("Enter");
    await expect(page.getByRole("table").first().getByRole("columnheader")).toHaveText(["Field", "Profile label", "ASCII container"]);
    const note = page.locator(".reference-notes");
    await note.locator("summary").focus(); await page.keyboard.press("Enter");
    await expect(note).toHaveAttribute("open", "");
    await expectAccessible(page);
    await page.getByRole("cell").getByRole("link", {name:"39", exact:true}).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/fields\/39$/);
    await expect(page.getByRole("heading", {level:1})).toContainText("39");
    await expect(page.getByRole("complementary", {name:"Reference scope and sources"})).toContainText("default_ascii");
    await expectAccessible(page);
    for (const path of ["/guides/iso-8583/encoding", "/guides/iso-8583/messages", "/guides/iso-8583/messages/2100"]) {
      await page.goto(path);
      await expectAccessible(page);
    }
  });
}

for (const width of [1440, 960, 390, 320]) {
  test(`navigation disclosures are accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/guides/iso-8583/messages/2100");
    const menu = page.getByRole("banner").getByRole("button", { name: "Menu", exact: true });
    if (await menu.isVisible()) await menu.click();
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    for (const label of ["Services", "Use cases"]) {
      const summary = nav.locator("summary").filter({ hasText: new RegExp(`^${label}$`) });
      await summary.click();
      // Evaluate the open foreground layer separately from page targets it covers.
      const result = await new AxeBuilder({ page }).include(".public-header").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(result.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(node => node.target) }))).toEqual([]);
      for (const target of await nav.locator("a:visible, summary:visible").all()) {
        const box = await target.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      }
      await summary.press("Escape");
      await expect(summary).toBeFocused();
      await expect(nav.locator("details[open]")).toHaveCount(0);
    }
  });
}


for (const javaScriptEnabled of [true, false]) {
  test(`payment artwork has readable alternatives without payment controls (JavaScript ${javaScriptEnabled})`, async ({browser, baseURL}) => {
    const context = await browser.newContext({javaScriptEnabled, viewport: {width: 1440, height: 900}});
    const page = await context.newPage();
    try {
      await page.goto(`${baseURL}/online-businesses`);
      const checkout = page.locator(".unified-preview");
      await expect(checkout.getByRole("group", {name: "Order summary", exact: true})).toContainText("Designer sneaker");
      const wallets = checkout.getByRole("group", {name: "Wallet payment options", exact: true});
      await expect(wallets.getByRole("img", {name: "Apple Pay", exact: true})).toBeVisible();
      await expect(wallets.getByRole("img", {name: "Google Pay", exact: true})).toBeVisible();
      const total = checkout.getByRole("img", {name: "Checkout total $100.00; no payment is made", exact: true});
      await expect(total).toBeVisible();
      expect(await total.evaluate(element => ({tabIndex: (element as HTMLElement).tabIndex, interactiveParent: Boolean(element.closest("a, button, form"))}))).toEqual({tabIndex: -1, interactiveParent: false});
      await expect(checkout.locator("input, select, textarea, form, button[type=submit]")).toHaveCount(0);
      await expect(checkout.getByRole("group", {name: "Card payment confirmation", exact: true})).toContainText("Approved");
      if (javaScriptEnabled) {
        await checkout.getByRole("tab", {name: "Bank payment", exact: true}).click();
        await expect(checkout.getByRole("group", {name: "Bank payment submission", exact: true})).toContainText("Submission does not confirm that the bank payment has cleared.");
        await expect(total).toBeVisible();
        await expectAccessible(page);
      } else {
        await expect(checkout.getByRole("group", {name: "Card details", exact: true})).toContainText("Card number");
      }
      await page.goto(`${baseURL}/payment-acceptance-service`);
      await expect(page.getByRole("group", {name: "Refunds and disputes", exact: true})).toContainText("Manage a refund");
      expect(await page.locator(".pla-record-method").ariaSnapshot()).toContain("Card ending in 4242");
      await page.goto(`${baseURL}/software-partners`);
      await expect(page.getByRole("group", {name: "A clear division of responsibilities.", exact: true})).toContainText("Your software");
      expect(await page.locator(".platform-checkout-method").ariaSnapshot()).toContain("Card ending in 4242");
    } finally {
      await context.close();
    }
  });
}
