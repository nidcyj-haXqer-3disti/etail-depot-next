import type { BlogArticle } from "./content";

/** Archive G0006, adapted around payment entry and the handover of an order. */
export const cardPresenceArticle: BlogArticle = {
  path: "/company/blog/card-present-vs-card-not-present",
  title: "The customer is in the store. The payment may still be online.",
  description: "Card present depends on how a payment is taken. A phone checkout, an online deposit and a tap at collection can leave very different records for one order.",
  summary: "A customer can stand at your counter and make an online payment. Why that distinction matters for collection, deposits and the record you keep afterward.",
  searchTitle: "Card-present vs. card-not-present: more than a location",
  relatedPaths: ["/company/blog/ecommerce-vs-retail", "/company/blog/credit-cards-and-digital-wallets"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Card-present and card-not-present payments", href: "https://stripe.com/resources/more/card-present-vs-card-not-present-transactions" },
    { label: "Apple: Paying at a reader, in apps and on the web", href: "https://support.apple.com/en-us/102626" },
    { label: "EMVCo: Contactless payments and transaction security", href: "https://www.emvco.com/emv-technologies/emv-contactless-chip/" },
    { label: "Shopify: Partial payments and outstanding balances", href: "https://help.shopify.com/en/manual/sell-in-person/shopify-pos/payment-management/multiple-partial-payments" },
    { label: "Square: Evidence for collection and goods not received", href: "https://squareup.com/help/us/en/article/8560-respond-to-disputes-for-goods-or-services-not-received" },
  ],
};
