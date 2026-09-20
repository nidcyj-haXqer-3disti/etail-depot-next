import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { retiredRoute } from "../../src/shared/public-routes";
import { proxy } from "../../src/proxy";

describe("retired application boundary", () => {
  it.each([
    ["/login", "/help#access"], ["/cardholder-services/cards/old-id", "/card-services"],
    ["/merchant-services/terminals/old-id", "/payment-services"], ["/profile", "/help#access"],
    ["/money-accounts/old-id", "/"], ["/operations", "/help"],
  ])("redirects %s without forwarding input", (path, destination) => {
    const request = new NextRequest(`https://etail-depot-next.netlify.app${path}?next=https://other.invalid&token=synthetic-test`);
    const response = proxy(request)!;
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`https://etail-depot-next.netlify.app${destination.includes("#") ? destination : `${destination}#main-content`}`);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(response.headers.has("set-cookie")).toBe(false);
  });
  it.each(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])("retires APIs for %s", async method => {
    const response = proxy(new NextRequest("https://etail-depot-next.netlify.app/api/v1/sessions", { method }))!;
    expect(response.status).toBe(410);
    expect(response.headers.has("location")).toBe(false);
    expect(await response.text()).not.toContain("sessions");
  });
  it.each(["/checkout/old-payment", "/pay/old-link", "/payments/old-receipt"])("never resumes the old transaction at %s", path => {
    expect(proxy(new NextRequest(`https://etail-depot-next.netlify.app${path}`))!.status).toBe(410);
  });
  it("does not redirect a submitted body to a new service", () => {
    const response = proxy(new NextRequest("https://etail-depot-next.netlify.app/login", { method: "POST", body: "synthetic" }))!;
    expect(response.status).toBe(410);
    expect(response.headers.has("location")).toBe(false);
  });
  it.each(["/", "/card-services", "/payment-services", "/help", "/privacy", "/terms", "/apiary", "/constructor", "/__proto__"])("does not capture public or unrelated route %s", path => {
    expect(retiredRoute(path)).toBeNull();
  });
});
