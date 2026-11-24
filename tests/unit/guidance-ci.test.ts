import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { afterEach, expect, test } from "vitest";
import { changedCommitFiles, comparisonForEvent, runGuidanceCI } from "../../tools/guidance-review-ci";
import { renderGuidanceReview } from "../../tools/guidance-report";
import { guidanceImpact, guidanceMappingFiles, loadGuidanceMap } from "../../tools/review-guidance";

const root = fileURLToPath(new URL("../../", import.meta.url));
const repository = { full_name: "nidcyj-haXqer-3disti/etail-depot-next", id: 1361184741 };
const base = "1".repeat(40), head = "2".repeat(40);
const folders: string[] = [];
const fixture = () => { const folder = mkdtempSync(path.join(os.tmpdir(), "etail-guidance-ci-")); folders.push(folder); return folder; };
afterEach(() => { for (const folder of folders.splice(0)) rmSync(folder, { recursive: true, force: true }); });

test("PR comparison uses its exact base SHA, not the head parent or branch name", () => {
  expect(comparisonForEvent("pull_request", { repository, pull_request: { base: { sha: base, repo: repository } } })).toEqual({ base });
});

test("push comparison uses the previous commit and new branches request full review", () => {
  expect(comparisonForEvent("push", { repository, before: base })).toEqual({ base });
  expect(comparisonForEvent("push", { repository, before: "0".repeat(40) })).toMatchObject({ base: null, reason: expect.stringContaining("New branch") });
});

test("manual runs explicitly lack comparison coverage", () => {
  expect(comparisonForEvent("workflow_dispatch", { repository })).toMatchObject({ base: null, reason: expect.stringContaining("coverage is unavailable") });
});

test("invalid commits, wrong repositories and unsupported event types fail", () => {
  for (const before of [undefined, "HEAD", "--upload-pack=bad", "f".repeat(39), `$(touch no)`]) {
    expect(() => comparisonForEvent("push", { repository, before })).toThrow(/commit SHA/);
  }
  expect(() => comparisonForEvent("push", { repository: { ...repository, id: 1 }, before: base })).toThrow(/repository/);
  expect(() => comparisonForEvent("pull_request", { repository, pull_request: { base: { sha: base, repo: { ...repository, full_name: "other/repo" } } } })).toThrow(/repository/);
  expect(() => comparisonForEvent("pull_request_target", { repository })).toThrow(/Unsupported/);
});

test("committed-tree comparison preserves rename endpoints and ignores local generated files", () => {
  const folder = fixture();
  const git = (args: string[]) => execFileSync("git", args, { cwd: folder, encoding: "utf8" });
  const commit = () => { git(["add", "-A"]); git(["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--quiet", "-m", "Fixture"]); return git(["rev-parse", "HEAD"]).trim(); };
  git(["init", "--quiet"]);
  writeFileSync(path.join(folder, "old-guide.txt"), "Guidance");
  const from = commit();
  renameSync(path.join(folder, "old-guide.txt"), path.join(folder, "new-guide.txt"));
  const to = commit();
  writeFileSync(path.join(folder, "new-guide.txt"), "Local edit"); git(["add", "new-guide.txt"]);
  writeFileSync(path.join(folder, "untracked-report.txt"), "Generated report");
  expect(changedCommitFiles(git, from, to).sort()).toEqual(["new-guide.txt", "old-guide.txt"]);
  expect(changedCommitFiles(git, to, to)).toEqual([]);
});

