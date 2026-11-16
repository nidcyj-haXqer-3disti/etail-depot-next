import type { BlogArticle } from "./content";

/** Archive G0216, adapted with current account identification guidance. */
export const merchantIdArticle: BlogArticle = {
  path: "/company/blog/merchant-id",
  title: "What is a merchant ID? How to find the right account",
  description: "A merchant ID, or MID, identifies a merchant within a payment processing arrangement. It helps your provider locate the account behind a payment. When someone asks for your MID, check which provider and account they mean before sending a number.",
  summary: "Find your merchant ID, distinguish it from gateway and payment references, and keep the right account details together for support.",
  searchTitle: "What is a merchant ID (MID)? How to find yours",
  relatedPaths: ["/company/blog/merchant-category-codes", "/company/blog/merchant-accounts-and-acquiring"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "what-mid-identifies", title: "What your merchant ID identifies" },
    { id: "find-your-mid", title: "Where to find your merchant ID" },
    { id: "etail-account-details", title: "Keep your Trolleys account details together" },
    { id: "help-locate-payment", title: "Help support locate the right payment" },
    { id: "keep-account-records", title: "Keep account records accurate and protected" },
  ],
  sources: [
    { label: "Stripe: Merchant IDs and where to find them", href: "https://stripe.com/resources/more/merchant-id" },
    { label: "Visa Acceptance: Locating your Cybersource Organization ID", href: "https://support.visaacceptance.com/knowledgebase/Knowledgearticle/?code=000002872" },
    { label: "Adyen: Merchant accounts within an account structure", href: "https://docs.adyen.com/account/account-structure" },
    { label: "Adyen: Account, merchant reference and payment reference", href: "https://docs.adyen.com/account/manage-payments" },
    { label: "Etail Depot: Account details after approval", href: "/developers/getting-started" },
    { label: "Etail Depot: Merchant account setup and additional locations", href: "/resources/merchant-account-setup" },
  ],
};
