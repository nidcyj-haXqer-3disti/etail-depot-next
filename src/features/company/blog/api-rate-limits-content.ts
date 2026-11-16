import type { BlogArticle } from "./content";

/** Archive G1978, adapted around the hidden API work behind merchant sales. */
export const apiRateLimitsArticle: BlogArticle = {
  path: "/company/blog/api-rate-limiting",
  title: "Why a quiet store can hit a payment API limit",
  description: "Payment API rate limits count more than sales. Understand how searches, background jobs and retries affect capacity, and how to prepare checkout for busy periods.",
  summary: "Your order count looks ordinary. Your payment connection is being asked to do far more. The difference matters before the next promotion goes live.",
  searchTitle: "Payment API rate limits: protect checkout during busy periods",
  relatedPaths: ["/company/blog/payment-apis", "/company/blog/payment-gateway-testing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "IETF: HTTP 429 and Retry-After", href: "https://www.rfc-editor.org/rfc/rfc6585.html#section-4" },
    { label: "Stripe: Request limits, concurrency and load testing", href: "https://docs.stripe.com/rate-limits" },
    { label: "Cybersource: Transaction search traffic and retry guidance", href: "https://developer.cybersource.com/docs/cybs/en-us/platform/relnote/all/na/rn-2026-09-18/rn-announce/trans-search-perform-update.html" },
    { label: "Cybersource: Resolving uncertain payment results", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/ctv/rest/payments/payments-intro/timeouts-intro.html" },
  ],
};
