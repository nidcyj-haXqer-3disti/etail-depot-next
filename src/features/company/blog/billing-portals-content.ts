import type { BlogArticle } from "./content";

/** Archive G0425, adapted around completed customer tasks, billing outcomes and appropriate account access. */
export const billingPortalsArticle: BlogArticle = {
  path: "/company/blog/customer-billing-portals",
  title: "A billing portal should finish the job",
  description: "A customer billing portal should make payment status, subscription changes and account access clear. Self-service works when customers know what actually happened.",
  summary: "A saved card is not a paid invoice. A cancellation request is not a refund. The value of a billing portal is in making those outcomes clear to the person using it.",
  searchTitle: "Customer billing portals: self-service that works",
  relatedPaths: ["/company/blog/saas-payment-processing", "/company/blog/billing-models"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Customer portal features and subscription limits", href: "https://docs.stripe.com/customer-management" },
    { label: "Stripe: Cancellation dates, refunds and final invoices", href: "https://docs.stripe.com/billing/subscriptions/cancel" },
    { label: "GitHub: Billing manager permissions", href: "https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/adding-a-billing-manager-to-your-organization" },
    { label: "W3C: Making status messages accessible", href: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html" },
  ],
};
