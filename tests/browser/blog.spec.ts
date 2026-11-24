import { paymentLinkArticle } from "../../src/features/company/blog/payment-link-content";
import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blogArticles, moneyStopsMovingArticle, merchantPayoutHoldsArticle, frozenFundsArticle, riskCommunicationArticle, merchantSupportArticle, instantOnboardingArticle, riversidePaymentsArticle, declinedProcessingArticle, providerApprovalArticle, payfacOperationsArticle, merchantCancellationArticle } from "../../src/features/company/blog/content";
import { openFooterGroup } from "./public-footer";

// Digests retain the supplied articles plus reviewed minimum wording, Trolleys naming
// and the 17 November spelling and cited-source precision corrections.
const fixtures = [
  { entry: moneyStopsMovingArticle, count: 7, digest: "43d96c42aa853eada9e6fc988f751168ea93a83f09f2ce22952598510e8c5180" },
  { entry: merchantPayoutHoldsArticle, count: 6, digest: "0b4e789fc4433c9583064af145da29d497418f23bab23286bf0cc83ae0491cbf" },
  { entry: frozenFundsArticle, count: 4, digest: "5df936c27a4f95b051df415024788e238530a22d32a039ba21b7b58eeead128d" },
  { entry: riskCommunicationArticle, count: 8, digest: "70e8410e74317fc5d14367c168dab52493dafa77abefd84fc45e58ac720a987d" },
  { entry: merchantSupportArticle, count: 6, digest: "0b039dd73ef3710c7322960022926e0995ac5da92895561d3d167e749ba9e4a1" },
  { entry: instantOnboardingArticle, count: 6, digest: "9f46db5dc2a7e10352d41275977641e4a4cb00120f8ff842ebdf9d125a7dc3ff" },
] as const;
for (const { entry, count, digest } of fixtures) {
  const articlePath = entry.path;
  const sourceDigest = digest;

  test(`Company Blog leads to ${entry.title}`, async ({ page }) => {
    await page.goto("/");
    const company = await openFooterGroup(page, "Company");
    await expect(company.locator("a")).toHaveText(["About", "Blog", "Security and privacy", "Contact", "Legal"]);
    await company.getByRole("link", { name: "Blog", exact: true }).click();
    await expect(page).toHaveURL(/\/company\/blog$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Etail Depot Blog");
    await expect(page.locator("main article")).toHaveCount(392);
    await expect(page.locator("main")).toContainText("By Etail Depot");
    await expect(page.locator("main img")).toHaveCount(0);
    const publishedDates = blogArticles.flatMap(article => article.publishedAt ? [article.publishedAt] : []);
    await expect(page.locator("main time")).toHaveCount(publishedDates.length);
    expect(await page.locator("main time").evaluateAll(times => times.map(time => time.getAttribute("datetime")))).toEqual(publishedDates);
    await expect(page.getByText("Articles are coming soon.", { exact: true })).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com/company/blog");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const listing = page.locator("main article").filter({ has: page.getByRole("link", { name: entry.title, exact: true }) });
    await expect(listing).toContainText(entry.summary);
    await expect(listing).not.toContainText(entry.description);
    await page.getByRole("link", { name: entry.title, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(articlePath + "$"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(entry.title);
    await page.getByRole("link", { name: "All articles", exact: true }).click();
    await expect(page).toHaveURL(/\/company\/blog$/);
  });

  test(`${entry.title}: approved article copy and accurate metadata`, async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const errors: string[] = [];
    const external: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (new URL(request.url()).origin !== origin) external.push(request.url()); });
    const response = await page.goto(articlePath);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com" + articlePath);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    await expect(page.locator('meta[name="author"]')).toHaveAttribute("content", "Etail Depot");
    await expect(page.locator('meta[property="article:published_time"], meta[property="article:modified_time"]')).toHaveCount(0);
    await expect(page).toHaveTitle(entry.searchTitle + " | Etail Depot");
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      await expect(page.locator(selector)).toHaveAttribute("content", entry.summary);
    }
    const related = page.getByRole("complementary", { name: "Continue reading" });
    expect(await related.getByRole("link").evaluateAll(links => links.map(link => link.getAttribute("href")))).toEqual(entry.relatedPaths);
    const article = page.locator("article[data-reading-article]");
    await expect(article.getByRole("complementary", { name: "Sources", exact: true })).toBeAttached();
    const blocks = await article.locator('h1, [class*="articleDeck"], [class*="body"] > p, section h2, section p').allTextContents();
    expect(blocks).toHaveLength(count);
    expect(createHash("sha256").update(blocks.map(text => text.trim()).join("\n\n")).digest("hex")).toBe(sourceDigest);
    await expect(article.locator('a[rel="author"]')).toHaveText("Etail Depot");
    await expect(article.locator('a[rel="author"]')).toHaveAttribute("href", "/company/about");
    await expect(article.locator("time, img, iframe, form, input")).toHaveCount(0);
    await expect(article.getByRole("navigation", { name: "In this article" })).toHaveCount(0);
    const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
    const articleGraph = schema.map(raw => JSON.parse(raw)).find(data => data["@graph"]?.some((node: { "@type": string }) => node["@type"] === "BlogPosting"))["@graph"];
    const posting = articleGraph.find((node: { "@type": string }) => node["@type"] === "BlogPosting");
    expect(posting.description).toBe(entry.summary);
    expect(posting.headline).toBe(entry.title);
    expect(posting.author).toMatchObject({ "@type": "Organization", name: "Etail Depot" });
    expect(posting).not.toHaveProperty("datePublished");
    expect(posting).not.toHaveProperty("image");
    const audit = await new AxeBuilder({ page }).include("main").analyze();
    expect(audit.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.reload();
    await expect(article.getByRole("heading", { level: 1 })).toBeVisible();
    expect(external).toEqual([]);
    expect(errors).toEqual([]);
  });

  test(`${entry.title}: readable without JavaScript`, async ({ browser, baseURL, isMobile }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: isMobile ? 320 : 1440, height: 900 } });
    try {
      const page = await context.newPage();
      await page.goto(articlePath);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(entry.title);
      const article = page.locator("article[data-reading-article]");
      await expect(article).toContainText("Your success is Etail’s success.");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      const firstRelated = page.getByRole("complementary", { name: "Continue reading" }).getByRole("link").first();
      await firstRelated.click();
      await expect(page).toHaveURL(new RegExp(entry.relatedPaths[0] + "$"));
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(articlePath + "$"));
      await article.getByRole("link", { name: "Back to the Blog", exact: true }).click();
      await expect(page).toHaveURL(/\/company\/blog$/);
      await page.getByRole("link", { name: entry.title, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(articlePath + "$"));
    } finally { await context.close(); }
  });

}

