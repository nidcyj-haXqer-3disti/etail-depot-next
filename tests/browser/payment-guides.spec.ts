import { expect, test } from "@playwright/test";

const guidePaths = [
  "/guides/stripe-alternatives",
  "/guides/payment-processing-systems",
  "/guides/what-is-a-chargeback",
] as const;

test("merchants can discover each guide, read its sources and return to payment acceptance", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const path of guidePaths) {
    await page.goto("/payment-acceptance-service");
    const discovery = page.getByRole("region", { name: "Payment providers, fees and chargebacks.", exact: true });
    await discovery.locator(`a[href="${path}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("article")).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${path}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator(".payment-guide-byline")).toContainText("Etail Depot US, Inc.");
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb", exact: true });
    await expect(breadcrumb.getByRole("link")).toHaveText(["Home", "Payment acceptance"]);
    const structured = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    const items = structured["@graph"].find((node: { "@type": string }) => node["@type"] === "BreadcrumbList").itemListElement;
    expect(items.map((item: { item: string }) => item.item)).toEqual(["https://etaildepot.com/", "https://etaildepot.com/payment-acceptance-service", `https://etaildepot.com${path}`]);

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
    await contents.getByRole("link", { name: "Sources", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Sources", exact: true })).toBeInViewport();
    const sources = page.locator('.payment-guide-sources a[rel~="external"]');
    expect(await sources.count()).toBeGreaterThanOrEqual(2);
    for (const source of await sources.all()) {
      const url = new URL((await source.getAttribute("href"))!);
      expect(url.protocol).toBe("https:");
      await expect(source).toHaveAttribute("referrerpolicy", "no-referrer");
    }
    await expect(page.locator(".payment-guides-card")).toHaveCount(2);
    await expect(page.locator(`.payment-guides-card[href="${path}"]`)).toHaveCount(0);
    await expect(page.locator("form, input, iframe")).toHaveCount(0);
    expect((await request.get(`${path}/not-a-page`)).status()).toBe(404);
    expect(await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1);
    await breadcrumb.getByRole("link", { name: "Payment acceptance", exact: true }).click();
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
