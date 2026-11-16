import type { BlogArticle } from "./content";

/** Archive G0549, adapted around the separate outcomes of billing, collecting payment and managing a subscription. */
export const recurringSubscriptionArticle: BlogArticle = {
  path: "/company/blog/recurring-payments-vs-subscription-billing",
  title: "A recurring charge is only part of the subscription",
  description: "Recurring payments collect money. Subscription billing manages what is owed as plans change. Understand the difference when upgrading, retrying or canceling.",
  summary: "A plan change can create a credit before the original bill has been paid. Keeping the agreement, invoice and payment result connected matters more than repeating a charge.",
  searchTitle: "Recurring payments vs. subscription billing",
  relatedPaths: ["/company/blog/billing-models", "/company/blog/customer-billing-portals"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Subscription invoices, collection methods and statuses", href: "https://docs.stripe.com/billing/subscriptions/overview" },
    { label: "Stripe: Plan changes, prorations and unpaid invoices", href: "https://docs.stripe.com/billing/subscriptions/prorations" },
    { label: "Stripe: Permission for future payment collection", href: "https://docs.stripe.com/payments/save-and-reuse" },
    { label: "CFPB: Stopping automatic bank payments and the underlying contract", href: "https://www.consumerfinance.gov/ask-cfpb/how-do-i-stop-automatic-payments-from-my-bank-account-en-2023/" },
  ],
};
