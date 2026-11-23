import type { BlogArticle } from "./content";

export const sampleBillingArticle: BlogArticle = {
  "path": "/company/blog/sample-invoice-payment-quote",
  "title": "Ask to see the bill before you agree to the price",
  "description": "A sample invoice tests whether the proposed fees will be understandable to the people who have to reconcile and pay them.",
  "summary": "A sample payment processing invoice reveals billing dates, credits and collection methods that a rate quote can leave unclear. Test the proposed account before signing.",
  "searchTitle": "Why to request a sample invoice with a payment quote",
  "relatedPaths": [
    "/company/blog/first-payment-processing-statement",
    "/company/blog/payment-quote-contract-conflict"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "follow-one-payment",
      "title": "Follow one payment through the paperwork"
    },
    {
      "id": "finance-before-signature",
      "title": "Bring the person who closes the month into the decision"
    }
  ],
  "sources": [
    {
      "label": "Trolleys: Account billing terms",
      "href": "/company/legal/fees#billing-record"
    },
    {
      "label": "Trolleys: Fees and billing",
      "href": "/company/legal/fees"
    }
  ]
};
