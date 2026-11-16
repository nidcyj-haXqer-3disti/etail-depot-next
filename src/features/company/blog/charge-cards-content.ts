import type { BlogArticle } from "./content";

/** Archive G1815, adapted around full repayment and the timing of business cash. */
export const chargeCardsArticle: BlogArticle = {
  path: "/company/blog/charge-cards",
  title: "Charge cards: when the whole bill comes due",
  description: "A charge card can pay a supplier before your customer pays you. The question is what happens when the card bill arrives first.",
  summary: "What is a charge card? Understand full repayment, optional financing, flexible spending limits and the cash timing behind a business purchase.",
  searchTitle: "What is a charge card? Repayment, spending limits and fees",
  relatedPaths: ["/company/blog/credit-card-interest", "/company/blog/calculate-working-capital"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "FTC: Charge cards, repayment and fees", href: "https://consumer.ftc.gov/articles/comparing-credit-charge-secured-credit-debit-or-prepaid-cards" },
    { label: "American Express: Payment options and spending capacity", href: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/compare-credit-cards/compare-flexible-payment-credit-cards/" },
    { label: "Stripe: Charge card programs and repayment schedules", href: "https://stripe.com/guides/charge-cards-101" },
  ],
};
