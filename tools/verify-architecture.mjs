#!/usr/bin/env node
/** Public website boundary. Archived financial records are never active application inputs. */
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const relative = filename => path.relative(root, filename).split(path.sep).join("/");
const failures = [];
const publicPages = ["page.tsx", "card-services/page.tsx", "payment-services/page.tsx", "help/page.tsx", "privacy/page.tsx", "terms/page.tsx"];
const infrastructure = new Set(["layout.tsx", "not-found.tsx", "error.tsx", "global-error.tsx", "robots.ts", "sitemap.ts", "opengraph-image.tsx"]);
const publicPackages = new Set(["next", "react", "react-dom"]);
const retiredFamilies = ["api", "checkout", "pay", "payments", "cardholder-services", "cards", "merchant-services", "merchants", "login", "profile", "security", "shared-access", "invitations", "operations", "money-accounts", "accounts", "services"];
const serverHandler = "___netlify-server-handler";
const edgeHandler = "___netlify-edge-handler-node-middleware";
const adapterGenerator = "@netlify/plugin-nextjs@5.15.13";
function fail(filename, code) { failures.push(`${filename}: ${code}`); }
function files(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) { fail(relative(filename), "SYMLINK_IN_ACTIVE_SOURCE"); return []; }
    return entry.isDirectory() ? files(filename) : entry.isFile() ? [filename] : [];
  });
}
function publicSourcePath(filename) {
  return filename === "src/proxy.ts" || filename.startsWith("src/app/") || filename.startsWith("src/ui/") ||
    filename.startsWith("src/shared/") || filename.startsWith("src/modules/public-site/");
}
function forbiddenArtifact(filename) {
  const normalized = filename.replaceAll("\\", "/");
  return /(?:^|\/)(?:\.env(?:\.[^/]*)?|\.local|\.git)(?:\/|$)/.test(normalized) ||
    /(?:^|\/)archive(?:\/|$)/.test(normalized) || /(?:^|\/)netlify\/database(?:\/|$)/.test(normalized) ||
    /(?:^|\/)src\/platform(?:\/|$)/.test(normalized) ||
    /(?:^|\/)src\/modules\/(?!public-site(?:\/|$))/.test(normalized) ||
    /(?:^|\/)node_modules\/(?:pg|drizzle-orm|@netlify\/(?:database|identity))(?:\/|$)/.test(normalized) ||
    /(?:^|\/)node_modules\/\.pnpm\/(?:pg|drizzle-orm|@netlify\+(?:database|identity))@/.test(normalized);
}
function forbiddenStatic(filename) {
  const normalized = filename.replaceAll("\\", "/");
  return forbiddenArtifact(normalized) || /\.(?:sql|sqlite|sqlite3|db|dump)$/i.test(normalized) ||
    retiredFamilies.some(family => normalized === family || normalized.startsWith(`${family}/`) || normalized === `${family}.html`);
}
function edgeEntryFindings(entries, checkGenerator = true) {
  if (!Array.isArray(entries)) return ["INVALID_EDGE_ENTRIES"];
  const issues = [];
  if (entries.length !== retiredFamilies.length) issues.push("UNEXPECTED_EDGE_ENTRY_COUNT");
  if (new Set(entries.map(entry => entry.pattern)).size !== retiredFamilies.length) issues.push("DUPLICATE_OR_MISSING_EDGE_PATTERNS");
  const expressions = [];
  for (const entry of entries) {
    if (entry.function !== edgeHandler) issues.push("UNEXPECTED_EDGE_HANDLER");
    if (checkGenerator && entry.generator !== adapterGenerator) issues.push("UNEXPECTED_EDGE_GENERATOR");
    if (entry.excluded_patterns?.length || entry.excludedPattern || entry.methods?.length) issues.push("RESTRICTED_RETIREMENT_COVERAGE");
    try {
      if (typeof entry.pattern !== "string" || !entry.pattern.startsWith("^") || !entry.pattern.endsWith("$")) throw new Error("Unbounded edge pattern");
      expressions.push(new RegExp(entry.pattern));
    } catch { issues.push("INVALID_EDGE_PATTERN"); }
  }
  for (const family of retiredFamilies) {
    // Adapter expressions match URL pathnames; query handling is exercised by browser tests.
    for (const suffix of ["", "/", "/resource", "/resource/nested"]) {
      if (expressions.filter(expression => expression.test(`/${family}${suffix}`)).length !== 1) issues.push("MISSING_OR_OVERLAPPING_RETIRED_ROUTE");
    }
  }
  for (const pathname of ["/", "/card-services", "/payment-services", "/help", "/privacy", "/terms", "/unrelated", ...retiredFamilies.map(family => `/${family}-unrelated`)]) {
    if (expressions.some(expression => expression.test(pathname))) issues.push("EDGE_MATCHES_PUBLIC_OR_UNRELATED_ROUTE");
  }
  return [...new Set(issues)];
}
function sourceChecks(filename, source) {
  const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, filename.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function inspect(node) {
    if (ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression) && node.expression.text === "use server") fail(filename, "SERVER_ACTION_NOT_ALLOWED");
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const specifier = node.moduleSpecifier;
      if (specifier && ts.isStringLiteral(specifier)) {
        const name = specifier.text;
        if (!name.startsWith(".") && !name.startsWith("@/") && !["next", "react", "react-dom"].some(pkg => name === pkg || name.startsWith(`${pkg}/`))) fail(filename, "NON_PUBLIC_RUNTIME_IMPORT");
        if (name === "next/headers") fail(filename, "PRIVATE_REQUEST_STATE_IMPORT");
        if (name.startsWith("@/") && !publicSourcePath(`src/${name.slice(2)}`)) fail(filename, "PRIVATE_SOURCE_IMPORT");
        if (name.startsWith(".")) {
          const resolved = relative(path.resolve(root, path.dirname(filename), name));
          if (!publicSourcePath(resolved) && resolved !== "project-targets.json") fail(filename, "IMPORT_OUTSIDE_PUBLIC_SOURCE");
        }
      }
    }
    if (ts.isCallExpression(node)) {
      const callee = node.expression.getText(tree);
      if (["fetch", "require", "eval"].includes(callee) || node.expression.kind === ts.SyntaxKind.ImportKeyword) fail(filename, "RUNTIME_IO_OR_DYNAMIC_CODE");
    }
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(tree) === "form") fail(filename, "LOCAL_ACCOUNT_OR_PAYMENT_FORM");
    ts.forEachChild(node, inspect);
  }
  inspect(tree);
}

