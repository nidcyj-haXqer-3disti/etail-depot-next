import type { BlogArticle } from "./content";

/** Archive G0010, adapted around the merchant's service and account relationship. */
export const gatewayProcessorArticle: BlogArticle = {
  path: "/company/blog/payment-gateway-vs-payment-processor",
  title: "Payment gateway vs. processor: who handles your payment?",
  description: "Your checkout connection and your merchant account do different jobs. Here is how they fit together with Trolleys, and where to look when a payment needs attention.",
  summary: "A working Pay button answers only part of the question. Understand the people, accounts and records behind the sale before choosing a payment service.",
  searchTitle: "Payment gateway vs. payment processor",
  relatedPaths: ["/company/blog/merchant-accounts-and-acquiring", "/company/blog/choose-a-merchant-services-provider"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Acquirers, issuers, networks and processors", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/fdccompass/so/payments/payments-intro/payments-intro-banks-overview.html" },
    { label: "Cybersource: Capture and processor reconciliation", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/gpn/rest/payments/payments-intro/payments-services-intro/payments-intro-processing-capture.html" },
    { label: "Visa: Merchant acceptance and payment facilitator roles", href: "https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/visa-acceptance-entities.pdf" },
  ],
};
