import type { BlogArticle } from "./content";

/** Archive G0991, adapted around cost commitments when demand changes. */
export const fixedVariableArticle: BlogArticle = {
  path: "/company/blog/fixed-vs-variable-expenses",
  title: "Fixed vs. variable expenses: what a quiet month reveals",
  description: "Fewer orders can reduce packing costs without reducing the rent. The difference matters when a cheaper rate asks you to commit to a busier business.",
  summary: "Fixed vs. variable expenses reveal how costs respond to demand. See why monthly minimums, contract terms and capacity matter when comparing lower rates.",
  searchTitle: "Fixed vs. variable expenses: what a quiet month reveals",
  relatedPaths: ["/company/blog/contribution-margin", "/company/blog/cash-flow-statement"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "price-of-commitment", title: "The price of a cheaper rate" },
    { id: "capacity-and-demand", title: "A busy month can change the bargain too" },
  ],
  sources: [
    { label: "OpenStax: Fixed, variable, mixed and step costs", href: "https://openstax.org/books/principles-managerial-accounting/pages/2-2-identify-and-apply-basic-cost-behavior-patterns" },
    { label: "Penn State: Why cost behavior depends on time and capacity", href: "https://courses.worldcampus.psu.edu/welcome/acctg340/001/content/02_lesson/printlesson.html" },
    { label: "ACCA: The limits of projecting costs from sales volume", href: "https://www.accaglobal.com/uk/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/CVP-analysis.html" },
  ],
};
