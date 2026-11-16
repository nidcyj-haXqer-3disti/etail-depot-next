import type { BlogArticle } from "./content";

/** Archive G0148, adapted with current payment analytics and reporting guidance. */
export const paymentAnalyticsArticle: BlogArticle = {
  path: "/company/blog/payment-analytics",
  title: "Payment analytics: understand what your numbers measure",
  description: "Payment analytics can show where customers struggle and which payments need attention. Start by separating orders, payment attempts and approvals so your reports lead to the right decisions.",
  summary: "Learn how to read payment metrics, account for retries, compare equivalent periods and connect analytics with your merchant and gateway records.",
  searchTitle: "Payment analytics and reporting for merchants",
  relatedPaths: ["/company/blog/cart-abandonment-vs-checkout-abandonment", "/company/blog/how-batch-payment-processing-works"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "define-measures", title: "Know what each number counts" },
    { id: "orders-and-retries", title: "Keep retries separate from orders" },
    { id: "compare-fairly", title: "Compare equivalent groups" },
    { id: "check-records", title: "Connect the chart to payment records" },
    { id: "choose-action", title: "Turn a finding into a useful change" },
  ],
  sources: [
    { label: "Stripe: Acceptance metrics and repeat attempts", href: "https://docs.stripe.com/payments/analytics/acceptance" },
    { label: "Stripe: Authentication outcomes", href: "https://docs.stripe.com/payments/analytics/authentication" },
    { label: "Stripe: Dispute dates and reporting delays", href: "https://docs.stripe.com/payments/analytics/disputes" },
    { label: "Cybersource: Payment Batch Detail report", href: "https://developer.cybersource.com/docs/cybs/en-us/reporting/user/all/ebc/reporting-ug/c_Reports_Available_in_the_Business_Center/c_Payment_Batch_Detail.html" },
    { label: "Adyen: Reports and payment lifecycle stages", href: "https://docs.adyen.com/reporting/reports-and-the-payments-lifecycle/" },
  ],
};
