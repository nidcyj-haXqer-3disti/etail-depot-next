import type { BlogArticle } from "./content";

export const switchingBreakEvenArticle: BlogArticle = {
  "path": "/company/blog/payment-processor-switching-break-even",
  "title": "A cheaper processor still has to earn the cost of moving",
  "description": "A rate saving competes with implementation work, disruption and every other use of the merchant’s time and money.",
  "summary": "A processor switch must recover its implementation cost. Evaluate net savings, timing and operational benefits before treating a lower rate as a business case.",
  "searchTitle": "When does switching payment processors pay for itself?",
  "relatedPaths": [
    "/company/blog/switch-payment-processors",
    "/company/blog/choose-a-merchant-services-provider"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "the-cost-of-moving",
      "title": "The saving starts later than the spending"
    },
    {
      "id": "the-reason-to-move",
      "title": "Some reasons to switch are worth more than the fee saving"
    },
    {
      "id": "a-decision-worth-making",
      "title": "The merchant should be able to choose either answer"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Payment data migration responsibilities",
      "href": "https://docs.stripe.com/get-started/data-migrations/overview"
    },
    {
      "label": "Etail Depot: Switching merchant services",
      "href": "/use-cases/switch-merchant-services"
    }
  ]
};
