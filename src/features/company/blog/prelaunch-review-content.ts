import type { BlogArticle } from "./content";

export const prelaunchReviewArticle: BlogArticle = {
  "path": "/company/blog/website-unfinished-merchant-application",
  "title": "The website is nearly finished. Is the business ready to be reviewed?",
  "description": "A staging site can explain a proposed store, but unfinished policies and placeholder products leave real questions. Separate review readiness from launch readiness.",
  "summary": "Coming soon is a marketing message. It gives a payment reviewer very little to assess.",
  "searchTitle": "Applying for Payments Before Your Website Launches",
  "relatedPaths": [
    "/company/blog/create-an-online-shop",
    "/company/blog/login-required-website-merchant-review"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "reviewable-business",
      "title": "Make the commercial offer reviewable."
    },
    {
      "id": "work-in-parallel",
      "title": "Keep the launch dependencies visible."
    },
    {
      "id": "the-published-version",
      "title": "The site launched should be the business that was reviewed."
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
      "label": "Trolleys: Merchant Service Order",
      "href": "/company/legal/merchant-services#service-order"
    },
    {
      "label": "Trolleys: Selling and accepting payments",
      "href": "/company/legal/merchant-services#acceptance"
    }
  ]
};
