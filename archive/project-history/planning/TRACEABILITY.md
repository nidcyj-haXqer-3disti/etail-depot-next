# Source-to-implementation traceability

## Amex experience correction — 2026-09-09–10

| User/reference obligation | Implementation | Verification |
|---|---|---|
| Selected card, identity, money and immediate controls | `cardholder-dashboard`, bounded `getCardholderDashboardFocus`, existing `CardsWorkspace` command forms | Primary/secondary exact selection, canonical freeze, foreign/repeated/uppercase IDs, navigation/reload; 410 domain tests and selected-card browser journeys |
| Merchant summary to specific record and financial working views | `merchant-dashboard`, `MerchantOperations` payment/refund/transfer tabs and URL state | Exact receipt links, date/search/status, Back/forward/reload, current balance independent of filters, foreign payment denial |
| Actual reference and rendered-screen comparison | [Correction evidence](../docs/AMEX_EXPERIENCE_CORRECTION.md), separate visual capture tool | Three public reference images inspected; 57 final responsive checks, 14 final screenshots reviewed, six mobile money/control geometry gates |

Core `ba1d9c1`, final application/tests `fdc3cb8`. All 120 runnable browser cases passed across the documented full and focused runs. References distinguish current public documentation, dated screenshots and previous reviewer evidence. These refinements do not award 100% Amex parity or close the wider financial/servicing backlog.

## Merchant hierarchy and channels — target redesign, 2026-09-09

| Latest obligation | Canonical target ownership | Planned verification |
|---|---|---|
| Seller master MID; Personal/Household sub-MIDs | Acquiring merchant units, two-sided sponsorship and responsibility versions | MC-001–005, MC-017–024; ACQ-01; EDN-006/017 |
| Household permission for members and outside people | One access evaluator and typed invitation lifecycle; direct unit grants without host membership | MC-006–016, MC-049; ACQ-08; EDN-008/017/020 |
| Payment channels for the requested delivery/presentation surfaces | One channel form/domain; payable orders, delivery attempts and documents | MC-025–041, MC-050–051; ACQ-02/03; EDN-017/018 |
| Correct database, verification and financial separation | Immutable hierarchy/bindings; independent verification dimensions; shared ledger/backing and issuing isolation | MC-017–024, MC-042–048, MC-052–053; EDN-009/014/019 and existing release tasks |

These MC IDs resolve through [the scenario register](merchant-channel-verification.json), all `NOT_RUN`, linked to [the target contract](../contracts/merchant-channel-design.json) and [main design](../docs/MERCHANT_HIERARCHY_AND_CHANNELS.md). No source-to-code completion is claimed. Master responsibility and multiple Seller associations were explicitly confirmed; provider configuration remains separate. Existing issue dependencies, acceptance statuses and frozen Amex comparison inventory remain; the table does not award new percentage points. The previous Seller-entry section below is historical implementation evidence, partially superseded as a target by D42–D43.

## American Express primary-reference overlay — 2026-09-08

The latest user correction prioritizes [the business 360 review](../docs/research/amex/BUSINESS_360_REVIEW.md). Its 85 checks record actors, ordinary and exception flows, cross-area handoffs, evidence limits, remaining Etail work and proposed acceptance scenarios. Each check has `comparison_ids` linking related AX tasks; an empty list makes a missing distinct baseline task visible. These mappings neither redefine the 90-task denominator nor assert that a broad new check equals one old point. No check was executed against a completed financial application.

| Business review | Primary existing milestone ownership |
|---|---|
| [24 issuing checks](../docs/research/amex/issuing-360-checks.json) | M1 responsibility; M2 cards; M3 spending/repayment; M5 servicing |
| [25 account-control checks](../docs/research/amex/account-control-360-checks.json) | M1 authority; M2 card controls; M4 Seller access; M5 operations |
| [24 merchant checks](../docs/research/amex/merchant-360-checks.json) | M4 merchant lifecycle/funds/disputes; M5 support/closure |
| [12 connected journeys](../docs/research/amex/cross-domain-360-checks.json) | M1–M5 participating workflows; M6 actual end-to-end evidence |

