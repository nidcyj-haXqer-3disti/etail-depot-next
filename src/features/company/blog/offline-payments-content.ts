import type { BlogArticle } from "./content";

/** Archive G0229, adapted around the unpaid exposure and recovery work behind store-and-forward payments. */
export const offlinePaymentsArticle: BlogArticle = {
  path: "/company/blog/offline-credit-card-processing",
  title: "The customer has left. The offline payment can still decline.",
  description: "Offline credit card processing can keep sales moving while approval waits. Understand the unpaid queue, device limits and recovery before handing over the goods.",
  summary: "A stored payment can preserve a sale during an outage. The business still carries the risk until that payment is processed and its outcome is known.",
  searchTitle: "Offline credit card processing: risks and recovery",
  relatedPaths: ["/company/blog/accept-payments-online-and-in-person", "/company/blog/add-in-person-payments-to-your-saas-platform"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Adyen: Offline EMV, store and forward, and payment risk", href: "https://docs.adyen.com/point-of-sale/offline-payment" },
    { label: "Adyen: Offline transaction amount and count limits", href: "https://docs.adyen.com/point-of-sale/design-your-integration/determine-account-structure/configure-features" },
    { label: "Square: Supported offline payments, deadlines and data protection", href: "https://squareup.com/help/us/en/article/7777-process-card-payments-with-offline-mode" },
    { label: "Square: Reviewing pending, completed and declined offline payments", href: "https://squareup.com/help/us/en/article/8551-view-offline-payments" },
  ],
};
