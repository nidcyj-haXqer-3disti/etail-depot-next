import { expect, test } from "@playwright/test";
import { expectCompleteGuidePaint } from "./guide-rendering";

test("page families do not paint an incomplete header during document delivery", async ({ page, request, baseURL }) => {
  for (const path of ["/", "/services/payment-methods", "/company/legal/merchant-services", "/resources/guides/iso-20022/purpose"]) {
    await expectCompleteGuidePaint(page, request, baseURL, path, "", "h1");
  }
});

test("responsive artwork keeps its initial layout while application scripts arrive", async ({ page }) => {
  const mobile = page.viewportSize()!.width < 851;
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto(mobile ? "/use-cases/software-platforms#industries" : "/services/card-services#wallets", { waitUntil: "commit" });
    await page.waitForFunction(() => [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet));
    const artwork = page.locator(mobile ? ".industry-cases" : ".wallet-guide-disclosure");
    if (mobile) await expect(artwork.locator("article > details[open]")).toHaveCount(0);
    else await expect(artwork).toHaveAttribute("open", "");
    const before = await artwork.evaluate(el => el.getBoundingClientRect().height);
    release(); await page.waitForLoadState("load");
    await expect.poll(() => artwork.evaluate(el => el.getBoundingClientRect().height)).toBe(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  } finally { release(); }
});

test("reference filters reserve their final layout before becoming interactive", async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto("/resources/guides/iso-20022/purpose", { waitUntil: "commit" });
    const input = page.getByRole("searchbox", { name: "Filter this code set" });
    await expect(input).toBeVisible(); await expect(input).toBeDisabled();
    const status = page.getByRole("status"); await expect(status).toHaveText("All 366 codes");
    const table = page.locator("#registered-codes");
    const before = await table.evaluate(el => el.getBoundingClientRect().top + scrollY);
    release(); await page.waitForLoadState("load"); await expect(input).toBeEnabled();
    expect(await table.evaluate(el => el.getBoundingClientRect().top + scrollY)).toBe(before);
    await input.fill("SALA"); await expect(status).toHaveText("1 of 366 codes");
  } finally { release(); }
});

test("a responsive artwork choice made before hydration is preserved", async ({ page }) => {
  const mobile = page.viewportSize()!.width < 851;
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto(mobile ? "/use-cases/software-platforms#industries" : "/services/card-services#wallets", { waitUntil: "commit" });
    const details = page.locator(mobile ? "#freight-platforms > details" : ".wallet-guide-disclosure");
    if (mobile) await expect(details).not.toHaveAttribute("open");
    else await expect(details).toHaveAttribute("open", "");
    await details.locator(":scope > summary").click();
    release(); await page.waitForLoadState("load");
    if (mobile) await expect(details).toHaveAttribute("open", "");
    else await expect(details).not.toHaveAttribute("open");
    await details.locator(":scope > summary").click();
    if (mobile) await expect(details).not.toHaveAttribute("open");
    else await expect(details).toHaveAttribute("open", "");
  } finally { release(); }
});

test("payment logos keep their geometry before the image responses arrive", async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\.(png|svg|webp|jpe?g)(\?.*)?$/, async route => { await held; await route.continue(); });
  try {
    await page.goto("/services/payment-methods", { waitUntil: "commit" });
    await page.waitForFunction(() => document.querySelector("#public-page-ready") &&
      [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet) &&
      document.querySelector(".public-footer-navigation")?.getAttribute("data-compact") != null);
    const logos = page.locator('[data-service-workflow="methods"] .payment-choice-mark');
    await expect(logos).toHaveCount(6);
    const geometry = () => logos.evaluateAll(images => images.map(image => {
      const rect = image.getBoundingClientRect();
      return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height };
    }));
    const before = await geometry();
    release(); await page.waitForLoadState("load");
    expect(await logos.evaluateAll(marks => marks.every(mark => getComputedStyle(mark).content.startsWith('url("data:image/')))).toBe(true);
    expect(await geometry()).toEqual(before);
  } finally { release(); }
});


test("shared navigation does not download unselected pages during startup", async ({ page }) => {
  for (const path of ["/resources/shopify-gateway-integration", "/resources/woocommerce-gateway-integration", "/resources/merchant-account-setup"]) {
    const prefetched: string[] = [];
    const record = (request: import("@playwright/test").Request) => {
      if (request.headers()["next-router-prefetch"] === "1") prefetched.push(new URL(request.url()).pathname);
    };
    page.on("request", record);
    await page.goto(path);
    await expect(page.locator(".public-footer-navigation")).toHaveAttribute("data-compact", /true|false/);
    await page.waitForTimeout(750);
    expect(prefetched).toEqual([]);
    page.off("request", record);
  }
  if (page.viewportSize()!.width < 960) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.locator("header").getByRole("link", { name: "Contact sales", exact: true }).click();
  await expect(page).toHaveURL(/\/company\/contact$/);
  await expect(page.locator("h1")).toBeVisible();
});


