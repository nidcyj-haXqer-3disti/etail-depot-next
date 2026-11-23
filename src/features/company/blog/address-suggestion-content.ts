import type { BlogArticle } from "./content";

export const addressSuggestionArticle: BlogArticle = {
  "path": "/company/blog/checkout-address-suggestions-apartment",
  "title": "The address looked better. The apartment disappeared.",
  "description": "Address suggestions should help customers confirm where an order is going. Preserve unit details, make changes visible and provide a workable correction path.",
  "summary": "A tidy address is not useful if it no longer describes the place the customer meant.",
  "searchTitle": "Checkout Address Suggestions: Preserve Apartments and Corrections",
  "relatedPaths": [
    "/company/blog/local-payments",
    "/company/blog/billing-address"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "suggestion-is-not-instruction",
      "title": "Show what changed before accepting the change."
    },
    {
      "id": "unit-details",
      "title": "Make room for the part of the address the building search missed."
    }
  ],
  "sources": [
    {
      "label": "Google Maps Platform: Address validation for checkout",
      "href": "https://developers.google.com/maps/architecture/ecommerce-checkout-address-validation"
    },
    {
      "label": "U.S. Web Design System: Domestic address entry",
      "href": "https://designsystem.digital.gov/patterns/create-a-user-profile/address/"
    },
    {
      "label": "Shopify: Checkout form options",
      "href": "https://help.shopify.com/en/manual/checkout-settings/checkout-form-options"
    },
    {
      "label": "Trolleys: Clear purchase details before payment",
      "href": "/company/legal/merchant-services#acceptance"
    }
  ]
};
