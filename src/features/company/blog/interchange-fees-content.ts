import type { BlogArticle } from "./content";

/** Archive G0353, adapted with current network definitions and merchant fee guidance. */
export const interchangeFeesArticle: BlogArticle = {
  path: "/company/blog/interchange-fees",
  title: "Interchange fees explained",
  description: "Interchange is one part of the cost behind a card payment. For Visa and Mastercard purchases, it generally passes from the acquiring bank to the cardholder’s issuing bank. Your business pays the acceptance charges in its own agreement, which can include more than interchange.",
  summary: "Understand interchange fees, transaction qualification and statement charges. Learn what to ask your provider when card processing costs change.",
  searchTitle: "Interchange fees explained",
  relatedPaths: ["/company/blog/interchange-plus-vs-flat-rate-pricing", "/company/blog/payment-processing-rfp"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "separate-the-components", title: "Interchange is only part of your processing bill" },
    { id: "understand-qualification", title: "Check the criteria attached to the rate" },
    { id: "read-the-calculation", title: "Read the calculation as well as the percentage" },
    { id: "investigate-cost-changes", title: "Ask what changed when costs rise" },
  ],
  sources: [
    { label: "Visa: Interchange reimbursement fees and merchant pricing", href: "https://www.visa.com/en-us/support/business/regulation-fees" },
    { label: "Mastercard: Interchange rates and qualification", href: "https://www.mastercard.com/us/en/business/support/merchant-interchange-rates.html" },
    { label: "Stripe: Interchange fee components and cost factors", href: "https://stripe.com/resources/more/interchange-fees-101-what-they-are-how-they-work-and-how-to-cut-costs" },
    { label: "Etail Depot: Card processing pricing", href: "/pricing" },
    { label: "Etail Depot: Fees and billing", href: "/company/legal/fees" },
  ],
};
