import type { BlogArticle } from "./content";

/** Unpublished archive G0667, adapted around the merchant cost of fraud-rule decisions. */
export const fraudRulesArticle: BlogArticle = {
  path: "/company/blog/fraud-detection-data-analytics",
  title: "The sales hiding inside your fraud alerts",
  description: "Evaluate fraud rules by the losses they catch, the good customers they affect and the work they create. More blocked payments do not tell the whole story.",
  summary: "A rule flags 100 payments. Some are fraud. Some are customers trying to buy. The business decision starts when you separate the two.",
  searchTitle: "Fraud detection analytics: losses, alerts and lost sales",
  relatedPaths: ["/company/blog/credit-card-declines", "/company/blog/digital-wallet-fraud"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Google: Precision, recall and the cost of classification mistakes", href: "https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall" },
    { label: "Stripe: Fraud rules, estimated outcomes and review queues", href: "https://docs.stripe.com/radar/rules" },
    { label: "Stripe: Payment dates, fraud arrival dates and repeat attempts", href: "https://docs.stripe.com/radar/analytics" },
    { label: "Cybersource: Testing fraud strategies against historical transactions", href: "https://www.cybersource.com/en-us/solutions/fraud-and-risk-management/decision-manager.html" },
  ],
};
