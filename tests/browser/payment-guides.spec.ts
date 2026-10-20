import { expect, test } from "@playwright/test";
import { openMainNavigation } from "./public-header";

const guidePaths = [
  "/guides/stripe-alternatives",
  "/guides/payment-processing-systems",
  "/guides/what-is-a-chargeback",
  "/guides/how-to-create-a-payment-link",
] as const;

test("merchants can discover each guide, read its references and return to payment acceptance", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const path of guidePaths) {
    await page.goto("/payment-acceptance-service");
    await expect(page.locator(".payment-guides")).toHaveCount(0);
    const menu = await openMainNavigation(page);
    await menu.getByRole("link", { name: "Guides", exact: true }).click();
    await page.locator(`.guide-library-card[href="${path}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("article")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${path}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator(".payment-guide-byline")).toContainText("Etail Depot US, Inc.");
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb", exact: true });
    await expect(breadcrumb.getByRole("link")).toHaveText(["Home", "Guides"]);
    const structured = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    const items = structured["@graph"].find((node: { "@type": string }) => node["@type"] === "BreadcrumbList").itemListElement;
    expect(items.map((item: { item: string }) => item.item)).toEqual(["https://etaildepot.com/", "https://etaildepot.com/guides", `https://etaildepot.com${path}`]);

    const contents = page.getByRole("navigation", { name: "On this page", exact: true });
    for (const link of await contents.getByRole("link").all()) {
      const fragment = await link.getAttribute("href");
      expect(fragment).toMatch(/^#[a-z-]+$/);
      await expect(page.locator(fragment!)).toHaveCount(1);
    }
    const comparison = page.locator(".payment-guide-table-scroll").first();
    await comparison.scrollIntoViewIfNeeded();
    const caption = (await comparison.locator("caption span").boundingBox())!;
    expect(caption.x).toBeGreaterThanOrEqual(0);
    expect(caption.x + caption.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    if (page.viewportSize()!.width < 760) {
      await comparison.focus();
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => comparison.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
    }
    await expect(contents.locator('a[href="#sources"]')).toHaveCount(0);
    const references = page.getByRole("heading", { name: "References", exact: true });
    await references.scrollIntoViewIfNeeded();
    await expect(references).toBeInViewport();
    const sources = page.locator('.payment-guide-sources a[rel~="external"]');
    expect(await sources.count()).toBeGreaterThanOrEqual(2);
    for (const source of await sources.all()) {
      const url = new URL((await source.getAttribute("href"))!);
      expect(url.protocol).toBe("https:");
      await expect(source).toHaveAttribute("referrerpolicy", "no-referrer");
    }
    await expect(page.locator(".payment-guides-card")).toHaveCount(guidePaths.length - 1);
    await expect(page.locator(`.payment-guides-card[href="${path}"]`)).toHaveCount(0);
    await expect(page.locator("form, input, iframe")).toHaveCount(0);
    expect((await request.get(`${path}/not-a-page`)).status()).toBe(404);
    expect(await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1);
    await breadcrumb.getByRole("link", { name: "Guides", exact: true }).click();
    await expect(page).toHaveURL(/\/guides$/);
    await expect(page.locator(".guide-library-card")).toHaveCount(guidePaths.length);
    const navigation = await openMainNavigation(page);
    await navigation.getByRole("link", { name: "Payment acceptance", exact: true }).click();
    await expect(page).toHaveURL(/\/payment-acceptance-service$/);
  }
  expect(errors).toEqual([]);
});

test("guide handoffs use the approved Trolleys entrance without forwarding visitor data", async ({ page, context }) => {
  const handoffs: { url: string; referer: string | null; method: string }[] = [];
  const mutations: string[] = [];
  await page.route("**/*", async route => {
    const request = route.request();
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      mutations.push(request.method());
      await route.abort();
    } else if (new URL(request.url()).origin === "https://trolleys.ai") {
      if (request.isNavigationRequest()) handoffs.push({ url: request.url(), method: request.method(), referer: await request.headerValue("referer") });
      await route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Local handoff capture</h1>" });
    } else await route.continue();
  });
  for (const path of guidePaths) {
    await page.goto(`${path}?source=synthetic-review#sources`);
    const action = page.locator(".payment-guide-next").getByRole("link", { name: "Continue to Trolleys", exact: true });
    await expect(action).toHaveAttribute("href", "https://trolleys.ai");
    await expect(action).toHaveAttribute("referrerpolicy", "no-referrer");
    await expect(action).toHaveAttribute("rel", /\bnoreferrer\b/);
    await action.click();
    await expect(page).toHaveURL("https://trolleys.ai/");
  }
  expect(handoffs).toEqual(guidePaths.map(() => ({ url: "https://trolleys.ai/", method: "GET", referer: null })));
  expect(mutations).toEqual([]);
  expect(await context.cookies()).toEqual([]);
});


