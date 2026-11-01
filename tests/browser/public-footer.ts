import { expect, type Page } from "@playwright/test";

export async function openFooterGroup(page: Page, label: string) {
  const compact = await page.evaluate(() => matchMedia("(max-width: 959px)").matches);
  await expect(page.locator(".public-footer-navigation")).toHaveAttribute("data-compact", String(compact));
  const group = page.getByRole("navigation", { name: `Footer ${label.toLowerCase()}` });
  if (compact && await group.locator("details").getAttribute("open") === null) {
    await group.locator("summary").click();
  }
  return group;
}
