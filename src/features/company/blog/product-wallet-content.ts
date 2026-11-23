import type { BlogArticle } from "./content";

export const productWalletArticle: BlogArticle = {
  "path": "/company/blog/product-page-wallet-checkout-cart",
  "title": "Buy this. Not everything I was thinking about.",
  "description": "A wallet button on a product page should make the scope of the purchase clear. Keep the selected item, its options and the existing basket distinct.",
  "summary": "An express purchase becomes confusing when it quietly includes the rest of the basket.",
  "searchTitle": "Product Page Wallet Checkout: Keep the Existing Cart Separate",
  "relatedPaths": [
    "/company/blog/accelerated-guest-checkout",
    "/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "one-purchase",
      "title": "Decide what this button is buying."
    },
    {
      "id": "basket-afterward",
      "title": "Finish this order without erasing the next one."
    }
  ],
  "sources": [
    {
      "label": "Apple: Purchase and payment-sheet guidance",
      "href": "https://developer.apple.com/design/human-interface-guidelines/apple-pay/"
    },
    {
      "label": "Google Pay: Official payment-button guidance",
      "href": "https://developers.google.com/pay/api/web/guides/brand-guidelines"
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
