# Local development and handoff tools

These are optional implementation-assistance tools for Codex. The owner does not need to run them manually to use the prompt. Require Python 3.10 or newer and the standard library. Only the explicitly requested planning import needs an installed/authenticated GitHub CLI. The verification and target guard use no network.

## Current D73 preview model

The active product contract is `docs/OWNER_CARDS_TERMINALS_DESIGN.md`. Keep the same marked D69 preview/test database generations and completed preparation receipts. Four additive D73 migrations create separate Card money and Merchant money, replace active merchant hierarchy with flat terminals, and replace monthly person limits with total card allowances. Posted history and historical pending deposit processing are retained. Applied migrations are immutable.

Fresh initialization uses owner/cardholder/terminal-user assignments, per-card total allowances, connected checkout and a reviewed settlement into Merchant money. The account owner need not hold a card. Completed historical preparation is never replayed to overwrite existing permissions, balances or edits. A read-only check supports both the preserved completed sample and the current fresh seed.

Only explicit `node tools/run-with-database.mjs --prepare-preview` may apply pending preview migrations. Startup remains read-only. Historical D69 instructions and sample descriptions below explain retained data; their primary/secondary and monthly allowance terminology is superseded by D73.

## D69 prepaid local preview and test generations

The fresh application uses only `etail_depot_next_services_preview` and `etail_depot_next_services_test`, now marked `fresh-services-d69`. D69 preserved the originals as `etail_depot_next_services_preview_retired_d69` and `etail_depot_next_services_test_retired_d69`, retaining their OIDs and records with `ALLOW_CONNECTIONS=false`. They are offline recovery records, outside the application allowlist. Do not re-enable or connect application code to them, or copy their rows into the new generation.

The guarded one-time catalog retirement selects both fixed names together, verifies runtime/owner/marker/OIDs, refuses active clients and never terminates them. It saves private plan/preservation/completion receipts in `.local/fresh-services/d69-retirement`, disables new connections and renames the pair without dropping databases or altering application rows. An already-retired check is a no-op; a collision or mismatched receipt is an error. `tools/retire-d69-databases.mjs --check` is read-only when invoked with explicit `APP_ENV=local` and `ENABLE_REAL_MONEY=false`, no ambient database URL and the owned native runtime. Do not repeat retirement as a generic reset workflow.

Retained `etail_depot_next`, `etail_depot_next_test`, `etail_depot_next_preview_v2` and older retired application data stay untouched. The owned PostgreSQL cluster uses `etail_depot_next` for catalog administration only; application connections cannot target it. Hosted Database and Identity are separate and unchanged by this local replacement.

With Node 24.19.0, pnpm 11.19.0, dependencies installed, and `pnpm db:serve` running, prepare the preview explicitly:

```bash
node tools/run-with-database.mjs --prepare-preview
```

This command verifies the native PostgreSQL18.6 runtime, loopback port55439, `etail_local` owner, project marker and disabled real money. It creates only the fixed fresh preview name when absent, and rejects collisions rather than adopting an unrelated database. The required database comment is `ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-d69:preview`. It applies reviewed migrations and then invokes the one-time seed. No arbitrary database name or hosted/CI preview is accepted.

The D69 seed creates Alex Morgan, Jamie Morgan and Morgan Support through fictional identity binding. Alex explicitly enrolls in separate Cardholder and Merchant services. Jamie accepts one secondary-card invitation and a separate Pop-up shop invitation. Morgan receives explicit support assignments and a separate Merchant deposit-processing capability; no customer money authority follows from support alone.

Canonical commands add 65000 cents to the shared Cardholder group, set primary/secondary monthly limits, issue two cards without funding them, prepare three merchant units and seven-presentation channels, and publish customer checkouts. Real connected sandbox card purchases fund the Merchant payment records. A full refund returns to the original group; a reviewed deposit is processed explicitly by the assigned operator. Jamie’s support case uses the existing private case owner. No old balances, legacy rows, fabricated journal provenance, real funds or provider approvals are inserted. Raising a limit or issuing a card never funds it.

