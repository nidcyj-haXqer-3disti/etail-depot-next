import type { BlogArticle } from "./content";

export const retirePaymentAccessArticle: BlogArticle = {
  "path": "/company/blog/retire-payment-credentials-after-migration",
  "title": "The old checkout is gone. Its access may still be active.",
  "description": "Leaving unused credentials active creates exposure. Removing every connection at once can strand the work still attached to the old account.",
  "summary": "After a payment migration, separate obsolete checkout access from authorized historical operations. Retire credentials and integrations without losing required refund, reporting or dispute access.",
  "searchTitle": "Retiring payment credentials after switching processors",
  "relatedPaths": [
    "/company/blog/payment-provider-contractor-access",
    "/company/blog/switch-payment-processors"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "access-follows-a-job",
      "title": "Give every remaining connection a current purpose"
    },
    {
      "id": "finish-the-retirement",
      "title": "Complete closure without deleting the business record"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Key permissions and retirement",
      "href": "https://docs.stripe.com/keys"
    },
    {
      "label": "Trolleys: Account access and security",
      "href": "/company/legal/security-policy#account-access"
    },
    {
      "label": "Trolleys: Ending the service",
      "href": "/company/legal/merchant-services#termination"
    }
  ]
};
