import type { BlogArticle } from "./content";

export const shopifyRenewalFitArticle: BlogArticle = {
  "path": "/company/blog/shopify-subscription-payment-provider",
  "title": "The first subscription payment is only half the test",
  "description": "A Shopify gateway must support the recurring purchase model, not merely accept a card when the customer is present.",
  "summary": "Check Shopify subscription compatibility across the app, gateway, payment method and account. General recurring-payment support does not establish that Shopify renewals will work.",
  "searchTitle": "Choosing a provider for Shopify subscription payments",
  "relatedPaths": [
    "/company/blog/recurring-payments-vs-subscription-billing",
    "/company/blog/shopify-payments-external-provider-costs"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "a-specific-compatibility-question",
      "title": "Ask about the complete Shopify arrangement"
    },
    {
      "id": "the-renewal-and-the-exit",
      "title": "Test the lifecycle that produces the recurring revenue"
    }
  ],
  "sources": [
    {
      "label": "Shopify: Supported subscription gateways and conditions",
      "href": "https://help.shopify.com/en/manual/products/purchase-options/subscriptions/considerations"
    },
    {
      "label": "Trolleys: Payment methods and account setup",
      "href": "/services/payment-methods"
    }
  ]
};
