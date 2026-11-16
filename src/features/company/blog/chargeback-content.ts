import type { BlogArticle } from "./content";

/** Retired archive G0608, adapted around the merchant's unfinished sale. */
export const chargebackArticle: BlogArticle = {
  path: "/company/blog/what-is-a-chargeback",
  title: "The sale was finished. Then came the chargeback.",
  description: "A chargeback can reverse all or part of a card payment after a sale. Understand the difference from a refund, what evidence matters and how to avoid paying twice.",
  summary: "You shipped the order and recorded the sale. A dispute brings both back to your desk. What matters now is the claim, the records and what happens to the money.",
  searchTitle: "What is a chargeback? Refunds, evidence and merchant response",
  relatedPaths: ["/company/blog/credit-notes", "/company/blog/write-delivery-promise"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Visa: Merchant dispute resolution and prevention", href: "https://www.visa.com/en-us/support/business/dispute-resolution" },
    { label: "Visa: Dispute conditions and response evidence", href: "https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/merchants-dispute-management-guidelines.pdf" },
    { label: "Mastercard: Responding to a disputed card payment", href: "https://www.mastercard.com/global/en/news-and-trends/Insights/2024/how-can-merchants-dispute-credit-card-chargebacks.html" },
    { label: "Cybersource: Case references, response dates and financial adjustments", href: "https://developer.cybersource.com/docs/cybs/en-us/reporting/developer/all/rest/reporting/reporting_fields/chargeback.html" },
  ],
};