These are proposed business-review responsibilities, not a new backlog or completed milestone. The commercial decisions D14–D17 and the recorded gaps remain open until separately resolved.

The deeper [engineering/vendor architecture dossier](../docs/research/amex/ARCHITECTURE_BLUEPRINT.md) adds [12 proposed architecture review gates](amex-architecture-gates.json), mapped to existing EDN issues. These refine command recovery, atomic authority, diagnostic isolation, replay and operations. They do not alter the frozen 90-task denominator, award completion, replace the original 20 mandatory gates, or change milestone dependencies. Source IDs P01–P10 resolve through the platform register; the companion studies separately classify supplier/code/patent evidence.

[The research package](../docs/research/amex/README.md) and [versioned comparison inventory](amex-comparison.json) map 90 proposed tasks to source IDs and existing EDN issues. Each row records a testable criterion, criticality, design status and empty implementation-evidence field. All comparison results are unassessed; no original acceptance or milestone is marked complete. The supplemental inventory preserves the existing dependency graph and adds 20 mandatory architecture/release checks outside the percentage. Future evidence must identify the exact source SHA, test/role/recovery cases, desktop/mobile review and reviewer/date.

## Connected Seller entry — 2026-09-09

| Source obligation | Current local implementation ownership | Verification scope |
|---|---|---|
| PRODUCT account table; original master §6.1 Quick Sell | `accounts/create-seller.ts`, `acquiring/service.ts`, merchant entry UI | Personal owner starts one empty draft Seller; retries do not create a second account. |
| ACCESS_POLICY Household boundaries; original master §6.2 | Shared `loadAccountScope` + `evaluate`, named Seller picker and existing access invitations | Household-only access never reveals Seller records; revoked Seller grants are rechecked. |
| WORKFLOWS §4; original master §6.3 | Typed acquiring setup/profile and payment-request drafts | Individual/sole proprietor/business details, truthful local review and exact cents without publishing or approval. |
| DATABASE_AND_DOMAIN module ownership; UX_CONTRACT recovery | Typed creation receipts, versions, canonical draft/setup forms | Empty accounts, uncertain retry recovery, stale edits and explicit return context. |

The design is accepted in D40–D41. [Execution evidence](../docs/SELLER_ENTRY_EVIDENCE.md) records final revision `edcf29f`, 338 passing application tests, production packaging and visual review. This slice supports EDN-004/006/017/020 without closing financial dependencies or the broader Amex comparison.

## Original required outcome mapping

This is the initial outcome mapping. During implementation add exact original workbook sheet/cell references, imported record IDs, code paths, API operations, tests and commit evidence. A row is not complete merely because the source document was read. Do not drop original master outcomes when simplifying menus.

| Supplied outcome | New canonical ownership | Milestones |
|---|---|---|
| Member Home / Memberships / lifecycle | Identity + membership + selected-account overview | M0–M1 |
| Personal, Household, Seller | Account directory + explicit service/facility relationships | M1–M4 |
| Card issuance / payment access | One Cards request, form and command | M2 |
| Funding, limits, spend, repayment | Issuing + central controls + ledger | M2–M3 |
| Quick Sell / payment links / QR / invoices | Named Seller relationship + acquiring payment-request workflow | M4 |
| Guest payments and partial invoices | Acquiring public capability-scoped checkout | M4 |
| Referrals / wholesale / embedded programs | Partner administration and scoped partner portal | M5 |
| Command Center / Operations / cases | Operator portal using common domain commands | M5 |
| Economics / PayFac / Issuing / Inputs / Cost Drivers / Rate Cards / Cost Center | Versioned source imports, exact cost engine and visible completeness | M5 |
| Security / documents / webhooks / PWA | Shared security/storage; public-only offline shell | M0–M6 |
| Tests / deployment / operations | Real tests, new Netlify project, hosted acceptance, evidence | M6–M7 |

