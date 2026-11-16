import type { BlogArticle } from "./content";

/** Archive G0370, adapted around the handoff from completed work to a settled invoice. */
export const invoiceManagementArticle: BlogArticle = {
  path: "/company/blog/important-invoice-management-tips",
  title: "The work is done. The invoice is still waiting.",
  description: "Good invoice management keeps the bill, payments and follow-up together. Reduce avoidable delays without chasing customers for money they have already paid.",
  summary: "Sending the invoice is the beginning. Getting it to the right person, tracking the remaining balance and knowing who acts next keep it moving.",
  searchTitle: "Invoice management tips for small businesses",
  relatedPaths: ["/company/blog/cash-flow-statement", "/company/blog/how-to-create-a-payment-link"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "UK Small Business Commissioner: Getting invoices processed", href: "https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/a-guide-for-effective-invoicing/" },
    { label: "Stripe: Invoice statuses and payments made elsewhere", href: "https://docs.stripe.com/invoicing/overview" },
    { label: "IRS: Supporting business records", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
    { label: "FBI IC3: Verifying changes to payment information", href: "https://www.ic3.gov/CrimeInfo/BEC" },
  ],
};
