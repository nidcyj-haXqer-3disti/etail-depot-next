import type { BlogArticle } from "./content";

export const firstStatementArticle: BlogArticle = {
  "path": "/company/blog/first-payment-processing-statement",
  "title": "The first processing bill is where the sales conversation becomes real",
  "description": "An unusual opening bill can be legitimate. It should still show which costs belong to setup and which will follow the business every month.",
  "summary": "Read a first processing statement for setup charges, partial billing periods and recurring costs. Establish the normal bill before treating the opening total as your ongoing price.",
  "searchTitle": "Understanding your first payment processing statement",
  "relatedPaths": [
    "/company/blog/payment-processing-setup-fees",
    "/company/blog/sample-invoice-payment-quote"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "build-the-ordinary-bill",
      "title": "Separate the opening cost from the ongoing cost"
    },
    {
      "id": "test-the-handoff",
      "title": "Check what survived the handoff to billing"
    }
  ],
  "sources": [
    {
      "label": "Authorize.net: Gateway fee definitions",
      "href": "https://account.authorize.net/help/Account/Merchant_Profile/Fee_Definitions.htm"
    },
    {
      "label": "Trolleys: Merchant Service Order",
      "href": "/company/legal/merchant-services#service-order"
    },
    {
      "label": "Trolleys: Account billing terms",
      "href": "/company/legal/fees#billing-record"
    }
  ]
};