test("menu navigation opens both guides and preserves the chosen step", async ({ page }) => {
  for (const guide of [
    { label: "Shopify integration", path: "/resources/shopify-gateway-integration", step: "review-agreement", first: "open-settings" },
    { label: "WooCommerce integration", path: "/resources/woocommerce-gateway-integration", step: "enter-credentials", first: "prepare-wordpress" },
  ]) {
    await page.goto("/");
    await expect(page.locator(".public-footer-navigation")).toHaveAttribute("data-compact", /true|false/);
    if (page.viewportSize()!.width < 960) await page.getByRole("button", { name: "Menu", exact: true }).click();
    const navigation = page.getByRole("navigation", { name: "Main navigation", exact: true });
    await navigation.locator("summary").filter({ hasText: "Resources" }).click();
    await navigation.getByRole("link", { name: guide.label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${guide.path}$`));
    await expect(page.locator("h1")).toBeInViewport();
    // Observe the settled position too, after route positioning and enhancement.
    await page.waitForTimeout(1000);
    await expect(page.locator("h1")).toBeInViewport();
    expect(await page.evaluate(() => scrollY)).toBeLessThan(160);
    await page.locator(`#${guide.step} > summary`).click();
    await expect(page).toHaveURL(new RegExp(`#${guide.step}$`));
    await expect(page.locator(`#${guide.step} > summary`)).toBeInViewport();
    await page.getByRole("navigation", { name: "Setup overview" }).getByRole("link").first().click();
    await expect(page.locator(`#${guide.first}`)).toHaveAttribute("open", "");
    await expect(page.locator(`#${guide.first} > summary`)).toBeInViewport();
    await page.goBack();
    await expect(page.locator(`#${guide.step} > summary`)).toBeInViewport();
    await page.reload();
    await expect(page.locator(`#${guide.step} > summary`)).toBeInViewport();
  }
});


test("guide reading position survives delayed application scripts", async ({ page }) => {
  let releaseScripts = () => {};
  let scriptsReady = Promise.resolve();
  await page.route("**/*", async route => {
    if (route.request().resourceType() === "script") await scriptsReady;
    await route.continue();
  });
  for (const guide of [
    { path: "/resources/shopify-gateway-integration", step: "review-agreement" },
    { path: "/resources/woocommerce-gateway-integration", step: "enter-credentials" },
  ]) {
    scriptsReady = new Promise<void>(resolve => { releaseScripts = resolve; });
    try {
      await page.goto(guide.path, { waitUntil: "commit" });
      await expect(page.locator("h1")).toBeVisible();
      await page.locator(`#${guide.step} > summary`).click();
      await expect(page).toHaveURL(new RegExp(`#${guide.step}$`));
      await page.locator(`#${guide.step} figure`).first().scrollIntoViewIfNeeded();
      const readingPosition = await page.evaluate(() => scrollY);
      releaseScripts();
      await page.waitForLoadState("load");
      await expect(page.locator(".public-footer-navigation")).toHaveAttribute("data-compact", /true|false/);
      expect(Math.abs(await page.evaluate(() => scrollY) - readingPosition)).toBeLessThanOrEqual(2);
      await expect(page.locator(`#${guide.step}`)).toHaveAttribute("open", "");
    } finally { releaseScripts(); }
  }
});


test("guide reload completion preserves a visitor's reading position", async ({ page, browserName, isMobile }) => {
  let releaseImages = () => {};
  let imagesReady = Promise.resolve();
  await page.route("**/*", async route => {
    if (route.request().resourceType() === "image") await imagesReady;
    await route.continue();
  });
  for (const guide of [
    { path: "/resources/shopify-gateway-integration", step: "check-your-email" },
    { path: "/resources/woocommerce-gateway-integration", step: "enter-credentials" },
  ]) {
    await page.goto(`${guide.path}#${guide.step}`);
    imagesReady = new Promise<void>(resolve => { releaseImages = resolve; });
    try {
      await page.reload({ waitUntil: "commit" });
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator(`#${guide.step} > summary`)).toBeInViewport();
      const initialPosition = await page.evaluate(() => scrollY);
      // Mobile WebKit does not expose wheel input; use native page scrolling.
      if (browserName === "webkit" && isMobile) await page.keyboard.press("PageDown");
      else await page.mouse.wheel(0, 350);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialPosition + 100);
      // Finish the scroll before allowing the outstanding images to complete.
      await page.waitForTimeout(700);
      const readingPosition = await page.evaluate(() => scrollY);
      releaseImages();
      await page.waitForLoadState("load");
      await page.waitForTimeout(300);
      expect(Math.abs(await page.evaluate(() => scrollY) - readingPosition)).toBeLessThanOrEqual(2);
    } finally { releaseImages(); }
  }
});


