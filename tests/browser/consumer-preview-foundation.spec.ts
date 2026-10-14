import {expect,test} from "@playwright/test";
import { expectDecodedBrandMarks } from "./brand-marks";
import {openMainNavigation} from "./public-header";


for (const path of ["/", "/payment-acceptance-service", "/credit-card-services", "/help", "/privacy", "/terms"]) {
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

test("home network logos load with page styles and eager Discover delivery on a cold refresh", async ({ page }) => {
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
      else await page.goto("/", { waitUntil: "commit" });
      await expect.poll(() => discoverRequested, { message: "The larger original Discover artwork must load without waiting for layout or hydration" }).toBe(true);
    } finally { releaseResources(); }
    await page.waitForLoadState("load");
    const logos = page.locator(".consumer-networks .network-mark");
    await expect(logos).toHaveCount(4);
    await expectDecodedBrandMarks(logos);
    for (const network of ["Visa", "Mastercard", "American Express", "Discover"]) {
      await expect(page.locator(".consumer-networks").getByRole("img", { name: network, exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  }
});

test("home presents a loaded business photograph and local product discovery without account effects",async({page})=>{
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
  const photo=hero.getByRole("img",{name:"A homeware business owner handing a customer their purchase",exact:true});
  await expect(photo).toBeVisible();
  await expect(photo).toHaveAttribute("src",/business-handoff-v1\.webp/);
  await expect.poll(()=>photo.evaluate(image=>image instanceof HTMLImageElement&&image.complete&&image.naturalWidth>0&&image.naturalHeight>0)).toBe(true);
  const imageBox=await photo.boundingBox(),copyBox=await hero.locator(".consumer-hero-copy").boundingBox();
  expect(imageBox).not.toBeNull();expect(copyBox).not.toBeNull();
  expect(imageBox!.width).toBeGreaterThan(200);expect(imageBox!.height).toBeGreaterThan(200);
  expect(imageBox!.x).toBeGreaterThanOrEqual(0);
  expect(imageBox!.x+imageBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width+1);
  if(page.viewportSize()!.width<=680)expect(imageBox!.y).toBeGreaterThanOrEqual(copyBox!.y+copyBox!.height);
  else expect(imageBox!.x).toBeGreaterThanOrEqual(copyBox!.x+copyBox!.width);
  await expect(hero.locator("form,input,textarea,select,[contenteditable=true]")).toHaveCount(0);
  await expect(hero.locator(".online-art-checkout,.checkout-card-preview")).toHaveCount(0);
  const paymentLink=hero.getByRole("link",{name:"Explore payment acceptance",exact:true});
  await expect(paymentLink).toHaveAttribute("href","/payment-acceptance-service");
  await paymentLink.click();
  await expect(page).toHaveURL(/\/payment-acceptance-service$/);
  await page.goto("/");
  const cardLink=page.locator(".consumer-card-section").getByRole("link",{name:"Explore the Ledgix credit card",exact:true});
  await expect(cardLink).toHaveAttribute("href","/credit-card-services");
  await cardLink.click();
  await expect(page).toHaveURL(/\/credit-card-services$/);
  await expect(page.locator(".consumer-product-note")).toHaveText("Applications are not open yet.");
  await expect(page.locator("main").getByRole("link",{name:"Contact Ledgix",exact:true}).first()).toHaveAttribute("href","mailto:ledgix@etaildepot.com");
  expect(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage}}))).toEqual(initialStorage);
  expect(unexpected).toEqual([]);expect(errors).toEqual([]);
});

