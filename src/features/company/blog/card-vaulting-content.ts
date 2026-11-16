import type { BlogArticle } from "./content";

/** Unpublished archive G0643, adapted around control of saved payment relationships. */
export const cardVaultingArticle: BlogArticle = {
  path: "/company/blog/credit-card-vaulting",
  title: "Credit card vaulting: keep the convenience, keep your options",
  description: "Credit card vaulting can simplify repeat purchases. Understand who can use saved cards, what security duties remain and what happens when you change providers.",
  summary: "A saved card makes the next purchase easier. The arrangement behind it should also give your business clear permissions, reliable records and a workable exit plan.",
  searchTitle: "Credit card vaulting: security, access and switching providers",
  relatedPaths: ["/company/blog/card-on-file", "/company/blog/switch-payment-processors"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: Vaulted credentials, tokens and permitted use", href: "https://developer.cybersource.com/docs/cybs/en-us/tms/developer/all/rest/tms.html" },
    { label: "EMVCo: Payment tokens and restrictions on their use", href: "https://www.emvco.com/emv-technologies/payment-tokenisation/" },
    { label: "PCI Security Standards Council: Responsibilities when outsourcing payments", href: "https://www.pcisecuritystandards.org/faqs/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/" },
    { label: "PCI Security Standards Council: Security codes must not be retained", href: "https://www.pcisecuritystandards.org/faqs/1280/" },
    { label: "Stripe: Secure payment data exports and their limits", href: "https://docs.stripe.com/get-started/data-migrations/pan-export" },
  ],
};
