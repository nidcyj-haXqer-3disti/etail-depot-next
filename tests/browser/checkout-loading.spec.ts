import { expect, test } from "@playwright/test";

for (const width of [320, 390, 1440]) {
  test(`checkout keeps its first-render geometry while scripts load at ${width}px`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    let release!: () => void;
    const scripts = new Promise<void>(resolve => { release = resolve; });
    await page.route("**/*.js", async route => { await scripts; await route.continue(); });
    try {
      await page.goto("/online-businesses#customer-checkout", { waitUntil: "commit" });
      const explorer = page.locator(".payment-service-explorer");
      const checkout = explorer.getByRole("tabpanel", { name: "Checkout", exact: true });
      await expect(checkout).toBeVisible();
      await expect(explorer.getByRole("tabpanel", { name: "Onboarding", exact: true })).toBeHidden();
      await expect(explorer.getByRole("tab", { name: "Checkout", exact: true })).toBeDisabled();
      await page.evaluate(() => document.fonts.ready);
      const geometry = () => page.evaluate(() => Object.fromEntries([
        ".payment-service-explorer", ".pse-tabs", ".unified-preview",
        ".unified-preview-screen-nav", ".unified-preview-layout", ".unified-preview-methods",
      ].map(selector => {
        const { x, y, width: w, height } = document.querySelector(selector)!.getBoundingClientRect();
        // Compare document positions; fragment navigation can separately adjust scrollY.
        return [selector, { x: w || height ? x + scrollX : 0, y: w || height ? y + scrollY : 0, width: w, height }];
      })));
      const before = await geometry();
      release();
      await page.waitForLoadState("load");
      await expect(explorer.getByRole("tab", { name: "Checkout", exact: true })).toBeEnabled();
      await expect(page.locator(".unified-preview")).toHaveAttribute("data-enhanced", "true");
      const after = await geometry();
      for (const selector of Object.keys(before)) {
        for (const dimension of ["x", "y", "width", "height"] as const) {
          expect(Math.abs(after[selector]![dimension] - before[selector]![dimension]), `${selector} ${dimension}`).toBeLessThanOrEqual(1);
        }
      }
      expect(errors).toEqual([]);
    } finally {
      release();
      await context.close();
    }
  });

  test(`checkout keeps keyboard controls and payment methods at ${width}px`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, viewport: { width, height: 900 } });
    const page = await context.newPage();
    try {
      await page.goto("/online-businesses#customer-checkout");
      const explorer = page.locator(".payment-service-explorer");
      const views = explorer.getByRole("tablist", { name: "Payment journey views", exact: true });
      await views.getByRole("tab", { name: "Checkout", exact: true }).focus();
      for (const [key, name] of [["Home", "Onboarding"], ["End", "Card payout"], ["ArrowLeft", "Card record"], ["Home", "Onboarding"], ["ArrowRight", "Checkout"]]) {
        await page.keyboard.press(key!);
        await expect(views.getByRole("tab", { name, exact: true })).toBeFocused();
        await expect(explorer.getByRole("tabpanel", { name, exact: true })).toBeVisible();
      }
      const methods = explorer.getByRole("tablist", { name: "Checkout payment method", exact: true });
      await methods.getByRole("tab", { name: "Card", exact: true }).focus();
      await page.keyboard.press("ArrowDown");
      await expect(methods.getByRole("tab", { name: "Bank payment", exact: true })).toBeFocused();
      await expect(explorer.getByRole("tabpanel", { name: "Bank payment", exact: true })).toContainText("Bank account details");
      if (width < 500) {
        const order = explorer.getByRole("button", { name: "Show screen 1: Order", exact: true });
        await order.focus();
        await page.keyboard.press("ArrowRight");
        await expect(explorer.getByRole("button", { name: "Show screen 2: Details", exact: true })).toBeFocused();
        await expect(explorer.getByRole("tabpanel", { name: "Bank payment", exact: true })).toBeInViewport();
        await page.keyboard.press("End");
        await expect(explorer.getByLabel("Bank payment submission", { exact: true })).toBeInViewport();
        await page.keyboard.press("Home");
        await expect(order).toBeFocused();
      }
      await methods.getByRole("tab", { name: "Bank payment", exact: true }).focus();
      await page.keyboard.press("Home");
      await expect(methods.getByRole("tab", { name: "Card", exact: true })).toHaveAttribute("aria-selected", "true");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await expect(explorer.locator("form, input, textarea, select")).toHaveCount(0);
    } finally { await context.close(); }
  });

  test(`all payment views stay readable without JavaScript at ${width}px`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width, height: 900 } });
    const page = await context.newPage();
    try {
      await page.goto("/online-businesses");
      const explorer = page.locator(".payment-service-explorer");
      await expect(explorer.getByRole("tablist", { name: "Payment journey views", includeHidden: true })).toBeHidden();
      for (const title of ["Set up your merchant account.", "Let customers choose how to pay.", "Match the card payment to the order.", "Reconcile the card payout to your bank."]) {
        await expect(explorer.getByRole("heading", { name: title, exact: true })).toBeVisible();
      }
      const track = explorer.getByRole("group", { name: "Checkout artwork", exact: true });
      expect(await track.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      for (const stage of await explorer.locator(".unified-preview-stage").all()) await expect(stage).toBeVisible();
      await expect(explorer.getByRole("group", { name: "Checkout screens", includeHidden: true })).toBeHidden();
      await expect(explorer.getByRole("tablist", { name: "Checkout payment method", includeHidden: true })).toBeHidden();
      await explorer.getByText("If the result is unclear", { exact: true }).click();
      await expect(explorer.getByText("An unknown result is not a decline.", { exact: false })).toBeVisible();
    } finally { await context.close(); }
  });
}
