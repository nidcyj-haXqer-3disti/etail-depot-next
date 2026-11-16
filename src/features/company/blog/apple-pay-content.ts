import type { BlogArticle } from "./content";

/** Archive G0156, adapted with current Apple and Cybersource setup guidance. */
export const applePayArticle: BlogArticle = {
  path: "/company/blog/accept-apple-pay-as-a-business",
  title: "How to accept Apple Pay on your website",
  description: "Apple Pay lets eligible customers use a card in their wallet at checkout. To offer it on your website, confirm account support, complete the setup for your platform and test the purchase from payment through refund.",
  summary: "Learn who handles Apple Pay setup, how domain verification works and what to test before offering it to customers on your website.",
  searchTitle: "How to accept Apple Pay on your website",
  relatedPaths: ["/company/blog/accelerated-guest-checkout", "/company/blog/hosted-payment-pages"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "choose-connection", title: "Start with your existing checkout" },
    { id: "verify-domain", title: "Complete the domain setup" },
    { id: "customer-experience", title: "Make the payment easy to recognize" },
    { id: "test-order", title: "Test the complete order" },
    { id: "maintain-setup", title: "Keep the setup working" },
  ],
  sources: [
    { label: "Apple: Platform and payment provider integration", href: "https://developer.apple.com/apple-pay/implementation/" },
    { label: "Cybersource: Enrolling in Apple Pay for Unified Checkout", href: "https://developer.cybersource.com/docs/cybs/en-us/unified-checkout/developer/all/rest/unified-checkout/uc-pay-methods-intro/uc-pay-methods-dig-wallets/uc-pay-methods-dig-wallets-applepay/uc-enable-digital-pay-applepay.html" },
    { label: "Apple: Troubleshooting domain verification", href: "https://developer.apple.com/documentation/technotes/tn3173-troubleshooting-issues-with-your-apple-pay-merchant-id-configuration" },
    { label: "Apple: Checkout and payment button design", href: "https://developer.apple.com/design/human-interface-guidelines/apple-pay" },
    { label: "Apple: Sandbox testing", href: "https://developer.apple.com/apple-pay/sandbox-testing/" },
    { label: "Apple: Supported purchase and browser experiences", href: "https://support.apple.com/en-us/102626" },
  ],
};
