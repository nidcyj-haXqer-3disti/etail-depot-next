# Service journey audit — D68

12 September 2026. The user requests a fresh end-to-end check of sign-in, Cardholder services and Merchant services. Work is on `codex/service-journey-audit`, based on local `1635edddc9c7f5b43e93d184aca5109a16c8d35f`, tree `7b519102d9c99f01c90da77d170fd985932da799` (the D67 review receipt).

## Scope and acceptance

Verify the implemented sandbox journeys, repair confirmed defects in their existing owners, and keep the local candidate distinct from the deployed revision. A lost response must retain the same command and payload. A later rejection does not prove an earlier attempt failed. If current access is unavailable, hide its private context and offer an explained exit without claiming cancellation or completion. Sign-out must acknowledge revocation before navigation and recover from an interrupted response. Merchant activity filters must survive payment, channel and receipt navigation.

This audit retains the two independent services, primary/secondary and primary/submerchant scope, current provider/session adapters, exact money commands and one ledger. It does not change financial permissions, introduce a migration, reseed the preview, send email, or implement the deferred P5/P6 lifecycles. It does not claim every Amex capability or a production release.

## Confirmed issues and intended correction

| Journey | Finding | Correction and acceptance |
|---|---|---|
| Sign out | An indefinitely stalled response can disable sign-out; any 2xx response was treated as confirmation. | Bound the wait, prevent duplicate dispatch, require the canonical acknowledgement, retain a retry and prove revoked sessions cannot reopen either service. |
| Card actions and requests | A definite error after an earlier unknown result can discard the unresolved attempt. | Preserve the original retry, check current authority, conceal unavailable context and provide an explicit exit. |
| Cardholder access and invitation decisions | An interrupted change can allow edits or another decision before the saved result is known. | Retain an immutable pending command and payload; confirm through the original owner before permitting another change. |
| Merchant creation | An unknown creation followed by access denial can leave navigation locked with no explained exit. | Retain the exact creation retry, hide unavailable details, and allow an explicit return to usable services. |
| Merchant status and support | Navigation can discard an unresolved command; support can clear an unknown attempt on a later rejection. | Register the existing navigation boundary, preserve retry identity and provide an explained unavailable-context exit. |
| Merchant records | Payment → channel → receipt drops the original filtered activity return. | Carry the validated return route through exact merchant records and the signed-in practice checkout. |

## Verification record

Evidence is being collected under ignored `artifacts/service-journey-audit/`. Tests use only `etail_depot_next_services_test`; the preview remains on the separate marked `etail_depot_next_services_preview`. The initial D67 production build passes all 134 API/browser/accessibility cases in one run, all 16 email-provider-harness cases, 361 unit/contracts and 183 PostgreSQL integration cases. These establish the starting baseline, not the final fixes.

Hosted read-only checks on 11 September at 15:57 and 16:03 UTC confirm enabled sign-in, registration and recovery controls, required email confirmation, absent fixture login, four private APIs returning 401 without a session, and three protected pages redirecting to login. The existing user-owned session also loads both dashboards through real navigation and Cardholder reload. No password, token, mailbox, account creation or customer financial mutation is exercised by these hosted checks.

The exact deployed site is `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`; deploy `6aa38cc5382486eaf0a02aa9`, `ready`, commit `7a7f954558f257997cbe64a95fac4719a5231531`, branch `main`, published 11 September at 05:08:59 UTC. It is older than D65–D68. Local provider harnesses do not prove actual hosted mailbox delivery, password recovery or this candidate’s hosted acceptance. Final review receipts are recorded below after verification.

## Candidate verification

Environment: macOS, bundled Node 24.19.0, pnpm 11.19.0, PostgreSQL 18.6, production Next 16.3.4; real money is disabled. The final build contains no database, dependency or provider configuration change. Both canonical card and merchant command transports now bound the request and response-body wait to 30 seconds, report an uncertain outcome, and leave retry to the existing owner. They never automatically redispatch a command.

