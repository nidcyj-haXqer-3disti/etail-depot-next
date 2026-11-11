import { expect, type Locator, type Page } from "@playwright/test";
import { salesBookingUrl } from "../../src/shared/site/sales-booking-url";
import { hostedServices } from "../../src/shared/site/hosted-services";

export const configuredSalesBooking = salesBookingUrl(hostedServices.sales.bookingUrl);
export const salesContactHref = configuredSalesBooking ?? hostedServices.payments.contactHref;
export const salesActionHref = (fallback: string) => configuredSalesBooking ?? fallback;

export function salesContactLink(page: Page) {
  return page.locator("#payment-review").getByRole("link", {
    name: configuredSalesBooking ? "Book a call" : hostedServices.payments.email,
    exact: true,
  });
}

export async function stubSalesBooking(page: Page) {
  await page.route("https://calendly.com/**", route => route.fulfill({
    contentType: "text/html",
    body: "<!doctype html><html lang='en'><title>Booking fixture</title><body><h1>Choose a time</h1><button>Example time</button></body></html>",
  }));
}

/** Verify a sales entry without making an appointment; close the panel for the next journey step. */
export async function exerciseSalesAction(page: Page, action: Locator, fallback: string, keyboard = false) {
  await stubSalesBooking(page);
  await expect(action).toHaveAttribute("href", salesActionHref(fallback));
  if (configuredSalesBooking) await expect(action).toHaveAttribute("referrerpolicy", "no-referrer");
  const previousUrl = page.url();
  if (keyboard) { await action.focus(); await page.keyboard.press("Enter"); }
  else await action.click();
  if (configuredSalesBooking) {
    const dialog = page.getByRole("dialog", { name: "Book a call", exact: true });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(previousUrl);
    await expect(dialog.locator("iframe")).toHaveAttribute("src", `${configuredSalesBooking}?embed_domain=${encodeURIComponent(new URL(page.url()).host)}&embed_type=Inline&hide_event_type_details=1&background_color=ffffff&text_color=193c33&primary_color=193c33`);
    await expect(dialog.getByRole("link", { name: "Open booking in a new tab", exact: true })).toHaveAttribute("href", configuredSalesBooking);
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    await expect(dialog).toHaveCount(0);
  } else {
    await expect(page).toHaveURL(new URL(fallback, previousUrl).href);
    await expect(salesContactLink(page)).toBeVisible();
  }
}
