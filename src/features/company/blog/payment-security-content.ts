import type { BlogArticle } from "./content";

/** Unpublished archive G0650, adapted around evaluating authority, evidence and account security. */
export const paymentSecurityArticle: BlogArticle = {
  path: "/company/blog/digital-payment-security",
  title: "Who can change where your money goes?",
  description: "Assess digital payment security by following a sensitive account change. Check who can request it, how it is verified and what records support the decision.",
  summary: "A protected checkout is only part of the picture. The more revealing conversation is about account access, sensitive changes and what happens when an instruction is wrong.",
  searchTitle: "Digital payment security: what merchants should verify",
  relatedPaths: ["/company/blog/how-pci-attestation-of-compliance-works", "/company/blog/account-takeover-fraud"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "FBI: Verifying changes to payment instructions", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
    { label: "FTC: Evaluating service providers and documenting security expectations", href: "https://www.ftc.gov/business-guidance/blog/2017/09/stick-security-make-sure-your-service-providers-implement-reasonable-security-measures" },
    { label: "PCI SSC: Evidence for the service a provider actually supplies", href: "https://www.pcisecuritystandards.org/faqs/1065/" },
    { label: "PCI SSC: Recognized compliance documentation", href: "https://www.pcisecuritystandards.org/faqs/1220/" },
  ],
};
