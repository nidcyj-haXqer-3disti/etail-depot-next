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
  if(item.group==="Developers")await expect(page.locator('.docs-coming-soon')).toHaveCount(0);
  await expect(page.locator('a[href="/developers/sdks"], a[href="/developers/changelog"], a[href="/developers/api-status"]')).toHaveCount(0);
  if(item.group === "Developers") {
   const nav=page.getByRole("navigation",{name:"Developer pages",includeHidden:true});
   await expect(nav.locator('a[aria-current="page"]')).toHaveAttribute("href",item.href);
   await expect(page.getByRole("banner").locator('a[href^="/developers/"]')).toHaveCount(DEVELOPER_NAVIGATION.length);
  }
  const headerNav=await openMainNavigation(page,item.group);
  await expect(headerNav.locator('a[aria-current="page"]')).toHaveAttribute("href",item.href);
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
 for(const [label,href] of [["Webhooks","/developers/webhooks"],["Testing","/developers/testing"]]) {
  const link=page.getByRole("navigation",{name:"Developer pages",includeHidden:true}).getByRole("link",{name:label,exact:true,includeHidden:true});
  if(await link.isVisible()) await link.click();
  else {
   const headerNav=await openMainNavigation(page,"Developers");
   await headerNav.getByRole("link",{name:label,exact:true}).click();
  }
  await expect(page).toHaveURL(href);
 }
 await page.goBack();await expect(page).toHaveURL(/\/developers\/webhooks$/);
 const nav=await openMainNavigation(page,"Resources");await nav.getByRole('link',{name:'Merchant account setup',exact:true}).click();await expect(page).toHaveURL(/\/resources\/merchant-account-setup$/);
});

test("existing guidance stays distinct from unavailable Etail APIs",async({page})=>{
 for(const slug of ["getting-started","api-reference","webhooks","testing","developer-tools"]){
  await page.goto('/developers/'+slug);
  if(slug==="getting-started"){
   await expect(page.locator('#checkout')).toContainText('Connect Cybersource Unified Checkout');
   await expect(page.locator('#checkout')).toContainText('No API integration with the portal is required for this setup.');
  }else if(slug==="api-reference")await expect(page.locator('#api-credentials')).toContainText('It is not an Etail API.');
  else if(slug==="webhooks")await expect(page.locator('#event-domains')).toContainText('It is not an Etail webhook service.');
  else if(slug==="testing")await expect(page.locator('#testing-and-launch-specifications')).toContainText('There is no Etail test API.');
  else await expect(page.locator('#integration-tools')).toContainText('Etail does not provide a separate API or SDK');
  await expect(page.locator('.docs-article')).not.toContainText(/ORD-1048|tx_demo|sk_test|transientToken|example API|mocked/i);
  await expect(page.locator('main form,main iframe')).toHaveCount(0);
  await expect(page.locator('.docs-article pre')).toHaveCount(slug==="api-reference"?3:0);
 }
 for(const slug of ['sdks','changelog','api-status']){
  await page.goto('/developers/'+slug);
  const notice=page.locator('.docs-availability');
  await expect(notice.getByRole('link',{name:'Shopify',exact:true})).toHaveAttribute('href','/resources/shopify-gateway-integration');
  await expect(notice.getByRole('link',{name:'WooCommerce',exact:true})).toHaveAttribute('href','/resources/woocommerce-gateway-integration');
  await expect(notice.locator('a[href="/resources/guides"]')).toHaveCount(0);
 }
});

