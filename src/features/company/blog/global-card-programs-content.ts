import type { BlogArticle } from "./content";

/** Archive G1825, adapted around the people and money behind international card coverage. */
export const globalCardProgramsArticle: BlogArticle = {
  path: "/company/blog/cross-border-card-programs",
  title: "Taking a card program abroad starts with who can use it",
  description: "A card that works on an overseas trip may belong to a program that cannot enroll the people who live there. That distinction can change an expansion plan.",
  summary: "Explore global card issuance through customer eligibility, company and employee roles, funding currencies, conversion records and the experience in each market.",
  searchTitle: "Global card issuance: eligibility, currencies and funding",
  relatedPaths: ["/company/blog/card-issuing-apis", "/company/blog/credit-cards-and-digital-wallets"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Local and international issuing arrangements", href: "https://docs.stripe.com/issuing/global" },
    { label: "Adyen: Account holders and authorized card users", href: "https://help.adyen.com/knowledge/issuing/legal-entities/account-holder-cardholder-and-authorized-users" },
    { label: "Airwallex: Currency conversion, clearing and refunds", href: "https://www.airwallex.com/docs/issuing/transactions/auto-conversion" },
    { label: "Airwallex: Card programs and regional capabilities", href: "https://www.airwallex.com/docs/issuing/supported-card-programs" },
  ],
};
