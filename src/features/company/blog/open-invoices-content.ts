import type { BlogArticle } from "./content";

/** Archive G0538, adapted around checking the current obligation before chasing an open invoice. */
export const openInvoicesArticle: BlogArticle = {
  path: "/company/blog/open-invoices",
  title: "Not every open invoice needs another reminder",
  description: "An open invoice is not necessarily overdue. Check the report date, remaining balance and pending payments before chasing a customer who may already have paid.",
  summary: "The invoice list tells you where to look. The current payment record tells you whether another reminder belongs in the customer’s inbox.",
  searchTitle: "Open invoices: what they mean and when to follow up",
  relatedPaths: ["/company/blog/pay-invoice-by-credit-card", "/company/blog/writing-a-letter-for-outstanding-payment"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Xero: Report dates and aged receivables", href: "https://central.xero.com/0/article/Aged-Receivables-Detail-report-New" },
    { label: "Stripe: Open invoices and invoice status changes", href: "https://docs.stripe.com/invoicing/overview" },
    { label: "Stripe: Partial payments and overpayment risk", href: "https://docs.stripe.com/invoicing/partial-payments" },
    { label: "UK Small Business Commissioner: Checking and following up on unpaid invoices", href: "https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/help-with-unpaid-invoices/" },
  ],
};
