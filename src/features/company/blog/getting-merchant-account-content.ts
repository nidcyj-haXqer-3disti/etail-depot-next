import type { BlogArticle } from "./content";

/** Archive G0181, adapted with current application and account setup guidance. */
export const gettingMerchantAccountArticle: BlogArticle = {
  path: "/company/blog/get-a-merchant-account",
  title: "How to get a merchant account",
  description: "To get a merchant account, choose a provider that supports your business, prepare your records and complete its application. Review the terms before signing, then finish your payment setup after approval. Creating a login is only the beginning.",
  summary: "Learn what to prepare for a merchant account application, how to explain your sales figures and what to check before accepting live payments.",
  searchTitle: "How to get a merchant account",
  relatedPaths: ["/company/blog/merchant-accounts-and-acquiring", "/company/blog/choose-a-merchant-services-provider"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "confirm-business-fit", title: "Confirm the account fits your business" },
    { id: "prepare-your-records", title: "Prepare consistent business records" },
    { id: "explain-your-sales", title: "Explain how you sell" },
    { id: "review-and-apply", title: "Review the terms and complete the application" },
    { id: "finish-account-setup", title: "Finish setup after approval" },
  ],
  sources: [
    { label: "Stripe: Merchant account application process", href: "https://stripe.com/resources/more/how-to-get-a-merchant-account" },
    { label: "Infinicept: Merchant underwriting and verification", href: "https://www.infinicept.com/what-is-underwriting/" },
    { label: "Stripe: Website information and customer policies", href: "https://docs.stripe.com/get-started/checklist/website" },
    { label: "Stripe: Account verification and live activation", href: "https://docs.stripe.com/get-started/account/set-up" },
    { label: "Etail Depot: Merchant account setup", href: "/resources/merchant-account-setup" },
    { label: "Etail Depot: Payouts and reserves", href: "/company/legal/payouts-and-reserves" },
  ],
};
