import type { BlogArticle } from "./content";

/** Archive G0518, adapted around cumulative receipt allocation when supplier orders arrive in parts. */
export const invoiceReconciliationArticle: BlogArticle = {
  path: "/company/blog/invoice-reconciliation",
  title: "When the same delivery gets counted twice",
  description: "Invoice reconciliation for partial deliveries needs more than matching totals. Track which received quantities each invoice uses before approving supplier payment.",
  summary: "Two legitimate invoices can still be matched to the wrong delivery quantities. The missing record is what earlier invoices have already used.",
  searchTitle: "Invoice reconciliation for partial deliveries",
  relatedPaths: ["/company/blog/types-of-invoice-discrepancies", "/company/blog/an-accounts-payable-internal-controls-checklist"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Microsoft: Invoice prices, selected receipts and matching tolerances", href: "https://learn.microsoft.com/en-us/dynamics365/finance/accounts-payable/accounts-payable-invoice-matching" },
    { label: "Oracle: Matching invoice lines and partial shipments", href: "https://docs.oracle.com/en/cloud/saas/financials/25d/fappp/matching-invoice-lines.html" },
    { label: "Oracle: Receipt and inspection requirements for payment approval", href: "https://docs.oracle.com/en/cloud/saas/procurement/26b/oapro/match-approval-level-options.html" },
  ],
};
