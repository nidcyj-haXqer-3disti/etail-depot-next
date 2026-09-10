# Etail Depot Next — start here

**A fresh-project Codex build brief and source package. Not an application release.**
Prepared 8 September 2026. No GitHub repository, Netlify project, database, or account was created by preparing this package.

## What this package is for

Build Etail Depot again as one coherent account-first product, rather than editing or layering onto the previous application. Use a **new private GitHub repository**, **new Netlify project**, **new PostgreSQL database**, **new Identity configuration**, and **new secrets**. Keep the existing applications unchanged.

Proposed name for both new resources: **`etail-depot-next`**. This name has not been reserved or checked for availability. The expected GitHub owner is `nidcyj-haXqer-3disti`; verify the signed-in account before creation. If the name is occupied by an unrelated project, stop and ask for a new name. Do not adopt or overwrite it.

## The easiest handoff

1. Extract this ZIP into a **new empty folder**. The folder containing this file and `AGENTS.md` is the project root.
2. Open that folder in a local Codex coding workspace, IDE integration, or CLI. Paste the contents of **`01_PASTE_IN_CODEX.md`** into a new task. Do not open the existing Etail Depot repository.
3. Let Codex read the full brief, inspect the supplied source material, and begin the first implementation milestone. It should create the new GitHub resources when an authorized tool is available. It must report the exact permission step when creation or deployment is blocked, not claim that those actions happened.

### Using Codex cloud in a browser instead

Codex cloud checks out a selected GitHub repository. Create a **new private** `etail-depot-next` repository, place the **extracted package contents** at its root, authorize that repository for Codex, and create/select its environment. Then paste `01_PASTE_IN_CODEX.md`. The package is intentionally below 100 files before implementation; include hidden `.github` and `.gitignore` files. The GitHub upload limit counts nested files too. Uploading the ZIP itself does **not** make its contents available as repository source unless a task explicitly extracts it. There is no automatic ZIP-import workflow in this package. [C1]

If your Codex interface supports file attachments, it may accept the ZIP directly, but attachment/extraction support varies. The reliable options are a local extracted folder or an initialized repository containing the extracted files. Do not rely on a file attached to a different chat being visible in Codex.

## Read these first

| File | Purpose |
|---|---|
| `01_PASTE_IN_CODEX.md` | Short launch prompt to paste into Codex. |
| `02_MASTER_BUILD_PROMPT.md` | End-to-end implementation mandate. |
| `AGENTS.md` | Persistent project rules and working agreements. |
| `docs/SOURCE_PRECEDENCE.md` | Resolves conflicts between this new-build request and older material. |
| `docs/PRODUCT.md` | Three account types, product scope, and commercial rules. |
| `docs/SYSTEM_MAP.md` | Suggested clean module tree and dependency boundaries. |
| `docs/DATABASE_AND_DOMAIN.md` | New schema responsibilities and financial invariants. |
| `docs/WORKFLOWS.md` | One card workflow, acquiring flow, and event processing. |
| `docs/GITHUB_PLAN.md` | New repository, milestones, issue backlog, review and CI. |
| `docs/NETLIFY_DEPLOYMENT.md` | New site, database, Identity, environment separation, release and live checks. |

The two original Excel workbooks and original product master are in `sources/original/`; the previous redesign is historical context, **not an instruction to migrate the old system**. The original logo and symbol are in `assets/brand/`. No old application code, font files, credentials, or customer records are included.

## What Codex should deliver

A working new project—not just more documents—with Personal, Household and Seller account contexts; one card-creation flow; acquiring and issuing; scoped permissions; durable mock-provider operations; correct membership/rewards; management/economics; partner tools; tests; a versioned API; and a verified new Netlify sandbox.

The first milestone is a complete **Accounts + access + canonical card-request** vertical slice. The other milestones remain required; the first slice is not the final product. Review evidence before merging feature PRs. A protected sandbox can be deployed during implementation. Public registration should be opened only after the release review; keep email confirmation required and previews private.

The prompt allows new-project provisioning and sandbox work. It does not authorize modifying existing sites, moving customer data, buying a plan, changing DNS, or turning on real-money processing.

## Package validation

Codex can run:

```bash
python3 tools/verify_handoff.py
python3 -m unittest discover -s tests -p 'test_handoff_tools.py' -v
python3 tools/seed_github_plan.py
```

These helpers require Python 3.10 or newer; see `tools/README.md`. Run initial hash validation before intentional implementation edits.

The third command is a **dry run**. It creates nothing. These checks validate the handoff and helper behavior, not the future application. Implementation must supply and execute its own build, PostgreSQL, security and browser tests.

## Continue across tasks

The full project is larger than one short task. Codex must record completed work, exact checks, remaining blockers and the next action in `planning/STATUS.md`; open the next milestone prompt from `prompts/` when continuing. Never restart with a second architecture or duplicate module.

[C1] Official Codex cloud/environment documentation, checked 2026-09-08: https://learn.chatgpt.com/docs/environments/cloud-environment
