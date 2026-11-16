import type { BlogArticle } from "./content";

/** Archive G0301, adapted with current card security code and PCI guidance. */
export const cardVerificationArticle: BlogArticle = {
  path: "/company/blog/card-verification-value",
  title: "What is a card verification value, and where is it?",
  description: "A card verification value is the short security code commonly requested when a customer enters card details online. Often called CVV, CVC or CID, it is separate from the card number and usually has three or four digits. It helps check possession of card information, but does not prove who is making the purchase.",
  summary: "Find the CVV or card security code, understand what a match means and learn why merchants must never save it after authorization.",
  searchTitle: "What is a card verification value (CVV), and where is it?",
  relatedPaths: ["/company/blog/card-authorization", "/company/blog/credit-card-declines"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "find-the-code", title: "Help the customer find the correct field" },
    { id: "understand-the-result", title: "Treat the check as one signal" },
    { id: "never-retain-the-code", title: "Keep the code out of records and support tools" },
    { id: "check-the-implementation", title: "Review what your tools capture" },
  ],
  sources: [
    { label: "Pay.gov: Card security code locations", href: "https://www.pay.gov/public/collection/payment/plastic/cardSecurity" },
    { label: "PCI Security Standards Council: Requesting card verification codes", href: "https://www.pcisecuritystandards.org/faqs/1319/" },
    { label: "PCI Security Standards Council: Customer permission and code storage", href: "https://www.pcisecuritystandards.org/faqs/1574/" },
    { label: "Cybersource: Processor-specific card verification results", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/fdcsouth/rest/payments/payments-processing-basic-intro/payments-auth-cvn-procedure.html" },
    { label: "Etail Depot: Hosted checkout fields and payment verification", href: "/developers/api-reference" },
  ],
};
