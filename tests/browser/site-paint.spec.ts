import { exerciseSalesAction } from "./sales-contact";
import { expect, test } from "@playwright/test";
import { expectCompleteGuidePaint } from "./guide-rendering";

test("page families do not paint an incomplete header during document delivery", async ({ page, request, baseURL }) => {
  for (const path of ["/", "/services/payment-methods", "/company/legal/merchant-services", "/resources/guides/iso-20022/purpose"]) {
    await expectCompleteGuidePaint(page, request, baseURL, path, "", "h1");
  }
});

test("payout amounts and bank credit paint together before application scripts", async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto("/services/payouts", { waitUntil: "commit" });
    await page.waitForFunction(() => document.querySelector("#public-page-ready") &&
      [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet));
    await page.evaluate(() => document.fonts.ready);
    const artwork = page.locator('[data-service-workflow="payouts"]');
    await expect(artwork.getByText("$418.57", { exact: true })).toBeVisible();
    await expect(artwork.getByText("+$418.57", { exact: true })).toBeVisible();
    await expect(artwork.getByText("Reference P1048", { exact: true })).toHaveCount(2);
    await expect(artwork.locator("img, input, button, form")).toHaveCount(0);
    const geometry = () => artwork.evaluate(el => {
      const box = el.getBoundingClientRect();
      return { width: box.width, height: box.height };
    });
    const before = await geometry();
    release(); await page.waitForLoadState("load");
    expect(await geometry()).toEqual(before);
    await page.reload();
    expect(await geometry()).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  } finally { release(); }
});

test("refund amount and pending status paint together before application scripts", async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto("/services/refunds", { waitUntil: "commit" });
    await page.waitForFunction(() => document.querySelector("#public-page-ready") &&
      [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet));
    await page.evaluate(() => document.fonts.ready);
    const artwork = page.locator('[data-service-workflow="refunds"]');
    await expect(artwork.getByText("$150.00", { exact: true })).toBeVisible();
    await expect(artwork.getByText("Pending", { exact: true })).toBeVisible();
    await expect(artwork.getByText("RF1048", { exact: true })).toBeVisible();
    await expect(artwork.getByText("Sale balance if completed", { exact: true })).toBeVisible();
    await expect(artwork.locator("img, input, button, form")).toHaveCount(0);
    const geometry = () => artwork.evaluate(el => {
      const box = el.getBoundingClientRect();
      return { width: box.width, height: box.height };
    });
    const before = await geometry();
    release(); await page.waitForLoadState("load");
    expect(await geometry()).toEqual(before);
    await page.reload();
    expect(await geometry()).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await exerciseSalesAction(page, page.getByRole("link", { name: "Talk with our team", exact: true }), "/company/contact#payment-review");
  } finally { release(); }
});

test("dispute deadline and response state paint together before application scripts", async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto("/services/disputes", { waitUntil: "commit" });
    await page.waitForFunction(() => document.querySelector("#public-page-ready") &&
      [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet));
    await page.evaluate(() => document.fonts.ready);
    const artwork = page.locator('[data-service-workflow="disputes"]');
    await expect(artwork.getByText("$240.00", { exact: true })).toBeVisible();
    await expect(artwork.getByText("18 Nov 2026", { exact: true })).toBeVisible();
    await expect(artwork.getByText("Response needed", { exact: true })).toBeVisible();
    await expect(artwork.getByText("Not submitted", { exact: true })).toBeVisible();
    await expect(artwork.locator("img, input, button, form")).toHaveCount(0);
    const geometry = () => artwork.evaluate(el => {
      const box = el.getBoundingClientRect();
      return { width: box.width, height: box.height };
    });
    const before = await geometry();
    release(); await page.waitForLoadState("load");
    expect(await geometry()).toEqual(before);
    await page.reload();
    expect(await geometry()).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await exerciseSalesAction(page, page.getByRole("link", { name: "Talk with our team", exact: true }), "/company/contact#payment-review");
  } finally { release(); }
});

