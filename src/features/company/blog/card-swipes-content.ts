import type { BlogArticle } from "./content";

/** Archive G0080, adapted around the habit of treating every failed attempt as a reason to swipe. */
export const cardSwipesArticle: BlogArticle = {
  path: "/company/blog/credit-card-swipes",
  title: "“Try swiping it” is not a payment policy",
  description: "A chip read error, a declined payment and a failing terminal need different responses. Why credit card fallback should follow the provider’s process.",
  summary: "A swipe can be a supported response to a chip reading problem. Making it the answer to every unsuccessful attempt creates a different problem for the business.",
  searchTitle: "Credit card swipes and chip fallback: when to use them",
  relatedPaths: ["/company/blog/card-present-vs-card-not-present", "/company/blog/contactless-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Magnetic stripe entry and its security limits", href: "https://developer.cybersource.com/docs/cybs/en-us/cp-retail/integration/ctv/rest/cp-retail/cp-intro-cpc/cp-intro-transactions/cp-intro-about-transactions-swipe.html" },
    { label: "Visa: Chip read failures and fallback principles, section 4.2.2", href: "https://usa.visa.com/content/dam/VCOM/regional/na/us/partner-with-us/documents/transaction-acceptance-device-guide.pdf" },
    { label: "Visa: Merchant training on declines and fallback, section 12.7.4", href: "https://usa.visa.com/content/dam/VCOM/regional/na/us/partner-with-us/documents/visa-smart-debit-credit-vsdc-visa-paywave-vpw-us-acquirer-implementation-guide.pdf" },
    { label: "Bank of America: Diagnosing card and reader errors", href: "https://merchanthelp.bankofamerica.com/Card_Swipe_or_Insertion_Errors" },
    { label: "PCI SSC: Protecting payment devices from tampering and substitution", href: "https://www.pcisecuritystandards.org/faqs/1281/" },
  ],
};
