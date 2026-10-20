/** Reproduce the approved Guides review without changing the production application. */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, symlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectPreviewAssets, sha256 } from "./preview-assets.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const inputsPath = path.join(root, "review/guides/manifest.json");
const inputs = JSON.parse(readFileSync(inputsPath, "utf8"));
const destination = path.join(root, "artifacts/guides-review");
const site = path.join(destination, "site");
const output = path.join(site, "out");
const files = new Map();

function safeFile(directory, relative) {
  assert.match(relative, /^[a-zA-Z0-9_./-]+$/);
  assert.ok(!relative.startsWith("/") && !relative.split("/").some(part => !part || part === "." || part === ".."));
  let current = directory;
  for (const part of relative.split("/")) {
    current = path.join(current, part);
    assert.ok(!lstatSync(current).isSymbolicLink(), `Unexpected source symlink: ${relative}`);
  }
  assert.ok(lstatSync(current).isFile());
  return current;
}

assert.equal(process.version, "v24.19.0");
assert.equal(inputs.schemaVersion, 1);
assert.equal(inputs.baselineCommit, "2097a2da9660cb537ee061d25aeac6e9816ea419");
assert.equal(inputs.overrides.length, 29);
assert.equal(inputs.pagePaths.length, 27);
assert.equal(inputs.guidePaths.length, 20);
assert.equal(new Set(inputs.pagePaths).size, inputs.pagePaths.length);

for (const entry of inputs.baselineFiles) {
  assert.ok(entry.path.startsWith("src/") || entry.path.startsWith("public/") ||
    ["package.json", "project-targets.json", "tsconfig.json", "next.config.ts", "next-env.d.ts"].includes(entry.path));
  assert.ok(!files.has(entry.path), "Duplicate baseline input");
  const bytes = readFileSync(safeFile(root, entry.path));
  assert.equal(sha256(bytes), entry.sha256, `Baseline changed: ${entry.path}`);
  files.set(entry.path, bytes);
}
for (const entry of inputs.overrides) {
  assert.ok(entry.path.startsWith("src/"), "Only reviewed source overrides are permitted");
  const bytes = readFileSync(safeFile(path.join(root, "review/guides/overrides"), entry.path));
  assert.equal(sha256(bytes), entry.sha256, `Review input changed: ${entry.path}`);
  files.set(entry.path, bytes);
}
assert.match(files.get("src/modules/public-site/metadata.ts").toString(), /return false; \/\/ D324 private snapshot/);
const packageJson = JSON.parse(files.get("package.json"));
assert.equal(packageJson.packageManager, "pnpm@11.19.0");
assert.equal(packageJson.dependencies.next, "16.3.8");
assert.equal(packageJson.dependencies.react, "19.2.8");
assert.equal(JSON.parse(readFileSync(path.join(root, "node_modules/next/package.json"))).version, "16.3.8");
assert.equal(JSON.parse(readFileSync(path.join(root, "node_modules/react/package.json"))).version, "19.2.8");
if (process.argv.includes("--check")) {
  console.log(`Verified ${inputs.baselineFiles.length} baseline inputs and ${inputs.overrides.length} exact review overrides.`);
  process.exit(0);
}
assert.ok(!existsSync(destination), "Review output already exists. Preserve it or remove only artifacts/guides-review before rebuilding.");
for (const [relative, bytes] of files) {
  const target = path.join(site, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, bytes);
}
// Scope the temporary build to its source. The root TypeScript checks stay unchanged.
const tsconfig = JSON.parse(files.get("tsconfig.json"));
tsconfig.include = inputs.isolatedTsconfigInclude;
writeFileSync(path.join(site, "tsconfig.json"), JSON.stringify(tsconfig, null, 2) + "\n");
symlinkSync(path.join(root, "node_modules"), path.join(site, "node_modules"), "dir");
const build = spawnSync(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
  cwd: site,
  stdio: "inherit",
  env: {
    ...process.env, NEXT_TELEMETRY_DISABLED: "1", NODE_ENV: "production", CONTEXT: "dev",
    SITE_ID: "", ETAIL_PUBLIC_INDEXING_APPROVAL: "", ETAIL_PUBLIC_INDEXING_ORIGIN: "",
  },
});
assert.equal(build.status, 0, "Isolated review build failed");
const routes = Object.fromEntries(inputs.pagePaths.map(route => [route, route === "/" ? "index.html" : `${route.slice(1)}.html`]));
const navigation = new Set(inputs.pagePaths.flatMap(route => {
  const stem = route === "/" ? "" : route.slice(1);
  const prefix = stem ? `${stem}/` : "";
  return [
    (stem || "index") + ".txt", prefix + "__next._tree.txt", prefix + "__next._full.txt",
    prefix + "__next." + (stem ? stem.replaceAll("/", ".") + "." : "") + "__PAGE__.txt",
  ];
}));
function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    assert.ok(!entry.isSymbolicLink(), "Unexpected export symlink");
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
for (const file of walk(output)) {
  const relative = path.relative(output, file).split(path.sep).join("/");
  if ((relative.startsWith("_next/static/") && !relative.endsWith(".map") &&
    !/\/app\/(?:sitemap\.xml|robots\.txt)\//.test(relative)) || navigation.has(relative)) {
    routes[`/${relative}`] = relative;
  }
}
for (const asset of collectPreviewAssets(path.join(site, "public"), output)) routes[asset.route] = asset.file;
const social = readFileSync(path.join(output, "opengraph-image"));
assert.equal(social.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
routes["/opengraph-image"] = "opengraph-image";
for (const route of inputs.heldPaths) assert.ok(!Object.hasOwn(routes, route), `Held page admitted: ${route}`);
const entries = Object.entries(routes).map(([route, file]) => {
  const bytes = readFileSync(path.join(output, file));
  return { route, file, bytes: bytes.length, sha256: sha256(bytes) };
});
writeFileSync(path.join(destination, "manifest.json"), JSON.stringify({
  privateOnly: true, published: false, inputSha256: sha256(readFileSync(inputsPath)),
  outputDirectory: "artifacts/guides-review/site/out",
  guidePaths: inputs.guidePaths, pagePaths: inputs.pagePaths,
  routes, files: entries, sourceFingerprint: sha256(JSON.stringify(entries)),
}, null, 2) + "\n");
console.log("Review built locally. Run: node tools/guide-review/preview.mjs");