A new seed generation must contain no application rows, apart from the one verified migration-owned `prepaid_cutover` configuration row. `tools/prepaid-seed-config.mjs` checks its exact immutable shape, valid activation time and trigger before preparation/startup. Migration receipts remain separate. The seed marker key is exactly `fresh-services-d69`; an old or unexpected generation is rejected, never adopted.

Interrupted preparation retries its same saved command IDs. After the marker becomes `COMPLETE`, preparation never restores permissions or overwrites saved customer edits. Explicit preparation may still apply a reviewed additive migration; an applied migration is never edited in place. Startup verifies completed preparation and performs no migration or seed writes.

```bash
pnpm build
pnpm preview:fixture
```

Startup verifies the completed generation and starts the existing production build on `http://127.0.0.1:3100`. It does not create, migrate or seed a database. Automated database/browser checks use the guarded test runner, which prepares only `etail_depot_next_services_test` with comment `ETAIL_DEPOT_NEXT_GREENFIELD_2026:fresh-services-d69:test`. The test seed is the same canonical sample and is also one-time; tests add isolated records rather than restoring retired fixtures.

Read-only verification of the canonical D69 sample:

```bash
node tools/run-with-database.mjs --preview tsx tools/verify-clean-preview.ts
```

This checks current service projections, shared funds/person allowances, connected Merchant payment/refund/deposit records and primary/secondary/operator boundaries. Its expectations must match the D69 seed, not the retired per-card allocation/instant-transfer sample. Later deliberate user changes can correctly make fixed initial-state expectations fail; the checker never resets data.

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

The checker hashes every public row and column definition in a read-only transaction without logging record bodies. It writes exclusive owner-only receipts under `.local/preview-replay-fresh-services-d69`; existing receipts are never overwritten. Pending migrations or intentional concurrent edits should produce a mismatch, not be hidden.

Earlier D52 retention remains historical: the first fresh test generation is preserved whole as `etail_depot_next_services_test_retired_d52`, outside the application allowlist. It was renamed without terminating clients; all 37,695 rows across 51 tables were verified unchanged. A new canonical test database was initialized from the three reviewed migrations and canonical seed. No ledger provenance was invented or overwritten. Private retirement archives and sanitized checks are recorded under `.local/fresh-services/dispute-retirement` and `artifacts/fresh-services`.

The previous source is archived at `.local/fresh-services/baseline.tar`, with its revision/hash in `recovery-receipt.json`; the original databases remain in place. This is recovery retention, not a claim of an independently tested restore. The fresh baseline never migrates those databases. Do not copy their rows, keys, sessions or environment into the fresh generation.

Read-only visual and accessibility capture against the running fresh preview:

```bash
node tools/run-with-database.mjs --preview tsx tools/capture-prepaid-preview.mjs d69-preview-ui
```

The capture uses the fixed loopback preview, named fictional login personas and actual authorized projections. It opens views and confirmation dialogs without executing customer commands, records accessibility/reflow checks and confirms projections are unchanged. Login creates local sessions. Existing capture output is never overwritten.

## Historical handoff package and current source-only check

```bash
python3 tools/verify_handoff.py
python3 -m unittest discover -s tests -p 'test_handoff_tools.py' -v
```

Those are the original pre-implementation package commands. They hash the distributed source/specification files; current intentional implementation edits naturally differ from that handoff. Direct traversal of installed dependency JSONC also fails in the current tree; retain that diagnostic rather than claiming the original commands passed.

Use `pnpm test:handoff` (the existing `tools/test-handoff.py` source-only wrapper) for the scoped historical source check. It is not equivalent to the original whole-tree checksum or to current application acceptance. Current lint/types, database/concurrency, API/browser/accessibility, email/session, architecture/security and packaging scripts remain mandatory for their affected release scope. Never weaken an application test to preserve an initial-package checksum.

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
