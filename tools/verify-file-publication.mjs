#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fileDestination } from "./file-publication-policy.ts";
import { forbiddenStatic } from "./public-artifact-policy.ts";

/** Includes forced tracked files and nonignored new files; never reads or prints their contents. */
export function inspectFilePublication(root) {
  const names = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }).split("\0").filter(Boolean);
  const entries = [...new Set(names)].sort().map(filename => ({ path: filename, destination: fileDestination(filename) }));
  const findings = [];
  for (const entry of entries) {
    if (entry.destination === "local-only") findings.push(`${entry.path}: LOCAL_FILE_IN_GITHUB_CANDIDATE`);
    if (entry.destination === "unclassified") findings.push(`${entry.path}: FILE_DESTINATION_NOT_DEFINED`);
    const filename = path.join(root, entry.path);
    try {
      if (lstatSync(filename).isSymbolicLink()) findings.push(`${entry.path}: SYMLINK_IN_GITHUB_CANDIDATE`);
    } catch (error) { if (error.code !== "ENOENT") throw error; }
  }
  // Scan public/ independently so an ignored credential there cannot escape the source check.
  function inspectPublic(directory) {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      const relative = path.relative(path.join(root, "public"), filename).split(path.sep).join("/");
      if (entry.isSymbolicLink()) findings.push(`public/${relative}: SYMLINK_IN_PUBLIC_ASSETS`);
      else if (entry.isDirectory()) inspectPublic(filename);
      else if (forbiddenStatic(relative)) findings.push(`public/${relative}: NON_WEBSITE_FILE_IN_PUBLIC_ASSETS`);
    }
  }
  const publicRoot = path.join(root, "public");
  try {
    if (lstatSync(publicRoot).isSymbolicLink()) findings.push("public: SYMLINK_IN_PUBLIC_ASSETS");
    else inspectPublic(publicRoot);
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  const counts = Object.fromEntries(["website-input", "repository-only", "local-only", "unclassified"].map(destination => [destination, entries.filter(entry => entry.destination === destination).length]));
  return { counts, entries, findings: [...new Set(findings)].sort() };
}

export function verifyFilePublication(root) {
  const report = inspectFilePublication(root);
  if (report.findings.length) throw new Error(`File publication checks failed:\n${report.findings.join("\n")}\nSee docs/FILE_PUBLICATION_POLICY.md. No files were moved or removed.`);
  console.log(`File publication checked: ${report.counts["website-input"]} website inputs and ${report.counts["repository-only"]} repository-only files. No local-only or unclassified files in the candidate; public assets are clean.`);
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  if (process.argv.includes("--json")) {
    const report = inspectFilePublication(root);
    console.log(JSON.stringify(report, null, 2));
    if (report.findings.length) process.exitCode = 1;
  } else verifyFilePublication(root);
}
