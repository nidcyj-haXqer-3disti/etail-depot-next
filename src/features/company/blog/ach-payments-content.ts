import type { BlogArticle } from "./content";

/** Archive G0007, adapted with current ACH workflow and reporting guidance. */
export const achPaymentsArticle: BlogArticle = {
  path: "/company/blog/ach-payments",
  title: "How ACH payments work",
  description: "ACH moves money between bank accounts through the US Automated Clearing House network. A payer can send an ACH credit, or a business can collect an authorized ACH debit. Following the instruction through the banks helps you understand the payment status, match it to an invoice and find the right person to contact when something goes wrong.",
  summary: "Follow an ACH payment through the banks, distinguish credits from debits and learn which records help you trace missing or returned payments.",
  searchTitle: "How ACH payments work: credits, debits and payment records",
  relatedPaths: ["/company/blog/ach-debit", "/company/blog/edi-payment-how-does-it-differ-from-ach-and-eft"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "direction", title: "Start with who instructs the payment" },
    { id: "participants", title: "Follow the instruction through the banks" },
    { id: "separate-statuses", title: "Keep three questions separate" },
    { id: "trace-payment", title: "Trace a missing or returned payment" },
  ],
  sources: [
    { label: "Nacha: How ACH payments work", href: "https://www.nacha.org/content/how-ach-payments-work" },
    { label: "Nacha: ACH participants and payment types", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "Nacha: Who to contact about an ACH payment", href: "https://www.nacha.org/content/consumer-faqs-ach-payments" },
    { label: "Cybersource: eCheck returns", href: "https://developer.cybersource.com/docs/cybs/en-us/echeck/user/all/rest/echeck-user-guide/echeck-txnprocess-overview/echeck-txnprocess-settlement/echeck-txnprocess-returns.html" },
    { label: "Etail Depot: ACH availability and payment records", href: "/services/ach-payments" },
  ],
};