test("approved merchants can choose the correct connection without exposing account input",async({page,browser})=>{
 await page.goto('/developers/getting-started?merchant=private-input#portal-access');
 const portals=page.locator('#portal-access');
 for(const [name,url] of [
  ['Open Back Office','https://backoffice.infinicept.com/etaildepot/login'],
  ['Open Business Center','https://ebc2.cybersource.com/ebc2/'],
 ]){
  const link=portals.getByRole('link',{name,exact:true});
  await expect(link).toHaveAttribute('href',url);
  await expect(link).toHaveAttribute('referrerpolicy','no-referrer');
  await expect(link).toHaveAttribute('rel','noreferrer');
 }
 await expect(page.locator('#integration-access')).toContainText('The processing MID and gateway Organization ID may be different.');
 await expect(page.locator('#integration-access')).toContainText('A portal password is not an API key.');
 await page.locator('#checkout').getByRole('link',{name:'WooCommerce integration',exact:true}).click();
 await expect(page).toHaveURL(/\/resources\/woocommerce-gateway-integration$/);
 await page.goBack();
 await expect(page).toHaveURL(/\/developers\/getting-started/);
 await expect(page.locator('#checkout').getByRole('link',{name:'Shopify integration',exact:true})).toHaveAttribute('href','/resources/shopify-gateway-integration');
 await expect(page.locator('#checkout').getByRole('link',{name:'Custom website API reference',exact:true})).toHaveAttribute('href','/developers/api-reference');
 await expect(page.locator('#payment-methods')).toContainText('Unified Checkout setup is not required for that path.');
 const context=await browser.newContext({javaScriptEnabled:false,viewport:page.viewportSize()!});
 const plain=await context.newPage();
 try{
  await plain.goto('http://127.0.0.1:3100/developers/getting-started');
  await expect(plain.locator('.docs-section > h2')).toHaveCount(5);
  const wallet=plain.locator('#payment-methods details');
  await wallet.locator('summary').click();
  await expect(wallet.locator('code')).toBeVisible();
  await plain.locator('#complete-payment').getByRole('link',{name:'Review the testing checklist',exact:true}).click();
  await expect(plain).toHaveURL(/\/developers\/testing$/);
 }finally{await context.close();}
});

test("phone readers can jump to each topic without another navigation layer",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const slug of ['getting-started','api-reference','webhooks','testing','developer-tools']){
  await page.goto('/developers/'+slug);const toc=page.locator('.docs-mobile-toc');
  await toc.locator('summary').focus();await page.keyboard.press('Enter');const last=toc.getByRole('link').last();const href=await last.getAttribute('href');await last.click();await expect(page.locator(href+' > h2')).toBeInViewport();
 }
});

test("testing and tools work without JavaScript or an embedded provider connection",async({browser,page})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:page.viewportSize()!});
 const plain=await context.newPage();
 const vendorRequests:string[]=[];
 plain.on('request',request=>{if(/cybersource\.com|visaacceptance\.com|infinicept\.com/.test(new URL(request.url()).hostname))vendorRequests.push(request.url());});
 try{
  await plain.goto('http://127.0.0.1:3100/developers/testing');
  await expect(plain.locator('.docs-section > h2')).toHaveCount(6);
  await expect(plain.locator('#testing-and-launch-specifications')).toContainText('https://apitest.cybersource.com');
  await expect(plain.locator('#production-readiness')).toContainText('Sandbox test cards must never be used for live transactions.');
  const methods=plain.locator('#acceptance-tests details').first();
  expect(await methods.evaluate(element => Boolean(element.compareDocumentPosition(document.querySelector('#acceptance-tests > .docs-facts')!) & Node.DOCUMENT_POSITION_PRECEDING))).toBe(true);
  await methods.locator('summary').focus();await plain.keyboard.press('Enter');
  await expect(methods).toHaveAttribute('open','');
  await expect(methods).toContainText('Domain verification and the wallet test setup are separate.');
  await plain.locator('#customer-journey').getByRole('link',{name:'Find the right records and tools',exact:true}).click();
  await expect(plain).toHaveURL(/\/developers\/developer-tools#account-records$/);
  await expect(plain.locator('#account-records > h2')).toBeInViewport();
  const lookup=plain.locator('#account-records details');
  await lookup.locator('summary').click();
  await expect(lookup).toContainText('An empty search result does not establish that a payment failed');
  await expect(plain.locator('#integration-tools')).toContainText('No API integration with the Back Office Operations Portal is required for standard merchant checkout.');
  await expect(plain.locator('#sandbox-tools').getByRole('link',{name:'Open sandbox utilities',exact:true})).toHaveAttribute('href','https://developer.cybersource.com/hello-world.html');
  const hosted=plain.locator('#payment-requests details');await hosted.locator('summary').click();
  await expect(hosted).toContainText('A QR code opens the same hosted destination');
  await expect(plain.locator('main form,main input,main iframe,main pre')).toHaveCount(0);
  expect(vendorRequests).toEqual([]);
  expect(await plain.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 }finally{await context.close();}
});