test("merchant and gateway reports paint together before application scripts", async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto("/services/reconciliation", { waitUntil: "commit" });
    await page.waitForFunction(() => document.querySelector("#public-page-ready") &&
      [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet));
    await page.evaluate(() => document.fonts.ready);
    const artwork = page.locator('[data-service-workflow="reconciliation"]');
    await expect(artwork.getByText("Merchant account", { exact: true })).toBeVisible();
    await expect(artwork.getByText("Gateway account", { exact: true })).toBeVisible();
    await expect(artwork.getByText("$2,640.00", { exact: true })).toHaveCount(2);
    await expect(artwork.getByText("$1,860.00", { exact: true })).toHaveCount(2);
    await expect(artwork.getByText("$780.00", { exact: true })).toHaveCount(2);
    await expect(artwork.getByText("Total sales", { exact: true })).toHaveCount(2);
    await expect(page.locator('[data-service-page="reconciliation"]')).not.toContainText(/bank|deposit|backoffice|automatic/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /merchant account and payment gateway reports/i);
    await expect(artwork.getByText("$0.00", { exact: true })).toBeVisible();
    await expect(artwork.locator("img, input, button, form")).toHaveCount(0);
    const geometry = () => artwork.evaluate(el => {
      const box = el.getBoundingClientRect();
      return { width: box.width, height: box.height };
    });
    const before = await geometry();
    release(); await page.waitForLoadState("load");
    expect(await geometry()).toEqual(before);
    await page.reload();
    expect(await geometry()).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await exerciseSalesAction(page, page.getByRole("link", { name: "Talk with our team", exact: true }), "/company/contact#payment-review");
  } finally { release(); }
});

