import { expect, test } from "@playwright/test";
import { openFooterGroup } from "./public-footer";
import { openMainNavigation } from "./public-header";

test("primary categories support keyboard, outside dismissal and service navigation", async ({ page, browserName }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const menu = header.getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  const nav = header.getByRole("navigation", { name: "Main navigation" });
  const services = nav.locator("summary").filter({ hasText: /^Services$/ });
  const useCases = nav.locator("summary").filter({ hasText: /^Use cases$/ });
  await expect(nav.locator(":scope > a, :scope > details > summary")).toHaveText(["Services", "Use cases", "Developers", "Resources", "Pricing"]);
  await services.focus(); await page.keyboard.press("Enter");
  await expect(nav.getByRole("link", { name: "Merchant onboarding", exact: true })).toBeVisible();
  // WebKit on macOS uses Option+Tab to include links in keyboard navigation.
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(nav.getByRole("link", { name: "Merchant onboarding", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(services).toBeFocused();
  await expect(nav.getByRole("link", { name: "Merchant onboarding", exact: true })).toBeHidden();
  if (await menu.isVisible()) await expect(menu).toHaveAttribute("aria-expanded", "true");
  await services.click();
  if (await menu.isVisible()) await nav.getByRole("button", { name: "Back", exact: true }).click();
  await useCases.click();
  await expect(nav.getByRole("link", { name: "Merchant onboarding", exact: true })).toBeHidden();
  await expect(nav.getByRole("link", { name: "Software platforms", exact: true })).toBeVisible();
  if (await menu.isVisible()) await menu.click();
  else await page.getByRole("heading", { level: 1 }).click();
  await expect(nav.locator("details[open]")).toHaveCount(0);
  if (await menu.isVisible()) await menu.click();
  await services.click();
  await nav.getByRole("link", { name: "Card services", exact: true }).click();
  await expect(page).toHaveURL(/\/credit-card-services$/);
  await expect(page.getByRole("main")).toContainText("An inquiry is not an application.");
  await expect(nav.locator("details[open]")).toHaveCount(0);
  if (await menu.isVisible()) await menu.click();
  await nav.locator("summary").filter({hasText:/^Developers$/}).click();
  await nav.getByRole("link", { name: "Documentation", exact: true }).click();
  await expect(page).toHaveURL(/\/docs$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Documentation");
  await page.goBack(); await expect(page).toHaveURL(/\/credit-card-services$/);
});

test("platform visitors reach partnership terms through payment models without an extra platform section", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const nav = header.getByRole("navigation", { name: "Main navigation", includeHidden: true });
  for (const [label, route] of [["Software platforms", "/software-partners"]]) {
    const toggle = header.getByRole("button", { name: "Menu", exact: true });
    if (await toggle.isVisible()) await toggle.click();
    const category = nav.locator("summary").filter({ hasText: /^Use cases$/ });
    await category.focus(); await page.keyboard.press("Enter");
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(category).toHaveClass("is-current");
    await expect(nav.locator("details[open]")).toHaveCount(0);
    if (await toggle.isVisible()) await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await expect(header.locator('a[href="/payment-partnerships"]')).toHaveCount(0);
  await expect(page.getByRole("contentinfo").locator('a[href="/payment-partnerships"]')).toHaveCount(0);
  await expect(page.locator(".ec-commercial-section")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "On this page", exact: true }).getByRole("link", { name: "Partnership", exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Account structure", exact: true }).click();
  await expect(page).toHaveURL(/\/platform-payment-models$/);
  await page.getByRole("main").getByRole("link", { name: "Reporting and commercial terms", exact: true }).click();
  await expect(page).toHaveURL(/\/payment-partnerships$/);
  await expect(nav.locator("summary").filter({ hasText: /^Use cases$/ })).toHaveClass("is-current");
});

test("Documentation connects tasks and keeps account access protected", async ({ page, request }) => {
  const response = await page.goto("/docs");
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/docs");
  await page.locator(".docs-task-paths").getByRole("link", { name: "Set up an account", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/merchant-onboarding$/);
  const portal = page.getByRole("main").getByRole("link", { name: "Start now", exact: true });
  await expect(portal).toHaveAttribute("href", "https://merchantapp.io/etaildepot/UserAccount/Login");
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
    await nav.getByRole("link", { name: "Merchant onboarding", exact: true }).click();
    await expect(page).toHaveURL(/\/merchant-onboarding$/);
    await nav.locator("summary").filter({ hasText: /^Use cases$/ }).click();
    await nav.getByRole("link", { name: "Software platforms", exact: true }).click();
    await expect(page).toHaveURL(/\/software-partners$/);
    await nav.locator("summary").filter({hasText:/^Developers$/}).click();
    await nav.getByRole("link", { name: "Documentation", exact: true }).click();
    await expect(page).toHaveURL(/\/docs$/);
    await page.locator(".docs-task-paths").getByRole("link", { name: "Launch preparation", exact: true }).click();
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
  if (await navigation.locator(".public-domain-use-cases").getAttribute("open") === null) await navigation.locator("summary").filter({hasText:/^Use cases$/}).click();
  await navigation.getByRole("link", { name: "Online businesses", exact: true }).click();
  await expect(page).toHaveURL(/\/online-businesses$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Online payments\.\s*Connected to your orders\./);
  await expect(page.locator(".payment-service-explorer")).toHaveCount(1);
  await expect(page.locator("#payment-channels")).toContainText("Payment requests");
  await expect(page.locator("#fees, #payment-operations")).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/online-businesses");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/online-businesses");
  await openFooterGroup(page, "Services");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Merchant onboarding", exact: true })).toHaveAttribute("href", "/merchant-onboarding");
  const service = page.locator(".online-business-actions").getByRole("link", { name: "Merchant services", exact: true });
  await expect(service).toHaveAttribute("href", "/payment-acceptance-service");
  await page.getByRole("link", { name: "Connect online checkout", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/checkout$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/online-businesses$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/payment-acceptance-service#customer-checkout$/);
});

test("existing commercial section URLs remain usable without JavaScript", async ({ browser, baseURL }, testInfo) => {
  const mobile = testInfo.project.name === "mobile";
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: { width: mobile ? 320 : 1440, height: 900 } });
  const page = await context.newPage();
  try {
    for (const [route, fragment] of [
      ["/payment-acceptance-service", "#fees"],
      ["/online-businesses", "#customer-checkout"],
      ["/online-businesses", "#payment-channels"],
      ["/software-partners", "#payment-experience"],
      ["/software-partners", "#integration"],
    ]) {
      await page.goto(route + fragment);
      await expect(page).toHaveURL(new URL(route + fragment, baseURL).href);
      await expect(page.locator(fragment)).toBeInViewport();
      await expect(page.getByRole("navigation", { name: "On this page", exact: true })).toHaveCount(0);
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
  await expect(page.locator(".industry-cases > article")).toHaveCount(4);
  await expect(page.locator('a[href^="/use-cases/"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/software-partners");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("main form, main input, main iframe")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/Cybersource|Infinicept|SDK|prototype|illustrative|roadmap/i);
  for (const slug of industryPaths) {
    const card = page.locator(`#${slug}`);
    await expect(card.getByRole("heading", {level:3})).toBeVisible();
    await expect(card.locator(".platform-case-steps li")).toHaveCount(4);
    const disclosure = card.locator(":scope > details");
    if (await disclosure.getAttribute("open") === null) await disclosure.locator(":scope > summary").click();
    await card.locator(".platform-case-details > summary").focus(); await page.keyboard.press("Enter");
    await expect(card.locator(".platform-case-details")).toHaveAttribute("open", "");
    await expect(card.locator(".platform-case-scope")).toBeVisible();
    await page.keyboard.press("Enter"); await expect(card.locator(".platform-case-expanded")).toBeHidden();
    expect((await request.get(`/use-cases/${slug}`)).status()).toBe(404);
    expect((await request.get(`/use-cases/${slug}.txt`)).status()).toBe(404);
  }
  await expect(page.locator("main")).not.toContainText(/debt collection|collection account|receivable/i);
  await expect(page.locator('a[href*="collection-software"], #collection-software')).toHaveCount(0);
  await expect(page.locator("#commerce-marketplaces .ec-industry-scene")).toBeVisible();
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
      await card.locator(".platform-case-details > summary").focus(); await page.keyboard.press("Enter");
      await expect(card.locator(".platform-case-scope")).toBeVisible();
      await page.keyboard.press("Enter");
    }
    const nav = page.getByRole("navigation", {name:"Main navigation"});
    await nav.locator("summary").filter({hasText:/^Use cases$/}).click();
    await expect(nav.locator("details[open] a")).toHaveCount(7);
    await expect(nav.getByRole("link",{name:"Software platforms",exact:true})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
});

test("footer use cases remain distinct and usable at every breakpoint", async ({page}) => {
  for (const width of [1440,1024,960,959,768,390,320]) {
    await page.setViewportSize({width,height:900}); await page.goto("/");
    const nav = await openFooterGroup(page, "Use cases");
    const links = nav.getByRole("link"); await expect(links).toHaveCount(3);
    const boxes = await links.evaluateAll(items=>items.map(item=>{const r=item.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,height:r.height};}));
    for (const [index,box] of boxes.entries()) {
      expect(box.x).toBeGreaterThanOrEqual(0);expect(box.right).toBeLessThanOrEqual(width+1);expect(box.height).toBeGreaterThanOrEqual(44);
      if(index) expect(box.y).toBeGreaterThanOrEqual(boxes[index-1].bottom-1);
    }
  }
});


test("compact navigation preserves merchant and developer journeys", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const toggle = header.getByRole("button", { name: "Menu", exact: true });
  const navigation = header.getByRole("navigation", { name: "Main navigation", includeHidden: true });
  const directory = page.locator(".public-footer-navigation");
  await expect(directory.getByRole("navigation")).toHaveCount(5);
  await expect(directory.getByRole("link", { includeHidden: true })).toHaveCount(22);
  const destinations = await directory.locator("a").evaluateAll(links => links.map(link => link.getAttribute("href")));
  expect(new Set(destinations).size).toBe(destinations.length);
  await expect(navigation.locator('a[href^="/docs"]')).toHaveCount(5);
  if (await toggle.isVisible()) await toggle.click();
  await navigation.locator("summary").filter({ hasText: /^Services$/ }).click();
  await navigation.getByRole("link", { name: "Merchant onboarding", exact: true }).click();
  await expect(page).toHaveURL(/\/merchant-onboarding$/);

  for (const [label, route] of [["Refunds", "/refunds-and-disputes"], ["Payouts", "/payouts-and-reconciliation"]]) {
    await page.goto("/");
    await openFooterGroup(page, "Services");
    await directory.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${route}`);
    await expect(navigation.locator("summary").filter({ hasText: /^Services$/ })).toHaveClass("is-current");
  }

  await page.goto("/");
  await openFooterGroup(page, "Use cases");
  await directory.getByRole("link", { name: "Software platforms", exact: true }).click();
  await page.getByRole("main").getByRole("link", { name: "Explore developer integration", exact: true }).click();
  await expect(page).toHaveURL(/\/docs#developer-integration$/);
  await expect(page.locator("#developer-integration")).toBeInViewport();
  await expect(navigation.locator("summary").filter({ hasText: /^Developers$/ })).toHaveClass("is-current");

  await page.goto("/contact");
  await expect(navigation.locator("summary.is-current")).toHaveCount(0);
  await expect(header.getByRole("link", { name: "Contact sales", exact: true, includeHidden: true })).toHaveAttribute("href", "/contact");
  await expect(directory.locator('a[href="/pricing"]')).toHaveCount(0);
  if (await toggle.isVisible()) await toggle.click();
  const pricing = navigation.locator(':scope > a[href="/pricing"]');
  await pricing.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(pricing).toHaveAttribute("aria-current", "page");
  await expect(navigation.locator("summary.is-current")).toHaveCount(0);
  await expect(navigation.locator('details a[href="/pricing"]')).toHaveCount(0);
  if (await toggle.isVisible()) await expect(toggle).toHaveAttribute("aria-expanded", "false");
});


test("service links reach dedicated pages and industry links reach platform sections", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const nav = header.getByRole("navigation", { name: "Main navigation", includeHidden: true });
  const targets = [
    ["Services", "Payouts", "/payouts-and-reconciliation"],
    ["Services", "Reconciliation", "/reconciliation"],
    ["Services", "Refunds", "/refunds-and-disputes"],
    ["Services", "Disputes", "/disputes"],
    ["Use cases", "Commerce marketplaces", "/software-partners#commerce-marketplaces"],
    ["Use cases", "Freight platforms", "/software-partners#freight-platforms"],
    ["Use cases", "Travel platforms", "/software-partners#travel-platforms"],
    ["Use cases", "Legal software", "/software-partners#legal-software"],
  ];
  for (const [group, label, href] of targets) {
    const menu = header.getByRole("button", { name: "Menu", exact: true });
    if (await menu.isVisible()) await menu.click();
    await nav.locator("summary").filter({ hasText: new RegExp(`^${group}$`) }).click();
    await expect(nav.locator(".public-domain-section > p")).toHaveCount(0);
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(href);
    if (href.includes("#")) {
      await expect(page.locator(`#${href.split("#")[1]}`)).toBeInViewport();
      await expect(page.locator(`#${href.split("#")[1]}`).getByRole("heading").first()).toBeInViewport();
    } else await expect(page.getByRole("heading", {level:1})).toBeInViewport();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${href.split("#")[0]}`);
    await expect(nav.locator("details[open]")).toHaveCount(0);
    await expect(page.locator("main")).not.toHaveAttribute("inert");
    await page.waitForLoadState("networkidle");
  }
});


test("footer groups work with a keyboard and adapt to screen size", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs");
  const directory = page.locator(".public-footer-navigation");
  await expect(directory).toHaveAttribute("data-compact", "true");
  await expect(directory.locator("details[open]")).toHaveCount(0);
  await expect(directory.locator("summary")).toHaveText(["Services", "Use cases", "Developers", "Resources", "Company"]);
  const services = directory.locator("summary").filter({ hasText: /^Services$/ });
  await services.focus();
  await page.keyboard.press("Enter");
  const merchant = directory.getByRole("link", { name: "Merchant onboarding", exact: true });
  await expect(merchant).toBeVisible();
  // WebKit on macOS uses Option+Tab to include links in keyboard navigation.
  // https://support.apple.com/guide/safari/cpsh003/mac
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
  await expect(merchant).toBeFocused();
  const resources = directory.locator("summary").filter({ hasText: /^Resources$/ });
  await resources.click();
  await expect(directory.locator("details[open]")).toHaveCount(1);
  await expect(merchant).toBeHidden();
  await expect(directory.getByRole("link", { name: "Guides", exact: true })).toBeVisible();
  await expect(resources).toBeInViewport();
  await services.click();
  await expect(directory.locator("details[open]")).toHaveCount(1);
  await expect(merchant).toBeVisible();
  await services.focus();
  await page.keyboard.press("Space");
  await expect(merchant).toBeHidden();
  await expect(services).toBeFocused();
  const developers = await openFooterGroup(page, "Developers");
  await developers.getByRole("link", { name: "Checkout integration", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/checkout$/);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(directory).toHaveAttribute("data-compact", "false");
  await expect(directory.getByRole("link")).toHaveCount(22);
  await expect(directory.locator("summary")).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(directory).toHaveAttribute("data-compact", "true");
  await expect(directory.locator("details[open]")).toHaveCount(0);
  await openFooterGroup(page, "Services");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test("footer keyboard position survives responsive layout changes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const directory = page.locator(".public-footer-navigation");
  await expect(directory).toHaveAttribute("data-compact", "true");
  const summary = directory.getByRole("navigation", { name: "Footer services", exact: true }).locator("summary");
  await summary.focus();
  await page.setViewportSize({ width: 1024, height: 900 });
  const onboarding = directory.getByRole("link", { name: "Merchant onboarding", exact: true });
  await expect(directory).toHaveAttribute("data-compact", "false");
  await expect(onboarding).toBeFocused();
  const payouts = directory.getByRole("link", { name: "Payouts", exact: true });
  await payouts.focus();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(directory).toHaveAttribute("data-compact", "true");
  await expect(payouts).toBeVisible();
  await expect(payouts).toBeFocused();
  await expect(directory.locator("details[open]")).toHaveCount(1);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(directory).toHaveAttribute("data-compact", "false");
  await expect(payouts).toBeFocused();
  // A resize must not move focus into the footer from elsewhere on the page.
  const home = page.getByRole("banner").getByRole("link", { name: "Etail Depot home", exact: true });
  await home.focus();
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(directory).toHaveAttribute("data-compact", "true");
  await expect(home).toBeFocused();
  await expect(directory.locator("details[open]")).toHaveCount(0);
});

test("the complete footer remains usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3100/");
    const directory = page.locator(".public-footer-navigation");
    await expect(directory.getByRole("link")).toHaveCount(22);
    await directory.getByRole("link", { name: "Payouts", exact: true }).click();
    await expect(page).toHaveURL(/\/payouts-and-reconciliation$/);
    await expect(page.getByRole("heading", {level:1})).toBeInViewport();
  } finally { await context.close(); }
});


test("phone industries expand by intent and retain bookmarked workflows", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/software-partners#industries");
  const cards = page.locator(".industry-cases > article > details");
  await expect(cards).toHaveCount(4);
  await expect(page.locator(".industry-cases > article > details[open]")).toHaveCount(0);
  const freight = page.locator("#freight-platforms > details");
  await freight.locator(":scope > summary").focus(); await page.keyboard.press("Enter");
  await expect(freight).toHaveAttribute("open", "");
  await expect(freight.locator(".ec-industry-scope")).toBeVisible();
  await freight.locator(".platform-case-details summary").click();
  await expect(freight.locator(".platform-case-steps li")).toHaveCount(4);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(".industry-cases > article > details[open]")).toHaveCount(4);
  await page.setViewportSize({ width: 320, height: 844 });
  await expect(freight).toHaveAttribute("open", "");
  await page.goto("/software-partners#legal-software");
  await expect(page.locator("#legal-software > details")).toHaveAttribute("open", "");
  await expect(page.locator("#legal-software h3")).toBeInViewport();
  await expect(page.locator("#legal-software .ec-industry-scope")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});


test("scrolling a short phone menu keeps the Back row clear and usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const navigation = await openMainNavigation(page);
  await navigation.evaluate(element => { element.scrollTop = element.scrollHeight; });
  const back = navigation.getByRole("button", { name: "Back", exact: true });
  await expect(back).toBeInViewport();
  const menuBox = (await navigation.boundingBox())!;
  const backBox = (await back.boundingBox())!;
  const point = { x: menuBox.x + menuBox.width - 16, y: backBox.y + backBox.height / 2 };
  // The right side of the Back row must not expose a scrolling destination underneath.
  expect(await back.evaluate((button, { x, y }) => button.contains(document.elementFromPoint(x, y)), point)).toBe(true);
  await page.mouse.click(point.x, point.y);
  await expect(navigation.locator("details[open]")).toHaveCount(0);
  await expect(navigation.locator("summary").filter({ hasText: /^Services$/ })).toBeFocused();
  await expect(navigation.getByRole("link", { name: "Pricing", exact: true })).toBeVisible();
});
