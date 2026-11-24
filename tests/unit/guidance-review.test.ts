import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, expect, test } from "vitest";
import { gitChangedFiles, guidanceImpact, guidanceSources, loadGuidanceMap, loadTaskPlanDependencies, taskPlanSourceMap, readSkillDependencies, loadSkillPageDependencies, setupNodeKeys } from "../../tools/review-guidance";
import { setupGuidanceDependencies } from "../../src/features/agents/setup-paths";

const root = fileURLToPath(new URL("../../", import.meta.url));
const fixtures: string[] = [];
afterEach(() => { for (const folder of fixtures.splice(0)) rmSync(folder, { recursive: true, force: true }); });

test("all pilot source files, route paths and Agents node references exist without private state", () => {
  const map = loadGuidanceMap(root);
  expect(map.workflows.map(item => item.id)).toEqual(["account-access", "woocommerce-credentials", "additional-dba"]);
  expect(map.agentPaths).toBe(40);
  expect(map.privateSkillChecked).toBe(false);
  expect(map.workflows.every(item => /^[a-f0-9]{64}$/.test(item.sourceRevision))).toBe(true);
  expect(setupNodeKeys().keys.has("question:platform")).toBe(true);
  expect(setupNodeKeys().keys.has("result:platform")).toBe(true);
});

test("a WooCommerce file change identifies the guide, human summary and exact Agents outcomes", () => {
  const map = loadGuidanceMap(root);
  const result = guidanceImpact(map, ["src/features/resources/integrations/woocommerce/woocommerce-file-transfer.tsx"]);
  expect(result.workflows.map(item => item.id)).toEqual(["woocommerce-credentials"]);
  const [workflow] = result.workflows;
  expect(workflow.agentNodes).toEqual(["question:woocommerce-host", "result:woocommerce", "result:woocommerce-other"]);
  expect(workflow.reviewFiles).toContain("src/features/developers/getting-started/content.ts");
  expect(workflow.reviewFiles).toContain("src/features/resources/help/page-content.tsx");
  expect(workflow.guideSections).toContain("/resources/woocommerce-gateway-integration#enter-credentials");
  expect(result.outsidePilot).toEqual([]);
});

test("new and deleted preview filenames within the mapped asset directory still trigger review", () => {
  const result = guidanceImpact(loadGuidanceMap(root), [
    "src/features/resources/integrations/woocommerce/assets/previews/future-credential-preview.webp",
    "src/features/resources/integrations/woocommerce/assets-old/unrelated.webp",
  ]);
  expect(result.workflows.map(item => item.id)).toEqual(["woocommerce-credentials"]);
  expect(result.outsidePilot).toEqual(["src/features/resources/integrations/woocommerce/assets-old/unrelated.webp"]);
});

test("inline DBA artwork and account access content identify both affected workflow groups", () => {
  const result = guidanceImpact(loadGuidanceMap(root), ["src/features/resources/merchant-account-setup/application-guide-steps.tsx"]);
  expect(result.workflows.map(item => item.id)).toEqual(["account-access", "additional-dba"]);
  expect(result.workflows.find(item => item.id === "additional-dba")?.agentNodes).toContain("result:domain");
  expect(result.workflows.find(item => item.id === "account-access")?.agentNodes).toContain("question:access:woocommerce");
});

test("unmapped edits are reported as outside the pilot, not declared safe", () => {
  const result = guidanceImpact(loadGuidanceMap(root), ["src/features/pricing/page-content.tsx"]);
  expect(result.workflows).toEqual([]);
  expect(result.outsidePilot).toEqual(["src/features/pricing/page-content.tsx"]);
  expect(() => guidanceImpact(loadGuidanceMap(root), ["../private.txt"])).toThrow(/Invalid relative path/);
});

