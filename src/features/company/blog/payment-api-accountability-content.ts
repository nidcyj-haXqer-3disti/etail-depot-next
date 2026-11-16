import type { BlogArticle } from "./content";

/** Unpublished archive G1880, adapted around business accountability when a payment integration returns an uncertain result. */
export const paymentApiAccountabilityArticle: BlogArticle = {
  path: "/company/blog/cross-border-payment-apis",
  title: "Who answers when the payment API goes quiet?",
  description: "A cross-border payment API timeout can leave money moving while your screen says nothing. What businesses should ask about retries, payment status and support.",
  summary: "Finance sees no confirmation. The developer sees a timeout. The supplier wants an answer. An uncertain payment needs someone to bring those facts together.",
  searchTitle: "Cross-border payment APIs: timeouts, retries and support",
  relatedPaths: ["/company/blog/international-payment-gateways", "/company/blog/send-and-accept-international-business-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Transaction timeouts and status checks", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/fdiglobal/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Stripe: Idempotency and request retries", href: "https://docs.stripe.com/api/idempotent_requests" },
    { label: "Stripe: Duplicate notifications and event ordering", href: "https://docs.stripe.com/webhooks" },
    { label: "Wise Platform: Transfer statuses and returned payments", href: "https://docs.wise.com/guides/product/send-money/tracking/transfer-statuses" },
  ],
};
