import type { BlogArticle } from "./content";

export const renewalImportArticle: BlogArticle = {
  "path": "/company/blog/subscription-billing-after-customer-import",
  "title": "The customers imported correctly. The next bill can still be wrong.",
  "description": "A migrated customer record does not say what that customer has already paid for or which system should collect the next installment.",
  "summary": "Validate paid-through dates, credits, paused subscriptions and ownership of the next collection after importing payment customers. Successful data transfer is not billing continuity.",
  "searchTitle": "Checking subscription billing after a payment migration",
  "relatedPaths": [
    "/company/blog/card-on-file",
    "/company/blog/shopify-subscription-payment-provider"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "follow-the-obligation",
      "title": "Start from what the customer is owed"
    },
    {
      "id": "test-the-exceptions",
      "title": "Review the unusual accounts before the ordinary ones hide them"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Subscription migration and billing dates",
      "href": "https://docs.stripe.com/billing/subscriptions/import-subscriptions-toolkit"
    },
    {
      "label": "Trolleys: Merchant Service Order",
      "href": "/company/legal/merchant-services#service-order"
    }
  ]
};
