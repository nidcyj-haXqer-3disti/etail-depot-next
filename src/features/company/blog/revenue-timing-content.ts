import type { BlogArticle } from "./content";

/** Archive G0853, adapted with revenue-recognition guidance. */
export const revenueTimingArticle: BlogArticle = {
  path: "/company/blog/accrued-revenue-vs-deferred-revenue",
  title: "Accrued revenue vs. deferred revenue",
  description: "A customer can pay before the work begins, or the business can finish work before it is paid. Those two sequences leave different amounts in the accounts. Accrued and deferred revenue help explain what has been earned, what is still owed and why the bank receipt cannot answer both questions.",
  summary: "Compare accrued and deferred revenue, separate delivery from billing and payment, and keep a clear record of what has been earned or is still owed.",
  searchTitle: "Accrued revenue vs. deferred revenue: timing and accounting",
  relatedPaths: ["/company/blog/accounts-payable-vs-accounts-receivable", "/company/blog/profit-and-loss-statement"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "three-dates", title: "Track delivery, billing and payment separately" },
    { id: "opposite-sequences", title: "Compare two payment sequences" },
    { id: "maintain-evidence", title: "Keep a schedule of what is earned and owed" },
  ],
  sources: [
    { label: "Stripe: Accrued revenue and deferred revenue", href: "https://stripe.com/resources/more/accrued-revenue-vs-deferred-revenue-what-businesses-need-to-know" },
    { label: "IFRS Foundation: IFRS 15 revenue recognition", href: "https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/" },
    { label: "FASB: Topic 606 revenue recognition implementation questions", href: "https://storage.fasb.org/Rev_Rec_Implementation_QAs.pdf" },
  ],
};
