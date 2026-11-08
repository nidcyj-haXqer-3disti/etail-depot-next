# D72 — customer interface cleanup and release

12 September 2026. The user accepted the simpler D71 experience and requested removal of old code, internal and repeated environment wording, consistent customer headers/footers, complete verification and deployment.

## Delivered behavior

One Sandbox badge identifies the environment in the shared header. Public pages, onboarding, card controls, funding, merchant setup, payment/deposit records, help and operator screens use ordinary customer language. Footer navigation provides Help center and, when authenticated, Your services. Public dashboard examples remain labelled as examples. Unavailable physical delivery, notifications and other unfinished capabilities remain truthful; this is not a live-money launch or proof of full product/Amex parity.

Onboarding has one explicit Continue action with its original retry identity. Sample-user sign-in buttons and sample-person invitation selectors are removed. Your services has an optional Your profile section containing the member code; both services use the existing scoped member lookup and explicit recipient acceptance. Creating a login or a merchant grants no unrelated service or operator access.

Funding balance and Deposited balance come from canonical server projections. Financial state, permission checks, exact amounts, immutable journals and command identities are unchanged. There is no schema, migration, data reset, Identity configuration, provider or visitor-access change.

## Removed code and review

Removed two unused UI aliases, unused MerchantShell props, duplicate enrollment error handling, duplicated merchant requirement wording, sample-login props/handlers, sample-person selects and obsolete styles. The import audit found no demonstrably unused customer TypeScript files or active retired Personal/Household/Seller branches. Historical migrations, research, test adapters and current guarded fixtures remain required evidence and test infrastructure.

Independent review caught broken CSS comment terminators introduced during selector removal and a readiness description that implied a published checkout without checking publication. Both were corrected before the production build. The final stylesheet parse and read-only review are recorded with release evidence. Removed selector counts are based on final edits, not a claim that every old file is unnecessary.

## Verification

Local source is verified on `codex/production-ui-cleanup`, based on accepted D71 `52fb21b9b78f505b2a25214eb8f21a19914a2c7c`. Node24.19.0, pnpm11.19.0, Next16.3.4 and PostgreSQL18.6 remain pinned. Tests use `etail_depot_next_services_test`; read-only visual capture uses marked `etail_depot_next_services_preview`. No hosted database is used for these local tests.

| Check | Actual result and evidence |
|---|---|
| Lint, typecheck, architecture, source security and dependency audit | Pass, exit0; `artifacts/d72-lint-release.log`, `d72-typecheck.log`, `d72-architecture-release.log`, `d72-security.log`. No known dependency vulnerabilities reported. |
| Unit and executable contracts | 401 passed; `artifacts/d72-unit-contracts.log`. |
| PostgreSQL integration | 208 distinct cases pass across the initial207 pass and corrected2-case run; the initial failure expected obsolete setup wording. `artifacts/d72-integration.log`, `d72-integration-corrected.log`. |
| PostgreSQL concurrency | 39 passed; `artifacts/d72-concurrency.log`. |
| API, desktop, mobile and accessibility | All195 distinct cases passed across the initial183 pass and corrected22-case run. Twelve initial assertions referenced renamed destination/operator/setup labels; their full failures remain in `artifacts/d72-browser.log`. No financial or privacy assertion was removed. Corrected results: `d72-browser-corrected.log`. |
| Final shared-footer correction | Visual inspection identified the missing Merchant footer. The canonical Footer is now reused there, and all10 current role/keyboard/accessibility cases pass with explicit shared-footer assertions: `artifacts/d72-footer-accessibility.log`. |
| Email/session lifecycle | 26 passed using the isolated email provider on ports3101/3102; `artifacts/d72-email.log`. Covers registration, confirmation, sign-in, reset, retries and sign-out. This does not assert actual mailbox delivery. |
| Next production build and offline Netlify package | Both final stages pass; `NETLIFY_SITE_ID=cbbb6c24-9dbc-43a2-9234-e4357b5b5280 ENABLE_REAL_MONEY=false pnpm exec netlify build --offline --context deploy-preview`, `artifacts/d72-build-final.log`. |
| Handoff helpers | Source-only wrapper `python3 tools/test-handoff.py`:35 passed; `artifacts/d72-handoff.log`. |
| Responsive visual inspection | 27 public states/42 screenshots on the built isolated test server plus33 final role states/screenshots on the preserved preview at1440/390/320px. Zero axe/reflow/runtime/wording guard failures. `artifacts/consumer-entry-d72/visual/checks.json`, `artifacts/prepaid-d72-final/checks.json`. Public login captures show that local test environment's unavailable-provider state; hosted email availability is verified separately. |
| Saved preview preservation | All15 authorized projections and complete source hashes remain unchanged during final33-state capture; no business command is allowed by the capture tool. Only guarded local fixture sign-ins are used. |

The earlier33-state capture in `artifacts/prepaid-d72` remains review history; it is superseded by the final capture after adding the Merchant footer. Public source is unaffected by that private Merchant-shell correction. Review cleared the corrected code with no remaining high/medium-risk finding. Financial writer, permission, recovery and schema behavior remain unchanged.

## Publication and deployment

The user explicitly authorized deployment of the accepted experience and this cleanup. Publish the verified tree through a feature pull request against the exact new repository, require the reviewed revision's GitHub application/PostgreSQL checks, merge it, then deploy only Netlify site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`. PR14's merged main `9e6a650f4a43b968118cb4f0c66b1ff38be3454d` has the same tree as reviewed head `40bf489ebd9d53ca524331763bd217683839ffdf`; it is the publication base.

Exact local/remote tree equality, PR/CI revision, merge commit, deploy ID, hosted read-only checks and any authenticated existing-session observations are recorded in the release pull request and local `artifacts/d72-publication.json`. These release observations remain distinct from local tests. There is no force push, direct-to-main feature change, visitor-access expansion, Identity setting change or real-money enablement. Broader unfinished product capabilities remain in the delivery plan; removing environment copy does not implement them.
