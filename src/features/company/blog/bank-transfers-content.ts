import type { BlogArticle } from "./content";

/** Archive G0031, adapted with current bank-transfer receiving guidance. */
export const bankTransfersArticle: BlogArticle = {
  path: "/company/blog/accepting-bank-transfers-for-business-payments",
  title: "Accepting bank transfers for business payments",
  description: "Accepting bank transfers takes more than adding bank details to an invoice. Give customers the right instructions, confirm incoming funds and match each receipt to what they owe. Plan how your team will handle missing references, payment differences and refunds.",
  summary: "Learn how to accept customer bank transfers, give clear payment instructions, match receipts to invoices and handle payment differences or refunds.",
  searchTitle: "Accepting bank transfers for business payments",
  relatedPaths: ["/company/blog/ach-vs-wire-transfers", "/company/blog/ach-trace-number"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "receiving-instructions", title: "Give instructions for the right transfer" },
    { id: "first-invoice", title: "Prepare before sending the first invoice" },
    { id: "match-receipts", title: "Match receipts to what customers owe" },
    { id: "handle-exceptions", title: "Resolve exceptions before closing the order" },
  ],
  sources: [
    { label: "Nacha: ACH credits and debits", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "Bank of America: Receiving wire transfers", href: "https://info.bankofamerica.com/en/digital-banking/wire-transfers" },
    { label: "Stripe: Bank transfer instructions and reconciliation", href: "https://stripe.com/resources/more/accepting-bank-transfers-for-business-payments" },
    { label: "Stripe documentation: Payment matching and refunds", href: "https://docs.stripe.com/payments/bank-transfers" },
    { label: "FBI: Verify changes to payment instructions", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
  ],
};
