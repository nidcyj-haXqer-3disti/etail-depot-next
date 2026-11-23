import type { BlogArticle } from "./content";

export const walletButtonDesignArticle: BlogArticle = {
  "path": "/company/blog/wallet-buttons-checkout-design",
  "title": "Your checkout can look like your brand without redrawing the wallet.",
  "description": "Use official wallet buttons within a coherent checkout layout. Contrast, spacing and mobile placement can improve the design without changing familiar controls.",
  "summary": "Brand consistency comes from the whole purchase, not from recoloring every payment button.",
  "searchTitle": "Wallet Button Design: Branding, Contrast and Mobile Layout",
  "relatedPaths": [
    "/company/blog/screen-reader-payment-options",
    "/company/blog/checkout-button-pay-or-review"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "design-around-control",
      "title": "Use the room the provider actually gives you."
    },
    {
      "id": "small-screen",
      "title": "Give the button enough space to remain itself."
    }
  ],
  "sources": [
    {
      "label": "Google Pay: Official payment-button guidance",
      "href": "https://developers.google.com/pay/api/web/guides/brand-guidelines"
    },
    {
      "label": "Google Pay: Supported button configuration",
      "href": "https://developers.google.com/pay/api/web/reference/request-objects#ButtonOptions"
    },
    {
      "label": "Trolleys: Enabled payment methods and software access",
      "href": "/company/legal/merchant-services#methods"
    }
  ]
};
