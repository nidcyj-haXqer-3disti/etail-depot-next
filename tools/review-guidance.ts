#!/usr/bin/env node
/** Local engineering review aid. No network calls, content rewrites or publication. */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstatSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { accountAccessSource } from "../src/features/developers/getting-started/content.ts";
import { woocommerceCredentialsSource } from "../src/features/resources/integrations/woocommerce/woocommerce-content.ts";
import { additionalDbaSource } from "../src/features/resources/merchant-account-setup/content.ts";
import { resolveSetupPath, setupGuidanceDependencies, setupScenarios } from "../src/features/agents/setup-paths.ts";
import type { SetupResult } from "../src/features/agents/setup-paths.ts";
import { taskPlanFor } from "../src/features/agents/task-plans.ts";
import { PUBLIC_CONTENT_PATHS } from "../src/shared/site/public-page-inventory.ts";
import { renderGuidanceReview } from "./guidance-report.ts";
import type { GuidanceDependency, GuidanceSource } from "../src/shared/site/guidance-source.ts";

export const guidanceSources: readonly GuidanceSource[] = [accountAccessSource, woocommerceCredentialsSource, additionalDbaSource];
const agentFiles = ["src/features/agents/setup-paths.ts", "src/features/agents/task-plans.ts", "src/features/agents/task-plan.tsx", "src/features/agents/guidance-reference.tsx", "src/features/agents/next-step.tsx", "src/features/agents/page-content.tsx"];
export type TaskPlanSource = { sourceFiles?: readonly string[]; sourceDirectories?: readonly string[] };
/** Page ownership for plan and optional private-skill citations. No copied instructions. */
export const taskPlanSourceMap: Readonly<Record<string, TaskPlanSource>> = {
  "/agents": { sourceDirectories: ["src/features/agents/"] },
  "/developers/webhooks": { sourceDirectories: ["src/features/developers/webhooks/"] },
  "/company/contact": { sourceFiles: ["src/shared/site/hosted-services.ts", "src/shared/site/legal-identity.ts"], sourceDirectories: ["src/features/company/contact/"] },
  "/company/blog/add-storefront-domain-payment-account": { sourceFiles: [
    "src/features/company/blog/additional-domain-content.ts", "src/features/company/blog/additional-domain-page.tsx",
  ] },
  "/developers/getting-started": { sourceDirectories: ["src/features/developers/getting-started/"] },
  "/developers/api-reference": { sourceDirectories: ["src/features/developers/api-reference/"] },
  "/developers/testing": { sourceDirectories: ["src/features/developers/testing/"] },
  "/developers/developer-tools": { sourceDirectories: ["src/features/developers/developer-tools/"] },
  "/resources/merchant-account-setup": { sourceFiles: ["src/shared/site/merchant-account-guidance.ts", "src/shared/site/hosted-services.ts"], sourceDirectories: ["src/features/resources/merchant-account-setup/"] },
  "/resources/shopify-gateway-integration": { sourceDirectories: ["src/features/resources/integrations/shopify/"] },
  "/resources/woocommerce-gateway-integration": { sourceFiles: ["src/features/resources/integrations/shopify/shopify-credentials-email-art.tsx"], sourceDirectories: ["src/features/resources/integrations/woocommerce/"] },
  "/services/payouts": { sourceDirectories: ["src/features/services/payouts/"] },
  "/services/refunds": { sourceDirectories: ["src/features/services/refunds/"] },
  "/services/disputes": { sourceDirectories: ["src/features/services/disputes/"] },
  "/services/reconciliation": { sourceDirectories: ["src/features/services/reconciliation/"] },
  "/use-cases/software-platforms/payment-models": { sourceDirectories: ["src/features/use-cases/software-platforms/payment-models/"] },
  "/use-cases/software-platforms/partnerships": { sourceDirectories: ["src/features/use-cases/software-platforms/partnerships/"] },
  "/use-cases/switch-merchant-services": { sourceDirectories: ["src/features/use-cases/switch-merchant-services/"] },
};
const planMappingFiles = ["tools/review-guidance.ts", "tools/guidance-report.ts", "tools/guidance-review-ci.ts", ...agentFiles];
// Whole-file matching is intentionally conservative when code and metadata share a file.
export const guidanceMappingFiles = [
  "tools/review-guidance.ts", "tools/guidance-review-ci.ts", "tools/guidance-report.ts",
  "src/shared/site/guidance-source.ts", ...agentFiles,
  "src/features/developers/getting-started/content.ts",
  "src/features/resources/integrations/woocommerce/woocommerce-content.ts",
  "src/features/resources/merchant-account-setup/content.ts",
] as const;
const unique = <T>(items: readonly T[]): T[] => [...new Set(items)];
const hash = (text: string | Buffer) => createHash("sha256").update(text).digest("hex");

