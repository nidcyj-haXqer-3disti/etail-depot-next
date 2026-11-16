import type { BlogArticle } from "./content";

/** Unpublished archive G0625, adapted around the full commercial cost of an ACH return. */
export const achReturnCostsArticle: BlogArticle = {
  path: "/company/blog/ach-returns-and-ach-debit-return-charges",
  title: "The ACH return fee is only part of the cost",
  description: "Understand ACH returns and debit return charges: separate the unpaid sale from fees, avoid duplicate refunds and check costs before collecting again.",
  summary: "A returned bank payment can leave a fee, an unpaid invoice and another customer conversation. The fee is the easiest part to see, but it is not the whole cost.",
  searchTitle: "ACH returns and debit return charges: the real cost",
  relatedPaths: ["/company/blog/ach-rejection-codes", "/company/blog/reduce-ach-payment-failures"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Cybersource: eCheck returns and settlement account adjustments", href: "https://developer.cybersource.com/docs/cybs/en-us/echeck/user/all/rest/echeck-user-guide/echeck-txnprocess-overview/echeck-txnprocess-settlement/echeck-txnprocess-returns.html" },
    { label: "Stripe: ACH failures, refunds and duplicate credits", href: "https://docs.stripe.com/payments/ach-direct-debit" },
    { label: "Nacha: Permitted and improper ACH reversals", href: "https://www.nacha.org/rules/reversals-and-enforcement" },
    { label: "CFPB: Authorization to collect returned item fees electronically", href: "https://www.consumerfinance.gov/rules-policy/regulations/1005/3/#b-3" },
  ],
};
