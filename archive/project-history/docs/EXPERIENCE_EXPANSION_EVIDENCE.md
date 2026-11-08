# Expanded account experience — delivery evidence

9 September 2026 (JST). The user accepted the local preview and asked for a complete, better version. This delivery extends the working front end with access invitations, reports, support cases, session controls, membership comparison and task search. The [90-task audit](../planning/EXPERIENCE_GAP_AUDIT.md) retains the full 100% target and the unfinished product work; this receipt is not a parity score.

## Exact source and environment

- Branch: `feature/EDN-003-foundation`.
- Implementation commit: `a3adbea80f63574d0a17a3ef0b0dee12017febf7`.
- Tree: `9c6fd7f5a8d5f1ac62fa1caf2a82faec149f8ae0`.
- Darwin 25.6.0 ARM64; Node 24.19.0; pnpm 11.19.0; native PostgreSQL 18.6; Next 16.3.4; Netlify Next adapter 5.15.13. Exact dependencies and the single lockfile are unchanged.
- The [core verification receipt](../artifacts/completion/verification/identity.json) records exact commands, UTC timestamps, exit codes and lockfile/migration/log hashes. All recorded checks passed with a clean working tree. Later closeout changes documentation only.

## Executed checks

| Check | Result | Evidence |
|---|---|---|
| Lint and TypeScript | Exit 0 each | [Lint](../artifacts/completion/verification/lint.log), [types](../artifacts/completion/verification/types.log) |
| Unit tests | 154 passed, exit 0 | [Unit log](../artifacts/completion/verification/unit.log) |
| PostgreSQL integration | 47 passed, exit 0 | [Integration log](../artifacts/completion/verification/integration.log) |
| PostgreSQL concurrency | 13 passed, exit 0 | [Concurrency log](../artifacts/completion/verification/concurrency.log) |
| Executable contracts | 7 passed, exit 0 | [Contract log](../artifacts/completion/verification/contracts.log) |
| Architecture ownership | Exit 0 | [Architecture log](../artifacts/completion/verification/architecture.log) |
| Security source checks and dependency audit | Exit 0; executed audit reported no known vulnerabilities | [Security log](../artifacts/completion/verification/security.log) |
| Strict dependency peers | Exit 0 | [Peer log](../artifacts/completion/verification/peers.log) |
| Production Next build and offline Netlify packaging | Exit 0 | [Build log](../artifacts/completion/verification/netlify-packaging.log) |
| Handoff helper regressions | 35 passed, exit 0; separate from application tests | [Handoff log](../artifacts/completion/verification/handoff.log) |

The final complete Playwright run passed **75/75 tests**, exit 0: 16 API, 24 desktop, 24 mobile and 11 accessibility. There were no skipped, unexpected or flaky tests. The [browser receipt](../artifacts/completion/browser-final/receipt.json) records the same exact SHA/tree, a clean working tree at start and end, command, timing and evidence hashes; the [full log](../artifacts/completion/browser-final/browser.log) and HTML/JSON reports are preserved. All supported journeys were exercised together against the production build on native `etail_depot_next_test`.

There are **296 passing application tests** across these final checks: 221 unit/database/concurrency/contract tests and 75 Playwright tests. The 35 handoff helper regressions are separate. Static checks and dependency/build results are not added to that count. Automated accessibility and keyboard checks do not constitute a manual screen-reader certification or full product acceptance.

The initial combined browser candidate ended with 57 passed and 12 failed, exit 1. Evidence remains under `.local/completion-evidence/browser-initial-candidate/` with its sibling log. The failures identified report navigation/header test assumptions, the People restricted-state regression, support test navigation timing and Escape handling in task search. The fixes retain the original denial/accessibility expectations. Chromium consumed Escape to clear a search input; task search now closes on Escape and restores its opener, without changing the shared dialog. Card URL history and two-person access tests were added before the final candidate.

The next complete candidate on `1e268f9` ended with **71 passed and 4 failed**, exit 1. Its [receipt](../artifacts/completion/browser/receipt.json) preserves the exact build and notes test/source preparation during that failed run. Three failures were exact select-label locators that included dropdown option text; DOM/CDP inspection confirmed unique dialog labels, native modal state and no hydration errors. Tests now use the computed combobox names. Invitation controls received their missing scoped layout. The fourth failure exposed card-tile disabling during read navigation, which removed focus before the modal captured its opener. Read navigation now preserves focus while repeated opens are ignored; command-busy controls remain protected. Earlier [core receipts](../artifacts/completion/verification-1e268f9/identity.json) are preserved separately.

## Delivered behavior

People can review exact account permissions, invite a named existing fictional tester, accept/decline an invitation from that person's own inbox, and change/revoke permitted access. Acceptance rechecks the sender's live delegation ceiling. Financial authority, Personal privacy and Owner/self membership protections remain separate. No invitation is sent externally.

Reports apply an explicit historical period/source/status/search, show exact server-derived itemized totals, export scoped CSV, print and save creator-private filter definitions. Reruns recheck current permissions. These are historical activity reports, not official billing statements. CSV text is neutralized against spreadsheet formula execution.

Support cases preserve optional authorized transaction context, review before creation, a versioned follow-up timeline, conflict recovery and reasoned withdrawal. Cases are private to their creator within an accessible account. No agent reply, issuer dispute decision or network delivery is fabricated.

Session review uses the existing session repository and shows no token/hash or invented device identity. Revocation rechecks current authentication under binding locks, protects the current session and names specific other families so a retry does not affect a later independent sign-in.

Task search remains account-aware and links to the existing workflows, including the single Add card flow. Card selection now persists in the URL through reload and Back/Forward. Membership comparison uses normative commercial rules and exact server arithmetic; the supplied annual example produces Select $3,200, Premier $2,600 and $600 difference. Unknown brand costs remain unknown, and the one shared Premier cap is preserved. Display-estimate rounding does not settle the outstanding financial-posting policy.

## Demonstration and visual review

The completed production preview runs at [localhost:3100](http://127.0.0.1:3100). `pnpm preview:fixture` verified the separate project-owned `etail_depot_next` database, applied the fourth migration and preserved existing fictional records. The already signed-in account session remained usable. Automated tests and their records stayed in `etail_depot_next_test`; no reset or customer-data import was performed.

Ten screenshots cover reports, membership, security, a Household invitation and contextual support, at desktop and 320 pixels. The [capture manifest](../artifacts/completion/browser-final/screenshots.json) records filenames and hashes. All ten images were visually inspected for clipping, text wrapping, hierarchy and controls. The invitation dialog uses viewport captures; long reports/session lists use full-page captures. The security images show test-created sign-ins, not the clean preview's session inventory. Capture forms were not submitted.

The final in-app preview was inspected at its actual narrow panel width: the Seller report loaded with all ten destinations and existing account context. Task search opened as a native modal and its membership destination retained the Seller account. No source edits followed the successful production verification; this evidence/status closeout changes documentation only.

## Scope and release limits

Historical financial values are fictional snapshots, not a ledger. The single ledger/eligibility/provider path, actual issuance/payment/refund/payout, full financial statements, earned-reward posting, hosted registration/invitation delivery and other retained comparison tasks remain unfinished. M0–M1 and later dependency-gated issues are not declared complete. D14–D17 still apply to affected financial writes; real money remains code-disabled.

This work changed local source, tests, typed records and one migration only. No remote push, PR, merge, deploy, visitor-access change or external message occurred. Netlify access remains unchanged. Hosted setup, feature review, original-workbook export and eventual public release retain their separate recorded boundaries.
