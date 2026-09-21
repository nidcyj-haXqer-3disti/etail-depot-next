import { expect, test, type Locator, type Page } from "@playwright/test";
import { openMainNavigation } from "./public-header";

async function expectLoadedNetworkMarks(group: Locator) {
  await expect(group.getByRole("img")).toHaveCount(4);
  for (const network of ["Visa", "Mastercard", "American Express", "Discover"]) {
    const mark = group.getByRole("img", {name:network, exact:true});
    await expect(mark).toBeVisible();
    await expect.poll(() => mark.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)).toBe(true);
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
    await expect(summary).toHaveAccessibleName("View wallet setup");
    await summary.focus();
    await page.keyboard.press("Enter");
  }
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(guide).toBeVisible();
}

test("the shared company header stays consistent and its compact menu works with keyboard, pointer and resizing", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const routes = ["/", "/payment-services", "/card-services", "/help", "/privacy", "/terms", "/missing-header-review-page"];
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
    await expect(navigation.getByRole("link")).toHaveText(["Payments", "Cards", "Help"]);
    for (const [index, destination] of ["/payment-services", "/card-services", "/help"].entries()) {
      await expect(navigation.getByRole("link").nth(index)).toHaveAttribute("href", destination);
    }
    const current = navigation.locator('[aria-current="page"]');
    if (["/payment-services", "/card-services", "/help"].includes(route)) await expect(current).toHaveAttribute("href", route);
    else await expect(current).toHaveCount(0);
    const action = header.getByRole("link", { name: "Open Trolleys", exact: true });
    await expect(action).toBeVisible();
    await expect(action).toHaveAttribute("href", "https://trolleys.ai");
    await expect(action).toHaveAttribute("referrerpolicy", "no-referrer");
    await expect(action).toHaveAttribute("rel", /\bnoreferrer\b/);
    await expect(header.getByRole("link", { name: "Contact Ledgix", exact: true })).toHaveCount(0);
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
  await expect(navigation.getByRole("link").first()).toBeFocused();
  for (const viewport of [{ width: 390, height: 760 }, { width: 480, height: 760 }, { width: 390, height: 900 }]) {
    await page.setViewportSize(viewport);
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole("link").first()).toBeFocused();
  }
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
  await expect(menu).toBeFocused();

  await page.keyboard.press("Space");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("heading", { level: 1 }).click();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();

  await menu.click();
  await navigation.getByRole("link", { name: "Payments", exact: true }).click();
  await expect(page).toHaveURL(/\/payment-services$/);
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
  await expect(header.getByRole("link", { name: "Etail Depot home", exact: true }).getByRole("img", { name: "Etail Depot", exact: true })).toBeVisible();

  await menu.click();
  await page.setViewportSize({ width: 960, height: 900 });
  await expect(menu).toBeHidden();
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Payments", exact: true })).toBeFocused();
  await page.setViewportSize({ width: 959, height: 900 });
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
  await expect(menu).toBeFocused();

  await page.keyboard.press("Enter");
  const help = navigation.getByRole("link", { name: "Help", exact: true });
  await help.focus();
  await page.setViewportSize({ width: 960, height: 900 });
  await expect(navigation).toBeVisible();
  await expect(help).toBeFocused();
  await page.setViewportSize({ width: 959, height: 900 });
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
  await expect(menu).toBeFocused();

  const pageAction = page.locator(".consumer-hero-actions").getByRole("link", { name: "Get started with Trolleys", exact: true });
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
  await expect(page).toHaveURL(/\/privacy$/);
  for (const [path, title] of [["/privacy", "Privacy Policy"], ["/terms", "Terms of Use"]]) {
    if (path === "/terms") await page.getByRole("navigation", { name: "Legal documents" }).getByRole("link", { name: "Terms", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title!);
    await expect(page.getByRole("complementary", { name: "Review status" })).toHaveCount(0);
    await expect(page).toHaveTitle(new RegExp(`^${title}`));
    expect(await page.title()).not.toMatch(/draft|review/i);
    await expect(page.locator(".legal-document-date")).toHaveText("Last updated September 21, 2026");
    await expect(page.locator("main")).toContainText("live Order Insight integration");
    await expect(page.locator("main")).not.toContainText("integration are not confirmed");
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      await expect(page.locator(selector)).toHaveAttribute("content", title!);
    }
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etail-depot-next.netlify.app${path}`);
    await expect(page.locator('form, script[type="application/ld+json"]')).toHaveCount(0);
    expect(await page.locator("main").innerText()).not.toMatch(/\b(draft|demo|sandbox|simulated|fictional)\b|not yet taken effect/i);
    await expect(page.getByRole("region",{name:path === "/privacy" ? "Our company and services" : "Our company and these terms",exact:true})).toContainText("forthcoming Ledgix card service");
    if (path === "/privacy") {
      await expect(page.getByRole("region",{name:"Your choices and privacy requests",exact:true})).toContainText("this website, Ledgix or Trolleys");
    } else {
      await expect(page.getByRole("region",{name:"Trolleys · Payments",exact:true})).toContainText("do not create a payment request or record a transaction");
    }
    const cards = page.locator(".legal-brand").filter({ hasText: "Etail Depot US, Inc. DBA Ledgix" });
    await expect(cards).toContainText("ledgix.com · Coming soon");
    await expect(cards.getByRole("link")).toHaveCount(0);
    await expect(page.locator(".legal-brand").filter({ hasText: "Etail Depot US, Inc. DBA Trolleys" }).getByRole("link")).toHaveAttribute("href", "https://trolleys.ai");
    const emailDestinations = await page.locator('a[href^="mailto:"]').evaluateAll(links => [...new Set(links.map(link => link.getAttribute("href")))].sort());
    expect(emailDestinations).toEqual(["mailto:compliance@etaildepot.com", "mailto:ledgix@etaildepot.com", "mailto:trolleys@etaildepot.com"]);
    const mobileContents = page.locator("summary").filter({ hasText: "On this page" });
    if (await mobileContents.isVisible()) {
      await mobileContents.focus();
      await page.keyboard.press("Enter");
      await expect(mobileContents.locator("..")).toHaveAttribute("open", "");
    }
    const contents = page.getByRole("navigation", { name: "On this page" });
    for (const link of await contents.getByRole("link").all()) {
      const destination = (await link.getAttribute("href"))!;
      await expect(page.locator(destination)).toHaveCount(1);
    }
    await contents.getByRole("link", { name: "Contact us", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}#contact$`));
    const contacts = page.getByRole("region", { name: "Contact us", exact: true });
    await expect(contacts).toContainText("Washington, DC");
    for (const email of ["ledgix@etaildepot.com", "trolleys@etaildepot.com", "compliance@etaildepot.com"]) {
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

test("a new visitor can compare available payments and upcoming cards without a local login", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", {level:1})).toHaveText(/^Get paid\.\s*Keep going\.$/);
  await expectLoadedNetworkMarks(page.getByLabel("Accepted card networks", {exact:true}));
  const mainNavigation = await openMainNavigation(page);
  await mainNavigation.getByRole("link", {name:"Cards",exact:true}).click();
  await expect(page).toHaveURL(/\/card-services$/);
  await expect(page.getByRole("heading", {level:1})).toHaveText(/^Secured credit\.\s*Made for your wallet\.$/);
  await openMainNavigation(page);
  await expect(mainNavigation.getByRole("link",{name:"Cards",exact:true})).toHaveAttribute("aria-current","page");
  await expect(page.locator("main")).toContainText("Coming soon");
  await expect(page.locator("main")).toContainText("Applications are not open yet.");
  for (const contact of await page.locator("main").getByRole("link",{name:"Contact Ledgix",exact:true}).all()) {
    await expect(contact).toHaveAttribute("href", "mailto:ledgix@etaildepot.com");
  }
  await mainNavigation.getByRole("link",{name:"Payments",exact:true}).click();
  await expect(page).toHaveURL(/\/payment-services$/);
  await expect(page.getByRole("heading", {level:1})).toHaveText(/^Accept payments\.\s*Your way\.$/);
  await openMainNavigation(page);
  await expect(mainNavigation.getByRole("link",{name:"Payments",exact:true})).toHaveAttribute("aria-current","page");
  await expect(page.locator("main")).toContainText("Available now");
  const paymentEntry = page.locator(".consumer-hero-actions").getByRole("link",{name:"Get started with Trolleys",exact:true});
  await expect(paymentEntry).toHaveAttribute("href", "https://trolleys.ai");
  await expect(paymentEntry).toHaveAttribute("referrerpolicy", "no-referrer");
  await expect(page.locator('a[href^="/login"], a[href^="/cardholder-services"], a[href^="/merchant-services"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("help topics and answers work with a keyboard without sign-in", async ({page}) => {
  await page.goto("/help");
  await page.getByRole("navigation",{name:"Help topics"}).getByRole("link",{name:"Ledgix cards"}).click();
  await expect(page).toHaveURL(/\/help#cards$/);
  const question=page.locator("summary").filter({hasText:"Can I apply for a card now?"});
  await question.focus();await page.keyboard.press("Enter");
  await expect(question.locator("..")).toHaveAttribute("open","");
  await expect(question.locator("..")).toContainText("Digital Wallet Card is an upcoming virtual Visa secured credit card");
  await expect(question.locator("..")).toContainText("Applications and card sign-in are not open yet.");
  await page.keyboard.press("Enter");
  await expect(question.locator("..")).not.toHaveAttribute("open","");
  await page.getByRole("navigation",{name:"Help topics"}).getByRole("link",{name:"Sign-in help"}).click();
  await expect(page).toHaveURL(/\/help#access$/);
  const recovery=page.locator("summary").filter({hasText:"What if I cannot sign in to Trolleys?"});
  await recovery.focus();await page.keyboard.press("Enter");
  await expect(recovery.locator("..")).toContainText("Follow the recovery instructions supplied with your Trolleys account");
  await expect(recovery.locator("..").getByRole("link",{name:"trolleys@etaildepot.com"})).toHaveAttribute("href","mailto:trolleys@etaildepot.com");
  await openMainNavigation(page);
  await expect(page.getByRole("banner").getByRole("link",{name:"Open Trolleys",exact:true})).toHaveAttribute("href", "https://trolleys.ai");
});

test("public pages have unique canonical metadata and no private data", async ({page,request}) => {
  const titles=new Set<string>();
  for (const route of ["/","/card-services","/payment-services","/help"]) {
    await page.goto(route);
    titles.add(await page.title());
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(new URL((await canonical.getAttribute("href"))!).href).toBe(`https://etail-depot-next.netlify.app${route}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content",/.{50,}/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
    await expect(page.getByRole("heading",{level:1})).toHaveCount(1);
    const data=JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    expect(data["@graph"].find((node: { "@type": string }) => node["@type"] === "WebPage").url).toBe(`https://etail-depot-next.netlify.app${route}`);
    const editorialText = (await page.locator("main").textContent()) ?? "";
    // Marketing describes the hosted services, never the local prototype's balances or controls.
    expect(editorialText).not.toMatch(/Visa prepaid card|prepaid Visa card/i);
    if (route === "/" || route === "/card-services" || route === "/help") {
      expect(editorialText).toContain("Visa secured credit card");
    }
    expect(editorialText).not.toMatch(/Alex Morgan|Jamie Morgan|personId|cardId|canonical|projection|idempotency|sandbox|demo|practice|fixture/i);
    await expect(page.locator(".sandbox-badge")).toHaveCount(0);
    await expect(page.getByRole("banner")).not.toContainText(/\bsandbox\b/i);
    await expect(page.getByRole("contentinfo").getByRole("link", {name:"Help center"})).toBeVisible();
  }
  expect(titles.size).toBe(4);
  const sitemap=await request.get("/sitemap.xml");expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("<loc>");
  const robots=await request.get("/robots.txt");expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Disallow: /api/");
  await page.goto("/login");
  await expect(page).toHaveURL(/\/help#access$/);
  await expect(page.locator(".sandbox-badge")).toHaveCount(0);
  await expect(page.getByRole("banner")).not.toContainText(/\bsandbox\b/i);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etail-depot-next.netlify.app/help");
  const image=await request.get("/opengraph-image");expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toBe("image/png");
});


test("all five payment channels show a clear checkout journey and work by keyboard without private reads or changes", async ({page}) => {
  const mutations: string[] = [];
  const privateReads: string[] = [];
  const errors: string[] = [];
  const providerRequests: {url:string;method:string;referer:string|null}[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", async route => {
    const request = route.request();
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      mutations.push(`${request.method()} ${request.url()}`);
      await route.abort("blockedbyclient");
    } else if (new URL(request.url()).origin === "https://trolleys.ai") {
      // Verify navigation without reaching a real provider account.
      if (!request.isNavigationRequest()) { await route.fulfill({status:204,body:""}); return; }
      providerRequests.push({url:request.url(), method:request.method(), referer:await request.headerValue("referer")});
      await route.fulfill({status:200,contentType:"text/html",body:"<html><head><title>Captured handoff</title></head><body><h1>Payment service handoff captured</h1></body></html>"});
    } else if (new URL(request.url()).pathname.startsWith("/api/")) {
      privateReads.push(request.url());
      await route.abort("blockedbyclient");
    } else {
      await route.continue();
    }
  });
  await page.goto("/payment-services?handoff_probe=public-channel-check");
  const showcase = page.locator(".channel-showcase");
  const tablist = showcase.getByRole("tablist", {name:"Ways to share a payment request", exact:true});
  await expect(page.getByRole("tablist", {name:"What you sell", exact:true}).getByRole("tab", {name:"Goods", exact:true})).toHaveAttribute("aria-selected", "true");
  await expect(showcase.getByRole("combobox")).toHaveCount(0);
  const channels = [
    {name:"Text", content:"How can I pay for the homeware set?"},
    {name:"Email", content:"PAYMENT REQUEST"},
    {name:"Social", content:"PAY BY CARD"},
    {name:"QR code", content:"Credit and debit cards accepted"},
    {name:"Website", content:"Homeware order"},
  ];
  await expect(tablist.getByRole("tab")).toHaveCount(channels.length);
  await tablist.getByRole("tab", {name:"Text", exact:true}).focus();
  async function expectChannel(index: number) {
    const channel = channels[index]!;
    const tab = tablist.getByRole("tab", {name:channel.name, exact:true});
    await expect(tab).toBeFocused();
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(tab).toHaveAttribute("tabindex", "0");
    await expect(tablist.getByRole("tab", {selected:true})).toHaveCount(1);
    const bounds = (await tab.boundingBox())!;
    expect(bounds.height).toBeGreaterThanOrEqual(44);
    expect(bounds.width).toBeGreaterThanOrEqual(44);
    const panel = showcase.getByRole("tabpanel", {name:channel.name, exact:true});
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute("aria-labelledby", (await tab.getAttribute("id"))!);
    const medium = panel.locator(".channel-medium");
    await expect(medium.getByText(channel.content, {exact:true})).toBeVisible();
    await expect(medium).toContainText("Homeware order");
    await expect(medium).toContainText("Homeware set");
    await expect(medium).toContainText("$64.00");
    const checkout = panel.locator(".channel-checkout");
    await expect(checkout.getByText("Homeware set", {exact:true})).toBeVisible();
    await expect(checkout.getByText("$64.00", {exact:true})).toBeVisible();
    await expect(panel).not.toContainText("Your business");
    await expect(panel.getByRole("heading", {level:3})).toBeVisible();
    await expect(panel.locator(".marketing-channel-destination > .marketing-journey-step")).toContainText("Your customer pays");
    await expect(panel.getByText("Check the details, then pay by card.", {exact:true})).toBeVisible();
    await expectLoadedNetworkMarks(panel.getByRole("group", {name:"Card networks", exact:true}));
    await expect(panel.locator("input, textarea, select, form, button, a, [contenteditable=true]")).toHaveCount(0);
    await expect(panel.locator(".marketing-channel-journey").getByRole("button")).toHaveCount(0);
    expect(await showcase.textContent()).not.toMatch(/sample|sandbox|demo|fixture|no messages|no money|no .*collected/i);
    for (const other of channels.filter((_, otherIndex) => otherIndex !== index)) {
      await expect(tablist.getByRole("tab", {name:other.name, exact:true})).toHaveAttribute("tabindex", "-1");
    }
  }
  await expectChannel(0);
  for (let index=1; index<channels.length; index+=1) {
    await page.keyboard.press("ArrowRight");
    await expectChannel(index);
  }
  await page.keyboard.press("ArrowRight");
  await expectChannel(0);
  await page.keyboard.press("ArrowLeft");
  await expectChannel(channels.length-1);
  await page.keyboard.press("Home");
  await expectChannel(0);
  await page.keyboard.press("End");
  await expectChannel(channels.length-1);
  await page.keyboard.press("Home");
  await expectChannel(0);
  await page.keyboard.press("Tab");
  await expect(showcase.getByRole("tabpanel", {name:"Text", exact:true})).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(showcase.locator(":focus")).toHaveCount(0);
  await expect(showcase.getByRole("link")).toHaveCount(0);
  const openTools = page.locator(".consumer-hero-actions").getByRole("link", {name:"Get started with Trolleys", exact:true});
  await expect(openTools).toHaveAttribute("href", "https://trolleys.ai");
  await expect(openTools).toHaveAttribute("referrerpolicy", "no-referrer");
  await expect(openTools).toHaveAttribute("rel", /\bnoreferrer\b/);
  expect(privateReads).toEqual([]);
  await openTools.focus();
  await expect(openTools).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("https://trolleys.ai/");
  await expect(page.getByRole("heading", {name:"Payment service handoff captured",exact:true})).toBeVisible();
  expect(providerRequests).toEqual([{url:"https://trolleys.ai/",method:"GET",referer:null}]);
  expect(mutations).toEqual([]);
  expect(privateReads).toEqual([]);
  expect(errors).toEqual([]);
});

test("payment channels keep their content and touch targets inside a 320px screen", async ({page}) => {
  await page.setViewportSize({width:320,height:900});
  const mutations = await preventMutationRequests(page);
  await page.goto("/payment-services");
  const showcase = page.locator(".channel-showcase");
  await expect(showcase.locator(".marketing-channel-journey")).toBeVisible();
  const tabs = showcase.getByRole("tab");
  for (const name of ["Text", "Email", "Social", "QR code", "Website"]) {
    const selected = showcase.getByRole("tab", {name,exact:true});
    await selected.click();
    const panel = showcase.getByRole("tabpanel", {name,exact:true});
    await expect(panel).toBeVisible();
    await expect(panel.locator(".channel-medium")).toBeVisible();
    await expect(panel.locator(".channel-checkout")).toBeVisible();
    const overflow = await showcase.evaluate(node => ({
      document: document.documentElement.scrollWidth > window.innerWidth,
      panel: node.scrollWidth > node.clientWidth,
      content: [...node.querySelectorAll(".channel-medium, .channel-checkout")].some(element => element.scrollWidth > element.clientWidth),
    }));
    expect(overflow).toEqual({document:false,panel:false,content:false});
    for (const tab of await tabs.all()) {
      const bounds = (await tab.boundingBox())!;
      expect(bounds.height).toBeGreaterThanOrEqual(44);
      expect(bounds.width).toBeGreaterThanOrEqual(44);
    }
    const railBounds = (await showcase.locator(".channel-tabs").boundingBox())!;
    const selectedBounds = (await selected.boundingBox())!;
    expect(selectedBounds.x).toBeGreaterThanOrEqual(railBounds.x - 1);
    expect(selectedBounds.x + selectedBounds.width).toBeLessThanOrEqual(railBounds.x + railBounds.width + 1);
    expect(selectedBounds.x).toBeGreaterThanOrEqual(0);
    expect(selectedBounds.x + selectedBounds.width).toBeLessThanOrEqual(320);
  }
  expect(mutations).toEqual([]);
});

test("payment examples connect each business request to the same checkout amount without account actions", async ({page}) => {
  const mutations = await preventMutationRequests(page);
  const privateReads: string[] = [];
  page.on("request", request => { if (new URL(request.url()).pathname.startsWith("/api/")) privateReads.push(request.url()); });
  await page.setViewportSize({width:320,height:900});
  await page.goto("/");
  await page.locator(".consumer-hero-actions").getByRole("link",{name:"Explore payments",exact:true}).click();
  await expect(page).toHaveURL(/\/payment-services$/);
  const art = page.getByRole("figure",{name:"Illustrated payment journey",exact:true});
  const tablist = art.getByRole("tablist",{name:"Payment examples",exact:true});
  const examples = [
    {name:"Goods", description:"Homeware set", amount:"$64.00"},
    {name:"Services", description:"Design services", amount:"$480.00"},
    {name:"Information", description:"Market research briefing", amount:"$35.00"},
  ];
  async function expectExample(index:number) {
    const example = examples[index]!;
    const tab = tablist.getByRole("tab",{name:example.name,exact:true});
    await expect(tab).toBeFocused();
    await expect(tab).toHaveAttribute("aria-selected","true");
    await expect(tab).toHaveAttribute("tabindex","0");
    await expect(tablist.getByRole("tab",{selected:true})).toHaveCount(1);
    const panel = art.getByRole("tabpanel",{name:example.name,exact:true});
    for (const selector of [".payment-journey-request", ".payment-journey-checkout"]) {
      await expect(panel.locator(selector)).toContainText(example.description);
      await expect(panel.locator(selector)).toContainText(example.amount);
    }
    await expect(panel.locator(".payment-journey-pay")).toHaveText(`Pay ${example.amount}`);
    await expect(panel.locator("button, input, form, a")).toHaveCount(0);
    const box=(await tab.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x+box.width).toBeLessThanOrEqual(320);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  }
  await tablist.getByRole("tab",{name:"Goods",exact:true}).focus();
  await expectExample(0);
  for (const index of [1,2,0]) { await page.keyboard.press("ArrowRight"); await expectExample(index); }
  await page.keyboard.press("ArrowLeft"); await expectExample(2);
  await page.keyboard.press("Home"); await expectExample(0);
  await page.keyboard.press("End"); await expectExample(2);
  await tablist.getByRole("tab",{name:"Services",exact:true}).click(); await expectExample(1);
  await page.keyboard.press("Tab");
  await expect(art.getByRole("tabpanel",{name:"Services",exact:true})).toBeFocused();
  await expect(page).toHaveURL(/\/payment-services$/);
  expect(mutations).toEqual([]);
  expect(privateReads).toEqual([]);
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

  for (const path of ["/card-services"]) {
    await page.goto(path);
    await openWalletSetup(page);
    const guide = page.locator(".wallet-card-art");
    await expect(guide).toHaveCount(1);
    const tablist = guide.getByRole("tablist", {name:"Wallet setup options", exact:true});
    const apple = tablist.getByRole("tab", {name:"Apple Wallet", exact:true});
    const google = tablist.getByRole("tab", {name:"Google Wallet", exact:true});
    await expect(tablist.getByRole("tab")).toHaveCount(2);
    const logo = guide.locator('img[src="/brand/ledgix-logo.png"]').first();
    await expect(logo).toBeVisible();
    await expect.poll(() => logo.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);

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
      await expect(summary).toHaveAccessibleName("Hide wallet setup");
      await summary.focus();
      await page.keyboard.press("Space");
      await expect(guide).toBeHidden();
      await expect(summary).toHaveAccessibleName("View wallet setup");
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

test("switching wallets never shows the previous payment mark while the new logo loads", async ({page}) => {
  for (const path of ["/card-services"]) {
    let releaseLogo!: () => void;
    let requestedLogo!: () => void;
    const heldLogo = new Promise<void>(resolve => { releaseLogo = resolve; });
    const logoRequested = new Promise<void>(resolve => { requestedLogo = resolve; });
    await page.route("**/brand/wallets/google-pay.svg", async route => {
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
      await expect(visibleMark).toHaveAttribute("src", "/brand/wallets/google-pay.svg");
      await logoRequested;
      expect(await visibleMark.evaluate((img: HTMLImageElement) => img.complete)).toBe(false);
      // Do not reuse the decoded Apple image for a still-loading Google source.
      expect(await visibleMark.evaluate((img, previous) => img === previous, previousMark)).toBe(false);
      expect(await visibleMark.evaluate((img: HTMLImageElement) => img.currentSrc)).not.toContain("apple-pay.svg");
      await apple.click();
      await expect(apple).toHaveAttribute("aria-selected", "true");
      releaseLogo();
      await page.waitForLoadState("load");
      expect(await visibleMark.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain("apple-pay.svg");
      await google.click();
      await expect(google).toHaveAttribute("aria-selected", "true");
      await expect.poll(() => visibleMark.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);

      for (const tab of [apple, google, apple, google]) {
        await tab.click();
        await expect(tab).toHaveAttribute("aria-selected", "true");
        const mark = tab === apple ? "apple-pay.svg" : "google-pay.svg";
        expect(await visibleMark.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname)).toBe(`/brand/wallets/${mark}`);
        await expect(guide.getByRole("button", {name:"Show step 1: Add card", exact:true})).toHaveAttribute("aria-pressed", "true");
      }
    } finally {
      releaseLogo();
      await page.unrouteAll({behavior:"wait"});
    }
  }
});
