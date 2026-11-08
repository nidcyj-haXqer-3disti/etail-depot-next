# Three-account sandbox design

Design and implementation review: **9 September 2026**. The current product has exactly **PERSONAL, HOUSEHOLD and MERCHANT** account types. The latest user direction replaces SELLER with MERCHANT and adds meaningful differences in tools, delegation and responsibility. Account type, membership plan, role and card format remain separate concepts.

This document describes the bounded local implementation and its remaining work. It is not a declaration that all original workflows, release gates or live financial services are complete. Final execution evidence belongs in the release record for its exact commit.

## Reference and product decisions

The [Amex card-experience study](research/amex/THREE_ACCOUNT_CARD_EXPERIENCE.md) informs named cardholders, separate management permissions, saved applications, readable card controls and activity investigation. Its U.S. consumer, business and corporate examples are distinct programs. The [Amex Merchant redesign study](research/amex/THREE_ACCOUNT_MERCHANT_REDESIGN.md) informs contextual payment lists, response queues, payment setup and confirmation. Public materials do not establish Amex's private system architecture or confer payment-facilitator status on Etail.

Etail's three account types and responsibility rules are product decisions, not an Amex taxonomy. No Amex fees, credit rules, numerical limits, liability terms or settlement promises are copied. The studies contain broader proposed experiences; the implemented subset below is narrower.

| Product | Working distinction | Boundaries |
|---|---|---|
| **Personal** | Private account; request and use one's own practice cards; simple collection channels with WEB and QR presentations under an accepted collection relationship. | No account invitations, additional-holder administration, shared channels or gateway management. “Limited” means fewer tools and private scope; no invented card-count or value cap. |
| **Household** | Accepted members with separately granted card tasks; an authorized manager can prepare a card for an eligible holder. Collection units support all seven presentations and named helpers. | Membership does not confer spending, collection access or access to another member's Personal account. Guardian-funded supervised spending remains a future allocation workflow. |
| **Merchant** | Responsible master collection account; connected Personal/Household units, gateway configuration, test payments, refunds and payouts under explicit permissions. Separate own-account business-card practice tasks remain available when granted. | Merchant administration never exposes a host's cards, activity or private account membership. Local test readiness is not legal, network or production approval. |

The executable tool distinction is [account-products.ts](../src/modules/policy/account-products.ts). Select/Premier membership economics are unchanged; neither a Merchant account nor an additional card resets the shared Premier cap. This slice posts no membership fees or rewards.

## One application and one command boundary

The application remains a Next.js/TypeScript modular monolith with typed PostgreSQL storage. React receives scoped projections and invokes canonical commands. A browser-supplied account, holder, unit, amount, version or outcome is input to validate, never authority.

| Owner | Responsibility |
|---|---|
| `platform/http` and `modules/identity` | Opaque server-owned sessions, authenticated route context, strict JSON and trusted-origin mutation checks. |
| `modules/policy` | One evaluator for ACCOUNT and MERCHANT_UNIT targets; product tools constrain current explicit grants. |
| `modules/access` | Current account and merchant scopes, intended-person invitations, grant ceilings, acceptance and revocation. |
| `modules/accounts` | Canonical private-Personal-to-Merchant draft creation and explicit fictional applicant eligibility. |
| `modules/workspace` | The existing Add card request lifecycle, card controls, practice issuance/purchase commands and account projections. |
| `modules/issuing/sandbox-adapter.ts` | Deterministic local card identity/reference for the one issuance command. |
| `modules/acquiring/service.ts` | Named merchant setup, master/sub relationships and the single saved channel lifecycle. |
| `modules/acquiring/operations-service.ts` | Test gateway/enrollment/activation, payment/refund/payout commands and their projections. |
| `modules/acquiring/adapters/sandbox.ts` | Deterministic local test outcomes/references; no external request. |
| `modules/ledger` | The only posted-journal/entry writer and exact balance reader. |

