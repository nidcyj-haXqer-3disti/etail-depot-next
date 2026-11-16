import type { BlogArticle } from "./content";

/** Archive G1948, adapted around the merchant relationship a business is buying. */
export const morPayfacArticle: BlogArticle = {
  path: "/company/blog/merchant-of-record-vs-payment-facilitator",
  title: "A merchant of record changes more than checkout",
  description: "Compare a merchant of record with a payment facilitator by who sells, who handles refunds and which responsibilities stay with your business. See where Trolleys fits.",
  summary: "Two payment proposals can show the same checkout and offer very different relationships. Before comparing the rate, find out who is responsible for the sale.",
  searchTitle: "Merchant of record vs. payment facilitator: what changes?",
  relatedPaths: ["/company/blog/reselling-payments-vs-running-a-payfac", "/company/blog/isv-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Mastercard: The payment facilitator role", href: "https://www.mastercard.com/us/en/business/support/payment-facilitators.html" },
    { label: "Paddle: Buyer terms and the reseller relationship", href: "https://www.paddle.com/legal/buyer-terms" },
    { label: "Paddle: Supplier responsibilities, refunds and charges", href: "https://www.paddle.com/legal/terms" },
    { label: "Stripe: Merchant of record service scope and tax coverage", href: "https://docs.stripe.com/payments/managed-payments/how-it-works" },
  ],
};