The worksheets contain requirements and planning inputs, not customer data to import. The new database seeds fictional examples only. Preserve original cells and policy versions in the calculation trace.

## Initial foundation implementation — 2026-09-08

| Source / acceptance | Implementation | Actual test evidence and remaining scope |
|---|---|---|
| Master §4, ACC-01 | `src/platform/database/schema.ts`, `src/modules/accounts/service.ts`, one `AccountSelector` | Native enum constraint, no automatic selection, persisted preference and desktop/mobile reload tests pass locally. |
| ACCESS_POLICY, ACC-02/03/05 | `src/modules/policy/evaluate.ts`, scoped account queries and API wrapper | Unit role/scope matrix, database/API cross-account rejection, viewer data minimization. Full resource/files/history scopes remain unimplemented. |
| ACCESS_POLICY revocation, ACC-08 partial | Re-read accepted membership on commands; session-family repository locks | Revoked access rejects later selection/detail and invalidates preference; deterministic overlapping session revocation/rotation tests. Invitation/revocation commands and retention policy remain pending. |
| NEW-02 partial, DATABASE_AND_DOMAIN | Netlify SDK + Drizzle, two generated SQL migrations | Native PostgreSQL 18.6, transaction rollback, typed ownership/session constraints and duplicate identity/outbox tests. Hosted transaction path remains unverified. |
| SECURITY/NETLIFY_DEPLOYMENT | Exact configured origin, opaque HttpOnly sessions, strict local target validator | Origin/body/role injection, session expiry/revocation, local query-option injection, fixture environment tests. Hosted Identity lifecycle/rate limiting/MFA remain pending. |
| UX_CONTRACT | Branded landing/login, one explicit account directory and account overview | API + desktop/mobile + axe tests, keyboard selection, logout and 320px reflow. No full financial/user-usability acceptance claimed. |
| GITHUB_PLAN / TEST_AND_EVIDENCE | `.github/workflows/foundation.yml`, generated foundation OpenAPI | Actual local commands and pinned CI actions; remote CI/PR publishing pending workbook-export approval. |

See `docs/FOUNDATION_EVIDENCE.md` and the local `artifacts/foundation` source receipt for exact validation context. No workbook rates/formulas were newly implemented or imported into financial tables by this slice.

## Original master top-level index

- Netlify Member Commerce Platform
- 0. Your role and execution mandate
- 3.1 No free membership tier
- 3.2 Pricing formulas
- 3.3 Reward rules
- 3.4 Guest payer rule
- Customer-side roles
- Partner-side roles
- Management roles
- 5.1 Public website
- 5.2 Customer application
- 5.3 Guest-payment experience
- 5.4 Management console
- 5.5 Partner portal
- 6.1 Personal
- 6.2 Household
- 6.3 Seller
- Lifecycle stages
- Membership
- Seller profile
- Payment link
- Invoice
- Payment
- Payout
- Spending account
- Payment credential
- Authorization
- Reward
- Case
- Partner program
- 9.1 Command Center
- 9.2 Value Streams
- 9.3 Customer Lifecycle
- 9.4 Operations Workspace
- 9.5 Service Portfolio
- 10.1 Cost dimensions
- 10.2 Rate bases
- 10.3 Cost drivers
- 10.4 Cost formula
- 10.5 Seed planning case and regression values
- 10.6 Prebuilt future cost capacity
- Direct
- Referral / distribution
- Wholesale reseller
- Embedded / co-branded
- 12.1 PayFac adapter contract
- 12.2 Issuer adapter contract
- 12.3 Provider object mapping
- Identity and member
- Service catalog and entitlements
- Household
- Seller and PayFac
- Issuing and spending
- Rewards and value
- Operations
- Cost and economics
- Partners
- Platform and integrations
- Public endpoints
- Member endpoints
- Management endpoints
- Partner endpoints
- Provider webhooks
- Function responsibilities
- Netlify Blobs
- Netlify Identity
- Secrets
- Security controls
- Commercial regression
- Access and privacy
- PayFac
- Issuing
- Cost engine
- Cases and operations
- API

