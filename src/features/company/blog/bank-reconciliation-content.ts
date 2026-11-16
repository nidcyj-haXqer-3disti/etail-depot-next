import type { BlogArticle } from "./content";

/** Archive G0879, adapted with bank-reconciliation guidance. */
export const bankReconciliationArticle: BlogArticle = {
  path: "/company/blog/bank-reconciliation-statement",
  title: "Bank reconciliation statements: timing and corrections",
  description: "A bank reconciliation statement explains why the bank’s closing balance differs from the cash balance in your books at the same date. Some differences come from transactions still clearing. Others need a supported accounting correction. The goal is matching adjusted balances, with evidence for every difference and the original bank statement kept intact.",
  summary: "Learn which bank reconciliation differences are timing items, which need book entries, and how to follow outstanding checks and deposits without counting them twice.",
  searchTitle: "Bank reconciliation statements: how to match your records",
  relatedPaths: ["/company/blog/accounting-reconciliation", "/company/blog/ach-trace-number"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "collect-and-match", title: "Use the same account and closing date" },
    { id: "two-sided-example", title: "Separate timing differences from book corrections" },
    { id: "follow-open-items", title: "Follow the items that have not cleared" },
  ],
  sources: [
    { label: "IRS: Publication 583, reconciling the checking account", href: "https://www.irs.gov/publications/p583" },
    { label: "ACCA: Bank reconciliation and ledger adjustments, page 4", href: "https://www.accaglobal.com/content/dam/acca/global/PDF-students/fia/examreports/fa2/FA2%20S23-A24%20examiner%27s%20report.pdf" },
    { label: "BILL: Bank reconciliation statements", href: "https://www.bill.com/learning/bank-reconciliation-statement" },
  ],
};