test("unknown source IDs, removed nodes and missing source files fail validation", () => {
  expect(() => loadGuidanceMap(root, { dependencies: [{ sourceId: "typo", nodes: ["result:access"] }] })).toThrow(/Unknown Agents source/);
  expect(() => loadGuidanceMap(root, { dependencies: setupGuidanceDependencies.map(item => item.sourceId === "account-access" ? { ...item, nodes: ["result:removed"] } : item) })).toThrow(/Unknown Agents node/);
  expect(() => loadGuidanceMap(root, { sources: guidanceSources.map(item => item.id === "account-access" ? { ...item, sourceFiles: ["src/missing-source.ts"] } : item) })).toThrow();
  expect(() => loadGuidanceMap(root, { sources: [...guidanceSources, guidanceSources[0]] })).toThrow(/Duplicate/);
});

function skillFixture() {
  const folder = mkdtempSync(path.join(os.tmpdir(), "etail-guidance-")); fixtures.push(folder);
  mkdirSync(path.join(folder, "references"));
  writeFileSync(path.join(folder, "references/setup-routes.md"), "# Routes\n\n## Account access\nPublic guidance summary.\n\n## WooCommerce\nProtected certificate.\n\n## Additional DBA\nSeparate approval.\n");
  const dependencies = guidanceSources.map((source, index) => ({ sourceId: source.id, file: "references/setup-routes.md", heading: ["Account access", "WooCommerce", "Additional DBA"][index] }));
  const save = (items = dependencies) => writeFileSync(path.join(folder, "references/guidance-dependencies.json"), JSON.stringify({ schemaVersion: 1, dependencies: items }));
  writeFileSync(path.join(folder, "SKILL.md"), "# Skill\n\n## Boundaries\nPrivate planning only. [Account setup](https://etaildepot.com/resources/merchant-account-setup#after-approval)\n");
  save(); return { folder, dependencies, save };
}

test("explicit private skill inspection adds the right section and revision to an impact report", () => {
  const { folder } = skillFixture();
  const map = loadGuidanceMap(root, { skillDirectory: folder });
  expect(map.privateSkillChecked).toBe(true);
  const report = guidanceImpact(map, ["src/features/resources/integrations/woocommerce/woocommerce-connection-walkthrough.tsx"]);
  expect(report.workflows[0].privateSkill[0]).toMatchObject({ sourceId: "woocommerce-credentials", file: "references/setup-routes.md", heading: "WooCommerce" });
  expect(report.workflows[0].privateSkill[0].sectionRevision).toMatch(/^[a-f0-9]{64}$/);
  expect(JSON.stringify(report)).not.toContain(folder);
});

test("private skill references fail on unknown IDs, stale headings and escaping paths", () => {
  const { folder, dependencies, save } = skillFixture();
  const ids = new Set(guidanceSources.map(source => source.id));
  save([{ ...dependencies[0], sourceId: "typo" }]);
  expect(() => readSkillDependencies(folder, ids)).toThrow(/Unknown private skill source/);
  save([{ ...dependencies[0], heading: "Removed section" }]);
  expect(() => readSkillDependencies(folder, ids)).toThrow(/Missing or ambiguous skill section/);
  save([{ ...dependencies[0], file: "../secret.md" }]);
  expect(() => readSkillDependencies(folder, ids)).toThrow(/Invalid relative path/);
  save([dependencies[0]]);
  expect(() => loadGuidanceMap(root, { skillDirectory: folder })).toThrow(/Private skill has no dependency/);
});

test("the skill entrypoint can be a review dependent as well as its route map", () => {
  const { folder, dependencies, save } = skillFixture();
  save([...dependencies, { sourceId: "account-access", file: "SKILL.md", heading: "Boundaries" }]);
  const map = loadGuidanceMap(root, { skillDirectory: folder });
  expect(map.workflows.find(item => item.id === "account-access")?.privateSkill.map(item => item.file)).toEqual(["references/setup-routes.md", "SKILL.md"]);
});

