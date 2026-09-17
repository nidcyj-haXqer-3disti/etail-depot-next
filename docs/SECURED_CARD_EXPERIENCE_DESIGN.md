# D84 — secured-card experience and unified service styling

17 September 2026 (Tokyo). The user requests clearer family/business marketing, a Visa secured credit/charge-card model with an initial deposit and daily/monthly repayment, and Merchant styling consistent with Cardholder. This supersedes prepaid as the intended future product. It does not establish that the current prepaid ledger is already a credit account.

Status: financial design under review. The user confirmed monthly pay-in-full with optional earlier/daily repayments; the deposit-to-limit decision is pending. Landing copy and Merchant presentation may be implemented independently. Do not change displayed prepaid balances into debt or label a top-up as a repayment before the corresponding ledger and lifecycle exist.

## Decisions to settle

1. Confirmed by the user: a monthly statement paid in full, with optional earlier/manual daily payments. A revolving balance, minimum-payment calculation, interest and interest-bearing delinquency would be a different product and require specified terms.
2. Recommended: settled security deposit backs the shared account limit dollar for dollar and remains collateral, separate from purchases and bill payments. Alternatively, an issuer-approved limit can differ from the deposit. A model that automatically consumes collateral to repay the statement is also materially different and must not be inferred from the word secured.

The current owner/assigned-card model remains: the account owner provides collateral and pays the shared account bill; invited users see their own cards and activity. They do not gain visibility into the owner's deposit, bank source, account-wide debt, other cards or merchant balances. Existing per-card total allowances remain until the owner changes them; repayment or a new statement does not silently reset them. These are retained Etail product choices, not Visa-wide rules. The confirmed monthly pay-in-full choice applies to the card account; owning a separate Merchant service does not silently select a daily billing cycle or authorize using Merchant funds to pay the card bill. It supersedes conflicting historical Seller-based repayment assumptions for this proposed account.

## Research distinction

Visa is the payment network. The issuer/program determines eligibility, deposit custody, account limit, billing, repayment, fees, returns and closure. A secured credit card normally creates debt when used; its collateral is not the prepaid balance being consumed for each purchase. A secured revolving card and a pay-in-full charge card therefore need distinct terms. No issuer agreement, active Visa issuance integration, insured-deposit protection or credit-bureau reporting is established by this design.

