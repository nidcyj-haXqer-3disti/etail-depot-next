import type { BlogArticle } from "./content";

export const failedAttemptCostsArticle: BlogArticle = {
  "path": "/company/blog/authorization-fees-failed-payments",
  "title": "A decline can cost money before it costs you a customer",
  "description": "Unsuccessful payments deserve attention for the operational problem they reveal, as well as any fee attached to them.",
  "summary": "Declines and retries can produce billable gateway events. Trace the failed attempts to the integration before treating them as a pricing problem.",
  "searchTitle": "Authorization fees, declined payments and retry costs",
  "relatedPaths": [
    "/company/blog/credit-card-declines",
    "/company/blog/payment-api-retries"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "read-the-failed-attempts",
      "title": "The fee may be a symptom"
    },
    {
      "id": "a-price-for-which-event",
      "title": "Price the event you actually generate"
    }
  ],
  "sources": [
    {
      "label": "Authorize.net: Transaction fee definitions",
      "href": "https://account.authorize.net/help/Account/Merchant_Profile/Fee_Definitions.htm"
    },
    {
      "label": "Authorize.net: Communication Error status and fee treatment",
      "href": "https://support.authorize.net/knowledgebase/Knowledgearticle/?code=000001418"
    },
    {
      "label": "Etail Depot: Standard processing fee and separate event fees",
      "href": "/company/legal/fees#calculation"
    }
  ]
};
