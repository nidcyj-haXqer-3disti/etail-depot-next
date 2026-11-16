import type { BlogArticle } from "./content";

/** Archive G0445, adapted around gross losses, measurement definitions and the customer evidence behind a rate. */
export const grossChurnArticle: BlogArticle = {
  path: "/company/blog/gross-churn",
  title: "What your churn rate leaves out",
  description: "Gross churn measures customer or recurring revenue losses before growth offsets them. Check the starting group, calculation rules and reasons behind the departures.",
  summary: "A lower churn percentage can come from a different denominator rather than fewer departures. Understand what the rate measures before deciding retention has improved.",
  searchTitle: "Gross churn: calculate customer and revenue losses",
  relatedPaths: ["/company/blog/net-revenue-retention-for-saas-businesses", "/company/blog/dunning-emails"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Gross customer and revenue churn", href: "https://stripe.com/resources/more/how-to-track-understand-and-reduce-gross-churn" },
    { label: "ChartMogul: Gross MRR churn and calculation settings", href: "https://help.chartmogul.com/article/204-chart-gross-mrr-churn-rate" },
    { label: "ChartMogul: Customer churn and multiple subscriptions", href: "https://help.chartmogul.com/article/203-chart-customer-churn-rate" },
    { label: "Stripe: Subscriber churn and analytics definitions", href: "https://docs.stripe.com/billing/subscriptions/analytics" },
  ],
};
