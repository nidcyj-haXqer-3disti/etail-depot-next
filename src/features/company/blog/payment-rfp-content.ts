import type { BlogArticle } from "./content";

/** Archive G0251, adapted with current procurement and provider-responsibility guidance. */
export const paymentRfpArticle: BlogArticle = {
  path: "/company/blog/payment-processing-rfp",
  title: "How to write a payment processing RFP",
  description: "A payment processing request for proposal helps providers answer the same business requirements. Describe what you need, ask for evidence and compare the complete offer before choosing who will handle your payments.",
  summary: "Build a useful payment processing RFP with comparable answers, a reporting demonstration and clear questions about fees, implementation, security and exit terms.",
  searchTitle: "How to write a payment processing RFP",
  relatedPaths: ["/company/blog/choose-a-merchant-services-provider", "/company/blog/switch-payment-processors"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "define-the-decision", title: "Start with the decision you need to make" },
    { id: "compare-provider-answers", title: "Give every provider the same response format" },
    { id: "test-reporting-promise", title: "Turn a reporting promise into a demonstration" },
    { id: "review-complete-offer", title: "Review the cost and the work behind it" },
    { id: "record-selection", title: "Keep the decision useful after selection" },
  ],
  sources: [
    { label: "Stripe: Payments provider RFP guide", href: "https://stripe.com/guides/guide-to-payments-provider-rfp" },
    { label: "Adyen: Evaluating payments RFPs beyond processing fees", href: "https://www.adyen.com/knowledge-hub/payments-rfp" },
    { label: "PCI SSC: Merchant responsibilities when outsourcing payments", href: "https://www.pcisecuritystandards.org/faqs/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/" },
    { label: "Stripe: Payment data migration planning", href: "https://docs.stripe.com/get-started/data-migrations/overview" },
    { label: "Etail Depot: Pricing and additional fees", href: "/pricing" },
  ],
};
