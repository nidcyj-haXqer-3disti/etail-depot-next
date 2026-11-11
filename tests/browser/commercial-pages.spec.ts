import { salesContactHref, salesContactLink, configuredSalesBooking, exerciseSalesAction, stubSalesBooking } from "./sales-contact";
import { test, expect, type Page } from "@playwright/test";
import { openFooterGroup } from "./public-footer";
import { isServiceDetailPath } from "../../src/features/services/catalog";
import { COMMERCIAL_PATHS } from "../../src/shared/site/commercial-paths";

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
    await expect(page.locator("main")).not.toContainText(/Cybersource|Infinicept|prototype|TODO/i);
    // Artwork captions identify example data; marketing prose must not read like a draft.
    const marketingCopy = await page.locator("main").evaluate(main => {
      const copy = main.cloneNode(true) as HTMLElement;
      copy.querySelectorAll("figcaption").forEach(caption => caption.remove());
      return copy.textContent;
    });
    expect(marketingCopy).not.toMatch(/illustrative/i);
    await expect(page.getByRole("navigation", { name: "Related information", exact: true })).toHaveCount(0);
    const action = path === "/company/contact" ? salesContactLink(page) : path === "/company/about" ? page.getByRole("main").getByRole("link", { name: "contact our team", exact: true }) : page.locator(isServiceDetailPath(path) ? "[data-service-actions] a" : ".commercial-action a").first();
    await expect(action).toBeVisible();
    const href = await action.getAttribute("href");
    expect(href).toBeTruthy();
    if (href!.startsWith("/")) {
      await action.click();
      await expect(page).toHaveURL(new URL(href!, baseURL).href);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    } else if (configuredSalesBooking && href === configuredSalesBooking) {
      await exerciseSalesAction(page, action, "/company/contact#payment-review");
    }
  }
});

test("merchant application and contact routes never forward visitor input", async ({ page }) => {
  for (const path of ["/services/merchant-onboarding", "/company/contact"]) {
    await page.goto(`${path}?merchant=private&next=https://other.invalid`);
    const application = page.locator('main a[href="https://merchantapp.io/etaildepot/UserAccount/Login"]');
    await expect(application).toHaveCount(1);
    await expect(application).toHaveAttribute("rel", /noreferrer/);
    await expect(application).toHaveAttribute("referrerpolicy", "no-referrer");
    const targets = await page.locator("main a").evaluateAll(links => links.map(link => link.getAttribute("href")));
    expect(targets.some(target => target?.includes("private") || target?.includes("other.invalid"))).toBe(false);
  }
  await expect(page.locator("#cards")).toContainText("An inquiry is not an application.");
  await expect(salesContactLink(page)).toHaveAttribute("href", salesContactHref);
  const addresses = await page.locator('main a[href^="mailto:"]').evaluateAll(links => links.map(link => link.getAttribute("href")));
  expect(addresses).toEqual([...(configuredSalesBooking ? [] : ["mailto:trolleys@etaildepot.com"]), "mailto:trolleys@etaildepot.com", "mailto:ledgix@etaildepot.com", "mailto:compliance@etaildepot.com"]);
  for (const contact of ["account-support", "cards", "compliance"]) {
    const link = page.locator(`#${contact} a[href^="mailto:"]`);
    await expect(link).toBeVisible();
    await expect(link).toHaveText((await link.getAttribute("href"))!.slice("mailto:".length));
  }
});

test("merchants can discuss processing costs before applying while platforms reach commercial terms", async ({ page }) => {
  await page.goto("/pricing");
  await exerciseSalesAction(page, page.getByRole("link", { name: "Discuss your processing costs", exact: true }), "/company/contact#payment-review");
  await page.goto("/pricing");
  await exerciseSalesAction(page, page.getByRole("link", { name: "Software partnerships", exact: true }), "/company/contact#platforms");
  await page.goto("/company/contact#payment-review");
  await expect(page.locator("#payment-review")).toBeInViewport();
  await expect(page.locator("[data-merchant-contact]").getByRole("heading")).toHaveText("Talk with our sales team");
  await expect(salesContactLink(page)).toHaveAttribute("href", salesContactHref);
  await expect(page.locator('main a[href="https://merchantapp.io/etaildepot/UserAccount/Login"]')).toHaveAttribute("referrerpolicy", "no-referrer");
});

