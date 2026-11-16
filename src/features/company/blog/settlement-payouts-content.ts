import type { BlogArticle } from "./content";

/** Archive G0150, adapted with current settlement, payout and reporting guidance. */
export const settlementPayoutsArticle: BlogArticle = {
  path: "/company/blog/payment-settlement-and-payouts",
  title: "Payment settlement and payouts: when does the money arrive?",
  description: "A customer’s payment can be approved before the money reaches your bank. Settlement, payout scheduling and bank processing are separate steps. Understanding each one helps you plan your cash flow and investigate a missing deposit.",
  summary: "Understand settlement and payout timing, explain the amount deposited and learn what to check when a merchant payout has not arrived.",
  searchTitle: "Payment settlement and payouts: timing and bank deposits",
  relatedPaths: ["/company/blog/how-batch-payment-processing-works", "/company/blog/card-authorization"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "payment-stages", title: "Separate the payment from the payout" },
    { id: "payout-timing", title: "Know when the timing starts" },
    { id: "payout-amount", title: "Explain the amount you receive" },
    { id: "reserves", title: "Keep reserves separate from fees" },
    { id: "missing-deposit", title: "Find the last confirmed stage" },
  ],
  sources: [
    { label: "Cybersource: Capture processing and reconciliation", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/gpn/rest/payments/payments-intro/payments-services-intro/payments-intro-processing-capture.html" },
    { label: "Stripe: Payout schedules, settlement timing and failures", href: "https://docs.stripe.com/payouts" },
    { label: "Adyen: Payout processing and missing deposits", href: "https://docs.adyen.com/account/getting-paid" },
    { label: "Adyen: Settlement details and payout references", href: "https://docs.adyen.com/reporting/settlement-reconciliation/transaction-level/settlement-details-report/" },
    { label: "Adyen: Withheld funds and deposit requirements", href: "https://docs.adyen.com/account/balances/deposit/" },
  ],
};
