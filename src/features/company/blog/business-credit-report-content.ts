import type { BlogArticle } from "./content";

/** Archive G1831, adapted around investigating and correcting a business credit report. */
export const businessCreditReportArticle: BlogArticle = {
  path: "/company/blog/check-your-business-credit-report",
  title: "When your business credit report gets the story wrong",
  description: "An overdue balance you believe you paid deserves a closer look. The useful question is which fact is wrong, and what will establish the right one.",
  summary: "How to check your business credit report, investigate unfamiliar or overdue entries, and request a correction with Experian or Dun & Bradstreet.",
  searchTitle: "How to check your business credit report and correct errors",
  relatedPaths: ["/company/blog/common-mistakes-when-building-business-credit", "/company/blog/business-credit-card-vs-personal"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Experian: Obtaining and understanding business credit reports", href: "https://www.experian.com/small-business/small-business-business-reports-faqs" },
    { label: "Experian: Correcting business credit report information", href: "https://www.experian.com/small-business/business-credit-information" },
    { label: "Dun & Bradstreet: D-U-N-S Profile Manager and data disputes", href: "https://www.dnb.com/en-us/smb/duns/duns-manager.html" },
  ],
};
