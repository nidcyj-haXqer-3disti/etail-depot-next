import type { BlogArticle } from "./content";

/** Archive G0191, adapted with current migration and account closure guidance. */
export const switchingProcessorsArticle: BlogArticle = {
  path: "/company/blog/switch-payment-processors",
  title: "How to switch payment processors",
  description: "Switching payment processors means moving new payments while keeping earlier transactions manageable. Confirm your new account, plan what can transfer and test the complete payment journey. Keep a clear route for refunds, disputes and funds still with the previous provider.",
  summary: "Plan a payment processor switch, including saved cards, subscriptions, checkout testing, old transactions and account closure.",
  searchTitle: "How to switch payment processors",
  relatedPaths: ["/company/blog/choose-a-merchant-services-provider", "/company/blog/evaluate-and-manage-multiple-payment-processors"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "plan-the-switch", title: "Confirm the new setup before setting a date" },
    { id: "map-what-moves", title: "Separate what moves from what stays" },
    { id: "test-the-journey", title: "Test the complete payment journey" },
    { id: "move-new-payments", title: "Give each payment one processing route" },
    { id: "keep-old-payments-accessible", title: "Keep earlier payments manageable" },
  ],
  sources: [
    { label: "Stripe: Planning a payment processor switch", href: "https://stripe.com/resources/more/how-to-switch-payment-processors" },
    { label: "Stripe: Secure payment data migration", href: "https://docs.stripe.com/get-started/data-migrations/overview" },
    { label: "Stripe: Subscription records and billing dates during migration", href: "https://docs.stripe.com/billing/subscriptions/import-subscriptions" },
    { label: "Cybersource: Resolving an unknown payment result", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/spg/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Stripe: Account closure and outstanding obligations", href: "https://support.stripe.com/questions/close-a-stripe-account" },
    { label: "Etail Depot: Switching merchant services", href: "/use-cases/switch-merchant-services" },
  ],
};
