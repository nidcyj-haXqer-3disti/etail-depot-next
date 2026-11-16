import type { BlogArticle } from "./content";

/** Archive G0851, adapted with accrual, invoice and recordkeeping guidance. */
export const accruedPayableArticle: BlogArticle = {
  path: "/company/blog/accrued-expenses-vs-accounts-payable",
  title: "Accrued expenses vs. accounts payable",
  description: "An accrued expense records a cost already incurred when the bill has not arrived or the amount still needs estimating. Accounts payable usually tracks supplier bills that remain unpaid. Under accrual accounting, both can represent an obligation to pay. The practical difference is the evidence available and how you move from an estimate to a verified bill without counting the expense twice.",
  summary: "Understand the difference between accrued expenses and accounts payable, connect an estimate to the later invoice, and avoid counting the same cost twice.",
  searchTitle: "Accrued expenses vs. accounts payable: what changes when the bill arrives",
  relatedPaths: ["/company/blog/accounts-payable-journal-entry", "/company/blog/accounting-reconciliation"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "recognition-and-evidence", title: "Separate the service period from the invoice date" },
    { id: "accrual-to-invoice", title: "Connect the estimate to the later bill" },
    { id: "review-the-schedule", title: "Keep a record you can clear" },
  ],
  sources: [
    { label: "BILL: Accrued expenses and accounts payable", href: "https://www.bill.com/learning/accrued-expenses-vs-accounts-payable" },
    { label: "OpenStax: Accruals and adjusting entries", href: "https://openstax.org/books/principles-financial-accounting/pages/4-2-discuss-the-adjustment-process-and-illustrate-common-types-of-adjusting-entries" },
    { label: "OpenStax: Reversing entries in the accounting cycle", href: "https://openstax.org/books/principles-financial-accounting/pages/5-4-appendix-complete-a-comprehensive-accounting-cycle-for-a-business" },
    { label: "IRS: Publication 583, supporting records and bookkeeping", href: "https://www.irs.gov/publications/p583" },
  ],
};
