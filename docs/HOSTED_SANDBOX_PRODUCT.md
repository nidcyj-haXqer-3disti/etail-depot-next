# Hosted sandbox product — approved scope and implementation

The user requests the full product as a hosted sandbox because email members cannot reach the functions demonstrated locally. D60 replaces the demo-only application restriction from D59. The authentication adapter remains separate: hosted users still authenticate with the new owned Netlify Identity tenant, and local fixture login remains forbidden on every hosted deployment.

## Entry and separation

A verified email member deliberately selects Start sandbox, supplies a display name and acknowledges simulated cards, balances, payments and verification. This creates one durable sandbox participation record and a member code. It does not create services, membership grants, operator access, cards or financial entries. The simulated adult scenario is not a claim about the person's real age, identity, business or creditworthiness. Real money remains disabled in code and database constraints.

The member then explicitly opens a Cardholder service or a primary Merchant. Existing canonical enrollment commands and their capability engines own those effects. Each identity owns its separate services. Nothing is populated from the local demo and no previous user's data is copied.

## Customer journeys

- Cardholder: open a card group, save/resume/cancel the single card request, allocate simulated funds, issue a simulated card, view selected-card money/activity, freeze/unfreeze, make a practice purchase, review/export reports, save notification preferences and open private support cases.
- Cardholder sharing: look up an exact voluntarily shared member code, review permissions, invite a secondary, accept in the recipient's inbox, issue their card, and review/change/revoke access. Primary reads its own group; secondary reads only their own cards, purchases and cases.
- Merchant: open primary and submerchants, save business details, configure the sandbox gateway, enroll the merchant, prepare SMS/email/invoice/bill/social/QR/web channels, activate, preview checkout, simulate approvals/declines, follow exact receipts, issue full refunds and bounded transfers, and pause/resume permitted merchant work.
- Merchant sharing: use the same invitation lifecycle for exact merchant access, bounded delegation, expiration and revocation. The primary remains responsible for its hierarchy; a helper sees only assigned merchant records. Merchant access never grants Cardholder access or primary financial controls.

A member code locates one opted-in member; it is neither a login credential nor a capability. No provider member directory, email search or bulk lookup is available. An invitation gives no access until its named recipient accepts. External emails, texts and social posts are not sent by the sandbox; channel delivery is a preview and copy/share workflow.

## Data and commands

The additive sandbox_participants table stores the actor's consent, first command receipt/digest, stable random member code and join timestamp. Its one canonical writer is startSandbox. Existing tables for persons, services, memberships, cards, requests, merchant units, channels, invitations and the immutable ledger retain ownership and invariants. Sandbox helpers read the recorded canonical provider binding and lock participant/fixture eligibility while commands run. Existing isolated supervised scenarios stay restricted.

New endpoints are GET/POST /api/v1/sandbox and the signed-in exact lookup GET /api/v1/sandbox/recipient. The single existing issuing, acquiring and access command families remain. Contract generation includes the new routes; source ownership checks pin the participation writer and the one read-only member-code lookup.

## Boundaries and verification

This release exposes the implemented customer product in the hosted sandbox. Live issuance/MIDs, actual KYC/KYB, real payments/bank transfers, external messages, billing/rewards economics, public guest checkout, card replacement/closure and new formal dispute/chargeback processing remain outside the implemented simulation. The support operator console requires its separate explicit service assignments; customer opt-in does not grant operator power. No private Amex parity or 100% completion of the broader commercial backlog is claimed.

Verification requires production-policy tests with canonical synthetic email bindings, explicit opt-in, complete card/merchant workflows, primary/secondary isolation, exact sharing/revocation, idempotent enrollment/financial retries, full desktop/mobile journeys and accessibility, all existing regressions, additive schema checks and production Next/Netlify packaging. Actual results and release identifiers belong in planning/STATUS.md. No real user credential or mailbox is required for automated tests.

## Verification results — 10 September 2026

All commands below exited 0 on macOS with Node 24.19.0, pnpm 11.19.0, native PostgreSQL 18.6 and the isolated `etail_depot_next_services_test` database. Logs are preserved locally under `artifacts/full-hosted-sandbox/`.

| Check | Result | Evidence |
| --- | --- | --- |
| `node tools/run-with-database.mjs vitest run tests/unit tests/integration tests/concurrency tests/contracts` | 70 files, 530 tests passed | `domain-final.log` |
| `node tools/run-with-database.mjs playwright test` | 68 desktop/mobile/API/accessibility cases passed | `browser-final.log` |
| `pnpm lint` and `pnpm typecheck` | Passed | `lint-final.log`, `typecheck-final.log` |
| `pnpm test:architecture` | Ownership and detector self-tests passed | `architecture-final.log` |
| `pnpm test:security` | Source controls passed; no known dependency vulnerabilities | `security-final.log` |
| `pnpm test:handoff` | Structural verification and 35 helper tests passed | `handoff-final.log` |
| `pnpm exec netlify build --offline --context production` | Next production build and Netlify function packaging passed | `build-final.log` |
| `pnpm db:generate` | No schema changes or drift | `schema-drift.log` |
| Guarded additive preview migration | 50 existing tables and their rows unchanged; new participation table empty | `preview-migration.json` |

The first full domain run exposed a changed recipient error code; the canonical access wrapper now preserves its established `RECIPIENT_UNAVAILABLE` response. The first browser run exposed an ambiguous heading selector, corrected to the page h1. Its subsequent merchant run found a brief contrast failure during a setup button state transition; the narrow setup-button transition is now disabled and accessibility checks pass without being weakened. Review also corrected stale invitation member selection after Cancel. The initial logs remain alongside the final passing evidence.

Production-policy integration tests use synthetic canonical email bindings with fixture authentication disabled. Browser tests use synthetic authenticated sessions only in the isolated local database. These checks do not claim access to the user's own hosted credentials, private Amex architecture, live acquiring or unfinished commercial scope.

## Published sandbox

- Site: [Etail Depot services](https://etail-depot-next.netlify.app/services). Sign in, choose Start sandbox, then open Cardholder services or create a primary merchant. Another member shares their code from Your services before receiving an invitation.
- GitHub application commit: `bf525d3eda8975e88febee230533018a84cd79df`; reviewed local implementation `25214d0cfb5c7187295a7dd89b27562254da3a79`; identical tree `79882eb029482ba37e291cd426d6a838e85e663e`.
- Owned Netlify site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`, production deploy `6aa2662849f2c6f83e179ddc`, ready/published `2026-09-10T08:12:06.625Z`. The deploy UI confirms one database migration applied to the production branch. The project source setting was restored to main after this authorized feature-branch publication.
- Nine live unauthenticated checks pass: landing/login200, services/cardholder/merchant redirects to login307, and sandbox/recipient/cardholder/merchant-dashboard APIs401. The initial live probe used an obsolete merchant API name and correctly returned404; the source-confirmed `/api/v1/merchants/dashboard` passes. Both probe files remain in the evidence directory. No credential or hosted user mutation was used.
- [PR7](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/pull/7) remains for review. Local final evidence is passing; the separate GitHub workflow34453677965 was still running at the last recorded observation. Later documentation commits do not alter the published application.
