import type { BlogArticle } from "./content";

/** Archive G1838, adapted around responsibility, funding and cardholder service after launch. */
export const cardProgramLaunchArticle: BlogArticle = {
  path: "/company/blog/launching-a-credit-card-program",
  title: "Your logo is on the card. Who owns the problem?",
  description: "A branded credit card brings a lasting customer relationship. Before launch, the partners need to agree who funds it, who makes decisions and who resolves a difficult bill.",
  summary: "Launching a credit card program requires clear issuing and lending roles, a funding model, ongoing servicing and a plan for problems after launch.",
  searchTitle: "Launching a credit card program: roles, risk and servicing",
  relatedPaths: ["/company/blog/card-issuing-apis", "/company/blog/cross-border-card-programs"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Federal Reserve, FDIC and OCC: Managing third party relationships", href: "https://www.federalregister.gov/documents/2023/06/09/2023-12340/interagency-guidance-on-third-party-relationships-risk-management" },
    { label: "Stripe: Lending roles, receivables and repayment in charge card programs", href: "https://stripe.com/guides/charge-cards-101" },
    { label: "Marqeta: Credit ledgers, underwriting and servicing capabilities", href: "https://www.marqeta.com/payment-solutions/consumer-credit" },
    { label: "Marqeta: Program management, cardholder support and disputes", href: "https://www.marqeta.com/payment-solutions/program-management" },
  ],
};
