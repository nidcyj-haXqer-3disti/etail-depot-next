# Fresh two-service delivery evidence — D52

Completed locally on 2026-09-10, branch `feature/fresh-two-services`. The user approved the fresh rebuild around the two accepted journeys. [Design](FRESH_TWO_SERVICE_BUILD.md) is the current model; earlier account designs are historical.

## Delivered experience

- [Cardholder services](http://127.0.0.1:3100/cardholder-services): selected card, available money, direct controls and activity together; primary group oversight, strictly own-card secondary access, invitations, reviewed issuance, reports and private support.
- [Merchant payments](http://127.0.0.1:3100/merchants/7c6eac76-1dcc-4c8e-b529-95e5469622d2?tab=payments): Online store's actual sandbox payments, refund and transfer, persistent filters and exact receipts. [Merchant overview](http://127.0.0.1:3100/merchant-services) shows permitted primary/submerchant work, channels, people and setup.
- Customer care: separately assigned operators read, reply to and resolve private Cardholder questions with attributed messages, stale-version checks and retained retry identity. The case header names its creator, including a secondary cardholder, rather than the group's primary.

The app's login offers fictional primary, secondary and support personas. Alex sees two cards and three merchant units. Jamie sees only the assigned secondary card and Pop-up shop. Morgan Support has two explicit assignments, one case and no customer service enrollment. The preview has two purchases, three channels supporting seven presentations, three payments, one full refund and one transfer. It contains zero historical-model fixture rows. Eight unauthorized resource checks passed. Both customer tabs were refreshed and inspected in the in-app browser, signed in as Alex.

## Source and runtime

| Boundary | Revision or environment |
| --- | --- |
| Recoverable source before rebuild | `3d67ee996743eae30a80648298110af3b8268e33` |
| Fresh application before final operator attribution correction | `fecf9e0cd2923b11664ba0c5bf00b7e0d569c0ef` |
| Final application, generated contracts and affected tests | `9cbf2e764aa43edbcd700e8701b1550520d1242c` |
| Subsequent changes | Delivery documentation and visual audit assertion only; no application changes |
| Runtime | macOS, Node 24.19.0, pnpm 11.19.0, Next 16.3.4, TypeScript 6.0.3, native PostgreSQL 18.6 |
| Active databases | `etail_depot_next_services_test`, `etail_depot_next_services_preview`, loopback port 55439 |
| Running preview | Production Next on loopback port 3100; `pnpm preview:fixture` verifies preparation without migrating or seeding |

Three fresh migrations are applied: the new service baseline, merchant resume/empty history retirement, and mandatory card-request provenance/dispute retirement. The applied baseline was not rewritten. The schema drift check reported no changes. The active source contains no old `/accounts` or `/api/v1/accounts` implementation. Identity binding creates no financial service; explicit enrollment does. Money remains integer minor units, and the single immutable balanced ledger and canonical commands govern financial changes.

## Executed verification

All listed final commands exited 0. Logs are local artifacts under `artifacts/fresh-services/`; the repository records this evidence index. The full domain and browser passes cover the fresh application checkpoint. The final customer-attribution change then received scoped lint, full type checking, integration/contracts, affected browser tests, production packaging and a complete new visual pass. Overlapping reruns are not added as unique tests.

| Check / command | Result | Evidence |
| --- | --- | --- |
| `node tools/run-with-database.mjs vitest run tests/unit tests/integration tests/concurrency` | 371 tests, 54 files; no warnings | `domain-clean-model-final.log`, `domain-verification-receipt.json` |
| `node tools/run-with-database.mjs vitest run tests/integration/operator-support.test.ts` | 7 passed after final customer correction; includes a new distinct-name regression | `operator-customer-integration.log`, exact lint/type commands in `operator-customer-receipt.json` |
| `pnpm test:contracts` | 11 tests, 5 files; generated OpenAPI and bidirectional route inventory pass | `contracts-customer-verified.log` |
| `pnpm lint`; `pnpm typecheck`; final `tsc --noEmit --incremental false` | Passed; final changed application files linted again | `lint-verified.log`, `types-final.log`, `operator-customer-receipt.json` |
| `node tools/verify-architecture.mjs` | Detector self-tests and scope/ownership guards pass; 192 files, 39 UI roots, 63 API routes, one Identity SDK import | `architecture-verified.log` |
| Guarded Playwright run across API, desktop, mobile and accessibility projects | All 38 cases passed: 8 API, 10 desktop, 10 mobile, 10 accessibility | `browser-full-final.log` |
| Affected operator Playwright cases across those four projects | All 7 passed after final application change | `browser-operator-final.log` |
| `node tools/capture-service-preview.mjs --local-preview-3100` | All 81 states pass at 1440/390/320px; zero axe violations, overflow failures or captured client errors; all three domain projection comparisons unchanged | `visual-preview-final.log`, `visual/checks.json` |
| `ENABLE_REAL_MONEY=false pnpm exec netlify build --offline --context deploy-preview`, explicit verified site ID | Production Next and offline Netlify packaging passed; no deployment | `netlify-build-customer-label.log` |
| `pnpm db:generate` | No schema changes after all three migrations | `dispute-retirement-drift-check.log` |
| `node tools/run-with-database.mjs --preview tsx tools/verify-clean-preview.ts` | Current fictional projections, operator separation and eight denied resource checks pass | `preview-final-verification.log` |
| `python3 tools/test-handoff.py` | 35 original helper tests against current source-only handoff files; original package hashes are not recertified | `handoff-closeout.log` |
| `node tools/verify-security.mjs`; dependency audit and peer checks | Static security checks pass; audit retry reports no known vulnerabilities; peers pass | `dispute-retirement-security.log`, `dependency-audit-network-retry.log`, `peer-check-closeout.log` |

Browser coverage includes reviewed issuance and retries, freeze/unfreeze, invitation acceptance/permission changes/revocation, primary/secondary privacy, submerchant creation, all seven channel presentations, payment/refund/transfer operations, exact receipts and operator uncertain-request recovery. The automated visual audit checks WCAG 2/2.1/2.2 AA tags, horizontal reflow and whether money and controls fit in the first mobile viewport. It does not establish exhaustive WCAG conformance or manual review of every screenshot.

Manual review inspected primary Cardholder desktop/mobile, secondary Cardholder mobile, primary Merchant payments desktop/mobile, secondary Merchant payments at 320px, primary access management, and operator case desktop/320px. The first nine representative images are retained in `visual-before-customer-correction/`. After finding and fixing the incorrect operator customer name, the final `visual/operator-case-1440.png` and `visual/operator-case-320.png` were manually inspected again; both clearly name Jamie Morgan. All 81 final screenshots and machine results are retained in `visual/`.

## Data preservation and recovery

The private source archive `.local/fresh-services/baseline.tar` has SHA-256 `99366147c822785564c5119127b56af403265a3226aba7b3c54b10c2bb90026e`. The original databases were not used by the new application or modified by the fresh migration runner. Prior source, tests and migrations remain in git and the archive, outside the active runtime.

The first fresh test generation contained synthetic cards without issuance requests and real test ledger entries. Instead of deleting those rows or inventing request provenance, its whole database was retained as `etail_depot_next_services_test_retired_d52`: 37,695 rows across 51 tables, unchanged hash `ea5feec631cc4911c0361e189a478eea806a9fc10ca860698ee9c3c80fb1a9b9`. No clients were terminated. The fixed canonical test database was then recreated with the final schema and canonical seed. This is a local preservation record, not an independently tested database restore.

Final retirement preserved all 184 supported preview rows across 48 tables, excluding migration metadata and two archived obsolete grants. Hash: `2b6153581273a08515836caa5d43b9cfff575274da28136e43c0624ed95db201`. The two actual preview cards already had issuance requests. Migration three rejects unsupported nonempty dispute data or missing request provenance before retirement. Exact migration hashes and archival details are in `dispute-retirement-receipt.json`.

After all three migrations, repeated explicit preparation changed none of 49 public tables / 187 rows, hash `528f8d273dd7a0c26f01e8519de5ae3d370f0a799774196cf1e2a430263e77d5`. Logs: `preview-noop-before.log`, `preview-final-preparation.log`, `preview-noop-after.log`. Private before/after receipts are under `.local/preview-replay-fresh-services-v1/`. This supersedes the earlier pre-retirement `seed-noop-receipt.json` table count. Later fictional browser sign-ins intentionally create sessions; the final visual audit separately confirmed unchanged customer/merchant/operator domain projections.

## Corrected failures and practical limits

Earlier candidates failed obsolete implicit-enrollment fixtures, retired route counts/imports and several new browser locators. A query-sequencing edit introduced duplicate acquiring loops; the 23 failing tests caught it, the loops were corrected, and the final full domain run passed without warnings. A strict visual heading selector matched both a heading and card title and was narrowed to the actual page heading. Manual review found the real operator customer-attribution issue described above. Exact failed candidate logs remain alongside final logs.

The initial offline build encountered local preference-file permissions and the first dependency audit encountered DNS failure; authorized retries passed. Browser logs include color-environment warnings and one Next message, “destination stream closed early,” during the full run; all assertions passed. No root cause beyond the observed interrupted response is claimed. The complete final visual pass captured no client runtime errors.

This is a functioning local sandbox, with real-money execution disabled. Live billing payments, fees/rewards, real card issuance/MIDs, KYC/KYB decisions, processor settlement and bank transfers are not enabled. A new merchant-payment dispute lifecycle and broader merchant support intake remain separate work. SMS/email/social/QR/link previews do not send external messages or provide a public payment service. The published Amex reference study informs these journeys; private architecture, complete product parity and a 100% benchmark score are not claimed. The [broader gap audit](../planning/EXPERIENCE_GAP_AUDIT.md) remains open.

No remote push, merge, deployment, public release, DNS change, hosted access change or unrelated Etail resource modification occurred. Offline packaging used the explicit existing new-site ID `cbbb6c24-9dbc-43a2-9234-e4357b5b5280` only.
