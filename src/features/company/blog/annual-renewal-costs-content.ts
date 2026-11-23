import type { BlogArticle } from "./content";

export const annualRenewalCostsArticle: BlogArticle = {
  "path": "/company/blog/annual-renewal-processing-costs",
  "title": "Annual renewal day is a cash event you still have to manage",
  "description": "A year of scheduled renewals can look reassuring in a forecast. The business receives money only when collection succeeds.",
  "summary": "Annual renewals concentrate collection risk. Separate amounts due, payments collected, refunds and available cash before treating renewal volume as funding.",
  "searchTitle": "Annual renewal payments, fees and cash planning",
  "relatedPaths": [
    "/company/blog/annual-vs-monthly-billing",
    "/company/blog/saas-renewal-rate"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "renewals-are-not-receipts",
      "title": "A schedule is a claim on future collection"
    },
    {
      "id": "what-the-cash-has-to-do",
      "title": "The year’s money has a year’s work attached"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Failed payment retries and attempt records",
      "href": "https://docs.stripe.com/billing/revenue-recovery/smart-retries"
    },
    {
      "label": "Etail Depot: Fees and billing",
      "href": "/company/legal/fees"
    }
  ]
};
