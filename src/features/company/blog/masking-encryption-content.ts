import type { BlogArticle } from "./content";

/** Unpublished archive G0648, adapted around the gap between display and data protection. */
export const maskingEncryptionArticle: BlogArticle = {
  path: "/company/blog/data-masking-vs-encryption",
  title: "The card number is hidden. Is the payment data protected?",
  description: "Data masking hides digits on screen. Encryption protects data with cryptographic keys. Learn why merchants need to check what happens beyond the payment display.",
  summary: "A row of hidden digits can make a payment screen look reassuring. It cannot show what reached the browser, went into a log or left in an export.",
  searchTitle: "Data masking vs. encryption in payment systems",
  relatedPaths: ["/company/blog/credit-card-vaulting", "/company/blog/card-on-file"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "PCI Security Standards Council: Masking and truncation are different controls", href: "https://www.pcisecuritystandards.org/faqs/1146/" },
    { label: "PCI Security Standards Council: Encryption and PCI DSS scope", href: "https://www.pcisecuritystandards.org/faqs/1086/" },
    { label: "OWASP: Encryption, access controls and key management", href: "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html" },
    { label: "OWASP: Keeping sensitive payment data out of logs", href: "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html" },
  ],
};
