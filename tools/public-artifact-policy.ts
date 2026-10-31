/** Pure deployment-boundary detectors, shared by packaging checks and adversarial tests. */
import { COMMERCIAL_PATHS } from "../src/shared/commercial-paths.ts";
import { PUBLIC_CONTENT_PATHS, publicExportFile } from "../src/shared/public-page-inventory.ts";
import { managedContentRoute, retiredArticleRoute } from "../src/shared/public-routes.ts";

export const retiredFamilies = ["api", "checkout", "pay", "payments", "cardholder-services", "cards", "merchant-services", "merchants", "login", "profile", "security", "shared-access", "invitations", "operations", "money-accounts", "accounts", "services"] as const;
export const boundarySource = "netlify/edge-functions/public-boundary.ts";
export const edgeHandler = "public-boundary";

/** Exact reviewed pages: adding a guide never opens the rest of its route family. */
const retainedCorePageSources = [
  "page.tsx",
  "credit-card-services/page.tsx",
  "payment-acceptance-service/page.tsx",
  "help/page.tsx",
  "privacy/page.tsx",
  "terms/page.tsx",
  "guides/page.tsx",
] as const;
export const publicHtmlFiles = PUBLIC_CONTENT_PATHS.map(path => path === "/" ? "index.html" : `${path.slice(1)}.html`);
/** Local source/export permission is separate from the published-page allowlist. */
export const localCorePreviewPageSources = ["software-partners/page.tsx", "docs/page.tsx", "online-businesses/page.tsx", "docs/merchant-onboarding/page.tsx", "docs/integration-access/page.tsx", "docs/checkout/page.tsx", "docs/payment-requests/page.tsx", "docs/payment-status/page.tsx", "docs/refunds-and-disputes/page.tsx", "docs/payouts/page.tsx", "docs/webhooks/page.tsx", "docs/testing-and-launch/page.tsx"] as const;
export const localStandardPageSources = [
  "guides/iso-20022/page.tsx", "guides/iso-20022/[set]/page.tsx", "guides/iso-20022/[set]/[code]/page.tsx",
  "guides/iso-8583/page.tsx", "guides/iso-8583/[table]/page.tsx", "guides/iso-8583/[table]/[code]/page.tsx",
] as const;
export const commercialPageSources = COMMERCIAL_PATHS.map(path => `${path.slice(1)}/page.tsx`);
export const publicPageSources = [...commercialPageSources, ...retainedCorePageSources, ...localCorePreviewPageSources, ...localStandardPageSources];
/** Additional routes require explicit review before joining this release. */
export const localPreviewPageSources: readonly string[] = [];
export const builtPageSources = publicPageSources;
const publicAppModules = new Set<string>([
  ...builtPageSources,
  "layout.tsx", "not-found.tsx", "error.tsx", "global-error.tsx", "robots.ts", "sitemap.ts", "opengraph-image.tsx",
]);

export function reviewedPublicAppModule(appPath: string): boolean {
  return publicAppModules.has(appPath);
}

export function publicSourcePath(filename: string): boolean {
  return filename === boundarySource || filename.startsWith("src/app/") || filename.startsWith("src/ui/") ||
    filename.startsWith("src/shared/") || filename.startsWith("src/modules/public-site/");
}

export function forbiddenArtifact(filename: string): boolean {
  const normalized = filename.replaceAll("\\", "/");
  return /(?:^|\/)(?:\.env(?:\.[^/]*)?|\.local|\.git)(?:\/|$)/.test(normalized) ||
    /(?:^|\/)archive(?:\/|$)/.test(normalized) || /(?:^|\/)netlify\/database(?:\/|$)/.test(normalized) ||
    /(?:^|\/)src\/platform(?:\/|$)/.test(normalized) ||
    /(?:^|\/)src\/modules\/(?!public-site(?:\/|$))/.test(normalized) ||
    /(?:^|\/)node_modules\/(?:pg|drizzle-orm|node-forge|braces|micromatch|fast-glob|netlify-cli|@netlify\/(?:database|identity|plugin-nextjs))(?:\/|$)/.test(normalized) ||
    /(?:^|\/)node_modules\/\.pnpm\/(?:pg|drizzle-orm|node-forge|braces|micromatch|fast-glob|netlify-cli|@netlify\+(?:database|identity|plugin-nextjs))@/.test(normalized);
}

export function forbiddenStatic(filename: string): boolean {
  const normalized = filename.replaceAll("\\", "/");
  return forbiddenArtifact(normalized) || /(?:^|\/)(?:src|review|artifacts|content|outputs|tools|node_modules|\.next|functions|functions-internal)(?:\/|$)/.test(normalized) ||
    (managedContentRoute(`/${normalized}`) && (!publicExportFile(normalized) || normalized !== filename)) || retiredArticleRoute(`/${normalized}`) ||
    /\.(?:sql|sqlite|sqlite3|db|dump|zip|eszip)$/i.test(normalized) ||
    retiredFamilies.some(family => normalized === family || normalized.startsWith(`${family}/`) || normalized === `${family}.html` || normalized === `${family}.txt`);
}

/** All requests pass the single public boundary so deployment-context search protection cannot be bypassed. */
export function edgeEntryFindings(entries: unknown): string[] {
  if (!Array.isArray(entries)) return ["INVALID_EDGE_ENTRIES"];
  const issues: string[] = [];
  if (entries.length !== 1) issues.push("UNEXPECTED_EDGE_ENTRY_COUNT");
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") { issues.push("INVALID_EDGE_ENTRY"); continue; }
    if (entry.function !== edgeHandler) issues.push("UNEXPECTED_EDGE_HANDLER");
    if (entry.pattern !== "^/.*$") issues.push("UNEXPECTED_EDGE_PATTERN");
    if ((entry.excluded_patterns !== undefined && (!Array.isArray(entry.excluded_patterns) || entry.excluded_patterns.length)) ||
        entry.excludedPattern !== undefined || entry.methods !== undefined || entry.method !== undefined || entry.path !== undefined) {
      issues.push("RESTRICTED_BOUNDARY_COVERAGE");
    }
  }
  return [...new Set(issues)];
}

/** Review packaging uses the same content with preview search protection. */
export const localReviewHtmlFiles = publicHtmlFiles;
export const forbiddenLocalReviewStatic = forbiddenStatic;

export function publicationBlockers(pendingPageSources: readonly string[], hasIso8583: boolean): string[] {
  const blockers: string[] = [];
  if (hasIso8583) blockers.push("ISO_8583_PERMISSION_UNCONFIRMED: written permission for website republication and public source distribution has not been recorded. The user chose to retain the full collection and wait for permission.");
  if (pendingPageSources.length) blockers.push(`EXPANDED_RELEASE_SCOPE_HELD: ${pendingPageSources.length} page sources remain approved for local review only. Full scope production routing, metadata and release approval remain pending.`);
  return blockers;
}
