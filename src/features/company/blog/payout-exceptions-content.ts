import type { BlogArticle } from "./content";

/** Unpublished archive G0088, adapted around the person still waiting after a payment run. */
export const payoutExceptionsArticle: BlogArticle = {
  path: "/company/blog/cross-border-payouts",
  title: "The payout file went through. Did every payment?",
  description: "A submitted payout batch does not prove every recipient was paid. Track individual results, investigate missing transfers and avoid paying the same obligation twice.",
  summary: "Eleven recipients have their money. One is still waiting. A successful upload cannot answer that person’s question, and resending the whole batch can create a second problem.",
  searchTitle: "Cross-border payouts: failed transfers, status and safe retries",
  relatedPaths: ["/company/blog/b2b-cross-border-payments", "/company/blog/important-information-about-bic-and-swift-codes"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Wise Platform: Batch completion is distinct from payout completion", href: "https://docs.wise.com/guides/product/send-money/transfers/batch-transfers" },
    { label: "Wise Platform: Sent transfers, recipient credit and returned funds", href: "https://docs.wise.com/guides/product/send-money/tracking/transfer-statuses" },
    { label: "FBI: Independently verifying changed payment instructions", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
  ],
};
