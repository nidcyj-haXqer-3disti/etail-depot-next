import type { BlogArticle } from "./content";

/** Archive G0845, adapted with journal-entry and supplier-credit guidance. */
export const payableEntriesArticle: BlogArticle = {
  path: "/company/blog/accounts-payable-journal-entry",
  title: "Accounts payable journal entries: bill, credit and payment",
  description: "An accounts payable journal entry records a change in what a business owes a supplier. Under accrual accounting, a purchase can create a liability before payment. Paying that liability later clears it; the payment does not record the same purchase expense again. The account you debit depends on what the business acquired.",
  summary: "Follow an accounts payable bill through a supplier credit and payment. Learn which accounts change and how to avoid recording the expense twice.",
  searchTitle: "Accounts payable journal entries: bills, credits and payments",
  relatedPaths: ["/company/blog/accounts-payable-vs-accounts-receivable", "/company/blog/accounting-ledgers"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "recognize-the-purchase", title: "Identify the purchase before choosing accounts" },
    { id: "follow-the-entries", title: "Follow the bill, credit and payment" },
    { id: "handle-exceptions", title: "Correct the record that actually changed" },
  ],
  sources: [
    { label: "OpenStax: Recording journal entries and posting to accounts", href: "https://openstax.org/books/principles-financial-accounting/pages/3-5-use-journal-entries-to-record-transactions-and-post-to-t-accounts" },
    { label: "IRS: Publication 583, bookkeeping and supporting records", href: "https://www.irs.gov/publications/p583" },
    { label: "Intuit: Supplier credits and refunds", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/vendor-credits/enter-refund-vendor/L2y1KARni_US_en_US" },
  ],
};
