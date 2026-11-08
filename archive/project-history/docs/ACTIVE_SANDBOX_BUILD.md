> Historical D65 build record. The active funding, checkout, deposit and local-generation design is [D69](FRESH_PREPAID_REBUILD.md); current acceptance is in [status](../planning/STATUS.md).

# Active sandbox build — D65

11 September 2026. The user identified missing capabilities in Cardholders/Requests and Merchant services, then explicitly asked to finish the actual build. This supersedes D63–D64's design-only pause. Continue the [delivery plan](../planning/DELIVERY_PLAN.md) using real application owners and persistent records. The prior prototype omitted existing features and is not a source implementation.

## Current connected slices

| Owner | Customer outcome | Data and command boundary |
|---|---|---|
| Cardholder management | Exact person, all their permitted cards, invitation state/expiry, reviewed access changes and history | Existing access service and commands. No new role or implicit spending permission. |
| Card requests | Search/filter/paginate all durable draft, blocked, issued and canceled requests; resume one request and open its exact issued card | Existing request/form/issuance owner. History from actual receipts, without invented past field snapshots. |
| Merchant network activity | Persistent authorized network/unit/date/search/status; complete payment/refund/transfer drilldown, matching export and current funds | Server-owned acquiring read projections. No new financial writer. Current funds do not use the selected activity date filter. |
| Merchant support | Exact merchant/payment → private question → assigned operator context/reply/resolution → customer conversation | Extend existing cases/operations. Merchant assignments remain independent of Cardholder membership. |
| Entry | Actual provider readiness, truthful reset recovery guidance and hosted acceptance | Existing Identity/session owner. Never clear an uncertain reset without reviewed reconciliation. |

## Merchant support schema and permission contract

Extend `support_cases` with a service-kind discriminator, exact merchant unit and optional payment reference. Preserve all existing Cardholder records. A generated Cardholder creator reference retains the original membership foreign key for Cardholder cases; Merchant cases instead have exact unit/service and payment/unit/service composite foreign keys. The creator always references the real person. No migration grants a membership or imports customer data.

Any currently authorized merchant reader may open and update their own merchant question. Linking or subsequently viewing a payment additionally requires current `payments.read` on that exact unit. Every list, detail, mutation and retry rechecks current authority. Primary oversight does not expose another requester's private conversation. Revoked delegates lose access; historical messages remain available to separately assigned support. Paused-unit support follows existing primary oversight rules, without restoring collector operating access.

One shared case lifecycle, command receipt, message timeline and UI serves both services. Replies identify who acts next. Existing service-assigned operators see only assigned service cases and exact related payment/refund context; no operator action moves money, invites people or impersonates a customer. Cardholder and merchant IDs cannot be exchanged or silently resolved to another record.

## Acceptance and implementation evidence

- Multiple people/cards and requests remain distinguishable after reload; canceled/issued requests remain discoverable; secondary navigation and direct API access exclude primary administration and siblings.
- Network metrics, pagination/export and return links use the same permitted merchant set and event dates. Current funds are separately reconciled from the sole ledger.
- Merchant support works for a delegated collector without inserting service membership. Exact foreign-unit/payment/case IDs, revoked actors and replay payload changes fail; valid retry has one message/effect. Assigned operator reply/resolution is visible only to the requester and assigned support.
- Run guarded PostgreSQL, contract, route/API, desktop/mobile/accessibility and production packaging checks. Record failures and exact revision/environment. Existing application tests and a prototype are different evidence.
- Hosted email readiness is read-only; a successful mailbox/password/session/reload/logout journey remains a separate acceptance requirement. Do not claim it from an enabled form.

P5/P6 guest delivery, asynchronous processing, payment exceptions and remaining issuing/commercial obligations remain in the active plan. They are not removed or claimed complete by these slices. D14–D17 still govern their affected financial decisions; independent work continues.

## P5a — published sandbox requests and guest orders

The resumed build now includes a bounded guest-checkout implementation. This contract does not establish completed tests or a deployed feature. External message delivery, asynchronous processing and broader payment exceptions remain separate slices.

A merchant with current channel sharing and sandbox payment permission explicitly publishes the payer-facing merchant names, purpose, amount, currency and expiry. The publication URL is an intentionally public locator, never a credential or merchant-data permission. Publication captures the channel revision, activation/gateway/enrollment versions and exact publisher lineage. Revocation, changed authority or configuration, merchant pause, channel edit, expiry and a successful one-time payment stop new payment acceptance. Resuming a changed configuration does not silently restore an old publication; review a new publication.

Guest checkout creates no person, financial service, merchant grant or operator assignment. A separate 24-hour opaque HttpOnly guest cookie, hashed in PostgreSQL, controls only that browser's orders and receipts. No token, real card/bank details, email recipient or password appears in URLs, response projections or storage accessible to scripts. Public pages use no-store, no-referrer and noindex behavior. A visitor establishes the cookie before creating an order, so retrying an order request can resolve the same owned record.

Each immutable order snapshots the exact publication/merchant/channel revision and amount. Payment readiness expires after 30 minutes or the earlier publication/session expiry; receipt access remains bounded by the guest session and is shown separately. A reusable publication creates separate orders. A refreshed order cannot silently become a new order, and a one-time channel still permits at most one approved payment across signed-in and guest attempts combined.

Review creates an immutable attempt with a stable command ID and approved/declined sandbox outcome. Confirming that exact attempt invokes the existing merchant payment persistence owner after current authority/configuration checks under the existing service → merchant → channel lock order. A timeout is an uncertain transport result: reload the same order or retry the same command. An unresolved attempt blocks another attempt. A declined attempt permits a newly reviewed attempt; approved and refunded orders cannot be paid again. Durable limits bound anonymous session/order/attempt creation and permit at most 20 attempts per order.

The additive migration introduces publication, revocation-command, guest-session, order, attempt and request-budget tables. Existing payment and operation records gain an exclusive merchant-person/guest-order origin; no historical rows or permissions are rewritten. Existing immutable ledger and current-channel provenance checks remain. Additional constraints enforce exact order scope, one approval per order, immutable reviewed content and a saved matching attempt/command receipt. Primary merchant refund and transfer authority remains unchanged. A guest receipt shows authoritative approval/decline/refund state without merchant balances, other orders, private identities or financial controls.

Acceptance includes isolated browsers and foreign-order denial; durable order/review/receipt reload; identical retries and changed-payload conflicts; concurrent confirmation and one-time-channel races; reusable separate orders; decline then reviewed retry; publisher revocation, paused/expired/changed channels and unmodified old order amounts; immutable snapshots and actor/order constraints; exact primary refunds reflected in the guest receipt; desktop/mobile and accessibility checks with no guest credentials in evidence.
