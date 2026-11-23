import type { BlogArticle } from "./content";

export const processingHistoryBridgeArticle: BlogArticle = {
  "path": "/company/blog/bank-deposits-processing-volume-merchant-review",
  "title": "The application says $50,000. The bank shows $43,300. Both can be right.",
  "description": "Processing volume and bank deposits measure different things. Explain the difference with a traceable calculation and avoid counting the same payments twice.",
  "summary": "A smaller deposit does not automatically mean sales were overstated. Show how the figures connect.",
  "searchTitle": "Bank Deposits vs Processing Volume in a Merchant Application",
  "relatedPaths": [
    "/company/blog/processing-history-new-sales-channel",
    "/company/blog/cropped-bank-statement-verification"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "follow-the-difference",
      "title": "Show the calculation, including money still in transit."
    },
    {
      "id": "several-providers",
      "title": "A second report is not always a second stream of sales."
    },
    {
      "id": "a-checkable-history",
      "title": "Give the reviewer a route back to the records."
    }
  ],
  "sources": [
    {
      "label": "Trolleys: Business information and approved account scope",
      "href": "/company/legal/merchant-services#approval"
    },
    {
      "label": "Trolleys: Payout calculation and timing",
      "href": "/company/legal/payouts-and-reserves#calculation"
    },
    {
      "label": "IRS: Gross payments reported on Form 1099-K",
      "href": "https://www.irs.gov/newsroom/form-1099-k-faqs-general-information"
    }
  ]
};
