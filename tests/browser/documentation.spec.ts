import { expect,test } from "@playwright/test";
import { openMainNavigation } from "./public-header";
import { expectCompleteGuidePaint } from "./guide-rendering";
import { DEVELOPER_NAVIGATION,DOCUMENTATION_REDIRECTS } from "../../src/shared/site/developer-paths";
const pages=[...DEVELOPER_NAVIGATION.map(page=>({href:page.href,label:page.label,group:"Developers"})),{href:"/resources/merchant-account-setup",label:"Merchant account setup",group:"Resources"}];

test("the consolidated pages retain navigation, accessible sections and exact metadata",async({page})=>{
 for(const item of pages){
  const response=await page.goto(item.href);expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading",{level:1})).toHaveText(item.label);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href",`https://etaildepot.com${item.href}`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(node=>node.id));expect(new Set(ids).size).toBe(ids.length);
  for(const href of await page.locator('main a[href^="#"]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute("href")!)))expect(await page.locator(`[id="${href.slice(1)}"]`).count()).toBe(1);
  await expect(page.locator('main form,main iframe,main input')).toHaveCount(0);
  await expect(page.locator('main a[href^="/docs"]')).toHaveCount(0);
  await expect(page.getByRole("navigation",{name:"Breadcrumb",exact:true})).toHaveCount(0);
  await expect(page.getByText("Browse topics",{exact:true})).toHaveCount(0);
  if(item.group==="Developers")await expect(page.locator('.docs-coming-soon')).toHaveText("Coming soon");
  await expect(page.locator('a[href="/developers/sdks"], a[href="/developers/changelog"], a[href="/developers/api-status"]')).toHaveCount(0);
  const nav=await openMainNavigation(page,item.group);
  await expect(nav.locator('a[aria-current="page"]')).toHaveAttribute("href",item.href);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 }
});

test("legacy links redirect without forwarding input and retain existing section bookmarks",async({page,request})=>{
 for(const [old,destination] of Object.entries(DOCUMENTATION_REDIRECTS)){
  const response=await request.get(old+"?email=do-not-forward",{maxRedirects:0});expect(response.status()).toBe(308);expect(new URL(response.headers().location).pathname).toBe(destination);expect(new URL(response.headers().location).search).toBe("");
  expect((await request.post(old,{data:"do-not-forward",maxRedirects:0})).status()).toBe(405);
 }
 for(const [old,anchor,target] of [["/developers/getting-started","complete-payment","/developers/getting-started"],["/docs/payment-status","uncertain-result","/developers/api-reference"],["/docs/merchant-onboarding","registration-email","/resources/merchant-account-setup"]]){
  await page.goto(old+"#"+anchor);await expect(page).toHaveURL(url=>url.pathname===target&&url.hash==="#"+anchor);await expect(page.locator("#"+anchor+">h2")).toBeInViewport();
 }
});

test("former overview bookmarks open the introduction without a second guide directory",async({page})=>{
 for(const anchor of ["related-guides","topics","merchant-operations","getting-started","payment-requests","payment-records","refunds-and-disputes","payouts","webhooks","testing-and-launch"]){
  await page.goto('/docs#'+anchor);
  await expect(page).toHaveURL(url=>url.pathname==='/developers/getting-started'&&url.hash==='#'+anchor);
  await expect(page.locator('#'+anchor)).toBeAttached();
  await expect(page.locator('#integration-access > h2')).toBeInViewport();
 }
 await expect(page.getByRole('heading',{name:'More guides',exact:true})).toHaveCount(0);
 await expect(page.locator('.docs-related-links')).toHaveCount(0);
 const nav=await openMainNavigation(page,"Resources");
 await nav.getByRole('link',{name:'Merchant account setup',exact:true}).click();
 await expect(page).toHaveURL(/\/resources\/merchant-account-setup$/);
});

test("Developers navigation and browser Back retain a clear reading path",async({page})=>{
 await page.goto('/developers/getting-started');
 let nav=await openMainNavigation(page,"Developers");await nav.getByRole('link',{name:'Webhooks',exact:true}).click();await expect(page).toHaveURL(/\/developers\/webhooks$/);
 nav=await openMainNavigation(page,"Developers");await nav.getByRole('link',{name:'Testing',exact:true}).click();await expect(page).toHaveURL(/\/developers\/testing$/);
 await page.goBack();await expect(page).toHaveURL(/\/developers\/webhooks$/);
 nav=await openMainNavigation(page,"Resources");await nav.getByRole('link',{name:'Merchant account setup',exact:true}).click();await expect(page).toHaveURL(/\/resources\/merchant-account-setup$/);
});

test("existing guidance stays distinct from unavailable Etail APIs",async({page})=>{
 for(const slug of ["getting-started","api-reference","webhooks","testing","developer-tools"]){
  await page.goto('/developers/'+slug);
  await expect(page.locator('.docs-availability')).toContainText('Etail APIs and tools are not available yet.');
  await expect(page.locator('.docs-article')).not.toContainText(/ORD-1048|tx_demo|sk_test|transientToken|example API|mocked/i);
  await expect(page.locator('.docs-article pre,main form,main iframe')).toHaveCount(0);
 }
 for(const slug of ['sdks','changelog','api-status']){
  await page.goto('/developers/'+slug);
  const notice=page.locator('.docs-availability');
  await expect(notice.getByRole('link',{name:'Shopify',exact:true})).toHaveAttribute('href','/resources/shopify-gateway-integration');
  await expect(notice.getByRole('link',{name:'WooCommerce',exact:true})).toHaveAttribute('href','/resources/woocommerce-gateway-integration');
  await expect(notice.locator('a[href="/resources/guides"]')).toHaveCount(0);
 }
});

test("phone readers can jump to each topic without another navigation layer",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const slug of ['getting-started','api-reference','webhooks','testing','developer-tools']){
  await page.goto('/developers/'+slug);const toc=page.locator('.docs-mobile-toc');
  await toc.locator('summary').focus();await page.keyboard.press('Enter');const last=toc.getByRole('link').last();const href=await last.getAttribute('href');await last.click();await expect(page.locator(href+' > h2')).toBeInViewport();
 }
});

