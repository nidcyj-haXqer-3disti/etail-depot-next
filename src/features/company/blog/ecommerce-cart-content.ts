import type { BlogArticle } from "./content";

/** Archive G1459, adapted with current cart, checkout and maintenance guidance. */
export const ecommerceCartArticle: BlogArticle = {
  path: "/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store",
  title: "Choosing an ecommerce shopping cart for your store",
  description: "An ecommerce shopping cart holds the items a customer intends to buy and helps turn them into a correctly priced order. Choose one by testing your actual basket rules: product options, quantities, availability, discounts and delivery choices. An attractive cart is useful only if its totals and promises remain reliable.",
  summary: "Choose an ecommerce shopping cart by testing product options, stock, discounts, delivery and mobile use. Compare maintenance needs before committing.",
  searchTitle: "Choosing an ecommerce shopping cart for your store",
  relatedPaths: ["/company/blog/ecommerce-payment-processing", "/company/blog/optimize-your-mobile-checkout-experience"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "map-rules", title: "Start with the baskets you sell" },
    { id: "change-test", title: "Test what happens when the basket changes" },
    { id: "evaluation", title: "Use a short acceptance script" },
    { id: "ownership", title: "Choose the amount of control you can maintain" },
  ],
  sources: [
    { label: "Stripe: Shopping cart choices and operating costs", href: "https://stripe.com/resources/more/ecommerce-shopping-cart" },
    { label: "Shopify: Checkout and inventory checks", href: "https://help.shopify.com/en/manual/checkout-settings" },
    { label: "Shopify: Combining discounts", href: "https://help.shopify.com/en/manual/discounts/discount-combinations" },
    { label: "W3C: Clear form feedback and error messages", href: "https://www.w3.org/WAI/tutorials/forms/notifications/" },
    { label: "WooCommerce: Backups, updates and store testing", href: "https://woocommerce.com/document/how-to-update-woocommerce/" },
  ],
};
