import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle, validateManifest } from "@netlify/edge-bundler";
import { canonicalOrigin, isApprovedSearchRelease, PUBLIC_INDEXING_APPROVAL } from "../src/shared/public-release.ts";
import { publicSecurityHeaders } from "../netlify/edge-functions/public-boundary.ts";
import { publicSourceFingerprint } from "./public-source.mjs";
import { clearPublicPackageOutputs } from "./public-package-cleanup.ts";
import { preparePlatformEmail } from "./netlify-email-compat.ts";
import { publicHtmlFiles } from "./public-artifact-policy.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
assert.equal(process.version, `v${manifest.engines.node}`, "Use the pinned Node.js runtime.");
assert.equal(manifest.devDependencies["@netlify/edge-bundler"], "16.0.4", "Review any Edge bundler version change.");
const argumentsList = process.argv.slice(2);
assert(argumentsList.every(argument => argument === "--production-review") && argumentsList.length <= 1, "Only --production-review is supported; this tool never deploys.");
const productionReview = argumentsList.includes("--production-review");
const buildEnvironment = productionReview ? {
  NODE_ENV: "production", APP_ENV: "production", ETAIL_SEARCH_CONTEXT: "production", CONTEXT: "production",
  SITE_ID: PUBLIC_INDEXING_APPROVAL.siteId, ETAIL_PUBLIC_ORIGIN: canonicalOrigin,
} : {
  NODE_ENV: "production", APP_ENV: process.env.APP_ENV ?? "local", ETAIL_SEARCH_CONTEXT: process.env.ETAIL_SEARCH_CONTEXT ?? "preview",
  CONTEXT: process.env.CONTEXT ?? "", SITE_ID: process.env.SITE_ID ?? "", ETAIL_PUBLIC_ORIGIN: process.env.ETAIL_PUBLIC_ORIGIN ?? "",
};

if (productionReview) {
  const result = spawnSync(process.execPath, [path.join(root, "tools/build-public-site.mjs")], {
    cwd: root, env: { ...process.env, ...buildEnvironment }, stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const buildRecord = JSON.parse(readFileSync(path.join(root, ".next/public-build.json"), "utf8"));
assert.equal(buildRecord.schemaVersion, 1, "Rebuild using the current public build wrapper.");
assert.equal(buildRecord.fingerprint, publicSourceFingerprint(root), "Source changed after the static export; rebuild before packaging.");
assert.deepEqual(buildRecord.buildEnvironment, buildEnvironment, "The export was built for another context; rebuild for this package context.");
assert.equal(buildRecord.indexingEnabled, isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, buildEnvironment), "The export search policy does not match this release.");

const exportDirectory = path.join(root, "out");
const netlifyDirectory = path.join(root, ".netlify");
const publishDirectory = path.join(netlifyDirectory, "static");
const edgeDirectory = path.join(netlifyDirectory, "edge-functions-dist");
function rejectSymlinks(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    assert(!entry.isSymbolicLink(), `Static exports cannot contain symlinks: ${entry.name}`);
    if (entry.isDirectory()) rejectSymlinks(path.join(directory, entry.name));
    else assert(entry.isFile(), `Unexpected non-file in static export: ${entry.name}`);
  }
}
rejectSymlinks(exportDirectory);
for (const file of [...publicHtmlFiles, "404.html", "robots.txt", "sitemap.xml", "opengraph-image"]) {
  assert(existsSync(path.join(exportDirectory, file)), `The static export is missing ${file}.`);
}

// Preserve platform plugins/state; unexpected legacy runtimes must fail verification.
clearPublicPackageOutputs(netlifyDirectory);
mkdirSync(netlifyDirectory, { recursive: true });
cpSync(exportDirectory, publishDirectory, { recursive: true, errorOnExist: true, force: false });
mkdirSync(edgeDirectory, { recursive: true });

// Static responses have the same baseline headers as the Edge response boundary.
const headers = ["/*", ...Object.entries(publicSecurityHeaders).map(([key, value]) => `  ${key}: ${value}`), "", "/opengraph-image", "  Content-Type: image/png", ""].join("\n");
writeFileSync(path.join(publishDirectory, "_headers"), headers);

const packaged = await bundle([path.join(root, "netlify/edge-functions")], edgeDirectory, [], {
  basePath: root,
  rootPath: root,
  userLogger: (...messages) => console.log(...messages),
});
assert(packaged.manifest, "The Edge boundary has no deployable manifest.");
validateManifest(packaged.manifest);
assert.equal(packaged.manifest.bundler_version, "16.0.4", "Unexpected Edge bundler output version.");
assert.deepEqual(packaged.functions.map(fn => fn.name), ["public-boundary"], "Only the public request boundary may be packaged.");
assert.equal(packaged.manifest.routes.length, 1);
assert.equal(packaged.manifest.routes[0].function, "public-boundary");
assert.equal(packaged.manifest.routes[0].pattern, "^/.*$");
assert.equal(packaged.manifest.post_cache_routes.length, 0, "Request policy must not be cached.");
assert.equal(packaged.manifest.bundles.length, 1);
assert.equal(packaged.manifest.bundles[0].format, "eszip2");
assert.equal(publicSourceFingerprint(root), buildRecord.fingerprint, "Source changed during packaging; rebuild the candidate.");
writeFileSync(path.join(netlifyDirectory, "public-build.json"), `${JSON.stringify(buildRecord, null, 2)}\n`);
preparePlatformEmail(root);
console.log(`Public static site packaged locally with one Edge boundary and the protected platform email handler. Search indexing in the build: ${buildRecord.indexingEnabled ? "approved production" : "disabled"}. No deployment was performed.`);
