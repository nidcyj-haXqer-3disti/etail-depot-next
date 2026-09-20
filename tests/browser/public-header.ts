import { expect, type Page } from "@playwright/test";

export async function openMainNavigation(page: Page) {
  const menu = page.getByRole("banner").getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible() && await menu.getAttribute("aria-expanded") !== "true") {
    await menu.click();
  }
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await expect(navigation).toBeVisible();
  return navigation;
}
