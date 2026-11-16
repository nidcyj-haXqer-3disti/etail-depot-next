import type { BlogArticle } from "./content";

/** Archive G0312, adapted with current ACH credit and payment-resolution guidance. */
export const achCreditArticle: BlogArticle = {
  path: "/company/blog/ach-credit",
  title: "What is an ACH credit? Sending money to a bank account",
  description: "An ACH credit sends money to a bank account through the US Automated Clearing House network. The payer starts the transfer, as with payroll or a supplier payment. Credit describes money going into the receiving account; it does not mean borrowing money or paying by credit card.",
  summary: "Understand ACH credits, how they differ from debits, what to check before sending one and how to follow up when a payment is missing.",
  searchTitle: "What is an ACH credit? Sending money to a bank account",
  relatedPaths: ["/company/blog/ach-debit", "/company/blog/ach-trace-number"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "direction", title: "Agree who will start the payment" },
    { id: "prepare", title: "Check the destination, reference and date" },
    { id: "confirm", title: "Confirm receipt before closing the invoice" },
  ],
  sources: [
    { label: "Nacha: ACH credits, debits and payment participants", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "Nacha: Effective dates, processing deadlines and trace numbers", href: "https://achdevguide.nacha.org/ach-file-overview" },
    { label: "Nacha: Pending deposits and payment inquiries", href: "https://www.nacha.org/content/consumer-faqs-ach-payments" },
    { label: "Nacha: Permitted reversals and their limitations", href: "https://www.nacha.org/news/second-chance-understanding-ach-reversals" },
    { label: "FBI: Verifying changes to payment instructions", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
  ],
};
