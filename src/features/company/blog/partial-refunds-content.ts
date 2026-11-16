import type { BlogArticle } from "./content";

/** Unpublished archive G0726, adapted around keeping a partial return clear for the customer. */
export const partialRefundsArticle: BlogArticle = {
  path: "/company/blog/partial-refunds",
  title: "One item returned. The rest of the sale still matters.",
  description: "Partial refunds need more than a smaller amount. Account for discounts, avoid duplicate returns and give customers a clear explanation of what they paid and what remains.",
  summary: "The customer wants to return one item, not start the whole purchase again. A clear amount and a shared refund history can keep a small adjustment from becoming a second problem.",
  searchTitle: "Partial refunds: amounts, discounts and duplicate requests",
  relatedPaths: ["/company/blog/card-payment-refunds", "/company/blog/credit-notes"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Partial refunds and the original sale", href: "https://stripe.com/resources/more/partial-refunds" },
    { label: "Stripe: Multiple refunds and the original charge limit", href: "https://docs.stripe.com/refunds" },
    { label: "Square: Partial refund records and pending outcomes", href: "https://developer.squareup.com/docs/payments-api/refund-payments" },
    { label: "Cybersource: Check an uncertain refund before retrying", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/ctv/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Etail Depot: Refund treatment in the fee schedule", href: "/company/legal/fees" },
  ],
};
