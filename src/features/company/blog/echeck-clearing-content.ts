import type { BlogArticle } from "./content";

/** Archive G0144, adapted with current eCheck processing guidance. */
export const echeckClearingArticle: BlogArticle = {
  path: "/company/blog/how-long-does-it-take-an-echeck-to-clear",
  title: "eCheck clearing: settlement, availability and returns",
  description: "Before fulfilling an eCheck order, find out what your provider means by cleared. An accepted payment, a completed transaction and money in your bank account describe different events. Your account’s holding period and return process matter as much as the status on screen.",
  summary: "Understand what cleared means for an eCheck payment, what to check before fulfilling an order and how to handle a later return.",
  searchTitle: "How long does an eCheck take to clear? A merchant’s guide",
  relatedPaths: ["/company/blog/how-long-do-ach-payments-take-to-process", "/company/blog/ach-debit"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "payment-status", title: "Find out what cleared means" },
    { id: "release-order", title: "Decide when to fulfill the order" },
    { id: "after-release", title: "Keep checking after fulfillment" },
  ],
  sources: [
    { label: "Authorize.net: How eCheck uses the ACH network", href: "https://support.authorize.net/knowledgebase/article/KA-04424/" },
    { label: "Cybersource: eCheck transaction statuses", href: "https://developer.cybersource.com/docs/cybs/en-us/echeck/user/all/rest/echeck-user-guide/echeck-txnprocess-overview/echeck-status.html" },
    { label: "Cybersource: eCheck settlement and holding periods", href: "https://developer.cybersource.com/docs/cybs/en-us/echeck/user/all/rest/echeck-user-guide/echeck-txnprocess-overview/echeck-txnprocess-settlement.html" },
    { label: "Cybersource: eCheck validation and returns", href: "https://developer.cybersource.com/docs/cybs/en-us/echeck/user/all/rest/echeck-user-guide/echeck-txnprocess-overview/echeck-txnprocess-settlement/echeck-txnprocess-returns.html" },
  ],
};
