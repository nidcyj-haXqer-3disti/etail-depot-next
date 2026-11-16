import type { BlogArticle } from "./content";

/** Archive G0075, adapted around a clear and comfortable contactless checkout. */
export const contactlessArticle: BlogArticle = {
  path: "/company/blog/contactless-payments",
  title: "A fast tap is only part of a good checkout",
  description: "How contactless payments work, why a tap can still need verification, and what a merchant should do when the reader reacts but the payment result is missing.",
  summary: "The tap is brief. Clear confirmation, a sensible response to a missing result and a reader customers can comfortably use make the rest of checkout work.",
  searchTitle: "How contactless payments work at a busy checkout",
  relatedPaths: ["/company/blog/card-present-vs-card-not-present", "/company/blog/credit-cards-and-digital-wallets"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "EMVCo: How contactless chip payments work", href: "https://www.emvco.com/emv-technologies/emv-contactless-chip/" },
    { label: "Adyen: Contactless limits and cardholder verification", href: "https://docs.adyen.com/point-of-sale/cardholder-verification-methods/" },
    { label: "Adyen: Checking a payment when its response is missing", href: "https://docs.adyen.com/point-of-sale/basic-tapi-integration/verify-transaction-status/" },
    { label: "Apple: Accepting contactless payments and accessible PIN entry", href: "https://developer.apple.com/tap-to-pay/how-to-accept-payments/" },
  ],
};
