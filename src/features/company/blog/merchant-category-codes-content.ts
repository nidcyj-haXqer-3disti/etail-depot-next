import type { BlogArticle } from "./content";

/** Archive G0215, adapted with current network classification guidance. */
export const merchantCategoryCodesArticle: BlogArticle = {
  path: "/company/blog/merchant-category-codes",
  title: "Merchant category codes (MCCs): what merchants should know",
  description: "A merchant category code, or MCC, is a four digit classification used in card processing to describe a business activity. Your payment provider should confirm the assignment under the applicable network rules. It is different from your merchant ID, trading name and sales channel.",
  summary: "Understand who assigns your merchant category code, how it differs from a merchant ID and when to ask your payment provider to review it.",
  searchTitle: "Merchant category codes (MCCs): a merchant guide",
  relatedPaths: ["/company/blog/get-a-merchant-account", "/company/blog/merchant-accounts-and-acquiring"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "what-mcc-describes", title: "What an MCC describes" },
    { id: "mcc-and-account-records", title: "Keep classification separate from account details" },
    { id: "why-correct-code-matters", title: "Why the correct code matters" },
    { id: "when-business-changes", title: "Review the code when your business changes" },
    { id: "check-your-mcc", title: "Ask your provider to confirm the assignment" },
  ],
  sources: [
    { label: "Visa: Merchant Data Standards Manual, MCC assignment", href: "https://corporate.visa.com/content/dam/VCOM/download/merchants/visa-merchant-data-standards-manual.pdf" },
    { label: "Mastercard: Rules, section 5.8.1 on MCC information", href: "https://www.mastercard.com/content/dam/mccom/shared/business/support/rules-pdfs/mastercard-rules.pdf" },
    { label: "Stripe: How merchant category codes are used", href: "https://stripe.com/guides/merchant-category-codes" },
    { label: "Stripe: Industry information and account classification", href: "https://support.stripe.com/questions/setting-an-industry-group-when-creating-a-stripe-account" },
    { label: "Chase: Merchant codes and card rewards categories", href: "https://www.chase.com/personal/credit-cards/rewards-category-faq" },
    { label: "Etail Depot: Merchant account information and business changes", href: "/company/legal/merchant-services" },
  ],
};
