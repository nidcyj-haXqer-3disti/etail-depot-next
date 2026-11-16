import type { BlogArticle } from "./content";

/** Archive G0405, adapted around billable units, customer behavior and explainable charges. */
export const billingModelsArticle: BlogArticle = {
  path: "/company/blog/billing-models",
  title: "Your billing model changes how customers use your product",
  description: "Flat rates, seats or usage: choose a billing model customers can understand. Real examples show why the unit you charge for matters as much as the price.",
  summary: "Charging for a seat, a message or a month creates different decisions for the customer. Define what counts before deciding how much to charge.",
  searchTitle: "How to choose a billing model: flat rate, seats or usage",
  relatedPaths: ["/company/blog/saas-payment-processing", "/company/blog/important-invoice-management-tips"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Recurring pricing models", href: "https://docs.stripe.com/products-prices/pricing-models" },
    { label: "Slack: Fair Billing Policy and active members", href: "https://slack.com/help/articles/218915077-Slacks-Fair-Billing-Policy" },
    { label: "Twilio: SMS message segments and billing", href: "https://www.twilio.com/docs/glossary/what-sms-character-limit" },
    { label: "Stripe: Usage alerts and threshold notifications", href: "https://docs.stripe.com/billing/subscriptions/usage-based/alerts" },
  ],
};
