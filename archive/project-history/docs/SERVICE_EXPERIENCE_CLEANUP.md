# Clean Cardholder and Merchant experience

Latest user direction, 9 September 2026: make both dashboards simple, remove internal language and obsolete account-based behavior/data, and make the same services easier to manage. This refines [the service dashboard design](SERVICE_DASHBOARD_DESIGN.md). Primary oversight and secondary privacy remain unchanged.

## Customer experience

Cardholder services starts with a compact overview. Cards, Activity, Cardholders and Saved requests have separate views rather than appearing together on one long page. Each card opens the existing controls and saved-request workflow. Cardholders are named; access reviews identify the cards they affect. Secondary users see only their cards and linked purchases.

Merchant services starts with a concise payment summary, recent payments and relevant next steps. The merchant selector keeps the primary or submerchant explicit. Channels, Payments, People and Setup remain focused tasks. Primary dispute servicing uses a dedicated authorized queue, independent of Cardholder access. Saving or submitting a response remains a local sandbox action, not a network submission or case decision.

Management stays beside the record being managed: cardholder access and unfinished card requests, merchant setup and channels, payment details and permitted refunds/transfers, and the primary dispute queue. When a person manages both sides of a merchant relationship, People shows one name with both roles while retaining separate authority records. These are the existing named primary/controller permissions; this cleanup does not invent a platform-wide staff role or grant access to unrelated customers.

Card details link to that exact card's historical activity route, avoiding a false empty result from filtering the dashboard's latest 25 transactions. Sign-in security has its own `/security` page, reachable through Services and task search without selecting or owning a card. It reuses the existing authenticated session reader and revocation commands.

Use plain labels such as Available to spend, Starting balance, Create card and Make purchase. The visible Sandbox disclosure explains that cards and payments are demonstrations and no real money moves. Routine views no longer repeat database, provider, scope or historical-fixture explanations. Error states explain the next action and preserve saved requests after uncertain responses.

## Removing obsolete behavior

The redundant account overview and unused account presentation/product maps are removed. Authorized old overview links return to Cardholder services; unavailable records still fail authorization. Customer navigation uses the service views directly. The old merchant settlement/example overview is removed while its dispute-response command lifecycle remains available through the primary merchant's servicing queue.

The existing canonical commands, explicit responsible parties, recorded financial ownership, current permissions, immutable journals and retry identities remain. Database identifiers and compatibility API paths are implementation details, not additional customer account choices. Historical regression fixtures remain isolated in the test database so previous privacy and financial invariants continue to be tested.

## Clean local data

The active preview moves to the explicit project-owned local database `etail_depot_next_preview_v2`. The prior `etail_depot_next` remains an offline recovery copy and local test-administration anchor. Before cutover, a private snapshot and readback verified all 368 original rows across 52 tables unchanged; snapshot SHA-256: `bea93a0914e8280513b213f599e024bd685d5212992e8c78dc3b1837930321f5`. No old application/customer database is involved.

The new database has the existing 13 migrations and a guarded, explicit seed process. Startup verifies ownership and completed preparation and never reseeds records or restores permissions. The old historical seed runs only against the isolated test database. Unknown database names, CI preview mode and hosted execution are rejected.

The clean dataset demonstrates Alex Morgan as primary, Jamie Morgan as secondary, one card for each, Etail Studio as primary merchant, and Online store and Pop-up shop as submerchants. Jamie is invited only to Pop-up shop. Financial examples are created through the same card, payment, refund and transfer commands used by the interface; no historical balance snapshots or unissued sample cards enter the active preview.

The completed seed was rerun between read-only snapshots of every public table. All 54 tables and 183 rows, including content and column digests, remained identical: `b656046137292ebc8c38692a61d1eca9816d51cb62681264c207f3afd63cb887`. Files use mode `0600` in a `0700` directory. Canonical projection checks confirmed Alex's two cards and three merchant units; Jamie's one card, one purchase and single Pop-up shop, without primary creation, gateway, payout or refund authority. Four foreign-resource reads were denied and historical fixture counts were zero. Authentication during browser review creates ordinary local sessions after this initial-data snapshot.

No migration was added by this cleanup. The new primary dispute read uses the existing merchant and dispute permissions and response lifecycle; it does not require Cardholder access or create a universal operator role. Customer management is contextual and permission-bound.

## Delivery evidence

Baseline: `289c7ce`, branch `feature/EDN-003-foundation`. Core application/tools and initial tests: `1eea9585e16f1c64465dbe16b00dd87c5264c45f`, tree `a6c643065c446bf3eb83093a78c0e7f3482c62e2`. Final application and browser corrections: `84520a5793199499b4b95b3c6d58d187586ed218`, tree `b63f01ff6039afde810d76595ef910c0769c1d7a`. Subsequent closeout updates documentation only.

