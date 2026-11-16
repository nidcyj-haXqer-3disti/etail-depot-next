import type { BlogArticle } from "./content";

/** Archive G0090, adapted with current payment-reference guidance. */
export const paymentReferencesArticle: BlogArticle = {
  path: "/company/blog/customer-reference-in-credit-transfers",
  title: "Payment references for bank transfers",
  description: "A payment reference helps your business recognize what incoming money is for. Choose a reference that connects the receipt to a customer or invoice, then check that it reaches the records your team uses. A reference alone does not prove that a payment arrived.",
  summary: "Choose useful bank transfer references, check what appears in your records and handle missing or unclear invoice details without misallocating payments.",
  searchTitle: "Payment references for bank transfers",
  relatedPaths: ["/company/blog/accepting-bank-transfers-for-business-payments", "/company/blog/ach-trace-number"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "choose-reference", title: "Choose a reference your team can use" },
    { id: "test-reference", title: "Check what reaches your records" },
    { id: "review-matches", title: "Review uncertain matches" },
  ],
  sources: [
    { label: "Stripe: Customer, invoice and payment references", href: "https://stripe.com/resources/more/customer-reference" },
    { label: "Nacha: Payment information and ACH trace fields", href: "https://achdevguide.nacha.org/ach-file-details" },
    { label: "Stripe documentation: Reference matching and allocation", href: "https://docs.stripe.com/payments/customer-balance/reconciliation" },
    { label: "Federal Reserve: References used in a payment inquiry", href: "https://www.frbservices.org/resources/financial-services/fedach-services-resources/exception-resolution-service-quick-reference-guide-qrg/exception-resolution-service-case-types/payment-trace-request-ptr/" },
  ],
};
