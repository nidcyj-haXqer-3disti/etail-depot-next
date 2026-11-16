import type { BlogArticle } from "./content";

/** Archive G1860, adapted around the merchant's case for payment routing. */
export const paymentRoutingArticle: BlogArticle = {
  path: "/company/blog/intelligent-payment-routing",
  title: "Intelligent payment routing has to earn its complexity",
  description: "Intelligent payment routing can change where a payment is processed. Judge it by completed sales, eligible accounts and the work left after checkout.",
  summary: "A better approval chart is only the beginning. Another payment route should solve a measurable business problem without leaving customers or your team to untangle the result.",
  searchTitle: "Intelligent payment routing: is another route worth it?",
  relatedPaths: ["/company/blog/evaluate-and-manage-multiple-payment-processors", "/company/blog/payment-api-retries"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Routing payments across processors", href: "https://docs.stripe.com/payments/orchestration/route-payments" },
    { label: "Stripe: Feature support across processing routes", href: "https://docs.stripe.com/payments/orchestration/feature-support" },
    { label: "Adyen: Routing choices and enablement requirements", href: "https://docs.adyen.com/partners/uplift-enablement" },
    { label: "Cybersource: Transaction timeout guidance", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/fdiglobal/rest/payments/payments-intro/timeouts-intro.html" },
  ],
};
