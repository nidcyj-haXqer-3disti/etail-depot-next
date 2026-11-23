import type { BlogArticle } from "./content";

export const pickupWalletArticle: BlogArticle = {
  "path": "/company/blog/wallet-checkout-store-pickup",
  "title": "The wallet knows their home. The order is for pickup.",
  "description": "Store pickup needs its own location, timing and confirmation. Keep those choices clear when a wallet supplies the customer’s saved contact details.",
  "summary": "A familiar saved address should not turn a pickup purchase into a delivery order.",
  "searchTitle": "Wallet Checkout for Store Pickup: Location and Timing",
  "relatedPaths": [
    "/company/blog/write-delivery-promise",
    "/company/blog/mixed-cart-shipping-costs"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "choose-the-store",
      "title": "The location comes before the payment."
    },
    {
      "id": "ready-when",
      "title": "Payment complete does not mean ready for collection."
    },
    {
      "id": "one-instruction",
      "title": "Give the buyer and the store the same instruction."
    }
  ],
  "sources": [
    {
      "label": "Apple: Purchase and payment-sheet guidance",
      "href": "https://developer.apple.com/design/human-interface-guidelines/apple-pay/"
    },
    {
      "label": "Trolleys: Purchase terms and payment results",
      "href": "/company/legal/merchant-services#acceptance"
    },
    {
      "label": "Trolleys: Enabled payment methods and software access",
      "href": "/company/legal/merchant-services#methods"
    }
  ]
};
