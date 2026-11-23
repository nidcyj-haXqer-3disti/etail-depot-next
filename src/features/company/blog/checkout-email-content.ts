import type { BlogArticle } from "./content";

export const checkoutEmailArticle: BlogArticle = {
  "path": "/company/blog/checkout-email-typos-corrections",
  "title": "Correct the email. Do not guess who should receive the order.",
  "description": "Help customers spot an email typo before purchase without silently changing the recipient. A plausible address is not proof of mailbox ownership.",
  "summary": "A helpful suggestion becomes a privacy problem when the store accepts it on the customer’s behalf.",
  "searchTitle": "Checkout Email Typos: Suggest Corrections Without Rewriting",
  "relatedPaths": [
    "/company/blog/payment-confirmation-pages",
    "/company/blog/checkout-login-guest-purchase"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "U.S. Web Design System: Email entry and typo suggestions",
      "href": "https://designsystem.digital.gov/patterns/create-a-user-profile/email-address/"
    },
    {
      "label": "Trolleys: Handling customer information",
      "href": "/company/legal/merchant-services#information"
    },
    {
      "label": "Trolleys: Clear purchase details before payment",
      "href": "/company/legal/merchant-services#acceptance"
    }
  ]
};
