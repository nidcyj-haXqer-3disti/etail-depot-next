import { describe, expect, it } from "vitest";
import { salesBookingUrl } from "../../src/shared/site/sales-booking-url";

describe("sales booking destination", () => {
  it("leaves booking unavailable until the operator supplies a booking page", () => {
    expect(salesBookingUrl(null)).toBeNull();
  });
  it("accepts an HTTPS Calendly event and normalizes its final slash", () => {
    expect(salesBookingUrl("https://calendly.com/example-team/sales-call/")).toBe("https://calendly.com/example-team/sales-call");
  });
  it("accepts a public team page for choosing a specific host", () => {
    expect(salesBookingUrl("https://calendly.com/example-sales-team/")).toBe("https://calendly.com/example-sales-team");
  });
  it.each([
    "", "javascript:alert(1)", "http://calendly.com/example-team/sales-call",
    "https://calendly.com.evil.invalid/example-team/sales-call",
    "https://other.invalid/example-team/sales-call",
    "https://visitor:secret@calendly.com/example-team/sales-call",
    "https://calendly.com/example-team/sales-call?email=private@example.com",
    "https://calendly.com/example-team/sales-call#private",
    "https://calendly.com/app", "https://calendly.com/app/scheduling",
    "https://calendly.com/teams/new", "https://calendly.com/login", "https://calendly.com/signup",
    "https://calendly.com/help", "https://calendly.com/pricing", "https://calendly.com/legal/privacy",
    "https://calendly.com/example-sales-team?email=private@example.com",
    "https://calendly.com/example-sales-team#private", "https://calendly.com/", "https://calendly.com/example-team/sales-call/extra",
  ])("rejects non-booking or data-bearing configuration: %s", value => {
    expect(() => salesBookingUrl(value)).toThrow();
  });
});
