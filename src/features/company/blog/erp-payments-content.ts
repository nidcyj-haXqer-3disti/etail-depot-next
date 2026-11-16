import type { BlogArticle } from "./content";

/** Archive G1858, adapted around preserving payment meaning in the merchant's books. */
export const erpPaymentsArticle: BlogArticle = {
  path: "/company/blog/erp-payment-system-integration",
  title: "Your ERP needs more than the bank deposit",
  description: "ERP payment integration should connect customer payments, fees and payouts without leaving false invoice balances or counting the same money twice.",
  summary: "An import can finish successfully while the books tell the wrong story. Keep the customer payment, provider deductions and bank deposit connected but distinct.",
  searchTitle: "ERP payment integration: receipts, fees and deposits",
  relatedPaths: ["/company/blog/crm-payment-processing", "/company/blog/transaction-details-reports"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Microsoft: Applying payments and reconciling bank entries", href: "https://learn.microsoft.com/en-us/dynamics365/business-central/receivables-how-reconcile-payments-auto-application" },
    { label: "Oracle: Applying receipts across open invoices", href: "https://docs.oracle.com/en/cloud/saas/financials/26a/faofc/guidelines-for-applying-receipts-and-on-account-credit-memos.html" },
    { label: "Stripe: Payout composition and reporting limits", href: "https://docs.stripe.com/reports/payout-reconciliation" },
  ],
};
