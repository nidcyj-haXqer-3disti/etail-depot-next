import type { BlogArticle } from "./content";

/** Archive G0235, adapted to the existing Blog with current checkout and accessibility guidance. */
export const mobileCheckoutArticle: BlogArticle = {
  path: "/company/blog/optimize-your-mobile-checkout-experience",
  title: "How to improve a mobile checkout experience",
  description: "Good mobile checkout helps customers review their purchase, correct a mistake and know whether payment finished. Start by trying the whole journey on a phone.",
  summary: "Improve mobile checkout with clear totals, easier forms, wallet and bank verification checks, and five practical tests for payment errors and recovery.",
  searchTitle: "How to improve a mobile checkout experience",
  relatedPaths: ["/company/blog/payment-processing-systems", "/company/blog/how-to-create-a-payment-link"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "walk-the-journey", title: "Start with a phone" },
    { id: "make-the-order-clear", title: "Make the purchase clear" },
    { id: "make-entry-clear", title: "Make forms easier to use" },
    { id: "check-payment-methods", title: "Check wallets and bank verification" },
    { id: "test-sheet", title: "Run five checkout tests" },
    { id: "choose-changes", title: "Fix blockers, then measure" },
  ],
  sources: [
    { label: "W3C WAI: Labeling form controls", href: "https://www.w3.org/WAI/tutorials/forms/labels/" },
    { label: "W3C WAI: Form errors and notifications", href: "https://www.w3.org/WAI/tutorials/forms/notifications/" },
    { label: "web.dev: Payment and address form best practices", href: "https://web.dev/articles/payment-and-address-form-best-practices" },
    { label: "Visa Acceptance: Test your Unified Checkout setup", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/test-your-setup/" },
  ],
};
