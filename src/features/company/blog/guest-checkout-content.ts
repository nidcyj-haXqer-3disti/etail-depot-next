import type { BlogArticle } from "./content";

/** Archive G0030, adapted with current guest checkout and wallet guidance. */
export const guestCheckoutArticle: BlogArticle = {
  path: "/company/blog/accelerated-guest-checkout",
  title: "Accelerated guest checkout: make saved details easy to review",
  description: "Saved details can reduce typing without requiring an account with your store. A useful shortcut still lets the customer check the delivery address, understand the total and choose another way to pay.",
  summary: "Understand accelerated guest checkout, saved payment details and express buttons, with practical checks for order review, recovery and payment setup.",
  searchTitle: "Accelerated guest checkout: how it works",
  relatedPaths: ["/company/blog/optimize-your-mobile-checkout-experience", "/company/blog/cart-abandonment-vs-checkout-abandonment"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "what-accelerates", title: "Understand the shortcut" },
    { id: "review-details", title: "Keep order review visible" },
    { id: "fallback", title: "Make the other routes work" },
    { id: "setup", title: "Check your payment setup" },
    { id: "measure", title: "Measure completed orders" },
  ],
  sources: [
    { label: "web.dev: Payment and address form best practices", href: "https://web.dev/articles/payment-and-address-form-best-practices" },
    { label: "PayPal: Accelerated guest checkout and Fastlane", href: "https://www.paypal.com/us/brc/article/boost-conversion-with-accelerated-guest-checkout-webinar" },
    { label: "Shopify: Accelerated checkouts and buttons", href: "https://help.shopify.com/en/manual/payments/accelerated-checkouts" },
    { label: "Visa Acceptance: Digital wallets and Click to Pay", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/configuration/payment-methods/digital-wallets/" },
    { label: "Visa Acceptance: Configure Unified Checkout", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/configuration/configuration/" },
  ],
};
