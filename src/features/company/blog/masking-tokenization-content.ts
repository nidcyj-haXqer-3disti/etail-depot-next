import type { BlogArticle } from "./content";

/** Unpublished archive G0649, adapted around recognizing and correctly using a saved payment method. */
export const maskingTokenizationArticle: BlogArticle = {
  path: "/company/blog/data-masking-vs-tokenization",
  title: "Your customer recognizes the card. Does your checkout?",
  description: "Data masking helps customers recognize a card. Tokenization lets authorized software use a substitute reference. Here is why a saved checkout needs both jobs done well.",
  summary: "Four familiar digits make a saved card easy to recognize. Behind them, the next purchase depends on the right reference, customer and permission to pay.",
  searchTitle: "Data masking vs. tokenization: what a saved card really needs",
  relatedPaths: ["/company/blog/credit-card-vaulting", "/company/blog/data-masking-vs-encryption"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "PCI Security Standards Council: What display masking protects", href: "https://www.pcisecuritystandards.org/faqs/1146/" },
    { label: "Cybersource: Different types of payment and customer tokens", href: "https://developer.cybersource.com/docs/cybs/en-us/tms/developer/all/rest/tms/tms-overview/tms-token-types.html" },
    { label: "EMVCo: Payment tokens and restrictions on their use", href: "https://www.emvco.com/emv-technologies/payment-tokenisation/" },
    { label: "OWASP: Checking access to individual records", href: "https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/" },
    { label: "Cybersource: Customer consent and stored credential use", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/ctv/rest/credentials/credentials-intro/credentials-intro-stdinst/credentials-reqs.html" },
    { label: "PCI Security Standards Council: Merchant duties when outsourcing payments", href: "https://www.pcisecuritystandards.org/faqs/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/" },
  ],
};