test("legacy testing and payment-request bookmarks reach the relevant new sections",async({page})=>{
 for(const [old,anchor,path,target] of [
  ['/docs/testing-and-launch','testing-and-launch','/developers/testing','testing-and-launch-specifications'],
  ['/developers/testing','technical-review','/developers/testing','production-readiness'],
  ['/docs/payment-requests','request-result','/developers/developer-tools','payment-requests'],
  ['/developers/developer-tools','request-follow-up','/developers/developer-tools','payment-requests'],
 ]){
  await page.goto(old+'#'+anchor);
  await expect(page).toHaveURL(url=>url.pathname===path&&url.hash==='#'+anchor);
  await expect(page.locator('#'+target+' > h2')).toBeInViewport();
  await page.reload();
  await expect(page.locator('#'+target+' > h2')).toBeInViewport();
 }
});

test("launch support retains the original attempt and a useful handoff",async({page})=>{
 await page.goto('/developers/testing');
 await expect(page.locator('#acceptance-tests')).toContainText('a malformed request tests validation, not an issuer decline.');
 await expect(page.locator('#acceptance-tests')).toContainText('Resolve the original attempt before another charge');
 await expect(page.locator('#customer-journey')).toContainText('may not appear in the live merchant portal.');
 await expect(page.locator('#production-readiness')).toContainText('A software rollback does not reverse a payment already accepted.');
 await page.locator('#ongoing-support').getByRole('link',{name:'Prepare an integration support request',exact:true}).click();
 await expect(page).toHaveURL(/\/developers\/developer-tools#support-handoff$/);
 await expect(page.locator('#support-handoff > h2')).toBeInViewport();
 await expect(page.locator('#support-handoff')).toContainText('timestamp with time zone');
 await expect(page.locator('#support-handoff')).toContainText('Remove card numbers, security codes, passwords');
 await expect(page.locator('#support-handoff').getByRole('link',{name:'Contact integration support',exact:true})).toHaveAttribute('href','/company/contact#integration');
 await expect(page.locator('#payment-requests')).toContainText('Do not assume Pay by Link or invoicing is included because you can sign in.');
});

test("Cybersource reference is readable without JavaScript and never loads payment fields",async({browser,page})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:page.viewportSize()!});
 const plain=await context.newPage();
 const vendorRequests:string[]=[];
 plain.on('request',request=>{if(/cybersource\.com|visaacceptance\.com/.test(new URL(request.url()).hostname))vendorRequests.push(request.url());});
 try{
  await plain.goto('http://127.0.0.1:3100/developers/api-reference');
  await expect(plain.locator('.docs-section > h2')).toHaveCount(7);
  const request=plain.locator('#create-session details');
  await request.locator('summary').focus();await plain.keyboard.press('Enter');
  const sample=plain.getByRole('region',{name:'Server · Session request body. Scroll horizontally if needed.',exact:true});
  await expect(sample).toBeVisible();
  const payload=JSON.parse(await sample.innerText());
  expect(payload.completeMandate.type).toBe('CAPTURE');
  expect(payload.data.orderInformation.amountDetails).toEqual({totalAmount:'24.00',currency:'USD'});
  expect(payload.targetOrigins).toEqual(['https://shop.example.com']);
  const browserCode=plain.locator('#display-checkout details').first();
  await browserCode.locator('summary').click();
  await expect(browserCode.locator('pre').last()).toContainText('checkout.mount');
  await expect(plain.locator('#display-checkout')).toContainText('Do not submit that result as a new payment');
  await expect(plain.locator('#payment-status')).toContainText('A browser message, redirect or decoded token is not sufficient evidence');
  expect(await plain.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect(plain.locator('main iframe,main form,main input,script[src*="cybersource"],script[src*="visaacceptance"]')).toHaveCount(0);
  expect(vendorRequests).toEqual([]);
 }finally{await context.close();}
});