test("platform accounts and checkout-to-bank records keep their layout before scripts and on a saved-section refresh", async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto("/use-cases/software-platforms#payment-experience", { waitUntil: "commit" });
    await page.waitForFunction(() => document.querySelector("#public-page-ready") &&
      [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet));
    await page.evaluate(() => document.fonts.ready);
    const accounts = page.locator("[data-platform-accounts]");
    const journey = page.locator("[data-platform-journey]");
    await expect(accounts.getByText("Cotton Retail LLC", { exact: true })).toBeVisible();
    await expect(accounts.getByText("824630170002", { exact: true })).toBeVisible();
    await expect(accounts.locator("[data-business-entry]")).toHaveCount(6);
    await expect(accounts.locator("[data-business-industry]")).toHaveText([
      "Retail", "Transport", "Travel services", "Legal services", "Retail", "Transport",
    ]);
    await expect(accounts.locator("[data-example-merchant-account]:visible")).toHaveCount(2);
    await expect(accounts.locator("[data-example-merchant-account]").filter({ hasText: "Cotton Supply" })).toContainText("824630170001");
    await expect(accounts.locator("[data-example-merchant-account]").filter({ hasText: "Cotton Bedding" })).toContainText("824630170002");
    await expect(journey.locator("[data-journey-checkout]").getByText("$150.00", { exact: true })).toBeVisible();
    await expect(journey.locator("[data-journey-records]").getByText("$418.57", { exact: true })).toBeVisible();
    await expect(journey.locator("[data-journey-bank]").getByText("+$418.57", { exact: true })).toBeVisible();
    await expect(journey.getByText("Posted", { exact: true })).toBeVisible();
    await expect(journey.locator("button, input, form")).toHaveCount(0);
    const geometry = () => page.locator("[data-platform-accounts], [data-platform-journey]").evaluateAll(nodes => nodes.map(el => {
      const box = el.getBoundingClientRect();
      return { width: box.width, height: box.height };
    }));
    const before = await geometry();
    release(); await page.waitForLoadState("load");
    expect(await geometry()).toEqual(before);
    await page.reload();
    expect(await geometry()).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await exerciseSalesAction(page, page.getByRole("link", { name: "Discuss your integration", exact: true }), "/company/contact#platforms");
  } finally { release(); }
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
    if (mobile) {
      await expect(artwork.locator("[data-platform-scene]")).toHaveCount(4);
      await expect(artwork.locator(".platform-case-details[open]")).toHaveCount(0);
    }
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
    const details = page.locator(mobile ? "#freight-platforms .platform-case-details" : ".wallet-guide-disclosure");
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
  await exerciseSalesAction(page, page.locator("header").getByRole("link", { name: "Contact sales", exact: true }), "/company/contact#payment-review");
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
    { path: "/resources/merchant-account-setup", step: "bank-details" },
    { path: "/resources/shopify-gateway-integration", step: "check-your-email" },
    { path: "/resources/woocommerce-gateway-integration", step: "enter-credentials" },
  ]) {
    await page.goto(`${guide.path}#${guide.step}`);
    imagesReady = new Promise<void>(resolve => { releaseImages = resolve; });
    try {
      await page.reload({ waitUntil: "commit" });
      await page.waitForLoadState("domcontentloaded");
      await expect(page.locator(`#${guide.step} > summary, #${guide.step} h3`).first()).toBeInViewport();
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
    // Lossless embedded marks retain initial paint without the previous PNG cost.
    ["/", 58_000],
    ["/resources/shopify-gateway-integration", 82_000],
    ["/resources/woocommerce-gateway-integration", 77_000],
    ["/resources/merchant-account-setup", 99_000],
    ["/developers/getting-started", 69_000],
    ["/developers/api-reference", 69_000],
    ["/resources/help", 46_000],
    ["/resources/guides/iso-20022/purpose", 56_000],
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
      expect(await marks.evaluateAll(nodes => nodes.every(node => getComputedStyle(node).content.startsWith('url("data:image/webp;base64,')))).toBe(true);
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


test("all business examples are selectable without scripts and keep a stable account window", async ({ browser, baseURL }, testInfo) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: testInfo.project.name === "mobile" ? 320 : 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto("/use-cases/software-platforms");
    const art = page.locator("[data-platform-accounts]");
    const height = await art.evaluate(e => e.getBoundingClientRect().height);
    const ids: string[] = [];
    for (const radio of await art.getByRole("radio").all()) {
      await radio.check();
      const panel = art.locator("[data-business-panel]:visible");
      await expect(panel).toHaveCount(1);
      const records = panel.locator("[data-example-merchant-account]");
      expect(await records.count()).toBeGreaterThanOrEqual(2);
      ids.push(...await records.locator("dl:last-child dd").allTextContents());
      expect(await art.evaluate(e => e.getBoundingClientRect().height)).toBe(height);
    }
    expect(ids).toHaveLength(14);
    expect(new Set(ids).size).toBe(14);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
});

test("account motion loops, resumes after selection and respects keyboard reading and reduced motion", async ({ page }) => {
  await page.clock.install();
  await page.goto("/use-cases/software-platforms");
  const root = page.locator("[data-account-motion]");
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-ready", "true");
  await expect(root).toHaveAttribute("data-motion-visible", "true");
  const art = page.locator("[data-platform-accounts]");
  const height = await art.evaluate(e => e.getBoundingClientRect().height);
  for (const kind of ["freight", "travel", "legal", "market", "logistics", "cotton"]) {
    await page.clock.fastForward(6100);
    await expect(root.locator(`input[value="${kind}"]`)).toBeChecked();
    await expect(root.locator(`[data-business-panel="${kind}"]`)).toBeVisible();
    expect(await art.evaluate(e => e.getBoundingClientRect().height)).toBe(height);
  }
  await page.locator("#industries h2").scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-visible", "false");
  await page.clock.fastForward(20000);
  await expect(root.locator('input[value="cotton"]')).toBeChecked();
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-visible", "true");
  await art.getByRole("radio", { name: "Atlas Travel, 2 merchant accounts", exact: true }).check();
  await page.clock.fastForward(11000);
  await expect(root.locator('input[value="travel"]')).toBeChecked();
  await page.clock.fastForward(1200);
  await expect(root.locator('input[value="legal"]')).toBeChecked();
  await art.getByRole("radio", { name: "Harrison Law, 2 merchant accounts", exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(root.locator('input[value="market"]')).toBeChecked();
  await page.clock.fastForward(20000);
  await expect(root.locator('input[value="market"]')).toBeChecked();
  await page.locator("h1").click();
  // On narrow screens the heading can scroll the artwork out of view.
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-visible", "true");
  await page.clock.fastForward(6100);
  await expect(root.locator('input[value="logistics"]')).toBeChecked();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-ready", "true");
  await page.clock.fastForward(20000);
  await expect(root.locator('input[value="cotton"]')).toBeChecked();
  await art.getByRole("radio", { name: "Harrison Law, 2 merchant accounts", exact: true }).check();
  await expect(root.locator('[data-business-panel="legal"]')).toBeVisible();
});


test("industry artwork loops while visible and pauses offscreen without moving its records", async ({ page }) => {
  await page.goto("/use-cases/software-platforms#industries");
  const scene = page.locator('[data-platform-scene="freight"]');
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-motion", "on");
  const motion = () => scene.evaluate(element => element.getAnimations({ subtree: true }).map(animation => ({
    iterations: animation.effect!.getTiming().iterations,
    state: animation.playState,
  })));
  await expect.poll(async () => (await motion()).filter(animation => animation.state === "running").length).toBeGreaterThan(0);
  expect((await motion()).every(animation => animation.iterations === Infinity)).toBe(true);
  const before = await scene.boundingBox();
  await page.locator("h1").scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-motion", "off");
  expect((await motion()).every(animation => animation.state === "paused")).toBe(true);
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute("data-motion", "on");
  const after = await scene.boundingBox();
  expect(after!.width).toBe(before!.width);
  expect(after!.height).toBe(before!.height);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(async () => (await motion()).length).toBe(0);
  await expect(scene).toContainText("$1,250.00");
});


test("homepage connection motion preserves first paint and loops only while visible", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: testInfo.project.name.includes("mobile") ? 320 : 1440, height: 900 });
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto("/", { waitUntil: "commit" });
    await page.waitForFunction(() => document.querySelector("#public-page-ready") &&
      [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet));
    // WebKit waits for document readiness here, so load the actual fonts while scripts are deliberately held.
    await page.evaluate(async () => {
      const family = getComputedStyle(document.querySelector("[data-company-art]")!).fontFamily;
      await Promise.all([document.fonts.load(`400 16px ${family}`), document.fonts.load(`500 20px ${family}`)]);
    });
    const art = page.locator("[data-company-art]");
    await expect(art).toBeVisible();
    await expect(art.locator("[data-company-connection]")).toHaveCount(3);
    await expect(art.locator("[data-home-service-panel]")).toHaveCount(3);
    const geometry = () => art.evaluate(element => [element, ...element.querySelectorAll("[data-home-service-panel]")].map(node => {
      const box = node.getBoundingClientRect(); return { width: box.width, height: box.height };
    }));
    const before = await geometry();
    release(); await page.waitForLoadState("load");
    await art.scrollIntoViewIfNeeded();
    await expect(art).toHaveAttribute("data-motion", "on");
    expect(await geometry()).toEqual(before);
    const animations = () => art.evaluate(element => element.getAnimations({ subtree: true }).map(animation => ({
      iterations: animation.effect!.getTiming().iterations, state: animation.playState,
    })));
    await expect.poll(async () => (await animations()).filter(animation => animation.state === "running").length).toBeGreaterThan(0);
    expect((await animations()).every(animation => animation.iterations === Infinity)).toBe(true);
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(art).toHaveAttribute("data-motion", "off");
    expect((await animations()).every(animation => animation.state === "paused")).toBe(true);
    await art.scrollIntoViewIfNeeded();
    await expect(art).toHaveAttribute("data-motion", "on");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(async () => (await animations()).length).toBe(0);
    await page.reload();
    expect(await geometry()).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  } finally { release(); }
});

