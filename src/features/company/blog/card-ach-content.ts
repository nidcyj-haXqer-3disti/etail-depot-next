import type { BlogArticle } from "./content";

/** Archive G0005, adapted with current payment authorization and account guidance. */
export const cardAchArticle: BlogArticle = {
  path: "/company/blog/card-vs-ach-payments",
  title: "ACH vs. card payments: choosing how customers pay",
  description: "ACH and cards can both collect a customer’s payment, but they give a business different signals along the way. Choose based on how your customers buy, when you need to fulfill the order and how your team will handle an unsuccessful payment. Compare the complete arrangement, not just the transaction rate.",
  summary: "Compare ACH and card payments by customer experience, authorization, funding, costs and returns so you can choose what fits each sale.",
  searchTitle: "ACH vs. card payments: choosing how customers pay",
  relatedPaths: ["/company/blog/ach-debit", "/company/blog/card-authorization"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "payment-signal", title: "Understand what an approval tells you" },
    { id: "sale-fit", title: "Match the method to the sale" },
    { id: "compare-proposals", title: "Compare the complete arrangement" },
    { id: "before-launch", title: "Check the whole payment journey" },
  ],
  sources: [
    { label: "Cybersource: Card authorization", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/fdiglobal/rest/payments/payments-intro/payments-services-intro/payments-intro-processing-auth.html" },
    { label: "Nacha: How ACH works", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "Stripe: ACH Direct Debit processing and exceptions", href: "https://docs.stripe.com/payments/ach-direct-debit" },
    { label: "Etail Depot: Payment method and recurring billing terms", href: "/company/legal/merchant-services" },
    { label: "Etail Depot: ACH availability and account terms", href: "/services/ach-payments" },
  ],
};