const riverside = riversidePaymentsArticle;
test("Riverside article preserves approved text and table with original date and source links", async ({ page }) => {
  await page.goto(riverside.path);
  const article = page.locator("article[data-reading-article]");
  const blocks = await article.locator('h1, [class*="articleDeck"], [data-source-block]').allTextContents();
  expect(blocks).toHaveLength(42);
  expect(createHash("sha256").update(blocks.map(text => text.trim()).join("\n\n")).digest("hex")).toBe("e256fc2a3aca9f1b95efecab976db632dfccd56ad37231099eea0d7ec0501026");
  await expect(article.locator("time")).toHaveText("November 12, 2026");
  await expect(article.locator("time")).toHaveAttribute("datetime", "2026-11-12");
  await expect(article.locator('a[rel="author"]')).toHaveText("Etail Depot");
  await expect(page).toHaveTitle(riverside.searchTitle + " | Etail Depot");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com" + riverside.path);
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute("content", "2026-11-12");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(article.getByRole("table")).toHaveAccessibleName("The two models, side by side");
  await expect(article.getByRole("row")).toHaveCount(6);
  await expect(article.getByRole("rowheader")).toHaveCount(5);
  await expect(article.locator("#article-sources a")).toHaveCount(7);
  expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test("Riverside article can be found and its sections followed on desktop and mobile", async ({ page, isMobile }) => {
  await page.goto("/company/blog");
  await page.getByRole("link", { name: riverside.title, exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(riverside.title);
  const contents = page.locator(isMobile ? "[data-article-mobile-contents]" : "[data-article-contents]");
  if (isMobile) await contents.locator("summary").click();
  await contents.getByRole("link", { name: "The two models", exact: true }).click();
  await expect(page).toHaveURL(/#the-two-models$/);
  await expect(page.getByRole("heading", { name: "The two models, side by side", exact: true })).toBeInViewport();
  await page.reload();
  await expect(page.getByRole("heading", { name: "The two models, side by side", exact: true })).toBeInViewport();
  await page.getByRole("link", { name: "Back to the Blog", exact: true }).click();
  await expect(page).toHaveURL(/\/company\/blog$/);
});

test("Riverside comparison and sources remain readable without JavaScript", async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: isMobile ? 320 : 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(riverside.path);
    const table = page.getByRole("table");
    await expect(table.getByRole("rowheader")).toHaveText(["Your costs", "Your contract", "Leaving", "When you need help", "When you grow"]);
    await expect(table.getByRole("cell")).toHaveCount(10);
    await expect(page.locator("#article-sources a")).toHaveCount(7);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const related = page.getByRole("complementary", { name: "Continue reading" }).getByRole("link").first();
    await related.click();
    await expect(page).toHaveURL(new RegExp(riverside.relatedPaths[0] + "$"));
  } finally { await context.close(); }
});

const declined = declinedProcessingArticle;
test("Processing-decline article preserves the approved wording, date and metadata", async ({ page }) => {
  const response = await page.goto(declined.path);
  expect(response?.status()).toBe(200);
  const article = page.locator("article[data-reading-article]");
  const blocks = await article.locator('h1, [class*="articleDeck"], [data-source-block]').allTextContents();
  expect(blocks).toHaveLength(13);
  expect(createHash("sha256").update(blocks.map(text => text.trim()).join("\n\n")).digest("hex")).toBe("726cafdc20d7bd006df053c46a128a834a01b0e12e318c6b2b2261a68c7765bd");
  await expect(article.locator("time")).toHaveText("November 12, 2026");
  await expect(article.locator("time")).toHaveAttribute("datetime", "2026-11-12");
  await expect(article.locator('a[rel="author"]')).toHaveText("Etail Depot");
  await expect(page).toHaveTitle(declined.searchTitle + " | Etail Depot");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com" + declined.path);
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute("content", "2026-11-12");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test("Processing-decline article opens from Blog and follows section links on desktop and mobile", async ({ page, isMobile }) => {
  await page.goto("/company/blog");
  await page.getByRole("link", { name: declined.title, exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(declined.title);
  const contents = page.locator(isMobile ? "[data-article-mobile-contents]" : "[data-article-contents]");
  if (isMobile) await contents.locator("summary").click();
  await contents.getByRole("link", { name: "Structured approval", exact: true }).click();
  await expect(page).toHaveURL(/#structured-approval$/);
  const heading = page.getByRole("heading", { name: "A structured yes instead of a flat no", exact: true });
  await expect(heading).toBeInViewport();
  await page.reload();
  await expect(heading).toBeInViewport();
  await page.getByRole("link", { name: "Back to the Blog", exact: true }).click();
  await expect(page).toHaveURL(/\/company\/blog$/);
});

test("Processing-decline article and related reading work without JavaScript", async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: isMobile ? 320 : 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(declined.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(declined.title);
    await expect(page.locator("article")).toContainText("It is not the last word on your business.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const related = page.getByRole("complementary", { name: "Continue reading" }).getByRole("link").first();
    await related.click();
    await expect(page).toHaveURL(new RegExp(declined.relatedPaths[0] + "$"));
    await page.goBack();
    await page.getByRole("link", { name: "Back to the Blog", exact: true }).click();
    await expect(page).toHaveURL(/\/company\/blog$/);
  } finally { await context.close(); }
});

const approval = providerApprovalArticle;
test("Provider-approval article preserves the approved wording, date and metadata", async ({ page }) => {
  const response = await page.goto(approval.path);
  expect(response?.status()).toBe(200);
  const article = page.locator("article[data-reading-article]");
  const blocks = await article.locator('h1, [class*="articleDeck"], [data-source-block]').allTextContents();
  expect(blocks).toHaveLength(19);
  expect(createHash("sha256").update(blocks.map(text => text.trim()).join("\n\n")).digest("hex")).toBe("a7cf9f4632609d49415d320915668bb7e663e4397295102869c14b086d4d51a4");
  await expect(article.locator("time")).toHaveText("November 12, 2026");
  await expect(article.locator("time")).toHaveAttribute("datetime", "2026-11-12");
  await expect(article.locator('a[rel="author"]')).toHaveText("Etail Depot");
  await expect(page).toHaveTitle(approval.searchTitle + " | Etail Depot");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com" + approval.path);
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute("content", "2026-11-12");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test("Provider-approval article opens from Blog and follows section links on desktop and mobile", async ({ page, isMobile }) => {
  await page.goto("/company/blog");
  await page.getByRole("link", { name: approval.title, exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(approval.title);
  const contents = page.locator(isMobile ? "[data-article-mobile-contents]" : "[data-article-contents]");
  if (isMobile) await contents.locator("summary").click();
  await contents.getByRole("link", { name: "Provider responsibilities", exact: true }).click();
  await expect(page).toHaveURL(/#provider-responsibilities$/);
  const heading = page.getByRole("heading", { name: "The obligations it carries alongside yours", exact: true });
  await expect(heading).toBeInViewport();
  await page.reload();
  await expect(heading).toBeInViewport();
  await page.getByRole("link", { name: "Back to the Blog", exact: true }).click();
  await expect(page).toHaveURL(/\/company\/blog$/);
});

test("Provider-approval article and related reading work without JavaScript", async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: isMobile ? 320 : 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(approval.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(approval.title);
    await expect(page.locator("article")).toContainText("That is the relationship we are building, one approval at a time.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const related = page.getByRole("complementary", { name: "Continue reading" }).getByRole("link").first();
    await related.click();
    await expect(page).toHaveURL(new RegExp(approval.relatedPaths[0] + "$"));
    await page.goBack();
    await page.getByRole("link", { name: "Back to the Blog", exact: true }).click();
    await expect(page).toHaveURL(/\/company\/blog$/);
  } finally { await context.close(); }
});

const payfac = payfacOperationsArticle;
test("PayFac operations article preserves the approved wording, date and metadata", async ({ page }) => {
  const response = await page.goto(payfac.path);
  expect(response?.status()).toBe(200);
  const article = page.locator("article[data-reading-article]");
  const blocks = await article.locator('h1, [class*="articleDeck"], [data-source-block]').allTextContents();
  expect(blocks).toHaveLength(14);
  expect(createHash("sha256").update(blocks.map(text => text.trim()).join("\n\n")).digest("hex")).toBe("2cf867b74f5e6b77c1f31ccbe2fb512023b052f98643cd8b9c318f6a4f54f5d6");
  await expect(article.locator("time")).toHaveText("November 12, 2026");
  await expect(article.locator("time")).toHaveAttribute("datetime", "2026-11-12");
  await expect(article.locator('a[rel="author"]')).toHaveText("Etail Depot");
  await expect(page).toHaveTitle(payfac.searchTitle + " | Etail Depot");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com" + payfac.path);
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute("content", "2026-11-12");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test("PayFac operations article opens from Blog and follows section links on desktop and mobile", async ({ page, isMobile }) => {
  await page.goto("/company/blog");
  await page.getByRole("link", { name: payfac.title, exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(payfac.title);
  const contents = page.locator(isMobile ? "[data-article-mobile-contents]" : "[data-article-contents]");
  if (isMobile) await contents.locator("summary").click();
  await contents.getByRole("link", { name: "Where operations fail", exact: true }).click();
  await expect(page).toHaveURL(/#operating-risks$/);
  const heading = page.getByRole("heading", { name: "Why so many get it wrong", exact: true });
  await expect(heading).toBeInViewport();
  await page.reload();
  await expect(heading).toBeInViewport();
  await page.getByRole("link", { name: "Back to the Blog", exact: true }).click();
  await expect(page).toHaveURL(/\/company\/blog$/);
});

test("PayFac operations article and related reading work without JavaScript", async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: isMobile ? 320 : 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(payfac.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(payfac.title);
    await expect(page.locator("article")).toContainText("The merchants who depend on it deserve a provider that understood that before taking their money.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const related = page.getByRole("complementary", { name: "Continue reading" }).getByRole("link").first();
    await related.click();
    await expect(page).toHaveURL(new RegExp(payfac.relatedPaths[0] + "$"));
    await page.goBack();
    await page.getByRole("link", { name: "Back to the Blog", exact: true }).click();
    await expect(page).toHaveURL(/\/company\/blog$/);
  } finally { await context.close(); }
});

const cancellation = merchantCancellationArticle;
test("Merchant cancellation article preserves the approved wording, date and metadata", async ({ page }) => {
  const response = await page.goto(cancellation.path);
  expect(response?.status()).toBe(200);
  const article = page.locator("article[data-reading-article]");
  const blocks = await article.locator('h1, [class*="articleDeck"], [data-source-block]').allTextContents();
  expect(blocks).toHaveLength(13);
  expect(createHash("sha256").update(blocks.map(text => text.trim()).join("\n\n")).digest("hex")).toBe("2afe60dc3234880517ed32454895b21552d7591b20aa549623eea8be27303bd2");
  await expect(article.locator("time")).toHaveText("November 12, 2026");
  await expect(article.locator("time")).toHaveAttribute("datetime", "2026-11-12");
  await expect(article.locator('a[rel="author"]')).toHaveText("Etail Depot");
  await expect(page).toHaveTitle(cancellation.searchTitle + " | Etail Depot");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com" + cancellation.path);
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute("content", "2026-11-12");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test("Merchant cancellation article opens from Blog and follows section links on desktop and mobile", async ({ page, isMobile }) => {
  await page.goto("/company/blog");
  await page.getByRole("link", { name: cancellation.title, exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(cancellation.title);
  const contents = page.locator(isMobile ? "[data-article-mobile-contents]" : "[data-article-contents]");
  if (isMobile) await contents.locator("summary").click();
  await contents.getByRole("link", { name: "Cancelling with Trolleys", exact: true }).click();
  await expect(page).toHaveURL(/#cancelling-with-etail-depot$/);
  const heading = page.getByRole("heading", { name: "With Trolleys, you can request closure. Directly. At any time.", exact: true });
  await expect(heading).toBeInViewport();
  await page.reload();
  await expect(heading).toBeInViewport();
  await page.getByRole("link", { name: "Back to the Blog", exact: true }).click();
  await expect(page).toHaveURL(/\/company\/blog$/);
});

test("Merchant cancellation article and related reading work without JavaScript", async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: isMobile ? 320 : 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(cancellation.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(cancellation.title);
    await expect(page.locator("article")).toContainText("If you are stuck in a contract you cannot get out of, talk to us anyway. We will help you understand your account’s closure requirements and plan the transition, whenever you are free to make it.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const related = page.getByRole("complementary", { name: "Continue reading" }).getByRole("link").first();
    await related.click();
    await expect(page).toHaveURL(new RegExp(cancellation.relatedPaths[0] + "$"));
    await page.goBack();
    await page.getByRole("link", { name: "Back to the Blog", exact: true }).click();
    await expect(page).toHaveURL(/\/company\/blog$/);
  } finally { await context.close(); }
});

test("Blog saved-section reload stays on the selected section at 320px", async ({ page, browserName, isMobile }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(riverside.path);
  const contents = page.locator("[data-article-mobile-contents]");
  await contents.locator("summary").click();
  await contents.getByRole("link", { name: "The playbook", exact: true }).click();
  const section = page.locator("#the-playbook");
  await expect(section).toBeInViewport();
  await page.reload();
  await expect(section).toBeInViewport();
  const initialPosition = await page.evaluate(() => scrollY);
  // Touch WebKit can restore the pre-keyboard offset after synthetic PageDown.
  // Keep native cross-document Back coverage with a deterministic reading scroll.
  if (browserName === "webkit" && isMobile) await page.evaluate(() => window.scrollBy({ top: 350, behavior: "instant" }));
  else await page.mouse.wheel(0, 350);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialPosition + 100);
  await page.waitForTimeout(700);
  const readingPosition = await page.evaluate(() => scrollY);
  await page.goto("/company/blog");
  await page.goBack({ waitUntil: "networkidle" });
  await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - readingPosition)).toBeLessThanOrEqual(2);
});


test("payment link article uses the existing Blog flow without categories or a live checkout", async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/company/blog");
  await expect(page.locator("main article")).toHaveCount(392);
  await expect(page.locator('main [class*="articleMeta"] span')).toHaveCount(0);
  await page.getByRole("link", { name: paymentLinkArticle.title, exact: true }).click();
  const article = page.locator("article[data-reading-article]");
  await expect(article.getByRole("heading", { level: 1 })).toHaveText(paymentLinkArticle.title);
  await expect(article.locator('a[rel="author"]')).toHaveText("Etail Depot");
  await expect(article).toContainText("First, ask the Trolleys team to confirm that Pay by Link is enabled for your merchant account.");
  await expect(article).toContainText("Payment links and QR payments carry an additional charge per successful payment");
  await expect(article.locator("iframe, form, input, time")).toHaveCount(0);
  await expect(page.locator('meta[property="article:section"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com" + paymentLinkArticle.path);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  if (isMobile) await page.locator("[data-article-mobile-contents] summary").click();
  const contents = page.getByRole("navigation", { name: "In this article" }).filter({ visible: true });
  await contents.getByRole("link", { name: "Confirm the payment", exact: true }).click();
  await expect(page).toHaveURL(/#confirm-the-payment$/);
  await expect(page.locator("#confirm-the-payment")).toBeInViewport();
  const sources = article.getByRole("complementary", { name: "Sources", exact: true });
  await expect(sources.getByRole("link")).toHaveCount(4);
  const related = page.getByRole("complementary", { name: "Continue reading" });
  await expect(related.getByRole("link")).toHaveCount(2);
  expect(await related.evaluate(node => Boolean(node.closest("article")))).toBe(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
});

test("payment link guidance stays readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    const response = await page.goto(baseURL + paymentLinkArticle.path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    await expect(page.locator("article[data-reading-article] section")).toHaveCount(6);
    await expect(page.locator("#create-the-request")).toContainText("Cybersource Business Center");
    await expect(page.locator("#confirm-the-payment")).toContainText("before marking the order as paid");
    await expect(page.locator('a[href="/pricing"]')).not.toHaveCount(0);
  } finally { await context.close(); }
});

test("Blog paired headlines align without inventing dates or adding mobile space", async ({ page }) => {
  await page.goto("/company/blog");
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    const rows = await page.locator('[class*="articleGrid"] > article').evaluateAll(nodes => nodes.map(node => {
      const heading = node.querySelector("h3")!.getBoundingClientRect();
      const byline = node.querySelector('[class*="cardByline"]')!.getBoundingClientRect();
      return { top: heading.top, byline: byline.bottom };
    }));
    if (width > 760) {
      for (let i = 0; i + 1 < rows.length; i += 2) {
        expect(Math.abs(rows[i].top - rows[i + 1].top)).toBeLessThan(1);
        expect(Math.abs(rows[i].byline - rows[i + 1].byline)).toBeLessThan(1);
      }
    } else {
      for (const spacer of await page.locator('[class*="datePlaceholder"]').all()) await expect(spacer).toBeHidden();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const dates = blogArticles.flatMap(article => article.publishedAt ? [article.publishedAt] : []);
  expect(await page.locator("main time").evaluateAll(nodes => nodes.map(node => node.getAttribute("datetime")))).toEqual(dates);
});

test("Blog reading columns and responsive comparisons align at phone, tablet and desktop widths", async ({ page }) => {
  for (const path of ["payment-gateway-vs-payfac", "merchant-risk-questions-before-applying"]) {
    await page.goto(`/company/blog/${path}`);
    for (const width of [1440, 1024, 900, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => {
        const rect = (selector: string) => {
          const box = document.querySelector(selector)!.getBoundingClientRect();
          return { left: box.left, right: box.right, width: box.width };
        };
        return { title: rect("h1"), body: rect('[class*="readingLayout"] > [class*="body"]'), related: rect('[aria-labelledby="related-articles-title"] ul'), table: rect("table"), row: rect("tbody th") };
      });
      expect(Math.abs(geometry.title.left - geometry.body.left)).toBeLessThan(1);
      expect(Math.abs(geometry.related.left - geometry.body.left)).toBeLessThan(1);
      expect(Math.abs(geometry.related.right - geometry.body.right)).toBeLessThan(1);
      if (width <= 900) expect(Math.abs(geometry.row.width - geometry.table.width)).toBeLessThan(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});


test.describe("Single-page Blog without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("lists every article in order and opens the last article", async ({ page }) => {
    await page.goto("/company/blog");
    await expect(page.locator("main article")).toHaveCount(blogArticles.length);
    await expect(page.locator("main article h2 a, main article h3 a")).toHaveText(blogArticles.map(article => article.title));
    const lastArticle = blogArticles.at(-1)!;
    await page.getByRole("link", { name: lastArticle.title, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${lastArticle.path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lastArticle.title);
    await page.goBack();
    await expect(page.locator("main article")).toHaveCount(blogArticles.length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  });
});
