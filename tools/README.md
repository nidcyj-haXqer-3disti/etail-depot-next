# Shared website tools

These tools belong to the project and are used by all contributors. Keep command entry points here so local scripts, CI and Netlify use the same implementation. Personal helpers and unredacted evidence belong in ignored local folders.

| Tool or data | Purpose |
| --- | --- |
| `build-public-site.mjs` | Validate the source, export the public website and record its fingerprint |
| `preview-public-site.mjs` | Serve the export through the existing local request boundary |
| `package-public-site.mjs` | Package static output, the Edge boundary and protected platform email handler without deploying |
| `verify-architecture.mjs` | Verify exact source/runtime scope and, with `--artifacts`, packaged files |
| `verify-file-publication.mjs` | Classify Git candidates and reject private or development files in public assets |
| `verify-security.mjs` | Scan active source for credential exposure and unsafe browser handling |
| `verify-hosted-site.mjs` and `hosted-verification.ts` | Manual live HTTP checks with separate health/boundary modes, tagged requests and private results |
| `verify-production-seo.mjs` | Verify production indexing and negative hosting contexts locally |
| `verify-reference-release.mjs` | Verify approved legal/reference source hashes and licence scope |
| `verify-lint-glob.mjs` | Verify the reviewed lint-tooling path behavior |
| `review-guidance.ts` and `guidance-report.ts` | Validate three feature-owned guidance references and report affected human, Agents and optional private skill instructions |
| `guidance-review-ci.ts` | Compare the exact GitHub event commits and add a public job summary without accessing private skills |
| `reference-release.json` | Stable build-check manifest; source-only, never a website download |
| `generate-inline-brand-images.mjs` | Maintain the existing embedded brand system and approved asset copies |
| `generate-guide-image-previews.mjs` | Generate the exact guide preview images and bindings; `--check` verifies without rewriting them |
| `generate-social-previews.mjs` | Generate approved social artwork from the existing page inventory |
| `assets/guide-image-sources.mjs` | Reviewed guide image frames |
| `assets/guide-image-previews.json` | Generated image sizes and byte-hash receipt |
| Other `public-*` and `netlify-email-compat.ts` modules | Shared package policies, identity checks and protected email compatibility |

Use pinned Node and pnpm with the frozen lockfile. The exact approved page counts and source scope come from [reference-release.json](reference-release.json); do not maintain a second hardcoded total here.

Run the four release commands in order: `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify`, `pnpm verify:package`. `package:review` and `verify:package:review` prepare a separate local noindex package. None uploads, deploys or submits URLs to search engines. Follow the [manual deployment runbook](../docs/NETLIFY_DEPLOYMENT.md) only when publication is authorized.

Guide generator paths resolve from the repository root. Image outputs remain under their owning `src/features/resources/integrations/` assets directories. Keep pixels, redactions, source receipts and loading behavior intact. Do not bypass a failed hash check by replacing the expected value without reviewing its source.

Hosted checks use `pnpm verify:hosted --deploy <Netlify-deploy-ID>` and the separate `--boundaries` mode described in the [Netlify runbook](../docs/NETLIFY_DEPLOYMENT.md#hosted-verification-and-netlify-error-reporting). Keep expected 404/410 probes distinct from failed assertions. Do not add these network calls to local release gates or CI.

## Guidance change review

The initial pilot covers account access, WooCommerce credentials and additional DBA setup. Source references live with the guide content. Agents references live with its decision definitions. This is a small dependency map, not another content library. The local review command has no network access and writes no files. The separate CI wrapper may fetch one missing base commit from the approved public repository and append the public job summary.

```sh
pnpm review:guidance
pnpm review:guidance --base HEAD --markdown
pnpm review:guidance --changed src/features/resources/integrations/woocommerce/woocommerce-file-transfer.tsx
```

`--base` includes committed, staged, unstaged and untracked changes relative to the selected commit. Use the PR base commit for a whole branch review. `--changed` can be repeated to inspect actual or hypothetical file changes without editing them. File matching is conservative: an unrelated paragraph in a shared file or an image-preview replacement can still prompt review. Changes outside these three pilots still need ordinary review. A separate task-plan section derives every reachable plan’s citations and maps them to page source files/directories and route entry points. It identifies affected result IDs when those sources change, including new or removed files within a mapped directory. A file can remain outside the three pilots while also affecting a task plan. Missing citation ownership fails validation.

For the private setup skill, add `--skill-dir` with its local folder. The tool reads its `references/guidance-dependencies.json` pilot map and also derives page dependencies from the actual `https://etaildepot.com/` citations in `SKILL.md` and `references/*.md`. Cited pages must have explicit source ownership. A separate local section lists affected skill headings, including Shopify, custom checkout, Webhooks and testing; it contains references and hashes, not the private prose. The skill is optional for public CI and remains private; without the option, output explicitly says it was not checked. A supplied but incomplete skill map fails validation. `--markdown` emits a readable review report. `--json` emits a machine-readable report with exact base and HEAD commits; save receipts under ignored `.local/`, never `public/`.

The report is a review aid, not a complete release receipt. Source revisions hash the guide files; `HEAD` does not identify uncommitted human or Agents edits. Private section hashes appear only for affected workflows and cited pages, so an empty impact list is not a private-skill version record. Use the [versioned guidance handoff](../docs/GITHUB_DELIVERY.md#versioned-guidance-handoff) to record the fresh build/package fingerprint and complete private skill hashes separately.

Source and section hashes identify the compared text, not approval, accuracy or freshness. The command checks registered page paths, actual Agents node IDs and task-plan source ownership. It does not infer semantic correctness from matching hashes. It does not validate rendered section anchors, provider account availability or the truth of the instructions. Check anchors against the current export and review the affected prose. Review dependencies include semantic summaries and links as well as actual code imports. No automatic rewriting, search changes or publication occurs.

The GitHub wrapper compares committed trees only: PR event base against the checked-out merge SHA, or push `before` against the checked-out SHA. New branches and manual runs request full pilot review without asserting changed-file coverage. A missing required base fails. Changes to mapping owner files or review tooling request all pilots, including a manual check for removed relationships. Markdown lists are bounded and any omitted entries are identified; the full local JSON remains available. The report uses the candidate map and never executes source from the old commit.

To revise a mapped workflow, update its owning guide, run the report, review each affected human summary and Agents node, and review the matching private skill section when available. Keep detailed evidence private and the contributor status concise. The ordinary release gates and publication authorization still apply; this command is not a new release approval.
