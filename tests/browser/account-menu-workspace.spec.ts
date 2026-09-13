import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { signIn } from "./helpers/fresh";

for (const width of [1440, 320]) {
  test(`profile and help stay in one keyboard-accessible menu without dashboard footers at ${width}px`, async ({ page }) => {
    await signIn(page.request, "owner");
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/cardholder-services");
    await expect(page.locator("footer")).toHaveCount(0);
    const trigger = page.getByLabel("Profile and help", {exact:true});
    await trigger.focus(); await page.keyboard.press("Enter");
    const navigation = page.getByRole("navigation", { name: "Your account", exact: true });
    await expect(navigation.getByRole("link")).toHaveText(["Your profile", "Sign-in & security", "Help center"]);
    await expect(page.getByRole("button", { name: "Sign out", exact: true })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(navigation.getByRole("link", { name: "Your profile", exact: true })).toBeFocused();
    const audit = await new AxeBuilder({ page }).include(".account-menu").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(audit.violations.map(({ id }) => id)).toEqual([]);
    const box = await page.locator(".account-menu-panel").boundingBox();
    expect(box).not.toBeNull(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape"); await expect(trigger).toBeFocused(); await expect(navigation).toBeHidden();

    await trigger.click();
    await navigation.getByRole("link", { name: "Your profile", exact: true }).click();
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole("region", { name: "Your details", exact: true })).toBeVisible();
    await expect(page.locator("main a[href^='/money-accounts/']")).toHaveCount(0);
    await expect(page.getByRole("link", {name:"Manage sign-ins",exact:true})).toHaveAttribute("href","/security");
    await expect(page.getByRole("heading", {name:"Customer care",exact:true})).toHaveCount(0);
    await expect(page.locator("main")).toContainText("Display name");
    await expect(page.locator("footer")).toHaveCount(0);
    await expect(navigation).toBeHidden();

    await trigger.click();
    await navigation.getByRole("link", { name: "Help center", exact: true }).click();
    await expect(page).toHaveURL(/\/help$/);
    await expect(page.getByRole("navigation", { name: "Services", exact: true })).toBeVisible();
    await expect(page.locator("footer")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Sign in", exact: true })).toHaveCount(0);
    await trigger.click();
    await page.getByRole("heading", { level: 1 }).click();
    await expect(navigation).toBeHidden();
    expect(await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1);
  });
}
