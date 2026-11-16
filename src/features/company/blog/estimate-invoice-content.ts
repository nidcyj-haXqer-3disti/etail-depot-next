import type { BlogArticle } from "./content";

/** Archive G0441, adapted around price expectations, estimate assumptions and the amount actually billable. */
export const estimateInvoiceArticle: BlogArticle = {
  path: "/company/blog/estimate-vs-invoice",
  title: "Your customer remembers the estimate",
  description: "An estimate sets a price expectation. An invoice asks for payment. Explain changes early and keep the agreed scope, prior billing and amount due connected.",
  summary: "You may remember a provisional number. Your customer remembers the amount they planned to spend. The conversation between the estimate and the invoice matters.",
  searchTitle: "Estimate vs. invoice: avoiding a surprise final bill",
  relatedPaths: ["/company/blog/contract-invoices", "/company/blog/types-of-invoice-discrepancies"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Reviewing estimates before invoicing and explaining price changes", href: "https://stripe.com/resources/more/how-can-you-convert-an-estimate-to-an-invoice" },
    { label: "Australian Government: Clear scope, costs and terms in quotes", href: "https://business.gov.au/people/contractors/prepare-quotes" },
    { label: "Intuit: Connecting estimates and progress invoices", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/invoicing/set-send-progress-invoices-quickbooks-online/L0Ymm6WjR_US_en_US" },
  ],
};
