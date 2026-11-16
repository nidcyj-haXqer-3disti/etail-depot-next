import type { BlogArticle } from "./content";

/** Archive G0210, adapted with current bank-payment security guidance. */
export const payByBankSafetyArticle: BlogArticle = {
  path: "/company/blog/is-pay-by-bank-safe",
  title: "Is pay by bank safe? What businesses should check",
  description: "Pay by bank describes a customer experience, not a single security model. It can involve an authorized bank debit or a transfer the customer sends. Its safety depends on the payment route, who approves the instruction, how account details are checked and what happens when something goes wrong.",
  summary: "Assess pay-by-bank safety through account checks, customer authorization, data permissions and recovery procedures for the payment service you use.",
  searchTitle: "Is pay by bank safe? A business security checklist",
  relatedPaths: ["/company/blog/ach-verification", "/company/blog/fednow-vs-rtp"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "direction", title: "Know who starts the payment" },
    { id: "controls", title: "Check the provider and your own process" },
    { id: "recovery", title: "Understand what recovery can involve" },
  ],
  sources: [
    { label: "Nacha: Account validation and its limits", href: "https://www.nacha.org/rules/supplementing-fraud-detection-standards-web-debits" },
    { label: "Stripe: Bank account linking and permissioned data", href: "https://docs.stripe.com/financial-connections/fundamentals" },
    { label: "FBI: Verifying payment requests and reporting fraud", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
    { label: "The Clearing House: RTP finality and return requests", href: "https://www.theclearinghouse.org/payment-systems/rtp/institution" },
    { label: "CFPB: Consumer account definition under Regulation E", href: "https://www.consumerfinance.gov/rules-policy/regulations/1005/2/" },
    { label: "Etail Depot: ACH authorization, processing and returns", href: "/services/ach-payments" },
  ],
};
