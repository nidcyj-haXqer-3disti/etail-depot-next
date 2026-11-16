import type { BlogArticle } from "./content";

/** Archive G1004, adapted around the decisions hidden by a margin percentage. */
export const grossProfitArticle: BlogArticle = {
  path: "/company/blog/gross-profit",
  title: "Gross profit: when a better margin hides a worse month",
  description: "A higher margin looks like progress. If it rose because customers stopped buying a lower margin product, there may be less gross profit left to run the business.",
  summary: "Learn how to calculate gross profit and margin, why margin differs from markup, and how a higher percentage can conceal falling gross profit.",
  searchTitle: "Gross profit: when a better margin hides a worse month",
  relatedPaths: ["/company/blog/cogs-vs-operating-expenses", "/company/blog/contribution-margin"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "SEC: Net revenue, cost of sales and gross profit", href: "https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements" },
    { label: "AccountingCoach: Gross margin and markup use different bases", href: "https://www.accountingcoach.com/blog/gross-margin-markup" },
    { label: "IFRS Foundation: Inventory costs and when they become an expense", href: "https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/" },
  ],
};
