import type { BlogArticle } from "./content";

/** Archive G1842, adapted around temporary permissions and ongoing card administration. */
export const corporateCardManagementArticle: BlogArticle = {
  path: "/company/blog/managing-corporate-credit-cards",
  title: "The trip ended. The company card limit stayed high.",
  description: "A higher limit for a trip. Extra access to cover a colleague. Managing company cards means keeping those permissions in step with the work.",
  summary: "Managing corporate credit cards means reviewing temporary limits, account access and unfinished purchases as the business changes.",
  searchTitle: "Managing corporate credit cards: limits, access and follow-up",
  relatedPaths: ["/company/blog/create-a-corporate-credit-card-expense-policy", "/company/blog/shared-company-credit-cards"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Capital One: Employee card limits and account permissions", href: "https://www.capitalone.com/small-business/credit-cards/benefits/employee-cards/" },
    { label: "Stripe: Authorizations, capture and refund transactions", href: "https://docs.stripe.com/issuing/purchases/authorizations" },
    { label: "Capital One: Blocking payments and canceling subscriptions", href: "https://www.capitalone.com/help-center/credit-cards/recurring-transactions/" },
    { label: "Federal Trade Commission: Limiting access to business information", href: "https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business" },
  ],
};
