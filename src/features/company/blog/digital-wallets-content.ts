import type { BlogArticle } from "./content";

/** Archive G1799, adapted around recognizing wallet purchases and supporting the customer afterward. */
export const digitalWalletsArticle: BlogArticle = {
  path: "/company/blog/credit-cards-and-digital-wallets",
  title: "Digital wallets and the card number you do not recognize",
  description: "The last digits on a receipt can differ from the card in your hand. Understanding why helps merchants answer payment questions without turning a convenient checkout into a confusing return.",
  summary: "Understand credit cards in digital wallets, why receipt numbers can differ, who approves the payment and how merchants can make refunds easier to follow.",
  searchTitle: "Credit cards and digital wallets: why card numbers differ",
  relatedPaths: ["/company/blog/accept-apple-pay-as-a-business", "/company/blog/card-authorization"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Apple: Device account numbers and payment security", href: "https://support.apple.com/en-us/101554" },
    { label: "Google Pay: Card credentials and merchant risk checks", href: "https://developers.google.com/pay/api/web/reference/request-objects#CardParameters" },
    { label: "Google Wallet: Card eligibility and enrollment", href: "https://support.google.com/wallet/answer/12058983" },
    { label: "Apple: Issuer approval and declined wallet payments", href: "https://support.apple.com/en-us/120002" },
    { label: "Google Wallet: Transaction details and receipts", href: "https://support.google.com/wallet/answer/12059878" },
    { label: "Apple: Recognizing the card and receiving a refund", href: "https://support.apple.com/en-us/118270" },
  ],
};