test("Git review retains a staged change even when its working file is restored to base", () => {
  const folder = mkdtempSync(path.join(os.tmpdir(), "etail-guidance-git-")); fixtures.push(folder);
  const git = (args: string[]) => execFileSync("git", args, { cwd: folder, encoding: "utf8" });
  git(["init", "--quiet"]);
  writeFileSync(path.join(folder, "guide.txt"), "Baseline");
  git(["add", "guide.txt"]);
  git(["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--quiet", "-m", "Fixture baseline"]);
  writeFileSync(path.join(folder, "guide.txt"), "Staged edit");
  git(["add", "guide.txt"]);
  writeFileSync(path.join(folder, "guide.txt"), "Baseline");
  writeFileSync(path.join(folder, "new.txt"), "Untracked");
  expect(git(["diff", "--name-only", "HEAD"]).trim()).toBe("");
  expect(gitChangedFiles(folder, "HEAD").sort()).toEqual(["guide.txt", "new.txt"]);
});

test("plan and reference changes request review across the human and agent pilot views", () => {
  for (const file of ["src/features/agents/task-plans.ts", "src/features/agents/guidance-reference.tsx", "src/features/agents/task-plan.tsx", "src/features/agents/next-step.tsx", "src/features/agents/page-content.tsx"]) {
    const report = guidanceImpact(loadGuidanceMap(root), [file]);
    expect(report.workflows).toHaveLength(3);
    expect(report.outsidePilot).toEqual([]);
    for (const workflow of report.workflows) expect(workflow.reviewFiles).toContain(file);
  }
});


test("all plan citations map to current page sources and report changes outside the three pilots", () => {
  const map = loadGuidanceMap(root);
  expect(map.plans).toHaveLength(26);
  expect(new Set(map.plans.flatMap(plan => plan.sourceUrls)).size).toBe(40);
  expect(Object.keys(taskPlanSourceMap)).toHaveLength(18);
  const file = "src/features/services/refunds/content.ts";
  const result = guidanceImpact(map,[file]);
  expect(result.workflows).toEqual([]);
  expect(result.outsidePilot).toEqual([file]);
  expect(result.planReview.map(plan => plan.resultId)).toEqual(["refund"]);
  expect(result.planReview[0].changedSourceFiles).toContain(file);
  expect(result.planReview[0].reviewFiles).toContain("src/features/agents/task-plans.ts");
  expect(guidanceImpact(map,["src/features/company/blog/additional-domain-page.tsx"]).planReview.map(plan => plan.resultId)).toEqual(["domain"]);
  expect(guidanceImpact(map,["src/features/services/refunds/future-file.ts"]).planReview.map(plan => plan.resultId)).toEqual(["refund"]);
  expect(guidanceImpact(map,["src/features/agents/task-plans.ts"]).planReview).toHaveLength(26);
  for (const plan of guidanceImpact(map,[],{all:true}).planReview) {
    expect(plan.changedFiles).toEqual([]); expect(plan.changedSourceFiles).toEqual([]);
  }
});

test("missing plan source ownership cannot silently bypass maintenance checks", () => {
  const missing = {...taskPlanSourceMap}; delete missing["/services/refunds"];
  expect(() => loadTaskPlanDependencies(root,{sources:missing})).toThrow(/No source mapping/);
  expect(() => loadTaskPlanDependencies(root,{sources:{...taskPlanSourceMap,"/services/refunds":{}}})).toThrow(/Empty task plan source/);
  expect(() => loadTaskPlanDependencies(root,{sources:{...taskPlanSourceMap,"/services/refunds":{sourceFiles:["src/missing-plan-source.ts"]}}})).toThrow();
});


