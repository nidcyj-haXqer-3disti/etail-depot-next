import type { BlogArticle } from "./content";

export const completeBankEvidenceArticle: BlogArticle = {
  "path": "/company/blog/cropped-bank-statement-verification",
  "title": "The cropped statement may have removed the part the reviewer needed.",
  "description": "Bank verification depends on connecting the account to its holder. Ask what must remain visible before cropping or masking a statement.",
  "summary": "A balance alone does not identify a receiving account. Preserve the information needed for the actual verification request.",
  "searchTitle": "Why a Cropped Bank Statement Can Delay Verification",
  "relatedPaths": [
    "/company/blog/merchant-application-before-first-bank-statement",
    "/company/blog/sensitive-onboarding-documents-email"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "what-is-being-checked",
      "title": "Find out what the statement is supposed to establish."
    },
    {
      "id": "original-file",
      "title": "Work from the bank’s record."
    }
  ],
  "sources": [
    {
      "label": "Stripe: Its bank ownership verification requirements",
      "href": "https://support.stripe.com/questions/verify-your-bank-account-ownership"
    },
    {
      "label": "Trolleys: Account access and secure instructions",
      "href": "/company/legal/security-policy#account-access"
    },
    {
      "label": "Trolleys: Handling confidential application records",
      "href": "/company/legal/merchant-services#information"
    }
  ]
};
