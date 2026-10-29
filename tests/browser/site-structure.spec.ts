import { expect, test } from "@playwright/test";

test("primary categories support keyboard, outside dismissal and service navigation", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const menu = header.getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  const nav = header.getByRole("navigation", { name: "Main navigation" });
  const services = nav.locator("summary").filter({ hasText: /^Services$/ });
  const useCases = nav.locator("summary").filter({ hasText: /^Use cases$/ });
  await expect(nav.locator(":scope > a, :scope > details > summary")).toHaveText(["Services", "Use cases", "Documentation", "Guides"]);
  await services.focus(); await page.keyboard.press("Enter");
  await expect(nav.getByRole("link", { name: "Merchant services", exact: true })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(nav.getByRole("link", { name: "Merchant services", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(services).toBeFocused();
  await expect(nav.getByRole("link", { name: "Merchant services", exact: true })).toBeHidden();
  if (await menu.isVisible()) await expect(menu).toHaveAttribute("aria-expanded", "true");
  await services.click(); await useCases.click();
  await expect(nav.getByRole("link", { name: "Merchant services", exact: true })).toBeHidden();
  await expect(nav.getByRole("link", { name: "Software platforms", exact: true })).toBeVisible();
  await page.getByRole("heading", { level: 1 }).click();
  await expect(nav.locator("details[open]")).toHaveCount(0);
  if (await menu.isVisible()) await menu.click();
  await services.click();
  await nav.getByRole("link", { name: "Card services", exact: true }).click();
  await expect(page).toHaveURL(/\/credit-card-services$/);
  await expect(page.getByRole("main")).toContainText("Applications are not open yet.");
  await expect(nav.locator("details[open]")).toHaveCount(0);
  if (await menu.isVisible()) await menu.click();
  await nav.getByRole("link", { name: "Documentation", exact: true }).click();
  await expect(page).toHaveURL(/\/docs$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Payment documentation");
  await page.goBack(); await expect(page).toHaveURL(/\/credit-card-services$/);
});

test("Documentation connects tasks and keeps account access protected", async ({ page, request }) => {
  const response = await page.goto("/docs");
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/docs");
  await page.locator(".docs-task-paths").getByRole("link", { name: "Set up an account", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/merchant-onboarding$/);
  const portal = page.getByRole("main").getByRole("link", { name: "Continue to Trolleys", exact: true });
  await expect(portal).toHaveAttribute("href", "https://trolleys.ai");
  await expect(portal).toHaveAttribute("referrerpolicy", "no-referrer");
  await expect(page.locator("form, iframe, input")).toHaveCount(0);
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/docs");
});

test("Services, Use cases and Documentation remain usable without JavaScript", async ({ browser, baseURL }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: testInfo.project.name === "mobile" ? { width: 320, height: 900 } : { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    await expect(nav).toBeVisible();
    await nav.locator("summary").filter({ hasText: /^Services$/ }).click();
    await nav.getByRole("link", { name: "Merchant services", exact: true }).click();
    await expect(page).toHaveURL(/\/payment-acceptance-service$/);
    await nav.locator("summary").filter({ hasText: /^Use cases$/ }).click();
    await nav.getByRole("link", { name: "Software platforms", exact: true }).click();
    await expect(page).toHaveURL(/\/software-partners$/);
    await nav.getByRole("link", { name: "Documentation", exact: true }).click();
    await expect(page).toHaveURL(/\/docs$/);
    await page.locator(".docs-task-paths").getByRole("link", { name: "Sandbox and launch", exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/testing-and-launch$/);
    await expect(page.locator("#acceptance-tests")).toContainText("Invalid, repeated or delayed event");
    const guidance = page.locator("#customer-journey details");
    await expect(guidance.locator("p")).toBeHidden();
    await guidance.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(guidance).toHaveAttribute("open", "");
    await expect(guidance.locator("p")).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(guidance).not.toHaveAttribute("open", "");
    await expect(guidance.locator("p")).toBeHidden();
  } finally { await context.close(); }
});

test("online business use case owns the merchant walkthrough and preserves navigation and discovery boundaries", async ({ page, request }) => {
  await page.goto("/payment-acceptance-service#customer-checkout");
  await expect(page.locator(".payment-service-explorer, .payment-sharing-note")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "See the online payment experience", exact: true })).toHaveCount(0);
  const header = page.getByRole("banner");
  const menu = header.getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  const navigation = header.getByRole("navigation", { name: "Main navigation" });
  await navigation.locator("summary").filter({ hasText: /^Use cases$/ }).click();
  await navigation.getByRole("link", { name: "Online businesses", exact: true }).click();
  await expect(page).toHaveURL(/\/online-businesses$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Payments for\s*online businesses\./);
  await expect(page.locator(".payment-service-explorer")).toHaveCount(1);
  await expect(page.locator("#payment-channels")).toContainText("Payment requests");
  await expect(page.locator("#fees, #payment-operations")).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/online-businesses");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/online-businesses");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Online businesses", exact: true })).toHaveAttribute("href", "/online-businesses");
  const application = page.locator(".online-business-actions").getByRole("link", { name: "Apply for a merchant account", exact: true });
  await expect(application).toHaveAttribute("href", "https://trolleys.ai");
  await expect(application).toHaveAttribute("referrerpolicy", "no-referrer");
  await expect(application).toHaveAttribute("rel", /\bnoreferrer\b/);
  await page.getByRole("link", { name: "View processing fees", exact: true }).click();
  await expect(page).toHaveURL(/\/payment-acceptance-service#fees$/);
  await expect(page.locator("#fees")).toBeInViewport();
  await page.goBack();
  await expect(page).toHaveURL(/\/online-businesses$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/payment-acceptance-service#customer-checkout$/);
});

test("four service and use-case section menus remain usable without JavaScript", async ({ browser, baseURL }, testInfo) => {
  const mobile = testInfo.project.name === "mobile";
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: mobile ? 320 : 1440, height: 900 } });
  const page = await context.newPage();
  try {
    for (const route of ["/payment-acceptance-service", "/online-businesses", "/software-partners", "/credit-card-services"]) {
      await page.goto(route);
      const nav = page.getByRole("navigation", { name: "On this page", exact: true });
      const disclosure = nav.locator(".service-section-mobile");
      if (mobile) {
        await expect(nav.getByRole("link")).toHaveCount(0);
        await disclosure.locator("summary").focus();
        await page.keyboard.press("Enter");
        await expect(disclosure).toHaveAttribute("open", "");
      }
      const links = nav.getByRole("link");
      expect(await links.count()).toBeGreaterThan(1);
      for (const link of await links.all()) {
        const href = await link.getAttribute("href");
        await link.focus();
        await page.keyboard.press("Enter");
        await expect(page.locator(href!)).toBeInViewport();
      }
      if (mobile) {
        await disclosure.locator("summary").focus();
        await page.keyboard.press("Enter");
        await expect(nav.getByRole("link")).toHaveCount(0);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
  } finally { await context.close(); }
});

test("online journey tabs keep the next chapter stable and inactive controls out of the focus order", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/online-businesses");
  await page.evaluate(() => document.fonts.ready);
  const explorer = page.locator(".payment-service-explorer");
  const views = explorer.getByRole("tablist", { name: "Payment journey views", exact: true });
  const positions: number[] = [];
  for (const name of ["Onboarding", "Checkout", "Card record", "Card payout"]) {
    const tab = views.getByRole("tab", { name, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(explorer.locator(".pse-panel:visible")).toHaveCount(1);
    await expect(explorer.locator(".pse-panel[aria-hidden=true][inert]")).toHaveCount(3);
    positions.push(await page.locator("#payment-channels").evaluate(el => el.getBoundingClientRect().top + scrollY));
    await tab.focus(); await page.keyboard.press("Tab");
    await expect(explorer.getByRole("tabpanel", { name, exact: true })).toBeFocused();
  }
  expect(Math.max(...positions) - Math.min(...positions)).toBeLessThanOrEqual(1);
});


const industryPaths = ["commerce-marketplaces", "freight-platforms", "travel-platforms", "legal-software"];
test("four industry cases share one page with useful workflows and no standalone pages", async ({page, request}) => {
  await page.goto("/software-partners?tracking=private");
  await expect(page.locator(".platform-case")).toHaveCount(4);
  await expect(page.locator('a[href^="/use-cases/"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/software-partners");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("main form, main input, main iframe")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/Cybersource|Infinicept|SDK|prototype|illustrative|roadmap/i);
  for (const slug of industryPaths) {
    const card = page.locator(`#${slug}`);
    await expect(card.getByRole("heading", {level:3})).toBeVisible();
    await expect(card.locator(".platform-case-steps li")).toHaveCount(4);
    await card.locator("summary").focus(); await page.keyboard.press("Enter");
    await expect(card.locator("details")).toHaveAttribute("open", "");
    await expect(card.locator(".platform-case-scope")).toBeVisible();
    await page.keyboard.press("Enter"); await expect(card.locator(".platform-case-expanded")).toBeHidden();
    expect((await request.get(`/use-cases/${slug}`)).status()).toBe(404);
    expect((await request.get(`/use-cases/${slug}.txt`)).status()).toBe(404);
  }
  await expect(page.locator("main")).not.toContainText(/debt collection|collection account|receivable/i);
  await expect(page.locator('a[href*="collection-software"], #collection-software')).toHaveCount(0);
  await expect(page.locator("#commerce-marketplaces").getByRole("img", {name:/Marketplace order and linked payment record/})).toBeVisible();
  const data = await page.locator('script[type="application/ld+json"]').textContent();
  const entries = JSON.parse(data!)["@graph"][2].itemListElement;
  expect(entries.map((item: {url:string})=>item.url)).toEqual(industryPaths.map(slug=>`https://etaildepot.com/software-partners#${slug}`));
  expect(data).not.toContain("tracking");
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/use-cases/");
});

test("all four industry cases remain readable without JavaScript", async ({browser, baseURL}, testInfo) => {
  const context = await browser.newContext({baseURL,javaScriptEnabled:false,reducedMotion:"reduce",viewport:{width:testInfo.project.name === "mobile" ? 320 : 1440,height:900}});
  const page = await context.newPage();
  try {
    await page.goto("/software-partners");
    for (const slug of industryPaths) {
      const card = page.locator(`#${slug}`);
      await expect(card.getByRole("heading",{level:3})).toBeVisible();
      await card.locator("summary").focus(); await page.keyboard.press("Enter");
      await expect(card.locator(".platform-case-scope")).toBeVisible();
      await page.keyboard.press("Enter");
    }
    const nav = page.getByRole("navigation", {name:"Main navigation"});
    await nav.locator("summary").filter({hasText:/^Use cases$/}).click();
    await expect(nav.locator("details[open] a")).toHaveCount(2);
    await expect(nav.getByRole("link",{name:"Software platforms",exact:true})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
});

test("footer use cases remain distinct and usable at every breakpoint", async ({page}) => {
  for (const width of [1440,1024,768,390,320]) {
    await page.setViewportSize({width,height:900}); await page.goto("/");
    const nav = page.getByRole("navigation", {name:"Footer use cases"});
    const links = nav.getByRole("link"); await expect(links).toHaveCount(2);
    const boxes = await links.evaluateAll(items=>items.map(item=>{const r=item.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,height:r.height};}));
    for (const [index,box] of boxes.entries()) {
      expect(box.x).toBeGreaterThanOrEqual(0);expect(box.right).toBeLessThanOrEqual(width+1);expect(box.height).toBeGreaterThanOrEqual(44);
      if(index) expect(box.y).toBeGreaterThanOrEqual(boxes[index-1].bottom-1);
    }
  }
});
