#!/usr/bin/env node
/** Bound GitHub check: reads committed trees and writes only the job summary. */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { guidanceImpact, loadGuidanceMap } from "./review-guidance.ts";
import { renderGuidanceReview } from "./guidance-report.ts";

const repository = "nidcyj-haXqer-3disti/etail-depot-next";
const repositoryId = "1361184741";
type Event = {
  before?: unknown;
  repository?: { full_name?: unknown; id?: unknown };
  pull_request?: { base?: { sha?: unknown; repo?: { full_name?: unknown; id?: unknown } } };
};
export function commitSha(value: unknown): string {
  assert(typeof value === "string" && /^[a-f0-9]{40}$/.test(value) && !/^0+$/.test(value), "Expected a nonzero 40-character commit SHA");
  return value;
}

export function comparisonForEvent(name: string, event: Event): { base: string | null; reason?: string } {
  assert(event.repository?.full_name === repository && String(event.repository.id) === repositoryId, "Event repository does not match the approved project");
  if (name === "pull_request") {
    const base = event.pull_request?.base;
    assert(base?.repo?.full_name === repository && String(base.repo.id) === repositoryId, "PR base repository does not match the approved project");
    return { base: commitSha(base.sha) };
  }
  if (name === "push") return event.before === "0".repeat(40) ?
    { base: null, reason: "New branch: no previous commit was provided. Review all pilot workflows; changed-file coverage is unavailable." } :
    { base: commitSha(event.before) };
  assert(name === "workflow_dispatch", "Unsupported guidance review event");
  return { base: null, reason: "Manual run: no comparison commit was supplied. Review all pilot workflows; changed-file coverage is unavailable." };
}

type Git = (args: string[]) => string;
export function changedCommitFiles(git: Git, base: string, head: string, fetchMissing = false): string[] {
  commitSha(base); commitSha(head);
  try { git(["cat-file", "-e", `${base}^{commit}`]); }
  catch {
    assert(fetchMissing, "Required comparison commit is unavailable; no impact report can be inferred");
    // Fixed public origin, exact SHA, shallow fetch, no credential or full-history requirement.
    git(["-c", "credential.helper=", "-c", "http.extraHeader=", "fetch", "--no-tags", "--no-recurse-submodules",
      "--depth=1", `https://github.com/${repository}.git`, base]);
    git(["cat-file", "-e", `${base}^{commit}`]);
  }
  return git(["diff", "--no-renames", "--name-only", "-z", base, head, "--"]).split("\0").filter(Boolean);
}

export function runGuidanceCI(root: string, env: NodeJS.ProcessEnv) {
  assert(env.GITHUB_ACTIONS === "true" && env.GITHUB_REPOSITORY === repository && env.GITHUB_REPOSITORY_ID === repositoryId,
    "Guidance CI requires the approved GitHub Actions repository; use review:guidance locally");
  assert(env.GITHUB_EVENT_PATH && env.GITHUB_STEP_SUMMARY && env.GITHUB_EVENT_NAME, "Missing GitHub event or job-summary path");
  const targets = JSON.parse(readFileSync(path.join(root, "project-targets.json"), "utf8"));
  assert(`${targets.github.owner}/${targets.github.repository_name}` === repository && String(targets.github.repository_id) === repositoryId,
    "Project target binding mismatch");
  const git: Git = args => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
    timeout: 60_000, stdio: ["ignore", "pipe", "pipe"], env: { ...env, GIT_TERMINAL_PROMPT: "0" } });
  const head = commitSha(env.GITHUB_SHA);
  assert(git(["rev-parse", "HEAD"]).trim() === head, "Checked-out commit differs from the tested GitHub SHA");
  const comparison = comparisonForEvent(env.GITHUB_EVENT_NAME, JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, "utf8")));
  // Never load private skills in public CI. Compare committed trees, not generated or untracked files.
  const map = loadGuidanceMap(root);
  const changed = comparison.base ? changedCommitFiles(git, comparison.base, head, true) : [];
  const impact = guidanceImpact(map, changed, { all: !comparison.base });
  const markdown = renderGuidanceReview(map, impact, { head,
    comparison: comparison.base ? `${comparison.base} → ${head} (committed trees)` : "Unavailable",
    fullReviewReason: comparison.reason });
  appendFileSync(env.GITHUB_STEP_SUMMARY, markdown);
  console.log(`Guidance review completed: ${impact.workflows.length} pilot workflows need review. Private skill not checked. See the job summary.`);
  return { comparison, head, impact };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    assert(process.argv.length === 2, "Guidance CI accepts no options or private skill path");
    runGuidanceCI(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), process.env);
  } catch (error) {
    console.error("Guidance review failed: " + (error instanceof Error ? error.message : String(error)).replace(/[\r\n]/g, " "));
    process.exitCode = 1;
  }
}
