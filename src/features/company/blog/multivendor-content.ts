import type { BlogArticle } from "./content";

/** Archive G1917, adapted around promotion costs and seller trust in mixed orders. */
export const multivendorArticle: BlogArticle = {
  path: "/company/blog/multivendor-marketplace-payments",
  title: "Who pays for the discount in a multivendor order?",
  description: "Multivendor marketplace payments must explain each seller’s share. Follow a promotion through commissions, refunds and seller records before choosing a payment setup.",
  summary: "A marketplace promotion can bring in an order while leaving less money than the sellers are owed. The payment plan needs to account for that difference.",
  searchTitle: "Multivendor marketplace payments: discounts and seller shares",
  relatedPaths: ["/company/blog/embedded-payments-for-online-marketplaces", "/company/blog/embedded-payments-vs-integrated-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Adyen: Separate seller allocations, commissions and references", href: "https://docs.adyen.com/platforms/online-payments/split-transactions/" },
    { label: "Adyen: Assigning transaction fees", href: "https://docs.adyen.com/platforms/online-payments/transaction-fees/" },
    { label: "Stripe: Separate charges, transfers and refund recovery", href: "https://docs.stripe.com/connect/separate-charges-and-transfers" },
  ],
};
