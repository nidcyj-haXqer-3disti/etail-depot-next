# GitHub delivery plan — new repository only

> **Historical provisioning and milestone plan.** Use [Product and technical design](PRODUCT_TECHNICAL_DESIGN.md) and [Delivery plan](../planning/DELIVERY_PLAN.md) for the current two-service model, existing-resource baseline and next work. Repository creation instructions and original milestone labels below preserve the initial handoff; they do not authorize reprovisioning or restarting completed foundations.
>
> Exact target isolation, security, feature-branch/review requirements, release approval and commercial obligations remain in force. Historical planning or workflow status does not prove current implementation or CI completion.

## Repository creation and initial import

Proposed private repository: `nidcyj-haXqer-3disti/etail-depot-next`. Verify authenticated ownership, absence of an unrelated repository with that name, current working directory, and every existing Git remote. Abort if any remote points to the old applications. Create the new private repository with authorized GitHub tools or CLI. `gh repo create` is an available CLI operation when installed/authenticated; do not infer that every connector exposes repository creation. [G1]

Make an initial commit containing this handoff at repository root, including `project-targets.json` and `.github` files. Never initialize inside the existing application tree. Record the actual new repository ID and confirmed privacy before planning writes. The user can instead create/import the new private repository through GitHub's UI for Codex cloud setup. Upload extracted files, not just an opaque ZIP.

The package helper `tools/seed_github_plan.py` imports labels, milestones and issues **only into the intended private repository with matching project marker**. Default is dry-run, without network calls. Before `--apply`, bind the verified numeric repository ID locally and commit the same bound project marker to the new default branch. With `--apply --repo OWNER/etail-depot-next`, the helper verifies current remote repository metadata and that marker first. Run one importer at a time. It never creates a repository, pushes code, deletes issues, merges PRs, configures secrets, or deploys. The helper is optional; authorized tools can perform equivalent explicit scoped operations.

## Milestones

| ID | Milestone | Exit evidence |
|---|---|---|
| M0 | Foundation and new project identity | Target-bound new repo/site plan; source mapping; stack/lockfile; runnable shell and real CI. |
| M1 | Accounts, membership and centralized access | Exactly three account types; typed ownership/sponsorship; server capabilities; invitation/privacy tests. |
| M2 | One Cards workflow | One resumable request/form/command; issuer operation replay; actual UI/database journey. |
| M3 | Issuing, ledger and realistic simulation | Atomic funding/limits; one purchase intent; replay-safe completion; correct repayments/rewards. |
| M4 | Acquiring and Household/Seller delegation | One merchant flow; partial invoice/guest payment; reserves/refunds/payouts and separation tests. |
| M5 | Operations, source economics and partners | Cases, source-mapped costs, three economic views, partner isolation and guarded keys/webhooks. |
| M6 | Full-stack acceptance and security hardening | All required flows, concurrency, browser/mobile/accessibility, PWA/files and reconciliation. |
| M7 | New Netlify sandbox release | New-site deployment, isolated database/Identity, real hosted acceptance and reviewed public registration. |

All eight are part of the complete target. Do not equate the first card slice with full project completion. Issue dependencies/acceptance are in `planning/backlog.json` and the readable CSV; the JSON is authoritative for imports.

## Project board

Create a NEW private GitHub Project titled **Etail Depot Next — Delivery** when permitted. Link only the new repository. Columns: Backlog, Ready, In progress, In review, Blocked, Done. Fields: milestone, functional area, priority, acceptance IDs, dependency IDs, latest verified SHA, release gate. Use issue IDs from the backlog in every card. Do not attach new tasks to the old issue #5.

GitHub Projects permissions can differ from repository permissions. Check available tooling before creation; `gh project create` is supported by the CLI when authorized. [G2] If no project capability is available, retain the repository's labels/milestones/issues and report the board as pending. Do not block coding or secretly broaden account permissions.

## Branches, PRs and merging

Use `main` as the default branch after bootstrap. Work on `feature/EDN-xxx-short-name` or `fix/EDN-xxx-short-name`. Each PR states problem, source/contract IDs, implementation, relevant schema changes, screenshots, exact tests, risk and rollout. Include `Closes #...` only when acceptance passes, not when a document is drafted.

No direct-to-main feature code; no self-modifying workflow that compiles and pushes arbitrary app files; no force push or admin bypass. Do not merge feature PRs without review approval. If a sole-owner repository cannot satisfy a proposed review rule, state that limitation and obtain the owner's manual review; do not claim an independent approval. Bootstrap commit is the only pre-feature exception.

Use branch protection/rulesets where the plan/permissions allow: reviewed PR, conversation resolution, required current-SHA checks and no force push/deletion. Unique job names avoid ambiguous status checks. Read back protection state and do not say it is enforced merely because a template exists. [G3]

## CI and release separation

Every feature PR must run actual commands for lint, typecheck, unit/domain, real PostgreSQL integration, provider/replay, concurrency, architecture uniqueness, API/OpenAPI, production Next build, browser desktop/mobile, accessibility and security review. An aggregate `release-evidence` job fails if a prerequisite is failed, missing, skipped or not on the tested SHA. Do not turn a missing database into a skip-and-pass test. Pin checked third-party Actions to reviewed immutable SHAs when generating the actual workflows.

The supplied `templates/ci.yml.example` is deliberately disabled and incomplete until implementation adds its real commands. It is not a passing workflow. Handoff/helper tests do not satisfy application checks. A dependency audit is useful but not a security certification; unresolved exploitable high/critical findings need fixing before release, not “continue-on-error”.

Netlify PR previews should attach actual preview/migration evidence. Untrusted fork code cannot receive production secrets or run privileged deploy jobs (`pull_request_target` must not execute untrusted checkout). Build artifacts and screenshots exclude passwords, tokens and real customer data.

## Task closeout

Update `planning/STATUS.md` with current branch/SHA, completed acceptance criteria, executed checks, issue links, blocked permissions and next task. Use `prompts/` to resume. Keep read-only source materials unchanged. No unreported remaining scope and no background-work promises.

[G1] https://cli.github.com/manual/gh_repo_create
[G2] https://cli.github.com/manual/gh_project_create
[G3] https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
