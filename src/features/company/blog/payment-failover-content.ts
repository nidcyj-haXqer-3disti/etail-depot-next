import type { BlogArticle } from "./content";

/** Archive G1962, adapted around continuity without duplicate customer charges. */
export const paymentFailoverArticle: BlogArticle = {
  path: "/company/blog/payment-failover",
  title: "Your backup checkout should not charge the customer twice",
  description: "Payment failover can keep sales moving during an outage. Learn why new payments, uncertain results and card declines need different decisions before switching.",
  summary: "Keeping checkout open matters. So does knowing whether the customer already paid. A useful backup plan has to protect both.",
  searchTitle: "Payment failover: keep sales moving without duplicate charges",
  relatedPaths: ["/company/blog/use-multiple-payment-gateways", "/company/blog/intelligent-payment-routing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Uncertain results and duplicate payment prevention", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/ctv/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Cybersource: Declined authorizations and retry restrictions", href: "https://developer.cybersource.com/docs/cybs/en-us/payment-features/developer/ctv/rest/payment-features/payfg-payments-services-intro/payments-processing-basic-auth-intro/payments-intro-processing-auth-decline.html" },
    { label: "Adyen: The boundaries of duplicate request protection", href: "https://docs.adyen.com/development-resources/api-idempotency/" },
  ],
};