test("late guide images do not reopen a step the visitor closed", async ({ page }) => {
  let releaseImages = () => {};
  let imagesReady = Promise.resolve();
  await page.route("**/*", async route => {
    if (route.request().resourceType() === "image") await imagesReady;
    await route.continue();
  });
  for (const guide of [
    { path: "/resources/shopify-gateway-integration", step: "check-your-email" },
    { path: "/resources/woocommerce-gateway-integration", step: "enter-credentials" },
  ]) {
    await page.goto(`${guide.path}#${guide.step}`);
    imagesReady = new Promise<void>(resolve => { releaseImages = resolve; });
    try {
      await page.reload({ waitUntil: "commit" });
      const step = page.locator(`#${guide.step}`);
      await expect(step).toHaveAttribute("open", "");
      await step.locator(":scope > summary").click();
      await expect(step).not.toHaveAttribute("open");
      // The late resource finishes outside the recent-input CLS exclusion window.
      await page.waitForTimeout(700);
      releaseImages();
      await page.waitForLoadState("load");
      await page.waitForTimeout(300);
      await expect(step).not.toHaveAttribute("open");
    } finally { releaseImages(); }
  }
});


test("responsive guide images keep their exact frame while image data arrives", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let releaseImages = () => {};
  let imagesReady = Promise.resolve();
  await page.route("**/*", async route => {
    if (route.request().resourceType() === "image") await imagesReady;
    await route.continue();
  });
  for (const guide of [
    { path: "/resources/shopify-gateway-integration#review-agreement", image: "#review-agreement figure > a img" },
    { path: "/resources/woocommerce-gateway-integration#prepare-wordpress", image: "#prepare-wordpress figure > a img" },
  ]) {
    imagesReady = new Promise<void>(resolve => { releaseImages = resolve; });
    try {
      await page.goto(guide.path, { waitUntil: "domcontentloaded" });
      const image = page.locator(guide.image).first();
      await expect(image).toBeVisible();
      const geometry = () => image.evaluate(element => {
        const { width, height } = element.getBoundingClientRect();
        return { width, height };
      });
      const before = await geometry();
      releaseImages();
      await page.waitForLoadState("load");
      await expect.poll(() => image.evaluate(element => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
      expect(await geometry()).toEqual(before);
    } finally { releaseImages(); }
  }
});

test("first visits keep render-blocking CSS within page-family budgets", async ({ page, request }) => {
  // Include the embedded logos. Budgets allow small additions but catch unrelated
  // page families being pulled into the shared Shell again.
  for (const [path, budget] of [
    // Home now carries the exact 13,185-byte symbol in cached CSS (17,580 base64
    // bytes) instead of a separate image response. Retain the former code allowance.
    ["/", 74_000],
    ["/resources/shopify-gateway-integration", 108_000],
    ["/resources/woocommerce-gateway-integration", 108_000],
    ["/resources/merchant-account-setup", 125_000],
    ["/developers/getting-started", 85_000],
    ["/developers/api-reference", 85_000],
    ["/resources/help", 55_000],
    ["/resources/guides/iso-20022/purpose", 65_000],
  ] as const) {
    await page.goto(path);
    const stylesheets = await page.locator('link[rel="stylesheet"]').evaluateAll(links =>
      [...new Set(links.map(link => (link as HTMLLinkElement).href))]);
    expect(stylesheets.length, path).toBeGreaterThan(0);
    let bytes = 0;
    for (const href of stylesheets) {
      const response = await request.get(href);
      expect(response.ok(), href).toBe(true);
      bytes += (await response.body()).length;
    }
    expect(bytes, `${path} decoded CSS bytes`).toBeLessThan(budget);
  }
});


test("opening artwork symbols paint without a separate image response or hydration", async ({ page }) => {
  for (const path of ["/", "/use-cases/software-platforms", "/use-cases/switch-merchant-services"]) {
    let release = () => {};
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route(/(?:\/symbol\.[^/]+\.png|\.js)(\?.*)?$/, async route => { await held; await route.continue(); });
    try {
      await page.goto(path, { waitUntil: "commit" });
      await page.waitForFunction(() => document.querySelector("#public-page-ready") &&
        [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet));
      const marks = page.locator('[data-company-art] img[src*="/symbol."], [data-attention-art] img[src*="/symbol."], [data-company-art] .brand-image-symbol, [data-attention-art] .brand-image-symbol');
      await expect(marks).toHaveCount(1);
      expect(await marks.evaluateAll(nodes => nodes.every(node => getComputedStyle(node).content.startsWith('url("data:image/png;base64,')))).toBe(true);
      const geometry = () => marks.evaluateAll(nodes => nodes.map(node => {
        const box = node.getBoundingClientRect();
        return { width: box.width, height: box.height };
      }));
      const before = await geometry();
      release(); await page.waitForLoadState("load");
      expect(await geometry()).toEqual(before);
    } finally {
      release(); await page.unrouteAll({ behavior: "wait" });
    }
  }
});
