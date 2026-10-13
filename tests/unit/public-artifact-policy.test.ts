import { describe, expect, it } from "vitest";
import { boundarySource, edgeEntryFindings, forbiddenArtifact, forbiddenStatic, publicSourcePath, retiredFamilies } from "../../tools/public-artifact-policy";

describe("static public deployment boundary", () => {
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
    for (const path of ["records.db", "backup.SQL", "src/app/page.tsx", "node_modules/next/package.json", ".next/server/page.js", "functions/server.js", "server.zip", "edge.eszip"]) expect(forbiddenStatic(path), path).toBe(true);
    for (const path of ["index.html", "card-services.html", "payment-services.txt", "404.html", "robots.txt", "sitemap.xml", "opengraph-image", "brand/networks/visa-blue.svg", "_next/static/chunks/app.js"]) expect(forbiddenStatic(path), path).toBe(false);
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
