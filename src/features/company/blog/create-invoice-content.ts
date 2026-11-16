import type { BlogArticle } from "./content";

/** Archive G0480, adapted around invoice clarity, buyer approval and the record behind the amount requested. */
export const createInvoiceArticle: BlogArticle = {
  path: "/company/blog/create-an-invoice",
  title: "The cost of an invoice that needs explaining",
  description: "Create an invoice customers can understand and approve, with clear descriptions, identifiable charges, accurate balances and payment terms that match the agreement.",
  summary: "A documented unpaid invoice was resolved after its vague description was clarified. What you put on the bill can determine how much work remains before someone can approve it.",
  searchTitle: "How to create an invoice customers can approve",
  relatedPaths: ["/company/blog/contract-invoices", "/company/blog/pay-invoice-by-credit-card"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "UK Small Business Commissioner: Invoice clarity and reported cases", href: "https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/a-guide-for-effective-invoicing/" },
    { label: "Stripe: Creating an invoice and describing charges", href: "https://stripe.com/resources/more/how-to-create-an-invoice" },
    { label: "Stripe: Invoice references, memos and draft fields", href: "https://docs.stripe.com/invoicing/customize" },
    { label: "IRS: Invoices and supporting business records", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
  ],
};
