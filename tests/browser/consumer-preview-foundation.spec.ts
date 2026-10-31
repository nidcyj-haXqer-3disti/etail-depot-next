import {expect,test} from "@playwright/test";
import { expectDecodedBrandMarks } from "./brand-marks";
import {openMainNavigation} from "./public-header";


for (const path of ["/", "/software-partners", "/payment-acceptance-service", "/credit-card-services", "/help", "/privacy", "/terms"]) {
  test(`small brand marks render without separate downloads on ${path}`, async ({ page }) => {
    let releaseResources = () => {};
    let resourcesReady = Promise.resolve();
    await page.route("**/*", async route => {
      const request = route.request();
      // Simulate slow asset delivery and hydration. CSS can render the surrounding page normally.
      if (new URL(request.url()).pathname.startsWith("/brand/") || request.resourceType() === "script") await resourcesReady;
      await route.continue();
    });
    // Routing disables the HTTP cache, including on the second navigation.
    for (const refresh of [false, true]) {
      resourcesReady = new Promise<void>(resolve => { releaseResources = resolve; });
      try {
        if (refresh) await page.reload({ waitUntil: "commit" });
        else await page.goto(path, { waitUntil: "commit" });
        await expect(page.locator(".brand-logo")).toHaveCount(2);
        const marks = page.locator(".brand-logo, .network-mark:not(.network-mark-discover), .ledgix-wallet-card-logo");
        await expectDecodedBrandMarks(marks);
        const headerLogo = page.getByRole("banner").getByRole("img", { name: "Etail Depot", exact: true });
        await expect(headerLogo).toBeVisible();
        const headerBox = await headerLogo.boundingBox();
        expect(headerBox?.width).toBeGreaterThan(100);
        expect(headerBox?.height).toBeGreaterThan(20);
      } finally { releaseResources(); }
      await page.waitForLoadState("load");
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    }
  });
}