## Acceptance ownership

| Acceptance | Delivery tasks |
|---|---|
| NEW-01 | EDN-001, EDN-002, EDN-029, EDN-032 |
| NEW-02 | EDN-001 |
| NEW-03 | EDN-001, EDN-002, EDN-029 |
| NEW-04 | EDN-001, EDN-022 |
| ACC-01 | EDN-005 |
| ACC-02 | EDN-005, EDN-006 |
| ACC-03 | EDN-006 |
| ACC-04 | EDN-007 |
| ACC-05 | EDN-006, EDN-007, EDN-020 |
| ACC-06 | EDN-007 |
| ACC-07 | EDN-007, EDN-015, EDN-020 |
| ACC-08 | EDN-007, EDN-012 |
| CARD-01 | EDN-011, EDN-027 |
| CARD-02 | EDN-010, EDN-011 |
| CARD-03 | EDN-006, EDN-010 |
| CARD-04 | EDN-010 |
| CARD-05 | EDN-010 |
| CARD-06 | EDN-010 |
| CARD-07 | EDN-010 |
| CARD-08 | EDN-009, EDN-010 |
| CARD-09 | EDN-012 |
| CARD-10 | EDN-011, EDN-012 |
| MONEY-01 | EDN-009 |
| MONEY-02 | EDN-009 |
| MONEY-03 | EDN-009, EDN-013 |
| MONEY-04 | EDN-013, EDN-026 |
| MONEY-05 | EDN-013, EDN-019, EDN-026 |
| MONEY-06 | EDN-012, EDN-013 |
| MONEY-07 | EDN-013 |
| MONEY-08 | EDN-013 |
| MONEY-09 | EDN-015 |
| MONEY-10 | EDN-013, EDN-016, EDN-019, EDN-023, EDN-028 |
| SIM-01 | EDN-014, EDN-031 |
| SIM-02 | EDN-014 |
| SIM-03 | EDN-014, EDN-018 |
| SIM-04 | EDN-014, EDN-015, EDN-030 |
| SIM-05 | EDN-014, EDN-030 |
| ACQ-01 | EDN-017 |
| ACQ-02 | EDN-018, EDN-031 |
| ACQ-03 | EDN-018 |
| ACQ-04 | EDN-019 |
| ACQ-05 | EDN-019 |
| ACQ-06 | EDN-019 |
| ACQ-07 | EDN-019 |
| ACQ-08 | EDN-017, EDN-020 |
| ECO-01 | EDN-008, EDN-016 |
| ECO-02 | EDN-008, EDN-016 |
| ECO-03 | EDN-008, EDN-016 |
| ECO-04 | EDN-022 |
| ECO-05 | EDN-022 |
| ECO-06 | EDN-022 |
| OPS-01 | EDN-021 |
| OPS-02 | EDN-021 |
| OPS-03 | EDN-023 |
| OPS-04 | EDN-024 |
| AUTH-01 | EDN-004, EDN-026 |
| AUTH-02 | EDN-004, EDN-026, EDN-031 |
| AUTH-03 | EDN-004, EDN-026, EDN-030 |
| AUTH-04 | EDN-004, EDN-026 |
| AUTH-05 | EDN-004, EDN-024, EDN-026, EDN-030 |
| AUTH-06 | EDN-024, EDN-025, EDN-026 |
| UX-01 | EDN-011, EDN-020, EDN-027 |
| UX-02 | EDN-025, EDN-027 |
| UX-03 | EDN-011, EDN-025, EDN-027 |
| UX-04 | EDN-025, EDN-027 |
| REL-01 | EDN-003, EDN-030 |
| REL-02 | EDN-003, EDN-026 |
| REL-03 | EDN-029, EDN-031 |
| REL-04 | EDN-029, EDN-031 |
| REL-05 | EDN-031 |
| REL-06 | EDN-032 |
| REL-07 | EDN-028, EDN-032 |

