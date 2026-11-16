import type { BlogArticle } from "./content";

/** Archive G1061, adapted around duplicate cash records and a defensible period total. */
export const netCashFlowArticle: BlogArticle = {
  path: "/company/blog/calculate-net-cash-flow",
  title: "Net cash flow: stop counting the same money twice",
  description: "One customer payment can appear in a sales report, a payout report and a bank statement. To understand what happened to your cash, follow the money instead of adding up the reports.",
  summary: "Calculate net cash flow without double counting transfers or payouts. Learn why the closing balance, profit and cash available to spend tell different stories.",
  searchTitle: "How to calculate net cash flow without double counting",
  relatedPaths: ["/company/blog/cash-flow-statement", "/company/blog/payment-settlement-and-payouts"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "one-payment", title: "One payment can appear in three reports" },
    { id: "explain-the-balance", title: "Make the result explain the balance" },
  ],
  sources: [
    { label: "SEC: Cash movements and the opening to closing balance", href: "https://www.sec.gov/files/cash-flow-statement-bblocks.pdf" },
    { label: "IFRS Foundation: Cash, cash equivalents and cash flow reporting", href: "https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/" },
    { label: "Stripe: How payout reports connect transactions, fees and bank payouts", href: "https://docs.stripe.com/reports/payout-reconciliation" },
  ],
};
