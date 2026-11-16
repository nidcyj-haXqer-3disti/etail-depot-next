import type { BlogArticle } from "./content";

/** Unpublished archive G0342, adapted around the full cost of settling an overseas supplier invoice. */
export const supplierTransferCostsArticle: BlogArticle = {
  path: "/company/blog/reduce-intermediary-bank-fees",
  title: "What does it cost to pay your supplier in full?",
  description: "Reduce intermediary bank fee surprises by comparing the total debit, currency conversion and supplier receipt. A low sending fee is only part of the price.",
  summary: "A cheap transfer can leave an invoice short. Compare the cost of meeting the same payment obligation, including the work of putting a shortfall right.",
  searchTitle: "How to reduce intermediary bank fees on supplier payments",
  relatedPaths: ["/company/blog/send-and-accept-international-business-payments", "/company/blog/swift-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Bank of America: Wire transfer costs and currency conversion", href: "https://info.bankofamerica.com/en/digital-banking/wire-transfers" },
    { label: "Wise Platform: Swift fee instructions and recipient amount limitations", href: "https://docs.wise.com/guides/product/send-money/transfers/swift-network-transfers" },
    { label: "HSBC UK: Local-currency payment routes and eligibility", href: "https://www.business.hsbc.uk/en-gb/solutions/making-international-payments" },
  ],
};
