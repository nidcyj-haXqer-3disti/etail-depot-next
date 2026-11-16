import type { BlogArticle } from "./content";

/** Archive G0927, adapted with inventory and expense classification guidance. */
export const cogsExpensesArticle: BlogArticle = {
  path: "/company/blog/cogs-vs-operating-expenses",
  title: "Cost of goods sold vs. operating expenses",
  description: "Cost of goods sold is the cost assigned to goods sold during the period. Operating expenses cover other costs of running the business, such as selling and administration. Separating them helps explain profit, but the distinction is not the same as variable versus fixed costs.",
  summary: "Understand how cost of goods sold and operating expenses affect gross and operating profit, and why inventory purchases are not always an immediate expense.",
  searchTitle: "Cost of goods sold vs. operating expenses",
  relatedPaths: ["/company/blog/profit-and-loss-statement", "/company/blog/cash-vs-accrual-accounting"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "cost-follows-purpose", title: "Start with what the cost is for" },
    { id: "classification-effect", title: "See what changes in the profit statement" },
    { id: "inventory-and-records", title: "Follow inventory through to the sale" },
  ],
  sources: [
    { label: "IFRS Foundation: IAS 2, inventory costs and expense recognition", href: "https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/" },
    { label: "IRS: Publication 334, cost of goods sold", href: "https://www.irs.gov/publications/p334" },
    { label: "SEC: Reading an income statement", href: "https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements" },
  ],
};
