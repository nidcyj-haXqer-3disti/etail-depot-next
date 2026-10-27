import { expect, test, type Page } from "@playwright/test";

async function blockAccountActions(page: Page) {
  const unexpected: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method()) || url.pathname.startsWith("/api/") || ["trolleys.ai", "ledgix.com"].includes(url.hostname)) {
      unexpected.push(`${request.method()} ${url.origin}${url.pathname}`);
      await route.abort("blockedbyclient");
    } else await route.continue();
  });
  return { unexpected, errors };
}

async function browserStorage(page: Page) {
  return page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
}

test("payment requests explain the acceptance flow without duplicate actions", async ({ page }) => {
  const observed = await blockAccountActions(page);
  await page.goto("/online-businesses#payment-channels");
  const initialStorage = await browserStorage(page);
  const channels = page.locator("#payment-channels");
  await expect(channels.getByRole("heading", { name: /Take the checkout\s*to your customer\./ })).toBeVisible();
  await expect(channels).toContainText("Share it by email, text, social media or a website button");
  await expect(channels).toContainText("Available options depend on your account setup");
  await expect(channels.getByRole("img", { name: /Payment request flow/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Choose your checkout.", exact: true })).toHaveCount(0);
  await expect(page.getByRole("tablist", { name: "Checkout layouts", exact: true })).toHaveCount(0);
  await expect(page.getByRole("tablist", { name: "Payment journey views", exact: true })).toBeVisible();
  await expect(channels.getByRole("link")).toHaveCount(1);
  await expect(channels.getByRole("link", {name:"Use payment requests",exact:true})).toHaveAttribute("href", "/docs/payment-requests");
  await expect(channels.locator("details")).toHaveCount(0);
  await expect(channels).not.toContainText("What to include in a request");
  await expect(channels.locator("button, input, textarea, form, iframe")).toHaveCount(0);
  expect(await browserStorage(page)).toEqual(initialStorage);
  expect(observed.unexpected).toEqual([]);
  expect(observed.errors).toEqual([]);
});

test("fee estimates are local and leave payment operations unchanged", async ({ page }) => {
  const observed = await blockAccountActions(page);
  await page.goto("/payment-acceptance-service");
  const initialStorage = await browserStorage(page);
  const estimate = page.locator(".fee-estimate");
  const operations = page.locator("#payment-operations");
  const operationsBefore = await operations.textContent();
  await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
  await estimate.getByLabel("Payment amount USD").fill("480");
  await expect(estimate.locator(".fee-net")).toContainText("$465.78");
  expect(await operations.textContent()).toBe(operationsBefore);
  expect(await browserStorage(page)).toEqual(initialStorage);
  await page.reload();
  await expect(estimate.getByLabel("Payment amount USD")).toHaveValue("100");
  await expect(estimate.locator(".fee-net")).toContainText("$96.80");
  expect(await browserStorage(page)).toEqual(initialStorage);
  expect(observed.unexpected).toEqual([]);
  expect(observed.errors).toEqual([]);
});

test("merchant operations and payment requests stay readable at narrow widths and increased text spacing", async ({ page }) => {
  const observed = await blockAccountActions(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/payment-acceptance-service");
    for (const spaced of [false, true]) {
      if (spaced) await page.addStyleTag({ content: "body *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}body p{margin-bottom:2em!important}" });
      for (const anchor of ["payouts", "refunds-and-disputes", "payment-questions-title"]) {
        await expect(page.locator(`#${anchor}`)).toBeVisible();
      }
      const geometry = await page.locator("main").evaluate(node => ({
        documentOverflow: document.documentElement.scrollWidth > window.innerWidth,
        containerOverflow: node.scrollWidth > node.clientWidth,
        contentOverflow: [...node.querySelectorAll("#payment-channels, #payouts, #refunds-and-disputes, .fee-estimate, .payment-faq-content")].some(element => element.scrollWidth > element.clientWidth + 1),
      }));
      expect(geometry, `${width}px ${spaced ? "increased spacing" : "normal"}`).toEqual({ documentOverflow: false, containerOverflow: false, contentOverflow: false });
    }
  }
  expect(observed.unexpected).toEqual([]);
  expect(observed.errors).toEqual([]);
});
