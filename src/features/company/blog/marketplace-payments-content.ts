import type { BlogArticle } from "./content";

/** Archive G1900, adapted around the operating decisions behind marketplace payments. */
export const marketplacePaymentsArticle: BlogArticle = {
  path: "/company/blog/embedded-payments-for-online-marketplaces",
  title: "One checkout, several sellers and a refund",
  description: "Embedded payments make buying on a marketplace feel simple. Seller approval, payment allocation and refunds determine whether the experience stays simple afterward.",
  summary: "Follow a marketplace order beyond the Pay button. The seller relationship, account permissions and return of money matter as much as the checkout itself.",
  searchTitle: "Embedded payments for online marketplaces: beyond checkout",
  relatedPaths: ["/company/blog/embedded-finance-vs-banking-as-a-service", "/company/blog/payment-settlement-and-payouts"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Visa: Core Rules, section 5.3.2.2 on merchant and marketplace classification", href: "https://corporate.visa.com/content/dam/VCOM/download/about-visa/visa-rules-public.pdf" },
    { label: "Stripe: Determining the merchant of record", href: "https://docs.stripe.com/connect/merchant-of-record" },
    { label: "Adyen: Marketplace verification and account capabilities", href: "https://docs.adyen.com/marketplaces/verification-overview/" },
    { label: "Stripe: Separate charges, transfers and refunds", href: "https://docs.stripe.com/connect/separate-charges-and-transfers" },
  ],
};
