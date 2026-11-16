import type { BlogArticle } from "./content";

/** Archive G0282, adapted with current routing and payment-instruction guidance. */
export const routingNumberArticle: BlogArticle = {
  path: "/company/blog/routing-number",
  title: "Routing numbers: choose the right one for the transfer",
  description: "A US routing number has nine digits and identifies a financial institution. It works alongside the recipient’s account information. Before sending money, confirm that the number is correct for that account and payment method. A valid routing number is not necessarily the right one for your transfer.",
  summary: "Find the right routing number for an ACH or wire transfer, verify changed bank instructions and know what to do if a payment used incorrect details.",
  searchTitle: "Which routing number should you use for ACH or wires?",
  relatedPaths: ["/company/blog/ach-vs-wire-transfers", "/company/blog/ach-verification"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "roles", title: "Separate the bank identifier from the account" },
    { id: "verify", title: "Check the instruction, not just the digits" },
    { id: "mistake", title: "Act quickly if the details were wrong" },
  ],
  sources: [
    { label: "American Bankers Association: Routing number purpose and format", href: "https://www.aba.com/about-us/routing-number" },
    { label: "Bank of America: Finding the routing number for your account", href: "https://www.bankofamerica.com/deposits/routing-number-faqs/" },
    { label: "Bank of America: ACH and wire instructions can differ", href: "https://info.bankofamerica.com/en/digital-banking/wire-transfers" },
    { label: "Federal Reserve: What the routing directory identifies", href: "https://www.frbservices.org/resources/e-payments-routing-directory/" },
    { label: "Nacha: Account validation and ownership are different checks", href: "https://www.nacha.org/rules/supplementing-fraud-detection-standards-web-debits" },
    { label: "FBI: Verifying changed payment instructions and reporting fraud", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
  ],
};
