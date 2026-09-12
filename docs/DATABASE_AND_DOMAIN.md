# Domain and PostgreSQL architecture — historical specification

> **Superseded for active domain design — 11 September 2026.** Use [Product and technical design](PRODUCT_TECHNICAL_DESIGN.md) and [Delivery plan](../planning/DELIVERY_PLAN.md) for current ownership, schema boundaries and implementation sequencing. The table families, host-account relationships and migration instructions below record earlier proposals and delivery stages. They are not instructions to restore retired accounts, rebuild the current database or apply historical migrations.
>
> Exact money, immutable accounting, explicit responsibility and scoped authority remain requirements. Preserve their meanings under the current two-service model; a historical table name or proposed lifecycle is not evidence of current implementation.

Earlier design reference: [Two-service design](TWO_SERVICE_DESIGN.md). Its conflicting three-tier and broad secondary visibility provisions were superseded by the fresh service model.

## Architecture choice

One modular application and database with clear ownership. Use typed SQL/Drizzle over the runtime connection returned by Netlify Database. Keep business commands independent of framework, storage vendor and provider SDK. Start from empty schema; do not copy old migrations or apply them to an old database. Name SQL migration directories predictably, e.g. `0001_identity-accounts/migration.sql`, and use Netlify's migration directory as the single hosted migration authority. [N2]

The table families below are design obligations, not prebuilt DDL or an arbitrary table-count requirement. Codex must create runnable schema/migrations, concrete indexes and constraints, repository tests and an ERD. A change in names is acceptable with traceability; losing an invariant is not.

The merchant sections follow the target [Merchant hierarchy and payment channels](MERCHANT_HIERARCHY_AND_CHANNELS.md). Migration 7 applies the local merchant units, relationships, typed access and evolved draft tables; its concrete mapping is listed in the main design. The broader table families remain future obligations and do not establish provider integration. Merchant master units, Personal/Household sub-units and outside merchant helpers do not add an account type or a second policy/payment engine. The user confirmed the master Merchant is responsible and multiple separate Merchant associations per host are allowed. Each sub-unit records its immutable responsible Merchant; draft gateway/verification records may remain incomplete, but processing activation cannot.

## Module boundaries and single writers

| Module | Owns writes | Consumers |
|---|---|---|
| Identity/Membership | People, verified identity bindings, sessions, consents, plans and membership periods. | Access, account setup, rewards. |
| Accounts/Access | Account directory, responsible-party identities, accepted account memberships, one target-typed invitation lifecycle, permissions and merchant resource assignments. | Account and merchant-scoped commands and projections through one evaluator. |
| Issuing | Spending applications/facilities, allocations, card requests/cards, limits, authorizations, purchases, repayments/statements. | API/UI and issuer events. |
| Acquiring | Merchant units/relationships and responsibility versions, applications, channels/revisions, payable orders/documents, payments and refund/dispute/reserve/payout records. | API/UI and acquiring provider events. |
| Ledger | Journal accounts/entries/lines, backing reservations, immutable financial effects and reconciliation. | All economic commands; not direct UI SQL. |
| Rewards | Source accrual/reversal, member-year cap consumption, posting/crediting. | Settlement, calendar workers and member summaries. |
| Integrations | Gateway connections/bindings, protected secret references, provider operations/mappings, delivery transport attempts, event inbox, outbox and retry claims. | Domain commands and bounded workers. |
| Operations/Economics/Partners | Cases, catalog, rates/drivers, scenario approvals, partner programs and statements. | Scoped operators/partners; isolated from ordinary member API. |

Do not make a generic `entities(type, JSON)` table the business database. Do not implement a second financial writer for the demo or an admin console. Queries may compose authorized projections across modules; mutations pass through the owning command.

## Core relationships

**People and entitlement**
- `people` stores a stable application person ID and minimum identity metadata. Identity binding is unique on `(issuer, subject)`, not just email. Email changes or re-registration cannot silently take over a person record.
- `memberships`, `membership_periods`, `plan_versions`, `terms_versions`, `consents` keep fee/benefit terms effective-dated and immutable where previously applied. One active period per membership.
- A person can participate without a separately paid membership under an explicit eligible sponsor. No guess at sponsor via “first membership”.

