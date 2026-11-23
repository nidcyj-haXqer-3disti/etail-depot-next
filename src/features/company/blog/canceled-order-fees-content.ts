import type { BlogArticle } from "./content";

export const canceledOrderFeesArticle: BlogArticle = {
  "path": "/company/blog/canceled-order-processing-fees",
  "title": "The order was canceled. The payment had already happened.",
  "description": "A customer service button can close an order without erasing the financial events behind it.",
  "summary": "Why can a canceled order still carry a processing fee? The answer depends on whether the payment was authorized, captured or refunded.",
  "searchTitle": "Why a canceled order can still have processing fees",
  "relatedPaths": [
    "/company/blog/payment-capture",
    "/company/blog/card-payment-refunds"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "Stripe: Canceling and refunding payments",
      "href": "https://docs.stripe.com/refunds"
    },
    {
      "label": "Stripe: Separate authorization and capture",
      "href": "https://docs.stripe.com/payments/place-a-hold-on-a-payment-method"
    },
    {
      "label": "Etail Depot: Fee calculation and refund treatment",
      "href": "/company/legal/fees"
    }
  ]
};
