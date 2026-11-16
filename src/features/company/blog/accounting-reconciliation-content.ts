import type { BlogArticle } from "./content";

/** Archive G0841, adapted with accounting reconciliation and recordkeeping guidance. */
export const accountingReconciliationArticle: BlogArticle = {
  path: "/company/blog/accounting-reconciliation",
  title: "Accounting reconciliation: investigating a balance difference",
  description: "Accounting reconciliation compares a recorded balance with supporting records and explains the differences. The aim is a balance you can support, with reviewed corrections and clear follow-up for outstanding items. Making two totals equal with an unexplained adjustment does not complete the job.",
  summary: "Learn how to investigate an accounting balance difference, separate report errors from bookkeeping corrections and keep unresolved items visible.",
  searchTitle: "Accounting reconciliation: investigating balance differences",
  relatedPaths: ["/company/blog/accounting-ledgers", "/company/blog/accounts-payable-vs-accounts-receivable"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "set-the-boundary", title: "Define what you are comparing" },
    { id: "work-the-difference", title: "Separate explanation from correction" },
    { id: "resolve-and-retain", title: "Keep the evidence and open work together" },
  ],
  sources: [
    { label: "ICAN: Financial Accounting, control account reconciliations, pages 258 and 259", href: "https://icanig.org/nacitest/assets/docs/pro-study-texts-2021/FA.pdf" },
    { label: "IRS: Supporting business records", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
    { label: "Stripe: Accounting reconciliation and review practices", href: "https://stripe.com/resources/more/accounting-reconciliation-101" },
  ],
};
