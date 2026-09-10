# Source precedence and explicit overrides

## End-to-end journey correction — 2026-09-10

The user rejected both D60 sandbox journeys as a poor experience. D61 and [the journey refinement](SANDBOX_JOURNEY_REFINEMENT.md) govern the next implementation: task-oriented first use, one card details/review form, connected merchant setup/channel/checkout, visible accepted cardholders and clear invitation handoffs. Reduce redundant screens while preserving explicit financial actions, canonical commands, permissions and reliable retries. Passing functional tests alone do not establish experience quality.

## Hosted sandbox availability — 2026-09-10

The latest explicit request authorizes the full implemented customer sandbox for verified email members. [Hosted sandbox product](HOSTED_SANDBOX_PRODUCT.md) and D60 supersede D59’s prohibition on provider-member setup and mutations. Deliberate sandbox opt-in enables simulated product participation; financial services and permissions still require the existing explicit commands. Hosted fixture login, real money and automatic operator grants remain forbidden.

## Latest approved fresh rebuild — 2026-09-10

[D52 — Fresh two-service application](FRESH_TWO_SERVICE_BUILD.md) supersedes the internal three-kind provenance and compatibility-retention provisions below for the active implementation. Exactly CARDHOLDER and MERCHANT services, explicit service memberships, direct primary/submerchant ownership and fresh databases are now approved. Prior source and databases are recovery artifacts, not active runtime branches.

## Latest approved implementation — 2026-09-10

D51 and [Two-service consolidation](SERVICE_CONSOLIDATION.md) govern the approved D50 implementation cleanup. New merchant creation is actor-based, independent of Cardholder enrollment; directly owned submerchants belong to the exact responsible primary. Historical host/receipt records are preserved for authorization and accounting, not used as customer account tiers. The account selector and superseded account-based merchant entry routes are retired. Cardholder participation and Merchant access remain separate, and exact selected-card context carries through servicing.


## Decision: a fresh project, not a migration
The latest request is to create an entirely new project using Codex. It supersedes the migration/cutover instructions in the previous redesign. Build a new repository and schema from a clean baseline; keep every old project unchanged. The new public API starts at `/api/v1/`; there is no v1/v2 coexistence or legacy endpoint adapter requirement because no old clients belong to this new project.

## Latest Amex benchmark correction — 2026-09-09

The user rejected the previous cleanup as an insufficient Amex benchmark. [The experience correction](AMEX_EXPERIENCE_CORRECTION.md) governs the next refinement: selected-card identity, financial summary and controls together; merchant payment tables with persistent filters and exact-record navigation. Functional test counts do not establish visual or journey parity. Public references, actual inspected illustrations, regional/product limits and remaining gaps must remain explicit. No invented billing, rewards or provider settlement data may fill an incomplete screen.

## Latest experience cleanup — 2026-09-09

The user now requests clean, focused dashboards, plain customer language and removal of obsolete account behavior and demo data. [The cleanup design](SERVICE_EXPERIENCE_CLEANUP.md) governs this refinement. The active local preview uses fresh current-model data; the prior preview is retained privately for recovery, not shown to customers. Startup must never repopulate historical fixtures. The canonical financial and permission engines remain; historical test fixtures continue to prove their invariants in the separate test database.

## Latest dashboard correction — 2026-09-09

The user rejected choosing Personal/Household/Seller containers after opening Cardholder services. [The service dashboard design](SERVICE_DASHBOARD_DESIGN.md) now governs both customer entrances. A named primary profile links existing card scopes without merging their permissions or financial records. New card requests use a persisted explicit destination; existing resources resolve their actual recorded scope. Merchant services opens on collections and its primary/submerchant hierarchy. Primary merchant creation grants no Cardholder access, and multiple named submerchants may share a controller without another account-type choice. This supersedes the earlier one-unit-per-master/host restriction and residual directory recommendations; immutable primary responsibility and exact-unit accounting remain.

