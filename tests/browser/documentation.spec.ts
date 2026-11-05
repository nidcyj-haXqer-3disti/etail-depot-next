import { expect, test, type Page } from "@playwright/test";
import { openMainNavigation } from "./public-header";
import { openFooterGroup } from "./public-footer";
import { documentationPages, documentationPath, documentationServiceLinks } from "../../src/modules/public-site/documentation-catalog";

async function openDocumentationTopic(page: Page, slug: string) {
 const topics=page.getByRole('navigation',{name:'Documentation topics'});
 if(await topics.isVisible()) {
  await topics.locator(`a[href="/docs/${slug}"]`).click();
 } else {
  const navigation=await openMainNavigation(page,"Developers");
  const direct=navigation.locator(`a[href="/docs/${slug}"]`);
  if(await direct.isVisible())await direct.click();
  else {
   await navigation.getByRole('link',{name:'Documentation',exact:true}).click();
   await page.locator(`.docs-task-paths a[href^="/docs/${slug}"]`).first().click();
  }
 }
 await expect(page).toHaveURL(url=>url.pathname==='/docs/'+slug);
}

test("all documentation tasks have working sections, unique canonicals and local publication protection",async({page,request})=>{
 const sitemap=await(await request.get('/sitemap.xml')).text();
 for(const item of documentationPages){
  const path=documentationPath(item.slug); const response=await page.goto(path);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading',{level:1})).toHaveText(item.title);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://etaildepot.com${path}`);
  expect(sitemap).not.toContain(path);
  const navigation=await openMainNavigation(page, "Developers");
  const direct = ["merchant-onboarding", "integration-access", "checkout", "webhooks", "testing-and-launch"].includes(item.slug);
  const current = navigation.locator("a[aria-current]");
  await expect(current).toHaveCount(1);
  await expect(current).toHaveAttribute("href", direct ? path : "/docs");
  await expect(current).toHaveAttribute("aria-current", direct ? "page" : "location");
  const menu=page.getByRole('banner').getByRole('button',{name:'Menu',exact:true});
  if(await menu.isVisible())await menu.click();
  await expect((await openFooterGroup(page, 'Developers')).getByRole('link',{name:'Documentation',exact:true})).toHaveAttribute('href','/docs');
  const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));
  expect(new Set(ids).size).toBe(ids.length);
  for(const href of await page.locator('main a[href^="#"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')!))){
   expect(await page.locator(`[id="${href.slice(1)}"]`).count(),`${path}${href}`).toBe(1);
  }
  for(const href of await page.locator('main a[href^="/docs"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')!))){
   expect(['/docs',...documentationPages.map(p=>documentationPath(p.slug))]).toContain(href.split('#')[0]);
  }
  await expect(page.locator('main form, main iframe, main input')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/Private draft|for review|coming soon|fake API|TODO/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 }
});

test("documentation distinguishes approval, payment results and bank receipt",async({page})=>{
 await page.goto('/docs/merchant-onboarding');
 await expect(page.locator('#application-review')).toContainText('Creating a login is not approval to accept payments.');
 await expect(page.locator('#account-readiness')).toContainText('Wait for account approval and confirmation that your payment setup is ready.');
 await page.goto('/docs/checkout');
 await expect(page.locator('.docs-article-heading')).toContainText('verify the payment result and recover an interrupted attempt');
 await expect(page.locator('main')).toContainText('The checkout connection and instructions provided for your merchant account');
 await expect(page.locator('#complete-payment')).toContainText('Do not fulfill from a browser redirect');
 await expect(page.locator('#complete-payment')).toContainText('retain an unresolved state until the original attempt is reconciled');
 await page.goto('/docs/payouts');
 await expect(page.locator('#payment-to-deposit')).toContainText('Submission for funding is not confirmation of bank receipt.');
 await page.goto('/docs/webhooks');
 await expect(page.locator('#event-security')).toContainText('integration instructions');
 await expect(page.locator('#event-handler')).toContainText('Prevent duplicate deliveries');
});

test("topic navigation and browser back support complete reading journeys",async({page})=>{
 await page.goto('/docs');
 await page.locator('.docs-task-paths').getByRole('link',{name:'Prepare your integration',exact:true}).click();
 await expect(page).toHaveURL(/\/docs\/integration-access$/);
 await openDocumentationTopic(page,'checkout');
 await expect(page).toHaveURL(/\/docs\/checkout$/);
 await openDocumentationTopic(page,'webhooks');
 await page.goBack();await expect(page).toHaveURL(/\/docs\/checkout$/);
});

