import type { BlogArticle } from "./content";

/** Archive G0294, adapted with current report definitions and reconciliation guidance. */
export const transactionReportsArticle: BlogArticle = {
  path: "/company/blog/transaction-details-reports",
  title: "How to read a transaction details report",
  description: "Before adding the amounts in a transaction details report, establish what one row represents. It may be a payment, a payment operation or an accounting entry. That distinction determines which records belong together and which amounts can safely be totaled.",
  summary: "Read transaction reports by reference, status, date and currency. Compare merchant and gateway records, avoid double counting and investigate differences.",
  searchTitle: "How to read a transaction details report",
  relatedPaths: ["/company/blog/how-batch-payment-processing-works", "/company/blog/payment-settlement-and-payouts"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "identify-the-report", title: "Read the report definition first" },
    { id: "link-the-records", title: "Follow the references, not just the amount" },
    { id: "avoid-double-counting", title: "Check repeated rows before totaling" },
    { id: "investigate-a-difference", title: "Use the report to narrow the question" },
  ],
  sources: [
    { label: "Adyen: Settlement details report and field definitions", href: "https://docs.adyen.com/reporting/settlement-reconciliation/transaction-level/settlement-details-report" },
    { label: "Stripe: Balance summary report", href: "https://docs.stripe.com/reports/balance" },
    { label: "Stripe: Balance transaction types", href: "https://docs.stripe.com/reports/balance-transaction-types" },
    { label: "Etail Depot: Merchant and gateway reconciliation", href: "/services/reconciliation" },
    { label: "Etail Depot: Account records and support handoff", href: "/developers/developer-tools" },
  ],
};
