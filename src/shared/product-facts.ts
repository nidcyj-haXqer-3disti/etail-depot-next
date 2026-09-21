/** Operator-selected public offer. This is not a processor configuration or card agreement. */
export const productFacts = {
  version: "2026-09-21.7",
  currency: "USD",
  payments: {
    cardRateLabel: "2.9% + 30¢",
    cardRateBasisPoints: 290,
    cardFixedFeeCents: 30,
    saleRecordsRateLabel: "0.4%",
    saleRecordsRateBasisPoints: 40,
    monthlyFeeDollars: 0,
    setupFeeDollars: 0,
    internationalRateLabel: "1.5%",
    conversionRateLabel: "1%",
    manualEntryRateLabel: "0.5%",
    disputeFeeDollars: 15,
    disputeResponseFeeDollars: 15,
    scope: "US businesses · USD · domestic online card payments",
  },
  cards: {
    minimumDepositDollars: 200,
    annualFeeDollars: 0,
    monthlyFeeDollars: 0,
    repayment: "Pay in full each month",
  },
} as const;

/** Provenance stays available for content review; no provider capability is inferred from a benchmark. */
export const productFactEvidence = {
  approvedBy: "Etail Depot operator, D132 pricing, D137 optional-service pricing, D138 live integration approval and D147 customer-facing fee language",
  reviewedOn: "2026-09-21",
  payments: {
    source: ["https://stripe.com/pricing"],
    approval: "D132 selects Stripe US standard processing. D137 sets a 0.4% Trolleys service fee on eligible enrolled successful-payment volume. D138 names the service Dispute readiness and records the operator's confirmation that the Order Insight integration is live and approved. D147 removes vendor-charge line items and sourcing language from the public offer. Only displayed processing and service fees are calculated; applicable account charges remain governed by the disclosed service agreement. This editorial change does not establish an all-inclusive price or waive unverified upstream costs.",
    processingConfigurationIndependentlyVerified: false,
    orderInsight: {
      status: "Live and approved",
      evidence: "Operator confirmation: Integration is live and approved.",
      independentlyTested: false,
    },
    unresolved: ["Program eligibility and restricted industries", "Payout timing and reserves", "Merchant-specific enrollment and transaction coverage", "Vendor quote, billing basis and applicable charges", "Dispute readiness fee lifecycle and refund terms", "Optional services and network charges"],
  },
  cards: {
    source: "Operator explicitly selected $200 minimum deposit, $0 annual/monthly fee and full monthly repayment.",
    issuerAgreementVerified: false,
    unresolved: ["Eligibility", "Credit limit and deposit relationship", "Deposit custody and return", "Other charges", "Issuer agreement"],
  },
} as const;

export const saleRecordsOffer = {
  name: "Dispute readiness",
  availability: "Available",
  rateLabel: productFacts.payments.saleRecordsRateLabel,
  rateBasisPoints: productFacts.payments.saleRecordsRateBasisPoints,
  feeBasis: "of the amount of eligible, successful payments enrolled in the service",
  description: "Help customers recognize purchases and prevent eligible fraud disputes.",
  integration: "Live Order Insight integration for supported purchase details and eligible fraud-dispute deflection.",
} as const;
