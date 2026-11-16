import type { BlogArticle } from "./content";

/** Unpublished archive G0340, adapted around a merchant's response when a customer questions a card statement amount. */
export const foreignFeeQuestionsArticle: BlogArticle = {
  path: "/company/blog/foreign-transaction-fees",
  title: "The extra charge your customer thinks came from you",
  description: "A card statement can include conversion and issuer fees beyond your receipt. How merchants can explain foreign transaction fees without dismissing a customer.",
  summary: "Your customer sees a higher amount and calls your business. A useful answer starts with the payment record, before anyone blames an exchange rate or a bank.",
  searchTitle: "Foreign transaction fees: when customers question your receipt",
  relatedPaths: ["/company/blog/cross-border-payments", "/company/blog/how-multicurrency-ecommerce-payments-work"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Charge currency, settlement currency and card issuer fees", href: "https://docs.stripe.com/currencies" },
    { label: "CFPB: Foreign transaction fees in US consumer credit guidance", href: "https://www.consumerfinance.gov/rules-policy/regulations/1026/4/" },
    { label: "Visa: Dynamic currency conversion disclosures and customer choice", href: "https://www.visa.com/en-us/personal/travel/dynamic-currency-conversion" },
  ],
};
