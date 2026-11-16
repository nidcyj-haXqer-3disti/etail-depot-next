import type { BlogArticle } from "./content";

/** Archive G0605, adapted around stable invoice identity across billing systems. */
export const invoiceNumberArticle: BlogArticle = {
  path: "/company/blog/invoice-number",
  title: "Invoice numbers matter most when something goes wrong",
  description: "An invoice number connects a bill to its reminders, corrections and payments. Keep that identity intact when you resend invoices or change billing systems.",
  summary: "A customer asks for another copy. Your software changes. A payment arrives without enough detail. The invoice reference needs to survive all three.",
  searchTitle: "Invoice numbers: keep bills traceable and avoid duplicates",
  relatedPaths: ["/company/blog/create-an-invoice", "/company/blog/credit-notes"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Invoice prefixes, merchant accounts and sequence migration", href: "https://docs.stripe.com/invoicing/customize" },
    { label: "Oracle: Supplier invoice numbers and duplicate import checks", href: "https://docs.oracle.com/en/cloud/saas/financials/25d/fappp/invoice-open-interface-table-ap-invoices-interface.html" },
    { label: "Stripe: Issued invoices, revisions and voiding", href: "https://docs.stripe.com/invoicing/overview" },
    { label: "HMRC: Numbering requirements for full UK VAT invoices", href: "https://www.gov.uk/hmrc-internal-manuals/vat-trader-records/vatrec5010" },
  ],
};
