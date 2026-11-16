import type { BlogArticle } from "./content";

/** Archive G0385, adapted with payable, receivable and recordkeeping guidance. */
export const payablesReceivablesArticle: BlogArticle = {
  path: "/company/blog/accounts-payable-vs-accounts-receivable",
  title: "Accounts payable vs. accounts receivable",
  description: "Accounts payable is what your business owes suppliers for purchases on credit. Accounts receivable is what customers owe your business for credit sales. The same invoice can be a payable for the buyer and a receivable for the seller. Neither balance alone tells you how much cash is available today.",
  summary: "Understand accounts payable vs. accounts receivable, compare payment due dates, and check open invoices before using the balances to plan business cash flow.",
  searchTitle: "Accounts payable vs. accounts receivable: key differences",
  relatedPaths: ["/company/blog/read-a-balance-sheet", "/company/blog/profit-and-loss-statement"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "identify-the-side", title: "Start with your side of the transaction" },
    { id: "compare-dates", title: "Compare dates as well as totals" },
    { id: "review-open-items", title: "Review the balances before planning payments" },
  ],
  sources: [
    { label: "Stripe: Accounts payable and accounts receivable", href: "https://stripe.com/resources/more/accounts-payable-or-receivable-what-is-the-difference" },
    { label: "BILL: Payable and receivable workflows", href: "https://www.bill.com/learning/accounts-payable-vs-accounts-receivable" },
    { label: "IRS: Records supporting business transactions", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
  ],
};
