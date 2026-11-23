import type { BlogArticle } from "./content";

export const firstBankStatementArticle: BlogArticle = {
  "path": "/company/blog/merchant-application-before-first-bank-statement",
  "title": "The bank account is open. The first statement does not exist yet.",
  "description": "A new business can reach payment onboarding before its first statement cycle. Explain the timing and confirm acceptable bank evidence before launch.",
  "summary": "A real business account can be newer than the statement requested to verify it. Handle the timing honestly.",
  "searchTitle": "Merchant Application Before Your First Bank Statement",
  "relatedPaths": [
    "/company/blog/requested-verification-document-unavailable",
    "/company/blog/cropped-bank-statement-verification"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "purpose-of-the-request",
      "title": "Bank ownership and trading history are different requests."
    },
    {
      "id": "launch-timing",
      "title": "Keep the launch plan honest about what is ready."
    }
  ],
  "sources": [
    {
      "label": "Stripe: Its bank ownership verification requirements",
      "href": "https://support.stripe.com/questions/verify-your-bank-account-ownership"
    },
    {
      "label": "Trolleys: Merchant Services Terms",
      "href": "/company/legal/merchant-services"
    },
    {
      "label": "Trolleys: Merchant account setup",
      "href": "/resources/merchant-account-setup"
    }
  ]
};
