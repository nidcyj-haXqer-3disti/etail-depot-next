import type { BlogArticle } from "./content";

/** Unpublished archive G0651, adapted around merchant decisions surrounding wallet payments. */
export const walletFraudArticle: BlogArticle = {
  path: "/company/blog/digital-wallet-fraud",
  title: "The wallet button is not your fraud policy",
  description: "Digital wallets protect payment credentials, but fraud can involve enrollment, account access or order changes. Know what a wallet payment does and does not prove.",
  summary: "A wallet payment is approved. Then someone asks to change the delivery address. The payment result and that new request are two different decisions.",
  searchTitle: "Digital wallet fraud: what merchants still need to check",
  relatedPaths: ["/company/blog/account-takeover-fraud", "/company/blog/credit-cards-and-digital-wallets"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Apple: Who approves adding a card to a wallet", href: "https://support.apple.com/guide/security/card-provisioning-security-overview-sec0f005981a/web" },
    { label: "Apple: Payment security and lost-device controls", href: "https://support.apple.com/en-us/101554" },
    { label: "Google Pay: Payment credentials and merchant risk checks", href: "https://developers.google.com/pay/api/web/reference/request-objects#CardParameters" },
    { label: "Google Pay: Liability shift and payment-provider responsibilities", href: "https://developers.google.com/pay/api/faq" },
    { label: "Stripe: Apple Pay disputes and limits of liability protection", href: "https://docs.stripe.com/apple-pay/disputes-refunds" },
  ],
};
