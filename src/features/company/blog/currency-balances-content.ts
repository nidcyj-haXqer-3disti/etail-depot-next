import type { BlogArticle } from "./content";

/** Unpublished archive G1036, adapted around the business purpose and operating boundaries of foreign-currency balances. */
export const currencyBalancesArticle: BlogArticle = {
  path: "/company/blog/how-multicurrency-bank-accounts-work",
  title: "A multicurrency account needs a job to do",
  description: "When does a multicurrency account help your business? Match currency receipts to bills, check payment access and understand who holds the money.",
  summary: "Keeping euros to pay a euro invoice can make sense. Keeping them without a plan is a different decision. Start with the payment your business needs to make.",
  searchTitle: "How multicurrency accounts work for a business",
  relatedPaths: ["/company/blog/how-multicurrency-ecommerce-payments-work", "/company/blog/reduce-intermediary-bank-fees"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Wise: Currency balances, receiving details and account location", href: "https://wise.com/help/articles/2897226/what-is-a-wise-account" },
    { label: "HSBC UK: Foreign-currency account types and access conditions", href: "https://www.business.hsbc.uk/en-gb/products/foreign-currency-account" },
    { label: "FDIC: Nonbank apps, deposit insurance and access to funds", href: "https://www.fdic.gov/consumer-resource-center/2024-06/banking-third-party-apps" },
  ],
};
