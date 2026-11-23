import type { BlogArticle } from "./content";

export const privateStoreReviewArticle: BlogArticle = {
  "path": "/company/blog/login-required-website-merchant-review",
  "title": "A public homepage cannot explain a private store.",
  "description": "A private store or customer portal still needs an explainable buying journey. Arrange review access without exposing real customer accounts.",
  "summary": "Login-only pricing and products need a controlled way to show what is sold, charged and delivered.",
  "searchTitle": "Merchant Review for a Website That Requires Login",
  "relatedPaths": [
    "/company/blog/website-unfinished-merchant-application",
    "/company/blog/sensitive-onboarding-documents-email"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "show-the-offer",
      "title": "Explain what the public page leaves out."
    },
    {
      "id": "protect-real-accounts",
      "title": "Keep the demonstration separate from customer access."
    },
    {
      "id": "same-journey",
      "title": "Show the same commercial journey the customer will use."
    }
  ],
  "sources": [
    {
      "label": "Stripe: Its website activation requirements",
      "href": "https://support.stripe.com/questions/business-website-for-account-activation-faq"
    },
    {
      "label": "Trolleys: Business information and approved account scope",
      "href": "/company/legal/merchant-services#approval"
    },
    {
      "label": "Trolleys: Account access and secure instructions",
      "href": "/company/legal/security-policy#account-access"
    },
    {
      "label": "Trolleys: Selling and accepting payments",
      "href": "/company/legal/merchant-services#acceptance"
    }
  ]
};
