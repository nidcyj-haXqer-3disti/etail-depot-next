import type { BlogArticle } from "./content";

/** Archive G1844, adapted around the purchasing work a card program should remove. */
export const purchasingCardsArticle: BlogArticle = {
  path: "/company/blog/p-cards-vs-credit-cards",
  title: "Buying faster is only half the case for a p-card",
  description: "A purchasing card can shorten the route to an order. Its value also depends on what happens to the approval, delivery record and bill afterward.",
  summary: "P-cards vs. business credit cards: compare purchasing controls, supplier data, repayment terms and the work left for your finance team.",
  searchTitle: "P-cards vs. business credit cards: what actually changes?",
  relatedPaths: ["/company/blog/create-a-corporate-credit-card-expense-policy", "/company/blog/managing-corporate-credit-cards"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "U.S. Bank: Purchasing card controls and financial system connections", href: "https://www.usbank.com/corporate-and-commercial-banking/treasury-payment-solutions/corporate-payment-services/corporate-credit-cards/purchasing-card.html" },
    { label: "Capital One: Business employee cards and account controls", href: "https://www.capitalone.com/small-business/credit-cards/benefits/employee-cards/" },
    { label: "Cybersource: Level III purchasing data and availability", href: "https://developer.cybersource.com/docs/cybs/en-us/level-2-3/developer/vital/rest/level-2-3/l23-intro-overview/l23-l3-data.html" },
    { label: "GSA SmartPay: Purchase records, inspection and acceptance", href: "https://training.smartpay.gsa.gov/training_purchase/lesson07/" },
  ],
};
