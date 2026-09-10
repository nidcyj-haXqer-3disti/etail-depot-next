# Two-service sandbox delivery evidence

Local branch: `feature/EDN-003-foundation`. Baseline before this task: `f79ca4b`. The core implementation is `cd8562e`; `45ab497` adds the accessible Merchant setup heading and updates browser assertions to the new service boundaries; `8bf6073` improves mobile invitation layout. Final source/test revision is `82f09d69d202bcdba1ad7e475e8d9e83d39b2793`, whose only change after the final application build is the accessibility test's page-loading wait. The [design](TWO_SERVICE_DESIGN.md) and [service hierarchy contract](../contracts/service-hierarchy.json) describe the behavior; they do not establish a test result.

## Environment and scope

Node 24.19.0, pnpm 11.19.0, Next.js 16.3.4, TypeScript 6.0.3, PostgreSQL 18.6. Runtime is local, with fictional identities and exact integer practice money. The test database is `etail_depot_next_test`; the separate preserved preview is `etail_depot_next`, both on loopback port 55439 as `etail_local`. `ENABLE_REAL_MONEY=false` remains enforced.

This change introduces two service entrances, primary/secondary card scope and primary/submerchant scope. It preserves the single card-request, payment-channel, invitation and ledger implementations. There is no deployment, remote push, merge, access-policy change to hosting, external invitation delivery, live provider verification or real-money operation.

## Preserving migrations

Private snapshots are local and ignored, with directory mode 0700/file mode 0600. The comparison includes every original table, row and column, normalized by value. New columns/tables are additive; explicit preview preparation occurs after preservation checks.

| Migration | Database | Original rows/tables preserved | Snapshot SHA-256 |
|---|---|---|---|
| 9: named cardholder responsibility | Test | 84,728 / 50 | `73da404ac179f1ae6782e4aba651c28adcbc1dcf3f07db4252fa796583335dcd` |
| 9 | Preview | 285 / 50 | `0f17c07a068b955c1c3f8497088b1c161765d75ccede6458de8543fbe4fb8ace` |
| 10: finite merchant payment grants | Test | 102,670 / 51 | `b80bbb066e9a3ed25f7e80446933f326f536d9a2214be7136122404075aa4bbf` |
| 10 | Preview | 333 / 51 | `2c9b8a7e2f2da7a7f91f8cc8cacdf4db776e2921dfce92d8536e5db6918b64a2` |
| 11: independent card access | Test | 132,868 / 51 | `52386d2fda0bfacbb67d2cfc32b118c13939172016d2dcc45151fa62e18d5cc5` |
| 11 | Preview | 352 / 51 | `584eb3f91151882150c59e7deb6ec20f4f1aecdeaf43f690b4b1a5624786c930` |

Migration 9 creates named primary responsibility only for an unambiguous accepted owner. Migration 10 repairs the database constraint exposed by a real accepted submerchant invitation containing the offered payment permissions. It grants nothing automatically. Applied migrations are not edited after application.

## Executed checks

Logs are retained under ignored `artifacts/two-service-redesign/`, with agent-specific focused runs under `artifacts/two-services/` and `artifacts/three-account-redesign/`.

