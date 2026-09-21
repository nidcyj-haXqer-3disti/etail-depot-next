import { productFacts } from "@/shared/product-facts";

/** Local illustration only. Exact cents with separate half-up rounding for each published fee. */
export function estimateDomesticCardFee(amount: string, saleRecords = false) {
  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(amount.trim())) return null;
  const [dollars, fraction = ""] = amount.trim().split(".");
  const amountCents = Number(dollars) * 100 + Number(fraction.padEnd(2, "0"));
  if (amountCents < 100 || amountCents > 10_000_000) return null;
  const { cardRateBasisPoints, cardFixedFeeCents, saleRecordsRateBasisPoints } = productFacts.payments;
  const processingCents = Math.floor((amountCents * cardRateBasisPoints + 5000) / 10_000) + cardFixedFeeCents;
  const serviceCents = saleRecords ? Math.floor((amountCents * saleRecordsRateBasisPoints + 5000) / 10_000) : 0;
  return {
    amountCents,
    processingCents,
    serviceCents,
    subtotalCents: amountCents - processingCents - serviceCents,
    vendorFeeUnknown: saleRecords,
  };
}

export function formatUsdCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
