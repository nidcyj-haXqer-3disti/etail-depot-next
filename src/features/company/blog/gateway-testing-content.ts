import type { BlogArticle } from "./content";

/** Archive G1862, adapted around a merchant's decision to launch checkout. */
export const gatewayTestingArticle: BlogArticle = {
  path: "/company/blog/payment-gateway-testing",
  title: "One approved payment does not mean checkout is ready",
  description: "A successful test payment is a useful start. Before customers rely on your checkout, ask what happens when a payment is declined, interrupted or needs to be refunded.",
  summary: "Payment gateway testing should give a merchant evidence to launch: clear customer outcomes, traceable account records and a team that can handle the exceptions.",
  searchTitle: "Payment gateway testing: what merchants should verify",
  relatedPaths: ["/company/blog/mobile-app-payment-gateway-integration", "/company/blog/consuming-webhooks"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Sandbox boundaries and processor testing", href: "https://developer.cybersource.com/hello-world/testing-guide.html" },
    { label: "Cybersource: Testing a Unified Checkout integration", href: "https://developer.cybersource.com/docs/cybs/en-us/unified-checkout/developer/all/rest/unified-checkout/uc-qs-intro/uc-qsg-step5.html" },
    { label: "Cybersource: Authorization and capture configuration", href: "https://developer.cybersource.com/docs/cybs/en-us/unified-checkout/developer/all/rest/unified-checkout/uc-setup-capture-context/uc-capture-context-features/uc-cc-complete-mandate/uc-cc-complete-type.html" },
    { label: "Cybersource: Transaction timeout guidance", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/fdiglobal/rest/payments/payments-intro/timeouts-intro.html" },
  ],
};
