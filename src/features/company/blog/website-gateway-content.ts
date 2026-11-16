import type { BlogArticle } from "./content";

/** Archive G1927, adapted around checkout ownership and the developer handoff. */
export const websiteGatewayArticle: BlogArticle = {
  path: "/company/blog/integrate-a-payment-gateway-into-a-website",
  title: "Who owns your checkout after the developer leaves?",
  description: "Integrating a payment gateway into a website means more than adding a Pay button. Choose a supported connection and keep control of accounts, orders and maintenance.",
  summary: "Your new checkout looks finished. But can your team find a payment, issue a refund and keep the connection working without the person who built it?",
  searchTitle: "How to integrate a payment gateway into a website",
  relatedPaths: ["/company/blog/payment-gateway-testing", "/company/blog/payment-confirmation-pages"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Unified Checkout enablement and integration", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/get-started/" },
    { label: "Visa Acceptance Solutions: Checkout sessions and approved website origins", href: "https://docs.visaacceptance.com/experience/merchant/checkout/unified-checkout/integration-guide/session/session/" },
    { label: "OWASP: Secure payment gateway integration", href: "https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Payment_Gateway_Integration_Cheat_Sheet.html" },
    { label: "PCI Security Standards Council: Embedded payment forms and script security", href: "https://www.pcisecuritystandards.org/faqs/1588/" },
  ],
};
