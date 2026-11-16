import type { BlogArticle } from "./content";

/** Archive G0506, adapted around first invoice delivery, useful wording and verifiable payment instructions. */
export const invoiceEmailArticle: BlogArticle = {
  path: "/company/blog/write-an-invoice-email",
  title: "Write the invoice email for the person who pays it",
  description: "Write a clear invoice email that reaches the right person. Include the reference, amount and due date, with concise sample wording and verifiable payment instructions.",
  summary: "An invoice sent to a project contact can still be missing from the finance team’s queue. Give the next reader enough context to recognize, route and check the bill.",
  searchTitle: "How to write an invoice email customers can act on",
  relatedPaths: ["/company/blog/create-an-invoice", "/company/blog/writing-a-letter-for-outstanding-payment"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "UK Small Business Commissioner: Invoice routing and a reported payment case", href: "https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/a-guide-for-effective-invoicing/" },
    { label: "Stripe: Writing an invoice email", href: "https://stripe.com/resources/more/how-to-write-an-invoice-email" },
    { label: "FBI: Verifying payment requests and changed instructions", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
    { label: "Stripe: Invoice emails, reminders and payment receipts", href: "https://docs.stripe.com/invoicing/send-email" },
  ],
};