test("shared Contact sales action opens booking directly and restores the current page", async ({ page }) => {
  await stubSalesBooking(page);
  const requests: string[] = [];
  page.on("request", request => { if (new URL(request.url()).hostname === "calendly.com") requests.push(request.url()); });
  for (const path of ["/developers/getting-started", "/services/merchant-services"]) {
    requests.length = 0;
    await page.goto(`${path}?email=private@example.com#main-content`);
    const previousUrl = page.url();
    const initialOverflow = await page.evaluate(() => ({ body: document.body.style.overflow, html: document.documentElement.style.overflow }));
    const header = page.getByRole("banner", { includeHidden: true });
    const menu = header.getByRole("button", { name: "Menu", exact: true, includeHidden: true });
    const mobileMenu = await menu.isVisible();
    if (mobileMenu) await menu.click();
    const contact = header.getByRole("link", { name: "Contact sales", exact: true });
    await expect(page.locator("iframe")).toHaveCount(0);
    expect(requests).toEqual([]);
    if (!configuredSalesBooking) {
      await contact.click();
      await expect(page).toHaveURL(/\/company\/contact#payment-review$/);
      await expect(salesContactLink(page)).toBeVisible();
      continue;
    }
    await expect(contact).toHaveAttribute("href", configuredSalesBooking);
    await expect(contact).toHaveAttribute("referrerpolicy", "no-referrer");
    await contact.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Book a call", exact: true });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(previousUrl);
    expect(await dialog.evaluate(node => node.parentElement === document.body)).toBe(true);
    await expect(dialog.getByRole("button", { name: "Close", exact: true })).toBeFocused();
    await expect(header.getByRole("dialog", { name: "Site menu", includeHidden: true })).toHaveCount(0);
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("main")).not.toHaveAttribute("inert");
    await expect(page.locator("footer")).not.toHaveAttribute("inert");
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe(initialOverflow.html);
    await expect(dialog.locator("iframe")).toHaveAttribute("referrerpolicy", "no-referrer");
    await expect.poll(() => requests.length).toBe(1);
    expect(requests[0]).toBe(`${configuredSalesBooking}?embed_domain=${encodeURIComponent(new URL(page.url()).host)}&embed_type=Inline&hide_event_type_details=1&background_color=ffffff&text_color=193c33&primary_color=193c33`);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(mobileMenu ? menu : contact).toBeFocused();
    expect(await page.evaluate(() => ({ body: document.body.style.overflow, html: document.documentElement.style.overflow }))).toEqual(initialOverflow);
    await expect(page).toHaveURL(previousUrl);
    if (mobileMenu) await menu.click();
    await contact.click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    await expect(mobileMenu ? menu : contact).toBeFocused();
  }
  await page.goto("/company/contact#payment-review");
  const merchant = page.getByRole("region", { name: "Talk with our sales team", exact: true });
  await expect(merchant).toContainText("payments for your software platform");
  await expect(merchant.locator("#account-support, #integration")).toHaveCount(0);
  await expect(merchant.locator('a[href^="mailto:"]')).toHaveCount(configuredSalesBooking ? 0 : 1);
});

