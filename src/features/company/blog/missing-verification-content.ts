import type { BlogArticle } from "./content";

export const missingVerificationArticle: BlogArticle = {
  "path": "/company/blog/requested-verification-document-unavailable",
  "title": "When you cannot provide the document, explain the missing fact.",
  "description": "A verification request can stall when a record does not exist or cannot be obtained. Clarify the purpose and ask about an accepted alternative.",
  "summary": "Resending the wrong file is rarely progress. Tell the reviewer what is unavailable and establish what would answer the request.",
  "searchTitle": "What if a Verification Document Is Unavailable?",
  "relatedPaths": [
    "/company/blog/get-a-merchant-account",
    "/company/blog/ein-confirmation-vs-application"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "state-the-gap",
      "title": "Describe the exact gap."
    },
    {
      "id": "do-not-invent-the-proof",
      "title": "A missing document should not become an invented one."
    },
    {
      "id": "a-useful-response",
      "title": "Ask for a defined next action."
    }
  ],
  "sources": [
    {
      "label": "Stripe: How accepted documents differ by country and purpose",
      "href": "https://docs.stripe.com/acceptable-verification-documents"
    },
    {
      "label": "Trolleys: Merchant Services Terms",
      "href": "/company/legal/merchant-services"
    },
    {
      "label": "Trolleys: Handling confidential application records",
      "href": "/company/legal/merchant-services#information"
    }
  ]
};
