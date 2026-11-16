import type { BlogArticle } from "./content";

/** Archive G0839, adapted with ledger and transaction-record guidance. */
export const accountingLedgersArticle: BlogArticle = {
  path: "/company/blog/accounting-ledgers",
  title: "How accounting ledgers work",
  description: "A customer invoice is followed by two payments. Those are three events, but only one sale. An accounting ledger groups the entries by account so you can trace each balance back to what happened and spot when the same event has been counted twice.",
  summary: "Learn how accounting ledgers connect journal entries, customer balances and financial reports, and how to check for missing or duplicated transactions.",
  searchTitle: "Accounting ledgers: journals, entries and balances",
  relatedPaths: ["/company/blog/accounts-payable-vs-accounts-receivable", "/company/blog/read-a-balance-sheet"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "journal-to-ledger", title: "Follow the entry from transaction to account" },
    { id: "trace-a-sale", title: "Trace a sale and its payments" },
    { id: "control-and-detail", title: "Connect totals to supporting detail" },
  ],
  sources: [
    { label: "IRS: Publication 583, bookkeeping and business records", href: "https://www.irs.gov/publications/p583" },
    { label: "BILL: Journals, general ledgers and subsidiary ledgers", href: "https://www.bill.com/learning/accounting-ledger" },
    { label: "Intuit: Matching bank transactions to existing records", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/bank-feeds/match-online-bank-transactions-quickbooks-online/L6qyw0PvP_US_en_US" },
  ],
};