test("main navigation opens the guide library while support stays in the footer", async ({ page }) => {
  await page.goto("/");
  const navigation = await openMainNavigation(page);
  await expect(navigation.getByRole("link", { name: "Help", exact: true })).toHaveCount(0);
  await navigation.getByRole("link", { name: "Guides", exact: true }).click();
  await expect(page).toHaveURL(/\/guides$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Guides");
  await expect(page.locator(".guide-library-card")).toHaveCount(guidePaths.length);
  expect(await page.locator(".guide-library-card").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")))).toEqual([
    "/guides/how-to-create-a-payment-link", "/guides/stripe-alternatives", "/guides/payment-processing-systems", "/guides/what-is-a-chargeback",
  ]);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.getByRole("contentinfo").getByRole("link", { name: "Help center", exact: true }).click();
  await expect(page).toHaveURL(/\/help$/);
});

test("guide library combines topics and search without adding routes", async ({ page }) => {
  await page.goto("/guides");
  const search = page.getByRole("searchbox", { name: "Search guides", exact: true });
  await expect(search).toBeEnabled();
  await search.fill("QR code");
  await expect(page.locator(".guide-library-card")).toHaveCount(1);
  await expect(page.locator(".guide-library-card h3")).toHaveText("Create a payment link");
  const mobileTopic = page.getByRole("combobox", { name: "Browse by topic", exact: true });
  if (await mobileTopic.isVisible()) await mobileTopic.selectOption("fees-and-providers");
  else await page.getByRole("button", { name: "Fees and providers", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No guides found", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Show all guides", exact: true }).click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("");
  await expect(page.locator(".guide-library-card")).toHaveCount(4);
  await expect(page.getByLabel("Format", { exact: true })).toHaveCount(0);
  if (await mobileTopic.isVisible()) await mobileTopic.selectOption("taking-payments");
  else await page.getByRole("button", { name: "Taking payments", exact: true }).click();
  await expect(page.locator(".guide-library-card")).toHaveCount(2);
  await expect(page.getByLabel("Subtopic", { exact: true })).toHaveCount(0);
  await search.fill("QR code");
  await expect(page.locator(".guide-library-card h3")).toHaveText("Create a payment link");
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await search.fill("CrÉdIt card processing");
  await expect(page.locator(".guide-library-card h3")).toHaveText("Payment processing systems");
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toBeFocused();
  await page.getByLabel("Sort by", { exact: true }).selectOption("title");
  await expect(page.locator(".guide-library-card h3")).toHaveText(["Create a payment link", "Payment processing systems", "Stripe alternatives", "What is a chargeback?"]);
  await expect(page.getByRole("navigation", { name: "Guide result pages" })).toHaveCount(0);
  await expect(page).toHaveURL(/\/guides$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test("guide links remain readable without JavaScript and drafts stay outside the public library", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/guides");
  await expect(page.locator(".guide-library-card")).toHaveCount(4);
  const paths = await page.locator(".guide-library-card").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")));
  expect(paths.sort()).toEqual([...guidePaths].sort());
  await expect(page.getByRole("searchbox", { name: "Search guides", exact: true })).toBeDisabled();
  await page.locator('.guide-library-card[href="/guides/what-is-a-chargeback"]').click();
  await expect(page.getByRole("article")).toBeVisible();
  expect((await request.get("/guides/ach-payments")).status()).toBe(404);
  await context.close();
});
