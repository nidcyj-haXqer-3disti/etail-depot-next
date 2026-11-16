import type { BlogArticle } from "./content";

/** Archive G1802, adapted around shared card credentials and business continuity. */
export const sharedCompanyCardsArticle: BlogArticle = {
  path: "/company/blog/shared-company-credit-cards",
  title: "The hidden cost of sharing one company credit card",
  description: "One card can quietly become the payment method for half the business. Replacing it reveals how much the company depends on a number nobody fully tracks.",
  summary: "Sharing a company credit card can complicate spending records, employee departures and supplier payments. Learn how to separate access without losing central oversight.",
  searchTitle: "Sharing a company credit card: risks and better controls",
  relatedPaths: ["/company/blog/virtual-credit-cards", "/company/blog/b2b-payment-methods"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Capital One: Employee cards and account permissions", href: "https://www.capitalone.com/learn-grow/business-resources/employee-cards/" },
    { label: "Capital One: Reporting fraud and updating saved payments", href: "https://www.capitalone.com/help-center/fraud-disputes/report-fraud/" },
    { label: "Visa: Account updates for stored card payments", href: "https://www.visa.com/en-us/products/visa-account-updater" },
    { label: "FTC: Limiting access and removing former employees’ access", href: "https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business" },
  ],
};
