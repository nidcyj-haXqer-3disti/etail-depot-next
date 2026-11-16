import type { BlogArticle } from "./content";

/** Unpublished archive G0677, adapted around approval terms and usable business cash. */
export const highRiskAccountsArticle: BlogArticle = {
  path: "/company/blog/high-risk-merchant-accounts",
  title: "Approved for payments. Can you operate on the terms?",
  description: "A high-risk merchant account approval is only part of the decision. Compare fees, reserves and payout conditions against the cash your business needs.",
  summary: "The lower processing rate may come with less cash available for stock, staff and refunds. Read what the approval lets your business do, and when it lets you use the money.",
  searchTitle: "High-risk merchant accounts: compare terms and cash flow",
  relatedPaths: ["/company/blog/choose-a-merchant-services-provider", "/company/blog/calculate-working-capital"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "OCC: Merchant underwriting, delayed delivery and reserves", href: "https://www.occ.treas.gov/publications-and-resources/publications/comptrollers-handbook/files/merchant-processing/pub-ch-merchant-processing.pdf" },
    { label: "Stripe: High-risk merchant accounts and provider assessment", href: "https://stripe.com/resources/more/high-risk-merchant-accounts-explained" },
    { label: "Stripe: Reserve calculations and release arrangements", href: "https://support.stripe.com/topics/reserves" },
    { label: "Trolleys: Payouts, reserve notices and release conditions", href: "/company/legal/payouts-and-reserves" },
    { label: "Trolleys: Approved activities and account restrictions", href: "/company/legal/acceptable-use" },
  ],
};
