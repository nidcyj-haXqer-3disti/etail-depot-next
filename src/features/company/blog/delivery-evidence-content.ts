import type { BlogArticle } from "./content";

/** Unpublished archive G0663, adapted around matching delivery evidence to the disputed goods. */
export const deliveryEvidenceArticle: BlogArticle = {
  path: "/company/blog/goods-not-received-chargeback-evidence",
  title: "The tracking says delivered. What does it actually prove?",
  description: "A delivered parcel may not settle a goods-not-received chargeback. Match the disputed item, delivery promise and payment before deciding how to respond.",
  summary: "One order. Two parcels. Only one arrived. The tracking number looks reassuring until you ask which item the customer is disputing.",
  searchTitle: "Goods-not-received chargebacks: what delivery evidence proves",
  relatedPaths: ["/company/blog/write-delivery-promise", "/company/blog/what-is-a-chargeback"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Visa: Responding to disputes and communicating delivery delays", href: "https://www.visa.com/en-us/support/business/dispute-resolution" },
    { label: "Stripe: Goods-not-received claims and split shipments", href: "https://docs.stripe.com/disputes/categories#product-not-received" },
    { label: "FedEx: Delivery signatures and proof of delivery", href: "https://www.fedex.com/en-us/delivery-options/signature-services.html" },
    { label: "Stripe: Presenting relevant, readable dispute evidence", href: "https://docs.stripe.com/disputes/best-practices" },
  ],
};
