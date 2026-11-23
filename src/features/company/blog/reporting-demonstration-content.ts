import type { BlogArticle } from "./content";

export const reportingDemonstrationArticle: BlogArticle = {
  "path": "/company/blog/compare-payment-provider-reporting",
  "title": "Ask the payment demo to explain a difficult day",
  "description": "A clean dashboard can impress in minutes. A useful reporting system can explain the activity that made the day complicated.",
  "summary": "Compare payment provider reports with a completed processing period containing a refund or adjustment. Test traceability across gateway and merchant account records before buying.",
  "searchTitle": "Compare payment provider reporting with one completed period",
  "relatedPaths": [
    "/company/blog/transaction-details-reports",
    "/company/blog/erp-payment-system-integration"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "make-the-demo-account-for-the-difference",
      "title": "Choose a period with something to explain"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Payout reconciliation reports and their scope",
      "href": "https://docs.stripe.com/reports/payout-reconciliation"
    },
    {
      "label": "Trolleys: Account funding records",
      "href": "/company/legal/payouts-and-reserves#funding-record"
    }
  ]
};