test("former API reference bookmarks still lead to the relevant guidance",async({page})=>{
 await page.goto('/developers/api-reference');
 for(const anchor of ['payment-status','find-payment','read-status','uncertain-result','reporting-results','support-reference','refunds-and-disputes','choose-action','refund-payment','dispute-case','financial-impact','payouts','payment-to-deposit','reconcile','funding-status','payout-help','funding-instructions']){
  await expect(page.locator('#'+anchor)).toHaveCount(1);
 }
 await page.goto('/docs/refunds-and-disputes#refund-payment');
 await expect(page.locator('#refund-payment h3')).toBeInViewport();
 await page.goto('/docs/payouts#payment-to-deposit');
 await expect(page.locator('#payment-to-deposit h3')).toBeInViewport();
});

test("webhook setup remains static, accessible and readable without JavaScript",async({browser,page})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:page.viewportSize()!});
 const plain=await context.newPage();
 const providerRequests:string[]=[];
 plain.on('request',request=>{if(/cybersource\.com|visaacceptance\.com/.test(new URL(request.url()).hostname))providerRequests.push(request.url());});
 try{
  await plain.goto('http://127.0.0.1:3100/developers/webhooks');
  await expect(plain.locator('.docs-section > h2')).toHaveCount(6);
  await expect(plain.locator('#event-domains')).toContainText('uc.orders.transactionresults');
  await expect(plain.locator('#event-domains')).toContainText('not a subscription to every later capture, refund or bank deposit');
  const setup=plain.locator('#webhooks-specifications details');
  await setup.locator('summary').focus();await plain.keyboard.press('Enter');
  await expect(setup.getByRole('table')).toBeVisible();
  await expect(setup).toContainText('/notification-subscriptions/v2/webhooks');
  const security=plain.locator('#event-security details');
  await security.locator('summary').click();
  await expect(security.getByRole('link',{name:'Register the certificate',exact:true})).toBeVisible();
  await expect(plain.locator('#event-security')).toContainText('unique asymmetric certificate for each webhook subscription');
  await expect(plain.locator('#payment-event')).toContainText('changes on retries');
  await expect(plain.locator('#event-handler')).toContainText('Return the required acknowledgment only after that work is safely recorded');
  await expect(plain.locator('main form,main iframe,main input')).toHaveCount(0);
  expect(providerRequests).toEqual([]);
  expect(await plain.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await plain.goto('http://127.0.0.1:3100/docs/webhooks#event-handler');
  await expect(plain).toHaveURL(url=>url.pathname==='/developers/webhooks'&&url.hash==='#event-handler');
  await expect(plain.locator('#event-handler > h2')).toBeInViewport();
 }finally{await context.close();}
 await page.goto('/developers/api-reference#uncertain-result');
 await page.getByRole('link',{name:'Set up payment notifications',exact:true}).click();
 await expect(page).toHaveURL(/\/developers\/webhooks$/);
 await page.getByRole('link',{name:'Recover an uncertain payment',exact:true}).click();
 await expect(page).toHaveURL(/\/developers\/api-reference#uncertain-result$/);
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
 await expect(page.locator('#checkout')).toContainText('a secure server to create checkout sessions and verify payment results');
 await expect(page.locator('#complete-payment')).toContainText('Account approval comes before connection testing.');
 await expect(page.locator('#complete-payment')).toContainText('A browser redirect alone does not prove payment.');
 await expect(page.locator('#complete-payment')).toContainText('check the original attempt in Cybersource before trying another charge');
 await page.goto('/developers/api-reference');
 await expect(page.locator('#payment-to-deposit')).toContainText('Submission for funding is not confirmation of bank receipt.');
 await page.goto('/developers/webhooks');
 await expect(page.locator('#event-security')).toContainText('Use both decryption and signature verification');
 await expect(page.locator('#payment-event')).toContainText('Prevent duplicate deliveries');
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
 await expect(page.locator('#payment-requests')).toContainText('Opening a link, scanning a QR code or viewing an invoice does not prove payment.');
 await page.goto('/developers/api-reference');
 await expect(page.locator('#uncertain-result')).toContainText('retain the unresolved attempt instead of submitting a new charge');
 await page.goto('/developers/api-reference');
 await expect(page.locator('#refund-payment')).toContainText('investigate that operation before repeating it');
 await expect(page.locator('#dispute-case')).toContainText('retain its acknowledgment');
 await page.goto('/developers/api-reference');
 await expect(page.locator('#payment-to-deposit')).toContainText('Compare the reported funding amount with the posted bank credit and reference');
});

