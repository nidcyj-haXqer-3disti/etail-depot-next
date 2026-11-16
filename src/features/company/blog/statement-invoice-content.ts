import type { BlogArticle } from "./content";

/** Archive G0564, adapted around duplicate payment risk and the purpose of customer account statements. */
export const statementInvoiceArticle: BlogArticle = {
  path: "/company/blog/statement-vs-invoice",
  title: "When one sale looks like two bills",
  description: "Understand a statement versus an invoice before paying the same charge twice. Check statement type, carried balances, payments and credits against the original bills.",
  summary: "An invoice arrives, then a statement lists it again. The useful question is what remains unpaid, not how many documents landed in the inbox.",
  searchTitle: "Statement vs. invoice: avoid paying the same charge twice",
  relatedPaths: ["/company/blog/open-invoices", "/company/blog/invoice-vs-receipt"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Intuit: Customer statement formats and updates", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/customer-statements/create-send-customer-statements-quickbooks-online/L8bvb69Gg_US_en_US" },
    { label: "Stripe: Billing statements, invoices and account balances", href: "https://stripe.com/resources/more/how-to-make-a-billing-statement-a-guide-for-businesses" },
    { label: "Stripe: Credit notes and reductions to invoice balances", href: "https://docs.stripe.com/invoicing/dashboard/credit-notes" },
    { label: "IRS: Supporting records for business purchases", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
  ],
};
