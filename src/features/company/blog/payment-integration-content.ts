import type { BlogArticle } from "./content";

/** Archive G1904, adapted around the evidence behind payment product labels. */
export const paymentIntegrationArticle: BlogArticle = {
  path: "/company/blog/embedded-payments-vs-integrated-payments",
  title: "Embedded or integrated? Show me what changes.",
  description: "Compare embedded and integrated payments by the customer experience, connected records and merchant agreement. Know what your business is buying before switching.",
  summary: "A payment button can look perfectly at home in your software while leaving your staff to connect the records. Here is how to look beyond the product label.",
  searchTitle: "Embedded payments vs. integrated payments: what to compare",
  relatedPaths: ["/company/blog/embedded-payments-for-saas-platforms", "/company/blog/saas-payment-processing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: How one provider distinguishes embedded and integrated payments", href: "https://stripe.com/resources/more/difference-between-embedded-payments-and-integrated-payments" },
    { label: "Adyen: Hosted and API onboarding within a platform service", href: "https://docs.adyen.com/platforms/onboard-users/" },
    { label: "Cybersource: Unified Checkout account enablement and integration", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/get-started/" },
    { label: "PCI Security Standards Council: Payment forms, redirects and script security", href: "https://www.pcisecuritystandards.org/faqs/1588/" },
  ],
};
