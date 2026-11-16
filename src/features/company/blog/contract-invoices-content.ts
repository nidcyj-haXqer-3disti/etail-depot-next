import type { BlogArticle } from "./content";

/** Archive G0418, adapted around agreed billing events, scope changes and readable project charges. */
export const contractInvoicesArticle: BlogArticle = {
  path: "/company/blog/contract-invoices",
  title: "Your invoice should not reopen the deal",
  description: "A contract invoice should connect the charge to agreed work. Keep billing milestones, approved changes and the amount due clear before asking for payment.",
  summary: "The project can feel finished while the bill is still hard to approve. Connect what was agreed, what changed and what you are asking the customer to pay now.",
  searchTitle: "Contract invoices: billing for agreed work and changes",
  relatedPaths: ["/company/blog/types-of-invoice-discrepancies", "/company/blog/important-invoice-management-tips"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Contract invoices and agreed billing events", href: "https://stripe.com/resources/more/contract-invoices-101-what-to-include-and-how-to-handle-invoices" },
    { label: "Australian Government: Documenting contract changes", href: "https://business.gov.au/people/contractors/prepare-a-contract" },
    { label: "UK Small Business Commissioner: Invoice descriptions and references", href: "https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/a-guide-for-effective-invoicing/" },
    { label: "Stripe: Invoice references, notes and custom fields", href: "https://docs.stripe.com/invoicing/customize" },
  ],
};
