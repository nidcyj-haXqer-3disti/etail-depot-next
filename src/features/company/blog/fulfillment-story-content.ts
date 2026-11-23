import type { BlogArticle } from "./content";

export const fulfillmentStoryArticle: BlogArticle = {
  "path": "/company/blog/explain-fulfillment-merchant-review",
  "title": "What happens after the customer pays?",
  "description": "A payment reviewer needs to understand how an order becomes a fulfilled promise. Explain the work, dependencies and exceptions between those events.",
  "summary": "The order confirmation is the start of the story. A credible merchant application explains what the business still owes the buyer.",
  "searchTitle": "Explain Your Fulfillment Process in a Merchant Review",
  "relatedPaths": [
    "/company/blog/write-delivery-promise",
    "/company/blog/outside-warehouse-merchant-responsibility"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "follow-one-order",
      "title": "Follow one ordinary order all the way through."
    },
    {
      "id": "the-point-of-dependence",
      "title": "Name the part you cannot complete on your own."
    },
    {
      "id": "the-exception",
      "title": "Include the order that does not go to plan."
    }
  ],
  "sources": [
    {
      "label": "Trolleys: Selling and accepting payments",
      "href": "/company/legal/merchant-services#acceptance"
    },
    {
      "label": "Trolleys: Business information and approved account scope",
      "href": "/company/legal/merchant-services#approval"
    },
    {
      "label": "Trolleys: Merchant account setup",
      "href": "/resources/merchant-account-setup"
    }
  ]
};
