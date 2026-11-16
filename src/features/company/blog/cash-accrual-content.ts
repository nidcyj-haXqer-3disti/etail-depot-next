import type { BlogArticle } from "./content";

/** Archive G0921, adapted with accounting-method and timing guidance. */
export const cashAccrualArticle: BlogArticle = {
  path: "/company/blog/cash-vs-accrual-accounting",
  title: "Cash vs. accrual accounting: what timing changes",
  description: "Cash and accrual accounting differ mainly in when they report income and expenses. A simplified cash basis follows receipts and payments. Accrual accounting follows earned revenue and incurred costs under the applicable rules. The same work can therefore produce different monthly results without changing when the customer pays or the business pays its bills.",
  summary: "Compare cash and accrual accounting through a service completed in April and paid in May. Understand timing differences and what to check before switching methods.",
  searchTitle: "Cash vs. accrual accounting: timing, records and method changes",
  relatedPaths: ["/company/blog/accrued-revenue-vs-deferred-revenue", "/company/blog/cash-flow-statement"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "timing-is-the-difference", title: "Separate reporting timing from payment timing" },
    { id: "compare-one-project", title: "Compare the same project across two months" },
    { id: "choose-with-purpose", title: "Review the requirements before switching" },
  ],
  sources: [
    { label: "Stripe: Cash and accrual accounting compared", href: "https://stripe.com/resources/more/cash-vs-accrual-accounting" },
    { label: "IRS: Publication 538, accounting periods and methods", href: "https://www.irs.gov/publications/p538" },
    { label: "IRS: Form 3115 instructions for accounting method changes", href: "https://www.irs.gov/instructions/i3115" },
  ],
};
