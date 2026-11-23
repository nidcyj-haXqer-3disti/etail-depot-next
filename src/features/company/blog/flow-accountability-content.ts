import type { BlogArticle } from "./content";

export const flowAccountabilityArticle: BlogArticle = {
  "path": "/company/blog/payment-flow-diagram-merchant-review",
  "title": "The payment diagram should explain who owes the customer.",
  "description": "A useful payment flow identifies the seller, the receiving account and the response when a sale goes wrong. Software boxes alone cannot do that.",
  "summary": "The most revealing arrow may be the one showing where a refund comes from after the original payout.",
  "searchTitle": "Payment Flow Diagrams for Platform and Merchant Reviews",
  "relatedPaths": [
    "/company/blog/embedded-payments-for-online-marketplaces",
    "/company/blog/multivendor-marketplace-payments"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "label-the-relationship",
      "title": "Label the business relationship before the software."
    },
    {
      "id": "follow-the-return",
      "title": "Follow a return after the sale has been paid out."
    },
    {
      "id": "standard-platform-scope",
      "title": "Keep the drawing within the agreement being proposed."
    }
  ],
  "sources": [
    {
      "label": "Trolleys: Merchant and platform responsibilities",
      "href": "/company/legal/software-platforms#merchant-relationship"
    },
    {
      "label": "Trolleys: Platform permissions",
      "href": "/company/legal/software-platforms#permissions"
    },
    {
      "label": "Trolleys: Activities requiring written approval",
      "href": "/company/legal/acceptable-use#review"
    }
  ]
};
