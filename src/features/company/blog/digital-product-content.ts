import type { BlogArticle } from "./content";

/** Archive G1640, adapted with current digital delivery and licensing guidance. */
export const digitalProductArticle: BlogArticle = {
  path: "/company/blog/start-a-digital-product-business",
  title: "How to start a digital product business",
  description: "A digital product business sells something delivered electronically, such as a template, course or software tool. Start by defining the customer task, the exact deliverable and the rights that come with purchase. Then prove you can deliver and support it at a price that covers the work involved.",
  summary: "Start a digital product business with a clear offer, usage rights and realistic costs. Plan payment confirmation, delivery, support and a small launch before expanding.",
  searchTitle: "How to start a digital product business",
  relatedPaths: ["/company/blog/create-an-online-shop", "/company/blog/embedded-software-monetization"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "define", title: "Sell a specific usable result" },
    { id: "economics", title: "Count support as part of delivery" },
    { id: "delivery", title: "Connect payment to the right access" },
    { id: "validate", title: "Test usefulness before enlarging the catalog" },
  ],
  sources: [
    { label: "Stripe: Creating and launching a digital product", href: "https://stripe.com/resources/more/how-to-start-a-digital-production-business" },
    { label: "US Copyright Office: Ownership, permissions and usage rights", href: "https://www.copyright.gov/what-is-copyright/" },
    { label: "Stripe: Payment confirmation and reliable fulfillment", href: "https://docs.stripe.com/checkout/fulfillment" },
    { label: "Shopify: Digital delivery, download recovery and access settings", href: "https://help.shopify.com/en/manual/products/digital-service-product/digital-downloads" },
  ],
};
