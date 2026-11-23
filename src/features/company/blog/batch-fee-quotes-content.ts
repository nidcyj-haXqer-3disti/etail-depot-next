import type { BlogArticle } from "./content";

export const batchFeeQuotesArticle: BlogArticle = {
  "path": "/company/blog/batch-fees-in-processing-quotes",
  "title": "The batch fee is small. The counting rule matters.",
  "description": "A charge of a few cents deserves proportionate attention. Its definition can still reveal whether a proposal understands how your accounts operate.",
  "summary": "Batch fees depend on what the provider counts. Account structure and settlement activity matter more than multiplying a daily fee by 30.",
  "searchTitle": "Batch fees in merchant processing quotes",
  "relatedPaths": [
    "/company/blog/how-batch-payment-processing-works",
    "/company/blog/payment-settlement-and-payouts"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "Authorize.net: Batch and transaction fee definitions",
      "href": "https://account.authorize.net/help/Account/Merchant_Profile/Fee_Definitions.htm"
    },
    {
      "label": "Cybersource: Batch dates and report periods",
      "href": "https://developer.cybersource.com/docs/cybs/en-us/reporting/user/all/ebc/reporting-ug/Creating_Accessing_Downloadable_Reports/c_Modifying_Custom_Report_Subscriptions/Config_Pay_Batch_Detail_Report_Batch_Times.html"
    },
    {
      "label": "Etail Depot: Billing records and accepted charges",
      "href": "/company/legal/fees#statements"
    }
  ]
};
