import type { BlogArticle } from "./content";

/** Archive G0266, adapted around the records a business needs after the checkout ends. */
export const pointOfSaleArticle: BlogArticle = {
  path: "/company/blog/point-of-sale",
  title: "What your point of sale needs to remember",
  description: "A point-of-sale system connects the sale, payment and work that follows. See why stock, returns and staff records matter beyond a successful checkout.",
  summary: "The checkout takes a moment. Your business needs to understand that sale long after the customer leaves, without relying on the person who served them.",
  searchTitle: "What a point-of-sale system does for your business",
  relatedPaths: ["/company/blog/accept-payments-online-and-in-person", "/company/blog/payment-analytics"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Square: Connecting orders, payments and fulfillment", href: "https://developer.squareup.com/docs/orders-api/what-it-does" },
    { label: "Shopify: On-hand, available and committed inventory", href: "https://help.shopify.com/en/manual/inventory-and-locations/fundamentals/inventory-states" },
    { label: "Shopify: Returns, refunds and restocking in POS", href: "https://help.shopify.com/en/manual/sell-in-person/shopify-pos/order-management/complete-refund-orders" },
    { label: "Shopify: POS permissions and manager approval", href: "https://help.shopify.com/en/manual/your-account/users/roles/permissions/pos-permissions" },
  ],
};
