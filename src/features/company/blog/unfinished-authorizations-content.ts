import type { BlogArticle } from "./content";

export const unfinishedAuthorizationsArticle: BlogArticle = {
  "path": "/company/blog/pending-authorizations-processor-migration",
  "title": "An authorization is unfinished business when you change processors",
  "description": "Before moving new sales, establish how orders already authorized will be completed, canceled or investigated.",
  "summary": "Pending authorizations and unsettled payments need their own processor migration plan. Confirm the original references, payment state and supported completion route before acting.",
  "searchTitle": "Pending authorizations during a processor change",
  "relatedPaths": [
    "/company/blog/payment-capture",
    "/company/blog/switch-payment-processors"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "identify-the-open-work",
      "title": "Separate approval from completed collection"
    },
    {
      "id": "resolve-before-retrying",
      "title": "Do not turn uncertainty into a second payment"
    }
  ],
  "sources": [
    {
      "label": "Authorize.net: Changing the connected processor",
      "href": "https://support.authorize.net/knowledgebase/article/000001990/en-us"
    },
    {
      "label": "Cybersource: Resolving unknown transaction results",
      "href": "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/spg/rest/payments/payments-intro/timeouts-intro.html"
    },
    {
      "label": "Trolleys: Ending the service",
      "href": "/company/legal/merchant-services#termination"
    }
  ]
};
