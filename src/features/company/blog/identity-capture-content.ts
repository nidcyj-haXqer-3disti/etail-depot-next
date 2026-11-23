import type { BlogArticle } from "./content";

export const identityCaptureArticle: BlogArticle = {
  "path": "/company/blog/identity-document-upload-rejected",
  "title": "The ID is real. The upload can still be unusable.",
  "description": "Glare, missing edges and expired documents can prevent identity review. Fix the actual problem before repeating the same upload.",
  "summary": "An identity upload can fail because information was lost in the photograph. More attempts with the same file will not restore it.",
  "searchTitle": "Why an Identity Document Upload Gets Rejected",
  "relatedPaths": [
    "/company/blog/sensitive-onboarding-documents-email",
    "/company/blog/requested-verification-document-unavailable"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "image-or-record",
      "title": "Read the reason before taking another picture."
    },
    {
      "id": "expiry",
      "title": "A document can become a problem while the application is open."
    },
    {
      "id": "resubmit-with-a-purpose",
      "title": "Make the next attempt answer the actual request."
    }
  ],
  "sources": [
    {
      "label": "Stripe: Its identity document capture requirements",
      "href": "https://support.stripe.com/questions/uploading-photo-of-government-issued-id-faq"
    },
    {
      "label": "Stripe: How accepted documents differ by country and purpose",
      "href": "https://docs.stripe.com/acceptable-verification-documents"
    },
    {
      "label": "Trolleys: Account access and secure instructions",
      "href": "/company/legal/security-policy#account-access"
    }
  ]
};