**Account directory and access**
- `accounts`: ID, enum type, display name, lifecycle state, responsible party reference, sponsoring membership reference, version, timestamps. Type is immutable after activation; move via explicit product process, not relabeling a borrower.
- Type-specific tables for Personal owner, Household governance and Merchant context. Merchant legal/onboarding records have an explicit merchant/responsibility association; a member role or host account is not proof of financial responsibility.
- `account_memberships`: named actor/participant, account, role template, acceptance/revocation state, version. Unique active relationship per account/person. Merchant-use acceptance must not write this table.
- Invitations, offered permissions, command receipts and history use an `ACCOUNT|MERCHANT_UNIT` discriminator with exactly-one-target CHECK and real account/unit foreign keys. Preserve one expiring, single-use intended-recipient lifecycle; account roles apply only to account invitations. Merchant offers bind action/channel/amount scope, invitation/access expiry, reviewed versions and dependency/authority lineage. One command owner dispatches acceptance to the appropriate assignment, not a second invitation engine.
- Account `permission_grants` remain account-scoped. Merchant access has its own typed unit/person assignment and grants feeding the same evaluator. Keep `loadAccountScope` and add `loadMerchantUnitScope`; the latter does not require host membership or weaken Personal privacy. No wildcard customer cross-tenant or all-future-descendants grant.
- `guardianships` or equivalent records link a supervised participant to a responsible adult and consent evidence. Restricted participant identity is not a silently autogenerated public login.

**Financial backing and cards**
- `spending_facilities`: product `CONSUMER_PAY_IN_FULL`, `COMMERCIAL_PAY_IN_FULL`, or `SUPERVISED_FUNDED`; approved responsible party, explicit currency, sponsoring membership, repayment policy, provider reference, state and version.
- `funding_allocations`: authorized recipient account/person and source facility, authorized amount/control scope, acceptance and revocation. A Household card may point to a delegated adult facility via this explicit relation. Do not require every source facility to be owned by the display Household, and do not expose its unrelated history.
- `funding_positions` and `backing_reservations`: source, available/pledged/held amounts, currency and immutable provenance. Avoid independent balances duplicating the ledger.
- `card_requests`: account, holder, facility/allocation, request kind, format/settings, draft version/digest, status, creator, prerequisite resolution, stable provider operation reference.
- `cards`: unique `card_request_id`, account, holder, facility/allocation, policy, status, last-four reference, opaque provider token. Never raw PAN/CVV. Card replacement is a new request referencing its predecessor, not another route/engine.
- Foreign keys and service checks ensure the cardholder belongs to the authorized account and its funding assignment. Cross-account backing is possible only through explicit delegation; arbitrary resource IDs are not accepted.

**Activity and collecting money**
- `authorizations`, `authorization_holds`, `purchases`, `purchase_reversals`, `repayments`, `statements`, `statement_items` keep product/owner/currency and lifecycle provenance explicit.
- `payments`, `payment_fees`, `settlements`, `refund_requests/refunds`, `disputes`, `reserves`, `payout_requests/payouts` remain separate auditable effects. A payout request locks eligible settled backing before external delivery.
- Refund totals cannot exceed eligible remaining captured principal; late/refunded/chargeback effects have documented adjustments. Refunded fees and reward sources must reference the original economic record.

**Merchant identity, responsibility and resource access**
- `merchant_units`: immutable internal UUID, `MASTER|SUB`, host account ID/type, immutable master parent, separate merchant display name, operating state and version. Enforce master host type MERCHANT and sub host type PERSONAL/HOUSEHOLD using account-type FKs and CHECKs. A composite parent FK with a MASTER-kind constant prevents sub-to-sub chains and cycles. One sub-unit has one parent; no reparenting or ID reuse. Provider MIDs are external assignments, never authorization keys.
- `merchant_relationships` plus requests/history: master/sub/host tuple, proposer, authorized master and host acceptance, exact delegation/oversight ceiling, version, status and timestamps. No unilateral attachment to a private host. Allow multiple master associations per host, with one unit per master/host pair enforced atomically. A sub-unit cannot change parent; a different Merchant is a separate relationship.
- `merchant_responsibility_versions`: unit, merchant of record/legal party, human representative, contractual loss-liability party, fee payer, settlement beneficiary, payout authority, program evidence and effective period. These fields are independent; parentage supplies none by implication. Incomplete drafts are allowed. Activation and new financial effects require a complete supported model, and orders retain the exact effective version.
- Existing `merchant_profiles` and applications remain onboarding authority, with explicit unit/responsibility associations and immutable applicant/history provenance. A collection sub-unit does not clone a parent's approval; an independently responsible sub-merchant requires supported onboarding of its own. Review the current Merchant-only profile keys and one-application-per-Merchant constraint when implementing the chosen model, rather than copying an approved profile to a Personal/Household account.
- `merchant_access`, grants and dependencies: stable unit/person assignment, invitation/acceptance, expiry/revocation/version, grantor and authority lineage, typed actions, delegable ceiling, assigned channel IDs/types and amount/currency bounds. FKs reference person/unit, not host-account membership. Optional continued-membership dependencies are explicit and reviewed. Preserve revoked assignments; a replacement cannot revive their descendants. Outside operators receive no onward delegation by default and no Household/Personal financial or member-directory access. Master oversight does not expose creator-private drafts.

