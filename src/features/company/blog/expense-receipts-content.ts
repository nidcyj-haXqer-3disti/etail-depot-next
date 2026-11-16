import type { BlogArticle } from "./content";

/** Archive G0974, adapted around preserving the context of business spending. */
export const expenseReceiptsArticle: BlogArticle = {
  path: "/company/blog/expense-receipts",
  title: "Expense receipts: the cost of relying on memory",
  description: "A clear receipt can still leave a legitimate expense waiting for approval. The missing piece is often the context nobody recorded when the purchase was made.",
  summary: "Expense receipts need context. Learn why payment evidence, business purpose and clear reimbursement records matter more than collecting another receipt image.",
  searchTitle: "Expense receipts: the cost of relying on memory",
  relatedPaths: ["/company/blog/credit-card-reconciliation", "/company/blog/an-accounts-payable-internal-controls-checklist"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "IRS: Supporting documents for business purchases and expenses", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
    { label: "IRS Publication 463: Timely records, business purpose and missing evidence", href: "https://www.irs.gov/publications/p463" },
    { label: "IRS Publication 583: Keeping and retrieving electronic records", href: "https://www.irs.gov/publications/p583" },
    { label: "IRS: How retention periods depend on the record", href: "https://www.irs.gov/businesses/small-businesses-self-employed/how-long-should-i-keep-records" },
  ],
};
