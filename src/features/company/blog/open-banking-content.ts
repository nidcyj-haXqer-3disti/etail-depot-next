import type { BlogArticle } from "./content";

/** Archive G1952, adapted around permission and the merchant's payment outcome. */
export const openBankingArticle: BlogArticle = {
  path: "/company/blog/open-banking-api",
  title: "Connecting a bank account is not the same as paying",
  description: "Open banking APIs can connect account data and payment services. Learn why bank access, customer authorization and receipt of funds are different merchant decisions.",
  summary: "A successful bank connection can leave an order unpaid. Understand what the customer agreed to and what your business can safely do next.",
  searchTitle: "Open banking APIs: bank access is not payment permission",
  relatedPaths: ["/company/blog/is-pay-by-bank-safe", "/company/blog/ach-verification"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "FCA: Account information, payment initiation and consent in the UK", href: "https://www.fca.org.uk/consumers/account-information-payment-initiation-services" },
    { label: "Plaid: Account connections, payment processing and lost consent", href: "https://plaid.com/docs/auth/" },
    { label: "Nacha: Consumer ACH debit authorization", href: "https://www.nacha.org/news/importance-compliant-ach-authorizations" },
    { label: "TrueLayer: Authorization, execution and settlement statuses", href: "https://docs.truelayer.com/docs/payment-statuses" },
  ],
};
