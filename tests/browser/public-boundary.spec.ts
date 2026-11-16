import { CORE_PUBLIC_PATHS } from "../../src/shared/site/public-page-inventory";
import { expectReadOnlyPlatformExample } from "./platform-example";
import { STANDARD_REFERENCE_PATHS } from "../../src/shared/site/standard-reference-paths";
import { shopifySetupSteps } from "../../src/features/resources/integrations/shopify/shopify-content";
import { expect, test } from "@playwright/test";

test("renamed product bookmarks retain their section and reject submitted data", async ({ page, request, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const destinations = [
    ["/card-services", "/services/card-services", "#wallets"],
    ["/payment-services", "/services/merchant-services", "#fees"],
    ["/merchant-onboarding", "/services/merchant-onboarding", "#main-content"],
    ["/software-partners", "/use-cases/software-platforms", "#integration"],
    ["/contact", "/company/contact", "#account-support"],
    ["/docs/merchant-onboarding", "/resources/merchant-account-setup", "#registration-email"],
    ["/resources/blog", "/company/blog", "#main-content"],
    ["/resources/no-code-checkout-experience", "/use-cases/no-code-checkout-experience", "#setup"],
    ["/guides/how-to-create-a-payment-link", "/use-cases/no-code-checkout-experience", "#create-the-request"],
    ["/guides/consuming-webhooks", "/developers/webhooks", "#event-handler"],
    ["/guides/iso-20022/payment-transaction-status/acsp", "/resources/guides/iso-20022/payment-transaction-status/acsp", "#definition"],
  ];
  for (const [oldPath, destination, section] of destinations) {
    for (const suffix of ["", "/", ".html", "/index.html"]) {
      for (const method of ["GET", "HEAD"]) {
        const response = await request.fetch(`${oldPath}${suffix}?next=https://other.invalid&token=synthetic-test`, { method, maxRedirects: 0 });
        expect(response.status()).toBe(308);
        expect(response.headers().location).toBe(`${origin}${destination}`);
        expect(response.headers()["set-cookie"]).toBeUndefined();
      }
    }
    for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
      const response = await request.fetch(`${oldPath}?next=https://other.invalid`, { method, data: "synthetic-private-input", maxRedirects: 0 });
      expect(response.status()).toBe(405);
      expect(response.headers().allow).toBe("GET, HEAD");
      expect(response.headers().location).toBeUndefined();
      expect(response.headers()["cache-control"]).toBe("no-store");
      expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    }
    const unrelated = await request.get(`${oldPath}/unrelated`, { maxRedirects: 0 });
    expect(unrelated.status()).toBe(404);
    expect(unrelated.headers().location).toBeUndefined();

    const pageResponse = await page.goto(`${oldPath}?next=https://other.invalid&token=synthetic-test${section}`);
    expect(pageResponse!.status()).toBe(200);
    await expect(page).toHaveURL(`${origin}${destination}${section}`);
    await expect(page.locator(section)).toBeVisible();
    expect(await page.evaluate(() => location.search)).toBe("");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${destination}`);
  }
});

test("restored guide section bookmarks reach matching current content", async ({ page, baseURL }) => {
 const origin = new URL(baseURL!).origin;
 const guides = [
  { from: "/guides/consuming-webhooks", to: "/developers/webhooks", sections: [
   ["receipt", "event-handler"], ["interpret", "payment-event"],
   ["failure-example", "recovery-cases"], ["operations", "recovery-cases"],
  ] },
  { from: "/guides/how-to-create-a-payment-link", to: "/use-cases/no-code-checkout-experience", sections: [
   ["prepare-the-request", "prepare-the-request"], ["create-the-request", "create-the-request"],
   ["check-before-sending", "check-before-sending"], ["share-the-link", "share-the-link"],
   ["card-payment-fees", "card-payment-fees"], ["confirm-the-payment", "confirm-the-payment"],
  ] },
 ];
 for (const guide of guides) {
  for (const [oldSection, currentSection] of guide.sections) {
   const response = await page.goto(`${guide.from}#${oldSection}`);
   expect(response!.status()).toBe(200);
   await expect(page).toHaveURL(`${origin}${guide.to}#${oldSection}`);
   await expect(page.locator(`#${oldSection}`)).toHaveCount(1);
   await expect(page.locator(`#${currentSection}`)).toBeInViewport();
   expect(response!.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  }
 }
 await expect(page.locator("#card-payment-fees")).toHaveAttribute("href", "/pricing");
});