test("developer sidebar transfers focus when hidden on a phone",async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/developers/getting-started');
 const nav=page.getByRole('navigation',{name:'Developer pages'});await nav.getByRole('link',{name:'API reference',exact:true}).focus();
 await page.setViewportSize({width:390,height:844});await expect(nav).toBeHidden();await expect(page.getByRole('heading',{level:1})).toBeFocused();
});

test("documentation distinguishes approval, payment results and bank receipt",async({page})=>{
 await page.goto('/resources/merchant-account-setup');
 await expect(page.locator('#application-review')).toContainText('Creating a login is not approval to accept payments.');
 await expect(page.locator('#account-readiness')).toContainText('Wait for account approval and confirmation that your payment setup is ready.');
 await page.goto('/developers/getting-started');
 await expect(page.locator('#checkout')).toContainText('verify the payment result and recover an interrupted attempt');
 await expect(page.locator('main')).toContainText('The checkout connection and instructions provided for your merchant account');
 await expect(page.locator('#complete-payment')).toContainText('Do not fulfill from a browser redirect');
 await expect(page.locator('#complete-payment')).toContainText('retain an unresolved state until the original attempt is reconciled');
 await page.goto('/developers/api-reference');
 await expect(page.locator('#payment-to-deposit')).toContainText('Submission for funding is not confirmation of bank receipt.');
 await page.goto('/developers/webhooks');
 await expect(page.locator('#event-security')).toContainText('integration instructions');
 await expect(page.locator('#event-handler')).toContainText('Prevent duplicate deliveries');
});