test("a missing base fetches only the validated SHA from the fixed public repository", () => {
  const calls: string[][] = [];
  const git = (args: string[]) => {
    calls.push(args);
    if (calls.length === 1) throw new Error("Missing base");
    return args[0] === "diff" ? "src/guide.ts\0" : "";
  };
  expect(changedCommitFiles(git, base, head, true)).toEqual(["src/guide.ts"]);
  expect(calls[1]).toEqual(["-c", "credential.helper=", "-c", "http.extraHeader=", "fetch", "--no-tags", "--no-recurse-submodules", "--depth=1",
    "https://github.com/nidcyj-haXqer-3disti/etail-depot-next.git", base]);
  expect(calls[2]).toEqual(["cat-file", "-e", `${base}^{commit}`]);
  expect(calls[3]).toEqual(["diff", "--no-renames", "--name-only", "-z", base, head, "--"]);
});

test("a depth-one merge checkout compares correctly after fetching just its base tree", () => {
  const folder = fixture();
  const git = (args: string[]) => execFileSync("git", args, { cwd: folder, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  git(["init", "--quiet", "-b", "main"]);
  git(["config", "user.name", "Fixture"]); git(["config", "user.email", "fixture@example.invalid"]);
  const commit = (name: string, content: string) => {
    writeFileSync(path.join(folder, name), content); git(["add", name]); git(["commit", "--quiet", "-m", "Fixture"]);
    return git(["rev-parse", "HEAD"]).trim();
  };
  commit("guide.txt", "Initial guidance");
  git(["checkout", "--quiet", "-b", "feature"]); commit("guide.txt", "Feature guidance");
  git(["checkout", "--quiet", "main"]); const from = commit("base-only.txt", "Concurrent main change");
  git(["merge", "--quiet", "--no-ff", "feature", "-m", "Synthetic PR merge"]);
  const to = git(["rev-parse", "HEAD"]).trim();
  const clone = path.join(fixture(), "shallow");
  git(["clone", "--quiet", "--depth=1", pathToFileURL(folder).href, clone]);
  const shallowGit = (args: string[]) => execFileSync("git", args, { cwd: clone, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  expect(shallowGit(["rev-parse", "--is-shallow-repository"]).trim()).toBe("true");
  expect(() => changedCommitFiles(shallowGit, from, to)).toThrow(/unavailable/);
  shallowGit(["fetch", "--quiet", "--no-tags", "--depth=1", pathToFileURL(folder).href, from]);
  expect(changedCommitFiles(shallowGit, from, to)).toEqual(["guide.txt"]);
});

test("missing or unfetchable required bases fail instead of reporting no impact", () => {
  let calls = 0;
  const unavailable = () => { calls++; throw new Error("Unavailable"); };
  expect(() => changedCommitFiles(unavailable, base, head)).toThrow(/unavailable/);
  expect(calls).toBe(1);
  expect(() => changedCommitFiles(unavailable, base, head, true)).toThrow(/Unavailable/);
  expect(calls).toBe(3);
});

test("mapping-owner changes request all pilots even after a relationship is removed", () => {
  const map = loadGuidanceMap(root);
  map.workflows[0].humanFiles = [];
  for (const file of guidanceMappingFiles) {
    const result = guidanceImpact(map, [file]);
    expect(result.workflows).toHaveLength(3);
    expect(result.mappingReviewFiles).toEqual([file]);
    expect(result.workflows.every(workflow => workflow.changedFiles.includes(file))).toBe(true);
  }
});

test("full review never claims to know which files changed", () => {
  const map = loadGuidanceMap(root);
  const impact = guidanceImpact(map, [], { all: true });
  const report = renderGuidanceReview(map, impact, { head, comparison: "Unavailable", fullReviewReason: "Manual run" });
  expect(impact.workflows).toHaveLength(3);
  expect(impact.workflows.every(workflow => !workflow.changedFiles.length)).toBe(true);
  expect(report).toContain("Changed-file coverage is unavailable");
  expect(report).toContain("Private skill not checked");
});

test("Markdown escapes labels and filenames and identifies bounded lists", () => {
  const map = loadGuidanceMap(root);
  const impact = guidanceImpact(map, [], { all: true });
  impact.workflows[0].title = '<img src=x> [link](bad)\n## forged';
  impact.outsidePilot = ["src/<script>`![x](bad)\n::error::file.ts", ...Array.from({ length: 60 }, (_, index) => `src/file-${index}.ts`)];
  const report = renderGuidanceReview(map, impact, { head, comparison: base });
  expect(report).not.toContain("<img");
  expect(report).not.toContain("<script>");
  expect(report).not.toContain("[link](bad)");
  expect(report).not.toContain("![x](bad)");
  expect(report).not.toContain("\n::error::");
  expect(report).toContain("21 more entries omitted");
});

test("map-only validation does not claim that no workflow changed", () => {
  const map = loadGuidanceMap(root);
  const report = renderGuidanceReview(map, guidanceImpact(map, []), { head, comparison: "Map only", validationOnly: true });
  expect(report).toContain("Change impact not assessed");
  expect(report).not.toContain("No mapped workflow was touched");
  expect(report).not.toContain("None in the supplied comparison");
});

function ciEnvironment(eventName = "push") {
  const folder = fixture();
  const current = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  const eventPath = path.join(folder, "event.json"), summaryPath = path.join(folder, "summary.md");
  writeFileSync(eventPath, JSON.stringify({ repository, before: current }));
  const env = { ...process.env, GITHUB_ACTIONS: "true", GITHUB_REPOSITORY: repository.full_name,
    GITHUB_REPOSITORY_ID: String(repository.id), GITHUB_EVENT_PATH: eventPath, GITHUB_STEP_SUMMARY: summaryPath,
    GITHUB_EVENT_NAME: eventName, GITHUB_SHA: current };
  return { env, summaryPath };
}

test("CI writes its report using exact committed trees without loading the private skill", () => {
  const { env, summaryPath } = ciEnvironment();
  const result = runGuidanceCI(root, { ...env, SKILL_DIR: "/unavailable/private/skill" });
  expect(result.comparison.base).toBe(env.GITHUB_SHA);
  expect(result.impact.workflows).toEqual([]);
  const summary = readFileSync(summaryPath, "utf8");
  expect(summary).toContain("Private skill not checked");
  expect(summary).not.toContain("/unavailable/private");
  expect(summary).toContain(env.GITHUB_SHA);
});

test("CI manual execution produces the conservative full-pilot report", () => {
  const { env, summaryPath } = ciEnvironment("workflow_dispatch");
  expect(runGuidanceCI(root, env).impact.workflows).toHaveLength(3);
  expect(readFileSync(summaryPath, "utf8")).toContain("Manual run");
});

test("CI refuses wrong checkout identities and non-Actions usage", () => {
  const { env } = ciEnvironment();
  expect(() => runGuidanceCI(root, { ...env, GITHUB_SHA: base })).toThrow(/Checked-out commit/);
  expect(() => runGuidanceCI(root, { ...env, GITHUB_ACTIONS: "false" })).toThrow(/requires/);
});


test("private citation report is local only and includes the affected section without its prose", () => {
  const map = loadGuidanceMap(root);
  map.privateSkillChecked = true;
  map.skillPages = [{ sourcePage: "/developers/webhooks", sourceFiles: ["src/features/developers/webhooks/content.ts"], sourceDirectories: [], sourceRevision: "source-version",
    sections: [{ file: "references/routes.md", heading: "<script>Private section", sectionRevision: "section-version", sourceUrls: ["/developers/webhooks"] }] }];
  const report = renderGuidanceReview(map, guidanceImpact(map, ["src/features/developers/webhooks/content.ts"]), { head, comparison: "Supplied path" });
  expect(report).toContain("Private skill source review: 1 affected pages");
  expect(report).toContain("references/routes.md");
  expect(report).toContain("do not publish this report");
  expect(report).not.toContain("<script>");
  const publicMap = loadGuidanceMap(root);
  expect(renderGuidanceReview(publicMap, guidanceImpact(publicMap, []), { head, comparison: "No private input" })).not.toContain("Private skill source review:");
});
