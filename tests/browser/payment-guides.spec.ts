import { expect, test, type Page } from "@playwright/test";
import { openMainNavigation } from "./public-header";

const guidePaths = [
  "/guides/how-to-create-a-payment-link",
  "/guides/payment-processing-systems",
  "/guides/stripe-alternatives",
  "/guides/optimize-your-mobile-checkout-experience",
  "/guides/cart-abandonment-vs-checkout-abandonment",
  "/guides/consuming-webhooks",
  "/guides/designing-robust-and-predictable-apis-with-idempotency",
  "/guides/what-is-a-chargeback",
  "/guides/how-3d-secure-works",
  "/guides/account-takeover-fraud",
  "/guides/important-invoice-management-tips",
  "/guides/types-of-invoice-discrepancies",
  "/guides/b2b-payment-methods",
  "/guides/ach-debit",
  "/guides/edi-payment-how-does-it-differ-from-ach-and-eft",
  "/guides/pick-the-right-payment-methods-in-a-new-country",
  "/guides/important-information-about-bic-and-swift-codes",
  "/guides/profit-and-loss-statement",
  "/guides/read-a-balance-sheet",
  "/guides/credit-card-interest",
] as const;
const internalLanguage = /(?:editorial draft|private preview|human review pending|publication approval|source-led|archiveInputsUsed|D3\d{2}|G\d{4})/i;

async function chooseTopic(page: Page, value: string, label: string) {
  const select = page.getByRole("combobox", { name: "Browse by topic", exact: true });
  if (await select.isVisible()) {
    await expect(select).toBeEnabled();
    await select.selectOption(value);
  } else {
    const button = page.getByRole("button", { name: label, exact: true });
    await expect(button).toBeEnabled();
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
  }
}