**Gateway bindings and payment channels**
- `gateway_connections`: integration-owned provider/environment, protected secret references and connection state/version. `merchant_gateway_bindings`: unit, connection/namespace, typed external resource references, processing/parent binding, program/charge-flow/region, refund/dispute debit routing, permitted currencies/methods, status and effective version. Provider resource uniqueness includes its documented namespace; multiple approved bindings may reference one processing resource where supported. Never omit a processing binding and fall back to a gateway default. No provider secrets in ordinary projections, channel records or public URLs.
- Verification subjects, representative relationships, requirements and observations preserve provider/program/country/legal-form provenance, requirement codes/state/errors, protected evidence references, actual deadlines, effective capability flags and observation/event versions. Sign-in, legal review, representative authority, MID assignment, acceptance and payout remain distinct. Re-review can retain individual provider capabilities; evaluate those flags with local policy/freshness rather than a generic verified enum. No real sensitive evidence is collected by the sandbox. See the main design's verification matrix.
- `payment_channels` and immutable revisions: unit, creator person/assignment provenance, name/purpose, amount rules, fixed currency, one-time/reusable mode, expiry, visibility and lifecycle/version. Draft is a channel status, not a parallel product. Creator-private content remains private until explicit sharing. Preparation, publication, distribution and financial servicing have separate capabilities. Readiness is server-derived; ACTIVE requires the implemented publication command and complete relationship, responsibility, gateway and product prerequisites.
- `channel_presentations`: channel/revision and SMS, EMAIL, INVOICE, BILL, SOCIAL, QR or WEB presentation. These distribute the same channel/order; they do not each create a payment engine or obligation. A reusable channel creates distinct orders for deliberate purchases, not one permanent payment identity.
- `payment_requests`/orders and attempts: one concrete obligation, stable business identity and exact merchant ancestry, channel revision, responsibility version and gateway binding. Multiple attempts retry the same obligation. Channel edits never reroute an existing order. A one-time channel reserves one canonical payable obligation with database-enforced uniqueness at channel identity, not merely per revision or per request; concurrent opens cannot create separate payable orders each captured once. Editing a channel does not reset one-time consumption. Partial invoice payments contend atomically on remaining principal, and retries/parallel attempts cannot double-capture it.
- Public presentation/checkout access stores only hashes of opaque tokens with typed channel-or-order FKs, permitted guest actions/audience, expiry and revocation. A reusable public token may remain bound to the stable channel while new orders pin its current authorized revision; an order token stays bound to that exact order. Tokens contain no recipient data, provider credentials or app-session authority and grant no merchant-management/account API access. Old URLs recheck current master/channel restrictions before new collection; existing payment history remains intact.
- `delivery_attempts` and protected recipients: channel/order revision/document, transport, initiating assignment, command identity, provider message mapping and independent outcome/timestamps. Queue, dispatch, sent, delivered, failure and unknown are supported by transport evidence. Recheck current assignment/channel authority before dispatch; ambiguous delivery retries retain the same operation identity. QR generation or opening a social composer is not delivery confirmation.
- Invoices/items/allocations, bills and receipt versions have typed merchant/order ownership. An invoice or bill is payable; a receipt references authoritative successful payment and immutable document history. Sharing one invoice through several presentations preserves the same obligation and partial-allocation counter. A delivery flag or browser redirect cannot create a paid receipt, settlement or available balance.

**Ledger and integration durability**
- `ledger_accounts`: owner/context, accounting purpose, normal balance and currency. One ledger may have many segregated accounts; one indiscriminate platform balance is prohibited.
- `journal_entries` and `journal_lines`: unique business-effect identity, balanced by currency, posting state, timestamps, reversal reference. Posted entries/lines cannot update or delete; restrictions cover direct SQL, not just UI.
- Separate accounting purposes for collateral liabilities, supervised funded liability, issuing receivable/obligation, clearing/cash, Merchant payable/available/reserve, pending payout, fees/costs, rewards/partner payables and dispute losses.
- `provider_operations`: provider namespace + stable client operation ID + request digest + state, with retry/reconciliation metadata; uniqueness independent of HTTP attempt.
- `provider_mappings`: unique `(provider, environment, external_type, external_id)`; use the right environment in every event mapping.
- `event_inbox`: verified provider event dedupe identity, redacted payload, status and causal reference. Payload bodies aren't a substitute for normalized transactional records.
- `event_outbox`: intent/event atomically written with the business transition; unique delivery identity, bounded retry, leases and dead-letter state. Never mark sent before acknowledgement.
- Acquiring effects additionally retain originating merchant/master ancestry, responsibility version, processing environment/binding and economic membership attribution. A sub-MID does not create a second ledger, an independent wallet balance or another settlement engine.

