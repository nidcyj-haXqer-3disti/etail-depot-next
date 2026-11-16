import type { BlogArticle } from "./content";

/** Retired archive G0679, adapted around the buyer's return from a bank check. */
export const threeDSecureArticle: BlogArticle = {
  path: "/company/blog/how-3d-secure-works",
  title: "3D Secure: what happens after the bank checks the buyer",
  description: "3D Secure helps authenticate an online cardholder. The payment still needs its own result. Understand the bank check, the return to checkout and the limits of protection.",
  summary: "A buyer approves the purchase in their banking app, then returns to an unpaid order. Understanding that gap matters as much as adding the security check.",
  searchTitle: "How 3D Secure works: authentication, checkout and protection",
  relatedPaths: ["/company/blog/what-is-a-chargeback", "/company/blog/payment-gateway-testing"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "EMVCo: How EMV 3D Secure authenticates online buyers", href: "https://www.emvco.com/emv-technologies/3-d-secure/" },
    { label: "EMVCo: Bank challenges and banking app approval", href: "https://www.emvco.com/dynamic/emv-3-d-secure-whitepaper-v2/challenge-flow/business-overview/" },
    { label: "Cybersource: Authentication results and the next payment step", href: "https://developer.cybersource.com/docs/cybs/en-us/payer-authentication/developer/all/rest/payer-auth/pa2-intro-intro/pa2-intro-process-overview.html" },
    { label: "Stripe: Authentication outcomes and liability shift conditions", href: "https://docs.stripe.com/payments/3d-secure/authentication-flow" },
  ],
};