for (const path of guidePaths) {
  test(`merchants can discover and read ${path}`, async ({ page, request }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/guides");
    const card = page.locator(`.guide-library-card[href="${path}"]`);
    await card.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("article")).toBeVisible();
    await expect(page.locator(".reading-guide")).toBeVisible();
    await expect(page.locator(".reading-guide")).not.toContainText(internalLanguage);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${path}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb", exact: true });
    await expect(breadcrumb.getByRole("link")).toHaveText(["Home", "Guides"]);
    const schema = page.locator('script[type="application/ld+json"]');
    await expect(schema).toHaveCount(1);
    const structured = JSON.parse(await schema.innerText());
    const webPage = structured["@graph"].find((node: { "@type": string }) => node["@type"] === "WebPage");
    expect(webPage.url).toBe(`https://etaildepot.com${path}`);
    expect(webPage.name).toBeTruthy();
    expect(webPage.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const items = structured["@graph"].find((node: { "@type": string }) => node["@type"] === "BreadcrumbList").itemListElement;
    expect(items.map((item: { item: string }) => item.item)).toEqual(["https://etaildepot.com/", "https://etaildepot.com/guides", `https://etaildepot.com${path}`]);

    const mobileContents = page.locator(".reading-guide-mobile-contents");
    if (await mobileContents.isVisible()) {
      await mobileContents.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(mobileContents).toHaveAttribute("open", "");
    }
    const contents = page.getByRole("navigation", { name: "On this page", exact: true });
    await expect(contents).toBeVisible();
    for (const link of await contents.getByRole("link").all()) {
      const fragment = await link.getAttribute("href");
      expect(fragment).toMatch(/^#[a-z0-9-]+$/);
      await expect(page.locator(fragment!)).toHaveCount(1);
    }
    await contents.getByRole("link", { name: "References", exact: true }).click();
    await expect(page.locator("#sources")).toBeInViewport();
    const sources = page.locator('.reading-guide-sources a[rel~="external"]');
    expect(await sources.count()).toBeGreaterThanOrEqual(2);
    for (const source of await sources.all()) {
      expect(new URL((await source.getAttribute("href"))!).protocol).toBe("https:");
      await expect(source).toHaveAttribute("referrerpolicy", "no-referrer");
      await expect(source).toHaveAttribute("rel", /\bnoreferrer\b/);
    }
    const related = page.locator(".reading-guide-related a");
    expect(await related.count()).toBeGreaterThanOrEqual(1);
    expect(await related.count()).toBeLessThanOrEqual(3);
    for (const link of await related.all()) {
      const href = await link.getAttribute("href");
      expect(guidePaths).toContain(href);
      expect(href).not.toBe(path);
    }
    for (const table of await page.locator(".payment-guide-table-scroll").all()) {
      await table.scrollIntoViewIfNeeded();
      const caption = (await table.locator("caption span").boundingBox())!;
      expect(caption.x).toBeGreaterThanOrEqual(0);
      expect(caption.x + caption.width).toBeLessThanOrEqual(page.viewportSize()!.width);
      if (await table.evaluate(element => element.scrollWidth > element.clientWidth + 1)) {
        await table.focus();
        await page.keyboard.press("ArrowRight");
        await expect.poll(() => table.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
      }
    }
    for (const link of await page.locator(".reading-guide-product-link a").all()) {
      expect(["/payment-acceptance-service", "/credit-card-services"]).toContain(await link.getAttribute("href"));
    }
    await expect(page.locator(".reading-guide form, .reading-guide input, .reading-guide iframe")).toHaveCount(0);
    expect((await request.get(`${path}/not-a-page`)).status()).toBe(404);
    expect(await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1);
    await breadcrumb.getByRole("link", { name: "Guides", exact: true }).click();
    await expect(page).toHaveURL(/\/guides$/);
    await expect(page.locator(".guide-library-card")).toHaveCount(20);
    expect(errors).toEqual([]);
  });
}

test("main navigation opens all twenty guides while support stays in the footer", async ({ page }) => {
  await page.goto("/payment-acceptance-service");
  await expect(page.locator(".payment-guides")).toHaveCount(0);
  const navigation = await openMainNavigation(page);
  await expect(navigation.getByRole("link", { name: "Help", exact: true })).toHaveCount(0);
  await navigation.getByRole("link", { name: "Guides", exact: true }).click();
  await expect(page).toHaveURL(/\/guides$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Guides");
  await expect(page.locator(".guide-library-card")).toHaveCount(20);
  expect(await page.locator(".guide-library-card").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")))).toEqual(guidePaths);
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByLabel("Sort by", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Clear filters", exact: true })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Guide result pages" })).toHaveCount(0);
  await expect(page.locator(".guide-library")).not.toContainText(internalLanguage);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.getByRole("contentinfo").getByRole("link", { name: "Help center", exact: true }).click();
  await expect(page).toHaveURL(/\/help$/);
});

test("section fragments survive refresh and history, with honest empty POS recovery", async ({ page }) => {
  await page.goto("/guides");
  await chooseTopic(page, "ach-bank-transfers", "ACH payments and bank transfers");
  await expect(page).toHaveURL(/\/guides#topic=ach-bank-transfers$/);
  await expect(page.locator("#guide-results-title")).toHaveText("ACH payments and bank transfers");
  await expect(page.locator(".guide-library-card")).toHaveCount(2);
  await expect(page.getByRole("status")).toHaveText("2 guides");
  await chooseTopic(page, "in-person-payments-pos", "In-person payments and POS");
  await expect(page.locator(".guide-library-card")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "No guides in this section yet", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("0 guides");
  await page.goBack();
  await expect(page).toHaveURL(/#topic=ach-bank-transfers$/);
  await expect(page.locator(".guide-library-card")).toHaveCount(2);
  await page.goForward();
  await expect(page).toHaveURL(/#topic=in-person-payments-pos$/);
  await expect(page.locator(".guide-library-card")).toHaveCount(0);
  await page.reload();
  await expect(page.locator("#guide-results-title")).toHaveText("In-person payments and POS");
  await expect(page.locator(".guide-library-card")).toHaveCount(0);
  await page.locator(".guide-library-empty").getByRole("button", { name: "All guides", exact: true }).click();
  await expect(page).toHaveURL(/\/guides$/);
  await expect(page.locator("#guide-results-title")).toBeFocused();
  await expect(page.locator(".guide-library-card")).toHaveCount(20);
  await page.goto("/guides#topic=unknown-section");
  await expect(page.locator("#guide-results-title")).toHaveText("All guides");
  await expect(page.locator(".guide-library-card")).toHaveCount(20);
  expect(new URL(page.url()).search).toBe("");
});

test("a section choice returns with Back from an article", async ({ page }) => {
  await page.goto("/guides#topic=credit-cards-issuing");
  await expect(page.locator(".guide-library-card")).toHaveCount(1);
  await page.locator(".guide-library-card").click();
  await expect(page).toHaveURL(/\/guides\/credit-card-interest$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/guides#topic=credit-cards-issuing$/);
  await expect(page.locator(".guide-library-card")).toHaveCount(1);
  await expect(page.locator("#guide-results-title")).toHaveText("Credit cards and card issuing");
});

test("guides lead to local product details without forwarding visitor query or fragment", async ({ page }) => {
  for (const [guide, destination] of [["/guides/b2b-payment-methods", "/payment-acceptance-service"], ["/guides/credit-card-interest", "/credit-card-services"]]) {
    await page.goto(`${guide}?source=synthetic-review#sources`);
    const link = page.locator(".reading-guide-product-link a");
    await expect(link).toHaveAttribute("href", destination);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    expect(new URL(page.url()).search).toBe("");
    expect(new URL(page.url()).hash).toBe("");
  }
});

test("all twenty ordinary article links work without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/guides#topic=credit-cards-issuing`);
    await expect(page.locator(".guide-library-card")).toHaveCount(20);
    expect(await page.locator(".guide-library-card").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")))).toEqual(guidePaths);
    await expect(page.locator(".guide-library-topic-select")).toBeDisabled();
    await expect(page.getByRole("searchbox")).toHaveCount(0);
    await page.locator('.guide-library-card[href="/guides/ach-debit"]').click();
    await expect(page.getByRole("article")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What is an ACH debit?");
  } finally {
    await context.close();
  }
});
