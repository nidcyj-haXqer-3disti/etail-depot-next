import type { BlogArticle } from "./content";

/** Retired archive G0197, adapted around complete and verified payment instructions. */
export const bicSwiftArticle: BlogArticle = {
  path: "/company/blog/important-information-about-bic-and-swift-codes",
  title: "The SWIFT code is right. Is the account?",
  description: "A BIC or SWIFT code identifies an organization, not your supplier’s account. Understand the payment fields and verify changed instructions before sending money.",
  summary: "A bank lookup can return the name you expected while the payment still points to the wrong recipient. The useful check goes beyond the code.",
  searchTitle: "BIC and SWIFT codes: what merchants need to verify",
  relatedPaths: ["/company/blog/sort-code-vs-routing-number", "/company/blog/b2b-payment-methods"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Swift: What a Business Identifier Code identifies", href: "https://www.swift.com/standards/data-standards/bic-business-identifier-code" },
    { label: "Swift: IBANs and national account formats", href: "https://www.swift.com/standards/data-standards/iban-international-bank-account-number" },
    { label: "Bank of America: Receiving details and international wire requirements", href: "https://info.bankofamerica.com/en/digital-banking/wire-transfers" },
    { label: "FBI: Independently verifying changed payment instructions", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
  ],
};