for (const {name,path,selector} of [
  {name:"merchant",path:"/payment-acceptance-service",selector:".consumer-networks"},
  {name:"online business",path:"/online-businesses",selector:".unified-preview-networks"},
]) {
test(`${name} network logos load with page styles and eager Discover delivery on a cold refresh`, async ({ page }) => {
  let releaseResources = () => {};
  let resourcesReady = Promise.resolve();
  let discoverRequested = false;
  await page.route("**/*", async route => {
    const request = route.request();
    if (new URL(request.url()).pathname === "/brand/networks/discover.jpg") discoverRequested = true;
    if (["stylesheet", "script"].includes(request.resourceType())) await resourcesReady;
    await route.continue();
  });
  for (const refresh of [false, true]) {
    discoverRequested = false;
    resourcesReady = new Promise<void>(resolve => { releaseResources = resolve; });
    try {
      if (refresh) await page.reload({ waitUntil: "commit" });
      else await page.goto(path, { waitUntil: "commit" });
      await expect.poll(() => discoverRequested, { message: "The larger original Discover artwork must load without waiting for layout or hydration" }).toBe(true);
    } finally { releaseResources(); }
    await page.waitForLoadState("load");
    const logos = page.locator(`${selector} .network-mark`);
    await expect(logos).toHaveCount(4);
    await expectDecodedBrandMarks(logos);
    for (const network of ["Visa", "Mastercard", "American Express", "Discover"]) {
      await expect(page.locator(selector).getByRole("img", { name: network, exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  }
});
}

test("home presents Etail brand artwork and local product discovery without account effects",async({page})=>{
  const unexpected:string[]=[],errors:string[]=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.route("**/*",async route=>{
    const request=route.request(),url=new URL(request.url());
    if(!["GET","HEAD","OPTIONS"].includes(request.method())||url.pathname.startsWith("/api/")||["trolleys.ai","ledgix.com"].includes(url.hostname)){
      unexpected.push(`${request.method()} ${url.origin}${url.pathname}`);
      await route.abort();
    }else await route.continue();
  });
  await page.goto("/");
  const initialStorage=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}));
  await expect(page.locator('main .ec-company-section, main a[href="/company"]')).toHaveCount(0);
  const hero=page.locator(".ec-home-hero");
  const art=hero.locator("[data-company-art]");
  await expect(art).toBeVisible();
  const symbol=art.locator('img[src="/brand/symbol.png"]');
  await expect(symbol).toHaveCount(1);
  await expect(symbol).toBeVisible();
  await expect(symbol).toHaveAttribute("width","56");
  await expectDecodedBrandMarks(symbol);
  await expect(art.locator('img[src^="/marketing/"]')).toHaveCount(0);
  await expect(art).not.toContainText(/Designer sneaker|Studio Store|10482/);
  await expect(art).toHaveAccessibleName(/Etail Depot connects three service areas.*Merchant accounts require approval/);
  const artBox=await art.boundingBox(),copyBox=await hero.locator("[data-home-copy]").boundingBox();
  expect(artBox).not.toBeNull();expect(copyBox).not.toBeNull();
  expect(artBox!.width).toBeGreaterThan(200);expect(artBox!.height).toBeGreaterThan(200);
  expect(artBox!.x).toBeGreaterThanOrEqual(0);
  expect(artBox!.x+artBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width+1);
  // The art may sit beside or below the copy, but must never cover it.
  expect(artBox!.x >= copyBox!.x + copyBox!.width - 1 || artBox!.y >= copyBox!.y + copyBox!.height - 1).toBe(true);
  await expect(hero.locator("form,input,textarea,select,[contenteditable=true]")).toHaveCount(0);
  await expect(art.locator("a,button,input,form,textarea,select,[tabindex],[role=button]")).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await hero.getByRole("link",{name:"Explore our services",exact:true}).click();
  await expect(page).toHaveURL(/\/#services$/);
  const serviceLink=page.locator("#services").getByRole("link",{name:"Explore merchant services",exact:true});
  await expect(serviceLink).toHaveAttribute("href","/payment-acceptance-service");
  await serviceLink.click();
  await expect(page).toHaveURL(/\/payment-acceptance-service$/);
  await expect(page.getByRole("heading",{level:1})).toBeVisible();
  await page.goto("/");
  const partnerLink=page.locator("#services").getByRole("link",{name:"Explore software platforms",exact:true});
  await expect(partnerLink).toHaveAttribute("href","/software-partners");
  await partnerLink.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/software-partners$/);
  await page.goto("/");
  await expect(page.locator("#card-services")).not.toContainText("Applications are not open");
  const cardLink=page.locator("#services").getByRole("link",{name:"Explore card services",exact:true});
  await expect(cardLink).toHaveAttribute("href","/credit-card-services");
  await cardLink.click();
  await expect(page).toHaveURL(/\/credit-card-services$/);
  await expect(page.locator(".consumer-product-note")).toHaveText("An inquiry is not an application.");
  await expect(page.locator("main").getByRole("link",{name:"Ask about card services",exact:true}).first()).toHaveAttribute("href","/contact#cards");
  expect(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}))).toEqual(initialStorage);
  expect(unexpected).toEqual([]);expect(errors).toEqual([]);
});

