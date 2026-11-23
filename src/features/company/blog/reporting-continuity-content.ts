import type { BlogArticle } from "./content";

export const reportingContinuityArticle: BlogArticle = {
  "path": "/company/blog/payment-reporting-after-provider-change",
  "title": "The processor changed. Did your sales really change with it?",
  "description": "A new dashboard can make the same business look different. Preserve comparable definitions before drawing conclusions from the new numbers.",
  "summary": "Keep payment reporting comparable across a provider change by reconciling dates, accounts, identifiers and definitions before comparing sales, refunds or fees.",
  "searchTitle": "Keeping payment reports comparable after switching providers",
  "relatedPaths": [
    "/company/blog/transaction-details-reports",
    "/company/blog/payment-reports-after-account-closure"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "keep-the-meaning",
      "title": "Preserve the meaning behind the column"
    },
    {
      "id": "prove-one-period",
      "title": "Reconstruct one complete period before trusting the trend"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Secure card exports and excluded records",
      "href": "https://docs.stripe.com/get-started/data-migrations/pan-export"
    },
    {
      "label": "Trolleys: Account funding records",
      "href": "/company/legal/payouts-and-reserves#funding-record"
    }
  ]
};
