import type { BlogArticle } from "./content";

/** Archive G0363, adapted with current merchant pricing and funding guidance. */
export const merchantDiscountArticle: BlogArticle = {
  path: "/company/blog/merchant-discount-rate",
  title: "What is the merchant discount rate?",
  description: "The merchant discount rate, or MDR, is the charge for accepting card payments under your agreement. It can cover several processing components. To understand your actual cost, compare the fee schedule with the statement. The gap between sales and bank deposits is not a fee calculation on its own.",
  summary: "Understand the merchant discount rate and calculate your effective processing cost without counting refunds, reserves or payout timing as fees.",
  searchTitle: "What is the merchant discount rate?",
  relatedPaths: ["/company/blog/interchange-fees", "/company/blog/interchange-plus-vs-flat-rate-pricing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "read-the-agreed-price", title: "Identify what the rate covers" },
    { id: "calculate-an-effective-rate", title: "Calculate the cost from actual fees" },
    { id: "compare-equivalent-periods", title: "Understand why the average moves" },
    { id: "resolve-a-question", title: "Ask for a specific fee explanation" },
  ],
  sources: [
    { label: "Visa: Merchant discount and interchange", href: "https://www.visa.com/en-us/support/business/regulation-fees" },
    { label: "Mastercard: Merchant pricing and interchange components", href: "https://www.mastercard.com/us/en/business/support/merchant-interchange-rates.html" },
    { label: "Stripe: Merchant discount rate and pricing models", href: "https://stripe.com/resources/more/merchant-discount-rate" },
    { label: "Etail Depot: Fees and billing", href: "/company/legal/fees" },
    { label: "Etail Depot: Payout calculations and reserves", href: "/company/legal/payouts-and-reserves" },
  ],
};
