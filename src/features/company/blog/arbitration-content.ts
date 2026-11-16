import type { BlogArticle } from "./content";

/** Unpublished archive G0634, adapted around the merchant's escalation decision. */
export const arbitrationArticle: BlogArticle = {
  path: "/company/blog/chargeback-arbitration",
  title: "Chargeback arbitration: being right is not the whole decision",
  description: "Before pursuing chargeback arbitration, weigh the evidence, available response and additional cost. Know what to ask your payment provider before escalating.",
  summary: "You believe the sale was legitimate. Deciding whether to pursue the dispute further means looking at what the record proves and what another round could cost.",
  searchTitle: "Chargeback arbitration: when should a merchant escalate?",
  relatedPaths: ["/company/blog/what-is-a-chargeback", "/company/blog/write-delivery-promise"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Mastercard: Chargeback stages and arbitration evidence", href: "https://www.mastercard.com/content/dam/public/mastercardcom/na/global-site/documents/chargeback-guide.pdf" },
    { label: "Visa: Working with your acquirer on disputes", href: "https://www.visa.com/en-us/support/business/dispute-resolution" },
    { label: "Adyen: Dispute escalation, financial exposure and case status", href: "https://docs.adyen.com/risk-management/understanding-disputes/dispute-process-and-flow" },
    { label: "Cybersource: Chargeback case records, fees and adjustments", href: "https://developer.cybersource.com/docs/cybs/en-us/reporting/developer/all/rest/reporting/reporting_fields/chargeback.html" },
  ],
};
