import type { BlogArticle } from "./content";

/** Archive G1705, adapted with current recurring revenue metric guidance. */
export const netRetentionArticle: BlogArticle = {
  path: "/company/blog/net-revenue-retention-for-saas-businesses",
  title: "How to calculate net revenue retention",
  description: "Net revenue retention, or NRR, measures how recurring revenue from an existing customer group changes over a defined period, including expansion, contraction and churn. It excludes revenue from customers newly acquired during that period. Use a fixed starting group so new customer revenue cannot conceal losses in existing accounts.",
  summary: "Calculate net revenue retention using the same customer group at both dates. Follow a worked calculation, exclude revenue from new customers and compare net with gross retention.",
  searchTitle: "How to calculate net revenue retention for SaaS",
  relatedPaths: ["/company/blog/saas-payment-processing", "/company/blog/payment-analytics"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "formula", title: "Define the starting group and revenue basis" },
    { id: "worked-cohort", title: "Calculate NRR for the starting customer group" },
    { id: "gross-retention", title: "Check what expansion is hiding" },
    { id: "interpret", title: "Use the metric alongside operating evidence" },
  ],
  sources: [
    { label: "Stripe: Net and gross revenue retention", href: "https://stripe.com/resources/more/net-revenue-retention" },
    { label: "Stripe: Monthly recurring revenue and cohort reporting", href: "https://docs.stripe.com/billing/subscriptions/analytics" },
    { label: "ChartMogul: Net retention calculation and report settings", href: "https://help.chartmogul.com/article/143-chart-net-mrr-retention" },
    { label: "ChartMogul: Gross retention calculation", href: "https://help.chartmogul.com/article/142-chart-gross-mrr-retention" },
  ],
};
