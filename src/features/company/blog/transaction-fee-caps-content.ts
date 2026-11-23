import type { BlogArticle } from "./content";

export const transactionFeeCapsArticle: BlogArticle = {
  "path": "/company/blog/payment-processing-fee-caps",
  "title": "A capped fee is not always a capped payment bill",
  "description": "The maximum may apply to one component, one payment method or one plan. The rest of the transaction can still carry a cost.",
  "summary": "Payment processing fee caps have boundaries. Establish the capped component, eligible payment method and remaining charges before pricing a large transaction.",
  "searchTitle": "What a payment processing fee cap actually limits",
  "relatedPaths": [
    "/company/blog/minimum-transaction-fees",
    "/company/blog/gateway-fees-and-processing-savings"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "name-the-boundary",
      "title": "Read the boundary as carefully as the number"
    },
    {
      "id": "certainty-with-conditions",
      "title": "Price certainty does not remove payment risk"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Pricing agreements, minimum commitments and fee caps",
      "href": "https://stripe.com/legal/pricing-policy"
    },
    {
      "label": "Square: Payment fees, minimums and caps by plan",
      "href": "https://squareup.com/help/us/en/article/5068-what-are-square-s-fees"
    },
    {
      "label": "Trolleys: Fees and billing",
      "href": "/company/legal/fees"
    }
  ]
};
