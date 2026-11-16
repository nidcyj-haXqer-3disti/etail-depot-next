import type { BlogArticle } from "./content";

/** Archive G1234, adapted with financial statement and accounting guidance. */
export const profitLossArticle: BlogArticle = {
  path: "/company/blog/profit-and-loss-statement",
  title: "What is a profit and loss statement?",
  description: "Sales can rise while profit falls. A profit and loss statement, also called an income statement, helps explain why by showing revenue, costs and expenses over a period. Read its dates and accounting basis first, then follow where the result changes.",
  summary: "Understand a profit and loss statement, from net sales to net profit. Learn which records support it and why reported profit differs from cash in the bank.",
  searchTitle: "What is a profit and loss statement? P&L explained",
  relatedPaths: ["/company/blog/transaction-details-reports", "/company/blog/payment-analytics"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "main-parts", title: "Start with the period and accounting basis" },
    { id: "statement-lines", title: "Follow revenue down to net profit" },
    { id: "prepare", title: "Prepare the figures from your records" },
    { id: "profit-cash", title: "Check cash separately" },
    { id: "read-it", title: "Find what changed the result" },
  ],
  sources: [
    { label: "SEC: Income statements, balance sheets and cash flow", href: "https://www.sec.gov/about/reports-publications/investorpubsbegfinstmtguide" },
    { label: "BILL: Profit and loss statement structure", href: "https://www.bill.com/learning/profit-loss-statement" },
    { label: "IRS: Accounting periods and methods", href: "https://www.irs.gov/publications/p538" },
    { label: "IRS: Records supporting business income and expenses", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
  ],
};
