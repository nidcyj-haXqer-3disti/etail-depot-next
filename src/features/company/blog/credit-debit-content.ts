import type { BlogArticle } from "./content";

/** Archive G0081, adapted with current card, pricing and customer support guidance. */
export const creditDebitArticle: BlogArticle = {
  path: "/company/blog/credit-cards-vs-debit-cards",
  title: "Credit cards vs. debit cards when accepting payments",
  description: "Credit and debit cards can look the same at checkout, but they draw on different funds. For your business, the useful comparison is processing costs, pending payments and what to tell a customer waiting for a refund.",
  summary: "Compare credit and debit cards from a merchant’s perspective: customer funds, processing fees, authorization holds, refunds and checkout checks.",
  searchTitle: "Credit cards vs. debit cards: a merchant’s guide",
  relatedPaths: ["/company/blog/credit-card-networks", "/company/blog/card-authorization"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "customer-funds", title: "Understand where the money comes from" },
    { id: "merchant-cost", title: "Compare the price your business pays" },
    { id: "holds-and-refunds", title: "Explain pending payments and refunds" },
    { id: "customer-charges", title: "Check the rules before adding a fee" },
    { id: "checkout-checks", title: "Make both work at checkout" },
  ],
  sources: [
    { label: "CFPB: Credit, debit and prepaid card differences", href: "https://www.consumerfinance.gov/ask-cfpb/how-are-prepaid-cards-debit-cards-and-credit-cards-different-en-433/" },
    { label: "Visa: Merchant pricing and interchange", href: "https://www.visa.com/en-us/support/business/regulation-fees" },
    { label: "Federal Reserve: Debit interchange and routing", href: "https://www.federalreserve.gov/paymentsystems/regii-about.htm" },
    { label: "FTC: Card declines and authorization holds", href: "https://consumer.ftc.gov/articles/when-company-declines-your-credit-or-debit-card" },
    { label: "Stripe: Refunds and payment reversals", href: "https://docs.stripe.com/refunds" },
    { label: "Visa: U.S. merchant surcharge requirements", href: "https://usa.visa.com/dam/VCOM/global/support-legal/documents/merchant-surcharging-qa-for-web.pdf" },
  ],
};
