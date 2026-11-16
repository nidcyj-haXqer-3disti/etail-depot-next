import type { BlogArticle } from "./content";

/** Archive G0384, adapted around useful payment reminders and responding to the customer's answer. */
export const paymentReminderArticle: BlogArticle = {
  path: "/company/blog/writing-a-letter-for-outstanding-payment",
  title: "A payment reminder needs more than a firmer tone",
  description: "Write an overdue payment reminder with the correct balance, clear payment instructions and room for a useful reply. Includes wording you can adapt.",
  summary: "Another reminder should move the conversation forward. Ask clearly for payment, make the invoice easy to identify and act on what the customer tells you.",
  searchTitle: "How to write an outstanding-payment letter",
  relatedPaths: ["/company/blog/important-invoice-management-tips", "/company/blog/types-of-invoice-discrepancies"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: What to include in an overdue invoice letter", href: "https://stripe.com/resources/more/how-to-strategically-write-and-use-an-outstanding-payment-letter" },
    { label: "UK Small Business Commissioner: Following up on unpaid invoices", href: "https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/help-with-unpaid-invoices/" },
    { label: "Stripe: Invoice emails and reminder settings", href: "https://docs.stripe.com/invoicing/send-email" },
  ],
};
