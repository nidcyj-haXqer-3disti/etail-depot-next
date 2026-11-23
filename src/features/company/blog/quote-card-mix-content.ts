import type { BlogArticle } from "./content";

export const quoteCardMixArticle: BlogArticle = {
  "path": "/company/blog/payment-quote-actual-card-mix",
  "title": "A processing quote is only as credible as its assumptions",
  "description": "Two providers can apply different assumptions to the same sales total and produce a comparison that was never fair to begin with.",
  "summary": "Card mix can change the economics of a processing quote. See why a credible proposal explains which customers and payment types it has priced.",
  "searchTitle": "Does your processing quote reflect your actual card mix?",
  "relatedPaths": [
    "/company/blog/interchange-plus-vs-flat-rate-pricing",
    "/company/blog/interchange-fees"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "the-hidden-assumption",
      "title": "The customer is part of the price"
    },
    {
      "id": "what-a-proposal-should-prove",
      "title": "A saving should be traceable"
    }
  ],
  "sources": [
    {
      "label": "Mastercard: Interchange categories and qualification criteria",
      "href": "https://www.mastercard.com/us/en/business/support/merchant-interchange-rates.html"
    },
    {
      "label": "Etail Depot: Fee calculation and card classification",
      "href": "/company/legal/fees#calculation"
    }
  ]
};
