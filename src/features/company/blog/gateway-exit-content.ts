import type { BlogArticle } from "./content";

export const gatewayExitArticle: BlogArticle = {
  "path": "/company/blog/cancel-processing-and-gateway",
  "title": "Moving checkout is only the beginning of closing the old account",
  "description": "New sales can move quickly. Refunds, subscriptions and transaction records may still depend on the service being left behind.",
  "summary": "Canceling processing may leave a gateway subscription and operational work behind. Plan remaining refunds, recurring payments and record access before closing services.",
  "searchTitle": "Does canceling processing also cancel the gateway?",
  "relatedPaths": [
    "/company/blog/merchant-account-costs-inactive-months",
    "/company/blog/payment-processor-switching-break-even"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "old-orders-still-exist",
      "title": "The old account still has a past"
    },
    {
      "id": "close-a-named-service",
      "title": "Make each closure explicit"
    }
  ],
  "sources": [
    {
      "label": "Authorize.net: Account closure and transaction history",
      "href": "https://support.authorize.net/knowledgebase/article/000001227/en-us"
    },
    {
      "label": "Trolleys: Ending the service",
      "href": "/company/legal/merchant-services#termination"
    }
  ]
};
