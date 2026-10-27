import { productFacts } from "@/shared/product-facts";

/** One domestic online card payment, calculated in cents with half-up rounding. */
export function estimateDomesticCardFee(amount: string) {
  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(amount.trim())) return null;
  const [dollars, fraction = ""] = amount.trim().split(".");
  const amountCents = Number(dollars) * 100 + Number(fraction.padEnd(2, "0"));
  if (amountCents < 100 || amountCents > 10_000_000) return null;
  const { cardRateBasisPoints, cardFixedFeeCents } = productFacts.payments;
  const percentageCents = Math.floor((amountCents * cardRateBasisPoints + 5000) / 10_000);
  const processingCents = percentageCents + cardFixedFeeCents;
  return {
    amountCents,
    percentageCents,
    fixedCents: cardFixedFeeCents,
    processingCents,
    subtotalCents: amountCents - processingCents,
  };
}

export function formatUsdCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
