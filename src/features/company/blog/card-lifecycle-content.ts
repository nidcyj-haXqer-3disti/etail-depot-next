import type { BlogArticle } from "./content";

/** Archive G1856, adapted around preserving the customer relationship when a card changes. */
export const cardLifecycleArticle: BlogArticle = {
  path: "/company/blog/credit-card-lifecycle-management",
  title: "Replacing a card should not mean starting over",
  description: "A replacement card changes how someone pays. The account still needs its purchase history, refunds and a clear explanation of what will keep working.",
  summary: "Credit card lifecycle management is tested when a card changes. Replacement reasons, wallet access and unfinished purchases need different treatment.",
  searchTitle: "Credit card lifecycle management: beyond the replacement",
  relatedPaths: ["/company/blog/card-issuing-apis", "/company/blog/credit-card-account-updater"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Capital One: Misplaced, damaged and lost card handling", href: "https://www.capitalone.com/help-center/fraud-disputes/replacement-card-support/" },
    { label: "Stripe Issuing: Replacement reasons and continuing activity", href: "https://docs.stripe.com/issuing/cards/replacements" },
    { label: "Chase: Replacement cards in Apple Pay", href: "https://www.chase.com/digital/digital-payments/apple-pay/faqs" },
    { label: "Stripe: Refunds to expired or canceled cards", href: "https://docs.stripe.com/refunds#refund-destinations" },
    { label: "Visa: Account updates, participation and authorization", href: "https://developer.visa.com/docs/vau/vau-faq" },
  ],
};
