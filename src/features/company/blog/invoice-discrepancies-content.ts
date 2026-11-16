import type { BlogArticle } from "./content";

/** Archive G0374, adapted around resolving the disagreement behind an invoice mismatch. */
export const invoiceDiscrepanciesArticle: BlogArticle = {
  path: "/company/blog/types-of-invoice-discrepancies",
  title: "A correct total can still be the wrong invoice",
  description: "Invoice discrepancies can involve prices, quantities, payments or missing records. Find the mismatch, agree the correction and keep both sides working from the same balance.",
  summary: "The arithmetic may be right while the bill is wrong. Trace the difference to the agreement, delivery or payment before changing what anyone owes.",
  searchTitle: "Invoice discrepancies: types and how to resolve them",
  relatedPaths: ["/company/blog/important-invoice-management-tips", "/company/blog/accounts-payable-vs-accounts-receivable"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "BILL: Invoice discrepancies and their causes", href: "https://www.bill.com/blog/how-to-resolve-invoice-discrepancies" },
    { label: "Microsoft: Matching invoice prices and received quantities", href: "https://learn.microsoft.com/en-us/dynamics365/finance/accounts-payable/accounts-payable-invoice-matching" },
    { label: "Stripe: Credit notes, invoice balances and refunds", href: "https://docs.stripe.com/invoicing/dashboard/credit-notes" },
    { label: "IRS: Records supporting business transactions", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
    { label: "FBI IC3: Verifying changed payment instructions", href: "https://www.ic3.gov/CrimeInfo/BEC" },
  ],
};
