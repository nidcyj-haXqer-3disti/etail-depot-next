import type { BlogArticle } from "./content";

/** Archive G0059, adapted to the current Blog with explicit measurement definitions. */
export const checkoutAbandonmentArticle: BlogArticle = {
  path: "/company/blog/cart-abandonment-vs-checkout-abandonment",
  title: "Cart abandonment vs. checkout abandonment",
  description: "Some shoppers leave before checkout. Others start entering their details and stop before placing an order. Separating those stages helps you decide what to investigate first.",
  summary: "Understand cart and checkout abandonment, calculate each rate correctly, check your analytics and identify where customers leave the purchase journey.",
  searchTitle: "Cart abandonment vs. checkout abandonment",
  relatedPaths: ["/company/blog/optimize-your-mobile-checkout-experience", "/company/blog/payment-processing-systems"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "define-stages", title: "Define the stages first" },
    { id: "worked-example", title: "Calculate the rates" },
    { id: "validate", title: "Check the counts" },
    { id: "investigate", title: "Find the next problem to test" },
    { id: "measure-changes", title: "Measure after the fix" },
  ],
  sources: [
    { label: "Stripe: Cart abandonment and checkout abandonment", href: "https://stripe.com/resources/more/cart-abandonment-vs-checkout-abandonment" },
    { label: "Google Analytics: Measure ecommerce events", href: "https://developers.google.com/analytics/devguides/collection/ga4/ecommerce" },
    { label: "Google Analytics: Funnel exploration", href: "https://support.google.com/analytics/answer/9327974" },
    { label: "Google Analytics: Avoid duplicate purchase events", href: "https://support.google.com/analytics/answer/12313109" },
  ],
};
