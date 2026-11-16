import type { BlogArticle } from "./content";

/** Archive G1834, adapted around usable purchasing permission and expense decisions. */
export const cardExpensePolicyArticle: BlogArticle = {
  path: "/company/blog/create-a-corporate-credit-card-expense-policy",
  title: "The company card works. The spending rules should, too.",
  description: "A card limit cannot decide whether a renewal is worth paying. A useful expense policy makes the decision clear before the bill arrives.",
  summary: "How to write a corporate credit card expense policy that makes approvals, renewals, purchase records and urgent exceptions clear to employees.",
  searchTitle: "How to write a corporate credit card expense policy",
  relatedPaths: ["/company/blog/shared-company-credit-cards", "/company/blog/can-you-use-a-personal-credit-card-for-business"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Issuing spending controls and their limits", href: "https://docs.stripe.com/issuing/controls/spending-controls" },
    { label: "Stripe: How merchant categories identify businesses", href: "https://docs.stripe.com/issuing/categories" },
    { label: "IRS Publication 463: Expense records and business purpose", href: "https://www.irs.gov/publications/p463" },
    { label: "FTC: Limiting access to sensitive business information", href: "https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business" },
  ],
};
