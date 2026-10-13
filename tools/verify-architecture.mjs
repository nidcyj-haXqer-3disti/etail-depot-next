#!/usr/bin/env node
/** Public website boundary. Archived financial records are never active application inputs. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { boundarySource, edgeEntryFindings, edgeHandler, forbiddenArtifact, forbiddenStatic, publicSourcePath, retiredFamilies } from "./public-artifact-policy.ts";
import { isApprovedSearchRelease, PUBLIC_INDEXING_APPROVAL } from "../src/shared/public-release.ts";
import { publicSourceFingerprint } from "./public-source.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const relative = filename => path.relative(root, filename).split(path.sep).join("/");
const failures = [];
const publicPages = ["page.tsx", "card-services/page.tsx", "payment-services/page.tsx", "help/page.tsx", "privacy/page.tsx", "terms/page.tsx"];
const infrastructure = new Set(["layout.tsx", "not-found.tsx", "error.tsx", "global-error.tsx", "robots.ts", "sitemap.ts", "opengraph-image.tsx"]);
const publicPackages = new Set(["next", "react", "react-dom"]);
function fail(filename, code) { failures.push(`${filename}: ${code}`); }
function files(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) { fail(relative(filename), "SYMLINK_IN_ACTIVE_SOURCE"); return []; }
    return entry.isDirectory() ? files(filename) : entry.isFile() ? [filename] : [];
  });
}
function sourceChecks(filename, source) {
  const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, filename.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function inspect(node) {
    if (ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression) && node.expression.text === "use server") fail(filename, "SERVER_ACTION_NOT_ALLOWED");
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const specifier = node.moduleSpecifier;
      if (specifier && ts.isStringLiteral(specifier)) {
        const name = specifier.text;
        if (filename === boundarySource && !["../../src/shared/public-routes.ts", "../../src/shared/public-release.ts"].includes(name)) fail(filename, "UNREVIEWED_EDGE_RUNTIME_IMPORT");
        if (!name.startsWith(".") && !name.startsWith("@/") && !["next", "react", "react-dom"].some(pkg => name === pkg || name.startsWith(`${pkg}/`))) fail(filename, "NON_PUBLIC_RUNTIME_IMPORT");
        if (name === "next/headers") fail(filename, "PRIVATE_REQUEST_STATE_IMPORT");
        if (name.startsWith("@/") && !publicSourcePath(path.posix.normalize(`src/${name.slice(2)}`))) fail(filename, "PRIVATE_SOURCE_IMPORT");
        if (name.startsWith(".")) {
          const resolved = relative(path.resolve(root, path.dirname(filename), name));
          if (!publicSourcePath(resolved) && resolved !== "project-targets.json") fail(filename, "IMPORT_OUTSIDE_PUBLIC_SOURCE");
        }
      }
    }
    if (ts.isCallExpression(node)) {
      const callee = node.expression.getText(tree);
      if (["fetch", "require", "eval"].includes(callee) || node.expression.kind === ts.SyntaxKind.ImportKeyword) fail(filename, "RUNTIME_IO_OR_DYNAMIC_CODE");
      if (filename === boundarySource && /^request\.(?:arrayBuffer|blob|formData|json|text)$/.test(callee)) fail(filename, "RETIRED_REQUEST_BODY_READ");
    }
    if (filename === boundarySource && ts.isPropertyAccessExpression(node) && node.getText(tree) === "request.body") fail(filename, "RETIRED_REQUEST_BODY_READ");
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(tree) === "form") fail(filename, "LOCAL_ACCOUNT_OR_PAYMENT_FORM");
    ts.forEachChild(node, inspect);
  }
  inspect(tree);
}

assert.equal(publicSourcePath(boundarySource), true);
assert.equal(publicSourcePath("src/proxy.ts"), false);
assert.equal(publicSourcePath("src/modules/identity/service.ts"), false);
for (const unsafe of [".env", "server/.env.production", ".local/keys.json", "archive/database/migration.sql", "src/modules/identity/session.ts", "netlify/database/migrations/a.sql", "node_modules/pg/lib/index.js", "node_modules/drizzle-orm/index.js", "node_modules/@netlify/database/index.js", "node_modules/.pnpm/@netlify+identity@1.0.0/index.js", "node_modules/braces/lib/parse.js", "node_modules/node-forge/lib/rsa.js", "node_modules/@netlify/plugin-nextjs/dist/run.js"]) assert.equal(forbiddenArtifact(unsafe), true);
assert.equal(forbiddenStatic("archive/database/migration.sql"), true);
assert.equal(forbiddenStatic("cardholder-services/index.html"), true);
assert.equal(forbiddenStatic("brand/networks/visa.svg"), false);
const validEdges = [{ function: edgeHandler, pattern: "^/.*$", excluded_patterns: [] }];
assert.deepEqual(edgeEntryFindings(validEdges), []);
assert.ok(edgeEntryFindings([]).includes("UNEXPECTED_EDGE_ENTRY_COUNT"));
assert.ok(edgeEntryFindings([{ ...validEdges[0], function: "old-account-api" }]).includes("UNEXPECTED_EDGE_HANDLER"));
assert.ok(edgeEntryFindings([{ ...validEdges[0], methods: ["GET"] }]).includes("RESTRICTED_BOUNDARY_COVERAGE"));
assert.ok(edgeEntryFindings([{ ...validEdges[0], pattern: "^/api/.*$" }]).includes("UNEXPECTED_EDGE_PATTERN"));
sourceChecks(boundarySource, 'import { NextResponse } from "next/server"; request.text();');
assert.deepEqual(failures.splice(0), [`${boundarySource}: UNREVIEWED_EDGE_RUNTIME_IMPORT`, `${boundarySource}: RETIRED_REQUEST_BODY_READ`]);
sourceChecks("src/ui/example.tsx", 'import secret from "@/shared/../../archive/records";');
assert.deepEqual(failures.splice(0), ["src/ui/example.tsx: PRIVATE_SOURCE_IMPORT"]);
if (process.argv.includes("--self-test")) {
  console.log("Public boundary path and artifact detector self-tests passed.");
  process.exit(0);
}

const targets = JSON.parse(readFileSync(path.join(root, "project-targets.json"), "utf8"));
assert.equal(targets.project_key, "ETAIL_DEPOT_NEXT_GREENFIELD_2026");
assert.equal(targets.github.repository_id, 1361184741);
assert.equal(targets.netlify.site_id, "cbbb6c24-9dbc-43a2-9234-e4357b5b5280");
assert.equal(targets.netlify.canonical_origin, "https://etail-depot-next.netlify.app");
assert.equal(targets.release.real_money_allowed, false);
assert.equal(targets.denied.netlify_site_ids.includes(targets.netlify.site_id), false);
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
assert.deepEqual(Object.keys(manifest.dependencies).sort(), [...publicPackages].sort());
for (const entry of ["src/platform", "src/app/api", "netlify/database", "netlify/functions", "src/proxy.ts", "drizzle.config.ts", "playwright.email.config.ts"]) {
  if (existsSync(path.join(root, entry))) fail(entry, "RETIRED_RUNTIME_PATH");
}
for (const page of publicPages) if (!existsSync(path.join(root, "src/app", page))) fail(`src/app/${page}`, "MISSING_PUBLIC_PAGE");
const sources = [...files(path.join(root, "src")), ...files(path.join(root, "netlify/edge-functions"))];
if (!existsSync(path.join(root, boundarySource))) fail(boundarySource, "MISSING_PUBLIC_BOUNDARY");
for (const filename of sources) {
  const name = relative(filename);
  if (!publicSourcePath(name)) fail(name, "NON_PUBLIC_SOURCE_PATH");
  if (name.startsWith("src/app/") && /\.[cm]?[jt]sx?$/.test(name)) {
    const appPath = name.slice("src/app/".length);
    if (!publicPages.includes(appPath) && !infrastructure.has(appPath)) fail(name, "UNREVIEWED_ROUTE_OR_APP_MODULE");
  }
  if (/\.[cm]?[jt]sx?$/.test(name)) sourceChecks(name, readFileSync(filename, "utf8"));
}

if (process.argv.includes("--artifacts")) {
  const nextRoot = path.join(root, ".next");
  const buildRecord = JSON.parse(readFileSync(path.join(nextRoot, "public-build.json"), "utf8"));
  const packageRecord = JSON.parse(readFileSync(path.join(root, ".netlify/public-build.json"), "utf8"));
  assert.equal(buildRecord.schemaVersion, 1, "Unexpected public build record format.");
  assert.equal(buildRecord.fingerprint, publicSourceFingerprint(root), "The exported package is stale; rebuild the current candidate.");
  assert.equal(buildRecord.indexingEnabled, isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, buildRecord.buildEnvironment), "Recorded search approval must match the unchanged guard.");
  assert.deepEqual(packageRecord, buildRecord, "The package must preserve the reviewed source and search-environment identity.");
  const appManifest = path.join(nextRoot, "server/app-paths-manifest.json");
  if (!existsSync(appManifest)) throw new Error("Build the public static website before checking deployment artifacts.");
  const routes = Object.keys(JSON.parse(readFileSync(appManifest, "utf8")));
  const expected = new Set(["/page", "/card-services/page", "/payment-services/page", "/help/page", "/privacy/page", "/terms/page", "/robots.txt/route", "/sitemap.xml/route", "/opengraph-image/route", "/_not-found/page", "/_global-error/page"]);
  for (const route of routes) if (!expected.has(route)) fail(".next/server/app-paths-manifest.json", `UNEXPECTED_BUILT_ROUTE ${route}`);
  for (const page of publicPages) {
    const route = `/${page.replace(/\.tsx$/, "")}`;
    if (!routes.includes(route)) fail(".next/server/app-paths-manifest.json", `MISSING_BUILT_ROUTE ${route}`);
  }
  // Compiler output is not shipped, but its route/trace boundary still must not include old application data.
  const nextFiles = files(path.join(nextRoot, "server"));
  for (const filename of nextFiles) if (forbiddenArtifact(relative(filename))) fail(relative(filename), "PRIVATE_OR_ARCHIVED_SERVER_FILE");
  for (const filename of nextFiles.filter(file => file.endsWith(".nft.json"))) {
    const trace = JSON.parse(readFileSync(filename, "utf8"));
    for (const traced of trace.files ?? []) {
      if (forbiddenArtifact(relative(path.resolve(path.dirname(filename), traced)))) fail(relative(filename), "PRIVATE_OR_ARCHIVED_TRACE_INPUT");
    }
  }

  const exportRoot = path.join(root, "out");
  const staticRoot = path.join(root, ".netlify/static");
  if (!existsSync(exportRoot) || !existsSync(staticRoot)) throw new Error("Export and package the static website before checking deployment artifacts.");
  const exportFiles = files(exportRoot);
  const staticFiles = files(staticRoot);
  const digest = filename => createHash("sha256").update(readFileSync(filename)).digest("hex");
  const exportNames = exportFiles.map(filename => path.relative(exportRoot, filename).split(path.sep).join("/")).sort();
  const staticNames = staticFiles.map(filename => path.relative(staticRoot, filename).split(path.sep).join("/")).sort();
  assert.deepEqual(staticNames, [...exportNames, "_headers"].sort(), "Only the exact static export and reviewed security headers may be published.");
  for (const name of exportNames) assert.equal(digest(path.join(exportRoot, name)), digest(path.join(staticRoot, name)), `Static file changed during packaging: ${name}`);
  for (const directory of ["public", "out", ".next/static", ".netlify/static"]) {
    const base = path.join(root, directory);
    for (const filename of files(base)) if (forbiddenStatic(path.relative(base, filename))) fail(relative(filename), "PRIVATE_OR_ARCHIVED_STATIC_FILE");
  }
  const publicHtml = ["index.html", "card-services.html", "payment-services.html", "help.html", "privacy.html", "terms.html"];
  const allowedHtml = new Set([...publicHtml, "404.html", "_not-found.html", "_global-error.html"]);
  for (const name of staticNames.filter(filename => filename.endsWith(".html"))) if (!allowedHtml.has(name)) fail(name, "UNEXPECTED_STATIC_PAGE");
  for (const name of [...publicHtml, "404.html", "robots.txt", "sitemap.xml", "opengraph-image"]) {
    const filename = path.join(staticRoot, name);
    assert.ok(existsSync(filename) && statSync(filename).isFile() && statSync(filename).size > 0, `Missing required public export: ${name}`);
  }
  assert.match(readFileSync(path.join(staticRoot, "404.html"), "utf8"), /Page not found/, "The real static 404 must retain the branded page.");
  assert.deepEqual(readFileSync(path.join(staticRoot, "opengraph-image")).subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), "Open Graph URL must serve the generated PNG.");
  const headers = readFileSync(path.join(staticRoot, "_headers"), "utf8");
  assert.match(headers, /^\/\*\s*$/m, "Security headers must cover all static paths.");
  for (const header of ["X-Content-Type-Options: nosniff", "X-Frame-Options: DENY", "Referrer-Policy: no-referrer", "Permissions-Policy: camera=(), microphone=(), geolocation=()"]) {
    assert.ok(headers.includes(header), `Missing static security header: ${header}`);
  }
  assert.ok(staticNames.some(name => name.startsWith("_next/static/") && name.endsWith(".js")), "Client interaction assets are missing.");

  // A static release must not carry a server function, an adapter source tree, or an old generated proxy.
  for (const name of [".netlify/functions", ".netlify/functions-internal", ".netlify/dist", ".netlify/edge-functions"]) {
    if (existsSync(path.join(root, name))) fail(name, "UNEXPECTED_SERVER_OR_ADAPTER_ARTIFACT");
  }
  const distRoot = path.join(root, ".netlify/edge-functions-dist");
  const edgeDist = JSON.parse(readFileSync(path.join(distRoot, "manifest.json"), "utf8"));
  for (const issue of edgeEntryFindings(edgeDist.routes)) fail(".netlify/edge-functions-dist/manifest.json", issue);
  assert.deepEqual(edgeDist.post_cache_routes, [], "The public boundary must execute before cache lookup.");
  assert.deepEqual(edgeDist.layers, [], "Additional runtime layers are not permitted.");
  assert.deepEqual(Object.keys(edgeDist.function_config), [edgeHandler], "Exactly one reviewed public edge boundary is permitted.");
  assert.equal(edgeDist.function_config[edgeHandler].on_error, "fail", "Boundary errors must fail closed rather than bypass request protection.");
  assert.equal(edgeDist.bundles?.length, 1, "Exactly one public-boundary edge bundle is required.");
  const bundle = edgeDist.bundles[0];
  assert.equal(bundle.format, "eszip2", "Unexpected edge bundle format.");
  assert.match(bundle.asset, /^[a-f0-9]{64}\.eszip$/, "Edge bundle must use a generated local asset name.");
  const bundlePath = path.join(distRoot, bundle.asset);
  const bundleBytes = readFileSync(bundlePath);
  assert.ok(bundleBytes.length > 0, "Edge bundle is empty.");
  assert.equal(digest(bundlePath), bundle.asset.slice(0, -6), "Edge bundle filename must match its content hash.");
  assert.equal(bundleBytes.subarray(0, 8).toString("ascii"), "ESZIP_V2", "Unexpected edge archive format.");
  assert.deepEqual(readdirSync(distRoot).sort(), [bundle.asset, "manifest.json"].sort(), "Unexpected edge distribution artifact.");
  const bundleText = bundleBytes.toString("utf8");
  if (forbiddenArtifact(bundleText)) fail(relative(bundlePath), "PRIVATE_OR_RETIRED_DEPENDENCY_IN_EDGE_BUNDLE");
  for (const signature of ["___netlify-server-handler", "___netlify-edge-handler-node-middleware", "@netlify/plugin-nextjs"]) {
    if (bundleText.includes(signature)) fail(relative(bundlePath), "RETIRED_ADAPTER_IN_EDGE_BUNDLE");
  }
  console.log(`Artifact boundary checked ${routes.length} compiler routes, ${publicHtml.length} static pages, ${staticNames.length} static files, one public edge boundary covering ${retiredFamilies.length} retired families, and zero server functions.`);
}

if (failures.length) {
  for (const failure of [...new Set(failures)]) console.error(failure);
  process.exitCode = 1;
} else console.log(`Public architecture checks passed: ${sources.length} source files; six public pages; no local account, payment, database or server-function runtime.`);
