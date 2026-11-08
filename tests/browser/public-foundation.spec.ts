import { expect, test, type Locator, type Page } from "@playwright/test";
import { openFooterGroup } from "./public-footer";
import { expectDecodedBrandMark } from "./brand-marks";
import { closeMainNavigation, openMainNavigation } from "./public-header";


async function expectLoadedNetworkMarks(group: Locator) {
  await expect(group.getByRole("img")).toHaveCount(4);
  for (const network of ["Visa", "Mastercard", "American Express", "Discover"]) {
    const mark = group.getByRole("img", {name:network, exact:true});
    await expectDecodedBrandMark(mark);
  }
}

async function preventMutationRequests(page: Page) {
  const mutations: string[] = [];
  await page.route("**/*", async route => {
    const request = route.request();
    if (["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      await route.continue();
    } else {
      mutations.push(`${request.method()} ${request.url()}`);
      await route.abort("blockedbyclient");
    }
  });
  return mutations;
}

async function openWalletSetup(page: Page) {
  const disclosure = page.locator(".wallet-guide-disclosure");
  const guide = page.locator(".wallet-card-art");
  await expect(disclosure).toHaveCount(1);
  if (page.viewportSize()!.width < 851) {
    await expect(guide).toBeHidden();
    const summary = disclosure.locator("summary");
    await expect(summary).toHaveAccessibleName("View wallet guide");
    await summary.focus();
    await page.keyboard.press("Enter");
  }
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(guide).toBeVisible();
}

test("the shared company header stays consistent and its compact menu works with keyboard, pointer and resizing", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const routes = ["/", "/use-cases/software-platforms", "/use-cases/online-businesses", "/developers/getting-started", "/services/merchant-services", "/services/card-services", "/resources/help", "/resources/guides", "/resources/guides/iso-20022", "/resources/guides/iso-8583/fields/39", "/company/privacy", "/company/terms", "/missing-header-review-page"];
  for (const route of routes) {
    await page.goto(route);
    const header = page.getByRole("banner");
    const home = header.getByRole("link", { name: "Etail Depot home", exact: true });
    await expect(home).toHaveAttribute("href", "/");
    await expect(home).toBeVisible();
    await expect(home.getByRole("img", { name: "Etail Depot", exact: true })).toBeVisible();
    await expect(header).not.toContainText("by Etail Depot");
    await expect(header.getByRole("navigation", { name: "Main navigation", includeHidden: true })).toHaveCount(1);
    const navigation = await openMainNavigation(page);
    await expect(navigation.locator("a")).toHaveCount(29);
    for (const [label, destination] of [["Software platforms", "/use-cases/software-platforms"], ["Online businesses", "/use-cases/online-businesses"], ["Merchant onboarding", "/services/merchant-onboarding"], ["Card services", "/services/card-services"], ["Getting started", "/developers/getting-started"], ["Guides", "/resources/guides"], ["Pricing", "/pricing"]]) {
      await expect(navigation.getByRole("link", { name: label, exact: true, includeHidden: true })).toHaveAttribute("href", destination);
    }
    const current = navigation.locator("[aria-current]");
    if (["/use-cases/software-platforms", "/use-cases/online-businesses", "/developers/getting-started", "/services/card-services", "/resources/guides", "/resources/help"].includes(route)) await expect(current).toHaveAttribute("href", route);
    else if (route.startsWith("/resources/guides/")) {
      await expect(current).toHaveAttribute("href", "/resources/guides");
      await expect(current).toHaveAttribute("aria-current", "location");
    } else await expect(current).toHaveCount(0);
    const action = header.getByRole("link", { name: "Sign in to Trolleys", exact: true });
    await expect(action).toBeVisible();
    await expect(action).toHaveAttribute("href", "https://merchantapp.io/etaildepot/UserAccount/Login");
    await expect(action).toHaveAttribute("referrerpolicy", "no-referrer");
    await expect(action).toHaveAttribute("rel", /\bnoreferrer\b/);
    await expect(header.getByRole("link", { name: "Ask about card services", exact: true })).toHaveCount(0);
    // Let link prefetches settle before the next hard navigation, including in WebKit.
    await page.waitForLoadState("networkidle");
  }

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  const header = page.getByRole("banner");
  const menu = header.getByRole("button", { name: "Menu", exact: true });
  const navigation = header.getByRole("navigation", { name: "Main navigation" });
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
  const controlledId = await menu.getAttribute("aria-controls");
  expect(controlledId).toBeTruthy();
  await expect(page.locator(`[id="${controlledId}"]`)).toHaveCount(1);
  const menuBox = (await menu.boundingBox())!;
  expect(menuBox.width).toBeGreaterThanOrEqual(44);
  expect(menuBox.height).toBeGreaterThanOrEqual(44);

  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(navigation).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(navigation.locator("summary").first()).toBeFocused();
  for (const viewport of [{ width: 390, height: 760 }, { width: 480, height: 760 }, { width: 390, height: 900 }]) {
    await page.setViewportSize(viewport);
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(navigation).toBeVisible();
    await expect(navigation.locator("summary").first()).toBeFocused();
  }
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
  await expect(menu).toBeFocused();

  await page.keyboard.press("Space");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();

  await menu.click();
  await navigation.locator("summary").filter({ hasText: /^Services$/ }).click();
  await navigation.getByRole("link", { name: "Merchant onboarding", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/merchant-onboarding$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
  await expect(header.getByRole("link", { name: "Etail Depot home", exact: true }).getByRole("img", { name: "Etail Depot", exact: true })).toBeVisible();

  await menu.click();
  await page.setViewportSize({ width: 960, height: 900 });
  await expect(menu).toBeHidden();
  await expect(navigation).toBeVisible();
  await expect(navigation.locator("summary").filter({ hasText: /^Services$/ })).toBeFocused();
  await page.setViewportSize({ width: 959, height: 900 });
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
  await expect(menu).toBeFocused();

  await page.keyboard.press("Enter");
  await navigation.locator("summary").filter({ hasText: /^Resources$/ }).click();
  const guides = navigation.getByRole("link", { name: "Guides", exact: true });
  await guides.focus();
  await page.setViewportSize({ width: 960, height: 900 });
  await expect(navigation).toBeVisible();
  await expect(header.locator(".header-menu-toggle")).toHaveAttribute("aria-expanded", "false");
  await expect(guides).toBeFocused();
  await page.setViewportSize({ width: 959, height: 900 });
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
  await expect(menu).toBeFocused();

  const pageAction = page.locator("main").getByRole("link", { name: "Start now", exact: true });
  await pageAction.focus();
  await page.setViewportSize({ width: 960, height: 900 });
  await expect(pageAction).toBeFocused();
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(pageAction).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
  expect(errors).toEqual([]);
});

test("legal documents are reachable without sign-in and retain their search visibility", async ({ page, request }) => {
  const mutations = await preventMutationRequests(page);
  const privateReads: string[] = [];
  page.on("request", request => {
    if (new URL(request.url()).pathname.startsWith("/api/")) privateReads.push(request.url());
  });
  await page.goto("/");
  await page.getByRole("navigation", { name: "Footer legal" }).getByRole("link", { name: "Privacy", exact: true }).click();
  await expect(page).toHaveURL(/\/company\/privacy$/);
  for (const [path, title] of [["/company/privacy", "Website Privacy Policy"], ["/company/terms", "Website Terms of Use"]]) {
    const searchTitle = `${path === "/company/terms" ? "Website Terms of Use" : title} | Etail Depot`;
    if (path === "/company/terms") await page.getByRole("navigation", { name: "Footer legal" }).getByRole("link", { name: "Terms", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title!);
    await expect(page.getByRole("complementary", { name: "Review status" })).toHaveCount(0);
    await expect(page).toHaveTitle(searchTitle);
    expect(await page.title()).not.toMatch(/draft|review/i);
    await expect(page.locator(".legal-document-date")).toHaveText("Last updated November 4, 2026");
    if (path === "/company/privacy") {
      await expect(page.locator("main")).not.toContainText("Order Insight");
      await expect(page.getByRole("link", { name: "Merchant privacy notice", exact: true })).toHaveAttribute("href", "/company/legal/merchant-privacy");
    }
    await expect(page.locator("main")).not.toContainText("integration are not confirmed");
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      await expect(page.locator(selector)).toHaveAttribute("content", searchTitle);
    }
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${path}`);
    await expect(page.locator('form, script[type="application/ld+json"]')).toHaveCount(0);
    expect(await page.locator("main").innerText()).not.toMatch(/\b(draft|demo|sandbox|simulated|fictional)\b|not yet taken effect/i);
    if (path === "/company/privacy") {
      await expect(page.getByRole("region", {name:"Our company and services",exact:true})).toContainText("operates etaildepot.com");
      await expect(page.getByRole("region", {name:"Your choices and privacy requests",exact:true})).toContainText("this website, a merchant account or a card account");
      await expect(page.locator("main .legal-brand, main a[href*=\"trolleys.ai\"]")).toHaveCount(0);
    } else {
      await expect(page.getByRole("region", {name:"About these terms",exact:true})).toContainText("operates this website");
      const agreements = page.getByRole("region", {name:"External websites and service agreements",exact:true});
      await expect(agreements).toContainText("These website terms do not set account fees");
      await expect(agreements.getByRole("link", {name:"Merchant Services Terms",exact:true})).toHaveAttribute("href", "/company/legal/merchant-services");
      await expect(agreements.getByRole("link", {name:"card service disclosures",exact:true})).toHaveAttribute("href", "/services/card-services#card-details");
    }
    const emailDestinations = await page.locator('a[href^="mailto:"]').evaluateAll(links => [...new Set(links.map(link => link.getAttribute("href")))].sort());
    expect(emailDestinations).toEqual(["mailto:compliance@etaildepot.com"]);
    await expect(page.locator("main nav, main .legal-document-contents-mobile")).toHaveCount(0);
    const sectionIds = await page.locator(".legal-document-section > h2").evaluateAll(headings => headings.map(heading => heading.id));
    expect(sectionIds).toContain("contact");
    expect(new Set(sectionIds).size).toBe(sectionIds.length);
    await page.goto(`${path}#contact`);
    await expect(page).toHaveURL(new RegExp(`${path}#contact$`));
    const contacts = page.getByRole("region", { name: "Contact us", exact: true });
    await expect(contacts).toContainText("Washington DC 20036");
    if (path === "/company/privacy") {
      for (const [phone,href] of [["+1 202-449-4962","tel:+12024494962"],["+81 70-3537-2563","tel:+817035372563"]]) {
        await expect(contacts.getByRole("link", { name: phone, exact: true })).toHaveAttribute("href", href);
      }
    }
    for (const email of ["compliance@etaildepot.com"]) {
      await expect(contacts.getByRole("link", { name: email, exact: true })).toHaveAttribute("href", `mailto:${email}`);
    }
    await page.getByRole("link", { name: "Back to top", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  }
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toMatch(/<loc>.*\/(privacy|terms)/);
  expect(privateReads).toEqual([]);
  expect(mutations).toEqual([]);
});

test("a new visitor can review payment eligibility and card inquiries without a local login", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", {level:1})).toHaveText("Merchant services. For your business.");
  const mainNavigation = await openMainNavigation(page);
  await mainNavigation.getByRole("link", {name:"Card services",exact:true}).click();
  await expect(page).toHaveURL(/\/services\/card-services$/);
  await expect(page.getByRole("heading", {level:1})).toHaveText("Secured credit for your digital wallet.");
  await openMainNavigation(page);
  await expect(mainNavigation.getByRole("link",{name:"Card services",exact:true,includeHidden:true})).toHaveAttribute("aria-current","page");
  await closeMainNavigation(page);
  await expect(page.locator("[data-service-note]")).toBeVisible();
  await expect(page.locator("[data-service-note]")).toHaveText("An inquiry is not an application.");
  await expect(page.locator("main form, main input, main textarea, main select")).toHaveCount(0);
  await expect(page.locator("main").getByRole("link", { name: /apply|create|sign in/i })).toHaveCount(0);
  const cardContacts = page.locator("main").getByRole("link", { name: "Ask about card services", exact: true });
  expect(await cardContacts.count()).toBeGreaterThan(0);
  for (const contact of await cardContacts.all()) {
    await expect(contact).toHaveAttribute("href", "/company/contact#cards");
  }
  await openFooterGroup(page, "Services");
  await page.getByRole("navigation",{name:"Footer services"}).getByRole("link",{name:"Merchant onboarding",exact:true}).click();
  await expect(page).toHaveURL(/\/services\/merchant-onboarding$/);
  await page.getByRole("banner").getByRole("link", { name: "Etail Depot home", exact: true }).click();
  await page.locator("main").getByRole("link", { name: "Explore merchant services", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/merchant-services$/);
  await expect(page.getByRole("heading", {level:1})).toHaveText(/^Accept card\s*and ACH payments\.$/);
  await openMainNavigation(page);
  await expect(mainNavigation.locator("summary").filter({hasText:/^Services$/})).toHaveClass("is-current");
  await closeMainNavigation(page);
  await expect(page.locator(".merchant-hero")).toContainText("Credit card processing and ACH for US businesses in USD, with account setup, online checkout and payment reporting.");
  await expect(page.locator(".merchant-hero .ec-hero-actions a").first()).toHaveText("Start now");
  await expect(page.locator(".merchant-hero .ec-hero-actions a").first()).toHaveAttribute("href", "https://merchantapp.io/etaildepot/UserAccount/Login");
  await expect(page.locator(".merchant-hero").getByRole("link", { name: "Discuss your business", exact: true })).toHaveAttribute("href", "/company/contact#payment-review");
  await expectLoadedNetworkMarks(page.getByLabel("Accepted card networks", {exact:true}));
  await expect(page.locator(".merchant-hero")).toContainText("Account approval and setup apply.");
  const paymentEntry = page.locator(".merchant-hero").getByRole("link",{name:"Start now",exact:true});
  await expect(paymentEntry).toHaveAttribute("href", "https://merchantapp.io/etaildepot/UserAccount/Login");
  await expect(paymentEntry).toHaveAttribute("referrerpolicy", "no-referrer");
  await expect(page.locator('a[href^="/login"], a[href^="/cardholder-services"], a[href^="/merchant-services"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("help topics and answers work with a keyboard without sign-in", async ({page}) => {
  await page.goto("/resources/help");
  const support=page.getByRole("region",{name:"Support contacts",exact:true});
  await expect(support.getByRole("heading",{level:2})).toHaveText(["Merchant support","Card inquiries","Help signing in"]);
  for (const [heading,email] of [["Merchant support","trolleys@etaildepot.com"],["Card inquiries","ledgix@etaildepot.com"]]) {
    const contact=support.getByRole("article").filter({has:page.getByRole("heading",{name:heading,exact:true})});
    await expect(contact.getByRole("link",{name:email,exact:true})).toBeVisible();
    await expect(contact.getByRole("link",{name:email,exact:true})).toHaveAttribute("href",`mailto:${email}`);
  }
  const signInCard=support.getByRole("article").filter({has:page.getByRole("heading",{name:"Help signing in",exact:true})});
  await expect(signInCard.getByRole("link")).toHaveCount(1);
  await signInCard.getByRole("link",{name:"Help signing in",exact:true}).click();
  await expect(page).toHaveURL(/\/resources\/help#access$/);
  await expect(page.locator("#access summary").filter({hasText:"Where do I sign in to my merchant account?"})).toBeVisible();
  await expect(page.locator(".help-support-notes").getByRole("link",{name:"compliance@etaildepot.com",exact:true})).toHaveAttribute("href","mailto:compliance@etaildepot.com");
  expect(await support.evaluate(element=>(element.compareDocumentPosition(document.querySelector(".public-questions")!)&Node.DOCUMENT_POSITION_FOLLOWING)!==0)).toBe(true);
  await expect(page.locator("details[open]")).toHaveCount(0);
  await page.getByRole("navigation",{name:"Help topics"}).getByRole("link",{name:"Card services",exact:true}).click();
  await expect(page).toHaveURL(/\/resources\/help#cards$/);
  const question=page.locator("summary").filter({hasText:"What kind of credit card is it?"});
  await question.focus();await page.keyboard.press("Enter");
  await expect(question.locator("..")).toHaveAttribute("open","");
  await expect(question.locator("..")).toContainText("Ledgix credit card is a virtual Visa secured credit card");
  await expect(question.locator("..")).not.toContainText("Applications are not open");
  await expect(question.locator("..")).toContainText("A security deposit backs the account, and purchases are repaid separately.");
  await page.keyboard.press("Enter");
  await expect(question.locator("..")).not.toHaveAttribute("open","");
  await page.getByRole("navigation",{name:"Help topics"}).getByRole("link",{name:"Help signing in"}).click();
  await expect(page).toHaveURL(/\/resources\/help#access$/);
  const recovery=page.locator("summary").filter({hasText:"I can’t sign in. What should I do?"});
  await recovery.focus();await page.keyboard.press("Enter");
  await expect(recovery.locator("..")).toContainText("If Welcome says your email is already registered, choose Sign In.");
  await expect(recovery.locator("..")).toContainText("follow the account recovery instructions or contact");
  await expect(recovery.locator("..").getByRole("link",{name:"trolleys@etaildepot.com"})).toHaveAttribute("href","mailto:trolleys@etaildepot.com");
  await openMainNavigation(page);
  await expect(page.getByRole("banner").getByRole("link",{name:"Sign in to Trolleys",exact:true})).toHaveAttribute("href", "https://merchantapp.io/etaildepot/UserAccount/Login");
});

test("public pages have unique canonical metadata and no private data", async ({page,request}) => {
  const titles=new Set<string>();
  for (const route of ["/","/use-cases/software-platforms","/services/card-services","/services/merchant-services","/resources/help"]) {
    await page.goto(route);
    titles.add(await page.title());
    if (route === "/use-cases/software-platforms") {
      await expect(page).toHaveTitle(/(?:Software|Platforms|Partners)/i);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /software/i);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /merchants?|businesses/i);
    }
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(new URL((await canonical.getAttribute("href"))!).href).toBe(`https://etaildepot.com${route}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content",/.{50,}/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
    await expect(page.getByRole("heading",{level:1})).toHaveCount(1);
    const data = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    expect(data["@graph"].find((node: { "@type": string }) => node["@type"] === "WebPage").url).toBe(`https://etaildepot.com${route}`);
    // The checkout has a labeled public specimen, not a signed-in customer record.
    // Keep the historical private-data guard on every other part of the page.
    const editorialText = await page.locator("main").evaluate(element => {
      const copy = element.cloneNode(true) as HTMLElement;
      copy.querySelectorAll(".unified-preview").forEach(preview => preview.remove());
      return copy.textContent ?? "";
    });
    expect(editorialText).not.toMatch(/Visa prepaid card|prepaid Visa card/i);
    if (route === "/services/card-services" || route === "/resources/help") {
      expect(editorialText).toContain("Visa secured credit card");
    }
    expect(editorialText).not.toMatch(/Alex Morgan|Jamie Morgan|personId|cardId|canonical|projection|idempotency|sandbox|demo|practice (?:mode|payment)|fixture/i);
    await expect(page.locator(".sandbox-badge")).toHaveCount(0);
    await expect(page.getByRole("banner")).not.toContainText(/\bsandbox\b/i);
    await openFooterGroup(page, "Resources");
    await expect(page.getByRole("contentinfo").getByRole("link", {name:"Help center",exact:true})).toBeVisible();
  }
  expect(titles.size).toBe(5);
  const sitemap=await request.get("/sitemap.xml");expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("<loc>");
  const robots=await request.get("/robots.txt");expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Disallow: /api/");
  await page.goto("/login");
  await expect(page).toHaveURL(/\/resources\/help#access$/);
  await expect(page.locator(".sandbox-badge")).toHaveCount(0);
  await expect(page.getByRole("banner")).not.toContainText(/\bsandbox\b/i);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/resources/help");
  const image=await request.get("/opengraph-image");expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toBe("image/png");
});


test("payment previews stay local and the provider handoff drops visitor data", async ({page, baseURL}) => {
  const mutations: string[] = [], privateReads: string[] = [], externalRequests: string[] = [], errors: string[] = [];
  const providerRequests: {url:string;method:string;referer:string|null}[] = [];
  const origin = new URL(baseURL!).origin;
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", async route => {
    const request = route.request(), url = new URL(request.url());
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      mutations.push(request.method() + " " + request.url());
      await route.abort("blockedbyclient");
    } else if (url.origin === "https://merchantapp.io") {
      // Capture navigation locally; never contact a real provider account.
      if (!request.isNavigationRequest()) { await route.fulfill({status:204,body:""}); return; }
      providerRequests.push({url:request.url(), method:request.method(), referer:await request.headerValue("referer")});
      await route.fulfill({status:200,contentType:"text/html",body:"<html><head><title>Captured handoff</title></head><body><h1>Payment service handoff captured</h1></body></html>"});
    } else if (/^\/api(?:\/|$)/.test(url.pathname)) {
      privateReads.push(request.url());
      await route.abort("blockedbyclient");
    } else if (url.origin !== origin) {
      externalRequests.push(request.url());
      await route.abort("blockedbyclient");
    } else await route.continue();
  });

  await page.goto("/use-cases/online-businesses?handoff_probe=public-example-check#customer-checkout");
  const explorer = page.locator(".payment-service-explorer");
  const checkout = explorer.locator(".unified-preview");
  await expect(explorer.getByRole("tablist", {name:"Payment journey views", exact:true})).toBeVisible();
  await expect(checkout.locator("form, input, textarea, select, iframe, a, [contenteditable=true]")).toHaveCount(0);
  await expect(checkout.getByRole("button", {name:/pay|submit|confirm/i})).toHaveCount(0);
  await expect(checkout.locator(".unified-preview-example-note")).toHaveCount(0);
  await checkout.getByRole("tab", {name:"Bank payment", exact:true}).click();
  await expect(checkout.locator(".unified-preview-bank-note")).toBeVisible();
  await explorer.getByRole("tab", {name:"Card record", exact:true}).click();
  const record = explorer.getByRole("tabpanel", {name:"Card record", exact:true});
  await record.locator("summary").filter({hasText:"Refunds"}).click();
  await expect(record).toContainText("A refund has its own status and reference.");
  await record.locator("summary").filter({hasText:"Disputes"}).click();
  await expect(record).toContainText("A dispute has its own case reference, evidence and response deadline.");
  await explorer.getByRole("tab", {name:"Card payout", exact:true}).click();
  await explorer.getByRole("tabpanel", {name:"Card payout", exact:true}).locator("summary").click();
  await expect(explorer.locator("form, input, textarea, select, iframe, a, [contenteditable=true]")).toHaveCount(0);
  expect(providerRequests).toEqual([]);
  expect(externalRequests).toEqual([]);

  await page.goto("/services/merchant-services?handoff_probe=public-example-check");
  const openTools = page.locator(".merchant-hero").getByRole("link", {name:"Start now", exact:true});
  await expect(openTools).toHaveAttribute("href", "https://merchantapp.io/etaildepot/UserAccount/Login");
  await expect(openTools).toHaveAttribute("referrerpolicy", "no-referrer");
  await expect(openTools).toHaveAttribute("rel", /\bnoreferrer\b/);
  await openTools.focus();
  await expect(openTools).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("https://merchantapp.io/etaildepot/UserAccount/Login");
  await expect(page.getByRole("heading", {name:"Payment service handoff captured",exact:true})).toBeVisible();
  expect(providerRequests).toEqual([{url:"https://merchantapp.io/etaildepot/UserAccount/Login",method:"GET",referer:null}]);
  expect(mutations).toEqual([]);
  expect(privateReads).toEqual([]);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("payment artwork and original checkout marks fit a 320px screen", async ({page}) => {
  await page.setViewportSize({width:320,height:900});
  const mutations = await preventMutationRequests(page);
  for (const path of ["/", "/use-cases/software-platforms", "/services/merchant-services"]) {
    await page.goto(path);
    const art = path === "/services/merchant-services" ? page.locator(".ec-reconciliation-art") : page.locator(path === "/" ? "[data-company-art]" : "[data-attention-art=platform]");
    await expect(art).toBeVisible();
    if (path === "/") {
      const symbol = art.locator('.brand-image-symbol');
      await expect(symbol).toHaveCount(1);
      await expect(symbol).toHaveCSS("aspect-ratio", "800 / 484");
      expect(await symbol.evaluate(mark => getComputedStyle(mark).content.startsWith('url("data:image/png;base64,'))).toBe(true);
      await expectDecodedBrandMark(symbol);
    } else if (path === "/use-cases/software-platforms") {
      await expect(art).toHaveAccessibleName(/Commerce, freight, travel and legal software connect their business records.*Access and account structure depend on the approved integration/);
      await expect(art).toContainText("Account setup");
    } else {
      await expect(art).toContainText("#10482");
      await expect(art).toContainText("$100.00");
      await expect(art).toContainText("$96.80");
      await expect(art).toContainText("$3.20");
      await expect(art).toContainText("Before other fees and adjustments.");
      await expect(art).toContainText("Confirm against your bank statement.");
      const payment = page.locator(".cw-merchant-art");
      await expect(payment).toContainText("Designer sneaker");
      await expect(payment).toContainText("Captured");
      await expect(payment).toContainText("Match the report to the bank deposit.");
    }
    await expect(art.locator("form, input, textarea, select, button, a")).toHaveCount(0);
    const bounds = (await art.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
    if (path === "/services/merchant-services") {
      expect(await art.evaluate(node => node.scrollWidth > node.clientWidth + 1)).toBe(false);
    } else {
      // Every readable record and caption must remain fully contained.
      for (const record of await art.locator("[data-art-record]").all()) {
        const recordBounds = (await record.boundingBox())!;
        expect(recordBounds.x).toBeGreaterThanOrEqual(bounds.x);
        expect(recordBounds.x + recordBounds.width).toBeLessThanOrEqual(bounds.x + bounds.width + 1);
        expect(await record.evaluate(node => node.scrollWidth > node.clientWidth + 1)).toBe(false);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  }

  await page.goto("/use-cases/online-businesses");
  const explorer = page.locator(".payment-service-explorer");
  const checkout = explorer.locator(".unified-preview");
  await expectLoadedNetworkMarks(checkout.getByRole("group", {name:"Card networks", exact:true}));
  for (const wallet of ["Apple Pay", "Google Pay"]) {
    await expectDecodedBrandMark(checkout.getByRole("img", {name:wallet, exact:true}));
  }
  async function expectContainedArtwork() {
    const overflow = await explorer.evaluate(node => ({
      document: document.documentElement.scrollWidth > window.innerWidth,
      explorer: node.scrollWidth > node.clientWidth + 1,
      artwork: [...node.querySelectorAll<HTMLElement>(".pse-panel, .unified-preview, .unified-preview-summary, .unified-preview-payment, .pse-record, .pse-payout")]
        .filter(element => element.getClientRects().length > 0)
        .some(element => element.scrollWidth > element.clientWidth + 1),
    }));
    expect(overflow).toEqual({document:false,explorer:false,artwork:false});
    for (const control of await explorer.locator("button:visible, summary:visible").all()) {
      const bounds = (await control.boundingBox())!;
      expect(bounds.height).toBeGreaterThanOrEqual(44);
      expect(bounds.width).toBeGreaterThanOrEqual(44);
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
    }
  }
  await expectContainedArtwork();
  await checkout.getByRole("tab", {name:"Bank payment", exact:true}).click();
  await expectContainedArtwork();
  for (const name of ["Card record", "Card payout"]) {
    await explorer.getByRole("tab", {name, exact:true}).click();
    await expect(explorer.getByRole("tabpanel", {name, exact:true})).toBeVisible();
    await expectContainedArtwork();
  }
  expect(mutations).toEqual([]);
});

test("the wallet setup guide explains both platforms without opening wallets or changing accounts", async ({page, context, baseURL}) => {
  const mutations: string[] = [], privateReads: string[] = [], externalRequests: string[] = [], errors: string[] = [];
  const origin = new URL(baseURL!).origin;
  page.on("pageerror", error => errors.push(error.message));
  await context.route("**/*", async route => {
    const request = route.request(), url = new URL(request.url());
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      mutations.push(`${request.method()} ${request.url()}`);
      await route.abort("blockedbyclient");
    } else if (/^\/api(?:\/|$)/.test(url.pathname)) {
      privateReads.push(request.url());
      await route.abort("blockedbyclient");
    } else if (url.origin !== origin) {
      externalRequests.push(request.url());
      await route.abort("blockedbyclient");
    } else await route.continue();
  });

  for (const path of ["/services/card-services"]) {
    await page.goto(path);
    await openWalletSetup(page);
    const guide = page.locator(".wallet-card-art");
    await expect(guide).toHaveCount(1);
    const tablist = guide.getByRole("tablist", {name:"Wallet preview options", exact:true});
    const apple = tablist.getByRole("tab", {name:"Apple Wallet", exact:true});
    const google = tablist.getByRole("tab", {name:"Google Wallet", exact:true});
    await expect(tablist.getByRole("tab")).toHaveCount(2);
    const logo = guide.locator('.ledgix-wallet-card-logo').first();
    await expectDecodedBrandMark(logo);

    const steps = ["Show step 1: Add card", "Show step 2: Verify", "Show step 3: Use wallet"];
    async function expectStep(platform: "Apple Wallet" | "Google Wallet", step: number) {
      const selected = platform === "Apple Wallet" ? apple : google;
      const other = platform === "Apple Wallet" ? google : apple;
      await expect(selected).toHaveAttribute("aria-selected", "true");
      await expect(selected).toHaveAttribute("tabindex", "0");
      await expect(other).toHaveAttribute("aria-selected", "false");
      await expect(other).toHaveAttribute("tabindex", "-1");
      const panel = guide.getByRole("tabpanel");
      await expect(panel).toBeVisible();
      await expect(panel).toHaveAttribute("aria-labelledby", (await selected.getAttribute("id"))!);
      await expect(panel.getByRole("button")).toHaveCount(3);
      for (const [index, name] of steps.entries()) {
        await expect(panel.getByRole("button", {name, exact:true})).toHaveAttribute("aria-pressed", String(index === step));
      }
      const expected = step === 0 ? (platform === "Apple Wallet" ? "Debit or Credit Card" : "Payment card")
        : step === 1 ? "issuer" : platform === "Apple Wallet" ? "Apple Pay" : "Google Pay";
      await expect(panel.locator(".wallet-setup-description")).toContainText(expected);
      await expect(guide.locator("form, input, textarea, select, iframe")).toHaveCount(0);
      await expect(page).toHaveURL(new URL(path, origin).href);
      expect(context.pages()).toHaveLength(1);
    }

    await expectStep("Apple Wallet", 0);
    for (const [index, name] of steps.entries()) {
      await guide.getByRole("tabpanel").getByRole("button", {name, exact:true}).click();
      await expectStep("Apple Wallet", index);
    }
    await apple.focus();
    await page.keyboard.press("ArrowRight");
    await expect(google).toBeFocused();
    await expectStep("Google Wallet", 0);
    for (const [index, name] of steps.entries()) {
      await guide.getByRole("tabpanel").getByRole("button", {name, exact:true}).click();
      await expectStep("Google Wallet", index);
    }
    await google.focus();
    await page.keyboard.press("ArrowRight");
    await expect(apple).toBeFocused();
    await expectStep("Apple Wallet", 0);
    await page.keyboard.press("ArrowLeft");
    await expect(google).toBeFocused();
    await expectStep("Google Wallet", 0);
    await page.keyboard.press("Home");
    await expect(apple).toBeFocused();
    await expectStep("Apple Wallet", 0);
    await page.keyboard.press("End");
    await expect(google).toBeFocused();
    await expectStep("Google Wallet", 0);
    if (page.viewportSize()!.width < 851) {
      const summary = page.locator(".wallet-guide-disclosure summary");
      await expect(summary).toHaveAccessibleName("Hide wallet guide");
      await summary.focus();
      await page.keyboard.press("Space");
      await expect(guide).toBeHidden();
      await expect(summary).toHaveAccessibleName("View wallet guide");
      await page.keyboard.press("Enter");
      await expect(guide).toBeVisible();
      await expectStep("Google Wallet", 0);
    }
  }
  expect(mutations).toEqual([]);
  expect(privateReads).toEqual([]);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("a wallet preview opened before hydration keeps the visitor's choice", async ({ page, baseURL }) => {
  test.skip(page.viewportSize()!.width >= 851, "The mobile disclosure begins closed.");
  const origin = new URL(baseURL!).origin;
  const externalRequests: string[] = [];
  const mutations: string[] = [];
  let releaseScripts!: () => void;
  let scriptRequested!: () => void;
  const heldScripts = new Promise<void>(resolve => { releaseScripts = resolve; });
  const requestedScript = new Promise<void>(resolve => { scriptRequested = resolve; });
  await page.route("**/*", async route => {
    const request = route.request();
    if (new URL(request.url()).origin !== origin) {
      externalRequests.push(request.url());
      await route.abort("blockedbyclient");
      return;
    }
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      mutations.push(`${request.method()} ${request.url()}`);
      await route.abort("blockedbyclient");
      return;
    }
    if (request.resourceType() === "script") {
      scriptRequested();
      await heldScripts;
    }
    await route.continue();
  });
  try {
    // Commit avoids waiting for deferred scripts: only native HTML behavior is available here.
    await page.goto("/services/card-services", { waitUntil: "commit" });
    await requestedScript;
    const disclosure = page.locator(".wallet-guide-disclosure");
    const summary = disclosure.locator("summary");
    const guide = page.locator(".wallet-card-art");
    await expect(guide).toBeHidden();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(guide).toBeVisible();

    releaseScripts();
    await page.waitForLoadState("load");
    const google = guide.getByRole("tab", { name: "Google Wallet", exact: true });
    await google.click({ timeout: 5_000 });
    await expect(google).toHaveAttribute("aria-selected", "true");
    await expect(disclosure).toHaveAttribute("open", "");
    await expect(summary).toHaveAccessibleName("Hide wallet guide");
    // Hydration and viewport changes must preserve that explicit native choice.
    await page.setViewportSize({ width: 1000, height: 844 });
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(guide).toBeVisible();
    await summary.click();
    await expect(guide).toBeHidden();
    await summary.click();
    await expect(guide).toBeVisible();
    await expect(google).toHaveAttribute("aria-selected", "true");
    expect(externalRequests).toEqual([]);
    expect(mutations).toEqual([]);
  } finally {
    releaseScripts();
    await page.unrouteAll({ behavior: "wait" });
  }
});

test("switching wallets never shows the previous payment mark while the new logo loads", async ({page}) => {
  for (const path of ["/services/card-services"]) {
    let releaseLogo!: () => void;
    let requestedLogo!: () => void;
    const heldLogo = new Promise<void>(resolve => { releaseLogo = resolve; });
    const logoRequested = new Promise<void>(resolve => { requestedLogo = resolve; });
    await page.route(/\/_next\/static\/media\/google-pay\.[^/]+\.svg$/, async route => {
      requestedLogo();
      await heldLogo;
      await route.continue();
    });
    try {
      await page.goto(path, {waitUntil:"domcontentloaded"});
      await openWalletSetup(page);
      const guide = page.locator(".wallet-card-art");
      const apple = guide.getByRole("tab", {name:"Apple Wallet", exact:true});
      const google = guide.getByRole("tab", {name:"Google Wallet", exact:true});
      const visibleMark = guide.locator(".wallet-setup-pay-mark img:visible");
      await expect.poll(() => visibleMark.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      const previousMark = await visibleMark.elementHandle();
      await google.click();
      await expect(google).toHaveAttribute("aria-selected", "true");
      await expect(visibleMark).toHaveCount(1);
      await expect(visibleMark).toHaveAttribute("src", /\/_next\/static\/media\/google-pay\.[^/]+\.svg$/);
      await logoRequested;
      expect(await visibleMark.evaluate((img: HTMLImageElement) => img.complete)).toBe(false);
      // Do not reuse the decoded Apple image for a still-loading Google source.
      expect(await visibleMark.evaluate((img, previous) => img === previous, previousMark)).toBe(false);
      expect(await visibleMark.evaluate((img: HTMLImageElement) => img.currentSrc)).not.toContain("apple-pay.");
      await apple.click();
      await expect(apple).toHaveAttribute("aria-selected", "true");
      releaseLogo();
      await page.waitForLoadState("load");
      expect(await visibleMark.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain("apple-pay.");
      await google.click();
      await expect(google).toHaveAttribute("aria-selected", "true");
      await expect.poll(() => visibleMark.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);

      for (const tab of [apple, google, apple, google]) {
        await tab.click();
        await expect(tab).toHaveAttribute("aria-selected", "true");
        const mark = tab === apple ? "apple-pay" : "google-pay";
        expect(await visibleMark.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname)).toMatch(new RegExp(`^/_next/static/media/${mark}\\.[^/]+\\.svg$`));
        await expect(guide.getByRole("button", {name:"Show step 1: Add card", exact:true})).toHaveAttribute("aria-pressed", "true");
      }
    } finally {
      releaseLogo();
      await page.unrouteAll({behavior:"wait"});
    }
  }
});


test("mobile menu presents one level, keeps actions reachable and restores the page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/use-cases/software-platforms");
  const header = page.getByRole("banner");
  const toggle = header.getByRole("button", { name: "Menu", exact: true });
  const nav = header.getByRole("navigation", { name: "Main navigation" });
  await toggle.click();
  await expect(header.getByRole("dialog", { name: "Site menu" })).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await expect(page.locator("footer")).toHaveAttribute("inert", "");
  const services = nav.locator("summary").filter({ hasText: /^Services$/ });
  const platforms = nav.locator("summary").filter({ hasText: /^Use cases$/ });
  await services.click();
  await expect(platforms).toBeHidden();
  await expect(nav.getByRole("link", { name: "Pricing", exact: true })).toBeHidden();
  const back = nav.getByRole("button", { name: "Back", exact: true });
  await back.click();
  await expect(services).toBeFocused();
  await expect(platforms).toBeVisible();
  await expect(back).toBeHidden();

  for (const viewport of [{ width: 320, height: 568 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await services.click();
    const onboarding = nav.getByRole("link", { name: "Card services", exact: true });
    await onboarding.scrollIntoViewIfNeeded();
    const box = (await onboarding.boundingBox())!;
    const actions = (await header.locator(".header-actions").boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(actions.y + 1);
    expect(actions.y + actions.height).toBeLessThanOrEqual(viewport.height + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    await back.click();
  }

  const contact = header.getByRole("link", { name: "Contact sales", exact: true });
  const home = header.getByRole("link", { name: "Etail Depot home", exact: true });
  await contact.focus();
  await page.keyboard.press("Tab");
  await expect(home).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(contact).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("main")).not.toHaveAttribute("inert");
  await expect(page.locator("footer")).not.toHaveAttribute("inert");
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");

  await toggle.click();
  await services.click();
  await back.focus();
  await page.setViewportSize({ width: 960, height: 900 });
  await expect(services).toBeFocused();
  await expect(back).toBeHidden();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toggle).toBeFocused();
  await toggle.click();
  await expect(back).toBeHidden();
  await expect(platforms).toBeVisible();
  await header.getByRole("link", { name: "Contact sales", exact: true }).click();
  await expect(page).toHaveURL(/\/company\/contact$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("main")).not.toHaveAttribute("inert");
});


test("mobile navigation preserves the reading position and leaves reference navigation visible", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", "/use-cases/software-platforms", "/resources/guides/iso-8583/fields"]) {
    await page.goto(path);
    const header = page.getByRole("banner");
    const toggle = header.getByRole("button", { name: "Menu", exact: true });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: "instant" }));
    const initialScroll = await page.evaluate(() => window.scrollY);
    const headerBox = (await header.boundingBox())!;
    expect(Math.abs(headerBox.y)).toBeLessThanOrEqual(1);
    const buttonBox = (await toggle.boundingBox())!;
    // Use the visible control without the locator's automatic scroll into view.
    await page.mouse.click(buttonBox.x + buttonBox.width / 2, buttonBox.y + buttonBox.height / 2);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await header.getByRole("navigation", { name: "Main navigation" }).locator("summary").filter({ hasText: /^Services$/ }).click();
    await header.getByRole("button", { name: "Back", exact: true }).click();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(initialScroll);
    const index = page.locator(".reference-index");
    if (await index.count()) {
      expect((await index.boundingBox())!.y).toBeGreaterThanOrEqual(headerBox.height - 1);
    }
  }
});


test("account actions remain distinct and reachable across mobile menu and desktop breakpoints", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const menu = header.getByRole("button", { name: "Menu", exact: true });
  const start = header.getByRole("link", { name: "Start now", exact: true });
  const signIn = header.getByRole("link", { name: "Sign in to Trolleys", exact: true });
  const contact = header.getByRole("link", { name: "Contact sales", exact: true });
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    const footerSignIn = await page.locator(".public-footer-sign-in").boundingBox();
    expect(footerSignIn!.width).toBeGreaterThanOrEqual(44);
    expect(footerSignIn!.height).toBeGreaterThanOrEqual(44);
    await expect(start).toBeHidden();
    await expect(signIn).toBeHidden();
    await menu.click();
    for (const link of [start, signIn, contact]) {
      await expect(link).toBeInViewport({ ratio: 1 });
      const box = await link.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    await expect(start).toHaveAccessibleDescription("Your application opens in Trolleys, an Etail Depot service. Enter your email on Welcome to create or continue your account. Merchant account approval is required.");
    await expect(signIn).toHaveAccessibleDescription("Trolleys is an Etail Depot service. Enter your email on the welcome page to access your merchant account.");
    await expect(page.locator("main")).toHaveAttribute("inert", "");
    await start.focus();
    await page.keyboard.press("Tab");
    await expect(signIn).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(contact).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(page.locator("main")).not.toHaveAttribute("inert", "");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  }
  await menu.click();
  await start.focus();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(start).toBeHidden();
  await expect(signIn).toBeFocused();
  await expect(contact).toBeVisible();
  await expect(menu).toBeHidden();
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Sign in to Trolleys", exact: true })).toHaveAttribute("href", "https://merchantapp.io/etaildepot/UserAccount/Login");
});
