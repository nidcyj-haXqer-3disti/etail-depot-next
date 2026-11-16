import type { BlogArticle } from "./content";

/** Archive G0528, adapted around the evidence behind an invoice marked paid. */
export const invoiceReceiptArticle: BlogArticle = {
  path: "/company/blog/invoice-vs-receipt",
  title: "The invoice says paid. Where is the receipt?",
  description: "An invoice explains the charge. A receipt records a payment. See why a paid label can leave questions about deposits, credits and refunds unanswered.",
  summary: "A customer asks for proof of payment. Another copy of the bill may leave the important part unexplained: how its balance was cleared.",
  searchTitle: "Invoice vs. receipt: what each document proves",
  relatedPaths: ["/company/blog/create-an-invoice", "/company/blog/expense-receipts"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Receipts, paid invoices and payment confirmation", href: "https://docs.stripe.com/receipts" },
    { label: "Stripe: Invoice statuses and payments recorded elsewhere", href: "https://docs.stripe.com/invoicing/overview" },
    { label: "Stripe: Credit notes and invoice balances", href: "https://docs.stripe.com/invoicing/dashboard/credit-notes" },
    { label: "Stripe: Partial payments and remaining amounts", href: "https://docs.stripe.com/invoicing/partial-payments" },
    { label: "IRS: Supporting documents for business records", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
  ],
};
