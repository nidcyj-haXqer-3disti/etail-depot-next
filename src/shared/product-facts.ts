/** Operator-selected public offer. This is not a processor configuration or card agreement. */
export const productFacts = {
  version: "2026-10-14.1",
  currency: "USD",
  payments: {
    offerName: "Trolleys Two Step",
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
    disputeFeeDollars: 35,
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
  approvedBy: "Etail Depot operator, D132 card and additional-payment pricing, D137 optional-service pricing, D138 live integration approval, D147 customer-facing fee language, D154 commercial presentation, D158 Two Step packaging, D159 base pricing, D191 merchant-entry fee scope and D193 dispute pricing",
  reviewedOn: "2026-10-14",
  payments: {
    source: ["https://stripe.com/pricing"],
    approval: "D159 sets the operator-selected Trolleys Two Step rate to 2.9% + 30 cents per successful domestic online card payment, preserving D158's no monthly fee and included creation/sharing. No separate 0.1% charge or membership is added. D193 replaces D132's dispute-received fee with $35 per dispute; the other selected fees remain. D137 sets a separate optional 0.4% Trolleys service fee on eligible enrolled successful-payment volume. D138 records the operator's confirmation that the Order Insight integration is live and approved. D154 names that service Trolleys Clarity without changing its price or coverage. D147 removes vendor-charge line items and sourcing language from the public offer. Only displayed base and service fees are calculated; applicable account charges remain governed by the disclosed service agreement. Public offer approval does not configure provider billing or waive unverified upstream costs.",
    disputeFeeApproval: "D193 sets the fee for each dispute received to $35. The separate manual dispute response fee and its existing return-on-win condition are unchanged.",
    manualEntryScopeApproval: "D191 confirms the additional 0.5% applies to merchant-entered card details, not customer-entered online checkout.",
    processingConfigurationIndependentlyVerified: false,
    orderInsight: {
      status: "Live and approved",
      evidence: "Operator confirmation: Integration is live and approved.",
      independentlyTested: false,
    },
    unresolved: ["Program eligibility and restricted industries", "Payout timing and reserves", "Merchant-specific enrollment and transaction coverage", "Vendor quote, billing basis and applicable charges", "Clarity fee lifecycle and refund terms", "Optional services and network charges"],
  },
  cards: {
    source: "Operator explicitly selected $200 minimum deposit, $0 annual/monthly fee and full monthly repayment.",
    issuerAgreementVerified: false,
    unresolved: ["Eligibility", "Credit limit and deposit relationship", "Deposit custody and return", "Other charges", "Issuer agreement"],
  },
} as const;

export const saleRecordsOffer = {
  name: "Clarity",
  brandName: "Trolleys Clarity",
  availability: "Available",
  rateLabel: productFacts.payments.saleRecordsRateLabel,
  rateBasisPoints: productFacts.payments.saleRecordsRateBasisPoints,
  feeBasis: "of the amount of eligible, successful payments enrolled in the service",
  description: "Help customers recognize purchases and prevent eligible fraud disputes.",
  integration: "Live Order Insight integration for supported purchase details and eligible fraud-dispute deflection.",
} as const;
