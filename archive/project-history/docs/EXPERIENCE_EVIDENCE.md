# Connected account experience — delivery evidence

9 September 2026 (JST). The local front-end servicing experience is implemented and reviewed. It covers Personal, Household and Seller account selection, overview, cards, activity, people, Seller settlements/disputes, preferences and help. [Research](research/amex/REVIEWER_WALKTHROUGHS.md) and [architecture/design](EXPERIENCE_ARCHITECTURE.md) describe the reference evidence and resulting choices.

## Source and environment

- Branch: `feature/EDN-003-foundation`.
- Implementation commit: `6372478ec9a4965050f025ac26037aaf7d9ee14a`.
- Tree: `6b0ca7ba159b12607d82d43f9891f6485cf0f350`.
- macOS Darwin 25.6.0, ARM64; Node 24.19.0; pnpm 11.19.0; native PostgreSQL 18.6; Next 16.3.4; Netlify Next adapter 5.15.13.
- The [verification receipt](../artifacts/experience/verification/identity.json) records exact command arguments, UTC timestamps, exit codes, lockfile/migration hashes and log hashes. The working tree was clean for that run. This closeout changes documentation only.

## Executed checks

| Check | Result | Evidence |
|---|---|---|
| `pnpm lint`, `pnpm typecheck` | Exit 0 each | `artifacts/experience/verification/lint.log`, `types.log` |
| `pnpm test:unit` | 122 passed; exit 0 | [Unit log](../artifacts/experience/verification/unit.log) |
| `pnpm test:integration` | 20 passed; exit 0; native PostgreSQL | [Integration log](../artifacts/experience/verification/integration.log) |
| `pnpm test:concurrency` | 8 passed; exit 0; native PostgreSQL | [Concurrency log](../artifacts/experience/verification/concurrency.log) |
| `pnpm test:contracts` | 6 passed; exit 0 | [Contract log](../artifacts/experience/verification/contracts.log) |
| `pnpm test:architecture` | Exit 0, including mutation checks for source ownership | [Architecture log](../artifacts/experience/verification/architecture.log) |
| `pnpm test:security`, `pnpm peers check` | Exit 0 each; no known vulnerabilities reported by the executed dependency audit | [Security log](../artifacts/experience/verification/security.log), [peer log](../artifacts/experience/verification/peers.log) |
| `node node_modules/netlify-cli/bin/run.js build --offline --context production` | Exit 0; production Next build and local Netlify function packaging | [Build log](../artifacts/experience/verification/netlify-packaging.log) |
| Playwright API, desktop, mobile and accessibility projects | 43 distinct tests passed across the candidate run and targeted recovery run, as qualified below | [Candidate log](../.local/experience-evidence/browser-final-candidate.log), [recovery log](../.local/experience-evidence/browser-stale-recovery.log) |
| `pnpm test:handoff` | 35 helper regressions passed; exit 0 | [Handoff log](../artifacts/experience/verification/handoff.log) |

There are **199 passing application tests across these runs**: 156 unit/database/concurrency/contract tests and 43 Playwright tests (9 API, 14 desktop, 14 mobile, 6 accessibility). The 35 handoff helper regressions are separate. Static checks, dependency audit and packaging are not added to that count. None of these counts measures Amex similarity or establishes full product acceptance.

The full Playwright candidate run finished with **41 passed and 2 failed, exit 1**. Both failures came from a stale-dispute test selecting two `alert` elements: the application error and Next's route announcer. After scoping the test locator to `main`, the targeted desktop/mobile rerun finished **2 passed, exit 0**. No application behavior changed between those runs. Before the implementation commit, one extra blank line at the end of `card-art.tsx` was removed. The exact committed source then passed the recorded non-browser checks and was rebuilt for the final preview. A single uninterrupted 43/43 run on that SHA is **not** claimed.

Earlier browser attempts found and prompted fixes to helper-text contrast and modal focus containment. Earlier logs and reports are retained under `.local/experience-evidence/`; they are not replaced by the passing receipt. Expected color-environment warnings and occasional Next aborted-stream warnings during navigation remain in the logs. Automated accessibility and keyboard checks are not a manual screen-reader certification.

The browser coverage includes account switching and privacy, Viewer restrictions, persisted card controls, saved requests with truthful blocked prerequisites, activity filters/details, Seller deep links, dispute drafts/review, stale-write recovery, saved preferences, keyboard focus and 320-pixel reflow. Database/API checks exercise scope, changed permissions, versions, retries and persistence. Architecture checks establish bounded source ownership; they do not prove a financial ledger exists.

## Demonstration and visual review

The final production preview was started with `pnpm preview:fixture` at [localhost:3100](http://127.0.0.1:3100). The fictional owner session was opened through the interface and the Personal overview was displayed in the in-app browser. The running preview uses the separate, project-owned `etail_depot_next` database. Automated tests use `etail_depot_next_test`; no test records were erased to prepare the demonstration. Restart instructions are in the [README](../README.md).

Eight screenshots are preserved in `artifacts/experience/screenshots/`. Direct visual review covered desktop Personal overview/cards and Seller operations in the browser, plus the saved desktop overview and 320-pixel overview/merchant screenshots. Text, cards, tables and controls were checked for clipping and overlap. The saved test screenshots include fictional test-created records; the clean demonstration database is separate.

## Delivered behavior and remaining scope

PostgreSQL persists card freeze/unfreeze, creator-private card-request drafts/submission prerequisites/cancellation, Seller dispute drafts/submission for local review, and personal notification preferences. Eleven authenticated API operations use the existing server-owned policy engine, explicit grants, typed records, versions and retry identities. One shared Add card workflow and card artwork serve the account screens.

Historical money/activity/settlement values are fictional read-only snapshots, not the planned financial ledger. Request submission does not issue a card; dispute submission does not contact a network or settle a case; notification preferences do not send messages. Actual funds movement, eligibility, provider issuance, memberships, invitations and the hosted Identity/database lifecycle remain incomplete. M0–M1 remain partial and later dependency-gated issues remain open. The 90-task Amex comparison remains unassessed; no 90% parity claim is made.

This task created local code, documentation, migrations, fixture records and test artifacts only. No remote push, PR, merge, hosted deployment, visitor-setting change or real financial activity occurred. Netlify access remains unchanged. The local demonstration does not require a new external approval; existing export, review and public-release decisions retain their separate scope.