The local adapters are synchronous and deterministic. They do not implement a durable provider event inbox, asynchronous authorization/capture workflow, delayed callbacks or reconciliation worker. A later real provider must retain these command owners and add the required event processing; the current transaction must not simply be held open around arbitrary remote calls.

`ENABLE_REAL_MONEY=false` remains enforced. Fixture eligibility is server-owned and available only in the guarded local/test environment. A `FICTIONAL_ADULT` record is a declared test persona, not age or identity verification. Hosted readiness remains separate and unavailable without its own verified setup.

## Permission and privacy model

An action requires the current authenticated person, exact target, accepted authority, permitted product, necessary read permission and current operation prerequisites. Role titles alone cannot award spending, issuance or payment authority.

| Action | Minimum relevant authority in this implementation |
|---|---|
| Prepare a card request | Explicit `cards.request`; an eligible accepted holder; self for Personal, or `cards.manageMembers` to manage another holder in an advanced account. |
| Create a practice card | Explicit `cards.create`, `cards.request` and `cards.read`; current holder and applicant checks; positive practice funding. |
| Use a practice card | `cards.purchase`, `cards.hold`, `cards.read`, an eligible adult test persona and **the exact named cardholder**. A Manager cannot spend another person's card. |
| Freeze/unfreeze | Explicit corresponding control and `cards.read`; self or permitted member-card management. |
| Manage other holders | `cards.manageMembers`, `cards.read`, OWNER or MANAGER in Household/Merchant; never Personal or Viewer. |
| Configure a test gateway | Current Merchant OWNER/MANAGER, `gateway.manage`, `acquiring.read` and fictional applicant eligibility. |
| Simulate a collection | Current operating unit, explicit `payments.simulate` and `payments.read`, readable channel and adult test eligibility; ready configuration and active unexpired channel. |
| Refund or pay out | Explicit payment action and read permissions, plus current responsible Merchant OWNER/MANAGER authority. Host/helper channel use alone is insufficient. |
| Share account access | Existing named invitation lifecycle, current delegable ceiling, valid role/product/read prerequisites and recipient acceptance. Personal sharing is forbidden. |

Account invitations now offer the finite card, setup and test-payment permissions. The server returns which roles can receive each permission; the UI filters choices from that projection. It does not add missing prerequisites or grant spending by default. Creation, editing and acceptance recheck the sender's current delegation ceiling. A previously accepted invitation cannot restore revoked access through a retry.

Account read grants are currently broad within their named account: `cards.read` returns that account's cards and `activity.read` returns its activity. They are **not** the research proposal's holder-only “My spending” permission. Do not describe those grants as access to only one's own rows. Distinct holder-only/shared reporting needs an explicit scope refinement and tests before that promise is made. Personal account isolation already applies independently.

Merchant access retains the same typed invitation lifecycle with exactly one ACCOUNT or MERCHANT_UNIT target. A Household controller can invite an outside person to a named collection unit with selected permissions, expiry and a bounded onward ceiling. Acceptance creates merchant assignments, not Household or Merchant account membership. The existing inbox handles both target types.

Operating access composes the unit's current state, master state, host/master account state, both recorded acceptance generations and current assignment ancestry. Expired, revoked or superseded authority cannot become current merely because a new grant is later issued to the same person. Historical events remain intact. Pending relationship review uses its own narrow mode, so a controller does not need an already accepted unit assignment to consent. Public mode remains unavailable.

The Merchant shell is the primary administration context. Even when one person owns both accounts, Personal/Household pages retain collection tools while gateway setup, refunds and payouts stay in the Merchant page. A server presentation ceiling and a persistent view flag preserve this separation after refreshing; a permitted owner can follow an explicit link into the responsible Merchant. Account-context loading first verifies current account access and membership of the selected unit in that account's authorized directory, then loads current unit scope. It never silently selects a different unit. Outside helpers use the merchant-only page and receive no inaccessible host account shell. A stale return link cannot grant access or replace the selected target.

## Card journey and exact practice funds

