import type { BlogArticle } from "./content";

/** Archive G0255, adapted with current payment-role and support guidance. */
export const processorAcquirerArticle: BlogArticle = {
  path: "/company/blog/payment-processor-vs-merchant-acquirer",
  title: "Payment processor vs. acquirer: who handles which part?",
  description: "A payment processor handles transaction messages and processing services. An acquirer provides the merchant’s card acceptance relationship with the card networks. Understanding the difference helps you ask the right questions when a payment or account needs attention.",
  summary: "Understand payment processor and acquirer roles, how one provider can combine services, and who to contact about transaction results, refunds or funding restrictions.",
  searchTitle: "Payment processor vs. acquirer: roles explained",
  relatedPaths: ["/company/blog/merchant-accounts-and-acquiring", "/company/blog/payment-settlement-and-payouts"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "separate-payment-roles", title: "Look at the responsibilities behind the name" },
    { id: "combined-services", title: "One provider can perform several roles" },
    { id: "route-the-question", title: "Send the question to the team that can resolve it" },
    { id: "keep-incidents-separate", title: "Keep a payment issue separate from an account review" },
    { id: "keep-account-map", title: "Keep a clear record of your account arrangement" },
  ],
  sources: [
    { label: "Stripe: Payment processors and merchant acquirers", href: "https://stripe.com/resources/more/payment-processor-vs-merchant-acquirer" },
    { label: "Adyen: Gateway, processor, acquirer and issuer definitions", href: "https://docs.adyen.com/adyen-glossary" },
    { label: "Visa: Acceptance entities and payment facilitators", href: "https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/visa-acceptance-entities.pdf" },
    { label: "Cybersource: Unknown payment results and recovery", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/gpn/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Etail Depot: Acquirer and provider responsibilities", href: "/company/legal/acquirer-disclosure" },
    { label: "Etail Depot: Payouts and reserves", href: "/company/legal/payouts-and-reserves" },
  ],
};
