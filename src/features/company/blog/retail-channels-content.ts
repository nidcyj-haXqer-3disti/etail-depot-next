import type { BlogArticle } from "./content";

/** Archive G1487, adapted with current channel, cost and store pickup guidance. */
export const retailChannelsArticle: BlogArticle = {
  path: "/company/blog/ecommerce-vs-retail",
  title: "Ecommerce and retail: choosing online, in store or both",
  description: "Ecommerce and retail are not opposing categories. Retail is selling goods to the final customer; ecommerce describes selling through an online channel. A retailer can operate online, in a physical shop or through both. The useful decision is which channel fits the product, customer and operating costs.",
  summary: "Compare online and physical retail using customer needs, order costs, pickup, inventory and returns. Plan a small test before adding a sales channel.",
  searchTitle: "Ecommerce and retail: choosing online, in store or both",
  relatedPaths: ["/company/blog/create-an-online-shop", "/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "customer", title: "Compare how the customer buys" },
    { id: "economics", title: "Compare contribution for the same product" },
    { id: "hybrid", title: "Treat pickup as its own operation" },
    { id: "pilot", title: "Test one channel extension at a time" },
  ],
  sources: [
    { label: "US Census Bureau: What counts as ecommerce", href: "https://www.census.gov/programs-surveys/e-stats/about/faqs.html" },
    { label: "PayPal: Physical and online shopping considerations", href: "https://www.paypal.com/us/brc/article/difference-between-ecommerce-and-retail" },
    { label: "US Small Business Administration: Planning costs and break even", href: "https://www.sba.gov/counseling/plan-your-business/" },
    { label: "Shopify: Preparing and completing store pickup orders", href: "https://help.shopify.com/en/manual/fulfillment/setup/delivery-methods/pickup-in-store" },
  ],
};
