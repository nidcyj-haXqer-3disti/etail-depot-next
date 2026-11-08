# New system map

This is a target module layout, not an existing app. Adjust folder names when justified; preserve dependency boundaries and one business writer. Nothing under the old repository is an implementation starting point.

```text
new-person/login
  └─ memberships + sponsoring entitlement
       └─ accessible accounts: PERSONAL | HOUSEHOLD | MERCHANT
            ├─ Pay & spend: facility/allocation → card request → card → purchase
            ├─ Get paid: merchant → payment request → payment → settlement/payout
            └─ People & permissions: scoped roles, assignment, restrictions

All commands:
  authenticated actor → account/resource policy → current prerequisites
  → owning module transaction + journal/outbox → provider operation
  → verified event inbox → same module completion/reconciliation

All screens:
  selected account → authorized projection/capabilities → canonical action link
  (not independently computed financial state or another workflow engine)
```

## Suggested implementation tree

```text
src/
  app/                        Next route segments and HTTP handlers
  modules/
    identity/                 verified issuer+subject and one session design
    memberships/              plans, periods, consent, sponsoring entitlement
    accounts/                 directory, responsible party, type-specific context
    access/                   policy evaluation, roles, grants, assignment
    issuing/                  facilities, requests/cards, authorizations, repayment
    acquiring/                merchants, payment requests, payments, payouts
    ledger/                   exact postings, backing, reconciliation
    rewards/                  eligibility, accrual/reversal, year-scoped cap
    integrations/             provider operations/inbox/outbox and bounded workers
    operations/               cases, approvals, queues and exception handling
    economics/                source imports, drivers/rates, scenario versioning
    partners/                 programs, governed scope, statements, keys/webhooks
  ui/
    accounts/                 one validated account switcher
    cards/                    ONE CardRequestForm + detail/list, reused by links
    shared/                   accessible primitives and feedback
  platform/                   database, configuration, crypto and private storage
netlify/
  database/migrations/        new schema migrations, sole hosted execution chain
  functions/                 thin entry points; reuse owning module commands
contracts/                    generated executable API/policy contracts after build
```

Each module can have `domain`, `application`, `repository` and `projection` files when useful; avoid empty folders/interfaces just to fill the pattern. UI components use composition, not inheritance from an all-feature page class.

Public HTTP adapters, internal workers and operator tools are not separate application engines. A provider adapter implements external IO and verified normalization; it does not independently calculate balances or authorize roles. Repository methods receive the active transaction so multi-module effects commit coherently.

## Member route contract

Use an explicit selected-account route family, for example `/accounts/[accountId]/overview`, `/cards`, `/activity`, `/people`, `/controls`, and `/get-paid` when eligible. The one card draft route is `/accounts/[accountId]/card-requests/[requestId]`; Home and Cards both navigate there. Global membership and security pages remain outside the currently selected account. Redirect old bookmarks only when a real new-project bookmark exists; do not implement old application API compatibility.

The new account selector and service capabilities should explain why a function is unavailable. A feature cannot silently switch the selected account, choose the first facility, or create another business record merely because it was opened.
