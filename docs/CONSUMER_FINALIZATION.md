# Consumer experience and search preparation — D53

Implemented locally for the 2026-09-10 request: improve the consumer landing and UI/UX, remove internal language, prepare Google discoverability and push the code to the verified new repository. D52's two-service model, permissions and financial commands remain authoritative. No migration or financial rule change is included.

## Experience and search

The new home page explains what people can do, with cardholder/business introductions, clear demo and sign-in actions, a service comparison, useful answers and a complete footer. Public navigation remains visible on phones. Server-rendered `/card-services`, `/payment-services` and `/help` pages let visitors understand the product before signing in. Keyboard-accessible help answers describe the actual invitation/issuance and payment-setup steps. The decorative product illustration uses existing brand assets and CSS; it contains no customer data, fake balance or live-product claim.

Cardholder, Merchant and customer-care copy removes command/projection/retry terminology, obsolete dispute descriptions and inaccurate support privacy claims. Merchant Active status is distinguished from its payment connection; a primary's view of a submerchant is labeled correctly. Payment receipts, invitations, permissions and setup use readable customer terms. Sandbox disclosures, financial distinctions, card references and authorization remain accurate. Backend edits change customer messages only.

Four public pages have distinct titles/descriptions, canonicals, social metadata, known-brand structured data and a generated social image. Private pages inherit noindex and no canonical. Public indexing stays disabled pending an approved launch; the current sitemap is empty. [Search notes](CONSUMER_SEARCH.md) record official Google/Next sources and the precise release gate. No Search Console submission, Google indexing/ranking or public deployment is claimed. The existing Netlify publication hold is unchanged.

## Executed checks

Environment: macOS, Node24.19.0, pnpm11.19.0, Next16.3.4, TypeScript6.0.3, PostgreSQL18.6. Tests use only `etail_depot_next_services_test`; the preview uses the preserved `etail_depot_next_services_preview`. Evidence below is in `artifacts/consumer-final/`, with focused receipts in `artifacts/customer-copy/` and `artifacts/consumer-search/`.

| Command / check | Result | Log |
| --- | --- | --- |
| `pnpm lint`; `pnpm typecheck` | Exit0 | `lint.log`, `types-final.log` |
| `node tools/run-with-database.mjs vitest run tests/unit tests/integration tests/concurrency tests/contracts` | 401 passed, exit0; includes18 SEO tests and actual social PNG rendering | `domain.log` |
| `node tools/verify-architecture.mjs` | Exit0; canonical UI/command/ledger ownership maintained | `architecture.log` |
| `node tools/run-with-database.mjs playwright test` | 54 passed,2 equivalent-URL string assertions failed; all12 new public accessibility cases passed | `browser.log` |
| `node tools/run-with-database.mjs playwright test tests/browser/public-foundation.spec.ts --project=desktop --project=mobile` | All6 passed, exit0, after normalizing root canonical URLs | `browser-public-rerun.log` |
| `node tools/capture-consumer-preview.mjs --local-preview-3100` | All15 states pass at1440/390/320px; zero axe violations, overflow or captured client errors | `visual-final.log`, `visual/checks.json` |
| Explicit new-site `netlify build --offline --context deploy-preview`, `ENABLE_REAL_MONEY=false` | Production Next and offline Netlify packaging pass, exit0; no deploy | `netlify-build.log` |
| `node tools/verify-security.mjs`; `python3 tools/test-handoff.py`; `git diff --check` | Exit0;35 source-only handoff helper tests pass | `security.log`, `handoff.log` |

All56 distinct browser cases pass across full/focused runs; overlapping reruns are not extra cases. Two initial assertions compared equivalent root URLs with/without a trailing slash. Normalization preserves exact host/path checks. The first wrapper was interrupted after its completed failure report did not exit; the successful focused run exited normally. Logs retain color warnings and an interrupted Next response during rapid navigation; no root cause or warning-free full run is claimed.

Manual review inspected desktop/mobile home views, the full home layout, 320px help and sign-in, and the mobile payment guide. The capture tool was corrected to scroll to the top before full-page screenshots, preventing an offscreen skip-link screenshot artifact; no application change was needed. All15 final states and viewport/full-page screenshots are retained. Axe checks do not establish exhaustive accessibility certification.

## GitHub handoff

Verified private target: `nidcyj-haXqer-3disti/etail-depot-next`, repository ID1361184741. It was empty. Terminal Git had no authentication; the connected integration has write permission. The handoff uses a project-marker bootstrap on main, an exact tracked-file snapshot on `feature/fresh-two-services`, and a draft PR without merging. Local source history and recovery archives remain intact.

Upload excludes ignored databases, credentials, logs and build outputs. Blob/tree hashes and executable modes must match the local committed Git tree. Publication IDs and remote CI results are recorded after actual readback, not inferred from local passes. CI includes all18 new public browser cases and18 SEO unit tests; it does not deploy or merge. The broader financial/provider scope remains open as recorded in D52.
