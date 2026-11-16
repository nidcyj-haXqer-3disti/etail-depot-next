import type { BlogArticle } from "./content";

/** Archive G1006, adapted around diagnosing profit changes before cutting costs. */
export const grossNetProfitArticle: BlogArticle = {
  path: "/company/blog/gross-vs-net-profit",
  title: "Gross profit vs. net profit: what growth still has to pay for",
  description: "Sales can grow while the business earns less. Finding where profit changed helps you decide whether to revisit prices, operating costs or the cost of borrowing.",
  summary: "Understand gross profit vs. net profit, locate what changed between them, and distinguish recurring costs from temporary spending before making cuts.",
  searchTitle: "Gross profit vs. net profit: what growth still has to pay for",
  relatedPaths: ["/company/blog/gross-profit", "/company/blog/cash-flow-statement"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "find-the-change", title: "Find the change before choosing the cut" },
    { id: "repeatable-profit", title: "Decide what the next month can repeat" },
  ],
  sources: [
    { label: "SEC: How an income statement measures profit", href: "https://www.sec.gov/files/income-statement-building-blocks.pdf" },
    { label: "SEC: Reading income statements alongside cash flow", href: "https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements" },
    { label: "SEC: Recurring costs and consistent adjustments in public company reporting", href: "https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-interpretations/non-gaap-financial-measures" },
  ],
};