test("pricing keeps its fee breakdown and early disclosure stable through hydration", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: testInfo.project.name.includes("mobile") ? 320 : 1440, height: 900 });
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto("/pricing#fees", { waitUntil: "commit" });
    await page.waitForFunction(() => document.querySelector("#public-page-ready") &&
      [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet));
    await page.evaluate(async () => {
      const family = getComputedStyle(document.querySelector(".pricing-panel")!).fontFamily;
      await Promise.all([document.fonts.load(`400 16px ${family}`), document.fonts.load(`500 20px ${family}`)]);
    });
    const amount = page.getByLabel("Payment amount USD");
    await expect(amount).toBeDisabled();
    await expect(page.locator(".fee-net dd")).toHaveText("$96.80");
    await page.locator(".offer-details > summary").click();
    await expect(page.locator(".fee-exceptions")).toBeVisible();
    const geometry = () => page.locator(".pricing-panel, .pricing-rate, .fee-estimate, .offer-details").evaluateAll(elements => elements.map(element => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y + scrollY, width: box.width, height: box.height };
    }));
    const before = await geometry();
    release(); await page.waitForLoadState("load");
    await expect(amount).toBeEnabled();
    await expect(page.locator(".offer-details")).toHaveAttribute("open", "");
    expect(await geometry()).toEqual(before);
    for (const value of ["100000", "", "100"]) {
      await amount.fill(value);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
    await expect(page.locator(".fee-net dd")).toHaveText("$96.80");
    await page.reload();
    await expect(amount).toHaveValue("100");
    await expect(page.locator(".fee-net dd")).toHaveText("$96.80");
    expect(errors).toEqual([]);
  } finally { release(); }
});