test("private skill citations independently flag Shopify, Webhooks and shared destination changes", () => {
  const { folder } = skillFixture();
  writeFileSync(path.join(folder, "references/other-routes.md"), "# More routes\n\n## Shopify\n[Before connecting](https://etaildepot.com/resources/shopify-gateway-integration#before-you-start)\n\n## Notifications\n[Webhooks](https://etaildepot.com/developers/webhooks)\n\n## Support\n[Contact](https://etaildepot.com/company/contact#integration)\n");
  const map = loadGuidanceMap(root, { skillDirectory: folder });
  expect(map.skillPages).toHaveLength(4);
  const shopify = guidanceImpact(map, ["src/features/resources/integrations/shopify/shopify-content.ts"]);
  expect(shopify.workflows.map(workflow => workflow.id)).toEqual(["account-access"]);
  expect(shopify.skillReview.map(page => page.sourcePage)).toEqual(["/resources/shopify-gateway-integration"]);
  expect(shopify.skillReview[0].sections[0]).toMatchObject({ file: "references/other-routes.md", heading: "Shopify" });
  expect(shopify.skillReview[0].sections[0].sectionRevision).toMatch(/^[a-f0-9]{64}$/);
  const webhooks = guidanceImpact(map, ["src/features/developers/webhooks/future-instructions.tsx"]);
  expect(webhooks.skillReview.map(page => page.sourcePage)).toEqual(["/developers/webhooks"]);
  const shared = guidanceImpact(map, ["src/shared/site/hosted-services.ts"]);
  expect(shared.skillReview.map(page => page.sourcePage)).toEqual(["/company/contact", "/resources/merchant-account-setup"]);
  expect(shared.planReview.some(plan => plan.resultId === "application:shopify")).toBe(true);
  expect(JSON.stringify(shared)).not.toContain(folder);
  expect(guidanceImpact(loadGuidanceMap(root), ["src/features/developers/webhooks/content.ts"]).skillReview).toEqual([]);
});

test("private citations reject unregistered pages, unsupported query links and escaping references", () => {
  const { folder } = skillFixture();
  const reference = path.join(folder, "references/extra.md");
  writeFileSync(reference, "# Unknown\n[Missing](https://etaildepot.com/removed-page)\n");
  expect(() => loadSkillPageDependencies(root, folder)).toThrow(/Unregistered/);
  writeFileSync(reference, "# Query\n[Wrong](https://etaildepot.com/agents?account=test)\n");
  expect(() => loadSkillPageDependencies(root, folder)).toThrow(/Invalid plan source URL/);
  rmSync(reference);
  symlinkSync(path.join(root, "README.md"), reference);
  expect(() => loadSkillPageDependencies(root, folder)).toThrow(/escapes/);
});

test("shared merchant entry instructions affect their application plans", () => {
  const impact = guidanceImpact(loadGuidanceMap(root), ["src/shared/site/merchant-account-guidance.ts"]);
  expect(impact.planReview.filter(plan => plan.resultId.startsWith("application:"))).toHaveLength(5);
  expect(impact.planReview.every(plan => plan.sourceUrls.some(url => url.startsWith("/resources/merchant-account-setup")))).toBe(true);
});


test("nested private reference citations participate in source-change review", () => {
  const { folder } = skillFixture();
  mkdirSync(path.join(folder, "references/checkout"));
  writeFileSync(path.join(folder, "references/checkout/wallets.md"), "# Wallets\n\n## Domain setup\n[Wallet setup](https://etaildepot.com/developers/getting-started#payment-methods)\n");
  const map = loadGuidanceMap(root, { skillDirectory: folder });
  const impact = guidanceImpact(map, ["src/features/developers/getting-started/page-content.tsx"]);
  expect(impact.skillReview[0].sections[0]).toMatchObject({ file: "references/checkout/wallets.md", heading: "Domain setup" });
  expect(impact.skillReview[0].sections[0].sourceUrls).toEqual(["/developers/getting-started#payment-methods"]);
});


test("shared credential artwork affects both platform plans and their private skill citations", () => {
  const { folder } = skillFixture();
  writeFileSync(path.join(folder, "references/shared-artwork.md"), "# Platform setup\n\n## Shopify\n[Credentials](https://etaildepot.com/resources/shopify-gateway-integration#before-you-start)\n\n## WooCommerce\n[Credentials](https://etaildepot.com/resources/woocommerce-gateway-integration#enter-credentials)\n");
  const file = "src/features/resources/integrations/shopify/shopify-credentials-email-art.tsx";
  const impact = guidanceImpact(loadGuidanceMap(root, { skillDirectory: folder }), [file]);
  expect(impact.planReview.map(plan => plan.resultId).sort()).toEqual(["shopify", "woocommerce", "woocommerce-other"]);
  expect(impact.skillReview.map(page => page.sourcePage)).toEqual(["/resources/shopify-gateway-integration", "/resources/woocommerce-gateway-integration"]);
  for (const plan of impact.planReview) expect(plan.changedSourceFiles).toContain(file);
});