test("software partners can review the payment experience and reach the fixed inquiry without account effects", async ({ page }) => {
  const unexpected: string[] = [], errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/*", async route => {
    const request = route.request(), url = new URL(request.url());
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method()) || url.pathname.startsWith("/api/") || ["trolleys.ai", "ledgix.com"].includes(url.hostname)) {
      unexpected.push(`${request.method()} ${url.origin}${url.pathname}`);
      await route.abort();
    } else await route.continue();
  });
  const response = await page.goto("/software-partners?partner_probe=private#visit");
  expect(response?.status()).toBe(200);
  const initialStorage = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your merchants aren’t all the same.");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/software-partners");
  await expect(page.locator("main form,main input,main textarea,main select,main iframe,main [contenteditable=true]")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/\b(proposed|roadmap|sandbox|simulation)\b/i);
  const experience = page.locator("#payment-experience");
  await expect(experience.getByRole("heading", { level: 3 })).toHaveText(["Onboard the business.", "Connect the checkout.", "Follow the payment.", "Reconcile the deposit."]);
  await expect(page.locator("#payment-experience .ec-journey-rail")).toContainText("The business submits its details for review and completes account setup after approval.");
  await expect(page.locator("#integration")).toContainText("Request the specifications and access for your approved setup from our integration team.");
  await experience.scrollIntoViewIfNeeded();
  await expect(experience).toBeInViewport();
  const art = page.locator("[data-attention-art=platform]");
  await expect(art).toBeVisible();
  await expect(art).toContainText("Account setupCheckoutReporting");
  await art.scrollIntoViewIfNeeded();
  await expect(art.locator("button,input,form,textarea,select,[role=button]")).toHaveCount(0);
  const box = await art.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(200);
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  const localInquiry = page.locator('.ec-platform-hero a[href="/contact#platforms"]');
  await expect(localInquiry).toHaveAccessibleName("Discuss your platform");
  await localInquiry.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact#platforms$/);
  const contact = page.locator("#platforms");
  await expect(contact).toBeInViewport();
  const email = contact.locator('a[href^="mailto:"]');
  await expect(email).toBeVisible();
  await expect(email).toHaveAttribute("href", "mailto:trolleys@etaildepot.com?subject=Software%20payment%20partnership");
  await expect(contact.locator('a[href^="mailto:"]')).toHaveCount(1);
  await page.goBack();
  await expect(page).toHaveURL(/\/software-partners\?partner_probe=private#visit$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/contact#platforms$/);
  await expect(contact).toBeInViewport();
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual(initialStorage);
  expect(await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1);
  expect(unexpected).toEqual([]);
  expect(errors).toEqual([]);
});

test("software partner content and inquiry remain usable without JavaScript", async ({ browser, baseURL, viewport }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce", baseURL, viewport });
  const page = await context.newPage();
  try {
    const response = await page.goto("/software-partners");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your merchants aren’t all the same.");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("main form,main input,main textarea,main select,main iframe")).toHaveCount(0);
    const experience = page.locator("#payment-experience");
    await expect(experience.getByRole("heading", { level: 3 })).toHaveText(["Onboard the business.", "Connect the checkout.", "Follow the payment.", "Reconcile the deposit."]);
    await expect(page.locator("#payment-experience .ec-journey-rail")).toContainText("The business submits its details for review and completes account setup after approval.");
    await experience.scrollIntoViewIfNeeded();
    await expect(experience).toBeInViewport();
    const art = page.locator("[data-attention-art=platform]");
    await art.scrollIntoViewIfNeeded();
    await expect(art).toBeVisible();
    await expect(art.locator("a,button,input,form,textarea,select,[tabindex],[role=button]")).toHaveCount(0);
    await expect(art).toContainText("Account setupCheckoutReporting");
    await expect(page.locator(".faq, .public-faq-section")).toHaveCount(0);
    const inquiry = page.locator('.ec-platform-hero a[href="/contact#platforms"]');
    await expect(inquiry).toHaveAccessibleName("Discuss your platform");
    await inquiry.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/contact#platforms$/);
    await expect(page.locator("#platforms")).toBeInViewport();
    await expect(page.locator('#platforms a[href^="mailto:"]')).toHaveAttribute("href", "mailto:trolleys@etaildepot.com?subject=Software%20payment%20partnership");
    expect(await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1);
    expect(await context.cookies()).toEqual([]);
  } finally {
    await context.close();
  }
});

test("public service discovery explains eligibility and card inquiries without local account access",async({page})=>{
  const changes:string[]=[],privateReads:string[]=[],errors:string[]=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.route("**/*",async route=>{
    const request=route.request();
    if(!["GET","HEAD","OPTIONS"].includes(request.method())){
      changes.push(`${request.method()} ${request.url()}`);
      await route.abort();
    }else if(new URL(request.url()).pathname.startsWith("/api/")){
      privateReads.push(request.url());
      await route.abort();
    }else await route.continue();
  });
  for(const path of ["/","/software-partners","/credit-card-services","/payment-acceptance-service","/pricing","/help"]){
    await page.goto(path);
    const mainNavigation=await openMainNavigation(page);
    await expect(mainNavigation.locator("a")).toHaveCount(16);
    for(const [name,href] of [["Merchant services","/payment-acceptance-service"],["Software platforms","/software-partners"],["Online businesses","/online-businesses"],["Card services","/credit-card-services"],["Documentation","/docs"],["Guides","/guides"],["Pricing","/pricing"]]){
      await expect(mainNavigation.getByRole("link",{name,exact:true,includeHidden:true})).toHaveAttribute("href",href);
    }
    await expect(page.getByRole("banner").getByRole("link",{name:"Help center",exact:true,includeHidden:true})).toHaveAttribute("href","/help");
    await expect(page.getByRole("heading",{level:1})).toBeVisible();
    await expect(page.locator(".sandbox-badge, .service-availability")).toHaveCount(0);
    await expect(page.getByRole("banner")).not.toContainText(/\bsandbox\b/i);
    await expect(page.locator("form, iframe")).toHaveCount(0);
    if(path==="/pricing"){
      await expect(page.locator("input")).toHaveCount(1);
      await expect(page.locator('.fee-estimate input#payment-amount[type="text"]')).toHaveCount(1);
      await expect(page.locator('.fee-estimate input[type="checkbox"]')).toHaveCount(0);
    }else await expect(page.locator("input")).toHaveCount(0);
    await expect(page.getByRole("region",{name:"Cards dashboard",exact:true})).toHaveCount(0);
    await expect(page.getByRole("region",{name:"Payments dashboard",exact:true})).toHaveCount(0);
    const localAccountLinks=await page.locator("a[href]").evaluateAll(links=>links.map(link=>new URL(link.getAttribute("href")!,location.href)).filter(url=>url.origin===location.origin&&/^\/(?:login|services|profile|cardholder-services|merchant-services|money-accounts)(?:\/|$)/.test(url.pathname)).map(url=>url.pathname));
    expect(localAccountLinks).toEqual([]);
    const portalLinks=page.locator('a[href="https://trolleys.ai"]');
    expect(await portalLinks.count()).toBeGreaterThan(0);
    if(path==="/credit-card-services") await expect(page.locator('main a[href="https://trolleys.ai"]')).toHaveCount(0);
    for(const link of await portalLinks.all()){
      await expect(link).toHaveAttribute("referrerpolicy","no-referrer");
      await expect(link).toHaveAttribute("rel",/\bnoreferrer\b/);
    }
    const footer=page.getByRole("contentinfo");
    const productPage=path==="/credit-card-services"||path==="/payment-acceptance-service";
    await expect(footer.getByRole("navigation",{name:"Footer services"}).getByRole("link",{name:"Merchant services",exact:true})).toHaveAttribute("href","/payment-acceptance-service");
    await expect(footer.getByRole("navigation",{name:"Footer services"}).getByRole("link",{name:"Card services",exact:true,includeHidden:true})).toHaveAttribute("href","/credit-card-services");
    await expect(footer.getByRole("navigation",{name:"Footer platforms"}).getByRole("link",{name:"Software platforms",exact:true})).toHaveAttribute("href","/software-partners");
    await expect(footer.getByRole("navigation",{name:"Footer resources"}).getByRole("link",{name:"Documentation",exact:true})).toHaveAttribute("href","/docs");
    const resourceLinks = footer.getByRole("navigation", {name:"Footer resources"}).getByRole("link");
    await expect(resourceLinks).toHaveText(["Documentation", "Guides", "Help center"]);
    for (const [index, href] of ["/docs", "/guides", "/help"].entries()) await expect(resourceLinks.nth(index)).toHaveAttribute("href", href);
    await expect(footer.locator(".public-footer-company")).toHaveText(`© ${new Date().getUTCFullYear()} Etail Depot US, Inc. All rights reserved.`);
    if(productPage){
      await expect(page.locator("main")).not.toContainText(path==="/credit-card-services"?"Trolleys":"Ledgix",{useInnerText:true});
      await expect(page.locator(".consumer-final")).toHaveCount(0);
    }
    if(path==="/"){
      const payments=page.locator(".ec-home-hero");
      await expect(payments.getByRole("heading",{level:1})).toHaveText("Merchant services. For your business.");
      await expect(payments).toContainText("Credit card processing, online checkout and reporting for US businesses and software platforms.");
      await expect(payments.getByRole("link",{name:"Explore our services",exact:true})).toHaveAttribute("href","#services");
      await expect(page.getByRole("banner").getByRole("link",{name:"Merchant access",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      await expect(page.getByRole("tablist")).toHaveCount(0);
      const serviceAreas=page.locator("#services");
      await expect(serviceAreas.getByRole("heading",{level:2})).toHaveText(["Merchant services","Software platforms","Card services"]);
      for (const [name,href] of [["Explore merchant services","/payment-acceptance-service"],["Explore software platforms","/software-partners"],["Explore card services","/credit-card-services"]]) await expect(serviceAreas.getByRole("link",{name,exact:true})).toHaveAttribute("href",href);
      await expect(serviceAreas.locator("button,input,form,textarea,select")).toHaveCount(0);
      await expect(page.locator("#card-services")).not.toContainText("Applications are not open");
      await expect(payments).toContainText("Merchant account approval is required.");
      await expect(footer.getByRole("link",{name:"Card services",exact:true})).toHaveAttribute("href","/credit-card-services");
    }else if(path==="/credit-card-services"){
      await expect(page.getByRole("banner").getByRole("link",{name:"Merchant access",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      await expect(page.locator(".consumer-product-note")).toBeVisible();
      await expect(page.locator(".consumer-product-note")).toHaveText("An inquiry is not an application.");
      const cardContacts = page.locator("main").getByRole("link", { name: "Ask about card services", exact: true });
      expect(await cardContacts.count()).toBeGreaterThan(0);
      for (const contact of await cardContacts.all()) {
        await expect(contact).toHaveAttribute("href", "/contact#cards");
      }
      await expect(page.locator(".consumer-product-note")).toContainText("An inquiry is not an application.");
      await expect(page.locator("main").getByRole("link",{name:/apply|create|sign in/i})).toHaveCount(0);
    }else if(path==="/payment-acceptance-service"){
      await expect(page.locator(".merchant-hero")).toContainText("Credit card processing and ACH for US businesses in USD, with account setup, online checkout and payment reporting.");
      await expect(page.locator(".merchant-hero [data-attention-copy]")).toContainText("Account approval and setup apply.");
      await expect(page.locator(".cw-merchant-art")).toBeVisible();
      await expect(page.locator(".merchant-hero").getByRole("link")).toHaveCount(2);
      await expect(page.locator(".merchant-hero").getByRole("link",{name:"Apply for a merchant account",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      const sectionMenu = page.locator(".service-section-nav .service-section-mobile > summary");
      if (await sectionMenu.isVisible()) await sectionMenu.click();
      await expect(page.locator(".service-section-nav").getByRole("link",{name:"Pricing",exact:true})).toHaveAttribute("href","#fees");
      await expect(page.locator("main").getByRole("link",{name:"Explore merchant services",exact:true})).toHaveCount(0);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
  }
  await page.goto("/");
  const merchantNavigationLink=(await openMainNavigation(page)).getByRole("link",{name:"Merchant services",exact:true});
  await merchantNavigationLink.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/payment-acceptance-service$/);
  const useCaseNavigation = await openMainNavigation(page);
  if (await useCaseNavigation.locator(".public-domain-services").getAttribute("open") === null) await useCaseNavigation.locator("summary").filter({hasText:/^Services$/}).click();
  await useCaseNavigation.getByRole("link",{name:"Online businesses",exact:true}).click();
  await expect(page).toHaveURL(/\/online-businesses$/);
  const explorer=page.locator(".payment-service-explorer");
  const views=explorer.getByRole("tablist",{name:"Payment journey views",exact:true});
  await expect(views.getByRole("tab")).toHaveText(["Onboarding","Checkout","Card record","Card payout"]);
  await views.getByRole("tab",{name:"Checkout",exact:true}).focus();
  await page.keyboard.press("ArrowRight");
  await expect(views.getByRole("tab",{name:"Card record",exact:true})).toBeFocused();
  await expect(views.getByRole("tab",{name:"Card record",exact:true})).toHaveAttribute("aria-selected","true");
  await expect(explorer.getByRole("tabpanel",{name:"Card record",exact:true})).toBeVisible();
  await expect(explorer.getByRole("tabpanel",{name:"Card record",exact:true})).toContainText("Capture does not confirm that money has reached the merchant’s bank.");
  await page.keyboard.press("End");
  await expect(views.getByRole("tab",{name:"Card payout",exact:true})).toBeFocused();
  await expect(views.getByRole("tab",{name:"Card payout",exact:true})).toHaveAttribute("aria-selected","true");
  await expect(explorer.getByRole("tabpanel",{name:"Card payout",exact:true})).toBeVisible();
  await expect(explorer.locator("a,input,form,textarea,select,iframe")).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await expect(page.locator("main").getByRole("link",{name:"Explore merchant services",exact:true})).toHaveAttribute("href", "/payment-acceptance-service");
  const navigation=await openMainNavigation(page);
  await expect(navigation.getByRole("link",{name:"Online businesses",exact:true,includeHidden:true})).toHaveAttribute("aria-current","page");
  await expect(page.locator(".online-business-copy")).toContainText("Accept credit cards, digital wallets and ACH online through the methods enabled for your account. Keep the payment result connected to the order.");
  await expect(page.locator(".online-business-note")).toContainText("Account approval and setup apply.");
  await navigation.getByRole("link",{name:"Card services",exact:true}).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/credit-card-services$/);
  await openMainNavigation(page);
  await expect(page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Card services",exact:true,includeHidden:true})).toHaveAttribute("aria-current","page");
  await expect(page.locator(".consumer-hero-actions").getByRole("link", { name: "Ask about card services", exact: true })).toHaveAttribute("href", "/contact#cards");
  await expect(page.locator(".consumer-product-note")).toHaveText("An inquiry is not an application.");
  expect(changes).toEqual([]);expect(privateReads).toEqual([]);expect(errors).toEqual([]);
});

test("payment entry points hand off only the approved portal address without queries or referrers",async({page})=>{
  const handoffs:{url:string;method:string;referer:string|null}[]=[],changes:string[]=[],errors:string[]=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.route("**/*",async route=>{
    const request=route.request();
    if(!["GET","HEAD","OPTIONS"].includes(request.method())){
      changes.push(`${request.method()} ${request.url()}`);
      await route.abort();
    }else if(new URL(request.url()).origin==="https://trolleys.ai"){
      // Capture the browser handoff locally; never load or operate the provider account.
      if(!request.isNavigationRequest()){await route.fulfill({status:204,body:""});return;}
      handoffs.push({url:request.url(),method:request.method(),referer:await request.headerValue("referer")});
      await route.fulfill({status:200,contentType:"text/html",body:"<html><head><title>Captured handoff</title></head><body><h1>Payment service handoff captured</h1></body></html>"});
    }else await route.continue();
  });
  const entries=[
    {path:"/",scope:"header",label:"Merchant access"},
    {path:"/software-partners",scope:"header",label:"Merchant access"},
    {path:"/credit-card-services",scope:"header",label:"Merchant access"},
    {path:"/payment-acceptance-service",scope:".merchant-hero",label:"Apply for a merchant account"},
    {path:"/help",scope:"#payments",label:"Open Trolleys"},
  ];
  for(const [index,entry] of entries.entries()){
    await page.goto(`${entry.path}?handoff_probe=public-entry-${index}#visit`);
    if(entry.scope==="header")await openMainNavigation(page);
    const link=page.locator(entry.scope).getByRole("link",{name:entry.label,exact:true});
    await expect(link).toHaveAttribute("href","https://trolleys.ai");
    await expect(link).toHaveAttribute("referrerpolicy","no-referrer");
    await expect(link).toHaveAttribute("rel",/\bnoreferrer\b/);
    await link.click();
    await expect(page).toHaveURL("https://trolleys.ai/");
    await expect(page.getByRole("heading",{name:"Payment service handoff captured",exact:true})).toBeVisible();
    expect(handoffs).toHaveLength(index+1);
    expect(handoffs[index]).toEqual({url:"https://trolleys.ai/",method:"GET",referer:null});
  }
  expect(changes).toEqual([]);expect(errors).toEqual([]);
});
