import type { BlogArticle } from "./content";

/** Archive G0242, adapted with current capture and recovery guidance. */
export const paymentCaptureArticle: BlogArticle = {
  path: "/company/blog/payment-capture",
  title: "When to capture a card payment",
  description: "Card approval and capture are separate decisions. Choose a capture policy that fits fulfillment, handles partial orders and gives your team a clear way to resolve uncertain results.",
  summary: "Understand automatic and manual capture, authorization deadlines, partial orders and the checks to make before retrying a payment operation.",
  searchTitle: "When to capture a card payment: a merchant guide",
  relatedPaths: ["/company/blog/card-authorization", "/company/blog/payment-settlement-and-payouts"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "capture-and-approval", title: "Understand what capture changes" },
    { id: "choose-capture-timing", title: "Match capture timing to fulfillment" },
    { id: "handle-partial-orders", title: "Decide what happens to partial orders" },
    { id: "confirm-capture-result", title: "Confirm the result before trying again" },
    { id: "review-capture-exceptions", title: "Give unfinished payments an owner" },
  ],
  sources: [
    { label: "Cybersource: Capture processing and reconciliation", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/gpn/rest/payments/payments-intro/payments-services-intro/payments-intro-processing-capture.html" },
    { label: "Adyen: Automatic, manual and partial capture", href: "https://docs.adyen.com/online-payments/capture" },
    { label: "Stripe: Authorization holds and capture limits", href: "https://docs.stripe.com/payments/place-a-hold-on-a-payment-method" },
    { label: "Cybersource: Capture timeouts and recovery", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/gpn/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Adyen: Payment processing and settlement states", href: "https://docs.adyen.com/account/payments-lifecycle" },
  ],
};
