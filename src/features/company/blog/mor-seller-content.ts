import type { BlogArticle } from "./content";

/** Archive G1949, adapted around the seller a customer can identify. */
export const morSellerArticle: BlogArticle = {
  path: "/company/blog/merchant-of-record-vs-seller-of-record",
  title: "Your customer should know who sold the order",
  description: "Merchant of record vs. seller of record: understand the names on your checkout, receipt and statement, and what they mean for your business and customers.",
  summary: "A familiar logo can hide an unfamiliar selling relationship. Make the company behind the sale as clear as the product in the basket.",
  searchTitle: "Merchant of record vs. seller of record: who sells?",
  relatedPaths: ["/company/blog/merchant-of-record-vs-payment-facilitator", "/company/blog/merchant-id"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Merchant of record and seller of record", href: "https://stripe.com/resources/more/merchant-of-record-vs-seller-of-record" },
    { label: "Paddle: Buyer terms and supplier agreements", href: "https://www.paddle.com/legal/buyer-terms" },
    { label: "PayPal Braintree: Names on customer statements", href: "https://developer.paypal.com/braintree/articles/wells-ic/transactions/descriptors" },
    { label: "U.S. Small Business Administration: Business names and DBAs", href: "https://www.sba.gov/counseling/launch-your-business/" },
  ],
};
