import type { BlogArticle } from "./content";

export const walletContinuityArticle: BlogArticle = {
  "path": "/company/blog/saved-wallets-gateway-change",
  "title": "The wallet button came back. Did the saved payment relationship?",
  "description": "A familiar logo can hide a different account and credential arrangement. Check future purchases and existing billing separately.",
  "summary": "When changing gateways, distinguish a wallet button from saved credentials and network tokens. Confirm supported continuity and any customer reauthorization before relying on renewals.",
  "searchTitle": "What happens to saved wallets when you change gateways?",
  "relatedPaths": [
    "/company/blog/credit-cards-and-digital-wallets",
    "/company/blog/customers-update-payment-method-after-switch"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "identify-what-was-saved",
      "title": "Find out what the business is actually using"
    },
    {
      "id": "verify-the-next-use",
      "title": "Test the future action you depend on"
    }
  ],
  "sources": [
    {
      "label": "EMVCo: Payment token restrictions",
      "href": "https://www.emvco.com/emv-technologies/payment-tokenisation/"
    },
    {
      "label": "Stripe: Secure card exports and excluded records",
      "href": "https://docs.stripe.com/get-started/data-migrations/pan-export"
    },
    {
      "label": "Shopify: Moving saved payment methods",
      "href": "https://help.shopify.com/en/manual/products/purchase-options/subscriptions/migrating-payment-methods"
    },
    {
      "label": "Trolleys: Merchant Service Order",
      "href": "/company/legal/merchant-services#service-order"
    }
  ]
};
