import type { BlogArticle } from "./content";

/** Archive G0541, adapted around the commercial choices behind payment terms and their actual execution. */
export const paymentTermsArticle: BlogArticle = {
  path: "/company/blog/payment-terms-and-conditions",
  title: "Payment terms change the value of the deal",
  description: "Write payment terms that make the amount, due date and collection method clear. Consider cash flow, early payment discounts and permission to charge later.",
  summary: "Agreeing the price leaves another decision open: who carries the cost while the work is being done? Payment terms deserve attention before the invoice goes out.",
  searchTitle: "How to write payment terms and conditions",
  relatedPaths: ["/company/blog/contract-invoices", "/company/blog/set-up-recurring-invoices"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Australian Government: Payment terms and customer credit", href: "https://business.gov.au/finance/payments-and-invoicing/payment-terms" },
    { label: "UK Small Business Commissioner: Agreeing terms and stating the due date", href: "https://www.smallbusinesscommissioner.gov.uk/help-and-guidance/all-advice/a-guide-for-effective-invoicing/" },
    { label: "Stripe: Invoice payment terms and accepted methods", href: "https://docs.stripe.com/invoicing/customize" },
    { label: "Stripe: Permission to save and charge payment methods later", href: "https://docs.stripe.com/payments/save-and-reuse" },
  ],
};
