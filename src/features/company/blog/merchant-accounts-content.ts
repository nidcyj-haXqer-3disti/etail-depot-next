import type { BlogArticle } from "./content";

/** Archive G0009, adapted to the current merchant service and Blog layout. */
export const merchantAccountsArticle: BlogArticle = {
  path: "/company/blog/merchant-accounts-and-acquiring",
  title: "Merchant accounts and acquiring: who handles your payments",
  description: "A merchant account supports accepting card payments. Your business bank account receives the payouts. Understanding the relationship between them helps you choose a provider and know who to contact when something needs attention.",
  summary: "Understand merchant accounts, acquiring banks and payment facilitators, plus what to check before applying and after your account is approved.",
  searchTitle: "Merchant accounts and acquiring explained",
  relatedPaths: ["/company/blog/payment-processing-systems", "/company/blog/stripe-alternatives"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "account-arrangement", title: "Start with the account arrangement" },
    { id: "who-does-what", title: "Know who does what" },
    { id: "before-applying", title: "The account needs to fit the sale" },
    { id: "check-the-agreement", title: "Put the terms in writing" },
    { id: "after-approval", title: "Connect the approved account" },
    { id: "follow-your-funds", title: "Follow your funds" },
  ],
  sources: [
    { label: "Visa: Payment facilitator model", href: "https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/visa-payment-facilitator-model.pdf" },
    { label: "Mastercard: Payment facilitators", href: "https://www.mastercard.com/global/en/business/support/payment-facilitators.html" },
    { label: "Cybersource: Merchant financial institutions and acquiring", href: "https://developer.visaacceptance.com/docs/cybs/en-us/payments/developer/migs/rest/payments/payments-intro/payments-intro-banks-overview/payments-intro-banks-acquiring.html" },
    { label: "Visa: Choosing an acquirer", href: "https://www.visa.co.uk/supporting-info/find-an-acquirer.html" },
    { label: "Etail Depot: Payouts and reserves", href: "/company/legal/payouts-and-reserves" },
  ],
};
