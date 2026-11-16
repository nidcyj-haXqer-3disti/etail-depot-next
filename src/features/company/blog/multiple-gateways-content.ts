import type { BlogArticle } from "./content";

/** Archive G1932, adapted around the payments that remain after a gateway change. */
export const multipleGatewaysArticle: BlogArticle = {
  path: "/company/blog/use-multiple-payment-gateways",
  title: "A second gateway does not move your old payments",
  description: "Managing multiple payment gateways means keeping older payments traceable. Connect orders, refunds and reports to the right account, even after checkout changes.",
  summary: "New orders use the new connection. Yesterday’s customer still needs a refund through the old one. Your payment records have to serve both.",
  searchTitle: "Managing multiple payment gateways: refunds and records",
  relatedPaths: ["/company/blog/evaluate-and-manage-multiple-payment-processors", "/company/blog/intelligent-payment-routing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Linking a refund to the original capture", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/fdiglobal/rest/payments/payments-intro/payments-services-intro/payments-intro-processing-credit.html" },
    { label: "Adyen: Merchant accounts and transaction references in reports", href: "https://docs.adyen.com/reporting/settlement-reconciliation/transaction-level/settlement-details-report/" },
    { label: "Cybersource: Resolving uncertain payment and refund results", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/fdiglobal/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Stripe: Account closure and outstanding payment obligations", href: "https://support.stripe.com/questions/close-a-stripe-account" },
  ],
};
