import { test, expect } from "@playwright/test";
import { COMMERCIAL_PATHS } from "../../src/shared/commercial-paths";

test("commercial pages have distinct decisions, exact canonicals and direct primary actions", async ({ page, baseURL }) => {
  const titles = new Set<string>();
  for (const path of COMMERCIAL_PATHS) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    const title = await page.title();
    expect(titles.has(title)).toBe(false);
    titles.add(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${path}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("main form")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/Cybersource|Infinicept|prototype|illustrative|TODO/i);
    await expect(page.getByRole("navigation", { name: "Related information", exact: true })).toHaveCount(0);
    const action = path === "/contact" ? page.locator("#integration a") : page.locator(".commercial-action a").first();
    await expect(action).toBeVisible();
    const href = await action.getAttribute("href");
    expect(href).toBeTruthy();
    if (href!.startsWith("/")) {
      await action.click();
      await expect(page).toHaveURL(new URL(href!, baseURL).href);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    }
  }
});

test("merchant application and contact routes never forward visitor input", async ({ page }) => {
  for (const path of ["/merchant-onboarding", "/contact"]) {
    await page.goto(`${path}?merchant=private&next=https://other.invalid`);
    const application = page.locator('main a[href="https://trolleys.ai"]');
    await expect(application).toHaveCount(1);
    await expect(application).toHaveAttribute("rel", /noreferrer/);
    await expect(application).toHaveAttribute("referrerpolicy", "no-referrer");
    const targets = await page.locator("main a").evaluateAll(links => links.map(link => link.getAttribute("href")));
    expect(targets.some(target => target?.includes("private") || target?.includes("other.invalid"))).toBe(false);
  }
  await expect(page.locator("#cards")).toContainText("An inquiry is not an application.");
  await expect(page.locator("#platforms a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com?subject=Software%20payment%20partnership");
  await expect(page.locator("#integration a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com?subject=Integration%20documentation");
  for (const contact of ["payment-review", "platforms", "integration", "account-support", "cards", "compliance"]) {
    const option = page.locator(`#${contact}`);
    const email = (await option.locator("a").getAttribute("href"))!.slice("mailto:".length).split("?")[0];
    await expect(option.locator(".commercial-contact-email")).toHaveText(email);
    await expect(option.locator(".commercial-contact-email")).toBeVisible();
  }
});

test("merchants can discuss processing costs before applying while platforms reach commercial terms", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByRole("link", { name: "Discuss your processing costs", exact: true }).click();
  await expect(page).toHaveURL(/\/contact#payment-review$/);
  await expect(page.locator("#payment-review")).toBeInViewport();
  await expect(page.locator("#payment-review a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com?subject=Payment%20options%20review");
  await expect(page.locator('main a[href="https://trolleys.ai"]')).toHaveAttribute("referrerpolicy", "no-referrer");
  await page.goBack();
  await page.getByRole("link", { name: "Discuss platform terms", exact: true }).click();
  await expect(page).toHaveURL(/\/contact#platforms$/);
  await expect(page.locator("#platforms")).toBeInViewport();
  await expect(page.locator("#platforms a")).toHaveAttribute("href", /subject=Software%20payment%20partnership$/);
});

test("shared contact action routes developers and merchants to the appropriate contact choices", async ({ page, isMobile }) => {
  for (const path of ["/docs/checkout", "/payment-acceptance-service"]) {
    await page.goto(path);
    if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.locator(".public-header").getByRole("link", { name: "Contact sales", exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Let’s talk about your business.");
    await expect(page.getByRole("link", { name: "Contact the integration team", exact: true })).toHaveAttribute("href", /subject=Integration%20documentation$/);
    await expect(page.getByRole("link", { name: "Contact merchant support", exact: true })).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
    if (isMobile) await expect(page.getByRole("button", { name: "Menu", exact: true })).toHaveAttribute("aria-expanded", "false");
  }
});

test("buyers can find ACH, provider change and platform model decisions through the existing site", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await nav.locator("summary").filter({ hasText: /^Services$/ }).click();
  await nav.getByRole("link", { name: "ACH payments", exact: true }).click();
  await expect(page).toHaveURL(/\/ach-payments$/);
  await expect(page.locator("main")).toContainText("A submitted ACH payment can still be returned");
  await page.locator(".commercial-action").getByRole("link", { name: "Explore merchant services", exact: true }).click();
  await expect(page).toHaveURL(/\/payment-acceptance-service$/);
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await nav.locator("summary").filter({ hasText: /^Services$/ }).click();
  await nav.getByRole("link", { name: "Switch merchant services", exact: true }).click();
  await expect(page).toHaveURL(/\/switch-payment-providers$/);
  await expect(page.locator("main")).toContainText("New accounts require review and approval");
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await nav.locator("summary").filter({ hasText: /^Services$/ }).click();
  await nav.getByRole("link", { name: "Merchant onboarding", exact: true }).click();
  await expect(page).toHaveURL(/\/merchant-onboarding$/);
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await nav.locator("summary").filter({ hasText: /^Platforms$/ }).click();
  await nav.getByRole("link", { name: "Software platforms", exact: true }).click();
  await page.getByRole("link", { name: "Account structure", exact: true }).click();
  await expect(page).toHaveURL(/\/platform-payment-models$/);
  await expect(page.locator("main")).toContainText("holding funds need a separately approved structure");
  await page.getByRole("link", { name: "Discuss your platform", exact: true }).click();
  await expect(page).toHaveURL(/\/contact#platforms$/);
  await expect(page.locator("#platforms")).toBeInViewport();
});

// Visible hierarchy and structured breadcrumbs must name the same real parent routes.
test("commercial details retain their service context and exact breadcrumb hierarchy", async ({ page }) => {
  const merchant = ["/merchant-onboarding", "/payment-methods", "/ach-payments", "/payouts-and-reconciliation", "/refunds-and-disputes", "/pricing", "/online-businesses", "/switch-payment-providers"];
  const platform = ["/platform-payment-models", "/payment-partnerships"];
  for (const path of [...merchant, ...platform, "/credit-card-services"]) {
    await page.goto(path);
    const crumbs = page.getByRole("navigation", { name: "Breadcrumb", exact: true });
    await expect(crumbs).toBeVisible();
    const visible = await crumbs.locator("a").evaluateAll(links => links.map(link => link.getAttribute("href")));
    const parent = merchant.includes(path) ? "/payment-acceptance-service" : "/software-partners";
    expect(visible).toEqual(path === "/credit-card-services" ? ["/"] : ["/", parent]);
    await expect(crumbs.locator('[aria-current="page"]')).toHaveCount(1);
    const structured = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.flatMap(script => {
      const data = JSON.parse(script.textContent || "{}"); return data["@graph"] || [data];
    }).filter(item => item["@type"] === "BreadcrumbList").map(item => item.itemListElement.map((entry: { item: string }) => new URL(entry.item).pathname)));
    expect(structured).toEqual([[...visible, path]]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    await expect(page.locator('.cw-workflow-surface a,.cw-workflow-surface button,.cw-workflow-surface input')).toHaveCount(0);
  }
});

// Inquiries stay separate from account applications and do not forward visitor input.
test("a merchant can request a review without submitting an application", async ({ page }) => {
  await page.goto("/?merchant=private&reason=private");
  await page.goto("/switch-payment-providers?merchant=private&reason=private");
  await expect(page).toHaveURL(/\/switch-payment-providers(?:\?merchant=private&reason=private)?$/);
  await expect(page.locator("main")).toContainText("New accounts require review and approval");
  await expect(page.locator("main")).toContainText("A new account does not release funds held by another provider.");
  await page.locator(".commercial-action").getByRole("link", { name: "Discuss your business", exact: true }).click();
  await expect(page).toHaveURL(/\/contact#payment-review$/);
  await expect(page.locator("#payment-review")).toBeInViewport();
  await expect(page.locator("#payment-review a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com?subject=Payment%20options%20review");
  await expect(page.locator("#payment-review")).toContainText("An inquiry is not an application or approval");
  await expect(page.locator("main form, main input, main textarea")).toHaveCount(0);
  await expect(page.locator('main a[href="https://trolleys.ai"]')).toHaveAttribute("referrerpolicy", "no-referrer");
});

test("sales email copying confirms success and preserves a fallback when copying is denied", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: async (text: string) => {
        if (document.documentElement.dataset.denyCopy === "true") throw new DOMException("Denied", "NotAllowedError");
        document.documentElement.dataset.copiedEmail = text;
      },
    } });
  });
  await page.goto("/contact?merchant=private");
  const business = page.locator("#payment-review");
  await business.getByRole("button", { name: "Copy email address for business owners", exact: true }).click();
  await expect(business.getByRole("status")).toHaveText("Email address copied.");
  expect(await page.locator("html").getAttribute("data-copied-email")).toBe("trolleys@etaildepot.com");
  await page.evaluate(() => { document.documentElement.dataset.denyCopy = "true"; });
  const platform = page.locator("#platforms");
  await platform.getByRole("button", { name: "Copy email address for software platforms", exact: true }).click();
  await expect(platform.getByRole("status")).toHaveText("Select the email address to copy it.");
  await expect(platform.locator(".commercial-contact-email")).toHaveText("trolleys@etaildepot.com");
  await expect(platform.getByRole("link", { name: "Email about your platform" })).toHaveAttribute("href", "mailto:trolleys@etaildepot.com?subject=Software%20payment%20partnership");
  await expect(page.locator("main form, main input, main textarea")).toHaveCount(0);
});

test("sales contact remains usable without JavaScript or a clipboard API", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(new URL("/contact", baseURL).href);
    for (const id of ["platforms", "payment-review"]) {
      const card = page.locator(`#${id}`);
      await expect(card.locator(".commercial-contact-email")).toBeVisible();
      await expect(card.locator("a")).toHaveAttribute("href", /^mailto:trolleys@etaildepot\.com\?subject=/);
      await expect(card.getByRole("button")).toHaveCount(0);
    }
  } finally { await context.close(); }
});
