import type { BlogArticle } from "./content";

/** Archive G1955, adapted around the work, decisions and exposure a platform buys. */
export const payfacServiceArticle: BlogArticle = {
  path: "/company/blog/payfac-as-a-service",
  title: "What are you buying with PayFac as a service?",
  description: "PayFac as a service can outsource payment operations. Understand who approves merchants, who carries losses and what your platform still has to manage.",
  summary: "The provider may do the work without taking every responsibility. Know which decisions, costs and customer promises remain yours.",
  searchTitle: "PayFac as a service: responsibilities, costs and control",
  relatedPaths: ["/company/blog/reselling-payments-vs-running-a-payfac", "/company/blog/isv-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Mastercard: Payment facilitator role and registration", href: "https://www.mastercard.com/us/en/business/support/payment-facilitators.html" },
    { label: "Stripe: PayFac as a service model", href: "https://stripe.com/resources/more/payment-facilitation-as-a-service" },
    { label: "Adyen: Ongoing verification and account capabilities", href: "https://docs.adyen.com/platforms/verification-overview/" },
    { label: "Adyen: Platform account structure and negative balances", href: "https://docs.adyen.com/platforms/quickstart-guide" },
  ],
};
