import { describe, expect, it } from "vitest";
import { estimateDomesticCardFee } from "../../src/modules/public-site/fee-estimate";

describe("public fee estimate", () => {
  it("leaves the optional service off unless selected", () => {
    expect(estimateDomesticCardFee("100.00")).toEqual({
      amountCents: 10000,
      processingCents: 320,
      serviceCents: 0,
      subtotalCents: 9680,
    });
    expect(estimateDomesticCardFee("100", false)).toEqual(estimateDomesticCardFee("100"));
  });

  it("estimates displayed processing and optional service fees", () => {
    const estimate = estimateDomesticCardFee("100", true);
    expect(estimate).toEqual({
      amountCents: 10000,
      processingCents: 320,
      serviceCents: 40,
      subtotalCents: 9640,
    });
    expect(estimate).not.toHaveProperty("netCents");
  });

  it.each([
    {amount: "1.24", amountCents: 124, processingCents: 34, serviceCents: 0, subtotalCents: 90},
    {amount: "1.25", amountCents: 125, processingCents: 34, serviceCents: 1, subtotalCents: 90},
    {amount: "5.00", amountCents: 500, processingCents: 45, serviceCents: 2, subtotalCents: 453},
    {amount: " 9.99 ", amountCents: 999, processingCents: 59, serviceCents: 4, subtotalCents: 936},
    {amount: "100000", amountCents: 10000000, processingCents: 290030, serviceCents: 40000, subtotalCents: 9669970},
  ])("rounds the service and processing fees separately for $amount", ({amount, ...fees}) => {
    expect(estimateDomesticCardFee(amount, true)).toEqual(fees);
  });

  it("rounds a sub-cent optional service fee to zero", () => {
    expect(estimateDomesticCardFee("1", true)).toEqual({
      amountCents: 100,
      processingCents: 33,
      serviceCents: 0,
      subtotalCents: 67,
    });
  });

  it.each(["", "0", "0.99", "-100", "1.001", "1e3", "NaN", "1,000", "100000.01", "99999999", "$100"])("rejects invalid or unsupported amount %s", input => {
    expect(estimateDomesticCardFee(input)).toBeNull();
    expect(estimateDomesticCardFee(input, true)).toBeNull();
  });
});
