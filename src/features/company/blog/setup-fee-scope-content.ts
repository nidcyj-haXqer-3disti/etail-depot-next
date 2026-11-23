import type { BlogArticle } from "./content";

export const setupFeeScopeArticle: BlogArticle = {
  "path": "/company/blog/payment-processing-setup-fees",
  "title": "A setup fee should buy something you can recognize",
  "description": "An account can be created long before a merchant is ready to accept, refund and reconcile a payment.",
  "summary": "Judge a payment setup fee by the deliverables: a working integration, clear handover and defined ownership when something fails after launch.",
  "searchTitle": "What should a payment processing setup fee include?",
  "relatedPaths": [
    "/company/blog/payment-processing-rfp",
    "/company/blog/get-a-merchant-account"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "what-ready-means",
      "title": "Ready for the first payment is an incomplete finish line"
    },
    {
      "id": "what-remains-after-handover",
      "title": "The useful deliverable survives the person who installed it"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Implementation and advisory services",
      "href": "https://stripe.com/professional-services"
    },
    {
      "label": "Etail Depot: Account approval and agreed services",
      "href": "/company/legal/merchant-services"
    }
  ]
};
