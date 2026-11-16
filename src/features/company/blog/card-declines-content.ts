import type { BlogArticle } from "./content";

/** Archive G0015, adapted with current decline and timeout guidance. */
export const cardDeclinesArticle: BlogArticle = {
  path: "/company/blog/credit-card-declines",
  title: "Credit card declines: what to check before trying again",
  description: "A declined payment and a checkout that stops responding need different next steps. Check the original result first, then help the customer complete the purchase without creating another payment by mistake.",
  summary: "Learn how to handle credit card declines, missing payment responses and duplicate warnings, with practical steps for merchants and customer support.",
  searchTitle: "Credit card declines: what to check before retrying",
  relatedPaths: ["/company/blog/payment-processing-systems", "/company/blog/optimize-your-mobile-checkout-experience"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "identify-result", title: "Confirm which result you have" },
    { id: "choose-response", title: "Match the response to the problem" },
    { id: "retry-carefully", title: "Know when to stop retrying" },
    { id: "customer-message", title: "Give the customer a clear next step" },
    { id: "review-patterns", title: "Improve the part you can control" },
  ],
  sources: [
    { label: "Cybersource: Transaction results and reason codes", href: "https://support.visaacceptance.com/knowledgebase/article/KA-04103/en-us" },
    { label: "Cybersource: Transaction timeout guidance", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/spg/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Stripe: Decline codes and next steps", href: "https://docs.stripe.com/declines/codes" },
    { label: "Stripe: Card declines", href: "https://docs.stripe.com/declines/card" },
    { label: "Etail Depot: Checkout and recovery testing", href: "/developers/testing" },
  ],
};
