# Two-service consolidation

Decision D51 implements the user's approval of the Amex experience correction: make its design consistent across the database, backend and interface, and remove superseded entry paths. The benchmark and its evidence remain in [Amex experience correction](AMEX_EXPERIENCE_CORRECTION.md). This task does not award a parity percentage or complete the larger platform backlog.

## Customer model

- **Cardholder services:** the named primary manages the card group; a secondary sees only their own permitted cards and activity. Home and servicing retain the selected card. One Add card lifecycle and one command path remain authoritative.
- **Merchant services:** the responsible primary oversees its submerchants, payments and delegated access. A submerchant user sees only the records explicitly shared with them. New primary setup and directly owned submerchants do not require Cardholder enrollment.
- Internal financial account IDs remain resource ownership keys. They are not a customer account-type selector. Card and merchant permissions remain independent.

## Database and command changes

Migration 14 removes the required Personal source from **new** merchant creation receipts. Existing source IDs, digests and retry identities remain unchanged. The same creation command rechecks historical source authority when replaying an old receipt; new commands require the declared adult sandbox applicant eligibility and current destination authority on replay.

A newly created, directly owned submerchant is hosted by its exact responsible primary's financial account. The database allows this only when host and responsible account IDs are equal; it rejects another primary's Merchant account as that host. Existing delegated Personal/Household hosts retain their recorded consent, membership versions, grant ancestry and financial attribution. The one relationship writer still records acceptance and supports historical command retries. Directly owned units use their primary's explicit payment/channel grants, not the broader delegated-host permissions.

A shared base membership and its old default card-access fields no longer place a merchant-only person in Cardholder lists. Durable Cardholder participation is identified from the named primary, actual cards, card permissions or invitation history. Pending offers are visible as history but cannot authorize access edits. Only accepted enrollment establishes participation for those commands. Invitation acceptance preserves merchant membership versions and grants.

The migration changes constraints and column requirements only. Before/after private PostgreSQL row hashes cover every original public table. Historical ledgers, cards, applications, commands, access history and preference rows are retained. There is no customer-data import or seed reset.

## Removed and consolidated paths

- Removed persisted account-selection runtime, selection API and selected-account response field. Historical preference rows have no runtime reader or writer.
- Removed the account-based merchant creation, acquiring entry, merchant application and Get paid entry routes. Merchant setup uses an exact authorized merchant projection and merchant-scoped routes, with the existing application command owner.
- Removed the unused setup-choice reader, account-type handoff projection and test-only payment-draft adapters. Monetary, expiration, version and retry coverage runs through canonical payment-channel commands.
- Cardholder task routes share selected-card navigation. Old Cardholder links are thin, validated redirects; unavailable IDs never choose another card or financial owner.
- Merchant pages use the service dashboard's hierarchy instead of loading every descendant's full workspace on every tab.
- Updated server projections replace stale merchant rows and permissions without discarding authorized uncertain command identities. No-longer-authorized details are dismissed.

## Verification and delivery

Application source: **`ec139c4006cd710dd97f1705186bf5e09dbf9818`**, tree `ff7c5f679296b9d11adba38a11c554cb61405deb`, branch `feature/EDN-003-foundation`. Node 24.19.0, pnpm 11.19.0, native PostgreSQL 18.6 on the isolated loopback runtime. Existing dependency versions and lockfile are unchanged.

| Check | Result | Receipt under `artifacts/service-consolidation/` |
|---|---|---|
| Unit, PostgreSQL integration, concurrency, adapter/API contracts | **419 passed / 63 files**, exit 0 | `domain-final.log` |
| Schema generation | No drift; 14 migrations | `schema-drift.log` |
| Production Next and offline Netlify packaging | Passed, exit 0 | `netlify-build.log` |
| Lint / TypeScript | Passed, exit 0 | `lint-final.log`, `types-final.log` |
| Source architecture / security / dependency audit | Passed; no known vulnerabilities | `architecture-final.log`, `source-security-final.log`, `security.log` |
| Source-only handoff helpers | 35 passed | `handoff.log` |
| Responsive visual/accessibility journeys | **78 states passed**, 60 screenshots, 16 manually reviewed | `visual/checks.json`, `visual-review.md` |
| Full API / desktop / mobile / accessibility suite | **All 123 runnable cases passed**: 119 in the full run plus 4 corrected focused cases; 7 intentional project exclusions | `browser-full.log`, `browser-corrections.log` |

Before/after snapshots cover all 53 public test tables and all 54 public preview tables. Migration 14 preserved **all 308,829 original test rows and all 191 original preview rows**; the only addition in each database was its migration receipt. Private exact-text hashes are retained in `.local/service-consolidation/`. Read-only visual capture separately confirmed unchanged authorized card and merchant financial projections. Fictional sign-in creates session records only.

The initial domain run retained four failures: a malformed merchant ID reached PostgreSQL without validation; two test expectations still assumed former merchant entry/host behavior; and one test tried to revoke Cardholder access that its fixture had never established. The ID now fails closed before querying; tests use the direct merchant model and a canonically accepted Cardholder invitation. The complete corrected 419-case run passed.

The browser candidate exposed two assertion issues on desktop and mobile: one read serialized content while an authorized legacy redirect was still navigating; another searched previously authorized hydration history after a permission refresh. The corrected tests wait for the exact task URL/heading and assert current rendered content plus fresh exact-merchant API exclusion. Delayed-response, closed-dialog, secondary isolation and command-identity assertions are retained. Application code did not change for these test corrections. Final browser-test source is **`a0a21fb412accdacbdaeea2d4faf757f66e3b5f0`**; the focused four-case rerun passed, exit 0. This is complete distinct-case coverage across runs, not a second full-suite run. Navigation-interruption logs retain a Next.js destination-stream-closed diagnostic; the server continued and the visual capture recorded no client runtime errors.

An independent source review also identified and corrected late-response dialog restoration, discarded unresolved retries after permission loss, and stale checkout readiness before the final application build. No old response can restore a prior projection's dialog; unresolved command IDs remain available for safe recovery after access is restored.

The application remains a local sandbox. No live MID, card issuance, financial transfer, KYC/KYB decision or external message is performed. No hosted access setting, deployment, remote branch or release is changed by this task. The known Amex gaps—such as live billing/repayment and processor settlement reporting—remain explicit in the experience gap audit. Existing saved historical report definitions retain their actual source meanings; they are not silently rewritten as new card or processor statements.


The final production preview is running at [Cardholder services](http://127.0.0.1:3100/cardholder-services) and [Merchant services](http://127.0.0.1:3100/merchant-services). Startup reports completed preparation and performs no migration or seed writes. Both existing in-app dashboard tabs were reloaded and inspected against the clean Alex/Jamie and Etail Studio records; old cached interface content was replaced. The temporary 3101 inspection server was stopped. Final evidence is local; no external release was performed.
