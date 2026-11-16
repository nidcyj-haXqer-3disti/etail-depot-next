import type { BlogArticle } from "./content";

/** Archive G1957, adapted around a merchant's actual account relationship. */
export const payfacIsoArticle: BlogArticle = {
  path: "/company/blog/payfacs-vs-independent-sales-organizations",
  title: "PayFac or ISO? The account matters more than the label",
  description: "Compare payment facilitators and ISOs by the merchant relationship, account terms and support you receive. See where Trolleys merchant services fit.",
  summary: "A provider's label tells you something about its role. It cannot tell you whether the account, price or support will fit your business.",
  searchTitle: "PayFac vs. ISO: choosing merchant services for your business",
  relatedPaths: ["/company/blog/payfac-as-a-service", "/company/blog/reselling-payments-vs-running-a-payfac"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Visa: ISO and payment facilitator roles", href: "https://corporate.visa.com/content/dam/VCOM/download/merchants/tpa-types-functional-descriptions.pdf" },
    { label: "Mastercard: Payment facilitator registration", href: "https://www.mastercard.com/us/en/business/support/payment-facilitators.html" },
  ],
};
