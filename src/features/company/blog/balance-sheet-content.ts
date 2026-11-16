import type { BlogArticle } from "./content";

/** Archive G1124, adapted with financial statement and recordkeeping guidance. */
export const balanceSheetArticle: BlogArticle = {
  path: "/company/blog/read-a-balance-sheet",
  title: "How to read a balance sheet",
  description: "A balance sheet shows a business’s recorded assets, what it owes and the owners’ remaining interest at a particular date. Its central relationship is assets = liabilities + equity. Start with the date and accounting policies, then look at what makes up each balance.",
  summary: "Learn how to read assets, liabilities and equity on a balance sheet, check the supporting records and distinguish working capital from available cash.",
  searchTitle: "How to read a balance sheet: assets, liabilities and equity",
  relatedPaths: ["/company/blog/profit-and-loss-statement", "/company/blog/transaction-details-reports"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "categories", title: "Read the three parts" },
    { id: "classifications", title: "Look at what makes up the totals" },
    { id: "cash", title: "Working capital is not all cash" },
    { id: "changes", title: "Follow what changes when a bill is paid" },
    { id: "review", title: "Check what supports the balances" },
  ],
  sources: [
    { label: "SEC: Balance sheets and the accounting equation", href: "https://www.sec.gov/about/reports-publications/investorpubsbegfinstmtguide" },
    { label: "BILL: Balance sheet structure and limitations", href: "https://www.bill.com/learning/balance-sheet" },
    { label: "IRS: Records supporting business transactions and assets", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
  ],
};
