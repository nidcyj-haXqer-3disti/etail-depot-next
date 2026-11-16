import type { BlogArticle } from "./content";

/** Archive G0102, adapted with current payment and remittance guidance. */
export const ediPaymentsArticle: BlogArticle = {
  path: "/company/blog/edi-payment-how-does-it-differ-from-ach-and-eft",
  title: "EDI payments: how EDI differs from ACH and EFT",
  description: "EDI exchanges structured business information. ACH is a US payment network, and EFT is a broader term for electronic funds transfers. When a supplier asks for an EDI payment, confirm both how the money will move and how they will receive the details needed to match it to invoices.",
  summary: "Understand EDI, ACH and EFT, what remittance advice tells a supplier and how to match a payment to the invoices it covers.",
  searchTitle: "EDI payments: EDI vs. ACH and EFT",
  relatedPaths: ["/company/blog/ach-debit", "/company/blog/transaction-details-reports"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "three-terms", title: "Separate the message from the transfer" },
    { id: "message", title: "What the payment message tells the recipient" },
    { id: "matching", title: "Match one payment to several invoices" },
    { id: "setup", title: "Agree on a process with your trading partner" },
    { id: "records", title: "Keep the records useful after transmission" },
  ],
  sources: [
    { label: "Nacha: The difference between EFT, ACH and EDI", href: "https://www.nacha.org/news/call-it-eft-or-ach-or-edi-theyre-different-and-it-matters" },
    { label: "X12: Payment Order/Remittance Advice (820)", href: "https://x12.org/node/4363" },
    { label: "Nacha: ACH payments and remittance information", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "IRS: Supporting business records", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
    { label: "Etail Depot: ACH availability and account terms", href: "/services/ach-payments" },
  ],
};
