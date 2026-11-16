import type { BlogArticle } from "./content";

/** Archive G1969, adapted around the business case for another payment layer. */
export const orchestrationGatewayArticle: BlogArticle = {
  path: "/company/blog/payment-orchestration-vs-payment-gateway",
  title: "Do you need payment orchestration, or a better gateway setup?",
  description: "Compare payment orchestration with a gateway through the work your business needs: checkout, provider connections, support, records and total operating cost.",
  summary: "A longer list of payment connections can look like progress. The useful question is whether your customers and staff get something better from it.",
  searchTitle: "Payment orchestration vs. gateway: what your business needs",
  relatedPaths: ["/company/blog/use-multiple-payment-gateways", "/company/blog/payment-failover"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Gateway and orchestration roles", href: "https://stripe.com/resources/more/payment-orchestration-vs-payment-gateway" },
    { label: "Visa Acceptance Solutions: Processor connections and account requirements", href: "https://docs.visaacceptance.com/experience/merchant/payments/payments-enterprise/overview-payments/" },
    { label: "Stripe: Orchestration scope and processor responsibilities", href: "https://docs.stripe.com/payments/orchestration" },
    { label: "Stripe: Features supported through orchestration connections", href: "https://docs.stripe.com/payments/orchestration/feature-support" },
  ],
};
