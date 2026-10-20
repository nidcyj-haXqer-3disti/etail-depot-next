/** Pure deployment-boundary detectors, shared by packaging checks and adversarial tests. */
export const retiredFamilies = ["api", "checkout", "pay", "payments", "cardholder-services", "cards", "merchant-services", "merchants", "login", "profile", "security", "shared-access", "invitations", "operations", "money-accounts", "accounts", "services"] as const;
export const boundarySource = "netlify/edge-functions/public-boundary.ts";
export const edgeHandler = "public-boundary";

/** Exact reviewed pages: adding a guide never opens the rest of its route family. */
export const publicPageSources = [
  "page.tsx", "credit-card-services/page.tsx", "payment-acceptance-service/page.tsx", "help/page.tsx",
  "privacy/page.tsx", "terms/page.tsx", "guides/page.tsx", "guides/stripe-alternatives/page.tsx",
  "guides/payment-processing-systems/page.tsx", "guides/what-is-a-chargeback/page.tsx",
  "guides/how-to-create-a-payment-link/page.tsx",
] as const;
export const publicHtmlFiles = publicPageSources.map(page => page === "page.tsx" ? "index.html" : page.replace(/\/page\.tsx$/, ".html"));
const publicAppModules = new Set<string>([
  ...publicPageSources,
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
  return forbiddenArtifact(normalized) || /(?:^|\/)(?:src|node_modules|\.next|functions|functions-internal)(?:\/|$)/.test(normalized) ||
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
