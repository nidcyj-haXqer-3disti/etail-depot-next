import type { BlogArticle } from "./content";

export const customerReentryArticle: BlogArticle = {
  "path": "/company/blog/customers-update-payment-method-after-switch",
  "title": "If customers must enter their card again, earn their trust before asking",
  "description": "A payment migration can turn a quiet recurring relationship into an unfamiliar request. Handle that moment as part of the customer experience.",
  "summary": "When saved payment methods cannot move, identify the affected customers, explain the change and provide a trusted secure update route without changing the agreed purchase.",
  "searchTitle": "Asking customers to update payment details after a switch",
  "relatedPaths": [
    "/company/blog/credit-card-vaulting",
    "/company/blog/card-on-file"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "ask-only-the-affected-customers",
      "title": "First establish who actually needs to act"
    },
    {
      "id": "make-the-request-recognizable",
      "title": "Let the customer verify the request"
    }
  ],
  "sources": [
    {
      "label": "Shopify: Moving saved payment methods",
      "href": "https://help.shopify.com/en/manual/products/purchase-options/subscriptions/migrating-payment-methods"
    },
    {
      "label": "Trolleys: Account access and security",
      "href": "/company/legal/security-policy#account-access"
    }
  ]
};
