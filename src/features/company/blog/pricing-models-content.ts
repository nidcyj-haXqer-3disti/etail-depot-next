import type { BlogArticle } from "./content";

/** Archive G0329, adapted with current pricing definitions and comparison guidance. */
export const pricingModelsArticle: BlogArticle = {
  path: "/company/blog/interchange-plus-vs-flat-rate-pricing",
  title: "Interchange-plus vs. flat-rate pricing",
  description: "Interchange-plus separates specified card costs from the provider’s markup. Flat-rate pricing gives a stated rate for a defined payment category. To compare them fairly, apply both offers to the same transactions and include the other charges in each agreement.",
  summary: "Compare interchange-plus and flat-rate pricing using your actual card mix, payment count and complete fee schedule, rather than the advertised rate alone.",
  searchTitle: "Interchange-plus vs. flat-rate pricing",
  relatedPaths: ["/company/blog/choose-a-merchant-services-provider", "/company/blog/payment-processing-rfp"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "read-the-pricing-definition", title: "Find out what the quoted rate includes" },
    { id: "compare-one-volume", title: "Use the same transactions for both offers" },
    { id: "include-the-work-and-exceptions", title: "Compare the complete cost" },
    { id: "make-the-choice", title: "Choose the model your business can verify" },
  ],
  sources: [
    { label: "Visa: Interchange reimbursement fees and merchant pricing", href: "https://www.visa.com/en-us/support/business/regulation-fees" },
    { label: "Stripe: Interchange-plus pricing explained", href: "https://stripe.com/resources/more/interchange-plus-pricing-explained" },
    { label: "Stripe: Payment categories and additional charges", href: "https://stripe.com/pricing" },
    { label: "Etail Depot: Card processing pricing", href: "/pricing" },
    { label: "Etail Depot: Fees and billing", href: "/company/legal/fees" },
  ],
};
