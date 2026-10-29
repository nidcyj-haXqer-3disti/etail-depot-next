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
  {name:"home",path:"/",selector:".consumer-networks"},
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
  const hero=page.locator(".consumer-hero");
  const art=hero.getByRole("figure",{name:"Etail Depot",exact:true});
  await expect(art).toBeVisible();
  const symbol=art.locator('img[src="/brand/symbol.png"]');
  await expect(symbol).toHaveCount(1);
  await expect(symbol).toBeVisible();
  await expect(symbol).toHaveAttribute("loading","eager");
  await expectDecodedBrandMarks(symbol);
  const artBox=await art.boundingBox(),copyBox=await hero.locator(".consumer-hero-copy").boundingBox();
  expect(artBox).not.toBeNull();expect(copyBox).not.toBeNull();
  expect(artBox!.width).toBeGreaterThan(200);expect(artBox!.height).toBeGreaterThan(200);
  expect(artBox!.x).toBeGreaterThanOrEqual(0);
  expect(artBox!.x+artBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width+1);
  if(page.viewportSize()!.width<=760)expect(artBox!.y).toBeGreaterThanOrEqual(copyBox!.y+copyBox!.height);
  else expect(artBox!.x).toBeGreaterThanOrEqual(copyBox!.x+copyBox!.width);
  await expect(hero.locator("form,input,textarea,select,[contenteditable=true]")).toHaveCount(0);
  await expect(art.locator("a,button,input,form,textarea,select,[tabindex],[role=button]")).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  const partnerLink=hero.getByRole("link",{name:"For software platforms",exact:true});
  await expect(partnerLink).toHaveAttribute("href","/software-partners");
  await partnerLink.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/software-partners$/);
  await page.goto("/");
  const paymentLink=hero.getByRole("link",{name:"Merchant services",exact:true});
  await expect(paymentLink).toHaveAttribute("href","/payment-acceptance-service");
  await paymentLink.click();
  await expect(page).toHaveURL(/\/payment-acceptance-service$/);
  await page.goto("/");
  const cardLink=page.locator(".consumer-card-section").getByRole("link",{name:"Explore card services",exact:true});
  await expect(cardLink).toHaveAttribute("href","/credit-card-services");
  await cardLink.click();
  await expect(page).toHaveURL(/\/credit-card-services$/);
  await expect(page.locator(".consumer-product-note")).toHaveText("Applications are not open yet. Inquiries do not submit an application or subscribe you to launch updates.");
  await expect(page.locator("main").getByRole("link",{name:"Contact Ledgix",exact:true}).first()).toHaveAttribute("href","mailto:ledgix@etaildepot.com");
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
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Payment processing for software platforms.");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/software-partners");
  await expect(page.locator("main form,main input,main textarea,main select,main iframe,main [contenteditable=true]")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/\b(proposed|roadmap|sandbox|simulation)\b/i);
  const experience = page.locator("#payment-experience");
  await expect(experience.getByRole("heading", { level: 3 })).toHaveText(["Onboard the business", "Accept the payment", "Reconcile the deposit"]);
  await expect(page.locator(".platform-journey-list")).toContainText("Each merchant needs approval before accepting payments.");
  await expect(page.locator("#integration")).toContainText("Our integration team provides documentation and access for the agreed setup.");
  await experience.scrollIntoViewIfNeeded();
  await expect(experience).toBeInViewport();
  const art = page.locator(".platform-payment-art");
  await expect(art).toBeVisible();
  await expect(art).toContainText("From payment to reconciliation.");
  await art.scrollIntoViewIfNeeded();
  await expect(art.locator("button,input,form,textarea,select,[role=button]")).toHaveCount(0);
  const box = await art.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(200);
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  const localInquiry = page.locator('.platform-opening a[href="#partner-contact"]');
  await expect(localInquiry).toHaveAccessibleName("Talk to our team");
  await localInquiry.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#partner-contact$/);
  const contact = page.locator("#partner-contact");
  await expect(contact).toBeInViewport();
  const email = contact.getByRole("link", { name: "Email our payments team", exact: true });
  await expect(email).toBeVisible();
  await expect(email).toHaveAttribute("href", "mailto:trolleys@etaildepot.com?subject=Software%20payment%20partnership");
  await expect(contact.locator('a[href^="mailto:"]')).toHaveCount(1);
  await page.goBack();
  await expect(page).toHaveURL(/\/software-partners\?partner_probe=private#visit$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/software-partners\?partner_probe=private#partner-contact$/);
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
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Payment processing for software platforms.");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("main form,main input,main textarea,main select,main iframe")).toHaveCount(0);
    const experience = page.locator("#payment-experience");
    await expect(experience.getByRole("heading", { level: 3 })).toHaveText(["Onboard the business", "Accept the payment", "Reconcile the deposit"]);
    await expect(page.locator(".platform-journey-list")).toContainText("Each merchant needs approval before accepting payments.");
    await experience.scrollIntoViewIfNeeded();
    await expect(experience).toBeInViewport();
    const art = page.locator(".platform-payment-art");
    await art.scrollIntoViewIfNeeded();
    await expect(art).toBeVisible();
    await expect(art.locator("a,button,input,form,textarea,select,[tabindex],[role=button]")).toHaveCount(0);
    await expect(art).toContainText("From payment to reconciliation.");
    const questions = page.locator(".platform-questions-section details");
    await expect(questions).toHaveCount(3);
    for (const detail of await questions.all()) {
      const summary = detail.locator("summary");
      await summary.focus();
      await page.keyboard.press("Enter");
      await expect(detail).toHaveAttribute("open", "");
      await expect(detail.locator("p")).toBeVisible();
    }
    const inquiry = page.locator('.platform-opening a[href="#partner-contact"]');
    await expect(inquiry).toHaveAccessibleName("Talk to our team");
    await inquiry.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#partner-contact$/);
    await expect(page.locator("#partner-contact")).toBeInViewport();
    await expect(page.locator("#partner-contact").getByRole("link", { name: "Email our payments team", exact: true })).toHaveAttribute("href", "mailto:trolleys@etaildepot.com?subject=Software%20payment%20partnership");
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
  for(const path of ["/","/software-partners","/credit-card-services","/payment-acceptance-service","/help"]){
    await page.goto(path);
    const mainNavigation=await openMainNavigation(page);
    await expect(mainNavigation.locator("a")).toHaveCount(6);
    for(const [name,href] of [["Merchant services","/payment-acceptance-service"],["Software platforms","/software-partners"],["Online businesses","/online-businesses"],["Card services","/credit-card-services"],["Documentation","/docs"],["Guides","/guides"]]){
      await expect(mainNavigation.getByRole("link",{name,exact:true,includeHidden:true})).toHaveAttribute("href",href);
    }
    await expect(page.getByRole("banner").getByRole("link",{name:"Help",exact:true})).toHaveAttribute("href","/help");
    await expect(page.getByRole("heading",{level:1})).toBeVisible();
    await expect(page.locator(".sandbox-badge, .service-availability")).toHaveCount(0);
    await expect(page.getByRole("banner")).not.toContainText(/\bsandbox\b/i);
    await expect(page.locator("form, iframe")).toHaveCount(0);
    if(path==="/payment-acceptance-service"){
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
    await expect(footer.getByRole("navigation",{name:"Footer use cases"}).getByRole("link",{name:"Software platforms",exact:true})).toHaveAttribute("href","/software-partners");
    await expect(footer.getByRole("navigation",{name:"Footer documentation"}).getByRole("link",{name:"Merchant operations",exact:true})).toHaveAttribute("href","/docs#merchant-operations");
    const guideLinks = footer.getByRole("navigation", {name:"Footer guides"}).getByRole("link");
    await expect(guideLinks).toHaveText(["ISO 20022", "ISO 8583"]);
    for (const [index, href] of ["/guides/iso-20022", "/guides/iso-8583"].entries()) {
      await expect(guideLinks.nth(index)).toHaveAttribute("href", href);
    }
    await expect(footer.getByRole("navigation",{name:"Footer legal"}).getByRole("link",{name:"Help center",exact:true})).toHaveAttribute("href","/help");
    await expect(footer.locator(".public-footer-company")).toHaveText(`© ${new Date().getUTCFullYear()} Etail Depot US, Inc. All rights reserved.`);
    if(productPage){
      await expect(page.locator("main")).not.toContainText(path==="/credit-card-services"?"Trolleys":"Ledgix",{useInnerText:true});
      await expect(page.locator(".consumer-final")).toHaveCount(0);
    }
    if(path==="/"){
      const payments=page.locator(".consumer-hero");
      const cards=page.locator(".consumer-card-section");
      await expect(payments.getByRole("heading",{level:1})).toContainText("Payment processing.");
      await expect(payments.getByRole("heading",{level:1})).toContainText("For business and");
      await expect(payments).toContainText("Merchant services for online businesses. Payment integration for the software platforms that serve them.");
      await expect(payments.locator(".consumer-hero-actions").getByRole("link",{name:"Merchant services",exact:true})).toHaveAttribute("href","/payment-acceptance-service");
      await expect(payments.locator(".consumer-hero-actions").getByRole("link",{name:"For software platforms",exact:true})).toHaveAttribute("href","/software-partners");
      await expect(payments.locator(".consumer-product-note")).toHaveCount(0);
      await expect(page.getByRole("link",{name:"Merchant access",exact:true})).toHaveCount(1);
      await expect(page.getByRole("banner").getByRole("link",{name:"Merchant access",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      await expect(page.locator(".consumer-final")).toHaveCount(0);
      await expect(page.getByRole("tablist")).toHaveCount(0);
      const serviceAreas=page.locator(".service-home-areas");
      await expect(serviceAreas.getByRole("heading",{level:3})).toHaveText(["Onboarding","Checkout","Payout"]);
      await expect(serviceAreas.getByRole("link")).toHaveCount(0);
      await expect(page.getByRole("link",{name:"Explore merchant services",exact:true})).toHaveAttribute("href","/payment-acceptance-service");
      await expect(serviceAreas.locator("button,input,form,textarea,select")).toHaveCount(0);
      await expect(cards.locator(".consumer-card-copy")).not.toContainText("Ledgix");
      await expect(cards.locator(".home-card-facts")).toContainText("Minimum security deposit$200");
      await expect(cards.locator(".home-card-facts")).toContainText("Annual and monthly fees$0");
      const paymentEligibility = page.locator("summary").filter({ hasText: "Can I use Etail Depot to accept payments?" });
      await paymentEligibility.click();
      await expect(paymentEligibility.locator("..")).toHaveAttribute("open", "");
      await expect(paymentEligibility.locator("..")).toContainText("accept payments once your account is approved and set up");
      const cardEligibility = page.locator("summary").filter({ hasText: "Can I apply for a credit card yet?" });
      await cardEligibility.click();
      await expect(cardEligibility.locator("..")).toHaveAttribute("open", "");
      await expect(cardEligibility.locator("..")).toContainText("Applications are not open yet.");
      await expect(cards.getByRole("link",{name:"Explore card services",exact:true})).toHaveAttribute("href","/credit-card-services");
      await expect(cards.locator(".wallet-product-art")).toHaveCount(1);
      await expect(cards.locator("button, form, input")).toHaveCount(0);
      await expect(page.locator(".wallet-card-art")).toHaveCount(0);
      await expect(cards.locator(".consumer-availability-note")).toHaveCount(0);
      const gettingStarted=page.locator("summary").filter({hasText:"How do I get started?"});
      await gettingStarted.click();
      await expect(gettingStarted.locator("..")).toHaveAttribute("open","");
      await expect(gettingStarted.locator("..")).toContainText("For your own business, start with Merchant services to see payment options, fees and account requirements.");
    }else if(path==="/credit-card-services"){
      await expect(page.getByRole("banner").getByRole("link",{name:"Merchant access",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      await expect(page.locator(".consumer-product-note")).toBeVisible();
      await expect(page.locator(".consumer-product-note")).toHaveText("Applications are not open yet. Inquiries do not submit an application or subscribe you to launch updates.");
      const cardContacts = page.locator("main").getByRole("link", { name: "Contact Ledgix", exact: true });
      expect(await cardContacts.count()).toBeGreaterThan(0);
      for (const contact of await cardContacts.all()) {
        await expect(contact).toHaveAttribute("href", "mailto:ledgix@etaildepot.com");
      }
      await expect(page.locator(".consumer-product-note")).toContainText("Inquiries do not submit an application or subscribe you to launch updates.");
      await expect(page.locator("main").getByRole("link",{name:/apply|create|sign in/i})).toHaveCount(0);
    }else if(path==="/payment-acceptance-service"){
      await expect(page.locator(".consumer-hero")).toContainText("Accept online card and ACH payments for your US business.");
      await expect(page.locator(".payment-hero-handoff")).toContainText("Account approval and setup apply.");
      await expect(page.locator(".consumer-hero").getByRole("figure",{name:"Customer checkout summary",exact:true})).toBeVisible();
      await expect(page.locator(".consumer-hero-actions").getByRole("link")).toHaveCount(1);
      await expect(page.locator(".consumer-hero-actions").getByRole("link",{name:"Apply for a merchant account",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      const sectionMenu = page.locator(".payment-section-nav .service-section-mobile > summary");
      if (await sectionMenu.isVisible()) await sectionMenu.click();
      await expect(page.locator(".payment-section-nav").getByRole("link",{name:"Pricing",exact:true})).toHaveAttribute("href","#fees");
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
  await useCaseNavigation.locator("summary").filter({hasText:/^Use cases$/}).click();
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
  await expect(page.locator("main").getByRole("link",{name:"Explore merchant services",exact:true})).toHaveCount(0);
  const navigation=await openMainNavigation(page);
  await expect(navigation.getByRole("link",{name:"Online businesses",exact:true,includeHidden:true})).toHaveAttribute("aria-current","page");
  await expect(page.locator(".online-business-copy")).toContainText("Let customers pay by card, digital wallet or ACH.");
  await expect(page.locator(".online-business-note")).toContainText("Account approval and setup apply.");
  await navigation.getByRole("link",{name:"Card services",exact:true}).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/credit-card-services$/);
  await openMainNavigation(page);
  await expect(page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Card services",exact:true,includeHidden:true})).toHaveAttribute("aria-current","page");
  await expect(page.locator(".consumer-hero-actions").getByRole("link", { name: "Contact Ledgix", exact: true })).toHaveAttribute("href", "mailto:ledgix@etaildepot.com");
  await expect(page.locator(".consumer-product-note")).toHaveText("Applications are not open yet. Inquiries do not submit an application or subscribe you to launch updates.");
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
    {path:"/payment-acceptance-service",scope:".consumer-hero-actions",label:"Apply for a merchant account"},
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
