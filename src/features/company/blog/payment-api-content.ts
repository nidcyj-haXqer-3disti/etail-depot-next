import type { BlogArticle } from "./content";

/** Archive G1960, adapted around the business work a payment API should connect. */
export const paymentApiArticle: BlogArticle = {
  path: "/company/blog/payment-apis",
  title: "What a payment API should do for your business",
  description: "Payment APIs connect orders, payment actions and records. Understand what your business should expect from the integration, including refunds and uncertain results.",
  summary: "Your team should be able to explain a payment without piecing it together across screens. That is a better measure of an API integration than a working Pay button.",
  searchTitle: "Payment APIs explained: orders, refunds and business records",
  relatedPaths: ["/company/blog/integrate-a-payment-gateway-into-a-website", "/company/blog/payment-gateway-testing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Capture and the original authorization", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/ctv/rest/payments/payments-intro/payments-services-intro/payments-intro-processing-capture.html" },
    { label: "Cybersource: Linked refunds and access controls", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/ctv/rest/payments/payments-intro/payments-services-intro/payments-intro-processing-credit.html" },
    { label: "Cybersource: Recovering an uncertain transaction result", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/ctv/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "OWASP: Validating orders and payment results", href: "https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Payment_Gateway_Integration_Cheat_Sheet.html" },
  ],
};
