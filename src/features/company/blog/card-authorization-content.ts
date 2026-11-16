import type { BlogArticle } from "./content";

/** Archive G0055, adapted with current authorization and capture guidance. */
export const cardAuthorizationArticle: BlogArticle = {
  path: "/company/blog/card-authorization",
  title: "Card authorization: what approval does and does not mean",
  description: "An approved card authorization can reserve the purchase amount on the customer’s card. It does not mean the money has reached your bank. Before fulfilling an order, check what the approval covers and what still needs to happen.",
  summary: "Learn how card authorization works, why customers see pending holds, when approvals expire and what to check before capture or cancellation.",
  searchTitle: "How card authorization works",
  relatedPaths: ["/company/blog/payment-processing-systems", "/company/blog/credit-card-declines"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "decision", title: "Where the approval comes from" },
    { id: "pending", title: "Why a payment looks pending" },
    { id: "expiry", title: "When an approval expires" },
    { id: "cancellation", title: "If the order is canceled" },
    { id: "before-fulfillment", title: "What to check before fulfillment" },
  ],
  sources: [
    { label: "Cybersource: Card authorization and processing flow", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/cup/so/payments/payments-intro/payments-services-intro/payments-intro-processing-auth.html" },
    { label: "Visa: Request and response codes", href: "https://developer.visa.com/api-reference/request-response-codes" },
    { label: "Adyen: Standalone authentication", href: "https://docs.adyen.com/online-payments/3d-secure/standalone-authentication" },
    { label: "Stripe: Authorization holds and capture deadlines", href: "https://docs.stripe.com/payments/place-a-hold-on-a-payment-method" },
    { label: "Cybersource: Authorization reversals", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/cup/so/payments/payments-intro/payments-services-intro/payments-intro-processing-reversal.html" },
    { label: "Adyen: Payment statuses, capture and settlement", href: "https://docs.adyen.com/account/payments-lifecycle" },
  ],
};
