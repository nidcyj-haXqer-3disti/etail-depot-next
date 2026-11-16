import type { BlogArticle } from "./content";

/** Archive G1059, adapted around funding the time between orders and usable cash. */
export const workingCapitalArticle: BlogArticle = {
  path: "/company/blog/calculate-working-capital",
  title: "Working capital: why more orders can mean less cash",
  description: "Growing demand can tie up money in stock and unpaid invoices. A positive working capital balance does not tell you whether that money will arrive before the bills.",
  summary: "Learn how to calculate working capital and why growing inventory, unpaid invoices and payment timing can leave a busy business short of cash.",
  searchTitle: "Working capital: why more orders can mean less cash",
  relatedPaths: ["/company/blog/accounts-payable-vs-accounts-receivable", "/company/blog/cash-flow-statement"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "SEC: Working capital and balance sheet classifications", href: "https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements" },
    { label: "ACCA: Working capital, growth and the cash operating cycle", href: "https://www.accaglobal.com/gb/en/student/exam-support-resources/fundamentals-exams-study-resources/f9/technical-articles/wcm.html" },
    { label: "BDC: Why inventory and collection speed matter alongside the ratio", href: "https://www.bdc.ca/en/articles-tools/money-finance/manage-finances/using-working-capital-ratio" },
  ],
};
