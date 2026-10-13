import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isApprovedSearchRelease, PUBLIC_INDEXING_APPROVAL } from "../src/shared/public-release.ts";
import { publicSourceFingerprint } from "./public-source.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
assert.equal(process.version, `v${manifest.engines.node}`, "Use the pinned Node.js runtime.");
const fingerprint = publicSourceFingerprint(root);
const buildEnvironment = {
  NODE_ENV: "production",
  APP_ENV: process.env.APP_ENV ?? "local",
  ETAIL_SEARCH_CONTEXT: process.env.ETAIL_SEARCH_CONTEXT ?? "preview",
  SITE_ID: process.env.SITE_ID ?? "",
  ETAIL_PUBLIC_ORIGIN: process.env.ETAIL_PUBLIC_ORIGIN ?? "",
  CONTEXT: process.env.CONTEXT ?? "",
};
rmSync(path.join(root, "out"), { recursive: true, force: true });
rmSync(path.join(root, ".next/public-build.json"), { force: true });
const result = spawnSync(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build"], {
  cwd: root, env: { ...process.env, ...buildEnvironment, NEXT_TELEMETRY_DISABLED: "1" }, stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
assert.equal(publicSourceFingerprint(root), fingerprint, "Source changed during the build; rebuild the candidate.");
writeFileSync(path.join(root, ".next/public-build.json"), JSON.stringify({
  schemaVersion: 1, fingerprint, buildEnvironment,
  indexingEnabled: isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, buildEnvironment),
}, null, 2) + "\n");