test("documentation contents keep keyboard focus across responsive layouts", async ({ page }) => {
  for (const [path, desktop, mobile, width] of [
    ["/developers/getting-started", ".docs-toc", ".docs-mobile-toc", 1000],
  ] as const) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(path);
    const wideLink = page.locator(`${desktop} a`).first();
    const href = await wideLink.getAttribute("href");
    await wideLink.focus();
    await page.setViewportSize({ width, height: 1000 });
    const narrowLink = page.locator(`${mobile} a[href="${href}"]`);
    await expect(narrowLink).toBeFocused();
    await expect(page.locator(mobile)).toHaveAttribute("open", "");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(wideLink).toBeFocused();
    const home = page.getByRole("link", { name: "Etail Depot home", exact: true }).first();
    await home.focus();
    await page.setViewportSize({ width, height: 1000 });
    await expect(home).toBeFocused();
  }
});

test("merchant guidance retains recovery and reconciliation without fabricated records", async ({page}) => {
 await page.goto('/developers/developer-tools');
 await expect(page.locator('#request-result')).toContainText('Opening a link, scanning a QR code or viewing an invoice does not prove payment.');
 await page.goto('/developers/api-reference');
 await expect(page.locator('#uncertain-result')).toContainText('retain the unresolved attempt instead of submitting a new charge');
 await page.goto('/developers/api-reference');
 await expect(page.locator('#refund-payment')).toContainText('investigate that operation before repeating it');
 await expect(page.locator('#dispute-case')).toContainText('retain its acknowledgment');
 await page.goto('/developers/api-reference');
 await expect(page.locator('#reconcile')).toContainText('Compare the reported funding amount with the posted bank credit and reference');
});

test("restored diagrams and recovery guidance remain usable without API samples", async ({page}) => {
 await page.goto('/developers/getting-started');
 await expect(page.getByRole('figure',{name:'Checkout journey from order to verified payment',exact:true})).toBeVisible();
 await expect(page.locator('#server-setup')).toContainText('Request checkout setup instructions');
 await expect(page.locator('#completion-policy table')).toContainText('Which service submits the payment');
 const recovery=page.locator('#checkout-recovery details').first();
 await recovery.locator('summary').focus();await page.keyboard.press('Enter');
 await expect(recovery).toHaveAttribute('open','');
 await expect(recovery.locator('p')).toBeVisible();
 await page.keyboard.press('Enter');await expect(recovery).not.toHaveAttribute('open','');
 await page.goto('/developers/api-reference');
 await expect(page.getByRole('figure',{name:'From payment to bank deposit',exact:true})).toBeVisible();
 await expect(page.locator('#reconcile')).toContainText('Do not subtract a fee again');
 await page.goto('/developers/webhooks');
 await expect(page.getByRole('figure',{name:'From delivery to a verified update',exact:true})).toBeVisible();
 await expect(page.locator('#event-domains')).toContainText('Event delivery instructions');
 await expect(page.locator('#event-handler')).toContainText('Durably record the receipt');
});


