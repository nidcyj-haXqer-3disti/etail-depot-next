import type { BlogArticle } from "./content";

export const disputeFeeQuotesArticle: BlogArticle = {
  "path": "/company/blog/compare-payment-dispute-fees",
  "title": "Winning a dispute and recovering its cost are different outcomes",
  "description": "The disputed sale, the response fee and the work of presenting evidence each have their own economics.",
  "summary": "Compare dispute fees across the full case. Winning may recover the sale or a response fee without returning every cost incurred by the merchant.",
  "searchTitle": "How to compare payment dispute and response fees",
  "relatedPaths": [
    "/company/blog/what-is-a-chargeback",
    "/company/blog/chargeback-representment"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "follow-the-case",
      "title": "Read the price through the whole case"
    },
    {
      "id": "the-work-before-the-fee",
      "title": "The quality of the evidence matters more than a few dollars"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Dispute fees and outcome treatment",
      "href": "https://docs.stripe.com/disputes/how-disputes-work"
    },
    {
      "label": "Etail Depot: Refunds and dispute fees",
      "href": "/company/legal/fees#refund-treatment"
    }
  ]
};
