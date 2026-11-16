import type { BlogArticle } from "./content";

/** Archive G0101, adapted with current payment lifecycle and reporting guidance. */
export const ecommercePaymentsArticle: BlogArticle = {
  path: "/company/blog/ecommerce-payment-processing",
  title: "Ecommerce payment processing: from checkout to payout",
  description: "Ecommerce payment processing connects a customer’s order with a payment result and, later, the movement of funds. For an online retailer, the practical task is keeping order, payment and delivery records consistent when a customer pays, retries, cancels or asks for a refund.",
  summary: "Follow an online order from checkout to payout. Understand authorization, capture, payment records and how to handle timeouts without duplicate charges.",
  searchTitle: "Ecommerce payment processing: from checkout to payout",
  relatedPaths: ["/company/blog/payment-processing-systems", "/company/blog/payment-settlement-and-payouts"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "three-records", title: "Keep three records connected" },
    { id: "worked-order", title: "Follow one order through the records" },
    { id: "uncertain-results", title: "Check an uncertain result before collecting again" },
    { id: "choose-fit", title: "Evaluate the whole operating flow" },
  ],
  sources: [
    { label: "Cybersource: Card authorization workflow", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/vital/sa/payments/payments-intro/payments-services-intro/payments-intro-processing-auth/payments-intro-processing-auth-workflow.html" },
    { label: "Cybersource: Capture workflow and processor reports", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/vital/sa/payments/payments-intro/payments-services-intro/payments-intro-processing-capture/payments-intro-processing-capture-workflow.html" },
    { label: "Stripe: Payment records and interrupted checkout", href: "https://docs.stripe.com/payments/payment-intents" },
    { label: "Stripe: Payout transactions, fees and refunds", href: "https://docs.stripe.com/reports/payout-reconciliation" },
    { label: "Etail Depot: Merchant and gateway reconciliation", href: "/services/reconciliation" },
  ],
};
