import type { BlogArticle } from "./content";

/** Archive G0018, adapted with current bank-transfer guidance. */
export const achWireArticle: BlogArticle = {
  path: "/company/blog/ach-vs-wire-transfers",
  title: "ACH vs. wire transfers: choosing a bank payment",
  description: "ACH and wires both move money between bank accounts, but they serve different payment needs. Compare the recipient’s instructions, the deadline for usable funds and your bank’s service before choosing how to pay.",
  summary: "Compare ACH and wire transfers for business payments, including timing, fees, receiving instructions and what to do if a payment goes wrong.",
  searchTitle: "ACH vs. wire transfers for business payments",
  relatedPaths: ["/company/blog/ach-payments", "/company/blog/ach-trace-number"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "compare-routes", title: "Know which payment you are sending" },
    { id: "choose-payment", title: "Match the method to the deadline" },
    { id: "verify-instructions", title: "Check before sending" },
    { id: "follow-result", title: "Follow the result and act on errors" },
  ],
  sources: [
    { label: "Nacha: How ACH works", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "Federal Reserve: Fedwire settlement and operation", href: "https://www.frbservices.org/financial-services/fedwire-funds-service/fedwire-funds-service-business-continuity-guide/" },
    { label: "Bank of America: Wire instructions, timing and fees", href: "https://info.bankofamerica.com/en/digital-banking/wire-transfers" },
    { label: "FBI: Verify payment requests and report fraud", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
    { label: "Etail Depot: ACH availability and payment records", href: "/services/ach-payments" },
  ],
};