test("blank registration email help leads to the illustrated recovery steps", async ({ page }) => {
 await page.goto('/resources/help#access');
 const question = page.locator('#access details').filter({hasText:'Why can’t I enter my email on the registration page?'});
 await question.locator('summary').focus();
 await page.keyboard.press('Enter');
 await question.getByRole('link', {name:'See where to enter your email',exact:true}).click();
 await expect(page).toHaveURL(/\/resources\/merchant-account-setup#registration-email$/);
 const recovery = page.locator('#registration-email');
 await expect(recovery.getByRole('heading')).toBeInViewport();
 await expect(recovery).toContainText('Choose Sign in above the Register New Account heading.');
 await expect(recovery).toContainText('For a new account, choose Register. For an existing account, choose Sign In.');
 await expect(page.locator('#create-account')).toContainText('If Welcome says your email is already registered, choose Sign In.');
 await expect(recovery.getByRole('img')).toHaveAttribute('src',/^\/_next\/static\/media\/blank-registration\.[^/]+\.jpg$/);
 await expect.poll(() => recovery.getByRole('img').evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
 await expect(page.locator('main form,main input,main iframe')).toHaveCount(0);
 await expect(page.getByRole('main').getByRole('link', {name:'Start now',exact:true})).toHaveAttribute('href','https://merchantapp.io/etaildepot/UserAccount/Login');
});

test("account screenshot instructions work without JavaScript at desktop and phone widths", async ({ browser }, testInfo) => {
 const context = await browser.newContext({javaScriptEnabled:false});
 const page = await context.newPage();
 for (const width of [1440,390,320]) {
  await page.setViewportSize({width,height:1000});
  await page.goto('http://127.0.0.1:3100/resources/merchant-account-setup#create-account');
  const signIn=page.locator('#sign-in');
  await expect(signIn.getByRole('link',{name:'Sign in to Trolleys',exact:true})).toHaveAttribute('href','https://merchantapp.io/etaildepot/UserAccount/Login');
  await expect(signIn).toContainText('continue the existing application');
  const guide=page.locator('#create-account');
  await expect(guide.getByRole('heading',{level:3})).toHaveText(['Enter your email on Welcome','Create your password','Continue your business application']);
  for(const image of await page.locator('#create-account figure img,#registration-email img').all()) {
   await image.scrollIntoViewIfNeeded();
   await expect.poll(() => image.evaluate(el => el instanceof HTMLImageElement && el.complete && el.naturalWidth === 1280)).toBe(true);
   expect(await image.getAttribute('alt')).toBeTruthy();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  const entry=guide.getByRole('link',{name:'Start now',exact:true});
  await expect(entry).toHaveAttribute('referrerpolicy','no-referrer');
  await expect(entry).toHaveAttribute('rel',/noreferrer/);
  await page.goto('http://127.0.0.1:3100/resources/merchant-account-setup#create-account');
  await page.screenshot({path:testInfo.outputPath(`account-guide-${width}.png`)});
  await page.goto('http://127.0.0.1:3100/resources/merchant-account-setup#registration-email');
  await page.screenshot({path:testInfo.outputPath(`account-recovery-${width}.png`)});
 }
 await context.close();
});


test("Help separates returning account access from new registration", async ({ page }) => {
 for (const [question, label, fragment] of [
  ['Where do I sign in to my merchant account?', 'sign in instructions', 'sign-in'],
  ['How do I create a merchant login?', 'account setup steps with screenshots', 'create-account'],
 ] as const) {
  await page.goto('/resources/help#access');
  const answer = page.locator('#access details').filter({has:page.locator('summary').filter({hasText:question})});
  await answer.locator('summary').focus();
  await page.keyboard.press('Enter');
  await answer.getByRole('link',{name:label,exact:true}).click();
  await expect(page).toHaveURL(new RegExp('/resources/merchant-account-setup#'+fragment+'$'));
  const section=page.locator('#'+fragment);
  await expect(section.getByRole('heading',{level:2})).toBeInViewport();
  const action=section.getByRole('link',{name:fragment==='sign-in'?'Sign in to Trolleys':'Start now',exact:true});
  await expect(action).toHaveAttribute('href','https://merchantapp.io/etaildepot/UserAccount/Login');
  await expect(action).toHaveAttribute('referrerpolicy','no-referrer');
  await expect(action).toHaveAttribute('rel',/noreferrer/);
  await expect(page.locator('main form,main input,main iframe')).toHaveCount(0);
 }
});


test("Guides shows references while Resources leads to email first account setup", async ({page}) => {
 await page.goto('/resources/guides');
 await expect(page.getByRole('main').getByRole('link')).toHaveCount(2);
 await expect(page.getByRole('main').getByRole('heading',{level:2})).toHaveText(['ISO 20022','ISO 8583']);
 const nav=await openMainNavigation(page,'Resources');
 await nav.getByRole('link',{name:'Merchant account setup',exact:true}).click();
 await expect(page).toHaveURL(/\/resources\/merchant-account-setup$/);
 await expect(page.locator('#create-account')).toContainText('Enter your email in the Email field, then choose Register');
 await expect(page.locator('#create-account')).toContainText('If Welcome says your email is already registered, choose Sign In.');
 const start=page.locator('#create-account').getByRole('link',{name:'Start now',exact:true});
 await expect(start).toHaveAttribute('href','https://merchantapp.io/etaildepot/UserAccount/Login');
 await expect(start).toHaveAttribute('referrerpolicy','no-referrer');
 await page.getByRole('link',{name:'Return to Welcome to correct it.',exact:true}).click();
 await expect(page.locator('#registration-email>h2')).toBeInViewport();
 await expect(page.locator('#registration-email')).toContainText('The Email field on Register New Account cannot be edited.');
 await expect(page.locator('main form,main input,main iframe')).toHaveCount(0);
});


test("account guide screenshots start before layout on direct links and refresh", async ({ page }) => {
 let releaseResources = () => {};
 let resourcesReady = Promise.resolve();
 let logoRequested = false;
 const requestedScreenshots = new Set<string>();
 await page.route("**/*", async route => {
  const request = route.request();
  const path = new URL(request.url()).pathname;
  if (path.startsWith("/_next/static/media/trolleys-portal-logo.")) logoRequested = true;
  if (/^\/resources\/help\/merchant-account\/[^/]+\.jpg$/.test(path) || /^\/_next\/static\/media\/(?:welcome|registration|blank-registration)\.[^/]+\.jpg$/.test(path)) requestedScreenshots.add(path);
  if (["stylesheet", "script"].includes(request.resourceType())) await resourcesReady;
  await route.continue();
 });
 // Request interception disables cache, including on refresh.
 for (const refresh of [false, true]) {
  logoRequested = false;
  requestedScreenshots.clear();
  resourcesReady = new Promise<void>(resolve => { releaseResources = resolve; });
  try {
   if (refresh) await page.reload({ waitUntil: "commit" });
   else await page.goto("/resources/merchant-account-setup#registration-email", { waitUntil: "commit" });
   await expect.poll(() => requestedScreenshots.size, { message: "All three account screenshots must start before layout or hydration, including on refresh" }).toBe(3);
  } finally { releaseResources(); }
  await page.waitForLoadState("load");
  expect(logoRequested, "The small logo must be embedded, with no separate image request").toBe(false);
  await expect(page.locator("main .brand-image-trolleys")).toHaveCount(2);
  for (const logo of await page.locator("main .brand-image-trolleys").all()) {
   await expect(logo).toHaveCSS("content", /url\("data:image\/png;base64,/);
  }
  const openingImages = page.locator('img[src^="/_next/static/media/welcome."]');
  await expect(openingImages).toHaveCount(1);
  for (const image of await openingImages.all()) {
   await expect(image).not.toHaveAttribute("loading", "lazy");
   await expect.poll(() => image.evaluate(el => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await expect(page.locator('img[src^="/_next/static/media/registration."]')).toHaveAttribute("loading", "eager");
  await expect(page.locator('img[src^="/_next/static/media/blank-registration."]')).toHaveAttribute("loading", "eager");
  await expect(page.locator(".docs-article figure img")).toHaveCount(3);
  for (const image of await page.locator(".docs-article figure img").all()) {
   await expect(image).toHaveAttribute("src", /^\/_next\/static\/media\/[^/]+\.jpg$/);
   await expect(image).toHaveAttribute("decoding", "sync");
   await expect.poll(() => image.evaluate(el => el instanceof HTMLImageElement && el.complete && el.naturalWidth === 1280)).toBe(true);
  }
  await expect(page.locator("#registration-email h2")).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
 }
});


test("Refresh does not paint a partial account guide while its HTML is arriving", async ({ page, baseURL, request }) => {
 await expectCompleteGuidePaint(page, request, baseURL, "/resources/merchant-account-setup", "#registration-email", "#registration-email h2");
});
