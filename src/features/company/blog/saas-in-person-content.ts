import type { BlogArticle } from "./content";

/** Archive G0169, adapted around the operating responsibilities of adding physical payment acceptance to SaaS. */
export const saasInPersonArticle: BlogArticle = {
  path: "/company/blog/add-in-person-payments-to-your-saas-platform",
  title: "The card reader is now part of your software business",
  description: "Adding in-person payments to a SaaS platform changes more than checkout. Merchant assignment, payment recovery, device replacement and support shape the product.",
  summary: "The first approved payment proves the connection works. The real product also has to survive a missing result, a replacement reader and the next software update.",
  searchTitle: "Adding in-person payments to your SaaS platform",
  relatedPaths: ["/company/blog/accept-payments-online-and-in-person", "/company/blog/how-a-pin-pad-terminal-works-for-card-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Hardware, logistics and support for SaaS payments", href: "https://stripe.com/guides/how-to-add-in-person-payments-to-your-saas-platform" },
    { label: "Adyen: Assigning terminals to stores and merchant accounts", href: "https://docs.adyen.com/point-of-sale/managing-terminals/assign-terminals" },
    { label: "Adyen: Recovering a missing payment response", href: "https://docs.adyen.com/point-of-sale/basic-tapi-integration/verify-transaction-status" },
    { label: "Adyen: Returning and replacing payment terminals", href: "https://docs.adyen.com/point-of-sale/managing-terminals/order-terminals" },
    { label: "Adyen: Terminal software releases and updates", href: "https://docs.adyen.com/point-of-sale/release-updating" },
    { label: "Apple: Requirements for adding Tap to Pay on iPhone to an app", href: "https://developer.apple.com/tap-to-pay/" },
  ],
};