test("account setup and payment guidance retain native disclosures and distinct provider roles", async ({page}) => {
 await page.goto('/developers/getting-started');
 await expect(page.locator('#portal-access')).toContainText('One login for your assigned MIDs.');
 await expect(page.locator('#portal-access')).toContainText('Organization ID, User ID');
 const wallet=page.locator('#payment-methods details');
 await wallet.locator('summary').focus();await page.keyboard.press('Enter');
 await expect(wallet).toHaveAttribute('open','');
 await expect(wallet.locator('code')).toHaveText('https://yourstore.com/.well-known/apple-developer-merchantid-domain-association');
 await expect(wallet).toContainText('not the private .p12 encryption certificate');
 await page.keyboard.press('Enter');await expect(wallet).not.toHaveAttribute('open','');
 await page.goto('/developers/api-reference');
 await expect(page.locator('#reconcile')).toContainText('Compare Cybersource’s transaction records with the related merchant account activity.');
 await expect(page.locator('#payment-to-deposit')).toContainText('Do not subtract a fee again');
 await page.goto('/developers/webhooks');
 await expect(page.getByRole('figure',{name:'From delivery to a verified update',exact:true})).toBeVisible();
 await expect(page.locator('#event-domains')).toContainText('uc.orders.transactionresults');
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
  await expect(guide.getByRole('heading',{level:3})).toHaveText(['Enter your email on Welcome','Create your password','Complete your company profile','Add owners and contacts','Enter your bank details','Review and submit','Check your application status']);
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
 // WebKit can reuse decoded images on refresh even with request interception.
 for (const refresh of [false, true]) {
  logoRequested = false;
  requestedScreenshots.clear();
  resourcesReady = new Promise<void>(resolve => { releaseResources = resolve; });
  try {
   if (refresh) await page.reload({ waitUntil: "commit" });
   else await page.goto("/resources/merchant-account-setup#registration-email", { waitUntil: "commit" });
   await expect.poll(async () => {
    const cached = await page.locator(".docs-article figure img").evaluateAll(images => images.flatMap(image =>
     image instanceof HTMLImageElement && image.complete && image.naturalWidth === 1280
      ? [new URL(image.currentSrc || image.src).pathname] : []));
    return new Set([...requestedScreenshots, ...cached]).size;
   }, { message: "All three account screenshots must start or already be decoded before layout or hydration, including on refresh" }).toBe(3);
  } finally { releaseResources(); }
  await page.waitForLoadState("load");
  expect(logoRequested, "The small logo must be embedded, with no separate image request").toBe(false);
  await expect(page.locator("main .brand-image-trolleys")).toHaveCount(9);
  for (const logo of await page.locator("main .brand-image-trolleys").all()) {
   await expect(logo).toHaveCSS("content", /url\("data:image\/webp;base64,/);
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


test("merchant setup explains the complete application and a separate additional DBA", async ({page}) => {
 await page.goto('/resources/merchant-account-setup#bank-details');
 await expect(page.locator('#bank-details h3')).toBeInViewport();
 await page.reload();
 await expect(page.locator('#bank-details h3')).toBeInViewport();
 await expect(page.locator('#bank-details')).toContainText('not your debit card number');
 await expect(page.locator('#owners-and-contacts')).toContainText('without +1');
 await expect(page.locator('#application-submitted')).toContainText('Additional checks can take longer.');
 await expect(page.locator('#application-submitted')).toContainText('Wait for account approval');
 const extra=page.locator('#additional-mid');
 await expect(extra.getByRole('heading',{level:3})).toHaveText(['Choose + Location','Enter the new DBA','Review and follow its status']);
 await expect(extra).toContainText('same LLC or corporation');
 await expect(extra).toContainText('Wait for the additional MID to be approved');
 await expect(extra.getByRole('figure')).toHaveCount(3);
 await expect(page.locator('main input,main form,main iframe')).toHaveCount(0);
 await page.goto('/resources/merchant-account-setup#application-review');
 const help=page.locator('#application-review details');
 await help.locator('summary').click();
 await expect(help).toHaveAttribute('open','');
 await expect(help).toContainText('Billing descriptor');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
});
