import type { BlogArticle } from "./content";

/** Unpublished archive G0609, adapted around the customer waiting for a refund. */
export const cardRefundsArticle: BlogArticle = {
  path: "/company/blog/card-payment-refunds",
  title: "You issued the refund. Your customer is still waiting.",
  description: "How card payment refunds work, why a refund may not appear yet and what merchants can check before sending money twice. Clear status, timing and tracing advice.",
  summary: "Your team sees a refund record. Your customer sees money still missing. What you do between those two views can preserve the relationship or make the problem worse.",
  searchTitle: "Card payment refunds: status, timing and tracing",
  relatedPaths: ["/company/blog/credit-notes", "/company/blog/what-is-a-chargeback"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Card refund destinations, reversals and processing", href: "https://docs.stripe.com/refunds" },
    { label: "Adyen: Refund confirmation and later failures", href: "https://docs.adyen.com/online-payments/refund/" },
    { label: "Cybersource: Checking status after a transaction timeout", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/ctv/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Stripe: Tracing a refund with bank reference numbers", href: "https://support.stripe.com/questions/how-to-trace-a-refund-using-reference-numbers" },
  ],
};
