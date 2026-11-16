import type { BlogArticle } from "./content";

/** Archive G0002, adapted to the current merchant services offer and Blog layout. */
export const paymentProcessingArticle: BlogArticle = {
  path: "/company/blog/payment-processing-systems",
  title: "Credit card processing systems: how they work",
  description: "A card payment can be approved before the money reaches your bank. Understanding the steps in between helps you choose a provider, follow your sales and explain your payouts.",
  summary: "Understand credit card processing, from checkout and authorization to settlement and payout, plus the records and fees to check for your business.",
  searchTitle: "Credit card processing systems: how they work",
  relatedPaths: ["/company/blog/how-to-create-a-payment-link", "/company/blog/stripe-alternatives"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "parts-of-a-system", title: "Who handles each part" },
    { id: "payment-to-payout", title: "From checkout to payout" },
    { id: "choose-a-workflow", title: "Choose how customers pay" },
    { id: "check-your-records", title: "Follow the payment records" },
    { id: "compare-total-cost", title: "Understand the costs" },
    { id: "questions-before-applying", title: "One sale, several records" },
  ],
  sources: [
    { label: "Cybersource: How a payment gateway works", href: "https://www.cybersource.com/en-us/solutions/payment-acceptance/payment-gateway.html" },
    { label: "Cybersource: Financial institutions and payment networks", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/vital/sa/payments/payments-intro/payments-intro-banks-overview.html" },
    { label: "Cybersource: Authorization workflow", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/vital/sa/payments/payments-intro/payments-services-intro/payments-intro-processing-auth/payments-intro-processing-auth-workflow.html" },
    { label: "Cybersource: Capture workflow", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/vital/sa/payments/payments-intro/payments-services-intro/payments-intro-processing-capture/payments-intro-processing-capture-workflow.html" },
    { label: "Etail Depot: Payouts and reserves", href: "/company/legal/payouts-and-reserves" },
    { label: "Etail Depot: Pricing and additional fees", href: "/pricing" },
  ],
};
