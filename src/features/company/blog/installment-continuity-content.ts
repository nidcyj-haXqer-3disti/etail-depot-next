import type { BlogArticle } from "./content";

export const installmentContinuityArticle: BlogArticle = {
  "path": "/company/blog/installment-payments-processor-switch",
  "title": "The remaining installments are not a new sale",
  "description": "Before moving a payment plan, establish who is owed the money, who may collect it and how the customer’s existing agreement continues.",
  "summary": "Distinguish merchant-managed installment collections from third-party financing when changing processors. Preserve the remaining balance, customer authority and servicing responsibilities.",
  "searchTitle": "Installment plans when changing payment processors",
  "relatedPaths": [
    "/company/blog/card-on-file",
    "/company/blog/subscription-billing-after-customer-import"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "identify-the-obligation",
      "title": "Establish who owns the remaining work"
    },
    {
      "id": "preserve-the-promise",
      "title": "Move only what is supported and authorized"
    }
  ],
  "sources": [
    {
      "label": "Affirm: Merchant payment and customer financing",
      "href": "https://docs.affirm.com/platforms/docs/websell"
    },
    {
      "label": "Trolleys: Merchant Service Order",
      "href": "/company/legal/merchant-services#service-order"
    },
    {
      "label": "Trolleys: Ending the service",
      "href": "/company/legal/merchant-services#termination"
    }
  ]
};
