import type { BlogArticle } from "./content";

/** Archive G0113, adapted with current instant-payment guidance. */
export const fednowRtpArticle: BlogArticle = {
  path: "/company/blog/fednow-vs-rtp",
  title: "FedNow vs. RTP: what businesses should compare",
  description: "FedNow and RTP are separate US instant payment networks. Both operate around the clock through participating financial institutions. For a business, the useful comparison starts with what its bank account can send or receive, who it can pay and how the payment is confirmed.",
  summary: "Compare FedNow and RTP access, payment controls, confirmation and recovery before choosing an instant payment service for your business.",
  searchTitle: "FedNow vs. RTP for businesses",
  relatedPaths: ["/company/blog/ach-vs-wire-transfers", "/company/blog/customer-reference-in-credit-transfers"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "compare-networks", title: "Two networks, similar purpose" },
    { id: "check-access", title: "Check access for your business account" },
    { id: "payment-workflow", title: "Compare the work around the payment" },
    { id: "payment-recovery", title: "Understand completion and recovery" },
  ],
  sources: [
    { label: "Federal Reserve: FedNow access, features and payment routing", href: "https://www.federalreserve.gov/paymentsystems/fednow-additional-questions-and-answers.htm" },
    { label: "The Clearing House: RTP network features and payment finality", href: "https://www.theclearinghouse.org/payment-systems/rtp/institution" },
    { label: "Federal Reserve Bank of Richmond: Funds transfer and settlement", href: "https://www.richmondfed.org/payment_services/services/funds_transfer_settlements" },
    { label: "FBI: Verifying business payment instructions", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
  ],
};
