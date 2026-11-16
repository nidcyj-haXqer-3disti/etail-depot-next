import type { BlogArticle } from "./content";

/** Archive G0231, adapted with current checkout usability guidance. */
export const checkoutLayoutArticle: BlogArticle = {
  path: "/company/blog/one-page-checkout-vs-multistep-checkout",
  title: "One page vs. multistep checkout: which fits your store?",
  description: "A one page checkout brings order, delivery and payment details into one view. A multistep checkout divides them into stages. The better choice helps your customers enter, review and correct the information their order needs.",
  summary: "Compare checkout layouts by the work customers must do to complete and correct an order, including on a phone.",
  searchTitle: "One page vs. multistep checkout: a merchant guide",
  relatedPaths: ["/company/blog/optimize-your-mobile-checkout-experience", "/company/blog/cart-abandonment-vs-checkout-abandonment"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "start-with-order", title: "Start with what the order needs" },
    { id: "compare-layouts", title: "Compare the work in each layout" },
    { id: "check-platform", title: "Check what your platform controls" },
    { id: "test-corrections", title: "Test corrections before comparing results" },
    { id: "measure-completion", title: "Measure completed orders, not fewer clicks" },
  ],
  sources: [
    { label: "Baymard Institute: Form fields and checkout effort", href: "https://baymard.com/research-articles/checkout-flow-average-form-fields" },
    { label: "W3C WAI: Progress and navigation in forms with multiple pages", href: "https://www.w3.org/WAI/tutorials/forms/multi-page/" },
    { label: "W3C WAI: Clear form errors and confirmation messages", href: "https://www.w3.org/WAI/tutorials/forms/notifications/" },
    { label: "web.dev: Payment and address form best practices", href: "https://web.dev/articles/payment-and-address-form-best-practices" },
    { label: "Shopify: Comparing checkout layouts", href: "https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/one-page-checkout" },
    { label: "Google Analytics: Checkout and purchase events", href: "https://developers.google.com/analytics/devguides/collection/ga4/ecommerce" },
  ],
};
