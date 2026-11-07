import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openMainNavigation } from "./public-header";
import { expectCompleteGuidePaint } from "./guide-rendering";

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
  for (const summary of await page.locator('details[name="shopify-setup"] > summary').all()) {
    if (await summary.locator("..").getAttribute("open") === null) await summary.click();
    const screenshot = summary.locator("..").locator("figure > a img");
    if (!await screenshot.count()) continue;
    await screenshot.scrollIntoViewIfNeeded();
    await expect.poll(() => screenshot.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
  }
  await page.locator("#review-agreement > summary").click();
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
  const sectionLinks = page.getByRole("navigation", { name: "Setup overview" }).getByRole("link");
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
    await page.locator("#review-agreement > summary").click();
    await page.getByRole("link", { name: "Enlarge screenshot for step 9", exact: true }).click();
    await expect(page).toHaveURL(/\/help\/shopify\/agreement\.webp$/);
  } finally { await context.close(); }
});


test("Shopify branding and first screenshot avoid delayed image requests", async ({ page }) => {
 let releaseResources = () => {};
 let resourcesReady = Promise.resolve();
 let logoRequested = false;
 let firstScreenshotRequested = false;
 await page.route("**/*", async route => {
  const request = route.request();
  const pathname = new URL(request.url()).pathname;
  if (pathname.startsWith("/_next/static/media/trolleys-portal-logo.")) logoRequested = true;
  if (/^\/_next\/static\/media\/settings\.[^/]+\.webp$/.test(pathname)) firstScreenshotRequested = true;
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
  } finally { releaseResources(); }
  await page.waitForLoadState("load");
  expect(logoRequested, "The small logo must be embedded, with no separate image request").toBe(false);
  await expect(page.locator("main .brand-image-trolleys")).toHaveCount(2);
  for (const logo of await page.locator("main .brand-image-trolleys").all()) {
   await expect(logo).toHaveCSS("content", /url\("data:image\/png;base64,/);
  }
  const openingImages = page.locator('#open-settings figure > a img');
  await expect(openingImages).toHaveCount(1);
  for (const image of await openingImages.all()) {
   await expect(image).not.toHaveAttribute("loading", "lazy");
   await expect.poll(() => image.evaluate(el => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0)).toBe(true);
  }
  for (const image of await page.locator('main figure > a img:not([src*="/settings."])').all()) {
   await expect(image).toHaveAttribute("loading", "eager");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
 }
});


test("Shopify screenshots start before layout at later steps and on refresh", async ({ page }) => {
 const requested = new Set<string>();
 let releaseStyles = () => {};
 let stylesReady = Promise.resolve();
 await page.route("**/*", async route => {
  const request = route.request();
  const pathname = new URL(request.url()).pathname;
  if (pathname.startsWith("/help/shopify/") || /^\/_next\/static\/media\/[^/]+\.webp$/.test(pathname)) requested.add(pathname);
  if (["stylesheet", "script"].includes(request.resourceType())) await stylesReady;
  await route.continue();
 });
 for (const refresh of [false, true]) {
  requested.clear();
  stylesReady = new Promise<void>(resolve => { releaseStyles = resolve; });
  try {
   if (refresh) await page.reload({ waitUntil: "commit" });
   else await page.goto(`${path}#confirm-active`, { waitUntil: "commit" });
   await expect.poll(() => requested.size, { timeout: 4000, message: "All ten guide screenshots must start without waiting for layout or restored scroll position" }).toBe(10);
  } finally { releaseStyles(); }
  await page.waitForLoadState("load");
  const screenshots = page.locator("main figure > a img");
  await expect(screenshots).toHaveCount(10);
  for (const image of await screenshots.all()) {
   await expect(image).not.toHaveAttribute("loading", "lazy");
   await expect(image).toHaveAttribute("src", /^\/_next\/static\/media\/[^/]+\.[^/]+\.webp$/);
   expect(await image.evaluate(el => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await expect(page.locator("#confirm-active h3")).toBeInViewport();
  for (const image of await page.locator("dialog img").all()) await expect(image).toHaveAttribute("loading", "lazy");
 }
});


test("Refresh does not paint a partial guide while its HTML is arriving", async ({ page, baseURL, request }) => {
 await expectCompleteGuidePaint(page, request, baseURL, path, "#confirm-active", "#confirm-active h3");
 await expect(page.locator("main figure")).toHaveCount(12);
});


test("Shopify step selection stays clear and saved steps reopen", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${path}#open-settings`);
  await expect(page.getByRole("link", { name: /^(Next:|All steps$)/ })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "On this page", exact: true })).toHaveCount(0);
  await expect(page.locator('details[name="shopify-setup"]')).toHaveCount(12);
  for (const summary of await page.locator('details[name="shopify-setup"] > summary').all()) {
    if (await summary.locator("..").getAttribute("open") === null) await summary.click();
    await expect(summary).toBeInViewport();
    await expect(page.locator('details[name="shopify-setup"][open]')).toHaveCount(1);
  }
  await page.locator("#review-agreement > summary").click();
  await expect(page).toHaveURL(/#review-agreement$/);
  await page.reload();
  await expect(page.locator("#review-agreement")).toHaveAttribute("open", "");
  await expect(page.locator("#review-agreement > summary")).toBeInViewport();
  await page.getByRole("navigation", { name: "Setup overview" }).getByRole("link", { name: /Install the payment app/ }).click();
  await expect(page.locator("#open-settings > summary")).toBeInViewport();
  await page.goBack();
  await expect(page.locator("#review-agreement > summary")).toBeInViewport();
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
  expect(errors).toEqual([]);
});


test("Shopify steps and artwork fit phone, tablet and desktop", async ({ page }, testInfo) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${path}#open-settings`);
    for (const summary of await page.locator('details[name="shopify-setup"] > summary').all()) {
      const detail = summary.locator("..");
      if (await detail.getAttribute("open") === null) await summary.click();
      await expect(summary).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      const photo = detail.locator("figure > a img");
      if (await photo.count()) {
        const dimensions = await photo.evaluate(image => {
          const box = image.getBoundingClientRect();
          return { width: box.width, height: box.height, ratio: Number(image.getAttribute("width")) / Number(image.getAttribute("height")) };
        });
        expect(dimensions.width).toBeGreaterThan(0);
        expect(Math.abs(dimensions.width / dimensions.height - dimensions.ratio)).toBeLessThan(0.01);
      }
    }
    if (process.env.SHOPIFY_GUIDE_EVIDENCE_DIR && testInfo.project.name === "desktop") {
      for (const id of ["before-you-start", "review-agreement", "check-your-email", "verify-integration"]) {
        await page.goto(`${path}#${id}`);
        await expect(page.locator(`#${id}`)).toBeInViewport();
        await page.screenshot({ path: `${process.env.SHOPIFY_GUIDE_EVIDENCE_DIR}/${id}-${width}.png` });
      }
    }
  }
});
