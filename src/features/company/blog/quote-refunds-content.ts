import type { BlogArticle } from "./content";

export const quoteRefundsArticle: BlogArticle = {
  "path": "/company/blog/refunds-and-processing-cost-savings",
  "title": "A refund can leave the merchant paying for a sale that disappeared",
  "description": "The customer gets their money back. Whether the merchant gets the processing cost back is a separate part of the agreement.",
  "summary": "Refund fee treatment can change the value of a processing quote. The important distinction is between refund charges and retained original fees.",
  "searchTitle": "How refunds change payment processing savings",
  "relatedPaths": [
    "/company/blog/card-payment-refunds",
    "/company/blog/merchant-discount-rate"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "two-different-promises",
      "title": "“No refund fee” is an incomplete answer"
    },
    {
      "id": "the-cost-of-kept-sales",
      "title": "Judge the offer after customers have made up their minds"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Refunds and original processing fees",
      "href": "https://docs.stripe.com/refunds"
    },
    {
      "label": "Etail Depot: Refund treatment in Fees and billing",
      "href": "/company/legal/fees#refund-treatment"
    }
  ]
};
