import type { BlogArticle } from "./content";

/** Archive G1813, adapted around reimbursement timing and keeping one purchase distinct from its repayment. */
export const personalBusinessExpensesArticle: BlogArticle = {
  path: "/company/blog/can-you-use-a-personal-credit-card-for-business",
  title: "A business expense on your personal card is still your bill",
  description: "The company may agree to repay you before the money actually arrives. Using a personal card for work creates a timing problem and a bookkeeping job that both need an owner.",
  summary: "Using a personal credit card for business expenses? Understand reimbursement timing, receipt records, double counting and the difference between owner and employee repayments.",
  searchTitle: "Using a personal credit card for business expenses",
  relatedPaths: ["/company/blog/business-credit-card-vs-personal", "/company/blog/expense-receipts"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Chase: Using a consumer card for business purchases", href: "https://www.chase.com/personal/credit-cards/education/basics/can-i-use-a-consumer-credit-card-for-business" },
    { label: "IRS: Records supporting business expenses", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
    { label: "Intuit: Recording purchases made with personal funds", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/journal-entries/pay-business-expenses-personal-funds/L2hNmFDpt_US_en_US" },
    { label: "IRS: Employee reimbursements and accountable plans", href: "https://www.irs.gov/publications/p463" },
  ],
};
