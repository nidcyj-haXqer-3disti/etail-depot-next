import type { BlogArticle } from "./content";

/** Archive G0186, adapted with current ACH return and prevention guidance. */
export const achFailuresArticle: BlogArticle = {
  path: "/company/blog/reduce-ach-payment-failures",
  title: "How to reduce ACH payment failures",
  description: "To reduce ACH payment failures, look beyond each returned payment for a shared cause. Repeated problems can come from the same account entry, billing rule or bank account change. Fix that cause, check every affected instruction and follow the next collection cycle to see whether the change worked.",
  summary: "Reduce avoidable ACH payment failures by reviewing return reasons, correcting billing and bank detail problems, and checking results before retrying.",
  searchTitle: "How to reduce ACH payment failures and returns",
  relatedPaths: ["/company/blog/ach-verification", "/company/blog/how-recurring-ach-payments-work"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "patterns", title: "Find the cause behind the return" },
    { id: "correct", title: "Correct every affected instruction" },
    { id: "check", title: "Check whether the change worked" },
  ],
  sources: [
    { label: "Cybersource: eCheck returns and resubmission limits", href: "https://developer.cybersource.com/docs/cybs/en-us/echeck/user/all/rest/echeck-user-guide/echeck-txnprocess-overview/echeck-txnprocess-settlement/echeck-txnprocess-returns.html" },
    { label: "Nacha: Unauthorized debits and errors in authorized payments", href: "https://www.nacha.org/rules/differentiating-unauthorized-return-reasons" },
    { label: "Nacha: WEB debit account validation", href: "https://www.nacha.org/rules/supplementing-fraud-detection-standards-web-debits" },
    { label: "Nacha: Return monitoring and limits on reinitiating debits", href: "https://www.nacha.org/rules/ach-network-risk-and-enforcement-topics" },
    { label: "Etail Depot: ACH processing, returns and account terms", href: "/services/ach-payments" },
  ],
};
