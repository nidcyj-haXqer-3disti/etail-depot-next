import type { BlogArticle } from "./content";

/** Archive G1886, adapted around merchant control of uncertain payment attempts. */
export const paymentRetriesArticle: BlogArticle = {
  path: "/company/blog/payment-api-retries",
  title: "Why “try again” can become a second charge",
  description: "A timeout leaves a payment unanswered, not necessarily unpaid. Etail’s integration guidance starts with the original attempt before another charge, capture or refund.",
  summary: "A disabled Pay button cannot control every retry behind checkout. Your integration needs to remember which payment it is trying to complete.",
  searchTitle: "Payment retries and idempotency: avoid duplicate charges",
  relatedPaths: ["/company/blog/consuming-webhooks", "/company/blog/credit-card-declines"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Transaction timeout guidance and recovery limits", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/ctv/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "IETF: HTTP idempotency and automatic retries", href: "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2" },
    { label: "Stripe: Idempotency keys, parameters and retention", href: "https://docs.stripe.com/api/idempotent_requests" },
    { label: "Stripe: Network errors and uncertain payment outcomes", href: "https://docs.stripe.com/error-low-level" },
  ],
};
