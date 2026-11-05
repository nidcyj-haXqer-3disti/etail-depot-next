import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openMainNavigation } from "./public-header";

const path = "/resources/shopify-gateway-integration";

test("Shopify guide is discoverable and its screenshots can be enlarged with the keyboard", async ({ page }) => {
  await page.goto("/");
  const nav = await openMainNavigation(page, "Resources");
  await nav.getByRole("link", { name: "Shopify integration", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Connect Shopify to Cybersource.");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${path}`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("main figure")).toHaveCount(12);
  for (const screenshot of await page.locator("main figure > a img").all()) {
    await screenshot.scrollIntoViewIfNeeded();
    await expect.poll(() => screenshot.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
  }
  const trigger = page.getByRole("link", { name: "Enlarge screenshot for step 9", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Step 9: Review the account connection" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close", exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  const sectionLinks = page.getByRole("navigation", { name: "On this page" }).getByRole("link");
  for (const link of await sectionLinks.all()) {
    const href = await link.getAttribute("href");
    await expect(page.locator(href!)).toHaveCount(1);
  }
  await expect(page.locator('main a[href="/contact#account-support"]')).toHaveCount(1);
  const support = await page.request.get("/contact");
  expect(await support.text()).toContain('id="account-support"');
});

test("Only the reviewed resource route is served", async ({ request }) => {
  expect((await request.get(path)).status()).toBe(200);
  expect((await request.get("/resources/not-reviewed")).status()).toBe(404);
});


test("Guide screenshots remain available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:3100${path}`);
    await page.getByRole("link", { name: "Enlarge screenshot for step 9", exact: true }).click();
    await expect(page).toHaveURL(/\/help\/shopify\/agreement\.webp$/);
  } finally { await context.close(); }
});


test("Shopify logo and first screenshot load before styles and scripts on first visit and refresh", async ({ page }) => {
 let releaseResources = () => {};
 let resourcesReady = Promise.resolve();
 let logoRequested = false;
 let firstScreenshotRequested = false;
 await page.route("**/*", async route => {
  const request = route.request();
  const pathname = new URL(request.url()).pathname;
  if (pathname.startsWith("/_next/static/media/trolleys-portal-logo.")) logoRequested = true;
  if (pathname === "/help/shopify/settings.webp") firstScreenshotRequested = true;
  if (["stylesheet", "script"].includes(request.resourceType())) await resourcesReady;
  await route.continue();
 });
 // Interception disables the HTTP cache, including on refresh.
 for (const refresh of [false, true]) {
  logoRequested = false;
  firstScreenshotRequested = false;
  resourcesReady = new Promise<void>(resolve => { releaseResources = resolve; });
  try {
   if (refresh) await page.reload({ waitUntil: "commit" });
   else await page.goto(path, { waitUntil: "commit" });
   await expect.poll(() => firstScreenshotRequested, { message: "The first Shopify screenshot must not wait for layout or hydration" }).toBe(true);
   await expect.poll(() => logoRequested).toBe(true);
  } finally { releaseResources(); }
  await page.waitForLoadState("load");
  const openingImages = page.locator('#before-you-start img, #open-settings figure > a img');
  await expect(openingImages).toHaveCount(2);
  for (const image of await openingImages.all()) {
   await expect(image).not.toHaveAttribute("loading", "lazy");
   await expect.poll(() => image.evaluate(el => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0)).toBe(true);
  }
  for (const image of await page.locator('main figure > a img:not([src="/help/shopify/settings.webp"])').all()) {
   await expect(image).toHaveAttribute("loading", "lazy");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
 }
});
