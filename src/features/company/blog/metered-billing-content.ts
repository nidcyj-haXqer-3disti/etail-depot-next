import type { BlogArticle } from "./content";

/** Archive G0534, adapted around explaining disputed usage and correcting the resulting bill. */
export const meteredBillingArticle: BlogArticle = {
  path: "/company/blog/metered-billing",
  title: "Metered billing: can you explain the extra usage?",
  description: "Metered billing turns measured use into charges. The harder job is tracing a questioned total, handling late records and correcting the bill customers received.",
  summary: "Finance has the invoice. Support has a usage total. Engineering has the logs. A questioned charge needs an explanation that connects all three.",
  searchTitle: "Metered billing: usage, late records and corrections",
  relatedPaths: ["/company/blog/billing-models", "/company/blog/saas-payment-processing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Usage records, duplicate protection and processing delays", href: "https://docs.stripe.com/billing/subscriptions/usage-based/recording-usage-api" },
    { label: "Stripe: Invoice finalization and late usage", href: "https://docs.stripe.com/billing/subscriptions/usage-based/configure-grace-period" },
    { label: "Orb: Correcting historical usage and the effect on invoices", href: "https://support.withorb.com/articles/6875466034-understanding-and-optimizing-backfill-operations" },
  ],
};