test("buyers can find ACH, provider change and platform model decisions through the existing site", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await nav.locator("summary").filter({ hasText: /^Services$/ }).click();
  await nav.getByRole("link", { name: "ACH payments", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/ach-payments$/);
  await expect(page.locator("main")).toContainText("A submitted bank payment can still be pending or returned");
  await page.getByRole("banner").getByRole("link", { name: "Etail Depot home", exact: true }).click();
  await page.locator("main").getByRole("link", { name: "Explore merchant services", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/merchant-services$/);
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await nav.locator("summary").filter({ hasText: /^Use cases$/ }).click();
  await nav.getByRole("link", { name: "Switch merchant services", exact: true }).click();
  await expect(page).toHaveURL(/\/use-cases\/switch-merchant-services$/);
  await expect(page.locator("main")).toContainText("New accounts require review and approval");
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await nav.locator("summary").filter({ hasText: /^Services$/ }).click();
  await nav.getByRole("link", { name: "Merchant onboarding", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/merchant-onboarding$/);
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await nav.locator("summary").filter({ hasText: /^Use cases$/ }).click();
  await nav.getByRole("link", { name: "Software platforms", exact: true }).click();
  await page.getByRole("link", { name: "Account structure", exact: true }).click();
  await expect(page).toHaveURL(/\/use-cases\/software-platforms\/payment-models$/);
  await expect(page.locator("main")).toContainText("holding funds need a separately approved structure");
  await exerciseSalesAction(page, page.getByRole("link", { name: "Discuss your platform", exact: true }), "/company/contact#platforms");
});

// Commercial pages open directly with their hero while preserving the published URL hierarchy.
test("commercial pages retain their URL hierarchy without duplicate navigation rows", async ({ page }) => {
  const merchant = ["/services/merchant-onboarding", "/services/payment-methods", "/services/ach-payments", "/services/payouts", "/services/refunds", "/pricing", "/services/reconciliation", "/services/disputes", "/use-cases/online-businesses", "/use-cases/switch-merchant-services"];
  const platform = ["/use-cases/software-platforms/payment-models", "/use-cases/software-platforms/partnerships"];
  for (const path of [...merchant, ...platform]) {
    await page.goto(path);
    await expect(page.getByRole("navigation", { name: "Breadcrumb", exact: true })).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "On this page", exact: true })).toHaveCount(0);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const parent = merchant.includes(path) ? "/services/merchant-services" : "/use-cases/software-platforms";
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
  await page.goto("/use-cases/switch-merchant-services?merchant=private&reason=private");
  await expect(page).toHaveURL(/\/use-cases\/switch-merchant-services(?:\?merchant=private&reason=private)?$/);
  await expect(page.locator("main")).toContainText("New accounts require review and approval");
  await expect(page.locator("main")).toContainText("A new account does not release funds held by another provider.");
  await exerciseSalesAction(page, page.locator(".commercial-action").getByRole("link", { name: "Discuss your business", exact: true }), "/company/contact#payment-review");
  await expect(page.locator("main form, main input, main textarea")).toHaveCount(0);
  await page.goto("/company/contact#payment-review");
  await expect(page.locator("#payment-review")).toBeInViewport();
  await expect(page.locator("[data-merchant-contact]").getByRole("heading")).toHaveText("Talk with our sales team");
  await expect(salesContactLink(page)).toHaveAttribute("href", salesContactHref);
  await expect(page.locator("#merchant-application")).toContainText("Account approval and setup apply.");
  await expect(page.locator("main form, main input, main textarea")).toHaveCount(0);
  await expect(page.locator('main a[href="https://merchantapp.io/etaildepot/UserAccount/Login"]')).toHaveAttribute("referrerpolicy", "no-referrer");
});

test("contact options remain usable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(new URL("/company/contact", baseURL).href);
    for (const id of ["account-support", "cards", "compliance"]) {
      const contact = page.locator(`#${id}`);
      await expect(contact.locator('a[href^="mailto:"]')).toBeVisible();
      await expect(contact.locator('a[href^="mailto:"]')).toHaveAttribute("href", /^mailto:/);
      await expect(contact.getByRole("button")).toHaveCount(0);
    }
    for (const id of ["payment-review", "platforms", "integration", "account-support"]) {
      await page.goto(new URL(`/company/contact#${id}`, baseURL).href);
      const action = id === "integration" || id === "account-support"
        ? page.locator('#account-support a[href^="mailto:"]')
        : salesContactLink(page);
      await expect(action).toBeInViewport();
      await expect(action).toHaveAttribute("href", id === "integration" || id === "account-support" ? "mailto:trolleys@etaildepot.com" : salesContactHref);
    }
  } finally { await context.close(); }
});


