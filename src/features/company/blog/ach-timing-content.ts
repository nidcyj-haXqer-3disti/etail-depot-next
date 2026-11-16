import type { BlogArticle } from "./content";

/** Archive G0141, adapted with current ACH timing guidance. */
export const achTimingArticle: BlogArticle = {
  path: "/company/blog/how-long-do-ach-payments-take-to-process",
  title: "How long do ACH payments take?",
  description: "ACH credits can settle on the same banking day, the next banking day or in two banking days. That network timeline is not a promise of when a merchant receives a payout. Submission cutoffs, weekends, holidays and the provider’s funding arrangement determine the full wait.",
  summary: "Understand ACH settlement timing, bank cutoffs and merchant payouts, then use the last confirmed payment event to investigate a delay.",
  searchTitle: "How long do ACH payments take? Settlement and payout timing",
  relatedPaths: ["/company/blog/ach-payments", "/company/blog/ach-trace-number"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "payment-timeline", title: "Identify which stage you are waiting for" },
    { id: "find-delay", title: "Find the last confirmed event" },
    { id: "next-milestone", title: "Ask what happens next" },
  ],
  sources: [
    { label: "Nacha: ACH credit and debit settlement timing", href: "https://www.nacha.org/content/how-ach-payments-work" },
    { label: "Nacha: Effective dates, cutoffs and Same Day ACH", href: "https://achdevguide.nacha.org/ach-file-overview" },
    { label: "Nacha: Pending deposits and payment inquiries", href: "https://www.nacha.org/content/consumer-faqs-ach-payments" },
    { label: "Cybersource: eCheck validation and later returns", href: "https://developer.cybersource.com/docs/cybs/en-us/echeck/user/all/rest/echeck-user-guide/echeck-txnprocess-overview/echeck-txnprocess-settlement/echeck-txnprocess-returns.html" },
    { label: "Etail Depot: Merchant payout schedules and bank deposits", href: "/services/payouts" },
  ],
};
