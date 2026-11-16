import type { BlogArticle } from "./content";

/** Unpublished archive G0670, adapted around the limits of transaction-level fraud protection. */
export const liabilityShiftArticle: BlogArticle = {
  path: "/company/blog/fraud-liability-shift",
  title: "The limits of a protected card payment",
  description: "Fraud liability shift can protect eligible card payments against certain fraud claims. Learn what to verify and why other disputes still need a response.",
  summary: "A successful bank check can matter in a fraud dispute. It cannot settle whether you sent the right product. Know which protection applies to the actual payment.",
  searchTitle: "Fraud liability shift: what a protected payment covers",
  relatedPaths: ["/company/blog/how-3d-secure-works", "/company/blog/goods-not-received-chargeback-evidence"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Visa: Authentication and conditional fraud liability protection", href: "https://corporate.visa.com/en/solutions/visa-protect/insights/authentication-and-identity.html" },
    { label: "Stripe: 3D Secure liability shift, exceptions and inquiries", href: "https://docs.stripe.com/payments/3d-secure/authentication-flow" },
    { label: "Cybersource: Passing authentication information into authorization", href: "https://developer.cybersource.com/docs/cybs/en-us/payer-authentication/developer/all/rest/payer-auth/pa-sdk-intro/pa-sdk-implementing-sdk-pa.html" },
    { label: "Stripe: Different dispute reasons require different evidence", href: "https://docs.stripe.com/disputes/categories" },
  ],
};
