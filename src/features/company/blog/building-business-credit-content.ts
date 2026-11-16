import type { BlogArticle } from "./content";

/** Archive G1804, adapted around reported payment history and the cost of chasing a score. */
export const buildingBusinessCreditArticle: BlogArticle = {
  path: "/company/blog/common-mistakes-when-building-business-credit",
  title: "Building business credit takes more than paying on time",
  description: "You may be a reliable customer without having much history in a business credit report. Before opening more accounts, find out what lenders can actually see.",
  summary: "Avoid common business credit mistakes: assuming suppliers report payments, overlooking inaccurate records and borrowing for a score without a repayment plan.",
  searchTitle: "Building business credit: common mistakes and missing records",
  relatedPaths: ["/company/blog/credit-card-interest", "/company/blog/calculate-working-capital"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Dun & Bradstreet: Payment history and building business credit", href: "https://www.dnb.com/en-us/smb/resources/credit-scores/how-to-build-business-credit.html" },
    { label: "Experian: Information used in business credit scores", href: "https://www.experian.com/small-business/business-credit-score" },
    { label: "Experian: Correcting business credit report information", href: "https://www.experian.com/small-business/business-credit-information" },
    { label: "Bank of America: Factors in business lending decisions", href: "https://business.bankofamerica.com/en/resources/factors-that-impact-loan-decisions-and-how-to-increase-your-approval-odds" },
  ],
};
