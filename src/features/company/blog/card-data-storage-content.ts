import type { BlogArticle } from "./content";

/** Unpublished archive G0707, adapted around unnecessary copies of customer payment data. */
export const cardDataStorageArticle: BlogArticle = {
  path: "/company/blog/storing-card-information",
  title: "The card details your business did not mean to keep",
  description: "Storing customer card information is a business decision, even when it happens by accident. Keep useful payment records without creating unnecessary copies of sensitive data.",
  summary: "A secure checkout cannot stop a card photo landing in a support inbox. What your team does next matters as much as where the original payment was processed.",
  searchTitle: "Storing customer card information: what to keep",
  relatedPaths: ["/company/blog/credit-card-vaulting", "/company/blog/card-on-file"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "PCI SSC: Card data received through an unintended channel", href: "https://www.pcisecuritystandards.org/faqs/1157/" },
    { label: "PCI SSC: Why security codes cannot be kept for later payments", href: "https://www.pcisecuritystandards.org/faqs/1280/" },
    { label: "PCI SSC: Masking changes the display, not necessarily the stored data", href: "https://www.pcisecuritystandards.org/faqs/1146/" },
    { label: "PCI SSC: Retention, protection and secure disposal", href: "https://www.pcisecuritystandards.org/faqs/1318/" },
    { label: "PCI SSC: Merchant responsibilities when outsourcing payments", href: "https://www.pcisecuritystandards.org/faqs/does-pci-dss-apply-to-merchants-who-outsource-all-payment-processing-operations-and-never-store-process-or-transmit-cardholder-data/" },
  ],
};
