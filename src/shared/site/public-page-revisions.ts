import { CORE_PUBLIC_PATHS, isPublicContentPath } from "./public-page-inventory.ts";

/** Last significant page revision in the project editorial calendar (Asia/Tokyo).
 * Maintain when content, metadata or useful links change. Never use the build date.
 * Every core route must be recorded explicitly; no inherited or guessed dates.
 */
export const CORE_PAGE_MODIFIED = {
  "/": "2026-11-05",
  "/payment-acceptance-service": "2026-11-05",
  "/credit-card-services": "2026-11-01",
  "/online-businesses": "2026-11-05",
  "/merchant-onboarding": "2026-11-05",
  "/payment-methods": "2026-11-01",
  "/ach-payments": "2026-11-01",
  "/payouts-and-reconciliation": "2026-11-04",
  "/refunds-and-disputes": "2026-11-04",
  "/reconciliation": "2026-11-05",
  "/disputes": "2026-11-01",
  "/pricing": "2026-11-05",
  "/switch-payment-providers": "2026-11-05",
  "/software-partners": "2026-11-05",
  "/platform-payment-models": "2026-11-01",
  "/payment-partnerships": "2026-11-05",
  "/company": "2026-11-01",
  "/trust": "2026-11-05",
  "/payment-facilitator": "2026-11-05",
  "/contact": "2026-11-05",
  "/help": "2026-11-05",
  "/docs": "2026-11-03",
  "/docs/merchant-onboarding": "2026-11-05",
  "/docs/integration-access": "2026-11-05",
  "/docs/checkout": "2026-11-05",
  "/docs/payment-requests": "2026-11-01",
  "/docs/payment-status": "2026-11-05",
  "/docs/refunds-and-disputes": "2026-11-05",
  "/docs/payouts": "2026-11-05",
  "/docs/webhooks": "2026-11-05",
  "/docs/testing-and-launch": "2026-11-05",
  "/guides": "2026-11-07",
  "/resources/woocommerce-gateway-integration": "2026-11-07",
  "/resources/shopify-gateway-integration": "2026-11-07",
  "/privacy": "2026-11-04",
  "/terms": "2026-11-04",
  "/legal": "2026-11-04",
  "/legal/merchant-services": "2026-11-05",
  "/legal/acceptable-use": "2026-11-05",
  "/legal/merchant-privacy": "2026-11-05",
  "/legal/data-processing": "2026-11-05",
  "/legal/security-policy": "2026-11-04",
  "/legal/fees": "2026-11-05",
  "/legal/payouts-and-reserves": "2026-11-05",
  "/legal/software-platforms": "2026-11-05",
  "/legal/acquirer-disclosure": "2026-11-05",

} as const satisfies Record<(typeof CORE_PUBLIC_PATHS)[number], string>;

/** Page revisions are distinct from an external standard's release/effective dates.
 * The two reference collections retain their recorded revision, not today's audit date.
 */
export const REFERENCE_PAGE_MODIFIED = {
  "/guides/iso-20022": "2026-10-29",
  "/guides/iso-8583": "2026-10-29",
} as const;

export function publicPageModified(path: string): string {
  if (!isPublicContentPath(path)) throw new Error("Only an exact reviewed page can have a revision date.");
  if (Object.hasOwn(CORE_PAGE_MODIFIED, path)) return CORE_PAGE_MODIFIED[path as keyof typeof CORE_PAGE_MODIFIED];
  for (const [collection, date] of Object.entries(REFERENCE_PAGE_MODIFIED)) {
    if (path === collection || path.startsWith(`${collection}/`)) return date;
  }
  throw new Error(`Missing reviewed page revision: ${path}`);
}