assert.equal(publicSourcePath("src/proxy.ts"), true);
assert.equal(publicSourcePath("src/modules/identity/service.ts"), false);
for (const unsafe of [".env", "server/.env.production", ".local/keys.json", "archive/database/migration.sql", "src/modules/identity/session.ts", "netlify/database/migrations/a.sql", "node_modules/pg/lib/index.js", "node_modules/drizzle-orm/index.js", "node_modules/@netlify/database/index.js", "node_modules/.pnpm/@netlify+identity@1.0.0/index.js"]) assert.equal(forbiddenArtifact(unsafe), true);
assert.equal(forbiddenArtifact("node_modules/next/dist/server/config.js"), false);
assert.equal(forbiddenArtifact("node_modules/@netlify/blobs/dist/main.js"), false);
assert.equal(forbiddenStatic("archive/database/migration.sql"), true);
assert.equal(forbiddenStatic("cardholder-services/index.html"), true);
assert.equal(forbiddenStatic("brand/networks/visa.svg"), false);
const validEdges = retiredFamilies.map(family => ({ function: edgeHandler, generator: adapterGenerator, pattern: `^/${family}(?:/[^?]*)?(?:\\?.*)?$` }));
assert.deepEqual(edgeEntryFindings(validEdges), []);
assert.ok(edgeEntryFindings([]).includes("UNEXPECTED_EDGE_ENTRY_COUNT"));
assert.ok(edgeEntryFindings(validEdges.map((entry, index) => index ? entry : { ...entry, function: "old-account-api" })).includes("UNEXPECTED_EDGE_HANDLER"));
assert.ok(edgeEntryFindings(validEdges.map((entry, index) => index ? entry : { ...entry, pattern: "^/.*$" })).includes("EDGE_MATCHES_PUBLIC_OR_UNRELATED_ROUTE"));
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
for (const entry of ["src/platform", "src/app/api", "netlify/database", "netlify/functions", "netlify/edge-functions", "drizzle.config.ts", "playwright.email.config.ts"]) {
  if (existsSync(path.join(root, entry))) fail(entry, "RETIRED_RUNTIME_PATH");
}
for (const page of publicPages) if (!existsSync(path.join(root, "src/app", page))) fail(`src/app/${page}`, "MISSING_PUBLIC_PAGE");
const sources = files(path.join(root, "src"));
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
  const appManifest = path.join(nextRoot, "server/app-paths-manifest.json");
  if (!existsSync(appManifest)) throw new Error("Build the public website before checking deployment artifacts.");
  const routes = Object.keys(JSON.parse(readFileSync(appManifest, "utf8")));
  const expected = new Set(["/page", "/card-services/page", "/payment-services/page", "/help/page", "/privacy/page", "/terms/page", "/robots.txt/route", "/sitemap.xml/route", "/opengraph-image/route", "/_not-found/page", "/_global-error/page"]);
  for (const route of routes) if (!expected.has(route)) fail(".next/server/app-paths-manifest.json", `UNEXPECTED_BUILT_ROUTE ${route}`);
  for (const page of publicPages) {
    const route = `/${page.replace(/\.tsx$/, "")}`;
    if (!routes.includes(route)) fail(".next/server/app-paths-manifest.json", `MISSING_BUILT_ROUTE ${route}`);
  }
  const nextFiles = files(path.join(nextRoot, "server"));
  for (const filename of nextFiles) if (forbiddenArtifact(relative(filename))) fail(relative(filename), "PRIVATE_OR_ARCHIVED_SERVER_FILE");
  for (const filename of nextFiles.filter(file => file.endsWith(".nft.json"))) {
    const trace = JSON.parse(readFileSync(filename, "utf8"));
    for (const traced of trace.files ?? []) {
      if (forbiddenArtifact(relative(path.resolve(path.dirname(filename), traced)))) fail(relative(filename), "PRIVATE_OR_ARCHIVED_TRACE_INPUT");
    }
  }
  let staticFiles = 0;
  for (const directory of ["public", ".next/static", ".netlify/static"]) {
    const base = path.join(root, directory);
    for (const filename of files(base)) {
      staticFiles++;
      if (forbiddenStatic(path.relative(base, filename))) fail(relative(filename), "PRIVATE_OR_ARCHIVED_STATIC_FILE");
    }
  }
  // Read ZIP entry names only. Never open archived file contents or environment values.
  const functionRoot = path.join(root, ".netlify/functions");
  const functionManifestPath = path.join(functionRoot, "manifest.json");
  if (!existsSync(functionManifestPath)) throw new Error("Package the public website with Netlify before checking deployment artifacts.");
  const functionManifest = JSON.parse(readFileSync(functionManifestPath, "utf8"));
  const expectedArchive = path.join(functionRoot, `${serverHandler}.zip`);
  assert.equal(functionManifest.version, 1, "Unexpected server function manifest version.");
  assert.equal(functionManifest.functions?.length, 1, "Only the Next.js server handler may be packaged.");
  const handler = functionManifest.functions[0];
  assert.equal(handler.name, serverHandler, "Unexpected server function.");
  assert.equal(handler.generator, adapterGenerator, "Unexpected server function generator.");
  assert.equal(path.resolve(handler.path), expectedArchive, "Server function archive must be inside the bound build directory.");
  assert.equal(handler.runtime, "js", "Unexpected server function runtime.");
  const internalRoot = path.join(root, ".netlify/functions-internal");
  assert.deepEqual(readdirSync(internalRoot), [serverHandler], "Unexpected generated server function source.");
  assert.equal(path.resolve(handler.mainFile), path.join(internalRoot, serverHandler, `${serverHandler}.mjs`), "Unexpected server entrypoint.");
  assert.ok(statSync(handler.mainFile).isFile(), "Server entrypoint must exist.");
  const archives = files(functionRoot).filter(filename => filename.endsWith(".zip"));
  assert.deepEqual(archives, [expectedArchive], "Exactly one expected server function archive is required.");
  assert.ok(statSync(expectedArchive).size > 0, "Server function archive is empty.");
  let entries = 0;
  for (const filename of archives) {
    const bytes = readFileSync(filename);
    let end = -1;
    for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset--) {
      if (bytes.readUInt32LE(offset) === 0x06054b50) { end = offset; break; }
    }
    if (end < 0) throw new Error("Invalid function archive directory.");
    const count = bytes.readUInt16LE(end + 10);
    assert.ok(count > 0, "Server function archive must contain files.");
    let cursor = bytes.readUInt32LE(end + 16);
    if (count === 0xffff || cursor === 0xffffffff) throw new Error("ZIP64 artifact review requires an explicit compatible reader.");
    for (let index = 0; index < count; index++) {
      assert.equal(bytes.readUInt32LE(cursor), 0x02014b50);
      const nameLength = bytes.readUInt16LE(cursor + 28);
      const extraLength = bytes.readUInt16LE(cursor + 30);
      const commentLength = bytes.readUInt16LE(cursor + 32);
      const name = bytes.toString("utf8", cursor + 46, cursor + 46 + nameLength);
      if (forbiddenArtifact(name)) fail(relative(filename), "PRIVATE_OR_ARCHIVED_ZIP_ENTRY");
      cursor += 46 + nameLength + extraLength + commentLength;
      entries++;
    }
  }
  const edgeRoot = path.join(root, ".netlify/edge-functions");
  const edgeManifest = JSON.parse(readFileSync(path.join(edgeRoot, "manifest.json"), "utf8"));
  assert.equal(edgeManifest.version, 1, "Unexpected edge function manifest version.");
  for (const issue of edgeEntryFindings(edgeManifest.functions)) fail(".netlify/edge-functions/manifest.json", issue);
  for (const entry of readdirSync(edgeRoot)) {
    if (!["manifest.json", ".vendor", edgeHandler].includes(entry)) fail(".netlify/edge-functions", "UNEXPECTED_EDGE_SOURCE_ENTRY");
  }
  const distRoot = path.join(root, ".netlify/edge-functions-dist");
  const edgeDist = JSON.parse(readFileSync(path.join(distRoot, "manifest.json"), "utf8"));
  for (const issue of edgeEntryFindings(edgeDist.routes, false)) fail(".netlify/edge-functions-dist/manifest.json", issue);
  assert.deepEqual(edgeDist.post_cache_routes, [], "Retirement responses must not execute after cache lookup.");
  assert.deepEqual(Object.keys(edgeDist.function_config), [edgeHandler], "Unexpected bundled edge function.");
  assert.equal(edgeDist.bundles?.length, 1, "Exactly one proxy edge bundle is required.");
  const bundle = edgeDist.bundles[0];
  assert.equal(bundle.format, "eszip2", "Unexpected edge bundle format.");
  assert.match(bundle.asset, /^[a-f0-9]{64}\.eszip$/, "Edge bundle must use a generated local asset name.");
  assert.ok(statSync(path.join(distRoot, bundle.asset)).size > 0, "Edge bundle is empty.");
  assert.deepEqual(readdirSync(distRoot).sort(), [bundle.asset, "manifest.json"].sort(), "Unexpected edge distribution artifact.");
  // Server dependency symlinks are normal in the intermediate pnpm tree; inspect its final ZIP instead.
  for (const filename of files(edgeRoot)) if (forbiddenArtifact(relative(filename))) fail(relative(filename), "PRIVATE_OR_ARCHIVED_FUNCTION_SOURCE");
  console.log(`Artifact boundary checked ${routes.length} built routes, ${archives.length} server archive, ${entries} ZIP entry names, ${edgeManifest.functions.length} proxy routes and ${staticFiles} public/static files.`);
}
if (failures.length) {
  for (const failure of [...new Set(failures)]) console.error(failure);
  process.exitCode = 1;
} else console.log(`Public architecture checks passed: ${sources.length} source files; six public pages; no local account, payment, database or custom function runtime.`);
