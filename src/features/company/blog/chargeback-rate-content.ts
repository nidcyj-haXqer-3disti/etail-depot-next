import type { BlogArticle } from "./content";

/** Unpublished archive G0775, adapted around the business decisions behind a chargeback ratio. */
export const chargebackRateArticle: BlogArticle = {
  path: "/company/blog/average-chargeback-rate",
  title: "The chargeback rate improved. The problem may not have.",
  description: "A lower chargeback rate can reflect more sales rather than fewer disputes. Understand the counts, timing and account rules before deciding what the number means.",
  summary: "Growth can make a ratio look healthier while the same complaints keep arriving. Read the numbers closely enough to know whether the customer problem actually changed.",
  searchTitle: "Average chargeback rates: what the number really tells you",
  relatedPaths: ["/company/blog/payment-analytics", "/company/blog/chargeback-representment"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Dispute activity, payment dates and outcomes", href: "https://docs.stripe.com/disputes/measuring" },
    { label: "Stripe: Dispute analytics, reporting windows and filters", href: "https://docs.stripe.com/payments/analytics/disputes" },
    { label: "Visa: Acquirer Monitoring Program metrics and conditions", href: "https://corporate.visa.com/content/dam/VCOM/corporate/visa-perspectives/security-and-trust/documents/visa-acquirer-monitoring-program-fact-sheet-2025.pdf" },
    { label: "Etail Depot: Merchant dispute responsibilities", href: "/company/legal/merchant-services" },
  ],
};