function relativePath(value: string): string {
  assert(typeof value === "string" && value.length > 0 && !value.includes("\\") && !value.includes("\0") &&
    !path.isAbsolute(value) && !value.split("/").some(part => !part || part === "." || part === ".."), `Invalid relative path: ${value}`);
  return value;
}

function sourceFile(root: string, name: string): string {
  relativePath(name);
  assert(name.startsWith("src/"), `Guidance sources must belong to src/: ${name}`);
  const file = path.join(root, name);
  assert(lstatSync(file).isFile(), `Missing or nonregular source: ${name}`);
  assert(realpathSync(file).startsWith(realpathSync(root) + path.sep), `Source escapes the checkout: ${name}`);
  return name;
}

function directoryFiles(root: string, directory: string): string[] {
  assert(directory.endsWith("/"), `Directory needs its trailing slash: ${directory}`);
  relativePath(directory.slice(0, -1));
  assert(directory.startsWith("src/"), `Guidance assets must belong to src/: ${directory}`);
  assert(lstatSync(path.join(root, directory)).isDirectory(), `Missing or nonregular directory: ${directory}`);
  return readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
    const name = directory + entry.name;
    assert(!entry.isSymbolicLink(), `Symlink in guidance assets: ${name}`);
    return entry.isDirectory() ? directoryFiles(root, name + "/") : [sourceFile(root, name)];
  });
}

export function setupNodeKeys(): { keys: Set<string>; paths: number } {
  const keys = new Set<string>();
  let paths = 0;
  function visit(answers: string[]) {
    assert(answers.length <= 8, "Unexpected cycle in Agents decision paths");
    const { node } = resolveSetupPath(answers);
    keys.add(`${node.kind}:${node.id}`);
    if (node.kind === "question") for (const choice of node.choices) visit([...answers, choice.id]);
    else paths += 1;
  }
  visit([]);
  return { keys, paths };
}

