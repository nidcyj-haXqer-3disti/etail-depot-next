import { describe, expect, it } from "vitest";
import { boundarySource, edgeEntryFindings, forbiddenArtifact, forbiddenStatic, publicHtmlFiles, publicPageSources, publicSourcePath, retiredFamilies, reviewedPublicAppModule } from "../../tools/public-artifact-policy";

describe("static public deployment boundary", () => {
  it("allows the twenty-seven reviewed pages and exact helpers without opening arbitrary guide routes", () => {
    expect(publicPageSources).toEqual([
      "page.tsx",
      "credit-card-services/page.tsx",
      "payment-acceptance-service/page.tsx",
      "help/page.tsx",
      "privacy/page.tsx",
      "terms/page.tsx",
      "guides/page.tsx",
      "guides/stripe-alternatives/page.tsx",
      "guides/payment-processing-systems/page.tsx",
      "guides/what-is-a-chargeback/page.tsx",
      "guides/how-to-create-a-payment-link/page.tsx",
      "guides/optimize-your-mobile-checkout-experience/page.tsx",
      "guides/cart-abandonment-vs-checkout-abandonment/page.tsx",
      "guides/consuming-webhooks/page.tsx",
      "guides/designing-robust-and-predictable-apis-with-idempotency/page.tsx",
      "guides/how-3d-secure-works/page.tsx",
      "guides/account-takeover-fraud/page.tsx",
      "guides/important-invoice-management-tips/page.tsx",
      "guides/types-of-invoice-discrepancies/page.tsx",
      "guides/b2b-payment-methods/page.tsx",
      "guides/ach-debit/page.tsx",
      "guides/edi-payment-how-does-it-differ-from-ach-and-eft/page.tsx",
      "guides/pick-the-right-payment-methods-in-a-new-country/page.tsx",
      "guides/important-information-about-bic-and-swift-codes/page.tsx",
      "guides/profit-and-loss-statement/page.tsx",
      "guides/read-a-balance-sheet/page.tsx",
      "guides/credit-card-interest/page.tsx",
    ]);
    expect(publicHtmlFiles).toEqual([
      "index.html",
      "credit-card-services.html",
      "payment-acceptance-service.html",
      "help.html",
      "privacy.html",
      "terms.html",
      "guides.html",
      "guides/stripe-alternatives.html",
      "guides/payment-processing-systems.html",
      "guides/what-is-a-chargeback.html",
      "guides/how-to-create-a-payment-link.html",
      "guides/optimize-your-mobile-checkout-experience.html",
      "guides/cart-abandonment-vs-checkout-abandonment.html",
      "guides/consuming-webhooks.html",
      "guides/designing-robust-and-predictable-apis-with-idempotency.html",
      "guides/how-3d-secure-works.html",
      "guides/account-takeover-fraud.html",
      "guides/important-invoice-management-tips.html",
      "guides/types-of-invoice-discrepancies.html",
      "guides/b2b-payment-methods.html",
      "guides/ach-debit.html",
      "guides/edi-payment-how-does-it-differ-from-ach-and-eft.html",
      "guides/pick-the-right-payment-methods-in-a-new-country.html",
      "guides/important-information-about-bic-and-swift-codes.html",
      "guides/profit-and-loss-statement.html",
      "guides/read-a-balance-sheet.html",
      "guides/credit-card-interest.html",
    ]);
    for (const path of [...publicPageSources, "layout.tsx", "robots.ts", "sitemap.ts"]) expect(reviewedPublicAppModule(path), path).toBe(true);
    for (const path of ["guides/route.ts", "guides/unreviewed/page.tsx", "guides/payment-processing-fees/page.tsx", "guides/[slug]/page.tsx", "guides/[...slug]/page.tsx", "guides/stripe-alternatives/route.ts", "guides/stripe-alternatives/extra.tsx", "guides/stripe-alternatives/checkout/page.tsx", "guides/how-to-create-a-payment-link/route.ts", "guides/how-to-create-a-payment-link/extra.tsx", "guides/how-to-create-a-payment-link/checkout/page.tsx", "help/unreviewed.tsx", "api/route.ts", "login/page.tsx", "guides/booking-system-with-payment/page.tsx", "guides/countertop-payment-terminal/page.tsx", "guides/use-a-cash-register/page.tsx", "guides/charge-cards/page.tsx", "guides/[...browse]/page.tsx", "guides/sections/payment-processing-checkout/page.tsx", "guides/page/2/page.tsx"]) {
      expect(reviewedPublicAppModule(path), path).toBe(false);
    }
  });

  it("allows exactly the reviewed edge source without reopening retired runtime directories", () => {
    expect(publicSourcePath(boundarySource)).toBe(true);
    expect(publicSourcePath("src/modules/public-site/metadata.ts")).toBe(true);
    for (const path of ["src/proxy.ts", "src/platform/database.ts", "src/modules/identity/session.ts", "netlify/functions/account.ts", "netlify/edge-functions/account.ts"]) {
      expect(publicSourcePath(path), path).toBe(false);
    }
  });

  it("rejects private records, configuration and retired or vulnerable runtime dependencies", () => {
    for (const path of [".env", "server/.env.production", ".local/keys.json", "archive/database/migration.sql", "netlify/database/migrations/a.sql", "src/modules/identity/session.ts", "node_modules/pg/lib/index.js", "node_modules/@netlify/database/index.js", "node_modules/.pnpm/@netlify+identity@1.0.0/index.js", "node_modules/braces/lib/parse.js", "node_modules/.pnpm/node-forge@1.4.0/lib/rsa.js", "node_modules/@netlify/plugin-nextjs/dist/run.js", "node_modules/netlify-cli/bin/run.js"]) {
      expect(forbiddenArtifact(path), path).toBe(true);
      expect(forbiddenArtifact(path.replaceAll("/", "\\")), `Windows path ${path}`).toBe(true);
    }
    expect(forbiddenArtifact("src/shared/public-release.ts")).toBe(false);
  });

  it("never publishes an account page, data file, source tree or server bundle as a static asset", () => {
    for (const family of retiredFamilies) {
      for (const suffix of ["", ".html", ".txt", "/index.html", "/record.json"]) expect(forbiddenStatic(`${family}${suffix}`)).toBe(true);
    }
    for (const path of ["records.db", "backup.SQL", "src/app/page.tsx", "node_modules/next/package.json", ".next/server/page.js", "functions/server.js", "server.zip", "edge.eszip", "review/guides/manifest.json", "artifacts/guides-review/site/index.html", "content/drafts/guide.json", "outputs/topic-map.csv", "tools/guide-review/build.mjs"]) expect(forbiddenStatic(path), path).toBe(true);
    for (const path of [...publicHtmlFiles, ...publicHtmlFiles.map(file => file.replace(/\.html$/, ".txt")), "payment-acceptance-service.txt", "guides.txt", "guides/stripe-alternatives.txt", "guides/payment-processing-systems.txt", "guides/what-is-a-chargeback.txt", "guides/how-to-create-a-payment-link.txt", "404.html", "robots.txt", "sitemap.xml", "opengraph-image", "brand/networks/visa-blue.svg", "_next/static/chunks/app.js"]) expect(forbiddenStatic(path), path).toBe(false);
  });

  it("requires one all-path edge boundary before cache, without method or path exclusions", () => {
    const entry = { function: "public-boundary", pattern: "^/.*$", excluded_patterns: [] };
    expect(edgeEntryFindings([entry])).toEqual([]);
    expect(edgeEntryFindings(undefined)).toContain("INVALID_EDGE_ENTRIES");
    expect(edgeEntryFindings([])).toContain("UNEXPECTED_EDGE_ENTRY_COUNT");
    expect(edgeEntryFindings([entry, entry])).toContain("UNEXPECTED_EDGE_ENTRY_COUNT");
    expect(edgeEntryFindings([{ ...entry, function: "old-account-api" }])).toContain("UNEXPECTED_EDGE_HANDLER");
    for (const pattern of ["/.*", "^/api/.*$", "^/(?!_next).*", "^/$"]) expect(edgeEntryFindings([{ ...entry, pattern }])).toContain("UNEXPECTED_EDGE_PATTERN");
    for (const restriction of [{ methods: ["GET"] }, { methods: [] }, { method: "GET" }, { path: "/api/*" }, { excluded_patterns: ["^/api/.*$"] }, { excludedPattern: "^/robots.txt$" }, { excluded_patterns: "" }]) {
      expect(edgeEntryFindings([{ ...entry, ...restriction }])).toContain("RESTRICTED_BOUNDARY_COVERAGE");
    }
  });
});
