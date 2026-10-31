import { expect, test, type Page } from "@playwright/test";

async function preventMutations(page: Page) {
  const attempts: string[] = [];
  await page.route("**/*", async route => {
    const request = route.request();
    if (["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      await route.continue();
    } else {
      attempts.push(`${request.method()} ${new URL(request.url()).pathname}`);
      await route.abort("blockedbyclient");
    }
  });
  return attempts;
}

async function expectNoHorizontalOverflow(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
}

test("Home gives merchants and software partners distinct next steps", async ({ page }) => {
  await page.goto("/");
  const actions = page.locator("#services");
  const merchants = actions.getByRole("link", { name: "Explore merchant services", exact: true });
  const partners = page.locator("#services").getByRole("link", { name: "Explore software platforms", exact: true });
  await expect(merchants).toHaveAttribute("href", "/payment-acceptance-service");
  await expect(page.getByRole("main").getByRole("link", { name: "Contact sales", exact: true })).toHaveCount(0);
  await expect(partners).toHaveAttribute("href", "/software-partners");
  await expect(merchants).toBeVisible();
  await expect(partners).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Merchant services. For your business.");

  await merchants.click();
  await expect(page).toHaveURL(/\/payment-acceptance-service$/);
  const menu = page.getByRole("banner").getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("banner").getByRole("link", { name: "Contact sales", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator("#payment-review")).toContainText("An inquiry is not an application or approval");
  await expect(page.locator("#platforms")).toContainText("A partnership inquiry does not approve or activate merchant accounts.");
  await expect(page.locator("#platforms a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com?subject=Software%20payment%20partnership");
  await page.goto("/");
  await partners.click();
  await expect(page).toHaveURL(/\/software-partners$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your merchants aren’t all the same");
  await page.goBack();
  const cardLink = page.getByRole("contentinfo").getByRole("link", { name: "Card services", exact: true });
  await expect(cardLink).toHaveAttribute("href", "/credit-card-services");
  await cardLink.click();
  await expect(page.locator("#card-details")).toContainText("$200");
  await expect(page.locator("#card-details")).toContainText("$0");
  await expect(page.locator(".consumer-product-note")).toHaveText("An inquiry is not an application.");
});

test("payment explorer supports keyboard tabs and exposes the corresponding record", async ({ page }) => {
  await page.goto("/online-businesses");
  const explorer = page.locator("#customer-checkout");
  const tabs = explorer.getByRole("tablist", { name: "Payment journey views", exact: true });
  const onboarding = tabs.getByRole("tab", { name: "Onboarding", exact: true });
  const checkout = tabs.getByRole("tab", { name: "Checkout", exact: true });
  const record = tabs.getByRole("tab", { name: "Card record", exact: true });
  const payout = tabs.getByRole("tab", { name: "Card payout", exact: true });
  const checkoutPanel = explorer.getByRole("tabpanel", { name: "Checkout", exact: true });
  const recordPanel = explorer.getByRole("tabpanel", { name: "Card record", exact: true });
  const payoutPanel = explorer.getByRole("tabpanel", { name: "Card payout", exact: true });

  await expect(checkout).toHaveAttribute("aria-selected", "true");
  await expect(checkoutPanel).toBeVisible();
  await expect(record).toHaveAttribute("tabindex", "-1");
  await checkout.focus();
  await checkout.press("ArrowRight");
  await expect(record).toBeFocused();
  await expect(record).toHaveAttribute("aria-selected", "true");
  await expect(recordPanel).toBeVisible();
  await expect(checkoutPanel).toBeHidden();
  await expect(recordPanel).toContainText("#10482");
  await expect(recordPanel).toContainText("Designer sneaker");
  await expect(recordPanel).toContainText("Capture does not confirm that money has reached the merchant’s bank.");
  await record.press("End");
  await expect(payout).toBeFocused();
  await expect(payoutPanel).toBeVisible();
  await expect(recordPanel).toBeHidden();
  await payout.press("ArrowRight");
  await expect(onboarding).toBeFocused();
  await onboarding.press("ArrowLeft");
  await expect(payout).toBeFocused();
  await payout.press("Home");
  await expect(onboarding).toBeFocused();
  await onboarding.press("ArrowRight");
  await expect(checkout).toBeFocused();
  await expect(checkoutPanel).toBeVisible();

  for (const tab of [onboarding, checkout, record, payout]) {
    const panelId = await tab.getAttribute("aria-controls");
    const panel = explorer.locator(`[id="${panelId}"]`);
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute("aria-labelledby", (await tab.getAttribute("id"))!);
  }
});

test("bank checkout never presents the domestic card fee as an ACH price", async ({ page }) => {
  await page.goto("/online-businesses");
  const explorer = page.locator("#customer-checkout");
  const methods = explorer.getByRole("tablist", { name: "Checkout payment method", exact: true });
  const card = methods.getByRole("tab", { name: "Card", exact: true });
  const bank = methods.getByRole("tab", { name: "Bank payment", exact: true });
  await card.focus();
  await card.press("ArrowRight");
  await expect(bank).toBeFocused();
  await expect(bank).toHaveAttribute("aria-selected", "true");
  const bankPanel = explorer.getByRole("tabpanel", { name: "Bank payment", exact: true });
  await expect(bankPanel).toContainText("Routing number");
  await expect(bankPanel).toContainText("Account number");
  await expect(bankPanel).toContainText("Review the bank payment authorization before confirming.");
  await expect(bankPanel).toContainText("Review payment $100.00");
  const submission = explorer.getByLabel("Bank payment submission", { exact: true });
  await expect(submission).toContainText("Payment submitted");
  await expect(submission).toContainText("Processing");
  await expect(submission).toContainText("Submission does not confirm that the bank payment has cleared.");
  await expect(submission).not.toContainText(/Payment received|Approved/);
  await expect(bankPanel).not.toContainText(/2\.9%|30¢|3\.20|96\.80/);
  await expect(explorer.getByRole("tabpanel", { name: "Checkout", exact: true }))
    .not.toContainText(/2\.9%|30¢|3\.20|96\.80/);
  await expect(page.locator(".online-business-note")).toContainText("ACH pricing is separate");
  await bank.press("Home");
  await expect(card).toBeFocused();
  await expect(explorer.getByRole("tabpanel", { name: "Card", exact: true })).toContainText("Card number");
  const confirmation = explorer.getByLabel("Card payment confirmation", { exact: true });
  await expect(confirmation).toContainText("Payment approved");
  await expect(confirmation).toContainText("#10482");
  await expect(confirmation).toContainText("$100.00");
  await card.press("End");
  await expect(bank).toBeFocused();
  await bank.press("ArrowRight");
  await expect(card).toBeFocused();

  await bank.click();
  await explorer.getByRole("tab", { name: "Card record", exact: true }).click();
  await expect(explorer.locator(".pse-context")).toContainText("Card payment");
  await expect(explorer.getByRole("tabpanel", { name: "Card record", exact: true })).toContainText("Payment methodCard");
  await explorer.getByRole("tab", { name: "Card payout", exact: true }).click();
  const payout = explorer.getByRole("tabpanel", { name: "Card payout", exact: true });
  await expect(payout.locator(".payout-trail strong")).toHaveText(["Capture", "Settlement", "Payout calculation", "Bank deposit"]);
  await expect(payout).toContainText("One domestic online card payment");
  await expect(payout).toContainText("$100.00");
  await expect(payout).toContainText("−$3.20");
  await expect(payout).toContainText("$96.80");
  await expect(payout).toContainText("Bank receipt is a separate confirmation.");
  await expect(payout).toContainText("Confirm the deposit against your bank statement.");
});

test("payment specimens cannot collect credentials, submit payments or advance a live transaction", async ({ page }) => {
  const mutations = await preventMutations(page);
  await page.goto("/online-businesses");
  const explorer = page.locator("#customer-checkout");
  const unsupportedControls = explorer.locator('form, input, textarea, select, [contenteditable="true"], button[type="submit"]');
  await expect(unsupportedControls).toHaveCount(0);
  await expect(explorer.getByRole("button", { name: /^(?:Pay|Review payment) \$/ })).toHaveCount(0);
  await explorer.getByRole("tab", { name: "Bank payment", exact: true }).click();
  await expect(unsupportedControls).toHaveCount(0);
  await expect(explorer.getByRole("button", { name: /^(?:Pay|Review payment) \$/ })).toHaveCount(0);
  await explorer.getByRole("tab", { name: "Card record", exact: true }).click();
  const record = explorer.getByRole("tabpanel", { name: "Card record", exact: true });
  await record.locator("summary").filter({ hasText: "Refunds" }).click();
  await expect(record).toContainText("A refund has its own status and reference.");
  await record.locator("summary").filter({ hasText: "Disputes" }).click();
  await expect(record).toContainText("A dispute has its own case reference, evidence and response deadline.");
  await record.locator("summary").filter({ hasText: "If the result is unclear" }).click();
  await expect(record).toContainText("An unknown result is not a decline.");
  await explorer.getByRole("tab", { name: "Card payout", exact: true }).click();
  await explorer.locator("summary").filter({ hasText: "How to check a deposit" }).click();
  await expect(explorer).toContainText("Your account’s funding terms apply.");
  expect(mutations).toEqual([]);
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
});

test("Trolleys entrance remains fixed and does not inherit a visitor query or fragment", async ({ page }) => {
  await page.goto("/payment-acceptance-service?account=sample-account&next=https%3A%2F%2Fexample.com#customer-checkout");
  const links = page.getByRole("link", { name: "Apply for a merchant account", exact: true });
  expect(await links.count()).toBeGreaterThanOrEqual(1);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("href", "https://trolleys.ai");
    await expect(link).toHaveAttribute("referrerpolicy", "no-referrer");
    await expect(link).toHaveAttribute("rel", /\bnoreferrer\b/);
  }
  await expect(page.locator('a[href^="https://trolleys.ai?"]')).toHaveCount(0);
  await expect(page.locator('a[href^="https://trolleys.ai#"]')).toHaveCount(0);
});

test("software partner preview stays out of indexing and offers contact rather than unapproved API access", async ({ page }) => {
  await page.goto("/software-partners");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /\bnoindex\b/);
  await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute("content", /\bnoindex\b/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/software-partners");
  const contact = page.locator(".ec-platform-hero").getByRole("link", { name: "Discuss your platform", exact: true });
  await expect(contact).toHaveAttribute("href", "/contact#platforms");
  await expect(page.locator("main form")).toHaveCount(0);
  await expect(page.locator("main")).toContainText("Merchant approval is required.");
  await expect(page.locator("main")).toContainText("The business submits its details for review and completes account setup after approval.");
  await expect(page.locator("main")).toContainText("Payment methods depend on account setup.");
  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).not.toContain("/software-partners");
});

test("service journeys remain within a 320-pixel screen, including every payment view", async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 320, height: 900 });
  for (const route of ["/", "/software-partners", "/online-businesses", "/payment-acceptance-service", "/credit-card-services", "/help", "/guides"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    if (route === "/online-businesses") {
      const explorer = page.locator("#customer-checkout");
      await explorer.getByRole("tab", { name: "Bank payment", exact: true }).click();
      await expectNoHorizontalOverflow(page);
      for (const name of ["Onboarding", "Card record", "Card payout", "Checkout"]) {
        await explorer.getByRole("tab", { name, exact: true }).click();
        await expect(explorer.getByRole("tabpanel", { name, exact: true })).toBeVisible();
        await expectNoHorizontalOverflow(page);
      }
    }
  }
});

