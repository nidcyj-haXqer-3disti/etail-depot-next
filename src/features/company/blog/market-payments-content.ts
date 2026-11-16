import type { BlogArticle } from "./content";

/** Retired archive G0185, adapted around customer demand and a workable market launch. */
export const marketPaymentsArticle: BlogArticle = {
  path: "/company/blog/pick-the-right-payment-methods-in-a-new-country",
  title: "A new market needs more than another payment logo",
  description: "Choose payment methods for a new country by matching customer demand with account eligibility, currencies and the work that follows the sale.",
  summary: "The customer recognizes the payment button. Your business still needs to accept the payment, handle a return and explain what reached its account.",
  searchTitle: "Choosing payment methods for a new country",
  relatedPaths: ["/company/blog/b2b-payment-methods", "/company/blog/optimize-your-mobile-checkout-experience"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Country, currency and integration support", href: "https://docs.stripe.com/payments/payment-methods/payment-method-support" },
    { label: "Stripe: Customer actions and delayed payment results", href: "https://docs.stripe.com/payments/payment-methods" },
    { label: "Stripe: Charge currencies, settlement and conversion", href: "https://docs.stripe.com/currencies" },
    { label: "Adyen: Configuring and evaluating checkout choices", href: "https://docs.adyen.com/online-payments/checkout-settings" },
  ],
};