## Latest two-service direction — 2026-09-09

The newest explicit user instruction supersedes the three-account customer model below. Present exactly Cardholder services and Merchant services. Named primary cardholders oversee their card group; secondary cardholders see only their own cards/data. Primary merchants oversee their own submerchant data; submerchants see only their own scope. Follow [the current design](TWO_SERVICE_DESIGN.md). Preserved account enum values are internal financial provenance, not product tiers. Service permissions are independent. This also supersedes creator-private merchant work being hidden from the responsible primary, and secondary cardholder/Manager access to account-wide card/activity data. Earlier sections are historical decisions where they conflict.

## Prior three-account direction — 2026-09-09 (superseded customer model)
The latest explicit request replaces SELLER with MERCHANT as the third account type. Exactly PERSONAL, HOUSEHOLD and MERCHANT remain. Personal has own-card controls and simple link/QR collections; Household adds shared cards, individual practice budgets, all seven channel formats and named helper access; Merchant owns gateway setup and the payment operations for its connected accounts. Role and product tier never imply spending or access to a host’s private finances. See [the executable sandbox design](THREE_ACCOUNT_SANDBOX_DESIGN.md).

The earlier draft-only restrictions describe prior delivery stages. The new local sandbox implements explicit practice-card funding/purchases, test gateway/enrollment/activation, approved/declined payments, full refunds and bounded test payouts through one immutable ledger. These do not enact live verification, borrowing, commercial fees/rewards, provider processing or bank transfers. D14–17 live economic decisions remain unresolved. Historical source/evidence keeps its original terminology and results.

## Authority order
1. Latest explicit user decisions in the Codex task, subject to safety boundaries.
2. `project-targets.json`, this file, `02_MASTER_BUILD_PROMPT.md`, and the current specifications in `docs/` and `contracts/`.
3. Original master in `sources/original/Master_AI_Agent_Prompt_Netlify_Member_Commerce_Platform.md` for commercial formulas, product obligations and full feature outcomes not explicitly overridden here.
4. Original customer workbook, then original management workbook.
5. `sources/original/Account_First_Redesign_Reference.md` for rationale and historical diagnosis. Its existing-project names, commit IDs and migration plan are historical, NOT targets.
6. Official third-party documentation for implementation facts. The latest 2026-09-08 user correction specifies Amex's actual front-end experience as the reference for issuing, account control and merchant operations, with the existing 90%+ target. Start with `docs/research/amex/FRONTEND_EXPERIENCE.md`: visually inspected screens, navigation, page layout, controls, forms and interaction sequences. Business/technical studies are supporting material; `planning/amex-comparison.json` remains the earlier unchanged task baseline, not a visual similarity score. Separate viewed screenshots, described interactions, regional/release differences, proposed Etail screens and missing evidence. Amex evidence does not override Etail pricing, liability, eligibility or the chosen deployment architecture; changes remain explicit decisions.

The new specifications restructure product responsibilities, not membership economics. A conflict involving fees, liability, repayment, age eligibility or permission expansion requires an explicit decision; don't silently resolve it in code. Record unresolved material questions and keep their affected write paths blocked while continuing unaffected work.

## Prior merchant and channel direction — 2026-09-09 (historical)

The subsequent user correction places **Merchant services under the Merchant account**, with permission to manage its master and Personal/Household child MIDs. Merchant is the administration home; Personal/Household retain delegated collection views and Household's explicitly permitted helper delegation. D45 supersedes the previous standalone merchant-management navigation. It adds no fourth account type, provider capability or automatic financial-account access.