1. **Start and resume:** the existing Add card form saves one creator-scoped request. It names the account, eligible holder, nickname, format and practice amount. Versions protect stale edits; command receipts preserve retry identity.
2. **Review:** the server rechecks current requester and holder permissions. A manager preparing another holder's card requires the separate member-management action. Supervised personas remain blocked pending a guardian/allocation design.
3. **Submit:** missing prerequisites produce a durable BLOCKED request. An eligible local request invokes the deterministic sandbox adapter and atomically inserts one card, funds its practice position, marks the request ISSUED and saves the receipt. Request/reference uniqueness prevents a second card from retry.
4. **Use:** the exact holder chooses a positive exact USD amount and description. The command locks current scope and card, checks active state/version and available practice funds, posts one purchase, saves activity and increments the card version in the same transaction.
5. **Review the result:** the server returns the saved card, activity and journal reference. Freeze prevents subsequent authorized practice purchases until the permitted control removes it. Existing historical sample cards have no spendable funds merely because an illustrative limit or balance was seeded.

Practice funding is an explicit simulation source. It is neither a cash deposit nor secured credit, collateral, a real spending facility or a new prepaid product definition. The form's stored requested amount is used for this local funding scenario; this slice does not implement a recurring allowance, an account-wide credit facility, an independent loan or a limit-change workflow.

## Collection journey

1. **Choose responsibility:** an eligible private Personal owner may create a named draft Merchant through the canonical account command. Personal/Household controllers can request a relationship with a separately permitted named Merchant. Each SUB has one immutable master; a host may have different SUBs under multiple Merchants.
2. **Record consent:** host and responsible Merchant accept through independent current authority. The same person may act on both sides only if independently authorized. REQUESTED, ACCEPTED, SUSPENDED and CLOSED remain distinct; local acceptance does not complete real verification.
3. **Prepare a channel:** save the description, exact USD amount, expiry, one-time/reusable use and allowed presentations. PRIVATE channels remain creator-private; ASSIGNED visibility exposes the channel to currently permitted unit users. Changing presentation does not create another amount, permission engine or payment workflow.
4. **Configure local processing:** authorized Merchant staff enable the fixed `ETAIL_TEST` gateway, enroll the selected unit and activate its saved channel. These versioned settings can be disabled. They never enable a live gateway or collect credentials/bank details.
5. **Preview and collect:** `/pay/{channelId}` requires sign-in and current channel scope. The preview shows the named collector, responsible Merchant and authoritative amount. A deliberate APPROVED or DECLINED test attempt runs the same canonical payment command. A decline has a saved result without a ledger posting; approval has one immutable payment and balanced posting.
6. **Handle subsequent work:** an approved one-time channel is consumed even if the payment is later refunded. A reusable channel permits another deliberate command. An authorized responsible Merchant operator can make one full principal refund or a positive test payout within available funds. The UI reviews the exact operation and shows the saved reference/result.

WEB and QR use the same authenticated local preview. QR images encode that preview URL; a scan is not payment authorization. SMS, email, social, invoice and bill presentations are local previews of the same saved channel. No message is sent, public bearer token issued, invoice delivered or external customer charged. The local address is not a remotely reachable checkout service. UUID knowledge never replaces current session and resource permission.

Payments, full refunds and payouts are immutable histories. REFUNDED is derived from a separate refund record; the original approval is not rewritten. Payouts finish only at the fixed fictional `TEST_DESTINATION`. Fees are **NOT_APPLIED**, which is not a claim that a live service is free. Refunds after depletion of available funds are refused; the implementation does not invent overdraft capacity or a chargeback reserve.

Card practice purchases and merchant test collections share the ledger but remain **separate simulations**. A practice card is not yet a payment instrument on the merchant checkout, and a card purchase does not automatically create a merchant sale. A common ledger does not by itself implement that authorization/capture connection.

## Database and journal invariants

The existing people, identity bindings, opaque sessions, accounts, memberships, permissions and target-typed invitations remain the authority foundation. Merchant units preserve host/master identity, relationship state and acceptance generations; assignments retain their dependency lineage. Channels preserve their exact master-owned unit, creator provenance and visibility.

