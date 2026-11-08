import { expect, test, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openMainNavigation } from "./public-header";
import { expectCompleteGuidePaint } from "./guide-rendering";

const path = "/resources/woocommerce-gateway-integration";

async function openForTarget(page: Page, target: Locator) {
  const parents = await target.evaluate(element => {
    const ids: string[] = [];
    for (let node: Element | null = element; node; node = node.parentElement) {
      if (node.tagName === "DETAILS" && node.id) ids.unshift(node.id);
    }
    return ids;
  });
  for (const id of parents) {
    const detail = page.locator(`#${id}`);
    if (await detail.getAttribute("open") === null) await detail.locator(":scope > summary").click();
  }
}

test("WooCommerce guide is discoverable and screenshots support keyboard enlargement", async ({ page }) => {
  await page.goto("/");
  const nav = await openMainNavigation(page, "Resources");
  await nav.getByRole("link", { name: "WooCommerce integration", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Set up your WooCommerce checkout.");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${path}`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("main figure")).toHaveCount(22);
  await expect(page.locator("main input, main form")).toHaveCount(0);
  await expect(page.locator("#create-shared-secret")).toContainText("Production");
  await expect(page.locator('#sign-in-business-center a[aria-label="Open the live Business Center"]')).toHaveAttribute("href", "https://ubc.cybersource.com/ebc2/");
  await expect(page.locator("#place-test-order")).toContainText("This makes a real charge and may incur fees.");
  for (const step of [5, "8.1", "8.3", "8.6", "8.8", 11, 12]) {
    const link = page.locator(`a[aria-label="Enlarge screenshot for step ${step}"]`);
    await openForTarget(page, link);
    await expect(link).toBeVisible();
  }
  const stepIds = await page.locator('details[name="woo-setup"]').evaluateAll(steps => steps.map(step => step.id));
  expect(stepIds.indexOf("sign-in-business-center")).toBe(stepIds.indexOf("check-your-email") + 1);
  await expect(page.locator("#sign-in-business-center")).toContainText("Organization ID and Username");
  await expect(page.locator("#sign-in-business-center")).toContainText("Do not select Test login");
  await expect(page.locator('#sign-in-business-center a[aria-label="Open the live Business Center"]')).toHaveAttribute("href", "https://ubc.cybersource.com/ebc2/");
  await expect(page.locator("#store-certificate")).toContainText("Do not upload the certificate to the WordPress Media Library.");
  for (const link of await page.getByRole("navigation", { name: "Setup overview" }).getByRole("link").all()) {
    await expect(page.locator((await link.getAttribute("href"))!)).toHaveCount(1);
  }
  const trigger = page.locator('a[aria-label="Enlarge screenshot for step 9"]');
  await openForTarget(page, trigger);
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Step 9: Use your uploaded .p12 file" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close", exact: true })).toBeFocused();
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.goto("/resources/guides");
  await page.getByRole("link", { name: /WooCommerce integration Connect your payment plugin/ }).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
});

test("WooCommerce screenshots remain readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:3100${path}`);
    await page.locator("#enter-credentials > summary").click();
    await openForTarget(page, page.locator("#enter-credentials"));
  await page.locator('a[aria-label="Enlarge screenshot for step 9"]').click();
    await expect(page).toHaveURL(/\/_next\/static\/media\/woo-credentials\.[^/]+\.webp$/);
  } finally { await context.close(); }
});

