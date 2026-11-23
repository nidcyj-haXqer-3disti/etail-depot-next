import type { BlogArticle } from "./content";

export const splitShippingPriceArticle: BlogArticle = {
  "path": "/company/blog/mixed-cart-shipping-costs",
  "title": "Two parcels. One price the customer can understand.",
  "description": "A mixed cart can involve different warehouses, delivery dates and charges. Explain the combined cost before asking the customer to pay.",
  "summary": "Customers should not need to understand your shipping profiles to understand their order.",
  "searchTitle": "Mixed Cart Shipping Costs: Explain Split Deliveries Clearly",
  "relatedPaths": [
    "/company/blog/write-delivery-promise",
    "/company/blog/ecommerce-shipping-efficiency"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "what-the-charge-covers",
      "title": "Explain the purchase the customer is actually making."
    },
    {
      "id": "a-choice-must-mean-something",
      "title": "An upgrade should identify what arrives sooner."
    }
  ],
  "sources": [
    {
      "label": "Shopify: Combined shipping rates",
      "href": "https://help.shopify.com/en/manual/fulfillment/setup/shipping-profiles/combined-shipping-rates"
    },
    {
      "label": "Shopify: Split shipping at checkout",
      "href": "https://help.shopify.com/en/manual/checkout-settings/split-shipping"
    },
    {
      "label": "Trolleys: Clear purchase details before payment",
      "href": "/company/legal/merchant-services#acceptance"
    }
  ]
};
