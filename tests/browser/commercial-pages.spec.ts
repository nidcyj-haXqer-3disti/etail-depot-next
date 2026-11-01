import { test, expect, type Page } from "@playwright/test";
import { openFooterGroup } from "./public-footer";
import { isServiceDetailPath } from "../../src/modules/public-site/service-detail-content";
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
    const action = path === "/contact" ? page.locator("#payment-review a") : path === "/company" ? page.getByRole("main").getByRole("link", { name: "contact our team", exact: true }) : page.locator(isServiceDetailPath(path) ? "[data-service-actions] a" : ".commercial-action a").first();
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
  await expect(page.locator("[data-merchant-contact] a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
  const addresses = await page.locator('main a[href^="mailto:"]').evaluateAll(links => links.map(link => link.getAttribute("href")));
  expect(addresses).toEqual(["mailto:trolleys@etaildepot.com", "mailto:ledgix@etaildepot.com", "mailto:compliance@etaildepot.com"]);
  for (const contact of ["payment-review", "cards", "compliance"]) {
    const link = page.locator(`#${contact} a`);
    await expect(link).toBeVisible();
    await expect(link).toHaveText((await link.getAttribute("href"))!.slice("mailto:".length));
  }
});

test("merchants can discuss processing costs before applying while platforms reach commercial terms", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByRole("link", { name: "Discuss your processing costs", exact: true }).click();
  await expect(page).toHaveURL(/\/contact#payment-review$/);
  await expect(page.locator("#payment-review")).toBeInViewport();
  await expect(page.locator("[data-merchant-contact]").getByRole("heading")).toHaveText("Merchant services");
  await expect(page.locator("#payment-review a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
  await expect(page.locator("[data-merchant-contact] a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
  await expect(page.locator('main a[href="https://trolleys.ai"]')).toHaveAttribute("referrerpolicy", "no-referrer");
  await page.goBack();
  await page.getByRole("link", { name: "Discuss platform terms", exact: true }).click();
  await expect(page).toHaveURL(/\/contact#platforms$/);
  await expect(page.locator("#platforms")).toBeInViewport();
  await expect(page.locator("[data-merchant-contact]").getByRole("heading")).toHaveText("Merchant services");
  await expect(page.locator("[data-merchant-contact] a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
});

test("shared contact action routes developers and merchants to the appropriate contact choices", async ({ page, isMobile }) => {
  for (const path of ["/docs/checkout", "/payment-acceptance-service"]) {
    await page.goto(path);
    if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.locator(".public-header").getByRole("link", { name: "Contact sales", exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Contact Etail Depot.");
    const merchant = page.getByRole("region", { name: "Merchant services", exact: true });
    await expect(merchant.getByRole("link", { name: "trolleys@etaildepot.com", exact: true })).toBeVisible();
    await expect(merchant).toContainText("software partnerships and integration documentation");
    await expect(merchant).toContainText("For account support");
    await expect(merchant.locator('a[href^="mailto:"]')).toHaveCount(1);
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
  await expect(page.locator("main")).toContainText("A submitted bank payment can still be pending or returned");
  await page.getByRole("banner").getByRole("link", { name: "Etail Depot home", exact: true }).click();
  await page.locator("main").getByRole("link", { name: "Explore merchant services", exact: true }).click();
  await expect(page).toHaveURL(/\/payment-acceptance-service$/);
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await nav.locator("summary").filter({ hasText: /^Use cases$/ }).click();
  await nav.getByRole("link", { name: "Switch merchant services", exact: true }).click();
  await expect(page).toHaveURL(/\/switch-payment-providers$/);
  await expect(page.locator("main")).toContainText("New accounts require review and approval");
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await nav.locator("summary").filter({ hasText: /^Services$/ }).click();
  await nav.getByRole("link", { name: "Merchant onboarding", exact: true }).click();
  await expect(page).toHaveURL(/\/merchant-onboarding$/);
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await nav.locator("summary").filter({ hasText: /^Use cases$/ }).click();
  await nav.getByRole("link", { name: "Software platforms", exact: true }).click();
  await page.getByRole("link", { name: "Account structure", exact: true }).click();
  await expect(page).toHaveURL(/\/platform-payment-models$/);
  await expect(page.locator("main")).toContainText("holding funds need a separately approved structure");
  await page.getByRole("link", { name: "Discuss your platform", exact: true }).click();
  await expect(page).toHaveURL(/\/contact#platforms$/);
  await expect(page.locator("#platforms")).toBeInViewport();
  await expect(page.locator("[data-merchant-contact]").getByRole("heading")).toHaveText("Merchant services");
  await expect(page.locator("[data-merchant-contact] a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
});

// Commercial pages open directly with their hero while preserving the published URL hierarchy.
test("commercial pages retain their URL hierarchy without duplicate navigation rows", async ({ page }) => {
  const merchant = ["/merchant-onboarding", "/payment-methods", "/ach-payments", "/payouts-and-reconciliation", "/refunds-and-disputes", "/pricing", "/reconciliation", "/disputes", "/online-businesses", "/switch-payment-providers"];
  const platform = ["/platform-payment-models", "/payment-partnerships"];
  for (const path of [...merchant, ...platform]) {
    await page.goto(path);
    await expect(page.getByRole("navigation", { name: "Breadcrumb", exact: true })).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "On this page", exact: true })).toHaveCount(0);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const parent = merchant.includes(path) ? "/payment-acceptance-service" : "/software-partners";
    const structured = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.flatMap(script => {
      const data = JSON.parse(script.textContent || "{}"); return data["@graph"] || [data];
    }).filter(item => item["@type"] === "BreadcrumbList").map(item => item.itemListElement.map((entry: { item: string }) => new URL(entry.item).pathname)));
    expect(structured).toEqual([["/", parent, path]]);
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
  await expect(page.locator("[data-merchant-contact]").getByRole("heading")).toHaveText("Merchant services");
  await expect(page.locator("#payment-review a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
  await expect(page.locator("[data-merchant-contact] a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
  await expect(page.locator("#merchant-application")).toContainText("Account approval and setup apply.");
  await expect(page.locator("main form, main input, main textarea")).toHaveCount(0);
  await expect(page.locator('main a[href="https://trolleys.ai"]')).toHaveAttribute("referrerpolicy", "no-referrer");
});

test("contact options remain usable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(new URL("/contact", baseURL).href);
    for (const id of ["payment-review", "cards", "compliance"]) {
      const contact = page.locator(`#${id}`);
      await expect(contact.locator("a")).toBeVisible();
      await expect(contact.locator("a")).toHaveAttribute("href", /^mailto:/);
      await expect(contact.getByRole("button")).toHaveCount(0);
    }
    for (const id of ["payment-review", "platforms", "integration", "account-support"]) {
      await page.goto(new URL(`/contact#${id}`, baseURL).href);
      await expect(page.locator("[data-merchant-contact] a")).toBeInViewport();
    }
  } finally { await context.close(); }
});


test("legacy service bookmarks remain useful after separating the service pages", async ({ page }, testInfo) => {
  for (const [path, section, heading, evidence] of [
    ["/payouts-and-reconciliation", "payouts", "Understand the amount you receive.", "Bank deposit"],
    ["/payouts-and-reconciliation", "reconciliation", "When a payout needs attention.", "A different amount"],
    ["/refunds-and-disputes", "refunds", "Choose the action that fits the payment.", "Authorization reversal"],
    ["/refunds-and-disputes", "disputes", "Avoid duplicate refunds.", "Payment already disputed"],
  ]) {
    await page.goto(`${path}#${section}`);
    await page.waitForLoadState("networkidle");
    const task = page.locator(`#${section}`);
    await expect(task.getByRole("heading", {level:2})).toHaveText(heading);
    await expect(task.getByRole("heading", {level:2})).toBeInViewport();
    await expect(task).toContainText(evidence);
    if (section === "reconciliation") await page.screenshot({ path: testInfo.outputPath(`reconciliation-${testInfo.project.name}.png`) });
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${path}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});


test("eight service pages have distinct artwork and usable primary journeys", async ({ page }) => {
  const targets = [["/merchant-onboarding", "onboarding"], ["/payment-methods", "methods"], ["/ach-payments", "ach"], ["/payouts-and-reconciliation", "payouts"], ["/reconciliation", "reconciliation"], ["/refunds-and-disputes", "refunds"], ["/disputes", "disputes"], ["/credit-card-services", "cards"]];
  for (const [path, kind] of targets) {
    await page.goto(path);
    const artwork = page.locator(`[data-service-workflow="${kind}"]`);
    await expect(artwork).toBeVisible();
    await expect(artwork.locator("figcaption")).toBeVisible();
    await expect(artwork.locator("input,button,a,form")).toHaveCount(0);
    await expect(page.locator("[data-service-actions] a").first()).toBeVisible();
    if (kind !== "cards") await expect(page.locator("#service-workflow-title")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  await page.goto("/payouts-and-reconciliation#reconciliation");
  await page.locator("#reconciliation").getByRole("link", {name:"A different amount"}).click();
  await expect(page).toHaveURL(/\/reconciliation$/);
  await expect(page.getByRole("heading", {level:1})).toBeInViewport();
  await page.goto("/refunds-and-disputes#disputes");
  await page.locator("#disputes").getByRole("link", {name:"Payment already disputed"}).click();
  await expect(page).toHaveURL(/\/disputes$/);
  await expect(page.getByRole("heading", {level:1})).toBeInViewport();
});


test("page typography stays consistent when visitors move between page families", async ({ page, context }) => {
  test.setTimeout(60_000);
  const stops = [
    { path: "/company", group: "Company" },
    { path: "/contact", group: "Company" },
    { path: "/payment-methods", group: "Services" },
    { path: "/credit-card-services", group: "Services" },
    { path: "/online-businesses", group: "Use cases" },
    { path: "/docs", group: "Developers" },
    { path: "/help", group: "Resources" },
    { path: "/software-partners", group: "Use cases" },
    { path: "/switch-payment-providers", group: "Use cases" },
    { path: "/company", group: "Company" },
  ];
  async function readingStyles(target: Page) {
    await target.waitForLoadState("networkidle");
    await target.evaluate(() => document.fonts.ready);
    return target.locator("main h1, main h2, main p, main figure").evaluateAll(nodes => nodes
      .filter(node => node.getBoundingClientRect().width && node.getBoundingClientRect().height)
      .map(node => {
        const style = getComputedStyle(node);
        return { text: node.textContent?.trim().slice(0, 80), font: style.fontSize, line: style.lineHeight, spacing: style.letterSpacing, padding: style.padding, margin: style.margin, color: style.color, background: style.backgroundColor };
      }));
  }
  await page.goto("/");
  for (const stop of stops) {
    const fresh = await context.newPage();
    await fresh.goto(stop.path);
    const expected = await readingStyles(fresh);
    await fresh.close();
    const group = await openFooterGroup(page, stop.group);
    await group.locator(`a[href="${stop.path}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${stop.path}$`));
    expect.soft(await readingStyles(page), `Styles after navigating to ${stop.path}`).toEqual(expected);
  }
});


test("existing merchants can reach missing payout support without entering sales or applying", async ({ page }) => {
  await page.goto("/help");
  await page.locator("summary").filter({ hasText: "When will the money reach my bank?" }).click();
  await page.getByRole("link", { name: "payout information", exact: true }).click();
  await expect(page).toHaveURL(/\/payouts-and-reconciliation$/);
  await page.getByRole("link", { name: "Not yet received", exact: true }).click();
  await expect(page).toHaveURL(/\/contact#account-support$/);
  await expect(page.locator("#account-support")).toBeInViewport();
  await expect(page.locator("[data-merchant-contact]")).toContainText("transaction or payout reference");
  await expect(page.locator("[data-merchant-contact] a")).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
  await page.goBack();
  await expect(page).toHaveURL(/\/payouts-and-reconciliation$/);
  await expect(page.locator("main")).toContainText("A missing payout is not a reason to charge the customer again.");
});