type SkillDependency = { sourceId: string; file: string; heading: string; sectionRevision: string };
export function readSkillDependencies(directory: string, sourceIds: ReadonlySet<string>): SkillDependency[] {
  const base = realpathSync(directory);
  const record = JSON.parse(readFileSync(path.join(base, "references/guidance-dependencies.json"), "utf8"));
  assert(record.schemaVersion === 1 && Array.isArray(record.dependencies), "Invalid private skill dependency map");
  const seen = new Set<string>();
  return record.dependencies.map((item: { sourceId: string; file: string; heading: string }) => {
    assert(sourceIds.has(item.sourceId), `Unknown private skill source: ${item.sourceId}`);
    relativePath(item.file);
    assert(item.file === "SKILL.md" || (item.file.startsWith("references/") && item.file.endsWith(".md")), "Skill dependencies must reference SKILL.md or Markdown in references/");
    assert(typeof item.heading === "string" && item.heading.trim() && !item.heading.includes("\n"), "Invalid skill section heading");
    const filename = path.join(base, item.file);
    assert(lstatSync(filename).isFile() && realpathSync(filename).startsWith(base + path.sep), "Skill reference escapes its directory");
    const lines = readFileSync(filename, "utf8").split(/\r?\n/);
    const positions = lines.flatMap((line, index) => line === `## ${item.heading}` ? [index] : []);
    assert(positions.length === 1, `Missing or ambiguous skill section: ${item.heading}`);
    const start = positions[0];
    const end = lines.findIndex((line, index) => index > start && /^##? /.test(line));
    const key = `${item.sourceId}:${item.file}:${item.heading}`;
    assert(!seen.has(key), `Duplicate skill dependency: ${key}`); seen.add(key);
    return { sourceId: item.sourceId, file: item.file, heading: item.heading,
      sectionRevision: hash(lines.slice(start, end < 0 ? undefined : end).join("\n")) };
  });
}

type Workflow = {
  id: string; title: string; sourceFiles: string[]; sourceDirectories: readonly string[];
  humanFiles: string[]; guides: string[]; nodes: readonly string[]; sourceRevision: string;
  privateSkill: SkillDependency[];
};
export type TaskPlanDependency = {
  resultId: string; title: string; sourceUrls: string[]; sourceFiles: string[];
  sourceDirectories: string[]; sourceRevision: string;
};
export type SkillPageDependency = {
  sourcePage: string; sourceFiles: string[]; sourceDirectories: string[]; sourceRevision: string;
  sections: { file: string; heading: string; sectionRevision: string; sourceUrls: string[] }[];
};
export type GuidanceMap = { workflows: Workflow[]; plans: TaskPlanDependency[]; skillPages: SkillPageDependency[]; agentPaths: number; privateSkillChecked: boolean };

function pageSourceResolver(root: string, definitions = taskPlanSourceMap) {
  const pages = new Map<string, { sourceFiles: string[]; sourceDirectories: string[]; sourceRevision: string }>();
  const revisions = new Map<string, string>();
  return function filesFor(href: string) {
    assert(href.startsWith("/") && !href.startsWith("//") && !href.includes("?") && !href.includes("\\") &&
      !/[\s\0]/.test(href) && href.split("#").length <= 2, `Invalid plan source URL: ${href}`);
    const page = href.split("#")[0];
    assert(PUBLIC_CONTENT_PATHS.includes(page), `Unregistered plan source page: ${href}`);
    assert(Object.hasOwn(definitions, page), `No source mapping for task plan citation: ${href}`);
    const cached = pages.get(page);
    if (cached) return cached;
    const definition = definitions[page];
    assert((definition.sourceFiles?.length ?? 0) + (definition.sourceDirectories?.length ?? 0) > 0,
      `Empty task plan source mapping: ${page}`);
    const sourceDirectories = unique(definition.sourceDirectories ?? []).sort();
    const sourceFiles = unique([
      sourceFile(root, `src/app${page}/page.tsx`),
      ...(definition.sourceFiles ?? []).map(file => sourceFile(root, file)),
      ...sourceDirectories.flatMap(directory => directoryFiles(root, directory)),
    ]).sort();
    for (const file of sourceFiles) if (!revisions.has(file)) revisions.set(file, hash(readFileSync(path.join(root, file))));
    const mapped = { sourceFiles, sourceDirectories, sourceRevision: hash(JSON.stringify(sourceFiles.map(file => [file, revisions.get(file)]))) };
    pages.set(page, mapped);
    return mapped;
  };
}

/** Local-only: derive review links from actual skill citations, not a second hand-maintained list. */
export function loadSkillPageDependencies(root: string, directory: string): SkillPageDependency[] {
  const base = realpathSync(directory);
  function markdownFiles(directory: string): string[] {
    const folder = path.join(base, directory);
    assert(lstatSync(folder).isDirectory() && realpathSync(folder).startsWith(base + path.sep), "Skill reference escapes its directory");
    return readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
      assert(!entry.isSymbolicLink(), "Skill reference escapes its directory or is a symlink");
      const name = `${directory}/${entry.name}`;
      return entry.isDirectory() ? markdownFiles(name) : entry.name.endsWith(".md") ? [name] : [];
    }).sort();
  }
  const files = ["SKILL.md", ...markdownFiles("references")];
  const pages = new Map<string, SkillPageDependency>();
  const filesFor = pageSourceResolver(root);
  for (const file of files) {
    const filename = path.join(base, file);
    assert(lstatSync(filename).isFile() && realpathSync(filename).startsWith(base + path.sep), "Skill reference escapes its directory");
    const text = readFileSync(filename, "utf8");
    const sections = text.split(/(?=^##? )/m);
    for (const section of sections) {
      const sourceUrls = unique([...section.matchAll(/https:\/\/etaildepot\.com(\/[^\s)<>"']*)/g)].map(match => match[1]));
      if (!sourceUrls.length) continue;
      sourceUrls.forEach(filesFor);
      const heading = section.match(/^##? (.+)$/m)?.[1];
      assert(heading, `Private skill citation needs a section heading: ${file}`);
      const sectionRevision = hash(section);
      for (const sourcePage of unique(sourceUrls.map(href => href.split("#")[0]))) {
        const owned = filesFor(sourcePage);
        const page = pages.get(sourcePage) ?? { sourcePage, ...owned, sections: [] };
        page.sections.push({ file, heading, sectionRevision, sourceUrls: sourceUrls.filter(href => href.split("#")[0] === sourcePage) });
        pages.set(sourcePage, page);
      }
    }
  }
  assert(pages.size, "Private skill has no maintained website citations");
  return [...pages.values()].sort((left, right) => left.sourcePage.localeCompare(right.sourcePage));
}

/** Derive dependencies from every reachable plan, without maintaining a second list of outcomes. */
export function loadTaskPlanDependencies(root: string, options: {
  sources?: Readonly<Record<string, TaskPlanSource>>; outcomes?: readonly SetupResult[];
} = {}): TaskPlanDependency[] {
  const definitions = options.sources ?? taskPlanSourceMap;
  const outcomes = options.outcomes ?? setupScenarios().map(scenario => scenario.result);
  const byId = new Map<string, SetupResult>();
  for (const outcome of outcomes) {
    const previous = byId.get(outcome.id);
    assert(!previous || JSON.stringify(previous) === JSON.stringify(outcome), `Conflicting setup result: ${outcome.id}`);
    byId.set(outcome.id, outcome);
  }
  assert(byId.size, "No task plan outcomes to map");
  const filesFor = pageSourceResolver(root, definitions);
  return [...byId.values()].sort((left, right) => left.id.localeCompare(right.id)).map(outcome => {
    const sourceUrls = unique(taskPlanFor(outcome).map(step => step.source.href)).sort();
    assert(sourceUrls.length, `No source citations for task plan: ${outcome.id}`);
    const mappings = sourceUrls.map(filesFor);
    const sourceFiles = unique(mappings.flatMap(mapping => mapping.sourceFiles)).sort();
    return { resultId: outcome.id, title: outcome.title, sourceUrls, sourceFiles,
      sourceDirectories: unique(mappings.flatMap(mapping => mapping.sourceDirectories)).sort(),
      sourceRevision: hash(JSON.stringify(sourceUrls.map(href => [href, filesFor(href).sourceRevision]))),
    };
  });
}

export function loadGuidanceMap(root: string, options: {
  sources?: readonly GuidanceSource[]; dependencies?: readonly GuidanceDependency[]; skillDirectory?: string;
} = {}): GuidanceMap {
  const sources = options.sources ?? guidanceSources;
  const dependencies = options.dependencies ?? setupGuidanceDependencies;
  const ids = new Set(sources.map(source => source.id));
  assert(ids.size === sources.length && sources.length > 0, "Duplicate or empty guidance sources");
  const { keys, paths } = setupNodeKeys();
  const links = new Map<string, readonly string[]>();
  for (const dependency of dependencies) {
    assert(ids.has(dependency.sourceId), `Unknown Agents source: ${dependency.sourceId}`);
    assert(!links.has(dependency.sourceId), `Duplicate Agents source: ${dependency.sourceId}`);
    assert(dependency.nodes.length && unique(dependency.nodes).length === dependency.nodes.length, "Empty or duplicate Agents dependencies");
    for (const node of dependency.nodes) assert(keys.has(node), `Unknown Agents node: ${node}`);
    links.set(dependency.sourceId, dependency.nodes);
  }
  const skill = options.skillDirectory ? readSkillDependencies(options.skillDirectory, ids) : [];
  const workflows = sources.map(source => {
    assert(/^[a-z][a-z0-9-]+$/.test(source.id) && source.title, "Invalid guidance identity");
    assert(source.sourceFiles.length && source.guides.length && links.has(source.id), `Incomplete source: ${source.id}`);
    const sourceFiles = unique([...source.sourceFiles.map(name => sourceFile(root, name)),
      ...(source.sourceDirectories ?? []).flatMap(directory => directoryFiles(root, directory))]).sort();
    const humanFiles = unique(source.reviewWith.map(item => sourceFile(root, item.file)));
    const guides = unique([...source.guides, ...source.reviewWith.flatMap(item => item.guides)]);
    for (const href of guides) {
      assert(href.startsWith("/") && !href.startsWith("//") && !href.includes("?") && !href.includes("\\"), `Invalid public guide: ${href}`);
      assert(PUBLIC_CONTENT_PATHS.includes(href.split("#")[0]), `Unregistered public guide: ${href}`);
    }
    const privateSkill = skill.filter(item => item.sourceId === source.id);
    if (options.skillDirectory) assert(privateSkill.length, `Private skill has no dependency for ${source.id}`);
    return { id: source.id, title: source.title, sourceFiles, sourceDirectories: source.sourceDirectories ?? [], humanFiles, guides,
      nodes: links.get(source.id)!, privateSkill,
      sourceRevision: hash(JSON.stringify(sourceFiles.map(name => [name, hash(readFileSync(path.join(root, name)))]))),
    };
  });
  return { workflows, plans: loadTaskPlanDependencies(root), skillPages: options.skillDirectory ? loadSkillPageDependencies(root, options.skillDirectory) : [], agentPaths: paths, privateSkillChecked: Boolean(options.skillDirectory) };
}

/** Conservative file-level review prompts, not assertions that prose or claims changed. */
export function guidanceImpact(map: GuidanceMap, changed: readonly string[], options: { all?: boolean } = {}) {
  const files = unique(changed.map(relativePath)).sort();
  const mappingReviewFiles = files.filter(file => guidanceMappingFiles.some(owner => owner === file));
  const reviewAll = Boolean(options.all || mappingReviewFiles.length);
  const matched = new Set<string>();
  const workflows = map.workflows.flatMap(workflow => {
    const causes = files.filter(file => workflow.sourceFiles.includes(file) || workflow.humanFiles.includes(file) ||
      workflow.sourceDirectories.some(directory => file.startsWith(directory)) || agentFiles.includes(file));
    if (mappingReviewFiles.length) causes.push(...mappingReviewFiles.filter(file => !causes.includes(file)));
    if (!causes.length && !reviewAll) return [];
    causes.forEach(file => matched.add(file));
    return [{ id: workflow.id, title: workflow.title, changedFiles: causes, sourceRevision: workflow.sourceRevision,
      reviewFiles: unique([...workflow.sourceFiles.filter(file => !workflow.sourceDirectories.some(directory => file.startsWith(directory))), ...workflow.humanFiles, ...agentFiles]),
      guideSections: workflow.guides, agentNodes: workflow.nodes, privateSkill: workflow.privateSkill,
    }];
  });
  // Preserve the pilot matching above. Broader plan coverage is a separate review surface,
  // not a claim that all human summaries have broader dependencies.
  const planMappingChanges = files.filter(file => planMappingFiles.includes(file));
  const planReview = map.plans.flatMap(plan => {
    const changedSourceFiles = files.filter(file => plan.sourceFiles.includes(file) ||
      plan.sourceDirectories.some(directory => file.startsWith(directory)));
    const changedFiles = unique([...changedSourceFiles, ...planMappingChanges]).sort();
    if (!changedFiles.length && !options.all) return [];
    return [{ resultId: plan.resultId, title: plan.title, sourceUrls: plan.sourceUrls,
      changedSourceFiles, changedFiles, sourceRevision: plan.sourceRevision,
      reviewFiles: unique([...plan.sourceFiles.filter(file => /\.(?:ts|tsx)$/.test(file)), ...agentFiles]).sort(),
    }];
  });
  const skillReview = map.skillPages.flatMap(page => {
    const changedSourceFiles = files.filter(file => page.sourceFiles.includes(file) || page.sourceDirectories.some(directory => file.startsWith(directory)));
    const changedFiles = unique([...changedSourceFiles, ...planMappingChanges]).sort();
    if (!changedFiles.length && !options.all) return [];
    return [{ ...page, changedSourceFiles, changedFiles }];
  });
  return { workflows, planReview, skillReview, mappingReviewFiles, outsidePilot: files.filter(file => !matched.has(file)) };
}

export function gitChangedFiles(root: string, base: string): string[] {
  const git = (args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  const commit = git(["rev-parse", "--verify", "--end-of-options", `${base}^{commit}`]).trim();
  return unique([...git(["diff", "--no-renames", "--name-only", "-z", commit, "--"]).split("\0"),
    ...git(["diff", "--cached", "--no-renames", "--name-only", "-z", commit, "--"]).split("\0"),
    ...git(["ls-files", "--others", "--exclude-standard", "-z"]).split("\0")].filter(Boolean));
}

function main(args: string[]) {
  if (args.includes("--help")) {
    console.log("pnpm review:guidance [--base HEAD | --changed path ...] [--skill-dir path] [--json | --markdown]\nNo arguments validates the three pilot maps and all reachable task-plan source mappings. --base includes committed, staged, unstaged and untracked changes relative to that commit. --changed lists hypothetical or actual paths; it changes nothing. Output is a review prompt, not factual approval. With --skill-dir, review coverage also follows the website citations in the private skill. Keep JSON receipts in ignored .local/. No network or writes."); return;
  }
  let base: string | undefined, skillDirectory: string | undefined, json = false, markdown = false;
  const changed: string[] = [];
  for (let index = 0; index < args.length; index++) {
    const flag = args[index];
    if (flag === "--json") { json = true; continue; }
    if (flag === "--markdown") { markdown = true; continue; }
    assert(["--base", "--changed", "--skill-dir"].includes(flag), `Unknown option: ${flag}`);
    const value = args[++index]; assert(value && !value.startsWith("--"), `Missing value for ${flag}`);
    if (flag === "--base") { assert(!base, "Use one base"); base = value; }
    else if (flag === "--skill-dir") { assert(!skillDirectory, "Use one skill directory"); skillDirectory = path.resolve(value); }
    else changed.push(value);
  }
  assert(!(base && changed.length), "Use either --base or --changed");
  assert(!(json && markdown), "Use either --json or --markdown");
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const map = loadGuidanceMap(root, { skillDirectory });
  const git = (args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  const head = git(["rev-parse", "HEAD"]);
  const baseCommit = base ? git(["rev-parse", "--verify", "--end-of-options", `${base}^{commit}`]) : null;
  const changedFiles = baseCommit ? gitChangedFiles(root, baseCommit) : changed;
  const impact = guidanceImpact(map, changedFiles);
  const result = { schemaVersion: 1, scope: "Three guidance pilots plus source mappings for all reachable Agents task plans. File-level review dependencies, optional private skill citation dependencies; not semantic correctness or publication approval.",
    mode: base ? "git-diff" : changed.length ? "supplied-paths" : "validate", base: base ?? null, baseCommit, head,
    workflowCount: map.workflows.length, planCount: map.plans.length, skillPageCount: map.skillPages.length, agentPaths: map.agentPaths,
    privateSkill: map.privateSkillChecked ? "checked" : "not checked; supply --skill-dir for local skill references",
    anchorCheck: "Registered page paths checked here. Verify section anchors against a freshly built export separately.",
    revisions: map.workflows.map(({ id, sourceRevision }) => ({ id, sourceRevision })),
    planRevisions: map.plans.map(({ resultId, sourceUrls, sourceRevision }) => ({ resultId, sourceUrls, sourceRevision })), ...impact };
  if (json) console.log(JSON.stringify(result, null, 2));
  else if (markdown) console.log(renderGuidanceReview(map, impact, { head, validationOnly: result.mode === "validate",
    comparison: baseCommit ? `${baseCommit} → current local files (includes staged, unstaged and untracked changes)` :
      changed.length ? "Supplied paths only; not a Git comparison" : "Map validation only; no changed files supplied" }));
  else {
    console.log(`Guidance references valid: ${result.workflowCount} pilots, ${result.agentPaths} Agents paths. Private skill: ${result.privateSkill}.`);
    console.log(`Task-plan source mappings valid: ${result.planCount} result IDs. Private skill cited pages checked: ${map.skillPages.length}.`);
    if (impact.mappingReviewFiles.length) console.log("Dependency definition files changed. Review all pilots and compare removed relationships in the diff.");
    for (const workflow of impact.workflows) {
      console.log(`\n${workflow.id}: ${workflow.title}\nChanged: ${workflow.changedFiles.join(", ")}`);
      console.log(`Review source and summaries:\n${workflow.reviewFiles.map(file => `  ${file}`).join("\n")}`);
      console.log(`Guide sections:\n${workflow.guideSections.map(href => `  ${href}`).join("\n")}`);
      console.log(`Agents nodes: ${workflow.agentNodes.join(", ")}`);
      for (const item of workflow.privateSkill) console.log(`Private skill: ${item.file} → ${item.heading}`);
    }
    for (const plan of impact.planReview) {
      console.log(`\nTask plan ${plan.resultId}: ${plan.title}\nChanged source files: ${plan.changedSourceFiles.join(", ") || "None; plan definitions or review scope changed."}`);
      console.log(`All review triggers: ${plan.changedFiles.join(", ") || "Full review requested."}`);
      console.log(`Plan sources:\n${plan.sourceUrls.map(href => `  ${href}`).join("\n")}`);
      console.log(`Review source and plan files:\n${plan.reviewFiles.map(file => `  ${file}`).join("\n")}`);
    }
    for (const page of impact.skillReview) {
      console.log(`\nPrivate skill source: ${page.sourcePage}\nReview triggers: ${page.changedFiles.join(", ") || "Full review requested."}`);
      for (const section of page.sections) console.log(`Review private section: ${section.file} → ${section.heading}`);
    }
    if (impact.outsidePilot.length) console.log(`\nOutside this pilot (not assessed):\n${impact.outsidePilot.join("\n")}\nThese files are outside the three pilot workflows. Any mapped task-plan impact is reported separately above; ordinary review still applies.`);
    console.log("\nThis list prompts review. It does not verify factual accuracy, account enablement, indexing or release readiness.");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}
