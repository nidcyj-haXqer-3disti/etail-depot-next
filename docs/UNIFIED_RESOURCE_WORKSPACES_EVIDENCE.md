# D80 verification — card and terminal detail workspaces

13 September 2026. [The design contract](UNIFIED_RESOURCE_WORKSPACES.md) records the public references and customer journey. Work starts from published D79 tree `7caeaafe48e5db7db0cf739ba088b7c99180b5c5` on `codex/unified-resource-workspaces`. This document records observed results, not a private Amex/Stripe parity or connected-provider claim.

## Implementation

Cards retain one creation/command owner. The selected detail contains freeze confirmation, inline total allowance, recipient access/invitation, recent activity and servicing links. The former Manage card / Card settings detour is removed. A memory-only, exact person/service/card registry retains an unconfirmed limit's immutable request through client navigation. Acknowledged responses clear only the matching command; sign-out requires a deliberate choice before revoking the session if a limit remains unresolved. Browser reload/sign-out ends this tab's retry memory and does not cancel a possibly saved change.

Card and terminal creation use the same For someone else / For your use choices. Their invitation share sheet offers email, text, WhatsApp, copy and native apps when available. Contact-bound recipient acceptance remains unchanged; preparing a link or opening a share app does not prove delivery. No actual message is sent by the test harness.

Merchant uses Overview / Terminals / Account settings. Overview composes a read-only ledger-backed credit/debit statement with current authorized funds and the existing payout tasks. Internal settlement/reservation movements are not counted as new income or a second expense. Terminal statements exclude unattributable business payouts and other terminals' records. Applied saved type/status restrictions are visible and can be cleared without changing business/terminal scope. Each terminal detail contains channels, authorized access sharing, activity, disputes/support and owner controls. Account settings use the exact Merchant service identifier, reusing the canonical business application commands. Personal profile and sign-in controls remain independent of either service account.

## Additive database preservation

`20260913130000_terminal_intended_use/migration.sql` adds one SELF/OTHER terminal field. Omitted historical creation inputs keep their original digest/replay behavior and default; intended use grants no access. Current accepted/pending assignments inform the narrow backfill. Existing versions, creation times, invitations, grants and financial entries are preserved.

The test database applied this migration through the guarded runner. The local preview applied it only through `node tools/run-with-database.mjs --prepare-preview`; completed seed preparation reported a no-op. Before/after read-only hashes compared all pre-existing public columns and records, excluding only the new field and its migration registry row. All 95 public tables and 399 pre-existing rows matched. Evidence: `artifacts/d80-preview-before-final.log`, `d80-preview-prepare.log`, `d80-preview-after.log`; digest `a66c7a0a580c7adf3079768da21c0bc74b7144fcd767bf90ecedf01fcb009b61`. No preview reset or historical fixture restore occurred.

## Completed local verification

Runtime: Node 24.19.0, pnpm 11.19.0, Next 16.3.4, PostgreSQL 18.6. All final commands below exit 0. Local evidence is under ignored `artifacts/`.

| Check | Observed result | Evidence |
|---|---|---|
| Unit |513 passed|`d80-unit-verified.log`|
| PostgreSQL integration|262 passed; final statement/resource projection rerun 6 passed|`d80-integration.log`, `d80-integration-final.log`|
| Concurrency / executable contracts|42 /12 passed|`d80-concurrency.log`, `d80-contracts.log`|
| Lint / TypeScript|Passed; final Next build includes TypeScript|`d80-lint-release.log`, `d80-netlify-release.log`|
| Architecture / security / dependency audit|Passed; no known dependency vulnerabilities|`d80-architecture-verified.log`, `d80-security.log`, `d80-security-final.log`|
| Handoff helpers|35 passed|`d80-handoff.log`|
| API / desktop-mobile / accessibility|All 269 distinct cases pass across full and corrected runs:9 API,230 browser,30 accessibility|`d80-browser-corrected.log`, `d80-browser-final.log`, `d80-statement-complete.log`, `d80-browser-release.log`|
| Final affected merchant/invitation/accessibility cases|38 passed on the final production build; preceding statement/settings/recovery rerun14 passed|`d80-browser-release.log`, `d80-statement-complete.log`|
| Isolated email/session browser suite|28 passed|`d80-email.log`|
| Production Next / offline Netlify package|Passed with exact bound site; no upload|`d80-netlify-release.log`|
| Responsive preserved preview|108 states passed at1440/390/320px; no accessibility violations or horizontal overflow|`d80-dashboard-preview-release/checks.json`|

The final preview capture blocks business writes and external requests. All 19 authorized owner/recipient projections and the source hash remained unchanged. Root inspected card details and Merchant Overview; independent visual review inspected card/terminal invitation sheets, recipient screens and owner screens. Eight isolated invitation images are retained in `d80-invitation-final/`, including desktop and320px share sheets. No real contacts were sent invitations. The capture source hash and final local commit/tree are recorded in the capture receipt and `d80-review-source.json`; the later closeout changes are documentation only.

## Corrections retained

The initial architecture check correctly rejected the expanded service transport. Its guard now accepts only the exact enumerated SERVICE/TERMINAL prefixes with encoded selected identifiers and unchanged path/method; mutation tests reject arbitrary or swapped routing.

The initial browser run passed52 cases before being stopped. It found a server-rendered statement calling a client-only date export; the statement now imports the existing pure date helper. The initial run also found a stale freeze locator and an immediate URL read before navigation completed; tests now use the direct controls and wait for the exact terminal URL. Original failures remain in `d80-browser-initial.log`.

Source review also found and corrected hidden legacy statement filters, inline limit retry loss through client Back/sign-out, and support-task prefill when entering the new composite terminal from a payment. These corrections retain current authorization and the original command identity.

The full corrected browser run passed259/269. Follow-up failures exposed a nested Escape event closing both invitation and share dialogs, missing exact statement receipt references, and outdated/scopeless test selectors. Escape now closes only the top dialog; statements search and link canonical receipts. Tests retain exact amounts, query scope, command identity, private-data exclusion and recovery assertions. One follow-up began before the final navigation assertion was frozen; the original output is retained. Final statement tests compare all normalized query values (including omitted defaults) after the destination form has loaded. Final14 and38 case runs pass.

The first visual captures stopped at7 states because Payment channels had two nested landmarks with the same label. The redundant outer landmark was removed. The next capture stopped at50 because its harness expected a literal Business details heading where the page intentionally shows the business name; the corrected harness checks the unique page heading and Business details region. Final108 states pass with all guards intact. Visual review also removed a redundant activity-back link, suppressed owner-balance copy for recipients, restricted acceptance deadlines to pending invitations and corrected settings return labels. Earlier capture receipts and source hashes remain in the original artifact directories.

## Release boundary

D79 remains the published version. No D80 merge, upload, hosted migration, Identity change or access-setting mutation is established by local checks. Fictional local authentication and payment harnesses do not prove real mailbox delivery, live card issuance or actual network settlement.
