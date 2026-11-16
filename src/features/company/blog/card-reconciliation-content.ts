import type { BlogArticle } from "./content";

/** Archive G0943, adapted around the gaps a paid business card bill can conceal. */
export const cardReconciliationArticle: BlogArticle = {
  path: "/company/blog/credit-card-reconciliation",
  title: "Business credit card reconciliation: what autopay cannot fix",
  description: "Paying the balance settles a debt. It does not explain what your business bought, whether it was recorded twice or which credits are still missing.",
  summary: "Business credit card reconciliation catches what paying the bill cannot: duplicate expenses, missing purchase records, timing differences and unresolved credits.",
  searchTitle: "Business credit card reconciliation: beyond paying the bill",
  relatedPaths: ["/company/blog/accounting-reconciliation", "/company/blog/bank-reconciliation-statement"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "purchase-and-payment", title: "One purchase can appear more than once" },
    { id: "balance-and-evidence", title: "The balance can be right for the wrong reason" },
    { id: "unfinished-work", title: "Keep the unfinished work visible" },
  ],
  sources: [
    { label: "Intuit: Recording and matching credit card repayments", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/pay-bills/record-payments-credit-cards/L7IjpiWLZ_US_en_US" },
    { label: "Intuit: Reconciling bank and credit card statements", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/statement-reconciliation/reconcile-account-quickbooks-online/L3XzsllsK_US_en_US" },
    { label: "IRS: Records that support business purchases and expenses", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
    { label: "Intuit: Recording a supplier refund to a credit card", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/vendor-credits/enter-refund-vendor/L2y1KARni_US_en_US" },
  ],
};
