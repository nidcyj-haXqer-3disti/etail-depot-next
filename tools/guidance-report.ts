/** Review presentation only. Never includes guide prose or private skill contents. */
import assert from "node:assert/strict";
import type { GuidanceMap, guidanceImpact } from "./review-guidance.ts";

type Impact = ReturnType<typeof guidanceImpact>;
export type ReviewContext = { comparison: string; head: string; fullReviewReason?: string; validationOnly?: boolean };

const escape = (value: string) => value.replace(/[\r\n\t]/g, " ").replace(/[&<>"'\\`*_\[\]()#!|]/g, character => `&#${character.charCodeAt(0)};`);
const code = (value: string) => `<code>${escape(value)}</code>`;
function list(values: readonly string[], limit = 40): string {
  return values.slice(0, limit).map(value => `- ${code(value)}`).join("\n") +
    (values.length > limit ? `\n- ${values.length - limit} more entries omitted. Review the full JSON report and diff.` : "");
}

export function renderGuidanceReview(map: GuidanceMap, impact: Impact, context: ReviewContext): string {
  const lines = ["## Guidance change review", "",
    `${map.workflows.length} pilot workflows; ${map.agentPaths} Agents decision paths validated. This is a review prompt, not factual approval or release authorization.`, "",
    `${map.plans.length} task-plan result IDs also have source mappings. Plan review below is separate from the three pilots. When supplied locally, private skill citations receive their own source review.`, "",
    `Comparison: ${code(context.comparison)}`, "", `Checked-out commit: ${code(context.head)}`, "",
    map.privateSkillChecked ? "Private skill references checked locally. Keep this report private." :
      "**Private skill not checked.** Public CI does not access private skill files.", ""];
  if (context.fullReviewReason) lines.push(`**Full pilot review:** ${code(context.fullReviewReason)}`, "");
  if (impact.mappingReviewFiles.length) lines.push(
    "**Dependency definitions may have changed.** Compare added and removed relationships in the diff. This report uses the candidate map; it cannot recover deleted relationships.", "",
    list(impact.mappingReviewFiles), "");
  if (!impact.workflows.length) lines.push(context.validationOnly ?
    "Change impact not assessed: no changed paths supplied." :
    "No mapped workflow was touched. Changes outside the pilot still need ordinary review.", "");
  for (const workflow of impact.workflows) {
    lines.push(`### ${escape(workflow.title)}`, "", `Source revision: ${code(workflow.sourceRevision)}`, "",
      "Changed files:", "", workflow.changedFiles.length ? list(workflow.changedFiles) : "Full pilot review requested; no file-level cause is asserted.", "",
      "Human page sections:", "", list(workflow.guideSections), "",
      "Agents nodes:", "", list(workflow.agentNodes), "",
      "Source and summary files:", "", list(workflow.reviewFiles), "");
    if (workflow.privateSkill.length) lines.push("Private skill sections:", "",
      list(workflow.privateSkill.map(item => `${item.file} → ${item.heading} (${item.sectionRevision})`)), "");
    lines.push("Review the instructions together and record any corrections or why no change is needed.", "");
  }
  lines.push(`### Task-plan review: ${impact.planReview.length} affected result IDs`, "",
    "Generated from the current reachable outcomes and their plan citations. File and directory ownership prompts a review; it does not prove that a changed source supports every instruction. Private skill citation dependencies are reported separately when supplied locally.", "");
  if (!impact.planReview.length) lines.push(context.validationOnly ?
    "Task-plan impact not assessed: no changed paths supplied." :
    "No mapped task-plan source or plan definition was touched in the supplied comparison.", "");
  for (const plan of impact.planReview) {
    lines.push(`#### ${code(plan.resultId)}: ${escape(plan.title)}`, "", `Source revision: ${code(plan.sourceRevision)}`, "",
      "Changed source files:", "", plan.changedSourceFiles.length ? list(plan.changedSourceFiles) :
        "No source-file change is asserted; a plan definition changed or full review was requested.", "",
      "All review triggers:", "", plan.changedFiles.length ? list(plan.changedFiles) : "Full review requested; changed-file coverage is unavailable.", "",
      "Cited public sections:", "", list(plan.sourceUrls), "",
      "Source and plan files to review:", "", list(plan.reviewFiles), "",
      "Compare the cited instructions with this result’s steps, conditions and completion checkpoints. Confirm any correction or record why no plan change is needed.", "");
  }
  if (map.privateSkillChecked) {
    lines.push(`### Private skill source review: ${impact.skillReview.length} affected pages`, "",
      "Derived from website citations in the supplied skill. Review these local sections against the owning human guides; do not publish this report.", "");
    if (!impact.skillReview.length) lines.push(context.validationOnly ? "No changed paths supplied; citation references validated only." : "No cited source changed in the supplied comparison.", "");
    for (const page of impact.skillReview) lines.push(`#### ${code(page.sourcePage)}`, "",
      "Review triggers:", "", page.changedFiles.length ? list(page.changedFiles) : "Full review requested; no file-level cause is asserted.", "",
      "Private sections:", "", list(page.sections.map(section => `${section.file} → ${section.heading} (${section.sectionRevision})`)), "");
  }
  lines.push(`### Outside the pilot: ${impact.outsidePilot.length} known changed files`, "",
    impact.outsidePilot.length ? list(impact.outsidePilot) : context.fullReviewReason ?
      "Changed-file coverage is unavailable. This does not mean other files are unchanged." : context.validationOnly ?
        "No comparison requested; outside-pilot changes were not assessed." : "None in the supplied comparison.", "",
    "Outside-pilot status concerns only the three workflow pilots. A file can appear here and also have an affected task plan above; all other changes still need ordinary review.", "",
    "Registered page paths, Agents node IDs and task-plan source files were checked. Rendered anchors, provider availability, factual accuracy, UI behavior and release readiness require their own checks.", "");
  const markdown = lines.join("\n");
  assert(Buffer.byteLength(markdown) <= 256 * 1024, "Guidance summary exceeds 256 KiB; inspect the JSON report locally");
  return markdown;
}