| Check | Candidate result | Evidence under `artifacts/service-journey-audit/` |
|---|---|---|
| Unit and contracts | 372 passed in 32 files; includes 16 canonical command transport cases | `unit-contracts-final.log` |
| PostgreSQL integration | 183 passed in 37 files; backend unchanged | `integration.log` |
| Concurrency | 35 passed in 11 files; backend unchanged | `concurrency.log` |
| Email/session lifecycle | 24 passed on desktop/mobile through the actual app routes and isolated provider transport | `email-final.log` |
| Merchant recovery and record navigation | 12 passed on desktop/mobile | `merchant-recovery-initial.log` |
| Cardholder recovery | 16 passed on desktop/mobile; includes actual isolated permission removal/restoration | `cardholder-recovery-initial.log` |
| Production Next build | Passed, exit 0 | `build-final.log` |
| Lint, types, architecture, source security | Passed, exit 0 | `lint-final.log`, `typecheck-final.log`, `architecture-final.log`, `security-final.log` |
| Dependency audit | No known vulnerabilities; unchanged lockfile | `dependency-audit.log` |
| Source-only handoff helpers | 35 passed | `handoff.log` |
| Complete candidate browser/API/accessibility run | 160 passed in one full run, exit 0 | `browser-final.log` |
| Offline Netlify package, exact site | Passed, exit 0; no deploy | `netlify-build-final.log` |
| Preserved-preview visual/accessibility/reflow checks | 87 Cardholder + 63 Merchant states passed; zero violations, overflow or runtime errors | `visual-cardholder-final/checks.json`, `visual-merchant-final/checks.json` |

The new recovery checks verify exact request bodies and command identities, one persisted effect, no premature exit on a transient failure, current-access denial, private context concealment, successful original-command recovery after access is restored, and an explained exit when it remains unavailable. Merchant status and both support contexts also receive explicit recovery coverage. Axe and reflow checks cover the new recovery states, including Cardholder dialogs at 320px.

The first architecture run rejected a client import of the server projection schema. The second rejected dynamic stored command paths that its finite-route detector could not inspect. The implementation was corrected to validate the read projection identity/shape and dispatch the existing explicit command routes. The guard was not weakened; final architecture passes. All original failed logs remain. Intentionally dropped responses and interrupted page streams can emit Next destination-stream diagnostics during recovery tests; the tests still verify persisted state and successful recovery. These are not evidence of a normal-page runtime pass; separate guarded visual checks establish normal-page behavior.

## Hosted acceptance and remaining limits

The user-owned deployed session successfully loads both service dashboards; unsigned visitors are denied private records. No real password or mailbox roundtrip was rerun, and the deployed version is older than this candidate. The full email lifecycle above is an isolated local provider harness, not proof of live mailbox delivery or the hosted serverless database path for this revision.

This task does not merge or deploy. The previously requested narrow production-source change remains unapproved; production stays on its existing main revision and visitor access is unchanged. Existing signed-in command attempts are retained while their owner stays mounted. Explicit unavailable-context exit does not cancel or confirm them; browser reload/back can still discard mounted-owner retry state. Guest order attempts retain their separate durable server-owned recovery. External SMS/email delivery, asynchronous provider processing and other deferred P5/P6 capabilities remain outside this audit.


## Final local review

The full candidate regression passes all 160 cases in one run (4.2 minutes), and the final packaged app passes all 24 email/session cases again (18.7 seconds). Both visual captures pass: 87 Cardholder states at 16:24:17–16:24:46 UTC and 63 Merchant states at 16:25:08–16:25:28 UTC on 11 September. Desktop 1440px, phone 390px and narrow 320px views were checked. Representative primary/secondary overviews, the narrow invitation form, primary/delegate Merchant overview, phone payments and people/access were visually inspected.

All 19 Cardholder-capture and 26 Merchant-capture authorized projection comparisons stayed unchanged. These sets overlap; they are not 45 distinct entities. All 610 tracked/unignored source files stayed unchanged during each capture, fingerprint `c39ce55aec283e2d49b5f8ad07b9ef217531d93903006b887fa9053546fff3ee`; only the subsequent documentation receipt changes that fingerprint. Existing preview data, including the preserved `hi` collection unit, remains intact. Captures allowed only fixed fictional login sessions and blocked all business writes. The final preview runs on port 3100 with read-only preparation and no startup migrations or seeds.

The source is prepared for a draft GitHub review stacked on D67. No merge, hosted migration, source-branch setting or deployment is performed by this audit. Exact publication receipts follow after remote tree verification.
