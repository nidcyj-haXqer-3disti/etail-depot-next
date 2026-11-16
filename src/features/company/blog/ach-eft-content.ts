import type { BlogArticle } from "./content";

/** Archive G0040, adapted with current ACH and EFT definitions. */
export const achEftArticle: BlogArticle = {
  path: "/company/blog/ach-vs-eft",
  title: "ACH vs. EFT: how the terms fit together",
  description: "ACH names a specific US payment network. EFT, short for electronic funds transfer, is a broader term. In everyday business use, ACH is one kind of EFT. To understand an offer, ask which payment service it uses and who initiates the transfer.",
  summary: "Understand how ACH fits within EFT, distinguish sending from collecting money and clarify payment instructions, account terms and consumer protections.",
  searchTitle: "ACH vs. EFT: how the terms fit together",
  relatedPaths: ["/company/blog/ach-payments", "/company/blog/ach-vs-wire-transfers"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "category-and-route", title: "Separate the broad term from the payment service" },
    { id: "supplier-request", title: "Clarify who sends or collects the money" },
    { id: "account-rules", title: "Read legal definitions in context" },
    { id: "confirm-arrangement", title: "Put the payment arrangement in writing" },
  ],
  sources: [
    { label: "Stripe: ACH and EFT terminology", href: "https://stripe.com/resources/more/ach-vs-eft" },
    { label: "Nacha: ACH credits, debits and bank roles", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "CFPB: Regulation E account definitions", href: "https://www.consumerfinance.gov/rules-policy/regulations/1005/2/" },
    { label: "CFPB: Regulation E coverage and exclusions", href: "https://www.consumerfinance.gov/rules-policy/regulations/1005/3/" },
    { label: "Etail Depot: ACH payment setup and availability", href: "/services/ach-payments" },
  ],
};
