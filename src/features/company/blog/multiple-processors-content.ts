import type { BlogArticle } from "./content";

/** Archive G0178, adapted with current routing, recovery and migration guidance. */
export const multipleProcessorsArticle: BlogArticle = {
  path: "/company/blog/evaluate-and-manage-multiple-payment-processors",
  title: "When to use multiple payment processors",
  description: "A second payment processor can fill a coverage gap or provide an alternative for specific failures. It also adds contracts, integrations and records to manage. Start with the problem you need to solve, then check whether the extra connection is worth the work.",
  summary: "Learn when multiple payment processors make sense, what they add to daily operations and how to avoid duplicate payments when a result is uncertain.",
  searchTitle: "When to use multiple payment processors",
  relatedPaths: ["/company/blog/choose-a-merchant-services-provider", "/company/blog/credit-card-declines"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "identify-gap", title: "Identify the gap a second provider would fill" },
    { id: "weigh-the-work", title: "Include the work behind the connection" },
    { id: "payment-records", title: "Keep each payment traceable" },
    { id: "uncertain-results", title: "Resolve uncertainty before changing routes" },
    { id: "prove-the-route", title: "Start with one defined use case" },
  ],
  sources: [
    { label: "Stripe: Evaluating multiple payment providers", href: "https://stripe.com/guides/evaluating-and-managing-multiple-payment-providers" },
    { label: "Stripe: Orchestration scope and provider responsibilities", href: "https://docs.stripe.com/payments/orchestration" },
    { label: "Cybersource: Transaction timeout guidance", href: "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/spg/rest/payments/payments-intro/timeouts-intro.html" },
    { label: "Stripe: Error handling and duplicate protection", href: "https://docs.stripe.com/error-low-level" },
    { label: "Stripe: Payment data migration", href: "https://docs.stripe.com/get-started/data-migrations/overview" },
    { label: "Stripe: Conditions for retries across processors", href: "https://docs.stripe.com/payments/orchestration/retries" },
  ],
};
