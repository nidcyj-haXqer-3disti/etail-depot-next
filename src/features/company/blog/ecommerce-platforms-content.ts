import type { BlogArticle } from "./content";

/** Archive G1564, adapted with current platform and maintenance guidance. */
export const ecommercePlatformsArticle: BlogArticle = {
  path: "/company/blog/choose-between-ecommerce-platforms",
  title: "How to choose between ecommerce platforms",
  description: "Choose an ecommerce platform by matching your required selling and operating workflows to what your team can maintain. Start with mandatory capabilities, then compare total cost and control. A platform includes more than the storefront: product data, orders, stock, payments, staff access and integrations all affect the decision.",
  summary: "Choose an ecommerce platform around your store’s requirements, maintenance capacity and total cost. Test daily work, integrations and data exports before committing.",
  searchTitle: "How to choose between ecommerce platforms",
  relatedPaths: ["/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store", "/company/blog/create-an-online-shop"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "models", title: "Compare responsibility, not just labels" },
    { id: "requirements", title: "Check essential requirements first" },
    { id: "cost", title: "Compare the full cost" },
    { id: "exit", title: "Test routine work and an eventual exit" },
  ],
  sources: [
    { label: "Stripe: Ecommerce platform selection and total cost", href: "https://stripe.com/resources/more/ecommerce-platforms" },
    { label: "Shopify: Headless commerce and storefront responsibilities", href: "https://www.shopify.com/enterprise/blog/headless-commerce" },
    { label: "WooCommerce: Updates, backups and staging checks", href: "https://woocommerce.com/document/how-to-update-woocommerce/" },
    { label: "Shopify: Store exports and transfer limitations", href: "https://help.shopify.com/en/manual/shopify-admin/duplicate-store" },
  ],
};
