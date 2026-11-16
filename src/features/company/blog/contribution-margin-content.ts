import type { BlogArticle } from "./content";

/** Archive G0935, adapted around the economics of discount-led growth. */
export const contributionMarginArticle: BlogArticle = {
  path: "/company/blog/contribution-margin",
  title: "Contribution margin: when more sales leave less profit",
  description: "A successful promotion should leave your business better off. Contribution margin helps you see whether the extra orders are worth what you gave up to win them.",
  summary: "Learn what contribution margin reveals about discounts, variable costs and sales growth, and why a busier business can still earn less operating profit.",
  searchTitle: "Contribution margin: when more sales leave less profit",
  relatedPaths: ["/company/blog/cogs-vs-operating-expenses", "/company/blog/profit-and-loss-statement"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "discount-volume", title: "Your discount has a volume target" },
    { id: "growth-worth-keeping", title: "Growth worth keeping" },
  ],
  sources: [
    { label: "OpenStax: Contribution margin and the costs it covers", href: "https://openstax.org/books/principles-managerial-accounting/pages/3-1-explain-contribution-margin-and-calculate-contribution-margin-per-unit-contribution-margin-ratio-and-total-contribution-margin" },
    { label: "OpenStax: How price and cost changes affect operating income", href: "https://openstax.org/books/principles-managerial-accounting/pages/3-3-perform-break-even-sensitivity-analysis-for-a-single-product-under-changing-business-situations" },
    { label: "ACCA: Sales volume, contribution and the limits of the calculation", href: "https://www.accaglobal.com/uk/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/CVP-analysis.html" },
  ],
};