test("old documentation section bookmarks still identify their corresponding task",async({page})=>{
 for(const [anchor,slug] of [['getting-started','merchant-onboarding'],['checkout-setup','checkout'],['payment-records','payment-status'],['payouts','payouts'],['refunds-and-disputes','refunds-and-disputes'],['testing-and-launch','testing-and-launch']]){
  await page.goto('/docs#'+anchor);
  await expect(page.locator('#'+anchor)).toBeInViewport();
  await expect(page.locator('#'+anchor+` a[href^="/docs/${slug}"]`)).toHaveCount(1);
 }
});

test("responsive topic navigation retains keyboard focus",async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/docs/checkout');
 const nav=page.getByRole('navigation',{name:'Documentation topics'});
 await nav.locator('.docs-nav-desktop').getByRole('link',{name:'Payment status',exact:true}).focus();
 await page.setViewportSize({width:390,height:900});
 await expect(nav).toBeHidden();
 await expect(page.getByText('Browse topics',{exact:true})).toHaveCount(0);
 await expect(page.getByRole('heading',{level:1})).toBeFocused();
 await page.setViewportSize({width:1440,height:1000});
 await expect(nav).toBeVisible();
 await expect(page.getByRole('heading',{level:1})).toBeFocused();
});


test("merchant journey connects service, use case and account instructions without requiring developer access",async({page})=>{
 await page.goto('/payment-acceptance-service');
 const navigation=await openMainNavigation(page, "Use cases");
 await navigation.getByRole('link',{name:'Online businesses',exact:true}).click();
 await expect(page).toHaveURL(/\/online-businesses$/);
 const docsNavigation=await openMainNavigation(page, "Developers");
 await docsNavigation.getByRole('link',{name:'Documentation',exact:true}).click();
 await page.locator('.docs-task-paths').getByRole('link',{name:'Set up an account',exact:true}).click();
 await expect(page).toHaveURL(/\/docs\/merchant-onboarding$/);
 const portal=page.getByRole('main').getByRole('link',{name:'Start now',exact:true});
 await expect(portal).toHaveAttribute('href','https://merchantapp.io/etaildepot/UserAccount/Login');
 await expect(portal).toHaveAttribute('referrerpolicy','no-referrer');
 await openDocumentationTopic(page,'payment-requests');
 await expect(page).toHaveURL(/\/docs\/payment-requests$/);
 for(const destination of ['payment-status','refunds-and-disputes','payouts']){
  await openDocumentationTopic(page,destination);
 }
 await expect(page.locator('.docs-next')).toHaveCount(0);
 await (await openFooterGroup(page, 'Services')).getByRole('link',{name:'Payouts',exact:true}).click();
 await expect(page).toHaveURL(/\/payouts-and-reconciliation$/);
 await page.getByRole('banner').getByRole('link',{name:'Etail Depot home',exact:true}).click();
 await page.locator('main').getByRole('link',{name:'Explore merchant services',exact:true}).click();
 await expect(page).toHaveURL(/\/payment-acceptance-service$/);
});

