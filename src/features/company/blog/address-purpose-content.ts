import type { BlogArticle } from "./content";

export const addressPurposeArticle: BlogArticle = {
  "path": "/company/blog/business-personal-address-verification",
  "title": "Whose address are you being asked to prove?",
  "description": "A business address, an owner’s home and a mailing address serve different purposes. The right evidence starts with understanding the question.",
  "summary": "One utility bill may contain an address and still say nothing about the person or business under review.",
  "searchTitle": "Business vs. Personal Address Evidence in Onboarding",
  "relatedPaths": [
    "/company/blog/registered-agent-address-merchant-application",
    "/company/blog/business-address-mismatch-onboarding"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "person-business-purpose",
      "title": "Read the field as a full question."
    },
    {
      "id": "home-business",
      "title": "Working from home deserves an accurate answer."
    }
  ],
  "sources": [
    {
      "label": "Stripe: Its identity and residential address verification requirements",
      "href": "https://support.stripe.com/questions/documents-for-identity-and-home-address-verification"
    },
    {
      "label": "Trolleys: Identifying the business and approved account",
      "href": "/company/legal/merchant-services#service-order"
    },
    {
      "label": "Trolleys: Merchant account setup",
      "href": "/resources/merchant-account-setup"
    }
  ]
};
