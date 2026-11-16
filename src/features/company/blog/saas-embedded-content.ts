import type { BlogArticle } from "./content";

/** Archive G1901, adapted around the merchant value of payments within SaaS. */
export const saasEmbeddedArticle: BlogArticle = {
  path: "/company/blog/embedded-payments-for-saas-platforms",
  title: "Embedded payments should earn their place in your software",
  description: "For a SaaS platform, embedded payments should help merchants collect money and finish their work. Evaluate the account relationship, customer experience and support behind the feature.",
  summary: "Your software already holds the job, booking or invoice. A useful payment connection carries that context through collection, refunds and the merchant’s next working day.",
  searchTitle: "Embedded payments for SaaS platforms: merchant value first",
  relatedPaths: ["/company/blog/saas-payment-processing", "/company/blog/embedded-payments-for-online-marketplaces"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Unified Checkout enablement and integration", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/get-started/" },
    { label: "Cybersource: Payment results delivered independently of the browser", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/reference/webhooks/webhooks/" },
    { label: "Cybersource: Checkout isolation and integration security", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/configuration/security-recommendations/security-recommendations/" },
    { label: "PCI Security Standards Council: Embedded payment forms and script security", href: "https://www.pcisecuritystandards.org/faqs/1588/" },
  ],
};
