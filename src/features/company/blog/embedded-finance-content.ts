import type { BlogArticle } from "./content";

/** Archive G1894, adapted around the platform's choice of financial product. */
export const embeddedFinanceArticle: BlogArticle = {
  path: "/company/blog/embedded-finance-vs-banking-as-a-service",
  title: "Does your platform need payments, or a banking product?",
  description: "Embedded finance and banking as a service describe different parts of a product. Start with what merchants need before promising accounts, balances or access to their money.",
  summary: "A payment inside your software can solve a merchant’s problem without turning your product into a banking service. The distinction matters long after launch.",
  searchTitle: "Embedded finance vs. banking as a service for platforms",
  relatedPaths: ["/company/blog/saas-payment-processing", "/company/blog/merchant-accounts-and-acquiring"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Federal Reserve Bank of Kansas City: Banking as a service and embedded finance", href: "https://www.kansascityfed.org/research/payments-system-research-briefings/the-role-of-core-banking-services-providers-in-facilitating-instant-payments/" },
    { label: "Federal banking agencies: Bank arrangements with third parties to deliver deposit products", href: "https://www.federalreserve.gov/frrs/guidance/joint-statement-on-banks-arrangements-with-third-parties-to-deliver-bank-deposit-products-and-services.htm" },
    { label: "FDIC: Banking with third-party apps", href: "https://www.fdic.gov/consumer-resource-center/2024-06/banking-third-party-apps" },
    { label: "Federal banking agencies: 2023 guidance on managing third-party relationships", href: "https://www.occ.gov/news-issuances/news-releases/2023/nr-ia-2023-53.html" },
  ],
};