| Table family | Durable purpose |
|---|---|
| `cards`, `card_requests`, `account_activity`, `workspace_commands` | One saved request, unique sandbox card/reference, posted purchase activity and actor/target-bound retries. |
| `merchant_test_gateways`, `merchant_test_enrollments`, `merchant_channel_activations` | Versioned local configuration for the responsible account, exact unit and channel. Identity fields cannot be rebound or deleted to reset versions. |
| `merchant_test_payments`, `merchant_test_refunds`, `merchant_test_payouts`, `merchant_operation_commands` | Immutable outcomes, original channel/configuration snapshots, principal, references and retry receipts. |
| `ledger_journals`, `ledger_entries` | One immutable, balanced USD business effect and exact signed minor-unit entries. |

`postJournal(tx, input)` and `getBalance(tx, position)` are transaction-aware. A journal has 2–64 nonzero entries, exact sum zero, USD currency and a canonical digest. The business key and `(kind, referenceId)` are unique. Equivalent reordered lines replay the existing effect; changed content or a different key for the same effect conflicts. Resource shape is validated in service and database: card entries require the exact account/card; merchant entries require the unit and its responsible master account.

| Local effect | Negative entry | Positive entry |
|---|---|---|
| Practice card funding | Account `PRACTICE_SOURCE` | Card `CARD_AVAILABLE` |
| Practice purchase | Card `CARD_AVAILABLE` | Card `CARD_SPENT` |
| Approved collection | Unit `GATEWAY_CLEARING` | Unit `MERCHANT_AVAILABLE` |
| Full collection refund | Unit `MERCHANT_AVAILABLE` | Unit `GATEWAY_CLEARING` |
| Test payout | Unit `MERCHANT_AVAILABLE` | Unit `PAYOUT_CLEARING` |

Balances are sums of immutable entries, never client arithmetic or mutable balance caches. CARD_AVAILABLE and MERCHANT_AVAILABLE cannot become negative. Negative PRACTICE_SOURCE/clearing positions are explicit simulation offsets, not external bank balances. Historical sample snapshots do not fund these positions.

Deferred PostgreSQL triggers reject an unbalanced/empty journal and negative protected availability. Journal/entry update, delete and truncate are forbidden; entries cannot be appended in a later transaction, even as a balanced pair. Corrections require a new effect. Operation constraints also validate channel snapshots and same-transaction journal kind, reference, unit, currency, buckets and amount. Full refunds reference the exact original approved principal; a one-time approved channel and an original payment's full refund are each unique.

The ledger supports a CARD_REFUND kind and reversal tests; there is no user-facing card-refund command in this slice. Database enforcement supplements, rather than replaces, domain authorization and immutable operation provenance.

## Concurrency, recovery and migration

Intersecting account writers use `workspace:{accountId}` advisory locks. Merchant writers acquire affected accounts in sorted order before master/child and assignment locks. Card commands lock the scoped card before journal positions. The ledger sorts business-effect/key locks and then position locks. Membership/grant revocation and relationship restrictions therefore contend with authorized writes instead of being checked only before an unrelated transaction.

Every retry rechecks current authority before returning its receipt. A matching command ID/body returns the saved effect or its current projection; a mismatched actor, target, kind or digest is a conflict. Expected versions reject stale new work. UI recovery retains an uncertain attempt for an identical retry and requires fresh review after a definite stale/permission response. An old successful command is not permission to execute again after revocation.

The rename migration changes the existing account enum value and related terminology while preserving IDs, account relationships, history, prior invitations, revocations and money strings. It does not create a fourth account type or copy data into a second account engine. Existing cards receive nullable provenance fields; existing snapshots are not backfilled as funded journals. New test-operation and ledger tables start separately from historical illustrations. Constraint supplements are part of the migration, not optional documentation.

Upgrade verification compares old-table inventories and preserved row content before and after application. Fixture seed operations remain insert-only on conflicts; repeated preview starts must not restore removed grants or delegation ceilings. The intentional local demo setup of newly enabled permissions is a separate, reviewed action rather than a recurring seed override. Preview uses the existing project base database; test runs use its isolated test database without resetting either.