| Check | Executed result | Receipt |
|---|---|---|
| Complete unit/PostgreSQL integration/concurrency/contracts | **380 passed across 58 files, exit 0**, on `cd8562e`; subsequent source changes are markup/CSS only | `domain-final-all.log` |
| Earlier complete domain run | 372 passed, exit 0, before the additional cross-service access review fix | `domain-final.log` |
| Initial complete domain candidate | 370 passed, 2 failed; old private-channel expectation and missing explicit fixture binding corrected | `domain-candidate.log` |
| Focused card access/model checks | 55 passed, exit 0 | `access-final.log` |
| Merchant migration 10 regressions | 49 passed, exit 0 | `../two-services/acquiring-migration10.log` |
| Merchant hierarchy label vs authority | 4 passed, exit 0 | `../two-services/merchant-role-separation.log` |
| Card/merchant privacy and independent dispute operation | 35 passed, exit 0 | `../three-account-redesign/cardholder-merchant-isolation.log` |
| Schema generation | No schema drift, exit 0, after migrations 9–11 | `schema-drift-final.log` |
| Production Next and offline Netlify build | Passed, exit 0, on `8bf6073`; explicit new site ID, no deploy | `netlify-build-final-layout.log` |
| Lint and typecheck | Both exit 0 on `82f09d6` | `lint-final-layout.log`, `typecheck-final-layout.log` |
| Architecture ownership | Exit 0 on `45ab497`; later changes only scoped CSS and browser readiness assertions | `architecture-closeout.log` |
| Source security | Passed, exit 0, on `82f09d6` | `source-security-closeout.log` |
| Dependency audit | No known vulnerabilities, exit 0 | `dependency-audit.log` |
| Handoff helper checks | 35 passed, exit 0 | `handoff-final.log` |
| API, desktop and mobile browser journeys | All 94 passed on build `45ab497`; complete run also recorded the subsequently corrected accessibility timing failure | `browser-closeout.log` |
| Final accessibility project | **15 passed / 4 intentional project exclusions, exit 0**, with final application CSS and `82f09d6` tests | `accessibility-final-layout.log` |
| Final rendered layouts | Invitation readability, no horizontal overflow and axe at 320/390/740px; Merchant setup single H1 and axe; all passed, exit 0 | `layout-final.log` |
| Final visual capture | 20 primary/secondary desktop/mobile views recaptured, exit 0; four extra final layout views | `visual-capture-final.log`, `screenshots/` |

Commands: `node tools/run-with-database.mjs vitest run tests/unit tests/integration tests/concurrency tests/contracts`; `NETLIFY_SITE_ID=cbbb6c24-9dbc-43a2-9234-e4357b5b5280 node node_modules/netlify-cli/bin/run.js build --offline --context production`; `pnpm lint`; `pnpm typecheck`; `pnpm test:architecture`; `node tools/verify-security.mjs`; `pnpm audit --audit-level=high`; `pnpm db:generate`; `pnpm test:handoff` (runs `python3 tools/test-handoff.py` against current handoff sources). The helper run does not re-certify the original package hashes. Runtime PATH uses the configured Codex Node bundle. Local database/build/browser commands ran with authorized loopback access. No approval review rejection occurred.

An independent final review identified a cross-service access dependency beyond those passing tests: shared membership updates could revoke merchant grants or invalidate version-bound merchant assignments. Migration 11 and the canonical card commands now separate card access from that responsibility record. Four mixed-service tests verify preserved role/state/version and all merchant grant values, including revoked/delegable flags; stale card versions; own-card privacy; revoke/reinvite/replay; and inability to revive an externally revoked membership. Another test completes an approved merchant payment after revoking the same person's card access, including an explicitly membership-dependent merchant assignment.

The expanded complete suite passed **378/378 across 57 files**, exit 0, in `domain-verified.log` and again after the card directory optimization in `domain-final-directory.log`. The latter also includes the directory privacy assertions and 16 concurrent workspace reads without connection starvation. Candidate failures that still expected full underlying membership revocation were updated to assert empty, unavailable card access while preserving merchant membership.

The first browser candidate was stopped after **33 passed / 7 failed / 1 skipped / 1 interrupted / 73 unrun** (exit 130). Five failures were stale assertions for the newly scoped model; these were corrected while retaining actual permission/ownership/origin/CSV checks. The two navigation failures exposed large-directory loading costs. A second diagnostic run confirmed the API fixes with **40 passed / 2 failed / 1 skipped / 1 interrupted / 71 unrun** (exit 130), retaining both navigation assertions. Directory reads now reuse the current transaction and avoid fetching a full financial workspace or repeatedly enumerating merchant setup for each displayed choice. These interrupted runs are diagnostic evidence, not successful complete browser runs.