## Transaction and concurrency rules

Commands perform authentication/policy, validation, row locking or serializable transaction, invariant evaluation, durable mutation/journal, outbox and audit. Audit of failed sensitive attempts must persist separately from rolled-back financial changes and contain no secrets.

Do not hold PostgreSQL row locks open while waiting for an external HTTP provider. Persist the request + operation, commit, call the adapter, and reconcile the acknowledged result in another transaction. Reservation prevents capacity reuse across that gap. The exact replay/recovery states must be tested.

Use one documented lock order for facility → relevant allocation/limit → backing/transaction to avoid deadlocks. Retry serialization failures with the same business identity, not a new operation. Concurrency tests use distinct database connections and barriers, not sequential promises on a serialized mock store.

Merchant multi-scope commands first discover prospective IDs without authorizing from that lookup, acquire involved account aggregate locks in sorted ID order, then master/child merchant locks, stable prerequisite/access/invitation locks and command/business records. If the discovered lock set changes, restart rather than acquiring a late out-of-order account lock. Review intersecting existing Personal→Merchant creation/replay and account-access commands; adding a sorted helper alone is insufficient. For commands spanning financial backing, acquire the account/merchant control gates before the existing facility → allocation/limit → backing sequence, preserving one acyclic combined order. Parent restriction writers take the master lock used by child commands; they need not lock every child.

Re-read current authority and expected versions before mutation and protected receipt replay. Parent restrictions narrow new collection, while accepted clearing/refund/dispute events reconcile through narrow service authority. A public checkout must perform current merchant/channel restriction checks too; possession of an old URL cannot bypass suspension. One-time channel reservation, invoice remaining principal and backing checks need real overlapping PostgreSQL tests, not separate non-atomic counters.

Limits combine account/facility backing, person allocation, card restrictions and period usage. Editing a limit does not clear usage. An approved hold consumes backing; clearing converts/releases the hold and records purchase obligations. Partial capture, expiry, reversal, multi-event capture and late clearing require documented effects, not unconditional subtraction. An unexpected genuine late settlement can cause a reconciled deficit/exception; never falsify financial history to satisfy a nonnegative display.

Acquiring payout vs pledge and refund vs payout must contend on the same backing transaction. Separate provider-balance polling is not atomic spend protection. Currency mismatch is rejected; currency conversions are disabled launch capability, not implicit exchange.

## Money and precision

Persist integer minor units (PostgreSQL `bigint`), explicit ISO currency and exact rate types. API amounts are strings. Rates and modeled costs retain more precision until the documented rounding boundary. Avoid native JavaScript `number` for posted values; treat database bigint JSON as strings. Validate maximums and prevent arithmetic overflow.

At a $100 collateral deposit with $10 settled purchase and no other holds: collateral liability remains $100; receivable/obligation is $10; usable capacity is $90. A supervised funded purchase instead reduces a funded balance; there is no child receivable/repayment obligation. Do not merge those accounting templates.

Codex must document and test posting templates for each financial event in the final `docs/ledger-postings.md`. Planned templates do not count as implemented or correct until journal reconciliation tests run.

## Seeds and fresh start

Catalog/plan/rate source imports are deterministic and idempotent; preserve source hash/cell/version. Local CI seeds use synthetic accounts and fake clock. Hosted application startup must not create demo users, grant staff roles or reseed financial balances. Create a restricted owner test account through the new Identity project and explicit bootstrap procedure; never “first signed-up user becomes admin.”

No migration of old records is in this build. Any future import is a separately approved, read-only mapping/reconciliation project preserving provider IDs and post-cutover journal history; do not wire old connection strings now.

The hierarchy transition is an upgrade of this new project's own preserved fictional dataset, not a legacy import. Snapshot and rehearse that upgrade; preserve invitation IDs/targets, revoked relationships, permissions, receipts, histories and sample/local provenance. Backfill existing Merchant merchant profiles to master units without creating host sponsorships, approvals or live MIDs. Move existing private payment drafts into canonical channels with preserved IDs or transactional receipt mappings, exact amounts/currency/usage/expiry and canceled state; do not publish, share or move them to Personal/Household units. Replace the old creator/account-membership FK with person/merchant-assignment provenance without reinstating revoked access. Retire the previous draft API/UI in the coordinated release after migration verification rather than running two creation workflows. The full transition and verification sequence is in [the hierarchy design](MERCHANT_HIERARCHY_AND_CHANNELS.md#7-local-migration-and-canonical-cutover).

[N2] https://docs.netlify.com/build/data-and-storage/netlify-database/migrations/
