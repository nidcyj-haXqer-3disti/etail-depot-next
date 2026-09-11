# Product contract — historical specification

> **Superseded for active product design — 11 September 2026.** Use [Product and technical design](PRODUCT_TECHNICAL_DESIGN.md) and [Delivery plan](../planning/DELIVERY_PLAN.md) for the current two-service model, scope and acceptance sequence. This document preserves earlier requirements and rationale; its references to retained account enums, host bindings and earlier “current” behavior are historical, not instructions to restore them.
>
> Source-defined commercial rules and financial/privacy invariants remain obligations unless an explicit later decision changes them. Preserving a requirement here does not establish its implementation, verification or release status.

Earlier design references: [Service dashboard design](SERVICE_DASHBOARD_DESIGN.md) and [two-service privacy rules](TWO_SERVICE_DESIGN.md).

**Historical product requirements and model.** This document retains future obligations beyond the implementation assessed at that time. The [earlier delivery evidence](SERVICE_DASHBOARD_EVIDENCE.md) records that delivery stage; it is not the latest application assessment.

## Product mental model

A person signs in, opens **Cardholder services** or **Merchant services**, and performs a task in an authorized card or merchant scope. Named primaries oversee their connected cards or submerchants; secondary users see only their own permitted work. Membership, legal responsibility, financial product, service role and card format remain distinct dimensions.

The preserved `PERSONAL`, `HOUSEHOLD` and `MERCHANT` database values identify existing record provenance. They are not customer tiers or a prerequisite selector. A primary profile can present cards from several stored scopes without moving their records, pooling funds or combining grants. New card requests use a persisted authorized destination; existing cards and requests resolve their actual recorded scope. Financial-product and guardian requirements below do not derive from an old context label.

A person can have different roles in different service relationships. Preserve the unique own-person binding and legitimate financial facilities without exposing them as competing service entrances. Do not charge a separate membership merely because a cardholder accepts an invitation. Membership ownership and sponsoring entitlement must be traceable. Guests and pre-membership signups are not a free membership plan.

## Merchant hierarchy and payment channels

A responsible primary merchant manages named submerchants, each with one immutable primary. Multiple named units may share a controller, and separately authorized relationships may connect to different primaries. Stored host bindings preserve consent and provenance without another customer account-type choice. Internal merchant IDs, provider-assigned MIDs, gateway bindings and financial account IDs are distinct. Sales, fees, refunds and chargebacks remain attributed to the responsible primary; provider routing and payout configuration require their own evidence.

Authorized merchant controllers can delegate exact merchant capabilities to named people within their live authority. Acceptance grants access only to the named merchant, not Cardholder access or host financial membership. Primary oversight covers permitted merchant work, including channel drafts; secondary access never exposes unrelated primary or sibling data. Issuing and commercial spending approvals do not follow from merchant setup, sponsorship or gateway readiness.

Payment channels are saved collection configurations with Draft as a lifecycle status. SMS/text, email, invoice, bill, social sharing, QR and website links use one canonical request/order and payment lifecycle. A receipt records an authoritative successful payment; it is not an unpaid request marked successful by delivery. Gateway activation requires the exact merchant binding and current server-owned prerequisites. Show **Responsible Merchant: [name]** and actual processing readiness, including **Gateway not connected** when missing.

The current sandbox supports service dashboards, independent access, persisted card issuance/practice purchases and test merchant gateway, collection, refund and transfer operations through one ledger. Historical illustrations remain separate from practice funds. Live MIDs, real financial processing, public payment delivery and real verification remain unavailable. Applied migrations preserve existing records; the latest evidence distinguishes these local outcomes from the larger target.

## Commercial rules retained from original master §3

| Rule | Select | Premier |
|---|---:|---:|
| Annual membership, USD | 120.00 | 300.00 |
| Essential account access and security | Same complete platform | Same complete platform |
| Domestic online acquiring rate | 0.029 × eligible sales + 0.30 × payments | Actual brand costs + 0.005 × eligible sales + 0.30 × payments |
| Base cashback on eligible settled purchases | 0.005 | 0.005 |
| Additional spending bonus | None | 0.005 of eligible purchases |
| Provider-fee bonus | None | 0.20 of eligible Premier provider fees |
| Additional-bonus cap | Not applicable | 300.00 shared across both extra sources, per membership year |
| Support | Member | Priority |
| Initial membership fee refund window | 60 days | 60 days |

