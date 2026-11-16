import type { BlogArticle } from "./content";

/** Archive G0916, adapted with cash flow statement guidance. */
export const cashFlowStatementArticle: BlogArticle = {
  path: "/company/blog/cash-flow-statement",
  title: "Cash flow statements: reading the three sections",
  description: "A cash flow statement explains how cash and cash equivalents changed over a reporting period. Its operating, investing and financing sections show where money came from and where it went. Read those sections before judging the closing balance: cash can rise because of a new loan even while operations use more cash than they generate.",
  summary: "Read the operating, investing and financing sections of a cash flow statement. Learn why a cash increase differs from profit and how the totals fit together.",
  searchTitle: "How to read a cash flow statement: the three sections",
  relatedPaths: ["/company/blog/profit-and-loss-statement", "/company/blog/read-a-balance-sheet"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "three-sections", title: "Ask where the money came from" },
    { id: "read-the-total", title: "Distinguish a cash increase from healthy operations" },
    { id: "direct-and-indirect", title: "Understand the operating section’s method" },
  ],
  sources: [
    { label: "SEC: What is a statement of cash flows?", href: "https://www.sec.gov/files/cash-flow-statement-bblocks.pdf" },
    { label: "SEC: Reading financial statements together", href: "https://www.sec.gov/about/reports-publications/investorpubsbegfinstmtguide" },
    { label: "IFRS Foundation: IAS 7 cash flow presentation", href: "https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/" },
  ],
};
