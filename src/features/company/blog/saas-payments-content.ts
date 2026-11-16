import type { BlogArticle } from "./content";

/** Archive G0283, adapted with current subscription lifecycle and recurring payment guidance. */
export const saasPaymentsArticle: BlogArticle = {
  path: "/company/blog/saas-payment-processing",
  title: "SaaS payment processing: billing, collection and access",
  description: "SaaS payment processing collects fees for access to software. A workable setup connects the subscription agreement, invoices, payment results and the features a customer can use. This article concerns a software company charging for its own product; accepting payments on behalf of its customers is a different service.",
  summary: "Connect SaaS billing, recurring payments and software access. Plan for upgrades, failed renewals, cancellation and recovery without confusing their records.",
  searchTitle: "SaaS payment processing: billing, collection and access",
  relatedPaths: ["/company/blog/card-on-file", "/company/blog/how-recurring-ach-payments-work"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "separate-states", title: "Separate the promise from the payment" },
    { id: "plan-change", title: "Make a plan change understandable" },
    { id: "failure-policy", title: "Write a failure and recovery policy" },
    { id: "buying-test", title: "Choose around your billing model" },
  ],
  sources: [
    { label: "Stripe: Subscription, invoice and payment states", href: "https://docs.stripe.com/billing/subscriptions/overview" },
    { label: "Stripe: Prorations and unpaid invoices", href: "https://docs.stripe.com/billing/subscriptions/prorations" },
    { label: "Stripe: Cancellation dates and final invoices", href: "https://docs.stripe.com/billing/subscriptions/cancel" },
    { label: "Stripe: Payment retry controls and limitations", href: "https://docs.stripe.com/billing/revenue-recovery/smart-retries" },
    { label: "Cybersource: Recurring Billing", href: "https://developer.cybersource.com/docs/cybs/en-us/recurring-billing/user/all/rest/recurring-billing-user.html" },
    { label: "Etail Depot: Merchant service terms and enabled methods", href: "/company/legal/merchant-services" },
  ],
};
