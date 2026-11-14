import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openMainNavigation } from "./public-header";
import { openFooterGroup } from "./public-footer";

const path = "/use-cases/no-code-checkout-experience";

test("no-code setup is readable, accessible and does not load a payment runtime", async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const external: string[] = [];
  const errors: string[] = [];
  page.on("request", request => { if (new URL(request.url()).origin !== origin) external.push(request.url()); });
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(path + "#setup");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://etaildepot.com" + path);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const setup = page.locator("#setup");
  await expect(page.locator("#checkout-setup-title")).toBeInViewport();
  await expect(setup.locator("h3")).toHaveText(["Open Pay by Link", "Create your payment link", "Share the link or QR code", "Check the payment"]);
  await expect(setup).toContainText("The live walkthrough and screenshots are still pending.");
  await expect(setup.getByRole("link", { name: /Cybersource Business Center/ })).toHaveAttribute("href", "https://businesscenter.cybersource.com");
  await expect(page.locator("main input, main form, main iframe")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Pay online", exact: true })).toBeDisabled();
  await expect(page.locator("#checkout-status")).toHaveText("Preview only. Payments are not available yet.");
  await expect(page.locator("[data-qr-placeholder]")).toContainText("QR code pending");
  await expect(setup).not.toContainText(/shared secret|API key|key file path|capture context/i);
  await page.reload();
  await expect(page.locator("#checkout-setup-title")).toBeInViewport();
  const disclosure = setup.locator("details");
  await disclosure.locator("summary").click();
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(disclosure).toContainText("Paste your payment link into its destination field");
  const audit = await new AxeBuilder({ page }).include("main").analyze();
  expect(audit.violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test("the website button instructions work without JavaScript at phone and desktop widths", async ({ browser, baseURL }) => {
  for (const width of [320, 1440]) {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width, height: 900 } });
    try {
      const page = await context.newPage();
      await page.goto(path + "#share-payment-link");
      const disclosure = page.locator("#share-payment-link details");
      await disclosure.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(disclosure).toHaveAttribute("open", "");
      await expect(disclosure.getByText("Open the button to check that it leads to the correct payment page.")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await page.locator("#setup").getByRole("link", { name: "Set up your account", exact: true }).focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/resources\/merchant-account-setup$/);
    } finally { await context.close(); }
  }
});

test("no-code checkout belongs to Use cases in the text-only header and branded footer", async ({ page }) => {
  await page.goto("/");
  const navigation = await openMainNavigation(page, "Use cases");
  const useCases = navigation.locator("details").filter({ has: page.locator("summary").filter({ hasText: /^Use cases$/ }) });
  const headerLink = useCases.getByRole("link", { name: "No code checkout experience", exact: true });
  await expect(headerLink).toHaveAttribute("href", path);
  await expect(headerLink.locator("img, svg, .inline-brand-image")).toHaveCount(0);
  const resources = navigation.locator("details").filter({ has: page.locator("summary").filter({ hasText: /^Resources$/ }) });
  await expect(resources.locator("a")).toHaveText(["Merchant account setup", "Shopify integration", "WooCommerce integration", "Guides", "Help center"]);
  await headerLink.click();
  await expect(page).toHaveURL(new RegExp(path + "$"));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Accept payments with a link or QR code.");
  const closedNavigation = page.getByRole("banner").getByRole("navigation", { name: "Main navigation", includeHidden: true });
  await expect(closedNavigation.locator("summary").filter({ hasText: /^Use cases$/ })).toHaveClass("is-current");
  const footerGroup = await openFooterGroup(page, "Use cases");
  await expect(footerGroup.locator("a")).toHaveText(["Online businesses", "Software platforms", "Switch merchant services", "No code checkout experience"]);
  const footerLink = footerGroup.getByRole("link", { name: "No code checkout experience", exact: true });
  await expect(footerLink).toHaveAttribute("href", path);
  await expect(footerLink.locator(".public-footer-guide-brand")).toBeVisible();
  await expect(page.locator(".public-footer-navigation .public-footer-guide-brand")).toHaveCount(4);
  await expect(page.getByRole("contentinfo").locator('a[href="/resources/no-code-checkout-experience"]')).toHaveCount(0);
  await footerLink.click();
  await expect(page).toHaveURL(new RegExp(path + "$"));
});
