import type { BlogArticle } from "./content";

/** Archive G0327, reviewed against current provider documentation and the Etail offer. */
export const stripeAlternativesArticle: BlogArticle = {
  path: "/company/blog/stripe-alternatives",
  title: "Stripe alternatives: Stripe vs. Trolleys",
  description: "The right payment provider needs to fit how you sell, how your website works and how you manage your account. A matching headline rate is only the beginning.",
  summary: "Compare Stripe and Trolleys, an Etail Depot service, on checkout options, fees, payouts and support, with practical questions to ask before changing payment providers.",
  searchTitle: "Stripe alternatives: Stripe vs. Trolleys",
  relatedPaths: ["/company/blog/how-to-create-a-payment-link", "/company/blog/what-your-payment-provider-is-really-saying-yes-to"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "payment-workflow", title: "Start with how you sell" },
    { id: "checkout-options", title: "Compare checkout options" },
    { id: "compare-pricing", title: "Compare total costs" },
    { id: "payouts-and-approval", title: "Check approval and payouts" },
    { id: "support-and-records", title: "Ask about support and records" },
    { id: "before-switching", title: "Before you switch" },
  ],
  sources: [
    { label: "Stripe: US pricing", href: "https://stripe.com/pricing" },
    { label: "Stripe: Payment Links", href: "https://docs.stripe.com/payment-links" },
    { label: "Stripe: Online payment options", href: "https://docs.stripe.com/payments/online-payments" },
    { label: "Stripe: Payout timing", href: "https://docs.stripe.com/payouts" },
    { label: "Cybersource: Recurring Billing", href: "https://developer.cybersource.com/docs/cybs/en-us/recurring-billing/user/all/rest/recurring-billing-user.html" },
    { label: "Etail Depot: Pricing and additional fees", href: "/pricing" },
    { label: "Etail Depot: Switching merchant services", href: "/use-cases/switch-merchant-services" },
  ],
};