test("legacy service bookmarks remain useful after separating the service pages", async ({ page }, testInfo) => {
  for (const [path, section, heading, evidence] of [
    ["/services/payouts", "payouts", "Understand the amount you receive.", "Bank deposit"],
    ["/services/payouts", "reconciliation", "When a payout needs attention.", "A different amount"],
    ["/services/refunds", "refunds", "Choose the action that fits the payment.", "Authorization reversal"],
    ["/services/refunds", "disputes", "Avoid duplicate refunds.", "Payment already disputed"],
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
  const targets = [["/services/merchant-onboarding", "onboarding"], ["/services/payment-methods", "methods"], ["/services/ach-payments", "ach"], ["/services/payouts", "payouts"], ["/services/reconciliation", "reconciliation"], ["/services/refunds", "refunds"], ["/services/disputes", "disputes"], ["/services/card-services", "cards"]];
  for (const [path, kind] of targets) {
    await page.goto(path);
    const artwork = page.locator(`[data-service-workflow="${kind}"]`);
    await expect(artwork).toBeVisible();
    if (kind === "onboarding") await expect(artwork.locator("figcaption")).toHaveCount(0);
    else await expect(artwork.locator("figcaption")).toBeVisible();
    await expect(artwork.locator("input,button,a,form")).toHaveCount(0);
    await expect(page.locator("[data-service-actions] a").first()).toBeVisible();
    if (kind !== "cards") await expect(page.locator("#service-workflow-title")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  await page.goto("/services/payouts#reconciliation");
  await page.locator("#reconciliation").getByRole("link", {name:"A different amount"}).click();
  await expect(page).toHaveURL(/\/services\/reconciliation$/);
  await expect(page.getByRole("heading", {level:1})).toBeInViewport();
  await page.goto("/services/refunds#disputes");
  await page.locator("#disputes").getByRole("link", {name:"Payment already disputed"}).click();
  await expect(page).toHaveURL(/\/services\/disputes$/);
  await expect(page.getByRole("heading", {level:1})).toBeInViewport();
});


test("page typography stays consistent when visitors move between page families", async ({ page, context }) => {
  test.setTimeout(60_000);
  const stops = [
    { path: "/company/about", group: "Company" },
    { path: "/company/contact", group: "Company" },
    { path: "/services/payment-methods", group: "Services" },
    { path: "/services/card-services", group: "Services" },
    { path: "/use-cases/online-businesses", group: "Use cases" },
    { path: "/developers/getting-started", group: "Developers" },
    { path: "/resources/help", group: "Resources" },
    { path: "/use-cases/software-platforms", group: "Use cases" },
    { path: "/use-cases/switch-merchant-services", group: "Use cases" },
    { path: "/company/about", group: "Company" },
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
  await page.goto("/resources/help");
  await page.locator("summary").filter({ hasText: "When will the money reach my bank?" }).click();
  await page.getByRole("link", { name: "payout information", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/payouts$/);
  await page.getByRole("link", { name: "Not yet received", exact: true }).click();
  await expect(page).toHaveURL(/\/company\/contact#account-support$/);
  await expect(page.locator("#account-support")).toBeInViewport();
  await expect(page.locator("#account-support").getByRole("heading")).toHaveText("Account and integration support");
  await expect(page.locator("#account-support")).toContainText("include its reference");
  await expect(page.locator('#account-support a[href^="mailto:"]')).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
  await expect(page.locator("#account-support").getByRole("link", { name: "Book a call", exact: true })).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/services\/payouts$/);
  await expect(page.locator("main")).toContainText("A missing payout is not a reason to charge the customer again.");
});


test("sales booking loads only on request and preserves a native fallback", async ({ page }) => {
  const bookingUrl = configuredSalesBooking;
  const requests: string[] = [];
  page.on("request", request => { if (new URL(request.url()).hostname.endsWith("calendly.com")) requests.push(request.url()); });
  await stubSalesBooking(page);
  await page.goto("/company/contact?email=private@example.com#payment-review");
  const book = page.getByRole("link", { name: "Book a call", exact: true });
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(requests).toEqual([]);
  if (!bookingUrl) {
    await expect(book).toHaveCount(0);
    await expect(salesContactLink(page)).toHaveAttribute("href", salesContactHref);
    return;
  }
  await expect(page.locator('#payment-review a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('#account-support a[href^="mailto:"]')).toHaveAttribute("href", "mailto:trolleys@etaildepot.com");
  await expect(book).toHaveAttribute("href", bookingUrl);
  await expect(book).toHaveAttribute("referrerpolicy", "no-referrer");
  await expect(book).toHaveCSS("color", "rgb(255, 255, 255)");
  await book.hover();
  await expect(book).toHaveCSS("color", "rgb(255, 255, 255)");
  await book.click();
  const dialog = page.getByRole("dialog", { name: "Book a call" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close", exact: true })).toBeFocused();
  await expect(dialog.locator("iframe")).toHaveAttribute("src", `${bookingUrl}?embed_domain=${encodeURIComponent(new URL(page.url()).host)}&embed_type=Inline&hide_event_type_details=1&background_color=ffffff&text_color=193c33&primary_color=193c33`);
  await expect(dialog.getByRole("link", { name: "Open booking in a new tab" })).toHaveAttribute("href", bookingUrl);
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0]).not.toContain("private");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(book).toBeFocused();
  await book.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close", exact: true }).click();
  await expect(book).toBeFocused();
});
