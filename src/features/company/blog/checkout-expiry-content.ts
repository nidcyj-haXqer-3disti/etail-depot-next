import type { BlogArticle } from "./content";

export const checkoutExpiryArticle: BlogArticle = {
  "path": "/company/blog/checkout-session-expiry-recovery",
  "title": "The checkout expired. What exactly did the customer lose?",
  "description": "A session deadline should explain what expires, preserve permitted work and provide a safe return. An expired screen does not establish the payment result.",
  "summary": "A timer can end a session without answering what happened to the order.",
  "searchTitle": "Checkout Session Expiry: Explain the Deadline and Recovery",
  "relatedPaths": [
    "/company/blog/payment-api-retries",
    "/company/blog/payment-confirmation-pages"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "different-deadlines",
      "title": "Name the thing that is expiring."
    },
    {
      "id": "before-payment",
      "title": "Preserve useful work within the actual security boundary."
    },
    {
      "id": "after-submission",
      "title": "After submission, find the result before inviting another payment."
    }
  ],
  "sources": [
    {
      "label": "W3C: Understanding Timing Adjustable",
      "href": "https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html"
    },
    {
      "label": "Trolleys: Protecting payment information",
      "href": "/company/legal/security-policy#payment-data"
    },
    {
      "label": "Trolleys: Handling customer information",
      "href": "/company/legal/merchant-services#information"
    },
    {
      "label": "Trolleys: Clear purchase details before payment",
      "href": "/company/legal/merchant-services#acceptance"
    }
  ]
};
