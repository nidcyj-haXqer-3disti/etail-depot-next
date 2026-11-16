import type { BlogArticle } from "./content";

/** Archive G1800, adapted around purchasing responsibility, card controls and continuing obligations. */
export const virtualCardsArticle: BlogArticle = {
  path: "/company/blog/virtual-credit-cards",
  title: "Virtual credit cards: give every payment an owner",
  description: "A separate card number can make spending easier to trace. Its value depends on who approves the purchase, what the card allows and what happens when the business no longer needs it.",
  summary: "Learn how virtual credit cards work, what spending controls can do and why deleting a card does not cancel a subscription or finish the accounting.",
  searchTitle: "Virtual credit cards: spending controls and payment ownership",
  relatedPaths: ["/company/blog/b2b-payment-methods", "/company/blog/credit-cards-and-digital-wallets"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Visa: Virtual cards for business purchasing", href: "https://www.visa.com/en-us/business/cards/virtual-card" },
    { label: "Capital One: Virtual card types and account access", href: "https://www.capitalone.com/help-center/credit-cards/using-virtual-credit-cards/" },
    { label: "Stripe: Spending controls and their limitations", href: "https://docs.stripe.com/issuing/controls/spending-controls" },
    { label: "Stripe: Single use cards and later transactions", href: "https://docs.stripe.com/issuing/controls/lifecycle-controls" },
    { label: "Capital One: Virtual cards and subscription cancellation", href: "https://www.capitalone.com/learn-grow/money-management/virtual-credit-card-for-subscriptions/" },
    { label: "IRS: Records supporting business purchases", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
  ],
};