test("service content and all payment records remain readable without JavaScript", async ({ browser, baseURL, page }) => {
  const context = await browser.newContext({
    baseURL, javaScriptEnabled: false, reducedMotion: "reduce", viewport: page.viewportSize(),
  });
  try {
    const noScript = await context.newPage();
    await noScript.goto("/");
    const actions = noScript.locator("#services");
    await expect(actions.getByRole("link", { name: "Explore merchant services", exact: true })).toBeVisible();
    await expect(actions.getByRole("link", { name: "Explore merchant services", exact: true })).toHaveAttribute("href", "/payment-acceptance-service");
    await expect(noScript.locator("#services").getByRole("link", { name: "Explore software platforms", exact: true })).toBeVisible();
    await actions.getByRole("link", { name: "Explore merchant services", exact: true }).click();
    await expect(noScript).toHaveURL(/\/payment-acceptance-service$/);
    const navigation = noScript.getByRole("navigation", {name:"Main navigation"});
    if (await navigation.locator(".public-domain-services").getAttribute("open") === null) await navigation.locator("summary").filter({hasText:/^Services$/}).click();
    await navigation.getByRole("link", { name: "Online businesses", exact: true }).click();
    await expect(noScript).toHaveURL(/\/online-businesses$/);
    const explorer = noScript.locator("#customer-checkout");
    await expect(explorer.getByRole("tablist", { name: "Payment journey views", exact: true, includeHidden: true })).toBeHidden();
    await expect(explorer.getByRole("tablist", { name: "Checkout payment method", exact: true, includeHidden: true })).toBeHidden();
    await expect(explorer.locator(".pse-panel")).toHaveCount(4);
    for (const name of ["Set up your merchant account.", "Let customers choose how to pay.", "Match the card payment to the order.", "Reconcile your card payout."]) {
      await expect(explorer.getByRole("heading", { name, exact: true })).toBeVisible();
    }
    await expect(explorer).toContainText("$96.80");
    await expect(explorer.locator("form, input, textarea, select")).toHaveCount(0);
    const checkoutTrack = noScript.locator(".unified-preview-layout");
    expect(await checkoutTrack.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    await expect(noScript.locator(".unified-preview-stage")).toHaveCount(3);
    await expect(noScript.getByRole("group", {name:"Checkout screens",exact:true})).toBeHidden();

    await explorer.locator("summary").filter({ hasText: "If the result is unclear" }).click();
    await expect(explorer).toContainText("Check the original payment reference and its status before trying again.");
    await noScript.goto("/software-partners");
    await expect(noScript.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(noScript.locator('meta[name="robots"]')).toHaveAttribute("content", /\bnoindex\b/);
  } finally {
    await context.close();
  }
});


test("onboarding artwork separates submitted information from approval", async ({ page }) => {
  const mutations = await preventMutations(page);
  await page.goto("/online-businesses");
  const explorer = page.locator("#customer-checkout");
  await explorer.getByRole("tab", { name: "Onboarding", exact: true }).click();
  const panel = explorer.getByRole("tabpanel", { name: "Onboarding", exact: true });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("heading", { name: "Application summary", exact: true })).toBeVisible();
  await expect(panel.locator(".mja-status")).toHaveText("In review");
  await expect(panel).toContainText("Submitted for verification");
  await expect(panel).toContainText("Account setup follows approval.");
  await expect(panel).toContainText("Eligibility and account approval apply.");
  await expect(panel).not.toContainText(/instantly approved|guaranteed approval|same.day approval|API key/i);
  await expect(panel.locator("form, input, textarea, select, iframe, a, button")).toHaveCount(0);
  await expect(explorer.locator(".pse-context")).not.toContainText("#10482");
  await expectNoHorizontalOverflow(page);
  expect(mutations).toEqual([]);
});


for (const width of [320, 768]) {
  test(`checkout screens stay readable, synchronized and local at ${width}px`, async ({ page }) => {
    await page.setViewportSize({width, height:900});
    const mutations = await preventMutations(page);
    await page.goto("/online-businesses#customer-checkout");
    const checkout = page.locator(".unified-preview");
    const controls = checkout.getByRole("group", {name:"Checkout screens", exact:true});
    const track = checkout.getByRole("group", {name:"Checkout artwork", exact:true});
    await expect(controls).toBeVisible();
    await track.focus(); await track.press("End");
    await expect(controls.getByRole("button").nth(2)).toHaveAttribute("aria-pressed","true");
    await track.press("Home");
    await expect(controls.getByRole("button").nth(0)).toHaveAttribute("aria-pressed","true");
    const buttons = controls.getByRole("button");
    await expect(buttons).toHaveCount(3);
    await checkout.getByRole("tab", {name:"Bank payment",exact:true}).click();
    for (const index of [1,2,0]) {
      await buttons.nth(index).click();
      await expect(buttons.nth(index)).toHaveAttribute("aria-pressed","true");
      await expect.poll(() => track.evaluate((el, target) => {
        const stage=el.querySelectorAll<HTMLElement>(".unified-preview-stage")[target]!;
        return Math.abs(stage.getBoundingClientRect().left - el.getBoundingClientRect().left - parseFloat(getComputedStyle(el).paddingLeft));
      },index)).toBeLessThan(2);
    }
    await buttons.nth(0).press("End");
    await expect(buttons.nth(2)).toBeFocused();
    await expect(checkout.getByLabel("Bank payment submission",{exact:true})).toBeInViewport();
    await expect(checkout.getByLabel("Bank payment submission",{exact:true})).toContainText("Payment submitted");
    await expect(checkout.getByLabel("Bank payment submission",{exact:true})).toContainText("Processing");
    await expect(checkout.getByLabel("Bank payment submission",{exact:true})).not.toContainText(/Payment approved|3\.20|96\.80/);
    await buttons.nth(2).press("Home");
    await expect(buttons.nth(0)).toBeFocused();
    await checkout.getByRole("tab",{name:"Card",exact:true}).click();
    await buttons.nth(2).click();
    await expect(checkout.getByLabel("Card payment confirmation",{exact:true})).toBeInViewport();
    await expect(checkout.getByLabel("Card payment confirmation",{exact:true})).toContainText("Payment approved");
    await expect(checkout.getByLabel("Card payment confirmation",{exact:true})).toContainText("#10482");
    await expect(track).toHaveJSProperty("scrollHeight", await track.evaluate(el=>el.clientHeight));
    await expectNoHorizontalOverflow(page);
    await page.setViewportSize({width:1440,height:1000});
    await expect(controls).toBeHidden();
    await track.scrollIntoViewIfNeeded();
    for(const stage of await checkout.locator(".unified-preview-stage").all()) await expect(stage).toBeInViewport();
    await expect(checkout.locator("form,input,textarea,iframe")).toHaveCount(0);
    expect(mutations).toEqual([]);
  });
}
