import type { BlogArticle } from "./content";

/** Unpublished archive G0145, adapted around the price the customer trusts and the margin the merchant retains. */
export const multicurrencyCommerceArticle: BlogArticle = {
  path: "/company/blog/how-multicurrency-ecommerce-payments-work",
  title: "You sold in euros. What did you keep?",
  description: "Multicurrency ecommerce connects the price shown, the currency charged and the money you receive. Understand conversion and refunds before expanding checkout.",
  summary: "The customer sees a familiar price. Your business receives a different currency. The margin depends on what happens between those amounts, including when an order comes back.",
  searchTitle: "Multicurrency ecommerce payments: prices, conversion and refunds",
  relatedPaths: ["/company/blog/cross-border-ecommerce-businesses", "/company/blog/cross-border-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Charge currencies, settlement currencies and issuer conversion", href: "https://docs.stripe.com/currencies" },
    { label: "Shopify: Local pricing and exchange-rate exposure", href: "https://help.shopify.com/en/manual/international/pricing/exchange-rates" },
    { label: "Shopify: Local-currency refunds and conversion differences", href: "https://help.shopify.com/en/manual/international/pricing/refunds" },
  ],
};
