import type { BlogArticle } from "./content";

/** Unpublished archive G0083, adapted around the international sale behind a dollar price. */
export const crossBorderPaymentsArticle: BlogArticle = {
  path: "/company/blog/cross-border-payments",
  title: "Cross-border payments can hide behind a dollar price",
  description: "Charging in USD does not make every payment domestic. Understand the customer’s currency, international card classification and the payout your business receives.",
  summary: "Your checkout shows dollars. Your bank receives dollars. An international customer’s payment can still carry a different classification, cost and customer experience.",
  searchTitle: "How cross-border payments work: currencies, cards and payouts",
  relatedPaths: ["/company/blog/pick-the-right-payment-methods-in-a-new-country", "/company/blog/b2b-cross-border-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Bank for International Settlements: Borders and currencies are distinct", href: "https://www.bis.org/publications/payments-without-borders" },
    { label: "Stripe: Customer, charge and settlement currencies", href: "https://docs.stripe.com/currencies" },
    { label: "Visa Acceptance: Currency conversion choices and disclosures", href: "https://docs.visaacceptance.com/experience/merchant/payouts-money-move/dcc/overview-dcc-merchant/" },
    { label: "Swift: Payment messages and the institutions moving funds", href: "https://www.swift.com/about-us/who-we-are" },
  ],
};
