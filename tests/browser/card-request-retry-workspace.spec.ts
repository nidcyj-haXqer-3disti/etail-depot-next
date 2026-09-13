import {freshPrepaidCard,signInPerson} from "./helpers/prepaid";
import {closeDatabase} from "../../src/platform/database/client";
import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { cardDashboard } from "./helpers/fresh";

test.afterAll(closeDatabase);
test("one card form starts only on review and safely retries lost start, save and creation responses", async ({ page }) => {
  test.setTimeout(120_000);
  const fixture=await freshPrepaidCard("1600");await signInPerson(page,fixture.primary.personId);const data=await cardDashboard(page.request),serviceId=fixture.primary.serviceId;
  const name = `Retry card ${randomUUID().slice(0, 8)}`;
  const workspace = async () => (await page.request.get(`/api/v1/cardholder-services/${serviceId}/workspace`)).json();
  const before = await workspace();
  const attempts: Record<string, Record<string, unknown>[]> = { start: [], save: [], submit: [] };
  await page.route(`**/api/v1/cardholder-services/${serviceId}/card-requests**`, async route => {
    const request = route.request(), path = new URL(request.url()).pathname;
    const kind = request.method() === "PATCH" ? "save" : path.endsWith("/submit") ? "submit" : request.method() === "POST" && path.endsWith("/card-requests") ? "start" : null;
    if (!kind) { await route.continue(); return; }
    attempts[kind]!.push(request.postDataJSON() as Record<string, unknown>);
    if (attempts[kind]!.length === 1) {
      // Commit the actual command, then lose its response as on an interrupted connection.
      const response = await route.fetch();
      expect(response.status()).toBe(200);
      await route.abort("connectionfailed");
    } else await route.continue();
  });
  // An unknown holder in the URL cannot add an option or gain cardholding access.
  await page.goto(`/cardholder-services?new=1&holder=${randomUUID()}`);
  const dialog = page.getByRole("dialog"), cardName = dialog.getByRole("textbox", { name: "Card name", exact: true });
  await expect(cardName).toBeVisible();
  const initialReview = dialog.getByRole("button", { name: "Review card", exact: true });
  const viewport = page.viewportSize();
  if (viewport && viewport.width <= 600) {
    // The action stays reachable before scrolling, even when the details need
    // more room than a narrow phone provides. Resizing never submits a command.
    await expect(initialReview).toBeInViewport({ ratio: 1 });
    try {
      await page.setViewportSize({ width: 320, height: 568 });
      await expect(initialReview).toBeInViewport({ ratio: 1 });
      expect((await initialReview.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    } finally { await page.setViewportSize(viewport); }
  }
  expect((await workspace()).cardRequests).toEqual(before.cardRequests);
  expect(attempts.start).toEqual([]);
  const self = dialog.getByRole("radio", { name: new RegExp(data.person.displayName) });
  await expect(dialog.getByRole("radio",{name:/For someone else/})).toBeChecked();
  await expect(dialog).not.toContainText("That cardholder isn’t available");
  await expect(self).not.toBeChecked();
  // Choosing Me explicitly assigns the owner; the URL never chooses a recipient.
  await self.click();
  await expect(self).toBeChecked();
  await cardName.fill(name);
  await dialog.getByLabel("Total spending limit (USD)",{exact:true}).fill("16.00");
  await initialReview.click();
  const retry = dialog.getByRole("button", { name: "Retry the same request", exact: true });
  await expect(retry).toBeEnabled();
  await expect(cardName).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeVisible();
  await retry.click();
  await expect.poll(() => attempts.save!.length).toBe(1);
  await expect(retry).toBeEnabled();
  await expect(cardName).toBeDisabled();
  await retry.click();
  await expect(dialog.getByRole("heading", { name: "Review your card", exact: true })).toBeVisible();
  await expect(dialog).toContainText("Creating a card does not add money.");
  await expect(dialog.getByText("$16.00",{exact:true})).toBeVisible();
  expect(attempts.start).toHaveLength(2);
  expect(attempts.start![0]).toEqual(attempts.start![1]);
  expect(attempts.save).toHaveLength(2);
  expect(attempts.save![0]).toEqual(attempts.save![1]);
  // Intentionally click as soon as review renders, without waiting for its URL.
  // Navigation must keep Create disabled until this form can retain the attempt.
  await dialog.getByRole("button", { name: "Create card", exact: true }).click();
  await expect(retry).toBeEnabled();
  await expect(dialog.getByRole("button", { name: "Edit details", exact: true })).toBeDisabled();
  await retry.click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Selected card overview", exact: true })).toContainText(name);
  expect(attempts.submit).toHaveLength(2);
  expect(attempts.submit![0]).toEqual(attempts.submit![1]);
  const created = (await cardDashboard(page.request)).cards.filter(card => card.nickname === name);
  expect(created).toHaveLength(1);
  expect(created[0]!.available.minor).toBe("1600");
  await expect(page).toHaveURL(url=>url.pathname===`/cardholder-services/cards/${created[0]!.id}`&&!url.searchParams.has("focus"));
  const after = await workspace();
  expect(after.cardRequests).toHaveLength(before.cardRequests.length + 1);
  expect(after.cardRequests.filter((request: { nickname: string }) => request.nickname === name)).toHaveLength(1);
});