test("platform implementation progresses to testing and returns to its use case",async({page})=>{
 await page.goto('/software-partners');
 await page.getByRole('main').getByRole('link',{name:'Explore developer integration',exact:true}).click();
 await expect(page).toHaveURL(/\/docs#developer-integration$/);
 await page.locator('.docs-task-paths').getByRole('link',{name:'Prepare your integration',exact:true}).click();
 await expect(page).toHaveURL(/\/docs\/integration-access$/);
 const team=page.getByRole('main').getByRole('link',{name:'integration team',exact:true});
 await team.focus();
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/\/contact#integration$/);
 await expect(page.locator('[data-merchant-contact]').getByRole('heading')).toBeInViewport();
 await expect(page.locator('[data-merchant-contact] a')).toHaveAttribute('href','mailto:trolleys@etaildepot.com');
 await page.goBack();
 await expect(page).toHaveURL(/\/docs\/integration-access$/);
 for(const destination of ['checkout','webhooks','testing-and-launch']){
  await openDocumentationTopic(page,destination);
 }
 await expect(page.locator('#production-readiness')).toContainText('Confirm with your account team who will perform the live checks, which actions and amounts are permitted, and when to stop.');
 const navigation=await openMainNavigation(page, "Use cases");
 await navigation.getByRole('link',{name:'Software platforms',exact:true}).click();
 await expect(page).toHaveURL(/\/software-partners$/);
});

test("card inquiries stay separate from merchant applications and developer access",async({page})=>{
 await page.goto('/docs');
 const navigation=await openMainNavigation(page);
 await navigation.getByRole('link',{name:'Card services',exact:true}).click();
 await expect(page).toHaveURL(/\/credit-card-services$/);
 await expect(page.getByRole('main')).toContainText('An inquiry is not an application.');
 await expect(page.getByRole('main').locator('a[href^="https://merchantapp.io/etaildepot/UserAccount/Login"],a[href^="/docs"]')).toHaveCount(0);
 for(const link of await page.getByRole('main').getByRole('link',{name:'Ask about card services',exact:true}).all())await expect(link).toHaveAttribute('href','/contact#cards');
});


test("documentation contents keep keyboard focus across responsive layouts", async ({ page }) => {
  for (const [path, desktop, mobile, width] of [
    ["/docs/checkout", ".docs-toc", ".docs-mobile-toc", 1000],
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

test("documentation requests assigned specifications without publishing simulated API instructions", async ({page}) => {
 for (const item of documentationPages) {
  const response=await page.goto(documentationPath(item.slug));
  const html=await response!.text();
  expect(html).not.toMatch(/cybersource|infinicept|launchpay|commandFingerprint|DepositStatus|UnifiedCheckout|\bSDKs?\b/i);
  await expect(page.locator('.docs-article pre, .docs-code')).toHaveCount(0);
  await expect(page.locator('.docs-article a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('.docs-contact, .docs-specifications-link')).toHaveCount(0);
  await expect(page.locator('.docs-next, .docs-service-context')).toHaveCount(0);
  await expect(page.locator('.docs-article')).not.toContainText(/ORD-1048|tx_demo|sk_test|totalAmount|transientToken|example API|mocked/i);
  await expect(page.getByRole('main')).not.toContainText(/\b(?:SDKs?|training|testing|tests?|tested|retesting|retests?|fixtures?)\b/i);
 }
});

test("merchant guidance retains recovery and reconciliation without fabricated records", async ({page}) => {
 await page.goto('/docs/payment-requests');
 await expect(page.locator('#request-result')).toContainText('Opening a link, scanning a QR code or viewing an invoice does not prove payment.');
 await page.goto('/docs/payment-status');
 await expect(page.locator('#uncertain-result')).toContainText('retain the unresolved attempt instead of submitting a new charge');
 await page.goto('/docs/refunds-and-disputes');
 await expect(page.locator('#refund-payment')).toContainText('investigate that operation before repeating it');
 await expect(page.locator('#dispute-case')).toContainText('retain its acknowledgment');
 await page.goto('/docs/payouts');
 await expect(page.locator('#reconcile')).toContainText('Compare the reported funding amount with the posted bank credit and reference');
});

test("merchant checkout integration starts with access and retains its reader path", async ({page}) => {
 await page.goto('/docs/merchant-onboarding');
 await openDocumentationTopic(page,'integration-access');
 await expect(page).toHaveURL(/\/docs\/integration-access$/);
 await expect(page.getByRole('heading',{name:'What you need',exact:true})).toBeVisible();
 await openDocumentationTopic(page,'checkout');
 await openDocumentationTopic(page,'webhooks');
 await openDocumentationTopic(page,'testing-and-launch');
});

test("every article retains its reading path through topic navigation", async ({page}) => {
 for(const item of documentationPages){
  await page.goto(documentationPath(item.slug));
  await expect(page.getByRole('navigation',{name:'Breadcrumb',exact:true})).toHaveCount(0);
  const graph=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.flatMap(node=>JSON.parse(node.textContent!)["@graph"]??[]));
  expect(graph.find(node=>node['@type']==='BreadcrumbList').itemListElement.map((node:{name:string})=>node.name)).toEqual(['Documentation',item.group,item.title]);
  const topics=page.getByRole('navigation',{name:'Documentation topics'});
  if(await topics.isVisible()) {
   await expect(topics.locator('a[aria-current="page"]')).toHaveText(item.title);
   await topics.getByRole('link',{name:'Overview',exact:true}).click();
  } else {
   await expect(page.getByText('Browse topics',{exact:true})).toHaveCount(0);
   const navigation=await openMainNavigation(page,"Developers");
   await navigation.getByRole('link',{name:'Documentation',exact:true}).click();
  }
  await expect(page).toHaveURL(/\/docs$/);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Documentation');
  await expect(page.getByRole('navigation',{name:'Breadcrumb',exact:true})).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`/docs/${item.slug}$`));
 }
});

test("restored diagrams and recovery guidance remain usable without API samples", async ({page}) => {
 await page.goto('/docs/checkout');
 await expect(page.getByRole('figure',{name:'Checkout journey from order to verified payment',exact:true})).toBeVisible();
 await expect(page.locator('#server-setup')).toContainText('Request checkout setup instructions');
 await expect(page.locator('#completion-policy table')).toContainText('Which service submits the payment');
 const recovery=page.locator('#checkout-recovery details').first();
 await recovery.locator('summary').focus();await page.keyboard.press('Enter');
 await expect(recovery).toHaveAttribute('open','');
 await expect(recovery.locator('p')).toBeVisible();
 await page.keyboard.press('Enter');await expect(recovery).not.toHaveAttribute('open','');
 await page.goto('/docs/payouts');
 await expect(page.getByRole('figure',{name:'From payment to bank deposit',exact:true})).toBeVisible();
 await expect(page.locator('#reconcile')).toContainText('Do not subtract a fee again');
 await page.goto('/docs/webhooks');
 await expect(page.getByRole('figure',{name:'From delivery to a verified update',exact:true})).toBeVisible();
 await expect(page.locator('#event-domains')).toContainText('Event delivery instructions');
 await expect(page.locator('#event-handler')).toContainText('Durably record the receipt');
});


test("documentation support remains accessible through shared Help navigation", async ({page}) => {
 for(const item of documentationPages){
  await page.goto('/docs/'+item.slug);
  await expect(page.locator('.docs-article a[href^="mailto:"]')).toHaveCount(0);
  const service=page.locator('.docs-article .docs-service-link');
  if(item.slug === 'merchant-onboarding') await expect(service).toHaveCount(0);
  else {
   await expect(service).toHaveCount(1);
   await expect(service).toHaveAttribute('href',documentationServiceLinks[item.slug].href);
  }
  await expect(page.locator('.docs-section a[href^="/software-partners"], .docs-section a[href^="/online-businesses"]')).toHaveCount(0);
  await openMainNavigation(page, "Resources");
  const help=page.getByRole('banner').getByRole('link',{name:'Help center',exact:true});
  await help.click();
  await expect(page).toHaveURL(/\/help$/);
  await expect(page.getByRole('main').locator('a[href="mailto:trolleys@etaildepot.com"]').first()).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(new RegExp('/docs/'+item.slug+'$'));
 }
});

test("each task has one relevant service connection and matching search context",async({page})=>{
 for(const item of documentationPages){
  await page.goto(documentationPath(item.slug));
  const service=documentationServiceLinks[item.slug];
  const link=page.locator('.docs-service-link');
  if(item.slug === 'merchant-onboarding') await expect(link).toHaveCount(0);
  else await expect(link).toHaveText(service.label);
  const graph=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.flatMap(node=>JSON.parse(node.textContent!)["@graph"]??[]));
  const webPage=graph.find(node=>node['@type']==='WebPage');
  const canonical=await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(webPage.url).toBe(canonical);
  expect(webPage.name).toBe(`${item.title} documentation`);
  expect(webPage.description).toBe(await page.locator('meta[name="description"]').getAttribute('content'));
  const breadcrumb=graph.find(node=>node['@type']==='BreadcrumbList');
  expect(breadcrumb.itemListElement.at(-1).item).toBe(canonical);
  if(item.slug === 'merchant-onboarding') continue;
  await link.click();
  await expect(page).toHaveURL(url=>url.pathname+url.hash===service.href);
  if(service.href.includes('#'))await expect(page.locator('#'+service.href.split('#')[1])).toBeInViewport();
  await page.goBack();
  await expect(page).toHaveURL(url=>url.pathname===documentationPath(item.slug));
 }
});


test("phone readers reach document sections before the preparation panels", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const item of documentationPages) {
    await page.goto(documentationPath(item.slug));
    const contents = page.locator(".docs-mobile-toc");
    const before = await contents.boundingBox();
    const preparation = await page.locator(item.slug === "merchant-onboarding" ? ".docs-section" : ".docs-prerequisites").first().boundingBox();
    expect(before!.y).toBeLessThan(preparation!.y);
    expect(before!.y).toBeLessThan(680);
    await contents.locator("summary").focus(); await page.keyboard.press("Enter");
    const target = contents.getByRole("link").last();
    const href = await target.getAttribute("href");
    await target.click();
    await expect(page.locator(href! + " > h2")).toBeInViewport();
  }
});


test("blank registration email help leads to the illustrated recovery steps", async ({ page }) => {
 await page.goto('/help#access');
 const question = page.locator('#access details').filter({hasText:'Why can’t I enter my email on the registration page?'});
 await question.locator('summary').focus();
 await page.keyboard.press('Enter');
 await question.getByRole('link', {name:'See where to enter your email',exact:true}).click();
 await expect(page).toHaveURL(/\/docs\/merchant-onboarding#registration-email$/);
 const recovery = page.locator('#registration-email');
 await expect(recovery.getByRole('heading')).toBeInViewport();
 await expect(recovery).toContainText('Choose Sign in above the Register New Account heading.');
 await expect(recovery).toContainText('For a new account, choose Register. For an existing account, choose Sign In.');
 await expect(page.locator('#create-account')).toContainText('If Welcome says your email is already registered, choose Sign In.');
 await expect(recovery.getByRole('img')).toHaveAttribute('src','/help/merchant-account/blank-registration.jpg');
 await expect.poll(() => recovery.getByRole('img').evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
 await expect(page.locator('main form,main input,main iframe')).toHaveCount(0);
 await expect(page.getByRole('main').getByRole('link', {name:'Start now',exact:true})).toHaveAttribute('href','https://merchantapp.io/etaildepot/UserAccount/Login');
});

test("account screenshot instructions work without JavaScript at desktop and phone widths", async ({ browser }, testInfo) => {
 const context = await browser.newContext({javaScriptEnabled:false});
 const page = await context.newPage();
 for (const width of [1440,390,320]) {
  await page.setViewportSize({width,height:1000});
  await page.goto('http://127.0.0.1:3100/docs/merchant-onboarding#create-account');
  const signIn=page.locator('#sign-in');
  await expect(signIn.getByRole('link',{name:'Sign in to Trolleys',exact:true})).toHaveAttribute('href','https://merchantapp.io/etaildepot/UserAccount/Login');
  await expect(signIn).toContainText('continue the existing application');
  const guide=page.locator('#create-account');
  await expect(guide.getByRole('heading',{level:3})).toHaveText(['Enter your email on Welcome','Create your password','Continue your business application']);
  for(const image of await page.locator('#create-account img[src^="/help/merchant-account/"],#registration-email img').all()) {
   await image.scrollIntoViewIfNeeded();
   await expect.poll(() => image.evaluate(el => el instanceof HTMLImageElement && el.complete && el.naturalWidth === 1280)).toBe(true);
   expect(await image.getAttribute('alt')).toBeTruthy();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  const entry=guide.getByRole('link',{name:'Start now',exact:true});
  await expect(entry).toHaveAttribute('referrerpolicy','no-referrer');
  await expect(entry).toHaveAttribute('rel',/noreferrer/);
  await page.goto('http://127.0.0.1:3100/docs/merchant-onboarding#create-account');
  await page.screenshot({path:testInfo.outputPath(`account-guide-${width}.png`)});
  await page.goto('http://127.0.0.1:3100/docs/merchant-onboarding#registration-email');
  await page.screenshot({path:testInfo.outputPath(`account-recovery-${width}.png`)});
 }
 await context.close();
});


test("Help separates returning account access from new registration", async ({ page }) => {
 for (const [question, label, fragment] of [
  ['Where do I sign in to my merchant account?', 'sign in instructions', 'sign-in'],
  ['How do I create a merchant login?', 'account setup steps with screenshots', 'create-account'],
 ] as const) {
  await page.goto('/help#access');
  const answer = page.locator('#access details').filter({has:page.locator('summary').filter({hasText:question})});
  await answer.locator('summary').focus();
  await page.keyboard.press('Enter');
  await answer.getByRole('link',{name:label,exact:true}).click();
  await expect(page).toHaveURL(new RegExp('/docs/merchant-onboarding#'+fragment+'$'));
  const section=page.locator('#'+fragment);
  await expect(section.getByRole('heading',{level:2})).toBeInViewport();
  const action=section.getByRole('link',{name:fragment==='sign-in'?'Sign in to Trolleys':'Start now',exact:true});
  await expect(action).toHaveAttribute('href','https://merchantapp.io/etaildepot/UserAccount/Login');
  await expect(action).toHaveAttribute('referrerpolicy','no-referrer');
  await expect(action).toHaveAttribute('rel',/noreferrer/);
  await expect(page.locator('main form,main input,main iframe')).toHaveCount(0);
 }
});


test("Guides leads to email first account setup and blank email recovery", async ({page}) => {
 await page.goto('/guides');
 await page.getByRole('main').getByRole('link',{name:/Merchant account setup/}).click();
 await expect(page).toHaveURL(/\/docs\/merchant-onboarding$/);
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
