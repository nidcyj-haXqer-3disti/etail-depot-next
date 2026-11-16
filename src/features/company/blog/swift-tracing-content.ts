import type { BlogArticle } from "./content";

/** Unpublished archive G0289, adapted around the difference between a payment document and the evidence needed to release an order. */
export const swiftTracingArticle: BlogArticle = {
  path: "/company/blog/swift-payments",
  title: "The buyer sent a SWIFT copy. Can you ship?",
  description: "A SWIFT payment document does not necessarily confirm receipt. Learn what to ask the bank, how a UETR helps tracing and when to release an order under your terms.",
  summary: "The buyer has a payment document. Your bank has no matching credit. Before releasing the order, establish which part of the payment is actually confirmed.",
  searchTitle: "SWIFT payments: payment copies, bank tracing and proof of receipt",
  relatedPaths: ["/company/blog/important-information-about-bic-and-swift-codes", "/company/blog/send-and-accept-international-business-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Swift: Financial messaging and the role of participating institutions", href: "https://www.swift.com/about-us/who-we-are" },
    { label: "Swift: The end-to-end payment reference and tracking", href: "https://www.swift.com/payments/what-unique-end-end-transaction-reference-uetr" },
    { label: "Swift: ISO 20022 payment instructions and MT conversion", href: "https://www.swift.com/standards/iso-20022/iso-20022-faqs/mt-iso-20022-conversion" },
  ],
};