The user's latest explicit correction gives Merchant the **master merchant/MID** and Personal/Household **sub-MID** relationships. Household may delegate its sub-MID to named members or outside people. Payment channels cover SMS/text, email, invoice, bill/receipt, social, QR and website/link. [The detailed redesign](MERCHANT_HIERARCHY_AND_CHANNELS.md), [target contract](../contracts/merchant-channel-design.json) and [unexecuted verification register](../planning/merchant-channel-verification.json) supersede D40–D41's Merchant-only merchant entry assumptions and conflicting historical design language. Receipt remains evidence after successful payment; bill is payable.

The user subsequently confirmed that the master Merchant is responsible for sales, fees, refunds and chargebacks, with separately attributed delegated sub-MID collection units. A Personal/Household host may have separate sub-MIDs under multiple Merchants, one unit per master/host pair and one immutable master per sub-unit. Provider-program/MID/settlement configuration still needs its own evidence. Preserve Personal/Household financial privacy and maintain one policy engine, invitation lifecycle, channel workflow and ledger. Merchant permission does not grant issuing authority. The local seven-migration slice implements merchant relationships, scoped access and channel drafts. D41 is historical baseline evidence; the current scope and checks are recorded in `docs/MERCHANT_CHANNEL_EVIDENCE.md`. Provider/financial portions of the design remain unimplemented.

## Explicit changes from older documents
| Old instruction or artifact | New instruction |
|---|---|
| Continue or backfill the old project | Fresh private repository, site, PostgreSQL schema, Identity and secrets. No import of customer records. |
| Add Accounts around legacy tables | Design clean typed relationships from the start; preserve required financial meanings, not table names. |
| `/api/v2` compatibility cutover | One fresh `/api/v1` namespace. No competing legacy routes. |
| Four services and many workspace/operations menus | Same required outcomes; direct Cardholder and Merchant dashboards with exact resource permissions. Shared backend foundations. |
| Existing classes/offline server/generated JS | Do not copy. One source tree and standard framework build. Local and hosted execution share domain code and PostgreSQL semantics. |
| A list of mandatory table names/counts | Preserve all required records/invariants with justified normalization. No arbitrary table count. |
| Manual authorization then manual clearing as customer journey | One practice-purchase intent; durable events complete it. Diagnostic controls are operator-only. |
| All scheduled jobs off forever | Default off; enable only tested simulation event completion for the new sandbox. Financial calendar/recurring jobs have separate gates. |
| One fixed provider SDK/version | Verify current official APIs/compatibility and lock the actual resolved versions. |
| Old demo users, keys, secrets, deployment IDs | Never copy. Use fresh fictional fixtures only in isolated tests; hosted public registration uses the new Identity project. |
| Green test counts from old PRs | Historical evidence only. New application starts with zero verified behavior. |

## Retained scope
The latest 2026-09-09 user request raises the completion target to 100% and asks for an even better Etail experience. D38 records the change. The v2 comparison retains the same 90 tasks and mandatory gates; raising the target awards no completion points. Continued implementation does not override the financial, privacy or release boundaries.

The 2026-09-09 request continues the front-end direction: include YouTube and independent reviewers, then architect, design, build and demonstrate Etail. [Reviewer research](research/amex/REVIEWER_WALKTHROUGHS.md) and [the experience architecture](EXPERIENCE_ARCHITECTURE.md) record that handoff. The local connected interface does not override commercial decisions, enable real money, replace the single planned ledger or establish full platform/90% parity completion.

Public site, two memberships, three account types, guest checkout, issuing, acquiring, Household supervision, delegated control, rewards, operations/cases, cost economics, partner portal/API, notifications, workers, private files, PWA and real tests remain required. They may ship in staged PRs, not be silently deleted. The minimum supported mock capability for each milestone is in `planning/backlog.json`.

## Workbooks
Original XLSX bytes are unchanged. `sources/workbook-extract.json` is a read-only, cell-addressed extraction of cached values and formula text. It does not recalculate the workbook. Missing numeric rates remain missing; explicit zero is different. Codex must trace each imported formula and financial fixture to the authoritative source. Do not use `float` for posted money or copy rounded display text into ledger logic.