Environment: Node 24.19.0, pnpm 11.19.0, Next.js 16.3.4, TypeScript 6.0.3, native PostgreSQL 18.6 on loopback port 55439. Browser automation uses Chromium. Test data stays in `etail_depot_next_test`; clean visual review uses `etail_depot_next_preview_v2` on port 3101, with the final customer preview on port 3100. `ENABLE_REAL_MONEY=false` throughout.

Build command: `NETLIFY_SITE_ID=cbbb6c24-9dbc-43a2-9234-e4357b5b5280 node node_modules/netlify-cli/bin/run.js build --offline --context production`. This builds Next and packages the existing adapter locally without publishing. Database tests use `node tools/run-with-database.mjs vitest run`. The complete browser command is `node tools/run-with-database.mjs playwright test`; focused reruns preserve all failed-case lifecycle and privacy assertions.

| Verification | Final result | Receipt in `artifacts/service-cleanup/` |
|---|---|---|
| Unit, PostgreSQL integration, concurrency and executable contracts | 408 passed, exit 0; backend unchanged by final UI fixes | `domain-candidate.log` |
| All browser API, desktop, mobile and accessibility cases | All 116 distinct cases passed across the full 102-pass candidate and successful 16-case focused rerun; six intentional project exclusions | `browser-complete.log`, `browser-focused-final.log` |
| Clean preview desktop/mobile accessibility and reflow | 60 views passed at 1440/390/320px, plus three final People views; zero axe violations, overflow, runtime errors or attempted domain writes | `visual-capture.log`, `visual/checks.json`, `visual-people-final/checks.json` |
| Manual visual review | 21 initial and three final screenshots retained; 17 representative images inspected, including all three final People layouts | `visual-review.md`, `visual-people-final/review.md` |
| ESLint and TypeScript | Passed, exit 0 | `lint-closeout.log`, `typecheck-closeout.log` |
| Architecture and canonical workflow ownership | Passed, exit 0; final change groups display rows only | `architecture-final-complete.log` |
| Security source checks, dependency audit and peer resolution | Passed, exit 0; no known dependency vulnerabilities | `security-complete.log`, `audit-frozen.log`, `peers-frozen.log` |
| Original handoff helper regressions | 35 passed, exit 0 | `handoff-frozen.log` |
| Production Next build and offline Netlify packaging | Passed, exit 0, final application source | `netlify-build-people-final.log` |
| Clean data and seed replay | Original archive preserved; complete replay unchanged; four foreign-resource denials and zero historical fixtures | `archive-verify.log`, `snapshot-noop.log`, `preview-projections.log` |
| Final preview startup and in-app inspection | Started successfully on port 3100; verification explicitly performs no migration/seed writes. Signed in as Alex and inspected both service dashboards. | `preview-final.log` |

The focused browser selection covers all 14 failed cases plus the two existing desktop/mobile People journeys enhanced for the single-person display. All 16 passed in one run, with one intentional project exclusion. The final clean People check confirms two underlying controller authority records still appear as one person with both labels. Every final application change has relevant browser and visual coverage; the 102 passing candidate cases are not misrepresented as a new complete rerun.

Intermediate failures remain recorded. Early lint/type checks raced files being removed or edited by the owning agent; subsequent complete checks passed. The first retry-page build exposed a duplicate local variable; the correction passed Next/TypeScript and offline packaging. The first complete browser run passed 102 cases and failed 14, with six intentional project exclusions. The 14 failures comprised twelve retired-wording/navigation expectations and two instances of one workflow reloading before navigation completed. The final tests wait for the actual destination before reload and use current visible wording; financial/privacy assertions were not removed. Error contexts are preserved in `artifacts/service-cleanup/browser-candidate-errors/`. Nonfatal PostgreSQL concurrent-query, terminal color and aborted Next navigation-stream warnings are retained in the original logs.

No hosted settings, remote branch, feature merge, deployment, original workbook, dependency version or real-money change is part of this local cleanup. The prior Amex studies remain the design reference; this delivery does not establish 100% Amex parity or complete the broader platform backlog.

The completed local preview is open at [Cardholder services](http://127.0.0.1:3100/cardholder-services). [Merchant services](http://127.0.0.1:3100/merchant-services) is available from the shared header. Alex sees two cards and all three merchant units; Jamie sees only Daily spending and Pop-up shop. The old preview remains a private recovery copy and never appears in the active service entrances.
