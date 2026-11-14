/** Exact editorial routes. Drafts stay outside search until publication review. */
export const BLOG_PATHS = [
  "/company/blog",
  "/company/blog/when-your-money-stops-moving",
  "/company/blog/payment-service-providers-holding-merchant-payouts",
  "/company/blog/payment-service-providers-freeze-funds-without-justification",
  "/company/blog/how-etail-depot-handles-risk",
  "/company/blog/when-your-payment-provider-freezes-your-funds",
  "/company/blog/why-instant-onboarding-is-a-trap",
  "/company/blog/riverside-payments-case-fine-print",
  "/company/blog/declined-for-payment-processing",
  "/company/blog/what-your-payment-provider-is-really-saying-yes-to",
  "/company/blog/reselling-payments-vs-running-a-payfac",
  "/company/blog/you-can-leave-that-is-the-point",
] as const;

/** Original copy is preserved; editorial concerns and publication review remain separate. */
export const DRAFT_BLOG_PATHS: readonly string[] = [...BLOG_PATHS];
