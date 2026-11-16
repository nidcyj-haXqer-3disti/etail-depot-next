import type { BlogArticle } from "./content";

/** Archive G1104, adapted around supplier commitments missing from the payment queue. */
export const payableForecastArticle: BlogArticle = {
  path: "/company/blog/forecast-accounts-payable",
  title: "Accounts payable forecasting: the bills still on their way",
  description: "The invoice list can look quiet while the business is already committed to spending. A useful forecast brings those costs into view before the bills compete for the same cash.",
  summary: "Forecast accounts payable beyond the open invoice list. Connect supplier commitments, expected bills and payment dates without mistaking a delay for a saving.",
  searchTitle: "Accounts payable forecasting: look beyond the invoice list",
  relatedPaths: ["/company/blog/accrued-expenses-vs-accounts-payable", "/company/blog/accounts-payable-vs-accounts-receivable"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "before-the-invoice", title: "The commitment comes before the invoice" },
    { id: "payment-dates", title: "Changing a date does not create a saving" },
  ],
  sources: [
    { label: "BILL: Forecasting supplier payments and limitations of historical data", href: "https://www.bill.com/blog/how-to-forecast-accounts-payable" },
    { label: "OpenStax: Costs incurred before payment and accrual accounting", href: "https://openstax.org/books/principles-financial-accounting/pages/4-2-discuss-the-adjustment-process-and-illustrate-common-types-of-adjusting-entries" },
    { label: "BDC: Cash flow forecasts, weekly visibility and alternative scenarios", href: "https://www.bdc.ca/en/articles-tools/money-finance/manage-finances/making-projection-coming-year" },
    { label: "ACCA: Collection timing and agreed supplier credit terms", href: "https://www.accaglobal.com/gb/en/business-finance/business-plans/example-cashflow.html" },
  ],
};
