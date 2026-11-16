import type { BlogArticle } from "./content";

/** Archive G0448, adapted around the business decision behind customer payment terms and receivables turnover. */
export const receivableTurnoverArticle: BlogArticle = {
  path: "/company/blog/accounts-receivable-turnover",
  title: "The wait between making a sale and getting paid",
  description: "Calculate accounts receivable turnover and understand what it reveals about customer payment terms, overdue invoices and the time your business waits for cash.",
  summary: "A customer can pay on time while your business waits weeks for the money. Receivables turnover helps you examine that wait without confusing agreed terms with late payment.",
  searchTitle: "Accounts receivable turnover: formula and meaning",
  relatedPaths: ["/company/blog/important-invoice-management-tips", "/company/blog/writing-a-letter-for-outstanding-payment"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "OpenStax: Receivables turnover and collection period", href: "https://openstax.org/books/principles-financial-accounting/pages/9-3-determine-the-efficiency-of-receivables-management-using-financial-ratios" },
    { label: "Stripe: Receivables turnover inputs and seasonal comparisons", href: "https://stripe.com/resources/more/how-to-calculate-accounts-receivable-turnover" },
    { label: "OpenStax: Customer credit terms and receivables management", href: "https://openstax.org/books/principles-finance/pages/19-4-receivables-management" },
    { label: "Intuit: Outstanding balances and invoice aging", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/accounts-receivable-reports/run-accounts-receivable-aging-report/L4N7PC2hg_US_en_US" },
  ],
};