for (const [path, kind] of [
  ["/services/payouts", "payouts"], ["/services/refunds", "refunds"],
  ["/services/reconciliation", "reconciliation"], ["/services/disputes", "disputes"],
  ["/services/ach-payments", "ach"],
] as const) {
  test(`${kind} artwork motion preserves first paint and respects visibility and reduced motion`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: testInfo.project.name.includes("mobile") ? 320 : 1440, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    let release = () => {};
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route("**/*.js", async route => { await held; await route.continue(); });
    try {
      await page.goto(path, { waitUntil: "commit" });
      await page.waitForFunction(() => document.querySelector("#public-page-ready") &&
        [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].every(link => link.sheet));
      await page.evaluate(async () => {
        const family = getComputedStyle(document.querySelector("[data-service-motion]")!).fontFamily;
        await Promise.all([document.fonts.load(`400 16px ${family}`), document.fonts.load(`500 20px ${family}`)]);
      });
      const art = page.locator(`[data-service-workflow="${kind}"]`);
      await expect(art).toBeVisible();
      await expect(art).toHaveAttribute("data-service-motion", "off");
      const text = await art.innerText();
      const geometry = () => art.evaluate(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height }));
      const animations = () => art.evaluate(el => el.getAnimations({ subtree: true }).map(animation => ({
        state: animation.playState, iterations: animation.effect!.getTiming().iterations,
      })));
      expect((await animations()).every(animation => animation.state === "paused")).toBe(true);
      const before = await geometry();
      release(); await page.waitForLoadState("load");
      await art.scrollIntoViewIfNeeded();
      await expect(art).toHaveAttribute("data-service-motion", "on");
      await expect.poll(async () => (await animations()).filter(animation => animation.state === "running").length).toBeGreaterThan(0);
      expect((await animations()).every(animation => animation.iterations === Infinity)).toBe(true);
      expect(await geometry()).toEqual(before);
      expect(await art.innerText()).toBe(text);
      // Seeking ahead proves the loops continue and cannot change example values or statuses.
      await art.evaluate(el => el.getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = 30000; }));
      expect((await animations()).every(animation => animation.state === "running")).toBe(true);
      expect(await art.innerText()).toBe(text);
      await page.locator("footer").scrollIntoViewIfNeeded();
      await expect(art).toHaveAttribute("data-service-motion", "off");
      expect((await animations()).every(animation => animation.state === "paused")).toBe(true);
      await art.scrollIntoViewIfNeeded();
      await expect(art).toHaveAttribute("data-service-motion", "on");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(art).toHaveAttribute("data-service-motion", "off");
      await expect.poll(async () => (await animations()).length).toBe(0);
      expect(await art.innerText()).toBe(text);
      await page.reload();
      expect(await geometry()).toEqual(before);
      expect(await art.innerText()).toBe(text);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}
