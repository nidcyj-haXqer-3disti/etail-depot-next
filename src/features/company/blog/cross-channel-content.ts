import type { BlogArticle } from "./content";

/** Archive G0165, adapted around the customer handoffs between online and in-person sales. */
export const crossChannelArticle: BlogArticle = {
  path: "/company/blog/accept-payments-online-and-in-person",
  title: "The customer should not have to prove they already paid",
  description: "Accepting payments online and in person takes more than a checkout and a card reader. Connect paid orders, deposits and returns before customers cross channels.",
  summary: "A customer buys online, collects in person and returns an item at the counter. The payment records need to follow the same journey.",
  searchTitle: "Accepting payments online and in person: connect the sale",
  relatedPaths: ["/company/blog/card-present-vs-card-not-present", "/company/blog/how-a-pin-pad-terminal-works-for-card-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Square: Connecting orders, fulfillment and payment activity", href: "https://developer.squareup.com/docs/orders-api/what-it-does" },
    { label: "Shopify: Finding online and in-person orders in POS", href: "https://help.shopify.com/en/manual/sell-in-person/shopify-pos/order-management" },
    { label: "Shopify: Partial payments and their restrictions", href: "https://help.shopify.com/en/manual/sell-in-person/shopify-pos/payment-management/multiple-partial-payments" },
    { label: "Shopify: Return permissions, refund limits and order eligibility", href: "https://help.shopify.com/en/manual/sell-in-person/shopify-pos/order-management/complete-refund-orders" },
    { label: "Adyen: Checking a payment when its response is missing", href: "https://docs.adyen.com/point-of-sale/basic-tapi-integration/verify-transaction-status" },
  ],
};