Primary references and the differences between issuer products are recorded in [D84 secured-card references](research/d84-secured-card-reference.md). Visa's [secured-card explanation](https://www.visa.com/en-us/personal/cards/what-is-a-secured-credit-card) and Capital One's [deposit and repayment FAQ](https://www.capitalone.com/credit-cards/platinum-secured/) support separating collateral from the card bill. Dollar-for-dollar collateral and optional daily repayment are proposed Etail terms, not an inferred universal network program.

## Customer language and navigation

Public copy uses **For your family or business**, **Give someone a card**, and **Let your team accept payments**. Avoid “your people,” “invite trusted help,” and invented role names. Invitations continue to grant one exact card or terminal; public wording cannot broaden the permission.

Keep the existing Cardholder shell and resource navigation. The account home carries the money summary and direct actions; card detail keeps freeze, allowance, activity and cardholder sharing. The proposed Home contains:

| Display | Meaning | Main action |
| --- | --- | --- |
| Balance to repay | Posted unpaid purchases less allocated settled payments and eligible credits; pending purchases are separate | Pay balance |
| Available to spend | Server-calculated remaining approved capacity after posted debt and authorization holds, subject to restrictions | View activity |
| Security deposit | Settled collateral held separately; pending deposits shown separately | Add to deposit |
| Statement | Last issued statement, remaining amount due, due date and payment status | View statement |

The first-use state asks the owner to **Add security deposit** after account setup. Do not show **Pay balance** when there is no posted balance. Once active, **Pay balance** and **Add to deposit** remain separate actions with different review text and receipts. Replace routine “top up” language only when the financial cutover is implemented. Do not offer an ordinary “withdraw balance” action for collateral. A deposit-return request belongs in account settings and requires actual eligibility and processing.

Repayment uses one form: select statement balance, current balance or a permitted custom amount; choose an authorized payment source; review; confirm; see pending/completed/failed status and exact receipt. “Daily” must distinguish an owner making a payment today from an enabled daily automatic-payment mandate. A saved preference alone must never be presented as functioning automatic repayment.

Owner-only account settings separate billing preferences, payment sources, deposit history/return, notifications and closure from personal Profile and Sign-in & security. Invited users see card settings and their own activity, not shared billing controls.

Merchant keeps **Overview / Terminals / Account settings**, its credit/debit statement, payouts and terminal-owned channels. Match Cardholder's light navigation, surfaces, radii, typography, spacing and restrained action colors. Do not import Cardholder billing concepts into Merchant. Merchant funds remain separate and cannot automatically collateralize or repay the card account.

## Worked example — proposed 1:1, separately held collateral

All numbers below are illustrative and assume no fees, holds or restrictions. Actual fees cannot be silently guessed as zero in a financial command.

| Event | Security deposit | Shared limit | Balance to repay | Available to spend |
| --- | ---: | ---: | ---: | ---: |
| Deposit settles | $1,000 | $1,000 | $0 | $1,000 |
| Card purchase posts | $1,000 | $1,000 | $200 | $800 |
| $200 repayment settles | $1,000 | $1,000 | $0 | $1,000 |
| Another $500 deposit settles | $1,500 | $1,500 | $0 | $1,500 |

A pending $200 repayment does not yet restore spending capacity under the recommended conservative sandbox policy. A $100 authorization hold reserves capacity but is not yet posted debt. A refund can reduce debt; if the purchase was already repaid, its excess becomes a customer credit, not extra security deposit or invented cash revenue. A repayment does not replenish an individual card's lifetime total allowance.

## Backend and database contract

Retain the existing identity, exact-resource policy, issuance lifecycle and single immutable ledger writer. Introduce a scoped credit-account module rather than implementing financial state in React or adding another ledger. All amounts remain integer minor units; API amounts are strings. The server returns distinct deposit, approved limit, posted debt, holds, credits, due amount and spendable capacity.

Proposed records:

| Record | Responsibilities |
| --- | --- |
| Card credit account | One per Cardholder service; currency, program version, billing policy, lifecycle and exact owner binding |
| Deposit intent and provider events | Reviewed amount, immutable command identity, source reference, pending/settled/failed/returned states and ledger links |
| Account limit decision | Approved limit and effective policy; retain deposit-derived versus separately issuer-approved provenance |
| Issuing authorizations and capture/refund events | Provider event deduplication, card/account scope, reservation, capture, expiry, reversal, refund and settlement lineage |
| Repayment intent and provider events | Reviewed amount/source, pending/settled/failed/returned states, one effect per event and exact receipt |
| Statement and allocations | Immutable period snapshot, opening/closing balances, posted lines, due date, credits/payments allocated without rewriting the statement |
| Payment preference and mandate | Explicit owner's authority, source, cadence, effective date, consent and scheduler/provider attempt identity |
| Deposit-return/closure request | Current eligibility, reserved amount, processing, success/failure and audit trail |

Extend the existing ledger with separately typed collateral, deposit-in-transit, issuing receivable/clearing, repayment-in-transit, customer-credit and deposit-return positions, with balanced journals for every transition. Do not repurpose `MONEY_AVAILABLE` or `CARD_SPENT` to mean several things. Posted purchase history remains distinct from outstanding receivables and from gross allowance consumption. A journal must identify its exact account/service/card and business effect.

Atomic new-authorization eligibility checks account state, card state/assignment, approved limit, held collateral policy, posted debt, active authorization holds and remaining card allowance under one consistent account/card lock order. Reserve each open authorization against both shared account capacity and the individual card allowance. Capture replaces the reservation with posted debt and gross card use; it must not count both the hold and capture. Release/expiry frees only unused reservations. Creating a card or raising its allowance creates no collateral, credit or cash. Payment submission creates no settled credit. Concurrent cards cannot overspend shared capacity; concurrent repayment/capture/refund/deposit-return events cannot spend the same capacity twice.

Refunds retain original-purchase lineage but post as new credits when received, including before any statement or after the purchase was fully repaid. Allocate the current credit using the chosen policy without backdating it, rewriting an immutable statement or reopening a paid obligation. Overpayments and returned repayments require explicit customer-credit and debt-restoration entries. Separate new-spend authorization from mandatory reconciliation of a valid network capture: a verified late/forced capture must still record owed debt after freeze, access revocation or closure and expose any over-limit/under-collateralized state without approving new spending. Deduplicate every provider event. No automatic deposit seizure, late fee, interest accrual or credit-line increase is inferred from an overdue balance.

Owners must retain narrowly scoped statement access and repayment capability while spending is suspended, delinquent, closing or closed with debt, subject to identity and security restrictions. Extend the same server policy engine for collection-only access; do not globally reopen a suspended service or grant invited cardholders account-level money rights.

Billing needs a specified statement calendar, timezone, due-date rule and payment cutoff. Daily automation needs a real recurring job and idempotent saved attempts, not a UI-only toggle. These program settings must be explicit before enabling dependent writes; the daily/monthly product choice does not provide an unstated due date or issuer settlement speed.

## Implementation touchpoints in this repository

- `src/modules/money/service.ts` currently credits top-ups directly to prepaid `MONEY_AVAILABLE`. Keep Merchant money behavior and historical money receipts intact; add distinct deposit and repayment commands under the secured-card owner.
- `src/modules/workspace/funding-reader.ts` currently limits card availability by prepaid funds and total gross allowance. Replace its prepaid capacity dependency only at the completed secured cutover; continue deriving allowance use from legitimate purchase history.
- `src/modules/workspace/service.ts` currently debits prepaid funds when recording a purchase. New credit capture must create a receivable and preserve scope, command recovery and receipt identity.
- `src/modules/acquiring/operations-service.ts` contains historical connected-card refunds. Refund handling must follow the original transaction's funding provenance; it must never charge an old prepaid purchase a second time or put a secured-card refund into the Merchant balance.
- `src/modules/ledger/{contracts,schema,service}.ts` and database constraints remain the one posting boundary. Extend them with explicit event/position shapes and immutable effects.
- Cardholder dashboard contracts, funding/history, money forms, account settings, invitation preview, Help and public marketing must consume the same completed secured-account projections. Do not merely rename existing prepaid values.

## Migration and retained records

No database reset is authorized in this task. Preserve all posted journals, cards, assignments, exact invitation links, memberships and Merchant records. Historical prepaid purchases were already paid and must not become opening debt.

Before migration, produce a read-only reconciliation of all active Cardholder money accounts, posted positions, pending withdrawals/funding reviews, payment/refund lineage and old receipts. The proposed cutover may transfer an explicitly eligible remaining prepaid balance to collateral through one balanced, uniquely keyed cutover journal; it must not duplicate assets, rewrite an old journal or consume pending withdrawal reserves. Opening credit debt is zero for already-paid prepaid purchases. Any unresolved in-flight item requires a defined event continuation before its account can cut over.

Retain transaction funding provenance for later historical refunds; a prepaid refund becomes an explicitly classified customer credit under the new account, not new debt repayment or implicit deposit growth. Completed saved commands return their original receipts. Unconfirmed saved prepaid reviews need an explicit stale-product response and a new review under the selected program, not silent reclassification. A reconciliation proves the before/after accounting equation for every converted account and an identical retry adds no effect.

Use additive migrations on the marked preview/test databases only after the model and transition are executable and verified. Hosted migration and publication require their own exact-source release evidence. Current deployed balances remain prepaid until that cutover occurs.

## Delivery and acceptance

1. Complete independent landing copy and Merchant style alignment, run targeted desktop/mobile/accessibility checks and show the local result.
2. Resolve the remaining deposit/limit choice and record the exact sandbox billing calendar/provider behavior. Finalize deposit/repayment/statement projections and account setup screens together.
3. Implement one end-to-end secured account slice: deposit review/settlement → card allowance → authorized purchase/hold/capture → statement → repayment review/settlement → restored capacity → original-purchase refund. Add automatic daily/monthly processing only with the corresponding mandate and job.
4. Complete exception and cutover cases: duplicate/reordered events; overpayment; returned repayment; late capture; refund after repayment; overdue restriction; deposit return while holds/debt exist; original prepaid refund; source failure; account closure; interrupted command recovery; other-owner/assigned-card denial.
5. Verify atomic PostgreSQL concurrency, migration/replay reconciliation, adapter/API contracts, owner/recipient browser flows, a11y, mobile layout, source security and release packaging. Record implementation and deployment separately.

The research and schema proposal are not an implemented issuing/billing program, issuer approval or production financial availability.