test("public service discovery shows availability and support without local account access",async({page})=>{
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
  for(const path of ["/","/credit-card-services","/payment-acceptance-service","/help"]){
    await page.goto(path);
    await openMainNavigation(page);
    await expect(page.getByRole("heading",{level:1})).toBeVisible();
    await expect(page.locator(".sandbox-badge")).toHaveCount(0);
    await expect(page.getByRole("banner")).not.toContainText(/\bsandbox\b/i);
    await expect(page.locator("form, iframe")).toHaveCount(0);
    if(path==="/payment-acceptance-service"){
      await expect(page.locator("input")).toHaveCount(2);
      await expect(page.locator('.fee-estimate input#payment-amount[type="text"]')).toHaveCount(1);
      for(const id of ["sale-records"]){
        await expect(page.locator(`.fee-estimate input#addon-${id}[type="checkbox"]`)).toHaveCount(1);
      }
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
    await expect(footer.getByRole("navigation",{name:"Footer services"}).getByRole("link",{name:"Payment acceptance",exact:true})).toHaveAttribute("href","/payment-acceptance-service");
    await expect(footer.getByRole("navigation",{name:"Footer services"}).getByRole("link",{name:"Credit card",exact:true})).toHaveAttribute("href","/credit-card-services");
    await expect(footer.getByRole("navigation",{name:"Footer support"}).getByRole("link",{name:"Sign-in help",exact:true})).toHaveAttribute("href","/help#access");
    const contacts=footer.getByRole("navigation",{name:"Footer contact"});
    await expect(contacts.getByRole("link",{name:"Payment acceptance support",exact:true})).toHaveAttribute("href","mailto:trolleys@etaildepot.com");
    await expect(contacts.getByRole("link",{name:"Credit card inquiries",exact:true})).toHaveAttribute("href","mailto:ledgix@etaildepot.com");
    await expect(footer.locator(".public-footer-company")).toHaveText(`© ${new Date().getUTCFullYear()} Etail Depot US, Inc. All rights reserved.`);
    if(productPage){
      await expect(page.locator("main")).not.toContainText(path==="/credit-card-services"?"Trolleys":"Ledgix",{useInnerText:true});
      await expect(page.locator(".consumer-final")).toHaveCount(0);
    }
    if(path==="/"){
      const payments=page.locator(".consumer-hero");
      const cards=page.locator(".consumer-card-section");
      await expect(payments).toContainText("Trolleys");
      await expect(payments).toContainText("Available now");
      await expect(payments.locator(".consumer-hero-actions").getByRole("link",{name:"Explore payment acceptance",exact:true})).toHaveAttribute("href","/payment-acceptance-service");
      await expect(payments.locator(".consumer-product-note")).toHaveCount(0);
      await expect(page.getByRole("link",{name:"Open Trolleys",exact:true})).toHaveCount(1);
      await expect(page.getByRole("banner").getByRole("link",{name:"Open Trolleys",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      await expect(page.locator(".consumer-final")).toHaveCount(0);
      await expect(page.getByRole("tablist",{name:"Ways to share a payment request",exact:true})).toHaveCount(0);
      await expect(page.locator(".channel-showcase")).toHaveCount(0);
      const paymentSummary=page.locator(".consumer-payment-summary");
      await expect(paymentSummary.getByRole("heading",{level:3})).toHaveText(["Booking deposits","Work and expertise","Sales wherever you are"]);
      await expect(paymentSummary.locator("a, button, input, form")).toHaveCount(0);
      await expect(cards).toContainText("Ledgix");
      await expect(cards).toContainText("Coming soon");
      await expect(cards.getByRole("link",{name:"Explore the Ledgix credit card",exact:true})).toHaveAttribute("href","/credit-card-services");
      await expect(cards.locator(".wallet-product-art")).toHaveCount(1);
      await expect(cards.locator("button, form, input")).toHaveCount(0);
      await expect(page.locator(".wallet-card-art")).toHaveCount(0);
      await expect(cards.locator(".consumer-availability-note")).toHaveCount(0);
      const signInQuestion=page.locator("summary").filter({hasText:"Where will I manage my services?"});
      await signInQuestion.click();
      await expect(signInQuestion.locator("..")).toHaveAttribute("open","");
      await expect(signInQuestion.locator("..")).toContainText("Manage your payment acceptance account through Trolleys. Credit card account access will be available through Ledgix when the service launches, with a separate sign-in.");
    }else if(path==="/credit-card-services"){
      await expect(page.getByRole("banner").getByRole("link",{name:"Open Trolleys",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      await expect(page.locator("main")).toContainText("Coming soon");
      await expect(page.locator("main")).toContainText("Applications are not open yet.");
      await expect(page.locator("main").getByRole("link",{name:"Contact Ledgix",exact:true}).first()).toHaveAttribute("href","mailto:ledgix@etaildepot.com");
      await expect(page.locator("main").getByRole("link",{name:/apply|create|sign in/i})).toHaveCount(0);
    }else if(path==="/payment-acceptance-service"){
      await expect(page.locator("main")).toContainText("Available now");
      await expect(page.locator(".consumer-hero-actions").getByRole("link")).toHaveCount(2);
      await expect(page.locator(".consumer-hero-actions").getByRole("link",{name:"Continue to Trolleys",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      await expect(page.locator(".consumer-hero-actions").getByRole("link",{name:"View pricing",exact:true})).toHaveAttribute("href","#fees");
      await expect(page.locator("main").getByRole("link",{name:"Explore payment acceptance",exact:true})).toHaveCount(0);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
  }
  await page.goto("/");
  await (await openMainNavigation(page)).getByRole("link",{name:"Payment acceptance",exact:true}).click();
  await expect(page).toHaveURL(/\/payment-acceptance-service$/);
  await expect(page.getByRole("tablist",{name:"Ways to share a payment request",exact:true}).getByRole("tab")).toHaveCount(6);
  await expect(page.locator("main").getByRole("link",{name:"Explore payment acceptance",exact:true})).toHaveCount(0);
  await expect(page.locator(".channel-showcase").getByRole("link")).toHaveCount(0);
  const navigation=await openMainNavigation(page);
  await expect(navigation.getByRole("link",{name:"Payment acceptance",exact:true})).toHaveAttribute("aria-current","page");
  await expect(page.locator(".consumer-hero")).toContainText("Available now");
  await navigation.getByRole("link",{name:"Credit card",exact:true}).click();
  await expect(page).toHaveURL(/\/credit-card-services$/);
  await openMainNavigation(page);
  await expect(page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Credit card",exact:true})).toHaveAttribute("aria-current","page");
  await expect(page.locator(".consumer-hero")).toContainText("Coming soon");
  await expect(page.locator(".consumer-product-note")).toHaveText("Applications are not open yet.");
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
    {path:"/",scope:"header",label:"Open Trolleys"},
    {path:"/credit-card-services",scope:"header",label:"Open Trolleys"},
    {path:"/payment-acceptance-service",scope:".consumer-hero-actions",label:"Continue to Trolleys"},
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
