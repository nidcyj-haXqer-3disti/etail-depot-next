import type { BlogArticle } from "./content";

/** Archive G0586, adapted around the commitment behind a subscription's payment schedule. */
export const annualMonthlyBillingArticle: BlogArticle = {
  path: "/company/blog/annual-vs-monthly-billing",
  title: "Annual billing asks for more than a payment",
  description: "Compare annual vs. monthly billing beyond the advertised discount. Understand payment schedules, contract commitments and what a renewal actually tells you.",
  summary: "An annual discount asks customers to decide today how much they will value your service later. Make that commitment clear before asking for the payment.",
  searchTitle: "Annual vs. monthly billing: price, commitment and renewal",
  relatedPaths: ["/company/blog/recurring-payments-vs-subscription-billing", "/company/blog/monthly-recurring-revenue"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Adobe: US subscription terms and cancellation policies", href: "https://helpx.adobe.com/account/individual/terms-policies-and-regulations/adobe-subscription-terms.html" },
    { label: "Stripe: Subscription billing dates", href: "https://docs.stripe.com/billing/subscriptions/billing-cycle" },
    { label: "Stripe: Recurring revenue and subscriber definitions", href: "https://docs.stripe.com/billing/subscriptions/analytics" },
    { label: "Stripe: Revenue recognition for subscriptions", href: "https://docs.stripe.com/revenue-recognition/methodology/subscriptions-and-invoicing" },
  ],
};
