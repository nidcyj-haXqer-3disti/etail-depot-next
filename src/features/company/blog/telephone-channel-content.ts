import type { BlogArticle } from "./content";

export const telephoneChannelArticle: BlogArticle = {
  "path": "/company/blog/add-telephone-orders-online-business",
  "title": "The customer calls to order. That changes the payment conversation.",
  "description": "Telephone orders can bring staff, recordings and manual entry into the payment process. Confirm the approved method before taking card details.",
  "summary": "A helpful phone call and a staff-entered card payment are different arrangements, even when they sell the same product.",
  "searchTitle": "Adding Telephone Orders to an Online Business",
  "relatedPaths": [
    "/company/blog/card-present-vs-card-not-present",
    "/company/blog/payment-api-retries"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "conversation-or-collection",
      "title": "Helping the customer buy is different from collecting their card details."
    },
    {
      "id": "recording",
      "title": "Consider everything that listens to the call."
    },
    {
      "id": "customer-record",
      "title": "The caller still needs a clear purchase record."
    }
  ],
  "sources": [
    {
      "label": "Trolleys: Business information and approved account scope",
      "href": "/company/legal/merchant-services#approval"
    },
    {
      "label": "Trolleys: Selling and accepting payments",
      "href": "/company/legal/merchant-services#acceptance"
    },
    {
      "label": "Trolleys: Account access and secure instructions",
      "href": "/company/legal/security-policy#account-access"
    },
    {
      "label": "PCI Security Standards Council: Card security codes in call recordings",
      "href": "https://www.pcisecuritystandards.org/faqs/1210/"
    }
  ]
};
