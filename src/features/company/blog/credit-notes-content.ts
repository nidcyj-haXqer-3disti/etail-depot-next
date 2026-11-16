import type { BlogArticle } from "./content";

/** Archive G0590, adapted around credit allocation and the evidence of a completed refund. */
export const creditNotesArticle: BlogArticle = {
  path: "/company/blog/credit-notes",
  title: "A credit note is not proof of a refund",
  description: "A credit note can reduce an invoice, leave credit on an account or accompany a refund. Follow the adjustment to its destination before telling the customer it is resolved.",
  summary: "Your software may apply a credit to an old invoice while the customer expects money back. The correction is only useful when both sides know where it went.",
  searchTitle: "What is a credit note? Invoice credits versus refunds",
  relatedPaths: ["/company/blog/invoice-vs-receipt", "/company/blog/statement-vs-invoice"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Intuit: Credit memos and automatic invoice allocation", href: "https://quickbooks.intuit.com/learn-support/en-us/help-article/customer-refunds-credits/create-apply-credit-memos-delayed-credits-online/L5kne9EiI_US_en_US" },
    { label: "Stripe: Credit notes and invoice balances", href: "https://docs.stripe.com/invoicing/dashboard/credit-notes" },
    { label: "Stripe: Credit allocation and linking existing refunds", href: "https://docs.stripe.com/invoicing/integration/programmatic-credit-notes" },
    { label: "Stripe: Refund status and tracing a refund", href: "https://docs.stripe.com/refunds" },
  ],
};
