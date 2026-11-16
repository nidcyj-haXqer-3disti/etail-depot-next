import type { BlogArticle } from "./content";

/** Archive G0587, adapted around legitimate address mismatches and payment recovery. */
export const billingAddressArticle: BlogArticle = {
  path: "/company/blog/billing-address",
  title: "A billing address mismatch is not a fraud verdict",
  description: "A billing address can differ from the delivery address. Learn what an AVS mismatch means and how to resolve it without overlooking risk or duplicating a payment.",
  summary: "A business card can use a head office address while the order goes to a branch. Read the address check and the payment result before deciding what happened.",
  searchTitle: "Billing address mismatches: what AVS checks really tell you",
  relatedPaths: ["/company/blog/card-authorization", "/company/blog/credit-card-declines"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Card and billing address verification", href: "https://docs.stripe.com/disputes/prevention/verification" },
    { label: "Cybersource: Address verification result distinctions", href: "https://developer.cybersource.com/docs/cybs/en-us/api-fields/reference/all/rest/api-fields/processing-info-aa/processing-info-auth-ops-decline-avs-flags.html" },
    { label: "Cybersource: Secure Acceptance payment results", href: "https://developer.cybersource.com/docs/cybs/en-us/sa/developer/all/sa-checkout/secure-acceptance/sa-reason-codes.html" },
    { label: "Cybersource: Secure Acceptance authorization reversal settings", href: "https://developer.cybersource.com/docs/cybs/en-us/sa/developer/all/sa-checkout/secure-acceptance/sa-payment-configuration.html" },
  ],
};
