/** Fixed presentation specimen; never a live merchant or transaction record. */
export const serviceExample = {
  business: "Your business",
  orderReference: "#10482",
  description: "Designer sneaker",
  businessCategory: "Footwear",
  amountCents: 10000,
  currency: "USD",
  processingFeeCents: 320,
  netAmountCents: 9680,
} as const;
