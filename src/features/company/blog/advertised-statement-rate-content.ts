import type { BlogArticle } from "./content";

export const advertisedStatementRateArticle: BlogArticle = {
  "path": "/company/blog/advertised-rate-vs-statement-rate",
  "title": "A higher statement rate deserves an explanation",
  "description": "An effective rate can expose a real problem. It can also combine several costs and timing differences that the advertised percentage never described.",
  "summary": "When a statement rate exceeds the advertised rate, reconcile the charging basis and included fees before deciding whether the account was overbilled.",
  "searchTitle": "Advertised processing rate versus effective statement rate",
  "relatedPaths": [
    "/company/blog/merchant-discount-rate",
    "/company/blog/transaction-details-reports"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "reproduce-the-number",
      "title": "Make the difference visible"
    },
    {
      "id": "the-providers-responsibility",
      "title": "Complexity should not become a defense"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Balance summary report fields",
      "href": "https://docs.stripe.com/reports/balance"
    },
    {
      "label": "Etail Depot: Fee calculations and billing records",
      "href": "/company/legal/fees"
    },
    {
      "label": "Etail Depot: Payout calculations",
      "href": "/company/legal/payouts-and-reserves"
    }
  ]
};
