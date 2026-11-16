import type { BlogArticle } from "./content";

/** Archive G1848, adapted around the gap between one order and one payment approval. */
export const singleUseCardsArticle: BlogArticle = {
  path: "/company/blog/single-use-credit-cards",
  title: "A single-use card can finish before the order does",
  description: "A single-use card can close while an order is still being fulfilled. The difference between an approval and a charge explains why that matters.",
  summary: "One checkout can lead to separate shipments and payment requests. What single-use cards count, and why replacing a declined card needs care.",
  searchTitle: "Single-use credit cards: when one order needs two approvals",
  relatedPaths: ["/company/blog/virtual-credit-cards", "/company/blog/card-authorization"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Amazon Pay: Multiple charges for one order", href: "https://pay.amazon.com/help/69871" },
    { label: "Stripe: Multiple captures against one authorization", href: "https://docs.stripe.com/payments/multicapture" },
    { label: "Stripe Issuing: What counts toward single-use cancellation", href: "https://docs.stripe.com/issuing/controls/lifecycle-controls" },
    { label: "Privacy: Single-use card closure rules", href: "https://support.privacy.com/hc/en-us/articles/32724298824215-Single-Use-Cards" },
    { label: "Privacy: Closing a card and previously authorized purchases", href: "https://support.privacy.com/hc/en-us/articles/360039148094-How-do-I-pause-close-Privacy-Cards" },
  ],
};
