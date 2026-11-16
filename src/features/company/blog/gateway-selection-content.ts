import type { BlogArticle } from "./content";

/** Unpublished archive G0206, adapted around the merchant's evaluation of a gateway beyond a successful demo. */
export const gatewaySelectionArticle: BlogArticle = {
  path: "/company/blog/international-payment-gateways",
  title: "Before you choose a gateway, interrupt the demo",
  description: "Choosing an international payment gateway? Look beyond supported countries to checkout recovery, refund records and who helps when a payment result is unclear.",
  summary: "The successful payment is the easy part of a sales demonstration. Ask what happens when the customer leaves, the response disappears or someone needs a refund.",
  searchTitle: "How to choose an international payment gateway beyond the demo",
  relatedPaths: ["/company/blog/pick-the-right-payment-methods-in-a-new-country", "/company/blog/how-multicurrency-ecommerce-payments-work"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Payment method eligibility and integration support", href: "https://docs.stripe.com/payments/payment-methods/payment-method-support" },
    { label: "Cybersource: Uncertain payment results and duplicate processing", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/spg/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Cybersource: Sandbox testing and processor-specific scenarios", href: "https://developer.cybersource.com/hello-world/testing-guide.html" },
  ],
};
