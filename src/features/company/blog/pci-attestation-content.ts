import type { BlogArticle } from "./content";

/** Unpublished archive G0688, adapted around what PCI evidence means for an actual checkout. */
export const pciAttestationArticle: BlogArticle = {
  path: "/company/blog/how-pci-attestation-of-compliance-works",
  title: "The PCI document arrived. What does it cover?",
  description: "A PCI Attestation of Compliance records an assessment result. Learn what it establishes about your payment provider and what your business still needs to confirm.",
  summary: "A signed document can be genuine and still cover a different service from the one you use. Read the scope before treating your checkout review as finished.",
  searchTitle: "PCI Attestation of Compliance: what an AOC covers",
  relatedPaths: ["/company/blog/credit-card-vaulting", "/company/blog/data-masking-vs-encryption"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "PCI SSC: Official validation forms, not unofficial certificates", href: "https://www.pcisecuritystandards.org/faqs/1220/" },
    { label: "PCI SSC: Evidence for a third-party service provider’s actual services", href: "https://www.pcisecuritystandards.org/faqs/1065/" },
    { label: "PCI SSC: Assessment completion dates and later signatures", href: "https://www.pcisecuritystandards.org/faqs/1583/" },
    { label: "PCI SSC: Choosing an eligible self-assessment route", href: "https://www.pcisecuritystandards.org/faqs/1443/" },
    { label: "PCI SSC: Merchant responsibilities when outsourcing payments", href: "https://www.pcisecuritystandards.org/faqs/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/" },
  ],
};
