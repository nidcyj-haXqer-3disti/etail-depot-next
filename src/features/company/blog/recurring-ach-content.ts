import type { BlogArticle } from "./content";

/** Archive G0153, adapted with current recurring ACH guidance. */
export const recurringAchArticle: BlogArticle = {
  path: "/company/blog/how-recurring-ach-payments-work",
  title: "How recurring ACH payments work",
  description: "Recurring ACH lets a business collect bank payments on an agreed schedule. Customer authorization gives permission to collect; the schedule tells the provider when to act. Each payment still needs a result, and changes or cancellations need someone to handle them.",
  summary: "Learn how recurring ACH payments work, from customer authorization and billing schedules to changes, cancellations and returned payments.",
  searchTitle: "How recurring ACH payments work: setup and ongoing billing",
  relatedPaths: ["/company/blog/ach-debit", "/company/blog/how-long-does-it-take-an-echeck-to-clear"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "agreement", title: "Agree on the collection before scheduling it" },
    { id: "changes", title: "Handle changes before the next payment" },
    { id: "results", title: "Check the result of every collection" },
  ],
  sources: [
    { label: "CFPB: Authorization and notices for preauthorized transfers", href: "https://www.consumerfinance.gov/rules-policy/regulations/1005/10/" },
    { label: "Nacha: Clear ACH authorization terms and records", href: "https://www.nacha.org/news/importance-compliant-ach-authorizations" },
    { label: "CFPB: Stopping automatic payments and canceling a contract", href: "https://www.consumerfinance.gov/ask-cfpb/how-do-i-stop-automatic-payments-from-my-bank-account-en-2023/" },
    { label: "Cybersource: Creating an eCheck recurring subscription", href: "https://developer.cybersource.com/docs/cybs/en-us/echeck/user/all/rest/echeck-user-guide/echeck-bc-intro/echeck-quick-start-rb-tms/echeck-recurring-subs.html" },
    { label: "Cybersource: eCheck returns and resubmission", href: "https://developer.cybersource.com/docs/cybs/en-us/echeck/user/all/rest/echeck-user-guide/echeck-txnprocess-overview/echeck-txnprocess-settlement/echeck-txnprocess-returns.html" },
    { label: "Etail Depot: Account enablement and payment method terms", href: "/company/legal/merchant-services" },
  ],
};
