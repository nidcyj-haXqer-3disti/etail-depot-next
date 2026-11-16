import type { BlogArticle } from "./content";

/** Archive G0182, adapted with current ACH account-validation guidance. */
export const achVerificationArticle: BlogArticle = {
  path: "/company/blog/ach-verification",
  title: "ACH account verification: what each check tells you",
  description: "ACH verification can check bank details, account access or ownership. Those findings are different from permission to collect a payment and from whether that payment will succeed. Before treating an account as verified, know which check was completed and what it established.",
  summary: "Understand ACH account verification, bank linking and microdeposits, including what each check establishes and what still needs customer authorization.",
  searchTitle: "ACH account verification: methods, requirements and limits",
  relatedPaths: ["/company/blog/how-recurring-ach-payments-work", "/company/blog/how-long-does-it-take-an-echeck-to-clear"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "questions", title: "Know what you are checking" },
    { id: "requirement", title: "Apply the right account validation requirement" },
    { id: "operate", title: "Give customers a clear way to finish" },
  ],
  sources: [
    { label: "Nacha: WEB debit account validation and microdeposit confirmation", href: "https://www.nacha.org/rules/supplementing-fraud-detection-standards-web-debits" },
    { label: "Nacha: ACH authorization terms and records", href: "https://www.nacha.org/news/importance-compliant-ach-authorizations" },
    { label: "Stripe: Bank verification and ACH payment outcomes", href: "https://docs.stripe.com/payments/ach-direct-debit" },
    { label: "Stripe: Permission to access account ownership data", href: "https://docs.stripe.com/financial-connections/ownership" },
    { label: "Stripe: Account balance data and refresh results", href: "https://docs.stripe.com/financial-connections/balances" },
    { label: "Etail Depot: ACH account availability and terms", href: "/services/ach-payments" },
  ],
};
