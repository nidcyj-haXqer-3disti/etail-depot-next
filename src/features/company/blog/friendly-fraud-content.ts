import type { BlogArticle } from "./content";

/** Unpublished archive G0674, adapted around evidence before customer accusations. */
export const friendlyFraudArticle: BlogArticle = {
  path: "/company/blog/friendly-fraud",
  title: "Before you call it friendly fraud",
  description: "A familiar customer can still have a valid dispute. Investigate the payment, cancellation and order records before deciding how to respond.",
  summary: "The customer logged in. The renewal went through. Neither fact explains whether the cancellation worked. A better investigation starts before the accusation.",
  searchTitle: "Friendly fraud: investigate the claim before assigning blame",
  relatedPaths: ["/company/blog/what-is-a-chargeback", "/company/blog/goods-not-received-chargeback-evidence"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Adyen: Friendly fraud and unintentional disputes", href: "https://www.adyen.com/knowledge-hub/friendly-fraud" },
    { label: "Stripe: Dispute reasons and cancellation evidence", href: "https://docs.stripe.com/disputes/categories" },
    { label: "Stripe: Organizing relevant dispute evidence", href: "https://docs.stripe.com/disputes/best-practices" },
    { label: "Stripe: Customer withdrawals and response obligations", href: "https://support.stripe.com/questions/dispute-withdrawals-faq" },
    { label: "Visa: Resolving disputes and preventing avoidable claims", href: "https://www.visa.com/en-us/support/business/dispute-resolution" },
  ],
};
