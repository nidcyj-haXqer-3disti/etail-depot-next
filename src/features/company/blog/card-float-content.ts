import type { BlogArticle } from "./content";

/** Archive G1855, adapted around the spending decisions made before a card bill leaves the bank. */
export const cardFloatArticle: BlogArticle = {
  path: "/company/blog/credit-card-float",
  title: "Credit card float: the cash already has a job",
  description: "Paying by card leaves cash in the bank until repayment. That breathing room is useful, provided the next spending decision still accounts for the bill.",
  summary: "Credit card float can make cash look available before the bill is paid. Understand the timing, grace period conditions and commitments behind the balance.",
  searchTitle: "What is credit card float? Cash timing and the unpaid bill",
  relatedPaths: ["/company/blog/credit-card-interest", "/company/blog/charge-cards"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "BILL: Credit card float and unspent bank balances", href: "https://www.bill.com/learning/credit-card-float" },
    { label: "Chase: Business card billing cycles and payment dates", href: "https://www.chase.com/personal/credit-cards/education/basics/business-credit-card-billing-cycles" },
    { label: "CFPB: Purchase grace periods and their conditions", href: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-grace-period-for-a-credit-card-en-47/" },
    { label: "Intuit: Recording a payment against an existing supplier bill", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/accounts-payable/learn-difference-bills-checks-expenses-quickbooks/L0ZtL2TYI_US_en_US" },
    { label: "Xero: Forecasting cash receipts, payments and shortfalls", href: "https://www.xero.com/us/guides/cash-flow-forecasting/" },
  ],
};
