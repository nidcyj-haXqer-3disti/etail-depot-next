import { expect, test } from "@playwright/test";
import { expectCompleteGuidePaint } from "./guide-rendering";

test("page families do not paint an incomplete header during document delivery", async ({ page, request, baseURL }) => {
  for (const path of ["/", "/payment-methods", "/legal/merchant-services", "/guides/iso-20022/purpose"]) {
    await expectCompleteGuidePaint(page, request, baseURL, path, "", "h1");
  }
});

test("responsive artwork keeps its initial layout while application scripts arrive", async ({ page }) => {
  const mobile = page.viewportSize()!.width < 851;
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/*.js", async route => { await held; await route.continue(); });
  try {
    await page.goto(mobile ? "/software-partners#industries" : "/credit-card-services#wallets", { waitUntil: "commit" });
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
    await page.goto("/guides/iso-20022/purpose", { waitUntil: "commit" });
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
    await page.goto(mobile ? "/software-partners#industries" : "/credit-card-services#wallets", { waitUntil: "commit" });
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
    await page.goto("/payment-methods", { waitUntil: "commit" });
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
  for (const path of ["/resources/shopify-gateway-integration", "/docs/merchant-onboarding"]) {
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
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator("h1")).toBeVisible();
});
