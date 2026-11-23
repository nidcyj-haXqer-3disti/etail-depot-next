import type { BlogArticle } from "./content";

export const crossVendorSupportArticle: BlogArticle = {
  "path": "/company/blog/payment-issue-multiple-vendors",
  "title": "Three vendors should not mean telling the payment story three times",
  "description": "A checkout issue can cross company boundaries. Progress depends on a shared history and a clearly assigned next action.",
  "summary": "When a payment issue spans a storefront, gateway and merchant account, keep one verified timeline and an identified coordinator without confusing each provider’s authority.",
  "searchTitle": "Who handles a payment issue across several vendors?",
  "relatedPaths": [
    "/company/blog/transaction-details-reports",
    "/company/blog/payment-account-sales-handoff"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "one-history-next-action",
      "title": "Keep one history and assign the next question"
    },
    {
      "id": "coordination-without-overclaiming",
      "title": "Coordination is valuable even when authority is divided"
    }
  ],
  "sources": [
    {
      "label": "Trolleys: Service responsibilities",
      "href": "/company/legal/merchant-services#service-commitments"
    },
    {
      "label": "Trolleys: Merchant Service Order",
      "href": "/company/legal/merchant-services#service-order"
    }
  ]
};
