import { expect, type Page } from "@playwright/test";

/** Only the six illustrative business selectors are allowed on this public page. */
export async function expectReadOnlyPlatformExample(page: Page) {
  await expect(page.locator("form,iframe,textarea,select,[contenteditable=true]")).toHaveCount(0);
  await expect(page.locator("input")).toHaveCount(6);
  const selectors = page.locator('[data-platform-accounts] input[data-example-selector][type="radio"][name="platform-example-business"]');
  await expect(selectors).toHaveCount(6);
  expect(await selectors.evaluateAll(inputs => inputs.map(input => ({
    value: (input as HTMLInputElement).value, target: input.getAttribute("aria-controls"), form: (input as HTMLInputElement).form,
  })))).toEqual(["cotton", "freight", "travel", "legal", "market", "logistics"].map(value => ({ value, target: `platform-company-${value}`, form: null })));
}