test("public pages and every internal link resolve without account APIs or cookies", async ({ page, request, context }) => {
  const pages = CORE_PUBLIC_PATHS;
  // The inventory deliberately waits for 500 ms of network idle per document.
  // Budget that fixed wait separately from the existing 90 seconds of checks.
  test.setTimeout(90_000 + pages.length * 500);
  const renderedIds = new Map<string, Set<string>>();
  const privateRequests: string[] = [], errors: string[] = [];
  page.on("pageerror", error => errors.push(error.stack || `${error.name}: ${error.message}`));
  page.on("request", req => { if (new URL(req.url()).pathname.startsWith("/api/")) privateRequests.push(req.url()); });
  const destinations = new Set<string>();
  const renderedScreenshots = new Set<string>();
  for (const path of pages) {
    const response = await page.goto(path);
    expect(response!.status()).toBe(200);
    expect(response!.headers()["set-cookie"]).toBeUndefined();
    await expect(page.locator("form,iframe")).toHaveCount(0);
    if (path === "/pricing") {
      // The local fee estimate never submits a payment or creates an account.
      await expect(page.locator("input")).toHaveCount(1);
      await expect(page.locator('.fee-estimate input#payment-amount[type="text"]')).toHaveCount(1);
      await expect(page.locator('.fee-estimate input[type="checkbox"]')).toHaveCount(0);
      await expect(page.locator("select, textarea, [contenteditable=true]")).toHaveCount(0);
    } else if (path === "/use-cases/software-platforms") {
      await expectReadOnlyPlatformExample(page);
    } else if (path === "/resources/guides") {
      await expect(page.locator("input")).toHaveCount(0);
      await expect(page.locator("select, textarea, [contenteditable=true]")).toHaveCount(0);
      await expect(page.locator(".standards-collections-grid > a")).toHaveCount(2);
      await expect(page.locator("[data-library-subject]")).toHaveCount(0);
    } else await expect(page.locator("input")).toHaveCount(0);
    const links = await page.locator("a[href]").evaluateAll(nodes => nodes.map(node => new URL(node.getAttribute("href")!, location.href)).filter(url => url.origin === location.origin).map(url => url.pathname + url.search + url.hash));
    for (const link of links) destinations.add(link);
    for (const href of await page.locator('main figure > a[href]').evaluateAll(links => links.filter(link => {
      // A cropped preview can link to the full-size image in its sibling dialog.
      const href = (link as HTMLAnchorElement).href;
      return Array.from(link.closest('figure')!.querySelectorAll('img')).some(image => image.src === href);
    }).map(link => new URL((link as HTMLAnchorElement).href).pathname))) renderedScreenshots.add(href);
    for (const image of await page.locator("img:visible").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(el => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
    // This static inventory has already checked the UI and images. Let background
    // work finish before replacing its document: WebKit can report teardown of a
    // handled prefetch as an access-control pageerror. This is not a readiness or
    // performance assertion; keep actual navigation tests and error checks intact.
    await page.waitForLoadState("networkidle");
    renderedIds.set(path, new Set(await page.locator("[id]").evaluateAll(nodes => nodes.map(node => node.id))));
    expect(errors, `Unexpected browser errors while inspecting ${path}`).toEqual([]);
  }
  for (const destination of destinations) {
    const url = new URL(destination, "http://127.0.0.1:3100");
    if (renderedScreenshots.has(url.pathname) || shopifySetupSteps.some(step => "file" in step && url.pathname === `/help/shopify/${step.file}`)) {
      const screenshot = await request.get(url.pathname);
      expect(screenshot.status()).toBe(200);
      const imageType = ({ webp: "image/webp", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" } as Record<string, string>)[url.pathname.split(".").at(-1)!];
      expect(imageType, `Reviewed screenshot format: ${url.pathname}`).toBeDefined();
      expect(screenshot.headers()["content-type"].split(";")[0]).toBe(imageType);
      expect(url.search + url.hash).toBe("");
      continue;
    }
    expect([...pages, ...STANDARD_REFERENCE_PATHS]).toContain(url.pathname);
    expect((await request.get(url.pathname)).status()).toBe(200);
    if (url.hash) {
      // Reuse the rendered document instead of reloading it for every bookmark.
      if (!renderedIds.has(url.pathname)) {
        expect((await page.goto(url.pathname))!.status()).toBe(200);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await page.waitForLoadState("networkidle");
        renderedIds.set(url.pathname, new Set(await page.locator("[id]").evaluateAll(nodes => nodes.map(node => node.id))));
      }
      expect(renderedIds.get(url.pathname)!.has(decodeURIComponent(url.hash.slice(1))), `Missing section: ${destination}`).toBe(true);
    }
  }
  expect(await context.cookies()).toEqual([]);
  expect(privateRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("old account bookmarks are local redirects and old financial endpoints are gone", async ({ request, page }) => {
  for (const [path, destination] of [["/login", "/resources/help#access"], ["/services", "/"], ["/cardholder-services/cards/example", "/services/card-services"], ["/merchant-services/terminals/example", "/services/merchant-services"]]) {
    const response = await request.get(`${path}?next=https://other.invalid&token=synthetic-test`, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    const location = new URL(response.headers().location, "http://127.0.0.1:3100");
    expect(location.href).toBe(`http://127.0.0.1:3100${destination.includes("#") ? destination : `${destination}#main-content`}`);
    expect(response.headers()["set-cookie"]).toBeUndefined();
  }
  for (const path of ["/api/v1/sessions", "/api/v1/services", "/api/v1/guest/publications/example/payments", "/checkout/example", "/payments/example", "/pay/example"]) {
    for (const method of ["GET", "POST"]) {
      const response = await request.fetch(path, { method, maxRedirects: 0 });
      expect(response.status()).toBe(410);
      expect(response.headers().location).toBeUndefined();
      expect(response.headers()["set-cookie"]).toBeUndefined();
    }
  }
  await page.goto("/cardholder-services?next=private#synthetic-token");
  await expect(page).toHaveURL(/\/services\/card-services#main-content$/);
  expect(await page.evaluate(() => location.hash)).toBe("#main-content");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect((await page.goto("/this-page-does-not-exist"))!.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3100/");
});
