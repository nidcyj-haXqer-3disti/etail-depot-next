import type { BlogArticle } from "./content";

/** Archive G1811, adapted around card agreements, consumer protections and purchasing responsibilities. */
export const cardChoiceArticle: BlogArticle = {
  path: "/company/blog/business-credit-card-vs-personal",
  title: "Business vs. personal credit cards: read past the rewards",
  description: "A business card can make company spending easier to manage. It can also change the terms you rely on when a payment goes wrong, without removing your responsibility for the bill.",
  summary: "Compare business and personal credit cards beyond rewards: personal guarantees, credit reporting, US billing protections, employee access and repayment terms.",
  searchTitle: "Business vs. personal credit cards: liability and protections",
  relatedPaths: ["/company/blog/shared-company-credit-cards", "/company/blog/common-mistakes-when-building-business-credit"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "CFPB: Regulation Z and business purpose credit cards", href: "https://www.consumerfinance.gov/rules-policy/regulations/1026/3/" },
    { label: "Chase: Business cards, personal guarantees and credit reporting", href: "https://www.chase.com/personal/credit-cards/education/basics/do-business-credit-cards-affect-personal-credit" },
    { label: "Capital One: Card use and repayment terms", href: "https://www.capitalone.com/learn-grow/business-resources/frequently-asked-questions/" },
    { label: "Capital One: Employee cards and purchasing permissions", href: "https://www.capitalone.com/learn-grow/business-resources/employee-cards/" },
  ],
};
