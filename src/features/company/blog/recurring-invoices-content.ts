import type { BlogArticle } from "./content";

/** Archive G0501, adapted around keeping recurring invoice schedules aligned with changing agreements. */
export const recurringInvoicesArticle: BlogArticle = {
  path: "/company/blog/set-up-recurring-invoices",
  title: "When the invoice outlives the agreement",
  description: "Recurring invoices save time until the work or agreement changes. Keep billing dates, prices, payment permission and the final invoice aligned with the customer.",
  summary: "A schedule can keep producing perfectly formatted invoices after the reason for sending them has changed. The important work happens when the arrangement changes.",
  searchTitle: "Recurring invoices: keep the schedule tied to the agreement",
  relatedPaths: ["/company/blog/contract-invoices", "/company/blog/card-on-file"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "QuickBooks: Recurring invoices, review and customer autopay", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/manage-invoices/set-recurring-invoices-autopay-quickbooks-online/L7ZdVRCFX_US_en_US" },
    { label: "Stripe: Monthly billing dates and partial periods", href: "https://docs.stripe.com/billing/subscriptions/billing-cycle" },
    { label: "QuickBooks: Template changes and service dates", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/memorize-transactions/edit-recurring-template/L0eW5Sjrh_US_en_US" },
    { label: "Xero: Stopping a template and existing invoices", href: "https://central.xero.com/0/article/Delete-repeating-invoice-templates" },
  ],
};
