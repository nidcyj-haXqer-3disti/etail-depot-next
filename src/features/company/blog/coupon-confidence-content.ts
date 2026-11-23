import type { BlogArticle } from "./content";

export const couponConfidenceArticle: BlogArticle = {
  "path": "/company/blog/coupon-field-discounts-shipping-total",
  "title": "The coupon worked. Why did the order get more expensive?",
  "description": "Coupon prompts, automatic savings and shipping thresholds all shape the price customers believe they are getting. Make the final result easy to understand.",
  "summary": "A discount message is not helpful if the customer cannot explain the new total.",
  "searchTitle": "Checkout Coupons, Automatic Discounts and Shipping Thresholds",
  "relatedPaths": [
    "/company/blog/ecommerce-discounts",
    "/company/blog/mixed-cart-shipping-costs"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "prominence",
      "title": "Make the real offer clearer than the possibility of another one."
    },
    {
      "id": "threshold-example",
      "title": "A smaller merchandise subtotal can produce a larger payment."
    },
    {
      "id": "one-agreed-total",
      "title": "The amount sent for payment must match the final order."
    }
  ],
  "sources": [
    {
      "label": "Baymard: Checkout fields and coupon searching",
      "href": "https://baymard.com/research-articles/checkout-flow-average-form-fields"
    },
    {
      "label": "Shopify: Shipping rates after discounts",
      "href": "https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/troubleshooting"
    },
    {
      "label": "Trolleys: Clear purchase details before payment",
      "href": "/company/legal/merchant-services#acceptance"
    }
  ]
};
