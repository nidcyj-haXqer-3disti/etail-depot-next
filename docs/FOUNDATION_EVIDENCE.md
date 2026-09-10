# Foundation evidence — 2026-09-08

This records the first runnable account/access slice. M0 and M1 remain partial; it is not a complete sandbox release.

## Implemented and exercised

- Next.js 16.3.4 / React 19.2.8 on Node 24.19.0, TypeScript 6.0.3 and pnpm 11.19.0; exact installed versions and one actual lockfile.
- Netlify Database 2.0.1 with Drizzle 1.0.0-rc.4 against native PostgreSQL 18.6. The RC is deliberately constrained to this tested foundation; hosted HTTP/WebSocket transaction compatibility still requires a separate proof before financial writes.
- Versioned generated SQL: people, verified-identity bindings, Personal ownership, three account types, scoped roles, selected-account preference, hashed session families, and a unique business outbox record for identity binding. The outbox is a durable record; no event worker is claimed.
- Explicit selection with server rechecks and no first-account fallback. Personal owners retain private context; Viewer access omits people counts. Managers do not inherit financial powers.
- Opaque HttpOnly sessions, exact-origin CSRF, bounded JSON bodies, strict command validation, sanitized errors, no-store API responses, revocation, and expiry. An identity row lock serializes session mutation; deterministic PostgreSQL lock-barrier tests prove an overlapping rotation cannot escape identity/family revocation.
- Local fictional authentication requires an explicit loopback local/test environment. Local connection URLs reject query-option injection and unrelated roles/ports/databases. Local app listeners bind to loopback.
- Branded responsive account pages, helpful denied/unavailable states, keyboard selection and logout. No fake balances, cards, payments or approvals.

## Verification performed

Development checks ran on Darwin 25.6.0 ARM64 with native PostgreSQL 18.6. Local database roles/data are newly created fictional test resources; no old application connection or customer import was used.

| Check | Final committed-source result |
|---|---|
| Clean frozen dependency installation | Exit 0 |
| Strict peer compatibility | Exit 0, no peer issues |
| ESLint and TypeScript / Next route types | Exit 0 |
| Unit, adapter, PostgreSQL integration/concurrency and OpenAPI contracts | 113 tests passed, 11 files, exit 0 |
| API, desktop, mobile and automated axe checks | 14 tests passed after security review fixes, exit 0 |
| Original handoff helper regressions in a source-only copy | 35 passed, exit 0 |
| Scoped source architecture/security scans | Exit 0; later card/ledger and hosted checks explicitly excluded |
| Dependency audit | Exit 0, no known vulnerabilities after reviewed targeted fixes |
| Production Next build | Exit 0 |
| Local Netlify/OpenNext packaging | Exit 0 after security review fixes with adapter 5.15.13; generated streaming Node.js 24 handler |

Final source: commit `afda1e3f6b16183074dcb2522912969c2df4bc0e`, tree `4ffd58ae29be090993181cd287936cfcc6d6d8d7`. The full check sequence finished at 2026-09-08 10:01:08 UTC with a clean working tree. [Committed validation receipt](evidence/foundation-afda1e3.json) records runtime, lockfile and migration hashes plus every command's exit code and log hash. Logs and fictional desktop/mobile screenshots are in local `artifacts/foundation`. Subsequent closeout changes affect documentation only. The GitHub workflow records its own exact run/PR SHAs and sanitized artifacts when it is eventually run. Writing a workflow is not a completed CI run.

The initial dependency audit found three high-severity Netlify tooling findings. Narrow overrides installed sharp 0.35.4 and toml 4.2.0. Actual Netlify image-handler transformations and TOML consumers were exercised, followed by a clean audit. Netlify CLI's telemetry uses its compatible OpenTelemetry 1.8.0; test tooling uses 1.9.1. Unstorage receives supported Blobs 10.7.13 while the CLI retains its own 11.0.3. Strict peer checks remain enabled. Ignored Netlify CLI autocomplete and optional unix-dgram installation scripts are recorded in `pnpm-workspace.yaml`; runtime/build use was verified.

## Resource state

- New private repository: `nidcyj-haXqer-3disti/etail-depot-next`, ID `1361184741`, owner ID `217826149`. User-created README bootstrap `b2f6cc4bf5eae055a3146b112a11ee8cbfb7f5fa` was read back; no unrelated source was adopted.
- New Netlify site: `etail-depot-next`, ID `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`, team `kyle-71ko0km` / `685ae8f4e6ce519ecf6b267d`. The browser showed its README-era deploy `6a9fd8059bec4e4d6cfa1a2b`; this is not an application deployment receipt.
- User explicitly chose to leave site access settings unchanged after automatic review required approval for team-login protection. This task did not change those settings.
- GitHub workbook export requires explicit approval after automatic review rejected the first workbook upload. No source tree/branch update or PR from this implementation is claimed pending that approval. Some source/brand blob objects were prepared; no deployed application was published.
- No hosted PostgreSQL, Identity configuration, secret set, Blob namespace or email delivery has been verified. No paid plan, DNS or real-money provider was changed.

## Remaining acceptance and limits

ACC-01 is exercised locally; ACC-02/03/05/08 have foundation-level evidence only. NEW-02 is exercised on a fresh local PostgreSQL database. Full cross-resource privacy, invitation acceptance, sponsorship, membership economics and hosted behavior are still pending. The 72 original acceptance entries remain the handoff inventory; current partial evidence is mapped in `planning/TRACEABILITY.md` rather than treating all those requirements as satisfied.

The Netlify Identity SDK's default token cookies are not HttpOnly. The adapter uses its runtime discovery and documented GoTrue server requests, and returns only verified issuer/subject. Its actual hosted compatibility, email confirmation, signup, recovery, invitations, email change, refresh/MFA, rate limiting, and provider revocation integration must be implemented and tested before enabling hosted login.

The modern Netlify adapter packages locally on macOS; this does not establish Linux CI, deployed Identity reachability, Database branch isolation or actual hosted user acceptance. No release gate is inferred from a generated ZIP.

Original workbook/source hashes remain unchanged. The original package manifest is retained as historical handoff evidence; edited project metadata/docs/helper-test preconditions intentionally no longer match that complete package hash. `tools/test-handoff.py` runs every helper test in an isolated copy containing only handoff files, avoiding third-party dependency JSON fixtures. Two negative tests now explicitly clear the bound target ID instead of relying on the project remaining unbound.
