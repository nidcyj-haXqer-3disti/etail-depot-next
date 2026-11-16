import type { BlogArticle } from "./content";

/** Archive G0306, adapted with current bank-detail and verification guidance. */
export const bankAccountNumberArticle: BlogArticle = {
  path: "/company/blog/bank-account-number",
  title: "Bank account numbers: find, use and verify the right details",
  description: "A bank account number identifies your account at a financial institution. For US ACH payments, it works with a routing number. It is different from the number on your debit card, and knowing it does not give someone permission to collect a payment.",
  summary: "Find the right bank account number, preserve leading zeros and verify changed payment details before using them.",
  searchTitle: "Bank account numbers: find, use and verify the right details",
  relatedPaths: ["/company/blog/routing-number", "/company/blog/ach-verification"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "locate", title: "Get the number from your bank" },
    { id: "distinguish", title: "Keep each number in its own field" },
    { id: "protect", title: "Verify changes before using them" },
  ],
  sources: [
    { label: "Nacha: Finding account details and resolving ACH payment problems", href: "https://www.nacha.org/content/consumer-faqs-ach-payments" },
    { label: "Microsoft: Keeping leading zeros and large numbers", href: "https://support.microsoft.com/en-us/excel/keeping-leading-zeros-and-large-numbers" },
    { label: "Nacha: Account validation for online ACH debits", href: "https://www.nacha.org/rules/supplementing-fraud-detection-standards-web-debits" },
    { label: "FBI: Verifying changes to payment instructions", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
  ],
};
