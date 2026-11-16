import type { BlogArticle } from "./content";

/** Archive G0535, adapted around the difference between upfront collections and normalized recurring value. */
export const monthlyRecurringRevenueArticle: BlogArticle = {
  path: "/company/blog/monthly-recurring-revenue",
  title: "More cash this month can mean less MRR",
  description: "Calculate monthly recurring revenue without mistaking annual prepayments for growth. Understand how discounts, customer changes and reporting rules affect MRR.",
  summary: "A discounted annual plan can bring cash forward while reducing monthly recurring value. Understanding both numbers makes the tradeoff visible.",
  searchTitle: "How to calculate monthly recurring revenue (MRR)",
  relatedPaths: ["/company/blog/net-revenue-retention-for-saas-businesses", "/company/blog/saas-payment-processing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "ChartMogul: Monthly recurring revenue calculation", href: "https://help.chartmogul.com/article/154-chart-monthly-recurring-revenue-mrr" },
    { label: "ChartMogul: New business, expansion and other MRR movements", href: "https://help.chartmogul.com/article/158-chart-mrr-movements" },
    { label: "Stripe: Billing analytics definitions and settings", href: "https://docs.stripe.com/billing/subscriptions/analytics" },
    { label: "ChartMogul: Annual run rate", href: "https://help.chartmogul.com/article/155-chart-annual-run-rate-arr" },
  ],
};
