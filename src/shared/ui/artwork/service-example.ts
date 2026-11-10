/** Fixed presentation specimen; never a live merchant or transaction record. */
export const serviceExample = {
  business: "Your business",
  orderReference: "#10482",
  description: "Designer sneaker",
  businessCategory: "Footwear",
  amountCents: 10000,
  currency: "USD",
  customer: "Alex Morgan",
  customerEmail: "alex.morgan@example.com",
  productDetail: "Chalk / Teal · US 9 · Qty 1",
  paymentReference: "PAY10482",
  authorizationCode: "062481",
  requestReference: "REQ10482",
  processingFeeCents: 320,
  netAmountCents: 9680,
} as const;
