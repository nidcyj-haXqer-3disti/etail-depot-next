# Test strategy and evidence contract

## What has and has not been tested

The supplied Python tests validate the handoff's structure, target restrictions, fixture arithmetic and planning helper with mocked GitHub responses. They do not compile a new application, create a remote repository, exercise PostgreSQL, send an email, create a card, or deploy to Netlify. Every application acceptance case starts `not-implemented`.

## Required implementation test layers

| Layer | Required examples | Evidence |
|---|---|---|
| Domain unit | exact fees, plan changes, cap attribution, state transitions, policy composition | Test names/counts and failures/skips, exact commit |
| Real PostgreSQL | empty-schema migrations, constraints, transaction rollback, scoped queries, journal integrity | Database engine/version, migration hashes, seeded fictional IDs |
| Concurrency | shared backing, limits, payout/pledge race, duplicate card requests/events, retries after timeout | Two or more overlapping transactions, asserted persisted totals |
| Provider contracts | mock issuance/payment/Identity/storage adapters, errors, delayed events, idempotent reconciliation | Request/response contracts with secrets redacted |
| API | authentication, resource scope, body/path mismatch, method/content type, validation, idempotency, negative origins | Real server requests with response codes and sanitized errors |
| Architecture | single card form/command/lifecycle, centralized authorization, no client financial writers | Static dependency checks plus behavioral route/component tests |
| Browser | desktop/mobile new member, delegated cardholder, Household guardian, Seller payments, manager/operator | Playwright against real built server and PostgreSQL; screenshots and persisted state |
| Accessibility | keyboard/dialogs, labels, errors, status announcements, focus, contrast, zoom | Automated report plus unresolved/manual items; no blanket certification |
| Security | tenant isolation, SSRF, secrets scanning, session revocation, rate limits, permission changes, webhooks | Both allowed and denied paths; dependency audit findings triaged |
| Hosting | Netlify framework adapter, functions, new DB/Identity/Blobs, protected previews, external HTTPS origin | Exact published commit/site/deploy/DB branch plus real hosted probes |
| Human usability | account selection, finding Add card, explaining backing/obligation, finding a refund | Observations and user feedback, not a claim derived from green tests |

## Core scenario scripts

**Personal:** new verified fictional-profile member -> select plan with simulated fee -> select explicit account -> start and persist card request -> complete missing requirements -> add $100 collateral -> issue one card -> one practice-purchase action for $10 -> normal mock events complete it -> available $90, collateral $100, obligation $10 -> reload -> repayment/refund tests. Do not use an existing happy-path seed to stand in for signup.

**Household:** owner invites adult; other email cannot accept; intended adult can accept scoped assignment; Personal history stays private. Guardian creates funded supervised access; a $10 allocation never becomes independent credit. Revoking access invalidates next protected request. Resource visibility includes documents, aggregates, exports and notifications.

**Seller:** named seller approval -> one payment request -> guest payment -> settlement -> reserve -> partial refund/dispute -> eligible payout. Reusable links accept separate payments; partial invoices cannot over-collect through a race. Available proceeds cannot be paid out and pledged for spending twice.

**Cards uniqueness:** two simultaneous submits of the same saved request and a new transport key create one provider operation and at most one card. Independent requests are allowed where policy permits. Provider timeout remains pending until reconciled. Changing target account/cardholder or request digest is not an idempotent replay.

**Backed authorization:** overlap $80 and $30 against $100 shared backing. At most $100 total is approved. Repeat across two cards and two people. Freeze blocks new authorization, but a valid late settlement is accounted for rather than discarded to preserve an artificial invariant.

## Evidence rules

Record command, exit code, run URL when available, exact source SHA, runtime/dependency lock hash, database/migration identity, fixture/simulator mode, test counts, and date. Preserve an artifact hash when downloading CI evidence. A PR synthetic merge SHA may differ from its branch SHA; verify the source tree and record both.

Never reuse historical app test counts, screenshots, reports or deployment receipts as evidence for the new app. No `continue-on-error` on required checks, blanket skip, fake success output, or a green checkbox inferred from a build starting.

An HTTP 422 from a deliberately empty login request proves it reached validation; it is not a successful login. A ready deployment proves publication, not email delivery or tenant privacy. A migration log proves schema operations, not all workflows. A SMTP accepted response does not prove inbox placement.

Do not record actual email tokens, passwords, session cookies, raw provider credentials or customer personal data in screenshots/trace artifacts. A real hosted login must use an approved tester-controlled mailbox; do not fetch the user's email or impersonate them without explicit authorization.

## Release thresholds

All required cases in `contracts/acceptance-cases.json` must have evidence or be explicitly blocked before a full-completion claim. Security/money/privacy blockers block public release; do not label them optional polish. Inaccessible provider capabilities are transparently unsupported, not simulated to resemble live capabilities.

CI can test the isolated application first; hosted checks remain separate. The final report names all failed, skipped, manual and untested items. Required user feedback must include the question: **Can the tester find exactly one way to create a card in the selected account without being told which screen is the new one?**
