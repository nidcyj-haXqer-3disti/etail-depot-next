import { expect, type Page } from "@playwright/test";

export async function openMainNavigation(page: Page, group = "Services") {
  await page.waitForLoadState("domcontentloaded");
  const menu = page.getByRole("banner").getByRole("button", { name: "Menu", exact: true, includeHidden: true });
  const compact = await page.evaluate(() => matchMedia("(max-width: 959px)").matches);
  if (compact) {
    await expect(menu).toBeVisible();
    if (await menu.getAttribute("aria-expanded") !== "true") await menu.click();
  } else {
    await expect(menu).toBeHidden();
  }
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await expect(navigation).toBeVisible();
  const category = navigation.locator("summary").filter({ hasText: new RegExp(`^${group}$`) });
  const disclosure = navigation.locator("details").filter({ has: page.locator("summary").filter({ hasText: new RegExp(`^${group}$`) }) });
  if (await disclosure.getAttribute("open") === null) {
    const back = navigation.getByRole("button", { name: "Back", exact: true });
    if (await back.isVisible()) await back.click();
    await category.click();
  }
  return navigation;
}

export async function closeMainNavigation(page: Page) {
  const menu = page.getByRole("banner").getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible() && await menu.getAttribute("aria-expanded") === "true") {
    await menu.click();
  } else {
    const openSummary = page.locator(".public-nav-group[open] > summary").first();
    if (await openSummary.isVisible()) await openSummary.press("Escape");
  }
}
