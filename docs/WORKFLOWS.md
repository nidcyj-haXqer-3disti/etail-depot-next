# Canonical workflows and business effects

> **Historical workflow specification — superseded for active sequencing and model.** Follow [Product and technical design](PRODUCT_TECHNICAL_DESIGN.md) and [Delivery plan](../planning/DELIVERY_PLAN.md). Earlier account-based steps, creation introductions and statements about hosted or implemented behavior below retain their original context; they are not the current journey or capability inventory.
>
> Security, scoped authority, exact money, unique business effects, recovery, release approval and commercial obligations remain required unless explicitly superseded by an authorized decision. Keeping a future workflow here does not establish that it works today.

Current authority: [Service dashboard design](SERVICE_DASHBOARD_DESIGN.md) governs customer navigation and creation, with the [two-service privacy rules](TWO_SERVICE_DESIGN.md). Financial invariants and unrelated future requirements remain.


**Canonical workflows and retained future requirements.** The local application implements service dashboards, independent access, sandbox card funding/purchases and merchant test payments/refunds/transfers. Hosted provider, official billing, guest-delivery and supervised funding requirements below remain future work. [Current evidence](SERVICE_DASHBOARD_EVIDENCE.md) records actual execution rather than treating this target inventory as complete.

## 1. Service entry and onboarding

After authenticated entry, open Cardholder services or Merchant services → review the permitted dashboard → select an exact card, request, merchant or supported setup task. Do not insert a Personal/Household/Merchant chooser. Future hosted signup, confirmation and membership steps retain their own requirements; a person/login can pre-exist a membership, and an invitation can provide sponsored access. No implicit “everything active” flag.

Creation must be idempotent by explicit request identity. Identity binding may initialize the person's recorded own scope and primary service metadata, but not a funded card or Merchant relationship. Merchant creation is deliberate and creates no Cardholder access. A new card request uses the primary profile's persisted destination; metadata grants no authority. Site navigation never invokes a financial action.

Use server capabilities to identify the canonical next step. Resume pointers identify saved resources, not arbitrary redirect URLs. Preserve the selected card/holder or merchant through reload and re-login only while authorized. Resolve its stored financial scope rather than substituting a default. Canceled/completed requests cannot be restarted by old browser tabs.

## 2. One Add card workflow

Current service entry is `/cardholder-services?new=1`; an existing request opens at `?request={requestId}`. Both use the same `CardsWorkspace` form and existing account-scoped API writer. Opening the introduction creates nothing; the user's deliberate start creates the saved draft. Exact request IDs resolve their stored scope rather than the new-request default.

Current steps: confirm the named Cardholder relationship → eligible holder → nickname/format/practice allocation → review → submit. Supported local states are `DRAFT`, `BLOCKED`, `CANCELED` and `ISSUED`. Issuance creates one sandbox card and one exact practice-funding effect, not a real card or credit facility. Future physical fulfillment and replacement need their own requirements within the canonical lifecycle; the current format choice makes no shipping claim.

Future provider lifecycle: `DRAFT → BLOCKED | READY → SUBMITTED → PROCESSING → ISSUED | DECLINED | NEEDS_REVIEW`. These additional provider states are retained requirements, not claims about the current local schema. Cancellation requires an eligible state or explicit provider support. Unknown results must retain the same business identity, never manufacture a new card. Track transport attempts separately from business operations.

Canonical command responsibilities; provider enqueue/result handling remains a future adapter requirement:
- `StartCardRequest` binds account, creator and intent identity. It can save an incomplete draft without pretending eligibility.
- `UpdateCardRequest` validates exact editable fields, optimistic version, actor scope and eligible relationships. It cannot alter an issued request.
- `SubmitCardRequest` locks/rechecks policy, prerequisites and version; snapshots normalized digest; enqueues one stable provider operation.
- `ApplyCardIssuanceResult` validates operation/provider/environment and reconciles one card for the request. Unknown provider results remain quarantined/pending.

