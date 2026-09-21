import {expect,test} from "@playwright/test";
import {openMainNavigation} from "./public-header";

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
  for(const path of ["/","/card-services","/payment-services","/help"]){
    await page.goto(path);
    await openMainNavigation(page);
    await expect(page.getByRole("heading",{level:1})).toBeVisible();
    await expect(page.locator(".sandbox-badge")).toHaveCount(0);
    await expect(page.getByRole("banner")).not.toContainText(/\bsandbox\b/i);
    await expect(page.locator("form, input, iframe")).toHaveCount(0);
    await expect(page.getByRole("region",{name:"Cards dashboard",exact:true})).toHaveCount(0);
    await expect(page.getByRole("region",{name:"Payments dashboard",exact:true})).toHaveCount(0);
    const localAccountLinks=await page.locator("a[href]").evaluateAll(links=>links.map(link=>new URL(link.getAttribute("href")!,location.href)).filter(url=>url.origin===location.origin&&/^\/(?:login|services|profile|cardholder-services|merchant-services|money-accounts)(?:\/|$)/.test(url.pathname)).map(url=>url.pathname));
    expect(localAccountLinks).toEqual([]);
    const portalLinks=page.locator('a[href="https://trolleys.ai"]');
    expect(await portalLinks.count()).toBeGreaterThan(0);
    if(path==="/card-services") await expect(page.locator('main a[href="https://trolleys.ai"]')).toHaveCount(0);
    for(const link of await portalLinks.all()){
      await expect(link).toHaveAttribute("referrerpolicy","no-referrer");
      await expect(link).toHaveAttribute("rel",/\bnoreferrer\b/);
    }
    const footer=page.getByRole("contentinfo");
    const productPage=path==="/card-services"||path==="/payment-services";
    await expect(footer.getByRole("navigation",{name:"Footer services"}).getByRole("link",{name:"Payments",exact:true})).toHaveAttribute("href","/payment-services");
    await expect(footer.getByRole("navigation",{name:"Footer services"}).getByRole("link",{name:"Cards",exact:true})).toHaveAttribute("href","/card-services");
    await expect(footer.getByRole("navigation",{name:"Footer support"}).getByRole("link",{name:"Sign-in help",exact:true})).toHaveAttribute("href","/help#access");
    const contacts=footer.getByRole("navigation",{name:"Footer contact"});
    await expect(contacts.getByRole("link",{name:"Payment support",exact:true})).toHaveAttribute("href","mailto:trolleys@etaildepot.com");
    await expect(contacts.getByRole("link",{name:"Card inquiries",exact:true})).toHaveAttribute("href","mailto:ledgix@etaildepot.com");
    await expect(footer.locator(".public-footer-company")).toHaveText(`© ${new Date().getUTCFullYear()} Etail Depot US, Inc. All rights reserved.`);
    if(productPage){
      await expect(page.locator("main")).not.toContainText(path==="/card-services"?"Trolleys":"Ledgix",{useInnerText:true});
      await expect(page.locator(".consumer-final")).toHaveCount(0);
    }
    if(path==="/"){
      const payments=page.locator(".consumer-hero");
      const cards=page.locator(".consumer-card-section");
      await expect(payments).toContainText("Trolleys");
      await expect(payments).toContainText("Available now");
      await expect(payments.locator(".consumer-hero-actions").getByRole("link",{name:"Explore payments",exact:true})).toHaveAttribute("href","/payment-services");
      await expect(payments.locator(".consumer-product-note")).toHaveCount(0);
      await expect(page.getByRole("link",{name:"Open Trolleys",exact:true})).toHaveCount(1);
      await expect(page.getByRole("banner").getByRole("link",{name:"Open Trolleys",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      await expect(page.locator(".consumer-final")).toHaveCount(0);
      await expect(page.getByRole("tablist",{name:"Ways to share a payment request"})).toHaveCount(0);
      await expect(page.locator(".channel-showcase")).toHaveCount(0);
      const paymentSummary=page.locator(".consumer-payment-summary");
      await expect(paymentSummary.getByRole("heading",{level:3})).toHaveText(["Booking deposits","Invoices for your work","Sales wherever you are"]);
      await expect(paymentSummary.locator("a, button, input, form")).toHaveCount(0);
      await expect(cards).toContainText("Ledgix");
      await expect(cards).toContainText("Coming soon");
      await expect(cards.getByRole("link",{name:"Meet the card",exact:true})).toHaveAttribute("href","/card-services");
      await expect(cards.locator(".wallet-product-art")).toHaveCount(1);
      await expect(cards.locator("button, form, input")).toHaveCount(0);
      await expect(page.locator(".wallet-card-art")).toHaveCount(0);
      await expect(cards.locator(".consumer-availability-note")).toHaveCount(0);
      const signInQuestion=page.locator("summary").filter({hasText:"Will cards and payments use the same sign-in?"});
      await signInQuestion.click();
      await expect(signInQuestion.locator("..")).toHaveAttribute("open","");
      await expect(signInQuestion.locator("..")).toContainText("Ledgix and Trolleys have separate service websites, sign-ins and dashboards.");
    }else if(path==="/card-services"){
      await expect(page.getByRole("banner").getByRole("link",{name:"Open Trolleys",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      await expect(page.locator("main")).toContainText("Coming soon");
      await expect(page.locator("main")).toContainText("Applications are not open yet.");
      await expect(page.locator("main").getByRole("link",{name:"Contact Ledgix",exact:true}).first()).toHaveAttribute("href","mailto:ledgix@etaildepot.com");
      await expect(page.locator("main").getByRole("link",{name:/apply|create|sign in/i})).toHaveCount(0);
    }else if(path==="/payment-services"){
      await expect(page.locator("main")).toContainText("Available now");
      await expect(page.locator(".consumer-product-note")).toHaveText("Continue to Trolleys to apply.");
      await expect(page.locator(".consumer-hero-actions").getByRole("link")).toHaveCount(1);
      await expect(page.locator(".consumer-hero-actions").getByRole("link",{name:"Get started with Trolleys",exact:true})).toHaveAttribute("href","https://trolleys.ai");
      await expect(page.locator("main").getByRole("link",{name:/explore/i})).toHaveCount(0);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)).toBe(false);
  }
  await page.goto("/");
  await (await openMainNavigation(page)).getByRole("link",{name:"Payments",exact:true}).click();
  await expect(page).toHaveURL(/\/payment-services$/);
  await expect(page.getByRole("tablist",{name:"Ways to share a payment request"}).getByRole("tab")).toHaveCount(7);
  await expect(page.locator("main").getByRole("link",{name:/explore/i})).toHaveCount(0);
  await expect(page.locator(".channel-showcase").getByRole("link")).toHaveCount(0);
  const navigation=await openMainNavigation(page);
  await expect(navigation.getByRole("link",{name:"Payments",exact:true})).toHaveAttribute("aria-current","page");
  await expect(page.locator(".consumer-hero")).toContainText("Available now");
  await navigation.getByRole("link",{name:"Cards",exact:true}).click();
  await expect(page).toHaveURL(/\/card-services$/);
  await openMainNavigation(page);
  await expect(page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Cards",exact:true})).toHaveAttribute("aria-current","page");
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
    {path:"/card-services",scope:"header",label:"Open Trolleys"},
    {path:"/payment-services",scope:".consumer-hero-actions",label:"Get started with Trolleys"},
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
