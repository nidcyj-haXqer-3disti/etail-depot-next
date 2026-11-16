import type { BlogArticle } from "./content";

/** Unpublished archive G0023, adapted around approving the payment that will actually leave. */
export const crossBorderControlsArticle: BlogArticle = {
  path: "/company/blog/b2b-cross-border-payments",
  title: "The invoice was approved. The payment changed.",
  description: "B2B cross-border payments can change after invoice approval. Check the recipient, currency, total debit and expected receipt before releasing the money.",
  summary: "The invoice number stayed the same. The supplier’s currency request, exchange quote or receiving details did not. An old approval may no longer describe the payment you are about to send.",
  searchTitle: "B2B cross-border payments: approvals, FX and supplier receipt",
  relatedPaths: ["/company/blog/important-information-about-bic-and-swift-codes", "/company/blog/b2b-payment-methods"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "International Trade Administration: Agreed currencies and exchange-rate risk", href: "https://www.trade.gov/foreign-exchange-risk" },
    { label: "Bank of America: Transfer costs, conversion and receiving requirements", href: "https://info.bankofamerica.com/en/digital-banking/wire-transfers" },
    { label: "FBI: Verifying payment requests and changed account details", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
    { label: "Swift: Payment outcomes and confirmation of recipient credit", href: "https://www.swift.com/payments/universal-confirmations" },
  ],
};