Unique database effects: one operation identity for issuance per request; one card per issuance request; request digest conflict on changed retries; webhook dedupe per provider/environment/event ID; no card duplicate even with a new HTTP idempotency key for the same saved request. A separate deliberate request can issue another card. An expired HTTP idempotency cache does not erase business uniqueness.

Card actions (freeze/unfreeze/cancel/replace) also use explicit commands, current state and stable replay identities. Every card references exactly one authorized funding relationship. Canceled cards never reactivate. Replacement keeps the old card's history and applies intentional freeze/cancel semantics; it does not reset limits or accrued rewards.

## 3. One practice purchase

Current sandbox: select an eligible own card → **Try a purchase** → exact amount and description → submit. `purchaseCard` checks current own-card permission, active state, version and available practice funds, then posts the ledger effect and attributed activity atomically. Reload does not repeat the purchase, and replay requires current authority. Primary management of a secondary card does not permit purchasing as that holder.

Future provider/event workflows must additionally support asynchronous authorization, clearing and durable Pending results. The following requirements do not imply that the present practice command simulates a complete hosted clearing network.

Do not expose manual clear or random provider outcomes to the ordinary member. Operator scenarios can deliberately hold, delay, decline, reverse or reorder events, using scoped permissions and explicit audit. A queued operation survives a worker crash. Reload must not submit again. Duplicate event delivery must not re-credit rewards or reduce capacity twice.

An approved hold consumes capacity. Clearing replaces held exposure with an outstanding obligation; a supervised funded transaction instead consumes its funded balance. Refund/reversal calculations reference the original source, reverse eligible rewards proportionally and preserve accounting identity. Late clearing after a freeze is recorded and reconciled, not rejected as a new customer authorization.

## 4. Acquiring

### Merchant relationship and access

Merchant services opens directly on authorized primary/submerchant work. A primary merchant retains responsibility for each named submerchant's collections; each unit has one immutable primary. Multiple named units can share the same controller. The owned-unit command resolves both sides server-side and records both consents atomically only where the actor currently controls both. Separately controlled proposed relationships retain two-sided acceptance. Live verification, provider MID assignment, gateway readiness and channel activation remain distinct events; internal IDs are not provider MIDs.

From Merchant overview, select a primary network or exact merchant → open its channels, payments, People or setup. Shared users see only their permitted units. Existing account URLs are compatibility entries, not prerequisite account choices. Keep the responsible primary visible without exposing another service's finances. Its responsibility for sales, fees, refunds and chargebacks does not itself establish live provider routing or payout eligibility.

An authorized merchant controller selects a named person → reviews exact merchant/channel capabilities, expiry and delegation ceiling → creates a targeted invitation → the intended recipient accepts or declines. Acceptance rechecks current grant lineage, consent and any recorded membership dependency, and creates merchant access only. It does not create Cardholder access or host financial membership. Revoked, expired or stale invitations cannot restore a grant; revocation never deletes payment history or necessary historical servicing.

### Channel definition and collector use

One canonical channel form and writer: choose permitted merchant → purpose and one-time/reusable request rules → amount/currency/expiry → allowed SMS/text, email, invoice/bill, social, QR or website presentations → visibility → review → save Draft or activate. Receipt generation is a post-payment document option. Activation requires the exact merchant's accepted relationship, configured responsibility, verification/gateway and payment-engine prerequisites. Application/assignment statuses truthfully show missing requirements, pending, assigned/verified, restricted, declined or closed, with explicit mock/provider basis. Merchant approval never approves issuing or commercial spending.

An assigned collector who cannot create/edit channels follows **Use channel** → enter permitted request details within server bounds → select allowed distribution and recipient where needed → review sub-merchant/payee, amount and content → create one payable order/request → distribute its approved presentation → inspect independent delivery and payment outcomes. Reusing a channel for a new purchase creates a distinct order. Sending the same invoice by SMS and email or displaying its QR references the same obligation; it does not create another charge.