A new account, card, card replacement or Household invitation does not create another annual bonus cap. Persist the attributed sponsoring membership and applicable policy version on economic events. No double reward attribution when a person participates in several memberships or account contexts.

Base cashback accrues only on eligible settled purchases, posts monthly in mock lifecycle, and reverses proportionally. Combined Premier bonus is credited within 30 days after membership-year end; renewal is not a prerequisite to payment of earned bonus. Upgrade prorates the cap to the remaining membership year; downgrade normally applies at renewal. Repeated plan changes cannot restore a consumed cap. Resolve source-ambiguous rounding, timestamp boundary and fee-refund handling explicitly in `docs/DECISIONS.md` before affected writes.

Exclude transfers, collateral deposits, repayments, cash-like transactions, fees, refunded/reversed purchases, self-payments, circular transfers and other provider-ineligible categories. No rewards on invoice issuance or a mere authorization hold. Original reward history is not imported into the new project.

## Real product meanings preserved

Consumer spending is approved secured pay-in-full, not a prepaid wallet and not daily automatic repayment. Merchant spending is commercial charge/pay-in-full with daily full repayment at launch, not revolving credit. Supervised participants spend only guardian-funded amounts and have no independent credit repayment bill.

Merchant available funds can back commercial spending only through an explicit permitted pledge/reservation and common backing checks. Pending receipts, reserves, disputed funds and promised refunds do not count. Card limits divide usable backing; cards do not create backing. Do not display a provider decision as genuine KYC or underwriting in mock mode.

## Required outcome scope

Public site: overview, account/service explanations, plan comparison, value calculator, support/legal drafts, accessibility and sandbox disclosure. No compliance or deposit-protection claims.

Member: signup/confirmation/recovery, membership lifecycle, service and exact-resource selection, activation requirements, cards, limits, activity, receipts/documents, repayment, rewards, notifications and cases. Financial setup uses fictitious values only.

Household: accepted account and separately targeted merchant invitations, co-management, adult participant/independent-adult distinction, guardian-funded participants, budgets/allowances, per-person restrictions, access revocation and sub-MID delegation to named members or outsiders. Guardians retain authority over minor-associated commerce; no independent minor merchant onboarding. Supervised collection remains unavailable without the explicit guardian/age/product prerequisites described in the main design.

Merchant: named approval/requirements; master merchant network and accepted sub-MID relationships; exact gateway bindings; payment channels using SMS/text, email, invoices/bills, social sharing, QR and website links; authoritative receipts, deposits, recurring mock schedules; online checkout; capability-only Tap to Pay/POS where unsupported; payments, refunds, disputes, reserves, payouts; team roles, accounting categories, reconciliation and statements. These surfaces share one payment/ledger lifecycle and do not create separate balances or payment engines.

Operations: scoped queues, cases/SLAs, internal/customer messages, exceptions, guarded adjustments, provider events, dead letters, reconciliation, source-mapped service catalog, cost engine and approval controls.

Partners: Direct, Referral/distribution, Wholesale reseller, Embedded/co-branded models; distinct customer/partner/platform economics; program governance, due diligence, brand configuration, monthly statements, invoices, API keys, signed webhook subscriptions, cases and exports. Management features do not clutter customer navigation.

All outcomes are tracked in the backlog. An unavailable provider capability is labeled unsupported; it is not a button that pretends a real operation succeeded. Explicitly disabled future cost rows remain disabled until approved inputs exist.

## Required numeric fixtures

`contracts/regression-fixtures.json` includes the authoritative annual pricing scenario. Management cost regression from original master §10.5:

| Metric | Expected source value |
|---|---:|
| Select modeled operating cost | 968.8336866137948 |
| Premier modeled operating cost | 982.6970199471282 |
| Select contribution | 667.1663133862053 |
| Premier contribution | 53.30298005287182 |
| Premier contribution change | -613.8633333333335 |
| Enabled cost lines | 60 |
| Missing active Planning rates | 25 |
| Completeness | 58.33333333333333% |

Reproduce monetary cost regression within $0.01 from formula/driver/rate imports, not hardcoded totals. These are supplied planning fixtures, not audited forecasts or current vendor quotes. A null/missing rate is not zero and must remain visible. Rates use explicit Planning, Contracted or Actual basis without hidden fallback between them.