The first complete browser run returned **96 passed / 13 failed / 6 skipped**, exit 1, in `browser-final-all.log`. The remaining failures exposed stale heading, mobile-sidebar and unrelated merchant-sale expectations; a login navigation race; and the legitimate capped session-revocation label in the accumulated fixture. The fixes retain explicit data scope, seed actual own-card activity through canonical commands, scope historical dispute fixtures independently to Merchant permission, verify only displayed session IDs are revoked, and give Merchant setup one H1. Accessibility rules and required customer workflows were not disabled.

The next complete browser run against application build `45ab497` returned **108 passed / 1 failed / 6 skipped**, exit 1, in `browser-closeout.log`. All 20 API, 37 desktop and 37 mobile cases passed. The remaining accessibility case used a raw `main` selector during streamed loading and matched both the loading shell and a hidden destination shell. Commit `82f09d6` waits for the exact destination heading and then still requires exactly one active main landmark, unchanged axe rules, 320px reflow and keyboard focus behavior. `services-accessibility-navigation-error.md` preserves the original failure. The final complete accessibility project passed **15 cases with 4 intentional project exclusions**, exit 0, using the rebuilt mobile CSS. All 109 distinct browser/API cases therefore have passing evidence across these runs; there is no claim of a single final full-suite green run after the CSS refinement.

Browser commands are `node tools/run-with-database.mjs playwright test` and the final `node tools/run-with-database.mjs playwright test --project=accessibility`. Six full-suite project skips are intentional existing cross-project exclusions: four operation cases execute on desktop/mobile rather than again under accessibility, and the dedicated accessibility operation journey does not duplicate itself on desktop/mobile. They are not omitted product features or suppressed failures. The 94 passing API/desktop/mobile cases were not rerun after the CSS-only invitation refinement and test-only readiness fix; final accessibility and targeted rendered-layout checks verify those changes.

## Deliberate preview

`tools/prepare-two-service-preview.ts` creates a secondary cardholder through the canonical invitation flow, issues the named Daily spending practice card, and records its own $12 purchase against $150 practice funds. The secondary separately accepts merchant permission, creates its own reusable $25 channel, activates it against the existing test gateway and records a test payment. The primary's existing creator-private channel stays unchanged. `preview-prepare-ready.log` records the successful run after the finite-grant constraint fix. Earlier failed attempts remain in their logs.

Startup never repeats this one-time preparation or overwrites existing user choices. The marker and fictional fixtures are local. No external messages, usable card details, external MIDs or payment links are created.

The preserved secondary persona has three separately authorized merchant entries: a read-only Sample shop membership, an older direct Household market channel assignment, and the new Personal collections channel/payment assignment. Showing those three individually authorized entries does not grant network oversight. A read-only preview audit confirmed that `primaryAccess` is false for the Sample shop Viewer and that the setup choice comes only from the secondary person's separately owned context. No old grants or sample names were removed to make the demonstration appear simpler.

Visual review covers the two entrances, both card directories, primary/secondary card overviews, merchant directories, primary network totals, exact submerchant payments and card controls on desktop and mobile. Reviewing all initial 20 screenshots identified cramped invitation names at 390px, despite the existing 320px reflow checks passing. Commit `8bf6073` reserves a readable mobile invitation text row and lets status/actions wrap below; it changes no domain code. `viewer-invitations-before.png` preserves the original visual issue.

The final application was restarted against the preserved preview. All 20 views were recaptured; four additional final invitation/setup screenshots were captured and visually inspected. The changed invitation layouts at 320/390/740px now have readable names, wrapped actions and no horizontal overflow. The independent layout check also requires a usable text-column width and zero axe violations. Merchant setup has one visible H1 and passes axe. The local one-time verification commands are `node .local/service-redesign/capture-preview.mjs` and `node .local/service-redesign/check-final-layout.mjs`; these ignored scripts use only fictional loopback sessions and send no external messages.

The running preview is `http://127.0.0.1:3100/services`. The existing in-app browser tab was navigated there and its visible two-service chooser verified. The local application remains running for review; no hosted deployment or visitor-access setting changed.
