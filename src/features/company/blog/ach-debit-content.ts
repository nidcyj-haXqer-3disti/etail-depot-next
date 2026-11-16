import type { BlogArticle } from "./content";

/** Archive G0034, adapted with current ACH authorization and account guidance. */
export const achDebitArticle: BlogArticle = {
  path: "/company/blog/ach-debit",
  title: "What is an ACH debit?",
  description: "An ACH debit lets a business collect an authorized payment from a US bank account through the Automated Clearing House network. The customer can authorize one collection or a recurring arrangement. Submitting the debit starts processing; it does not guarantee that the business has collected the money.",
  summary: "Learn how ACH debits work, who starts the payment, what authorization covers and how to follow validation, processing and returned payments.",
  searchTitle: "What is an ACH debit?",
  relatedPaths: ["/company/blog/payment-processing-systems", "/company/blog/transaction-details-reports"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "debit-credit", title: "Who starts the payment?" },
    { id: "how-it-works", title: "How the instruction reaches the bank" },
    { id: "authorization", title: "Check what the authorization covers" },
    { id: "timing-costs", title: "Confirm timing and costs with the provider" },
    { id: "before-use", title: "Submit the debit and follow the result" },
  ],
  sources: [
    { label: "Nacha: How ACH payments work", href: "https://www.nacha.org/content/how-ach-payments-work" },
    { label: "Nacha: ACH participants and payment types", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "Nacha: Compliant ACH authorizations", href: "https://www.nacha.org/news/importance-compliant-ach-authorizations" },
    { label: "Nacha: Account validation for WEB debits", href: "https://www.nacha.org/rules/supplementing-fraud-detection-standards-web-debits" },
    { label: "Etail Depot: ACH availability, records and returns", href: "/services/ach-payments" },
  ],
};
