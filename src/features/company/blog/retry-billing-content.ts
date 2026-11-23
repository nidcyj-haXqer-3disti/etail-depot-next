import type { BlogArticle } from "./content";

export const retryBillingArticle: BlogArticle = {
  "path": "/company/blog/subscription-retry-gateway-costs",
  "title": "More payment retries do not necessarily mean more recovered revenue",
  "description": "A recovery system earns its cost when it collects money that would otherwise remain unpaid, within the rules and permissions that apply.",
  "summary": "Subscription retries can create gateway costs without recovering every invoice. Measure executed attempts, recovered payments and customer outcomes together.",
  "searchTitle": "Subscription retry costs and recovered payments",
  "relatedPaths": [
    "/company/blog/authorization-fees-failed-payments",
    "/company/blog/annual-renewal-processing-costs"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "the-recovery-group",
      "title": "Follow the same unpaid invoices"
    },
    {
      "id": "recovery-without-noise",
      "title": "Persistence has limits"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Executed and scheduled payment retries",
      "href": "https://docs.stripe.com/billing/revenue-recovery/smart-retries"
    },
    {
      "label": "Authorize.net: Gateway fee definitions",
      "href": "https://account.authorize.net/help/Account/Merchant_Profile/Fee_Definitions.htm"
    },
    {
      "label": "Trolleys: Fees and billing",
      "href": "/company/legal/fees"
    }
  ]
};
