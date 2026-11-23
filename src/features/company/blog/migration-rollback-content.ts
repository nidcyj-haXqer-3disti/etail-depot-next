import type { BlogArticle } from "./content";

export const migrationRollbackArticle: BlogArticle = {
  "path": "/company/blog/payment-migration-rollback-decision",
  "title": "You can restore yesterday’s checkout. You cannot erase today’s payments.",
  "description": "A rollback plan must account for transactions already attempted, not just the version of software on the website.",
  "summary": "Plan a processor migration rollback around payment state, authorized access and clear decision ownership. Restoring old software must not duplicate or lose payments already attempted.",
  "searchTitle": "Planning a payment processor migration rollback",
  "relatedPaths": [
    "/company/blog/switch-payment-processors",
    "/company/blog/pending-authorizations-processor-migration"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "Cybersource: Resolving unknown transaction results",
      "href": "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/spg/rest/payments/payments-intro/timeouts-intro.html"
    },
    {
      "label": "Trolleys: Service responsibilities",
      "href": "/company/legal/merchant-services#service-commitments"
    },
    {
      "label": "Trolleys: Ending the service",
      "href": "/company/legal/merchant-services#termination"
    }
  ]
};
