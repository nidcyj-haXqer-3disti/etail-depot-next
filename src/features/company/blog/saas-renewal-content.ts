import type { BlogArticle } from "./content";

/** Archive G1762, adapted with current renewal and subscription guidance. */
export const saasRenewalArticle: BlogArticle = {
  path: "/company/blog/saas-renewal-rate",
  title: "How to calculate your SaaS renewal rate",
  description: "Your SaaS customer renewal rate is the percentage of customers who renew out of those due to renew in a defined period. A small account and a large account each count as one customer. Start with a clear renewal rule and an eligible customer list, then keep pending decisions and payment issues visible.",
  summary: "Calculate SaaS renewal rate using customers due to renew. Follow a worked calculation, keep pending cases visible and separate renewal decisions from payment results.",
  searchTitle: "SaaS renewal rate: formula and calculation",
  relatedPaths: ["/company/blog/net-revenue-retention-for-saas-businesses", "/company/blog/saas-payment-processing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "denominator", title: "Build the group due to renew first" },
    { id: "example", title: "Keep unresolved cases visible" },
    { id: "reasons", title: "Separate customer intent from collection" },
    { id: "use-results", title: "Compare customer counts and revenue" },
  ],
  sources: [
    { label: "Stripe: Customer renewal rate and eligible customers", href: "https://stripe.com/resources/more/saas-renewal-rate" },
    { label: "Stripe: Subscription and invoice status", href: "https://docs.stripe.com/billing/subscriptions/overview" },
    { label: "ChartMogul: Net revenue retention and report definitions", href: "https://help.chartmogul.com/article/143-chart-net-mrr-retention" },
  ],
};
