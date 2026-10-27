import { describe, expect, it } from "vitest";
import { estimateDomesticCardFee } from "../../src/modules/public-site/fee-estimate";

describe("domestic online card fee estimate", () => {
  it.each([
    { amount: "100.00", amountCents: 10000, percentageCents: 290, fixedCents: 30, processingCents: 320, subtotalCents: 9680 },
    { amount: "1", amountCents: 100, percentageCents: 3, fixedCents: 30, processingCents: 33, subtotalCents: 67 },
    { amount: "4.99", amountCents: 499, percentageCents: 14, fixedCents: 30, processingCents: 44, subtotalCents: 455 },
    { amount: "5", amountCents: 500, percentageCents: 15, fixedCents: 30, processingCents: 45, subtotalCents: 455 },
    { amount: " 9.99 ", amountCents: 999, percentageCents: 29, fixedCents: 30, processingCents: 59, subtotalCents: 940 },
    { amount: "480", amountCents: 48000, percentageCents: 1392, fixedCents: 30, processingCents: 1422, subtotalCents: 46578 },
    { amount: "100000", amountCents: 10000000, percentageCents: 290000, fixedCents: 30, processingCents: 290030, subtotalCents: 9709970 },
  ])("calculates and reconciles each component for $amount", ({ amount, ...expected }) => {
    const estimate = estimateDomesticCardFee(amount);
    expect(estimate).toEqual(expected);
    expect(estimate!.percentageCents + estimate!.fixedCents).toBe(estimate!.processingCents);
    expect(estimate!.processingCents + estimate!.subtotalCents).toBe(estimate!.amountCents);
    expect(Object.values(estimate!).every(Number.isSafeInteger)).toBe(true);
  });

  it.each(["", "0", "0.99", "-100", "1.001", "1e3", "NaN", "1,000", "100000.01", "99999999", "$100"])("rejects invalid or unsupported amount %s", input => {
    expect(estimateDomesticCardFee(input)).toBeNull();
  });
});
