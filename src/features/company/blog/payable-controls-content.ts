import type { BlogArticle } from "./content";

/** Archive G0862, adapted with invoice, payment-control and fraud guidance. */
export const payableControlsArticle: BlogArticle = {
  path: "/company/blog/an-accounts-payable-internal-controls-checklist",
  title: "Accounts payable controls: from invoice to payment",
  description: "Accounts payable controls help a business check that a bill is valid, correctly recorded, approved and paid to the intended recipient. Each is a separate decision. A legitimate purchase does not make newly supplied bank details legitimate, and an approved invoice does not prove that payment has completed.",
  summary: "Check invoices, confirm supplier bank changes, separate approval from payment release, and investigate uncertain outcomes before paying again.",
  searchTitle: "Accounts payable internal controls: an invoice-to-payment checklist",
  relatedPaths: ["/company/blog/accounts-payable-journal-entry", "/company/blog/accounting-reconciliation"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "capture-and-validate", title: "Verify the bill before it reaches the payment queue" },
    { id: "destination-control", title: "Check changed bank details separately" },
    { id: "separate-and-review", title: "Separate sensitive actions and check the outcome" },
  ],
  sources: [
    { label: "BILL: Accounts payable internal controls", href: "https://www.bill.com/blog/accounts-payable-internal-controls-checklist" },
    { label: "FBI: Business email compromise and payment verification", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
    { label: "IRS: Publication 583, supporting documents and electronic records", href: "https://www.irs.gov/publications/p583" },
  ],
};
