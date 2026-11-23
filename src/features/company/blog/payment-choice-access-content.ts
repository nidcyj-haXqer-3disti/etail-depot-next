import type { BlogArticle } from "./content";

export const paymentChoiceAccessArticle: BlogArticle = {
  "path": "/company/blog/screen-reader-payment-options",
  "title": "A payment logo is not a payment choice.",
  "description": "Customers using screen readers need to identify a method, know whether it is selected and understand what changes next. Branding alone cannot do that.",
  "summary": "The method needs a name, a selected state and an understandable result.",
  "searchTitle": "Accessible Payment Options for Screen Reader Checkout",
  "relatedPaths": [
    "/company/blog/checkout-text-zoom",
    "/company/blog/payment-confirmation-pages"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "method-and-state",
      "title": "A selection has to be understandable without its color."
    },
    {
      "id": "changes-and-results",
      "title": "Announce the consequence, not every movement on the page."
    }
  ],
  "sources": [
    {
      "label": "W3C WAI: Grouping form controls",
      "href": "https://www.w3.org/WAI/tutorials/forms/grouping/"
    },
    {
      "label": "W3C: Understanding Name, Role, Value",
      "href": "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html"
    },
    {
      "label": "W3C: Understanding Status Messages",
      "href": "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
    },
    {
      "label": "W3C WAI: Form notifications",
      "href": "https://www.w3.org/WAI/tutorials/forms/notifications/"
    },
    {
      "label": "Trolleys: Available payment methods",
      "href": "/company/legal/merchant-services#methods"
    }
  ]
};