test("WooCommerce screenshots load before layout on deep links and refresh", async ({ page }) => {
  const requested = new Set<string>();
  let release = () => {};
  let ready = Promise.resolve();
  await page.route("**/*", async route => {
    const req = route.request();
    const pathname = new URL(req.url()).pathname;
    if (/^\/_next\/static\/media\/woo-[^/]+\.webp$/.test(pathname)) requested.add(pathname);
    if (["stylesheet", "script"].includes(req.resourceType())) await ready;
    await route.continue();
  });
  for (const refresh of [false, true]) {
    requested.clear();
    ready = new Promise<void>(resolve => { release = resolve; });
    try {
      if (refresh) await page.reload({ waitUntil: "commit" });
      else await page.goto(`${path}#enter-credentials`, { waitUntil: "commit" });
      // WebKit can reuse a decoded image on reload without a new routed request.
      // It still must be complete before styles or scripts are released.
      await expect.poll(async () => {
        const cached = await page.locator("main figure > a img").evaluateAll(images => images.flatMap(image =>
          image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0
            ? [new URL(image.currentSrc || image.src).pathname] : []));
        return new Set([...requested, ...cached]).size;
      }, { message: "All twenty-two preview images must start or be cached before layout or hydration" }).toBe(22);
    } finally { release(); }
    await page.waitForLoadState("load");
    for (const img of await page.locator("main figure > a img").all()) {
      await expect(img).not.toHaveAttribute("loading", "lazy");
      await expect.poll(() => img.evaluate(el => el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0)).toBe(true);
    }
    await expect(page.locator("#enter-credentials h3")).toBeInViewport();
    for (const img of await page.locator("dialog img").all()) await expect(img).toHaveAttribute("loading", "lazy");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});

test("WooCommerce guide waits for complete markup before first paint", async ({ page, request, baseURL }) => {
  await expectCompleteGuidePaint(page, request, baseURL, path, "#enter-credentials", "#enter-credentials h3");
});

test("WooCommerce guide fits narrow mobile screens and screenshot dialogs", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(path);
  for (const figure of await page.locator("main figure").all()) {
    await openForTarget(page, figure);
    await figure.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    const photo = figure.locator('[data-woo-photo]');
    if (await photo.count()) {
      expect(await photo.evaluateAll(frames => frames.every(frame => {
        const image = frame.querySelector('img')!;
        const f = frame.getBoundingClientRect();
        const i = image.getBoundingClientRect();
        return f.height > 0 && i.left <= f.left + 1 && i.top <= f.top + 1 && i.right >= f.right - 1 && i.bottom >= f.bottom - 1;
      }))).toBe(true);
    }
  }
  await openForTarget(page, page.locator("#enter-credentials"));
  await page.locator('a[aria-label="Enlarge screenshot for step 9"]').click();
  await expect(page.getByRole("button", { name: "Close", exact: true })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});



test("Cyberduck transfer sequence keeps credentials distinct and new artwork accessible", async ({ page }) => {
  await page.goto(`${path}#connect-cyberduck`);
  await expect(page.locator("#connect-cyberduck-title")).toBeInViewport();
  await expect(page.locator('details[name="woo-setup"]')).toHaveCount(13);
  await expect(page.locator('details[name="woo-transfer"]')).toHaveCount(8);
  await expect(page.locator("#store-certificate")).not.toContainText("FileZilla");
  await expect(page.locator("#connect-cyberduck")).toContainText("Use the SFTP password here, not the .p12 password");
  await expect(page.locator("#certificate-woocommerce-path")).toContainText("/srv/htdocs/wp-content/.certificates/example_store.p12");
  await expect(page.locator("#check-certificate-folder")).toContainText("The folder must block public downloads before you upload the .p12.");
  for (const step of ["6.a", "6.b", "7.a", "7.b", "8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7", "8.8"]) {
    const trigger = page.locator(`a[aria-label="Enlarge screenshot for step ${step}"]`);
    await openForTarget(page, trigger);
  await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Close", exact: true })).toBeFocused();
    await expect.poll(() => dialog.locator("img").evaluate(img => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  }
  await page.goto(`${path}#connect-cyberduck`);
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
});


test("Readers can select numbered steps without extra navigation and reopen saved steps", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${path}#prepare-wordpress`);
  await expect(page.getByRole("link", { name: /^(Next:|All steps$|Finish: final checks$)/ })).toHaveCount(0);
  const steps = await page.locator('details[name="woo-setup"]').evaluateAll(nodes=>nodes.map(node=>node.id));
  for (const id of steps) {
    const detail = page.locator(`#${id}`);
    if (await detail.getAttribute("open") === null) await detail.locator(":scope > summary").click();
    await expect(detail.locator(":scope > summary")).toBeInViewport();
    await expect(page.locator('details[name="woo-setup"][open]')).toHaveCount(1);
    if (id === "store-certificate") {
      for (const transfer of await page.locator('details[name="woo-transfer"]').all()) {
        if (await transfer.getAttribute("open") === null) await transfer.locator(":scope > summary").click();
        else await transfer.locator(":scope > summary").scrollIntoViewIfNeeded();
        await expect(transfer.locator(":scope > summary")).toBeInViewport();
        await expect(page.locator('details[name="woo-transfer"][open]')).toHaveCount(1);
      }
    }
  }
  await page.locator("#create-shared-secret > summary").click();
  await expect(page).toHaveURL(/#create-shared-secret$/);
  await page.reload();
  await expect(page.locator("#create-shared-secret")).toHaveAttribute("open", "");
  await expect(page.locator("#create-shared-secret > summary")).toBeInViewport();
  await page.goto(`${path}#connect-cyberduck`);
  await expect(page.locator("#store-certificate")).toHaveAttribute("open", "");
  await expect(page.locator("#connect-cyberduck")).toHaveAttribute("open", "");
  await page.reload();
  await expect(page.locator("#connect-cyberduck-title")).toBeInViewport();
  await page.getByRole("navigation",{name:"Setup overview"}).getByRole("link",{name:/Install the payment plugin/}).click();
  await expect(page.locator("#prepare-wordpress > summary")).toBeInViewport();
  await page.goBack();
  await expect(page.locator("#connect-cyberduck-title")).toBeInViewport();
  expect(errors).toEqual([]);
});


test("Every open step fits phone, tablet and desktop layouts", async ({ page }, testInfo) => {
  for (const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto(`${path}#prepare-wordpress`);
    for (const summary of await page.locator('details[name="woo-setup"] > summary').all()) {
      const detail = summary.locator("..");
      if (await detail.getAttribute("open") === null) await summary.click();
      await expect(summary).toBeInViewport();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    }
    if (process.env.WOO_GUIDE_EVIDENCE_DIR && testInfo.project.name === "desktop") {
      for (const id of ["setup","create-shared-secret","check-certificate-folder","enter-credentials"]) {
        await page.goto(`${path}#${id}`);
        await expect(page.locator(`#${id}`)).toBeInViewport();
        await page.screenshot({path:`${process.env.WOO_GUIDE_EVIDENCE_DIR}/${id}-${width}.png`});
      }
    }
  }
});


test("responsive previews stay eager while full screenshots wait for enlargement", async ({ page }) => {
  const requested = new Set<string>();
  page.on("request", request => requested.add(new URL(request.url()).pathname));
  await page.goto(`${path}#enter-credentials`);
  const trigger = page.locator('a[aria-label="Enlarge screenshot for step 9"]');
  const fullImage = new URL((await trigger.getAttribute("href"))!, page.url()).pathname;
  const preview = trigger.locator("img");
  await expect(preview).toHaveAttribute("loading", "eager");
  await expect(preview).toHaveAttribute("width", "670");
  expect(new URL(await preview.evaluate(image => (image as HTMLImageElement).currentSrc)).pathname).not.toBe(fullImage);
  expect(requested.has(fullImage), "The full-page credential screenshot should not download for a small preview").toBe(false);
  const settings = page.locator('#save-settings figure > a img');
  await expect(settings).toHaveAttribute("srcset", /640w.*1040w.*1440w/);
  expect(await settings.evaluate(image => new URL((image as HTMLImageElement).currentSrc).pathname)).toMatch(/-1040\.[^/]+\.webp$/);
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect.poll(() => requested.has(fullImage)).toBe(true);
  await expect.poll(() => dialog.locator("img").evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth === 1440)).toBe(true);
});
