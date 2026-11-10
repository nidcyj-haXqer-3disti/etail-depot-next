import { expectReadOnlyPlatformExample } from "./platform-example";
import { LEGAL_CENTER_PATHS } from "../../src/shared/site/legal-paths";
import { COMMERCIAL_PATHS } from "../../src/shared/site/commercial-paths";
import { RESOURCE_PATHS } from "../../src/shared/site/resource-paths";
import { STANDARD_REFERENCE_PATHS } from "../../src/shared/site/standard-reference-paths";
import { DEVELOPER_PATHS } from "../../src/shared/site/developer-paths";
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

test("public pages and every internal link resolve without account APIs or cookies", async ({ page, request, context }) => {
  const pages = [...LEGAL_CENTER_PATHS, ...COMMERCIAL_PATHS, ...RESOURCE_PATHS, "/", ...DEVELOPER_PATHS, "/use-cases/software-platforms", "/use-cases/online-businesses", "/services/card-services", "/services/merchant-services", "/resources/help", "/company/privacy", "/company/terms", "/resources/guides"];
  const privateRequests: string[] = [], errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
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
  }
  for (const destination of destinations) {
    const url = new URL(destination, "http://127.0.0.1:3100");
    if (renderedScreenshots.has(url.pathname) || shopifySetupSteps.some(step => "file" in step && url.pathname === `/help/shopify/${step.file}`)) {
      const screenshot = await request.get(url.pathname);
      expect(screenshot.status()).toBe(200);
      expect(screenshot.headers()["content-type"]).toContain("image/webp");
      expect(url.search + url.hash).toBe("");
      continue;
    }
    expect([...pages, ...STANDARD_REFERENCE_PATHS]).toContain(url.pathname);
    expect((await request.get(url.pathname)).status()).toBe(200);
    if (url.hash) {
      await page.goto(url.pathname);
      expect(await page.evaluate(id => document.getElementById(id) !== null, decodeURIComponent(url.hash.slice(1)))).toBe(true);
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
