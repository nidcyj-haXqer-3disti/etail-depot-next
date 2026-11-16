import type { BlogArticle } from "./content";

/** Archive G1797, adapted with current delivery and shipment guidance. */
export const deliveryPromiseArticle: BlogArticle = {
  path: "/company/blog/write-delivery-promise",
  title: "How to write a delivery promise customers can use",
  description: "A delivery promise tells customers when to expect an order and what could affect that timing. Build it from available stock, preparation time, carrier transit and the destination. Show when the order is expected to leave separately from when it is expected to arrive.",
  summary: "Write a clear delivery promise using stock, handling time, carrier transit and order cutoffs. Explain arrival dates, separate parcels and what happens after a delay.",
  searchTitle: "How to write a delivery promise for your online store",
  relatedPaths: ["/company/blog/ecommerce-shipping-efficiency", "/company/blog/create-an-online-shop"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "inputs", title: "Build the estimate from operational facts" },
    { id: "calendar", title: "Turn the calculation into a clear statement" },
    { id: "mixed-order", title: "Explain conditions before payment" },
    { id: "delays", title: "Respond when an order is delayed" },
  ],
  sources: [
    { label: "Stripe: Delivery promises and customer communication", href: "https://stripe.com/resources/more/delivery-promise" },
    { label: "Shopify: Fulfillment time, transit time and delivery dates", href: "https://help.shopify.com/en/manual/fulfillment/setup/delivery-expectations/manual-delivery-dates" },
    { label: "FTC: Shipment promises, delays and refunds for covered merchandise orders", href: "https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule" },
  ],
};
