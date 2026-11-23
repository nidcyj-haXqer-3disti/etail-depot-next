import type { BlogArticle } from "./content";

export const paymentFeatureSubscriptionsArticle: BlogArticle = {
  "path": "/company/blog/optional-payment-feature-subscriptions",
  "title": "Buying a payment tool does not give it an owner",
  "description": "An optional feature earns its subscription when it changes how the business operates. Somebody still has to be responsible for the result.",
  "summary": "Payment add-ons need an operating owner and a measurable purpose. A feature subscription alone does not create a fraud, reporting or recovery process.",
  "searchTitle": "Which optional payment features are worth paying for?",
  "relatedPaths": [
    "/company/blog/credit-card-account-updater",
    "/company/blog/fraud-detection-data-analytics"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "the-work-behind-the-feature",
      "title": "Start with the job that is going undone"
    },
    {
      "id": "renewal-as-a-decision",
      "title": "A subscription deserves another decision at renewal"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Fraud rule actions and testing",
      "href": "https://docs.stripe.com/radar/rules"
    },
    {
      "label": "Etail Depot: Optional service enrollment",
      "href": "/company/legal/fees#optional-service"
    }
  ]
};
