import { expect, test, type Page } from "@playwright/test";
import { openMainNavigation } from "./public-header";
import { documentationPages, documentationPath } from "../../src/modules/public-site/documentation-catalog";

async function openDocumentationTopic(page: Page, slug: string) {
 const topics=page.getByRole('navigation',{name:'Documentation topics'});
 const mobile=topics.locator('.docs-nav-mobile');
 if(await mobile.isVisible() && await mobile.getAttribute('open')===null)await mobile.locator('summary').click();
 await topics.locator(`a[href="/docs/${slug}"]`).filter({visible:true}).click();
 await expect(page).toHaveURL(new RegExp('/docs/'+slug+'$'));
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
  const navigation=await openMainNavigation(page);
  await expect(navigation.getByRole('link',{name:'Documentation',exact:true})).toHaveAttribute('aria-current','location');
  const menu=page.getByRole('banner').getByRole('button',{name:'Menu',exact:true});
  if(await menu.isVisible())await menu.click();
  await expect(page.getByRole('navigation',{name:'Footer documentation'}).getByRole('link',{name:'Developer integration',exact:true})).toHaveAttribute('href','/docs#developer-integration');
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
 await expect(page.locator('#application-review')).toContainText('An approval decision does not confirm that every connection is ready.');
 await page.goto('/docs/checkout');
 await expect(page.locator('.docs-article-heading')).toContainText('provided through your merchant account service');
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
 await page.locator('.docs-task-paths').getByRole('link',{name:'Configure integration access',exact:true}).click();
 await expect(page).toHaveURL(/\/docs\/integration-access$/);
 const topics=page.getByRole('navigation',{name:'Documentation topics'});
 if(await topics.locator('.docs-nav-mobile').isVisible())await topics.locator('summary').click();
 await topics.getByRole('link',{name:'Online checkout',exact:true}).filter({visible:true}).click();
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
 await expect(nav.locator('.docs-nav-mobile')).toHaveAttribute('open','');
 await expect(nav.locator('.docs-nav-mobile').getByRole('link',{name:'Payment status',exact:true})).toBeFocused();
 await page.setViewportSize({width:1440,height:1000});
 await expect(nav.locator('.docs-nav-desktop').getByRole('link',{name:'Payment status',exact:true})).toBeFocused();
});


test("merchant journey connects service, use case and account instructions without requiring developer access",async({page})=>{
 await page.goto('/payment-acceptance-service');
 const navigation=await openMainNavigation(page);
 await navigation.locator('summary').filter({hasText:/^Use cases$/}).click();
 await navigation.getByRole('link',{name:'Online businesses',exact:true}).click();
 await expect(page).toHaveURL(/\/online-businesses$/);
 const docsNavigation=await openMainNavigation(page);
 await docsNavigation.getByRole('link',{name:'Documentation',exact:true}).click();
 await page.locator('.docs-task-paths').getByRole('link',{name:'Set up an account',exact:true}).click();
 await expect(page).toHaveURL(/\/docs\/merchant-onboarding$/);
 const portal=page.getByRole('main').getByRole('link',{name:'Continue to Trolleys',exact:true});
 await expect(portal).toHaveAttribute('href','https://trolleys.ai');
 await expect(portal).toHaveAttribute('referrerpolicy','no-referrer');
 await openDocumentationTopic(page,'payment-requests');
 await expect(page).toHaveURL(/\/docs\/payment-requests$/);
 for(const destination of ['payment-status','refunds-and-disputes','payouts']){
  await openDocumentationTopic(page,destination);
 }
 await expect(page.locator('.docs-next')).toHaveCount(0);
 const serviceNavigation=await openMainNavigation(page);
 await serviceNavigation.getByRole('link',{name:'Merchant services',exact:true}).click();
 await expect(page).toHaveURL(/\/payment-acceptance-service$/);
});

test("platform implementation progresses to testing and returns to its use case",async({page})=>{
 await page.goto('/software-partners');
 await page.getByRole('main').getByRole('link',{name:'Plan your integration',exact:true}).click();
 await expect(page).toHaveURL(/\/docs\/integration-access$/);
 for(const destination of ['checkout','webhooks','testing-and-launch']){
  await openDocumentationTopic(page,destination);
 }
 await expect(page.locator('#production-readiness')).toContainText('Any live application, transaction, refund or movement of funds requires that separate procedure.');
 const navigation=await openMainNavigation(page);
 await navigation.locator('summary').filter({hasText:/^Use cases$/}).click();
 await navigation.getByRole('link',{name:'Software platforms',exact:true}).click();
 await expect(page).toHaveURL(/\/software-partners$/);
});

test("card inquiries stay separate from merchant applications and developer access",async({page})=>{
 await page.goto('/docs');
 const navigation=await openMainNavigation(page);
 await navigation.getByRole('link',{name:'Card services',exact:true}).click();
 await expect(page).toHaveURL(/\/credit-card-services$/);
 await expect(page.getByRole('main')).toContainText('Applications are not open yet.');
 await expect(page.getByRole('main').locator('a[href^="https://trolleys.ai"],a[href^="/docs"]')).toHaveCount(0);
 for(const link of await page.getByRole('main').getByRole('link',{name:'Contact Ledgix',exact:true}).all())await expect(link).toHaveAttribute('href','mailto:ledgix@etaildepot.com');
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
 await expect(page.getByRole('heading',{name:'Before you begin',exact:true})).toBeVisible();
 await openDocumentationTopic(page,'checkout');
 await openDocumentationTopic(page,'webhooks');
 await openDocumentationTopic(page,'testing-and-launch');
});

test("every article returns to its own documentation group", async ({page}) => {
 for(const item of documentationPages){
  await page.goto(documentationPath(item.slug));
  const group=item.group==='Merchant operations'?'merchant-operations':'developer-integration';
  const link=page.getByRole('navigation',{name:'Breadcrumb',exact:true}).getByRole('link',{name:item.group,exact:true});
  await expect(link).toHaveAttribute('href',`/docs#${group}`);
  await link.click();
  await expect(page).toHaveURL(new RegExp(`/docs#${group}$`));
  await expect(page.locator(`#${group}`)).toBeInViewport();
  await expect(page.locator(`#${group} h2`)).toHaveText(item.group);
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
  await expect(page.locator('.docs-article a[href^="mailto:"], .docs-article a[href="/online-businesses"], .docs-article a[href="/software-partners"]')).toHaveCount(0);
  await openMainNavigation(page);
  const help=page.getByRole('banner').getByRole('link',{name:'Help',exact:true});
  await help.click();
  await expect(page).toHaveURL(/\/help$/);
  await expect(page.getByRole('main').locator('a[href="mailto:trolleys@etaildepot.com"]').first()).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(new RegExp('/docs/'+item.slug+'$'));
 }
});
