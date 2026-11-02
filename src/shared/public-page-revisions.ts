import { CORE_PUBLIC_PATHS, isPublicContentPath } from "./public-page-inventory.ts";

/** Last significant page revision in the project editorial calendar (Asia/Tokyo).
 * Maintain when content, metadata or useful links change. Never use the build date.
 * Every core route must be recorded explicitly; no inherited or guessed dates.
 */
export const CORE_PAGE_MODIFIED = {
  "/": "2026-11-02",
  "/payment-acceptance-service": "2026-11-01",
  "/credit-card-services": "2026-11-01",
  "/online-businesses": "2026-11-01",
  "/merchant-onboarding": "2026-11-01",
  "/payment-methods": "2026-11-01",
  "/ach-payments": "2026-11-01",
  "/payouts-and-reconciliation": "2026-11-01",
  "/refunds-and-disputes": "2026-11-01",
  "/reconciliation": "2026-11-01",
  "/disputes": "2026-11-01",
  "/pricing": "2026-11-01",
  "/switch-payment-providers": "2026-11-01",
  "/software-partners": "2026-11-01",
  "/platform-payment-models": "2026-11-01",
  "/payment-partnerships": "2026-11-01",
  "/company": "2026-11-01",
  "/trust": "2026-11-01",
  "/payment-facilitator": "2026-11-01",
  "/contact": "2026-11-01",
  "/help": "2026-10-31",
  "/docs": "2026-11-01",
  "/docs/merchant-onboarding": "2026-11-01",
  "/docs/integration-access": "2026-11-01",
  "/docs/checkout": "2026-11-01",
  "/docs/payment-requests": "2026-11-01",
  "/docs/payment-status": "2026-11-01",
  "/docs/refunds-and-disputes": "2026-11-01",
  "/docs/payouts": "2026-11-01",
  "/docs/webhooks": "2026-11-01",
  "/docs/testing-and-launch": "2026-11-01",
  "/guides": "2026-11-01",
  "/privacy": "2026-10-27",
  "/terms": "2026-10-27",
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