Channel `DRAFT/READY/ACTIVE/PAUSED/EXPIRED/CLOSED`, actual delivery outcomes and authoritative payment outcomes are separate. Copy/share-composer opening is not confirmed publication; queued/sent/delivered/scanned is not paid. Dispatch rechecks current permission and channel state. Unknown provider outcomes retain the original operation identity for reconciliation, never a fresh business effect.

### Guest payment and servicing

A guest opens a public opaque-token URL distinct from merchant-management routes → reviews confirmed merchant of record/payee, contact, purpose, amount/currency and any invoice remainder → deliberately submits the mock payment → follows a durable Pending/success/failure result → receives a receipt only after authoritative payment confirmation. Expired, paused, closed or unavailable requests fail clearly and never reroute to another merchant or gateway. Payers need no platform membership. Public responses contain only the payable projection and authorized document/status information, not host accounts, grants or private records. A browser redirect cannot declare payment successful.

Provider confirmation drives authorization/capture/settlement → funds become settled available after applicable fees/reserves → an authorized actor requests payout → paid/failed/reconciled. A reusable channel supports distinct orders/payment identities. An invoice can allocate several partial payments up to its remaining amount. Use locking to prevent concurrent overpayment/overcapture unless an explicit excess/refund policy exists. Each order pins merchant, master ancestry, channel revision, responsibility version and exact gateway binding; channel edits cannot reroute an in-flight payment.

Capture, settlement, refund, dispute, reserve change, payout and payout failure are distinct events with explicit effects. Do not equate successful checkout with funds already paid out. Payout failure restores only the eligible reserved amount once. Refunds check original merchant scope and net refundable amount and coordinate with reserves/payouts. Operators cannot edit posted balances to make discrepancies disappear.

### Preserve the existing sandbox

The applied channel and service migrations preserve existing IDs, receipts, amounts, usage, expiry and canceled states. Primary oversight follows the explicitly chosen current policy; migration does not publish a channel or fabricate payment history. The application retains one active channel form/writer. New service profiles and named submerchants do not move ledger entries or merge grant scopes. Further migrations must preserve those invariants and record actual comparison evidence.

## 5. Fund/repay/allowance

Collateral deposits and release requests, supervised funding, commercial pledge and repayment are separate commands. Each displays the correct source/destination and semantics. Release cannot free collateral backing obligations/holds and requires step-up. A commercial pledge moves eligible backing into a reserved/pledged state so payout cannot reuse it.

Consumer statement schedule and commercial daily full repayment are different financial policies. Implement calendar tasks with a deterministic clock and unique membership/facility/period operation key. An allowance consumes guardian funding and has its own schedule/version; it does not create credit or reward accrual. Failed scheduled funding does not display as delivered. Do not activate every calendar schedule when enabling practice-purchase event completion.

## 6. Durable integration rules

Use a transactional outbox and verified event inbox. Runtime workers claim bounded batches with leases, exponential backoff with jitter and capped attempts. A lease expiry permits safe replay, not a fresh provider operation identity. HMAC/signature checks happen before trusted payload parsing; store safe redacted raw references and normalized types. Reject stale/signature-replayed webhooks where the provider protocol requires it. Different provider event IDs can describe the same business effect; dedupe both layers.

The mock provider conforms to the same adapter and normalized event contract as a future real provider. Allow deterministic event scripts in CI. No `setTimeout`-only persistence, fire-and-forget unawaited HTTP, user session reused as worker auth, unauthenticated drain-all endpoint or self-HTTP dependency on a protected frontend. Network delivery is at least once; claim unique effects and reconciliation, not global exactly-once delivery.

## 7. Exit paths

Account closure verifies no outstanding obligations, holds, in-flight payout/refund/dispute or unresolved provider operation. Disable new requests, reconcile existing activity, retain history per policy. Cancellation of membership does not delete earned rewards or their year attribution. Closure/revocation returns a helpful allowed next step; do not delete pending records to simplify a state machine.
