import type { BlogArticle } from "./content";

/** Unpublished archive G0142, adapted around the gap between an estimate and a business deadline. */
export const transferTimingArticle: BlogArticle = {
  path: "/company/blog/how-long-do-cross-border-payments-take",
  title: "Two business days. Starting when?",
  description: "Cross-border payment timing depends on when processing starts, bank calendars and recipient credit. Check the estimate before promising a supplier a payment date.",
  summary: "A supplier is holding your production slot. Your transfer says two business days. Before you promise Tuesday, find out which event starts that clock.",
  searchTitle: "How long do cross-border payments take? Cutoffs and arrival dates",
  relatedPaths: ["/company/blog/cross-border-payouts", "/company/blog/b2b-cross-border-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Bank of America: International wire timing and receiving-bank delays", href: "https://info.bankofamerica.com/en/digital-banking/wire-transfers" },
    { label: "Bank of America: Transfer cutoffs and scheduled availability", href: "https://www.bankofamerica.com/help/cutoff-times/" },
    { label: "Wise: Funding, checks, holidays and transfer estimates", href: "https://wise.com/help/articles/2977951/why-is-my-transfer-taking-longer-than-the-estimate" },
  ],
};
