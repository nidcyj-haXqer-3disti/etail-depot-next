import type { BlogArticle } from "./content";

export const walletCardChangeArticle: BlogArticle = {
  "path": "/company/blog/wallet-checkout-change-cards",
  "title": "The wallet works. Now choose a different card.",
  "description": "A default-card purchase proves only one route. Test what happens when the buyer changes cards, returns from verification or leaves the wallet mid-purchase.",
  "summary": "The important wallet test is often the choice the first successful buyer did not make.",
  "searchTitle": "Wallet Checkout Testing When Customers Change Cards",
  "relatedPaths": [
    "/company/blog/accept-apple-pay-as-a-business",
    "/company/blog/payment-api-retries"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "the-final-choice",
      "title": "A card change is not a new shopping intention."
    },
    {
      "id": "a-useful-test",
      "title": "Change the sequence, then inspect the records."
    }
  ],
  "sources": [
    {
      "label": "Apple: Responding to a selected payment method",
      "href": "https://developer.apple.com/documentation/applepayontheweb/applepaysession/onpaymentmethodselected"
    },
    {
      "label": "Apple: Payment-sheet cancellation events",
      "href": "https://developer.apple.com/documentation/applepayontheweb/applepaysession/oncancel"
    },
    {
      "label": "Trolleys: Purchase terms and payment results",
      "href": "/company/legal/merchant-services#acceptance"
    },
    {
      "label": "Trolleys: Protecting payment information",
      "href": "/company/legal/security-policy#payment-data"
    }
  ]
};
