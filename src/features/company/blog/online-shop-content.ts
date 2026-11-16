import type { BlogArticle } from "./content";

/** Archive G1476, adapted with current store setup and payment verification guidance. */
export const onlineShopArticle: BlogArticle = {
  path: "/company/blog/create-an-online-shop",
  title: "Create an online shop: a practical launch sequence",
  description: "To create an online shop, prepare a complete offer, choose tools that can sell and deliver it, and rehearse the full order journey before inviting customers. For a first physical goods store, one accurately described product with dependable fulfillment is a better launch unit than a large unfinished catalog.",
  summary: "Create an online shop for physical goods: prepare your offer, check costs, connect payments and delivery, then test the full order journey.",
  searchTitle: "How to create an online shop: a practical launch sequence",
  relatedPaths: ["/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store", "/company/blog/ecommerce-payment-processing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "offer", title: "Define the smallest complete offer" },
    { id: "cost-order", title: "Price an order you can fulfill" },
    { id: "assemble", title: "Connect the minimum operating tools" },
    { id: "rehearsal", title: "Run a launch rehearsal" },
  ],
  sources: [
    { label: "Stripe: Preparing and launching an online store", href: "https://stripe.com/resources/more/how-to-create-an-online-shop-a-quick-start-guide" },
    { label: "US Small Business Administration: Business launch requirements", href: "https://www.sba.gov/counseling/launch-your-business/" },
    { label: "Stripe: Payment results and repeated attempts", href: "https://docs.stripe.com/payments/payment-intents" },
    { label: "Stripe: Verifying payment before fulfillment", href: "https://docs.stripe.com/checkout/fulfillment" },
    { label: "Shopify: Placing test orders before launch", href: "https://help.shopify.com/en/manual/checkout-settings/test-orders" },
  ],
};