## Completion template

`source file/hash + section or sheet/cell → requirement ID → owning module/API/UI → migration/seed/policy version → executable test → exact run/commit → remaining manual check`.

## D49 focused service experience and clean preview — 2026-09-09

[Cleanup design and evidence](../docs/SERVICE_EXPERIENCE_CLEANUP.md) maps the user's latest request to focused dashboard views, shared service navigation, contextual management, independent merchant dispute reads and a guarded current-model preview generation. Coverage lives in `services-workspace.spec.ts`, `services-accessibility.spec.ts`, the existing card/access/merchant browser journeys, `merchant-disputes.test.ts`, preview-target unit tests and the explicit read-only clean-preview verification tools. Historical fixtures remain isolated regressions; no platform milestone or parity task is awarded completion by this cleanup.

## D48 direct service dashboard correction — 2026-09-09

Latest user feedback rejects the old account-type directory beneath the service entrance. [Dashboard design](../docs/SERVICE_DASHBOARD_DESIGN.md) and [delivery evidence](../docs/SERVICE_DASHBOARD_EVIDENCE.md) track this local correction without closing dependency-gated platform milestones.

| Required behavior | Implementation | Executable verification |
|---|---|---|
| Direct Cardholder dashboard, one named primary profile | workspace/dashboard-service, cardholder dashboard, migration 12 | integration/service-dashboard; browser/services-workspace, services-api, services-accessibility |
| Exact secondary data and no cross-scope grant union | existing policy/scope evaluator plus exact resource resolver | integration/service-dashboard; browser/workspace-api and services-workspace |
| Direct primary/submerchant work and null restricted totals | acquiring/dashboard-service and merchant dashboard | integration/merchant-dashboard; browser/merchant-api and merchant-workspace |
| Independent creation, multiple named submerchants and stable retry | canonical createMerchantAccount/createMerchantRelationship; migration 13 | integration/merchant-accounts, acquiring-channels, merchant-dashboard; browser/merchant-workspace |
| Cardholder role/state controls its own lifecycle | canonical holder/policy/access checks | integration/service-dashboard and existing independent-service regressions |
| Accessible connected desktop/mobile experience | shared card/channel/access forms, direct selectors and details | full Playwright projects and recorded 1440/390/320 visual/axe checks |

Public Amex dashboard evidence informs layout and task flow; it grants no implementation completion points. Original pricing, liability, guardian funding, live Identity/provider and release requirements retain their separate gates.


## D51 service consolidation verification

| Requirement | Implementation/evidence | Verified result |
|---|---|---|
| One consistent customer model | [Consolidation record](../docs/SERVICE_CONSOLIDATION.md), selected-card task loader and exact-merchant business-details APIs | Retired selector/entry routes removed; current primary/secondary scope preserved |
| Independent Merchant setup and direct primary ownership | Canonical creation/relationship commands, migration14 | Actor-only eligibility, exact-primary host constraint, current authority on replay, preserved original rows |
| Cardholder admission and privacy | Shared durable participation reader; canonical invitation/update/revoke commands | Never-card merchant members excluded; pending offers do not confer access; merchant grants unchanged |
| Refreshed permissions and interrupted commands | Current-projection generation guard and saved attempts | Removed records/dialogs stay absent; no replacement command identity while recovery is unresolved |
| Working sandbox delivery | Application `ec139c4`, browser assertions `a0a21fb`; local receipts |419 domain tests;123 distinct runnable browser cases across full+focused runs;78 visual checks;16 screenshots reviewed; production/offline packaging and static gates passed |
