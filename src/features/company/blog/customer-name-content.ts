import type { BlogArticle } from "./content";

export const customerNameArticle: BlogArticle = {
  "path": "/company/blog/long-customer-names-checkout-orders",
  "title": "The customer’s name fits the form. Does it fit the order?",
  "description": "A checkout can accept a name that an order export or shipping label later cuts off. Review the whole path before deciding the field works.",
  "summary": "Allowing a name into checkout is only the first part of preserving it.",
  "searchTitle": "Long Customer Names: Prevent Checkout and Order Truncation",
  "relatedPaths": [
    "/company/blog/local-payments",
    "/company/blog/checkout-address-suggestions-apartment"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "W3C Internationalization: Personal names around the world",
      "href": "https://www.w3.org/International/questions/qa-personal-names"
    },
    {
      "label": "U.S. Web Design System: Name entry and complete display",
      "href": "https://designsystem.digital.gov/patterns/create-a-user-profile/name/"
    }
  ]
};
