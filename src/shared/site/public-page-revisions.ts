import { CORE_PUBLIC_PATHS, isPublicContentPath } from "./public-page-inventory.ts";

/** Last significant page revision in the project editorial calendar (Asia/Tokyo).
 * Maintain when content, metadata or useful links change. Never use the build date.
 * Every core route must be recorded explicitly; no inherited or guessed dates.
 */
export const CORE_PAGE_MODIFIED = {
  "/developers/getting-started": "2026-11-09",
  "/developers/api-reference": "2026-11-08",
  "/developers/sdks": "2026-11-09",
  "/developers/webhooks": "2026-11-08",
  "/developers/testing": "2026-11-08",
  "/developers/developer-tools": "2026-11-08",
  "/developers/changelog": "2026-11-09",
  "/developers/api-status": "2026-11-09",
  "/resources/merchant-account-setup": "2026-11-10",
  "/": "2026-11-05",
  "/services/merchant-services": "2026-11-05",
  "/services/card-services": "2026-11-01",
  "/use-cases/online-businesses": "2026-11-05",
  "/services/merchant-onboarding": "2026-11-05",
  "/services/payment-methods": "2026-11-01",
  "/services/ach-payments": "2026-11-01",
  "/services/payouts": "2026-11-10",
  "/services/refunds": "2026-11-10",
  "/services/reconciliation": "2026-11-10",
  "/services/disputes": "2026-11-10",
  "/pricing": "2026-11-05",
  "/use-cases/switch-merchant-services": "2026-11-05",
  "/use-cases/software-platforms": "2026-11-11",
  "/use-cases/software-platforms/payment-models": "2026-11-01",
  "/use-cases/software-platforms/partnerships": "2026-11-05",
  "/company/about": "2026-11-01",
  "/company/security": "2026-11-05",
  "/services/payment-facilitator": "2026-11-05",
  "/company/contact": "2026-11-05",
  "/resources/help": "2026-11-05",
  "/resources/guides": "2026-11-09",
  "/resources/woocommerce-gateway-integration": "2026-11-07",
  "/resources/shopify-gateway-integration": "2026-11-07",
  "/company/privacy": "2026-11-04",
  "/company/terms": "2026-11-04",
  "/company/legal": "2026-11-04",
  "/company/legal/merchant-services": "2026-11-05",
  "/company/legal/acceptable-use": "2026-11-05",
  "/company/legal/merchant-privacy": "2026-11-05",
  "/company/legal/data-processing": "2026-11-05",
  "/company/legal/security-policy": "2026-11-04",
  "/company/legal/fees": "2026-11-05",
  "/company/legal/payouts-and-reserves": "2026-11-05",
  "/company/legal/software-platforms": "2026-11-05",
  "/company/legal/acquirer-disclosure": "2026-11-05",

} as const satisfies Record<(typeof CORE_PUBLIC_PATHS)[number], string>;

/** Page revisions are distinct from an external standard's release/effective dates.
 * The two reference collections retain their recorded revision, not today's audit date.
 */
export const REFERENCE_PAGE_MODIFIED = {
  "/resources/guides/iso-20022": "2026-10-29",
  "/resources/guides/iso-8583": "2026-10-29",
} as const;

export function publicPageModified(path: string): string {
  if (!isPublicContentPath(path)) throw new Error("Only an exact reviewed page can have a revision date.");
  if (Object.hasOwn(CORE_PAGE_MODIFIED, path)) return CORE_PAGE_MODIFIED[path as keyof typeof CORE_PAGE_MODIFIED];
  for (const [collection, date] of Object.entries(REFERENCE_PAGE_MODIFIED)) {
    if (path === collection || path.startsWith(`${collection}/`)) return date;
  }
  throw new Error(`Missing reviewed page revision: ${path}`);
}
