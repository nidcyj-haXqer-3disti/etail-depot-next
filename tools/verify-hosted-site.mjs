#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { lstatSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatVerificationReport, hostedChecks, runHostedVerification } from "./hosted-verification.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const usage = "Usage: pnpm verify:hosted [--boundaries] --deploy <24-character-Netlify-deploy-ID>\nHealth checks are the default. --boundaries sends five deliberately rejected requests. Neither command deploys.";
if (args.length === 1 && args[0] === "--help") {
  console.log(usage);
} else {
  const mode = args[0] === "--boundaries" ? "boundaries" : "health";
  if (mode === "boundaries") args.shift();
  if (args.length !== 2 || args[0] !== "--deploy" || !/^[a-f0-9]{24}$/.test(args[1])) throw new Error(usage);
  const targets = JSON.parse(readFileSync(path.join(root, "project-targets.json"), "utf8"));
  const runId = `${new Date().toISOString().replace(/[^0-9TZ]/g, "")}-${randomUUID().slice(0, 8)}`;
  const directory = path.join(root, ".local", "hosted-verification");
  for (const folder of [path.join(root, ".local"), directory]) {
    mkdirSync(folder, { recursive: true, mode: 0o700 });
    if (lstatSync(folder).isSymbolicLink()) throw new Error("Verification receipts must not use symlink directories.");
  }
  const receipt = path.join(directory, `${runId}-${mode}.json`);
  writeFileSync(receipt, "", { flag: "wx", mode: 0o600 });
  const identity = {
    siteId: targets.netlify.site_id,
    operatorSuppliedDeployId: args[1], // Confirm against Netlify; the CLI does not authenticate to its API.
    localCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
    localSourceChanged: Boolean(execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim()),
  };
  const controller = new AbortController();
  const interrupt = () => controller.abort();
  process.once("SIGINT", interrupt);
  process.once("SIGTERM", interrupt);
  console.log(`Checking ${targets.netlify.canonical_origin}: ${mode}, ${hostedChecks(mode).length} GET requests, no retries.`);
  if (mode === "boundaries") console.log("Expected 404/410 responses will appear in Netlify traffic. They are reported separately from failed checks.");
  try {
    const report = await runHostedVerification({ mode, runId, signal: controller.signal,
      onProgress: progress => {
        const temporary = `${receipt}.tmp`;
        writeFileSync(temporary, JSON.stringify({ ...identity, ...progress }, null, 2) + "\n", { flag: "wx", mode: 0o600 });
        renameSync(temporary, receipt); // Retain the previous complete JSON if writing is interrupted.
      },
    });
    console.log(formatVerificationReport(report));
    console.log(`Private receipt: ${receipt}`);
    if (!report.passed) process.exitCode = 1;
  } finally {
    process.removeListener("SIGINT", interrupt);
    process.removeListener("SIGTERM", interrupt);
  }
}