## Experience and verification scope

The account name and type remain visible. Merchant administration, host collection use and outside-helper pages show their exact selected unit and responsible Merchant. A single Sandbox / No real money cue is reinforced by test confirmations and receipts. Forms provide review, save/retry, stale-state recovery and accessible labels rather than pretending an unimplemented action succeeded.

The architecture checker pins the single Add card stages and purchase form, exact canonical routes, finite UI transport paths, adapter boundaries, ledger writer and operation-table owners. Mutation probes reject alternative paths, methods, aliases, raw writes, copied writers and rewritten retry forwarding. These are source-boundary checks, not proof of every runtime financial invariant.

Focused native PostgreSQL evidence covers exact values beyond JavaScript's safe integer range, journal rollback/immutability, changed retries, cross-account foreign keys, concurrent overspend and concurrent repeated effects. Access tests cover explicit Household card permissions, Merchant manager gateway authority, Viewer/prerequisite rejection, delegation loss before acceptance and revocation. Acquiring tests cover payment outcomes, full refund/payout, one-time races and operation provenance. Final broader type/lint/contract/build/browser/accessibility results must be recorded separately for the exact candidate commit; no browser result is claimed here before that run.

Useful targeted commands, with the configured pinned Node runtime on PATH:

```sh
node tools/verify-architecture.mjs
pnpm exec vitest run tests/unit/architecture.test.ts tests/unit/access.test.ts
node tools/run-with-database.mjs vitest run tests/integration/ledger.test.ts tests/concurrency/ledger.test.ts tests/integration/access-financial.test.ts
```

## Remaining work and explicit decisions

The bounded local slice completes durable adult practice-card creation/purchase and configured merchant test collection/full refund/payout. It does not complete the original 90-workflow inventory or all release gates.

- **Shared cards:** holder-only versus shared read scopes, numeric tier caps if desired, recurring allowances, guardian-funded allocation and real approval/consent flows need explicit decisions and implementation. Account read grants must continue to be described accurately until then.
- **Connected payment processing:** card authorization/capture into the acquiring sale, durable orders, delayed/failed provider events, partial refunds, chargeback credits, reconciliation, reserves, settlement batches and failed/returned payouts remain unimplemented. A saved dispute response does not post a financial outcome.
- **Delivery and documents:** public checkout credentials/tokens, actual SMS/email/social delivery, independently retrievable invoice/receipt documents and event notifications remain future workflows. Saved preferences are not evidence of delivery.
- **Commercial economics:** [D14–D17](DECISIONS.md) still block their affected rounding, membership timing/attribution and Household allocation writes. Exact integer practice principal avoids these unresolved calculations; it does not resolve them. No fees, interest, rewards, taxes or proration are guessed.
- **Real product readiness:** live Identity/provider setup, legal/business/representative verification, true MID/gateway credentials, regulated product approval, bank mandates, real funding/issuance and production operational review are separate prerequisites. Test gateway readiness changes none of them.

The wider behavior and privacy requirements remain in [ACCESS_POLICY.md](ACCESS_POLICY.md), [DATABASE_AND_DOMAIN.md](DATABASE_AND_DOMAIN.md), [MERCHANT_HIERARCHY_AND_CHANNELS.md](MERCHANT_HIERARCHY_AND_CHANNELS.md), [UX_CONTRACT.md](UX_CONTRACT.md) and the original workflow/acceptance inventories. This document explains the implemented local subset without replacing those remaining requirements.

## Open-source presentation component

The QR preview uses MIT-licensed [node-qrcode](https://github.com/soldair/node-qrcode), pinned to `qrcode@1.5.4` and `@types/qrcode@1.5.6` after registry verification on 2026-09-09. It renders the configured-origin authenticated preview URL on the server. It supplies no payment, identity or authorization behavior. The same saved channel and exact amount power all seven presentations. The updated lockfile passed the package manager’s supply-chain check and the dependency audit reported no known vulnerabilities.
