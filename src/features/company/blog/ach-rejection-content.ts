import type { BlogArticle } from "./content";

/** Unpublished archive G0624, adapted around investigating before blaming a customer. */
export const achRejectionArticle: BlogArticle = {
  path: "/company/blog/ach-rejection-codes",
  title: "A failed ACH payment is not a verdict on your customer",
  description: "ACH rejection codes can point to funds, account details or authorization problems. Understand what failed before contacting the customer or trying another debit.",
  summary: "The dashboard says Failed. That does not tell you whether the customer lacked funds, the account details were wrong or your business collected on the wrong date.",
  searchTitle: "ACH rejection codes: why a bank payment failed",
  relatedPaths: ["/company/blog/reduce-ach-payment-failures", "/company/blog/ach-trace-number"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: eCheck validation, returns and resubmission limits", href: "https://developer.cybersource.com/docs/cybs/en-us/echeck/user/all/rest/echeck-user-guide/echeck-txnprocess-overview/echeck-txnprocess-settlement/echeck-txnprocess-returns.html" },
    { label: "Dwolla: ACH failure reasons and account return codes", href: "https://developers.dwolla.com/docs/transfer-failures" },
    { label: "Nacha: The distinction between R10 and R11", href: "https://www.nacha.org/rules/differentiating-unauthorized-return-reasons" },
    { label: "Nacha: Restrictions on reinitiating returned payments", href: "https://www.nacha.org/rules/ach-network-risk-and-enforcement-topics" },
  ],
};
