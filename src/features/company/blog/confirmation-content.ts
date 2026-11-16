import type { BlogArticle } from "./content";

/** Archive G1863, adapted around the customer's experience after payment. */
export const confirmationArticle: BlogArticle = {
  path: "/company/blog/payment-confirmation-pages",
  title: "After Pay, your customer needs an answer",
  description: "A payment confirmation page should leave the customer certain about the purchase, the next step and how to get help. A thank you alone cannot do that.",
  summary: "The last screen at checkout is the first promise after the sale. Make sure its message matches the payment, the order and what your team will do next.",
  searchTitle: "Payment confirmation pages: what customers need after checkout",
  relatedPaths: ["/company/blog/payment-gateway-testing", "/company/blog/write-delivery-promise"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "GOV.UK Design System: Confirmation pages", href: "https://design-system.service.gov.uk/patterns/confirmation-pages/" },
    { label: "Cybersource: Unified Checkout payment results", href: "https://developer.cybersource.com/docs/cybs/en-us/unified-checkout/developer/all/rest/unified-checkout/uc-getting-started-cs-setup-intro/uc-getting-started-cs-js-library-intro.html" },
    { label: "Cybersource: Transaction timeout guidance", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/fdiglobal/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "W3C: Clear and accessible notifications", href: "https://www.w3.org/WAI/tutorials/forms/notifications/" },
    { label: "OWASP: Protecting access to individual records", href: "https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html" },
  ],
};
