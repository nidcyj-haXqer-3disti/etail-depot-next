import type { BlogArticle } from "./content";

/** Unpublished archive G0188, adapted around the difference between a transfer receipt and an invoice balance. */
export const internationalReceiptsArticle: BlogArticle = {
  path: "/company/blog/send-and-accept-international-business-payments",
  title: "The payment arrived. The invoice is still open.",
  description: "Sending and receiving international business payments requires agreement on what settles the invoice. Resolve short receipts without confusing them with merchant fees.",
  summary: "The buyer sent the full amount. The supplier received less. Before asking for another payment, establish what happened and who agreed to cover the difference.",
  searchTitle: "International business payments: invoices, fees and short receipts",
  relatedPaths: ["/company/blog/b2b-cross-border-payments", "/company/blog/how-long-do-cross-border-payments-take"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "International Trade Administration: Agreeing international payment methods and terms", href: "https://www.trade.gov/methods-payment" },
    { label: "Wise Platform: Intermediary deductions and limits of fee instructions", href: "https://docs.wise.com/guides/product/send-money/transfers/swift-network-transfers" },
    { label: "FBI: Verifying payment requests and changed account details", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
  ],
};
