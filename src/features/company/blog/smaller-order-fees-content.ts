import type { BlogArticle } from "./content";

export const smallerOrderFeesArticle: BlogArticle = {
  "path": "/company/blog/how-smaller-orders-change-processing-costs",
  "title": "More orders can make the same revenue more expensive",
  "description": "When baskets shrink, the work of serving each sale does not necessarily shrink with them.",
  "summary": "Smaller baskets can raise payment and fulfillment costs without changing revenue. Look at contribution and customer behavior before trying to raise order value.",
  "searchTitle": "How smaller orders change payment processing costs",
  "relatedPaths": [
    "/company/blog/payment-capture",
    "/company/blog/contribution-margin"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "why-the-baskets-shrank",
      "title": "The cause matters more than the average"
    },
    {
      "id": "the-cost-of-fixing-it",
      "title": "A larger basket has to be earned"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Percentage and fixed fees per successful card transaction",
      "href": "https://stripe.com/pricing"
    },
    {
      "label": "Etail Depot: Charging events and multiple capture terms",
      "href": "/company/legal/fees#calculation"
    }
  ]
};
