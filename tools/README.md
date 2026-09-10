# Local development and handoff tools

These are optional implementation-assistance tools for Codex. The owner does not need to run them manually to use the prompt. Require Python 3.10 or newer and the standard library. Only the explicitly requested planning import needs an installed/authenticated GitHub CLI. The verification and target guard use no network.

## Clean local service preview

The fresh application uses only `etail_depot_next_services_preview` and `etail_depot_next_services_test`. Retained `etail_depot_next`, `etail_depot_next_test`, and `etail_depot_next_preview_v2` application data stays untouched. The existing project-owned PostgreSQL cluster uses `etail_depot_next` for catalog administration only; application connections cannot target it.

With Node 24.19.0, pnpm 11.19.0, dependencies installed, and `pnpm db:serve` running, prepare the preview explicitly:

```bash
node tools/run-with-database.mjs --prepare-preview
```

This command verifies the native PostgreSQL18.6 runtime, loopback port55439, `etail_local` owner, project marker and disabled real money. It creates only the fixed fresh preview name when absent, and rejects collisions rather than adopting an unrelated database. The required database comment is `ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-v1:preview`. It applies reviewed migrations and then invokes the one-time seed. No arbitrary database name or hosted/CI preview is accepted.

The seed creates Alex Morgan, Jamie Morgan and Morgan Support through identity binding. Alex explicitly enrolls in Cardholder and Merchant services. Jamie accepts one secondary-card invitation and a separate Pop-up shop invitation. Morgan receives explicit support assignments only. Two cards, purchases, three merchant units, channels, payments, a refund, a transfer and Jamie’s support case are created through canonical commands. No historical balances, real funds or provider approvals are inserted.

A new seed generation must contain no application rows. Interrupted preparation retries its same saved command IDs. After the marker becomes `COMPLETE`, preparation never restores permissions or overwrites saved customer edits. Explicit preparation may still apply a reviewed additive migration; an applied migration is never edited in place.

```bash
pnpm build
pnpm preview:fixture
```

Startup verifies the completed generation and starts the existing production build on `http://127.0.0.1:3100`. It does not create, migrate or seed a database. Automated database/browser checks use the guarded test runner, which prepares only `etail_depot_next_services_test` with comment `ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-v1:test`. The test seed is the same canonical sample and is also one-time; tests add isolated records rather than restoring retired fixtures.

Read-only verification of the original fresh sample:

```bash
node tools/run-with-database.mjs --preview tsx tools/verify-clean-preview.ts
```

This checks service projections, exact balances, primary/secondary boundaries and assigned support isolation. Later deliberate user changes can correctly make fixed initial-state expectations fail; the checker never resets data.

To prove repeated preparation changes no rows, first make sure no browser/test is changing this preview, then run:

```bash
APP_ENV=local ENABLE_REAL_MONEY=false \
DATABASE_URL=postgres://etail_local@127.0.0.1:55439/etail_depot_next_services_preview \
node tools/snapshot-clean-preview.mjs before
node tools/run-with-database.mjs --prepare-preview
APP_ENV=local ENABLE_REAL_MONEY=false \
DATABASE_URL=postgres://etail_local@127.0.0.1:55439/etail_depot_next_services_preview \
node tools/snapshot-clean-preview.mjs after
```

The checker hashes every public row and column definition in a read-only transaction without logging record bodies. It writes exclusive owner-only receipts under `.local/preview-replay-fresh-services-v1`; existing receipts are never overwritten. Pending migrations or intentional concurrent edits should produce a mismatch, not be hidden.

The first fresh test generation is preserved whole as `etail_depot_next_services_test_retired_d52`, outside the application allowlist. It was renamed without terminating clients; all 37,695 rows across 51 tables were verified unchanged. A new canonical test database was initialized from the three reviewed migrations and canonical seed. No ledger provenance was invented or overwritten. Private retirement archives and sanitized checks are recorded under `.local/fresh-services/dispute-retirement` and `artifacts/fresh-services`.

The previous source is archived at `.local/fresh-services/baseline.tar`, with its revision/hash in `recovery-receipt.json`; the original databases remain in place. This is recovery retention, not a claim of an independently tested restore. The fresh baseline never migrates those databases. Do not copy their rows, keys, sessions or environment into the fresh generation.

Read-only visual and accessibility capture against the running fresh preview:

```bash
node tools/capture-service-preview.mjs
```

The capture uses the fixed loopback preview, named fictional login personas and actual authorized projections. It opens views and confirmation dialogs without executing customer commands, records accessibility/reflow checks and confirms projections are unchanged. Login creates local sessions. Existing capture output is never overwritten.

## Validate the initial package

```bash
python3 tools/verify_handoff.py
python3 -m unittest discover -s tests -p 'test_handoff_tools.py' -v
```

Run the manifest check **before editing the handoff or implementing the application**. It hashes the distributed source/specification files. After intentional implementation edits the original manifest should naturally differ; preserve the original handoff receipt and introduce a separate implementation release manifest. Do not weaken an application test to preserve an initial package checksum.

`--skip-hashes` is only a package-author structural diagnostic, not an equivalent integrity check. The fixture calculation verifies supplied arithmetic examples. It does not recompute the entire management cost workbook, enforce runtime financial rules, or validate PostgreSQL.

## Check a proposed target without making any change

```bash
python3 tools/check_target.py github --repo nidcyj-haXqer-3disti/etail-depot-next
```

The Netlify check deliberately rejects an unbound site. After creating and reading back the NEW site metadata, record its actual ID and canonical origin in `project-targets.json`. Then use its exact ID/name with the `netlify` subcommand. A local guard is not proof of remote ownership, uniqueness or isolation; read back those properties using authorized account tools.

## Preview GitHub planning — creates nothing

```bash
python3 tools/seed_github_plan.py
```

## Apply GitHub planning — explicitly creates records

After the new private repository is created, verify its numeric ID, record it in the local `project-targets.json`, and commit that same bound marker to the new repository's default branch. Do not reuse a repository merely because its name matches. Then:

```bash
python3 tools/seed_github_plan.py --apply --repo nidcyj-haXqer-3disti/etail-depot-next
```

The helper rechecks privacy, full repository name, stable ID and marker before any planning write. It creates missing labels, milestones and marked issues. Existing records are not overwritten; closed issues are not reopened. Repeating a completed/partially completed import reconciles existing markers. Never run two imports concurrently: this helper is not a distributed lock or a transactional GitHub API.

If naming changes are approved before creation, update both target and backlog repository values, not the denied resources. Do not pass an old repository to bypass a permission problem.

The helper does not create repositories or Projects boards, configure branch protection, push source, set secrets, merge PRs, deploy, or delete anything. Those tasks require separate authorized tools and the checks in `docs/GITHUB_PLAN.md` and `docs/NETLIFY_DEPLOYMENT.md`.

Tests mock GitHub responses. A successful test run is not a successful GitHub import.
