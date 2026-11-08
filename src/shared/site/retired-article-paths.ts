/** Previously published articles retired from the local candidate on 27 October 2026.
 * No equivalent ISO replacement exists; serve 410 without redirecting visitors.
 * Unpublished drafts are absent and return the normal 404 response.
 */
export const RETIRED_ARTICLE_PATHS = [
  "/guides/how-to-create-a-payment-link",
  "/guides/stripe-alternatives",
  "/guides/payment-processing-systems",
  "/guides/what-is-a-chargeback",
  "/guides/optimize-your-mobile-checkout-experience",
  "/guides/cart-abandonment-vs-checkout-abandonment",
  "/guides/consuming-webhooks",
  "/guides/designing-robust-and-predictable-apis-with-idempotency",
  "/guides/how-3d-secure-works",
  "/guides/account-takeover-fraud",
  "/guides/important-invoice-management-tips",
  "/guides/types-of-invoice-discrepancies",
  "/guides/b2b-payment-methods",
  "/guides/ach-debit",
  "/guides/edi-payment-how-does-it-differ-from-ach-and-eft",
  "/guides/pick-the-right-payment-methods-in-a-new-country",
  "/guides/important-information-about-bic-and-swift-codes",
  "/guides/profit-and-loss-statement",
  "/guides/read-a-balance-sheet",
  "/guides/credit-card-interest"
] as const;
