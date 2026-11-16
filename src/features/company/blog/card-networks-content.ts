import type { BlogArticle } from "./content";

/** Archive G0079, adapted with current network and merchant acceptance guidance. */
export const cardNetworksArticle: BlogArticle = {
  path: "/company/blog/credit-card-networks",
  title: "Credit card networks: what the logo tells a merchant",
  description: "A card network connects the participants in a payment and sets rules for its system. The logo identifies the network. Your merchant account agreement and checkout setup determine what your business can accept and what you pay.",
  summary: "Understand credit card networks, issuers and acquiring banks, plus what merchants should check about card acceptance, processing fees and support.",
  searchTitle: "Credit card networks explained for merchants",
  relatedPaths: ["/company/blog/merchant-accounts-and-acquiring", "/company/blog/card-authorization"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "different-roles", title: "Separate the network from the issuer" },
    { id: "payment-flow", title: "Follow the network’s role" },
    { id: "acceptance", title: "Check acceptance before adding a logo" },
    { id: "cost", title: "Read fees at the right level" },
    { id: "rules-and-support", title: "Know the rules and support route" },
  ],
  sources: [
    { label: "Mastercard: How credit card transactions work", href: "https://www.mastercard.com/us/en/for-the-world/prosperity/financial-inclusion-products-and-solutions/masteryourcard/resource-center/how-credit-card-transactions-work.html" },
    { label: "Mastercard: Authorization, clearing and settlement", href: "https://www.mastercard.com/eea/switching-services/our-technology/transaction.html" },
    { label: "Visa: Rules and policy for merchants", href: "https://www.visa.com/en-us/support/visa-rules" },
    { label: "Visa: Processing fees and interchange", href: "https://www.visa.com/en-us/support/business/regulation-fees" },
    { label: "Stripe: Card networks and issuing roles", href: "https://stripe.com/resources/more/how-do-credit-card-networks-work" },
  ],
};
