# Etail Depot — account-first backend, data, and workflow redesign

**Status:** Proposed replacement architecture and implementation contract; not a deployed replacement.  
**Prepared:** 8 September 2026.  
**Implementation tracking:** GitHub issue #5 — https://github.com/nidcyj-haXqer-3disti/etail-depot-member-commerce/issues/5  
**Inspected baseline:** `nidcyj-haXqer-3disti/etail-depot-member-commerce`, main commit `54e38a1aee392fefcb2341e11a2b67cef9c95a59` (merged PR #4).  
**Scope:** Personal, Household, Seller; issuing, acquiring, permissions and controls; preservation of membership economics, ledger integrity and operational evidence.  
**Release boundary:** No data reset, production migration, provider change, secret change, or deployment is authorized by this document. Implement replacements on a development branch and release only after the cutover gates below.

## 1. Decision and diagnosis

Replace the guide-plus-legacy presentation with one account-scoped product model and one implementation of each task. A simpler label on a second form is not simplification.

The reviewed code establishes the immediate problem:

- `src/ui/guided-platform.tsx` extends `Platform`, implements a new `spending()` sequence, and renders `super.spending()` inside “All spending tools and activity.”
- The guide's “Create a test card” and the legacy screen's “Create spending access” both submit to `/spending/:id/credentials`. Both eventually use `SpendingService.credential` and the `payment_credentials` table. They are not two separate issuing engines, but they expose different labels, defaults and choices for the same operation.
- The guide selects the first owned Personal spending account it finds. This is not an explicit, durable selected-account model.
- Setup decisions exist in frontend journey functions as well as service states, requirements, and next-action fields. Their interpretations can drift.
- Account relationships and access are expressed through households, seller profiles, spending accounts, account participants, resource grants and separate team tables. These records have real distinctions, but the application lacks one explicit account context connecting them.
- `SpendingService.credential` currently requests the `spend` permission for card creation. The replacement must distinguish using an assigned card from managing or issuing cards; this is a proposed policy change, not evidence of an exploited vulnerability.

The earlier PR explicitly preserved the old tools. That explains the duplication; passing feature tests did not establish that the resulting product was easy to understand. The inspected PR is merged. It must be replaced through subsequent changes, not described as still awaiting publication.

**Do not implement:** a third “simplified” backend, an alternative easy-mode card engine, or another feature layer that keeps both existing creation forms in customer navigation.

## 2. American Express research: patterns, not private internals

The research covers public American Express documentation. It does not establish American Express's internal tables, proprietary service architecture, underwriting, or operational infrastructure. The design below is an Etail Depot proposal, not a reproduction of those internal systems.

| Publicly documented pattern | Etail Depot design implication |
|---|---|
| Additional Card Members can have their own login and card; their visibility differs from the primary member's. [A1] | Separate person, login, account, cardholder, and data visibility. Do not equate joining a household with access to all private history. |
| Account Managers can be assigned to review transactions and make payments. [A2] | Separate administrative authority from permission to spend. |
| Employee cards support per-card limits, activity tracking and freezing; limits also depend on overall account capacity and have documented exceptions. [A3] | One card-management area; limits are controls on an existing funding facility, not new funding. Distinguish guarantees from alerts. |
| Merchant Payments groups settlements, submissions, transactions, adjustments and reports. [A4] | Organize “Get paid” around one merchant relationship and a traceable payment lifecycle. |
| Merchant location access distinguishes enrolled, not enrolled and ineligible products. [A5] | Return explicit service capabilities and actionable reasons rather than making customers discover prerequisites through errors. |
| Virtual-card controls and employee-card controls can have different semantics. [A6] | Use one card workflow, but preserve product-specific policy rules. Do not flatten genuinely different funding or control behavior. |

We do not adopt Amex-specific ages, fees, credit policies, reporting rules, spending-limit exceptions or branding. Etail Depot's approved product rules remain the authority.

## 3. The product model

**One person signs in. That person may access multiple accounts of exactly three types.** A type describes the financial context, not the person's permanent identity or permission level.

| Account type | Purpose and ownership | Spending | Getting paid |
|---|---|---|---|
| `PERSONAL` | One person's private context. | Approved consumer pay-in-full facility, refundable collateral and assigned cards. | Quick Sell is a shortcut into an approved, named Seller relationship, not a second merchant identity or anonymous transfer system. |
| `HOUSEHOLD` | A shared context administered by named adults. Membership does not pool private finances by default. | Adult access explicitly allocated from an approved owner's facility; supervised children/teens use funded balances, not independent credit. | Only delegated work for an explicitly linked, approved Seller; no Household merchant-of-record. |
| `SELLER` | Commercial context for a named approved person or business. A representative's management role is distinct from the legal party's financial responsibility. | Separate commercial pay-in-full facility and team cards; preserve daily repayment policy at launch. | Approved merchant relationship, payment links, invoices, payment activity, refunds, disputes, reserves and payouts. |

A person may own a Personal account, manage a Household, and be only a Viewer in a Seller account. Account access must not be inferred from one global `user.kind` field.

A signed-up user may exist before a paid membership is active. That is an incomplete onboarding state, not a new free membership tier. A Household participant or delegated Seller user does not automatically require another membership charge; entitlement follows the approved sponsoring membership and product rules.

### Names that must no longer be interchangeable

- **Login:** the authentication credential and session for a person.
- **Membership:** the Select/Premier commercial relationship and membership-year benefits.
- **Account:** a Personal, Household or Seller context with explicit access boundaries.
- **Spending facility:** the underlying approved capacity or funded balance and its responsible party. This is an internal financial concept; do not ask the user to create one casually from several menus.
- **Card:** a physical or virtual payment instrument assigned to a person, backed by one explicit facility or allocation. It does not independently create money or credit.
- **Merchant profile:** the approved legal identity accepting a customer's payment.
- **Role:** what a person may do within a particular account; not another account type.

Maintain one canonical customer-facing term for each concept. Retire “payment access,” “spending access,” and “test credential” as competing names for the same card.

## 4. Backend organization

Retain a modular monolith and PostgreSQL. Reorganizing responsibilities does not require adding microservices, a new database provider, or a generic workflow platform.

### Three functional modules

**Issuing:** spending-facility activation, collateral/funding, card requests and cards, authorization decisions, holds, cleared purchases, repayments, statements and reversals.

**Acquiring:** merchant activation, payment requests, invoice allocations, payments, settlement, refunds, reserves, disputes and payouts.

**Access and controls:** account access, invitations, cardholder assignments, delegated resource visibility, action permissions, limits, approvals and revocation.

### Shared foundations

Identity and membership retain sign-in, terms, plan entitlement, fees and membership-year calculations. Ledger owns posted financial records and reconciliation. Integration infrastructure owns provider adapters, provider-object mappings, incoming events, durable work, retry and reconciliation. Operations retains support cases, documents, notifications, audit, economics and partner administration.

These foundations should not all become top-level customer menus. A module owning data is not a reason to expose a new workspace.

Each command has exactly one module owner. API handlers, UI pages, integrations and admin tools do not each implement their own version of the command. Customer and operator requests use the same underlying command, with different explicitly authorized actions where genuinely necessary.

## 5. One card workflow

### Customer experience

`Select account → Cards → Add card → Choose cardholder → Set card details and limits → Review → Create`

The Home action and an empty Cards page can both link to this workflow. Multiple links are acceptable; independent implementations, differently named equivalents, and different business defaults are not.

- The selected account and funding relationship remain visible on every step.
- For Personal, the primary cardholder can be prefilled. For Household and Seller, only eligible named participants are available.
- Virtual/physical form, single-use behavior and merchant restrictions are fields within the same workflow, not separate creation products.
- Any optional settings expand within the same form. They do not reveal the legacy form below it.
- Creating a second card deliberately is supported. Accidental replay of the same request is not.
- Existing multiple spending facilities are preserved. The migration establishes an explicit default or requires the user to select one; it must not choose the first database row or merge balances silently.

### Prerequisites and resumability

The account capability response says whether the person can create a card, why an action is blocked, and the canonical route to fix the prerequisite. Typical reasons include membership required, identity check required, issuing approval pending, funding required, missing assignment, step-up authentication required and account restriction.

Use a saved `card_request` for a task that spans prerequisite screens. Returning from verification or funding resumes that request. Refreshing or signing in on another device must not start another membership purchase, account application or card request automatically.

The frontend may validate input formatting, but may not decide entitlement or approval. Every mutation rechecks authorization, account and provider state, and policy in the backend. A previously rendered enabled button is not an authorization token.

### Command contract

Proposed customer API:

- `GET /api/v2/accounts` — only accessible account contexts.
- `GET /api/v2/accounts/:accountId/overview` — appropriately filtered activity, capabilities and one recommended next task.
- `POST /api/v2/accounts/:accountId/card-requests` — start one resumable request; idempotency key required.
- `GET /api/v2/accounts/:accountId/card-requests/:requestId` — resume only an authorized request.
- `PATCH /api/v2/accounts/:accountId/card-requests/:requestId` — update editable draft fields with a version check.
- `POST /api/v2/accounts/:accountId/card-requests/:requestId/submit` — the sole customer card-issuance command.
- `GET /api/v2/accounts/:accountId/cards` — the canonical card list.
- `POST /api/v2/accounts/:accountId/cards/:cardId/freeze` — the canonical freeze command; similarly explicit unfreeze/cancel commands.

Endpoint names are a proposed contract, not live routes. Do not add them as a parallel product while continuing to expose the two old UI forms.

### Duplicate prevention and provider outcomes

Scope idempotency by actor, account, command and operation identity. Store a request digest; reject reuse with different input. A unique reference from card to submitted card request prevents a second result even if a client invents another idempotency key. A deliberate second request can create another allowed card.

Record provider operations durably with stable operation identifiers. A provider timeout is an unknown/pending result, not permission to issue another card with a different identifier. Reconcile the original operation before retrying where provider semantics require it. Outgoing jobs and incoming events must be deduplicated and safely replayable. Do not claim distributed exactly-once delivery; enforce unique application effects.

A draft, submitted request and issued card are different objects. User-facing success is shown only after durable application state and provider outcome support it. The provider token is not an authentication credential for the user and must not be exposed as a full card number.

### Remove the duplicate implementation

The cutover PR must remove the guide's embedded `super.spending()` card-creation entry and the old separate `actionButton` creation definitions. Replace page inheritance with composed account pages and a single card-form component. If a legacy API temporarily remains, it is an adapter to the same command and policy, with a retirement date—not another writer. Do not redirect unsafe POST operations casually; explicitly adapt supported requests or return a typed upgrade-required response.

## 6. Workflow ownership and states

Do not use one global `ACTIVE` flag to imply everything is approved. An account can exist while a merchant application is still under review or a spending facility is restricted. Services have separate domain states and the overview derives understandable labels.

| Domain | Representative lifecycle; exact allowed transitions belong to its module |
|---|---|
| Account access | Invited → Accepted/Active → Suspended/Revoked; expired/rejected invitations do not grant access. |
| Service enrollment | Not requested → Submitted → Needs information / Approved / Declined → Suspended / Closed. |
| Card request | Draft → Action required / Ready → Submitted → Issued / Declined / Reconciliation required. |
| Card | Pending → Active ↔ Frozen → Canceled/Expired; cancellation is not a reversible freeze. |
| Issuing purchase | Authorization request → Approved hold / Declined → Cleared / Released / Expired; later refunds are linked new records. |
| Acquiring payment | Initiated → Authorized → Captured → Settled, with explicit failure/void/refund/dispute records. |
| Payout | Requested → Reserved → Submitted → Paid / Failed / Unknown; unknown requires reconciliation. |

Partial capture, partial refund and dispute states are not forced into a misleading single linear status. The overview may combine them into a concise summary, while retaining separate amounts and records.

“Next step” is computed from authoritative account, entitlement, policy and service state in the backend. It is not separately saved as competing text in every table or reimplemented in React. Durable in-progress tasks remain stored; a recommendation itself need not be a second source of truth.

## 7. Sandbox behavior must not become the product workflow

Retain the same domain commands and state transitions for sandbox adapters and future live adapters. Keep the live-money guard disabled. The client cannot turn a request into a live payment or choose arbitrary provider approval outcomes outside an authorized test environment.

Separate operator simulation controls from ordinary member actions. A member should not need to understand “authorization,” “manual clear,” and “finish purchase” simply to try a normal purchase.

The ordinary sandbox action, **Make a practice purchase**, should request a simulated merchant purchase once. The mock provider then emits authorization and clearing outcomes through the same event handlers. The screen shows Pending and then Completed, or a specific Declined/Needs attention result. Never synthesize completion just by changing a UI label.

Detailed delayed-clearing, reversal, failure and dispute scenarios belong to one operator test console. They are not additional card-creation or purchasing workflows. Automatic simulation requires a tested event runner with bounded permissions and retries; do not solve the problem by enabling every scheduled job indiscriminately. A paused worker should show a clear pending/retry status, not invite duplicate purchases.

New readiness checks should distinguish a feature intentionally unavailable, an incomplete account prerequisite, and a deployment configuration fault. They must not reveal secrets. Preserve real email authentication, confirmation, session protection and account permissions while enabling financial simulations.

## 8. Permissions and controls

Use a single action-policy interface across modules, backed by explicit account and resource scope:

`evaluate(actor, action, account, resource, currentState) → allowed / reason / requiredAction`

Four initial role templates are sufficient for the common interface: **Owner, Manager, Cardholder, Viewer**. They expand into action permissions and visibility, rather than becoming an unrestricted hierarchy. Custom enterprise policies can be added later without creating new account types.

| Action | Owner | Manager | Cardholder | Viewer |
|---|---|---|---|---|
| View account-wide activity | Within owned account | Only granted scope | Own/assigned activity only | Only granted scope |
| Use an assigned card | When an eligible cardholder | Not implied by management role | Within funding and controls | No |
| Request/create/manage cards | Subject to product policy | Explicit card-management grant | No by default; optional request-for-approval capability | No |
| Invite people/change roles | Within authorized scope | Explicit grant; no self-escalation | No | No |
| Release collateral/change payout destination | Step-up and financial controls | Separate explicit grant and approval rules | No | No |
| Issue refund/approve payout | Explicit acquiring authority and state checks | Separate explicit acquiring grant | No | No |

Owner is not a bypass for fraud restrictions, supervisor restrictions, unavailable services, financial invariants or regulatory/provider requirements. Staff access is a separate audited support scope, not implicit membership in every customer account. A manager cannot turn themselves into Owner, remove a guardian restriction or grant a permission they cannot delegate.

### Privacy

An invitation shares only the declared account scope after acceptance. It does not share a person's existing Personal history or their other Seller accounts. Cross-account views reference explicitly shared cards, facilities or merchant resources; they never copy them into new records with broader rights. Revocation applies on the next protected request and invalidates cached capability results.

A supervised participant never acquires independent consumer/commercial credit by receiving a role or card. Their guardian, spending allocation and visibility are explicit. Preserve their existing funded balance and history during migration.

### Spending controls

A spending decision applies all applicable ceilings: provider-approved facility capacity, settled funding/collateral backing, account policy, allocated amount, person policy, card policy and budget. Restrictive rules compose: limits take the tightest applicable remaining amount; block rules prevail; allowlists intersect where defined. A card or a role cannot relax a parent restriction.

Use named policy semantics rather than treating every policy as a generic numeric minimum. A monthly budget, allowed merchant list, country restriction and single-use card have different checks. Changes to a limit do not silently reset usage. Usage includes reservations as well as posted purchases under the approved product policy.

Reserve capacity and policy counters atomically with an authorization. A 100-unit facility cannot approve concurrent new 80- and 30-unit holds. Real clearing events must still be recorded even if a card was subsequently frozen; late or excess clearing becomes an exception to reconcile, not an event to discard because a UI action is no longer allowed.

## 9. Acquiring: one merchant, one payment lifecycle

A Seller activates one approved merchant relationship for the appropriate legal person/business. Locations and provider subaccounts are subordinate records where required, not new anonymous account types.

Payment links, QR codes and invoices initiate or refer to the same acquiring payment workflow. An invoice can receive multiple partial payments; a reusable link can originate multiple independent payments. Do not make the invoice, link, payment, refund and payout the same database object.

Customer-facing navigation under Seller → Get paid:

- Overview of pending, available, reserved and paid-out amounts.
- Request a payment (link, QR or invoice as delivery options).
- Payment details with timeline, refund action and linked dispute.
- Payouts and destination management.

Personal Quick Sell navigates into the member's approved Seller workflow. Household-assisted selling requires an explicitly shared Seller permission. Show the actual Seller identity throughout checkout, refund and payout. A customer who is merely paying a Seller must not be required to buy a membership.

Incoming merchant proceeds and outgoing card spending remain different financial flows even when one Seller account displays both. Pending sales, reserves, disputed funds, pending refunds and reserved payouts do not become card spending capacity. Any permitted pledge of eligible settled Seller funds is an explicit, auditable encumbrance that removes those funds from payout availability. It is not a new balance calculated independently by the UI.

## 10. Database redesign: organize ownership, preserve financial truth

Use the existing relational database and additive migrations. The objective is understandable ownership and unambiguous writes, not an arbitrary reduction to ten tables.

### Target logical groups

| Group | Canonical records | Responsibilities |
|---|---|---|
| Identity/membership | People, authentication mappings, sessions, member profiles, memberships, periods and consents | Separate login from billing and legal/product identity. Children may have a participant record without independent login. |
| Accounts/access | Accounts with an exact three-value type, account access, invitations, parties, delegated shares | One account directory and access model; no financial balances on the generic account row. |
| Issuing | Spending facilities, allocations, card requests, cards, policies, authorizations, purchases, collateral events, repayments, statements | One financial instrument workflow with product-specific funding and repayment behavior. |
| Acquiring | Merchant profiles, requirements, payment links/invoices, payments, captures/settlements, refunds, reserves, disputes and payouts | Preserve merchant identity and payment-to-settlement traceability. |
| Financial truth | Ledger accounts, immutable posted journals/lines, reconciled projections | All financial summaries derive from reconcilable posted records and outstanding reservations. |
| Shared operations | Provider mappings, operation records, event inbox/outbox, jobs, audit, cases, documents, notifications | One integration and exception mechanism; access follows owning account/resource. |
| Economics/partners | Versioned commercial rules, rewards, cost models, partner programs, scoped keys and planning statements | Preserve contracts and traceability without placing every table in customer navigation. |

These are logical groups, not instructions to create all tables anew. Reuse and strengthen existing tables where their meaning is already correct. Use constrained type-specific extension records for Household and Seller requirements instead of a universal JSON blob. Do not add a second ledger or competing membership store.

### Key relationships and constraints

An account has an explicit membership sponsor/entitlement relationship and responsible party where applicable. A spending facility records its actual liable owner or guardian-funded mode. A card has one facility/allocation and one cardholder, with an explicit home account and any separately granted visibility. A merchant profile has one approved legal party and an owning Seller context.

The account context displaying a facility does not change its legal owner or duplicate its capacity. Cross-context sharing uses references and narrowly defined permissions. Use composite foreign keys or equivalent transactionally enforced constraints to prevent a card, participant or event from referring to the wrong account/facility. Read APIs also enforce scope; valid foreign keys alone do not authorize a person.

Use exact integer minor units (or the project's existing exact-money representation) and explicit currency for posted values. Do not convert money to floating-point arithmetic while refactoring. Use unique event and operation identifiers, constrained states, foreign keys and immutable posted-journal enforcement. Balance snapshots and counters are projections/reservations with reconciliation, not additional independent balances.

### Existing-to-target migration map

| Existing source | Target treatment |
|---|---|
| `users`, profiles, sessions and security/recovery tables | Preserve identifiers and verified Identity mappings; separate additional account roles from authentication identity. No forced password reset. |
| `memberships`, `membership_periods`, reward tables | Preserve fees, original period boundaries, bonus consumption, beneficiary attribution and reversals. No new cap per account or card. |
| `households`, `seller_profiles`, user-owned Personal contexts | Introduce explicit account IDs and type-specific extensions; retain legacy ID mappings. A Seller profile's legal identity must survive any rename. |
| `household_members`, `seller_team_members`, `account_participants`, `resource_grants` | Map into account access plus explicit resource/facility assignments. Do not flatten guardian duties, borrowing responsibility, acceptance evidence, or visibility into one role string. |
| `spending_accounts` | Reuse/migrate as spending facilities; preserve owner, provider reference, collateral, holds, obligations, repayment schedule and history. Never merge separate facilities automatically. |
| `payment_credentials` | One canonical Cards resource; preserve card IDs, cardholders, provider mapping, status and restrictive settings. A label migration never issues replacement provider cards. |
| `household_transactions`, supervised balances/allowances | Preserve as funded-spending records with explicit guardian/allocation links. Do not convert into credit or silently replay historical purchases. |
| Merchant payments/refunds/reserves/disputes/payouts | Preserve histories and relationships; standardize command ownership, not their balances or economic classification. |
| Ledger, audit and provider events | Preserve append-only evidence; reconcile mappings; historical events must not be reprocessed into new money postings. |
| Cost and partner records | Retain and keep out of the first customer navigation redesign. Do not delete as “clutter.” |

### Money example that the simpler UI must get right

For a hypothetical approved consumer facility backed by 100 USD collateral, after a 10 USD settled purchase and no other holds:

- Refundable collateral remains 100 USD, subject to obligations.
- Outstanding repayment obligation is 10 USD.
- Available spending capacity is 90 USD, subject to all other controls.

Calling all three values “wallet balance” would change the user's understanding of the product. Preserve the consumer statement-based full repayment, Seller daily full repayment, and supervised funded-balance distinction. The example is illustrative, not a report of any customer's balance.

## 11. Preserve the commercial contract

This request changes architecture and workflow, not pricing or rewards. Retain the supplied master specification's approved rules: Select/Premier only, their current annual fees and acquiring formulas; equal 0.50% base cashback; Premier extra spending and fee bonuses sharing one membership-year cap; and existing refund/renewal/upgrade behavior. These are project requirements, not facts borrowed from American Express.

Account migration must not restart membership years, charge another fee, generate another reward credit, convert collateral into revenue, or silently make Seller settlement balances available for personal spending. Guest checkout, Household privacy, supervised non-credit access, help/cases, and auditability remain requirements.

The missing Planning cost rates remain disclosed until independently confirmed. Simplifying the app does not make an unknown cost zero or convert planning economics into a contracted amount.

## 12. Customer information architecture

At the top, show the current account, its type and the person's role. Account selection is explicit in navigation and URL. Backend authorization always checks the requested account; selection in local storage is a convenience, not authority.

Primary account navigation:

**Overview · Cards · Activity · People & controls · Settings**

Add **Get paid** for an approved Seller context, and relevant funding/statement tasks under the account overview. Global Membership, Rewards and Help remain accessible without being mixed into every account's setup. Do not show acquiring controls in Household as though the Household were a merchant. A Quick Sell shortcut clearly switches to the linked Seller.

Use one Account page composition and shared task components. Personal, Household and Seller select capabilities and terminology, not duplicate entire pages or financial services. Domain-specific screens remain where needed. Remove page-class inheritance that renders a whole legacy application inside the new one.

One recommended action per overview should come from the backend capabilities. Additional actions remain in their natural destination, not in an “old way” panel. Every success message names what happened, which account it affected, and the next useful action. Do not replace secrets or detailed errors with a generic success banner.

A compact persistent Sandbox badge and a clear confirmation at a simulated money action are preferable to repeating a long tutorial on every panel. Never hide the simulation disclosure or imply real card issuance.

## 13. Incremental replacement and safe cutover

A full product redesign does not justify a destructive big-bang rewrite. Use a single target architecture and replace complete vertical slices; do not expose v1 and v2 as competing user modes.

### Stage 0 — baseline and design contract

Inventory current routes, table ownership, duplicate writes, permissions and actual provider adapters. Capture current account/card counts, authorization holds, liabilities, pending payouts, reward balances and membership periods from authorized data sources before migration. This document is a code/schema review only; it has not queried production customer records.

Preserve the tested financial regressions. Create an isolated development database with fictional data. Keep the deployed application unchanged until the first replacement slice is verified.

### Stage 1 — account context and centralized policy

Add account identities and relationship mappings with additive migrations. Implement one permission/capability service with account-bound read projections. Backfill mappings idempotently. Preserve all legacy identifiers and record unresolved owner/role conflicts rather than guessing.

Exit: multiple account types and different roles for the same person work; cross-account and supervisor boundary tests pass; no balance or membership-year changes.

### Stage 2 — replace Cards end to end

Implement the canonical saved card request, one form, one backend issuance command, shared provider operation handling and one card list. Adapt legacy API callers to that command temporarily where required. Remove the duplicate UI definitions and their embedded legacy page in the same cutover.

Exit: the exact same card request submitted from any remaining entry link or retried after timeout creates at most one card; a deliberate separate request still works; permissions and provider outcomes are consistent.

### Stage 3 — unified issuing activity and simulation

Move funding, purchase history, controls and repayment onto account-scoped queries and commands. Replace member-facing manual authorization/clearing steps with one realistic sandbox transaction request. Keep delayed/failure experiments in an audited test console.

Exit: existing collateral, obligations, holds, statements and available capacity reconcile; crashes, revoked access and delayed events do not duplicate funds or purchases.

### Stage 4 — acquiring and sharing consolidation

Unify merchant application, links/invoices, payments, refunds, reserves, payouts and delegated Household/Seller access under the same account and policy conventions. Retain guest checkout and legally named Seller attribution.

Exit: incoming money cannot be spent or paid out twice; role changes affect every route and worker action; no private history leaks across contexts.

### Stage 5 — remove obsolete writers, not historical evidence

Cutover is controlled per complete account/cohort, not by letting the user choose old/new. New and legacy entry points may coexist only as adapters to one writer during transition. Use shadow reads/reconciliation, not independent dual writes to two business engines. Preserve old read access where contractually needed until retirement.

Reconcile exact money amounts by currency and owner, row mappings, card/provider references, access grants, pending events, statement totals and reward attribution. Freeze or drain in-flight operations at a recorded boundary, switch routes, monitor, then retire obsolete writers. Existing card tokens must not be reissued as part of migration.

Test backup restoration before cutover. A pre-cutover backup is not a safe rollback after new financial events exist: rollback must preserve post-cutover journals/events, via compatible code rollback or forward repair. Destructive table drops need a separate reviewed migration after retention and reconciliation gates.

## 14. Acceptance criteria

The redesign is not done when a new page looks better. It is done when the following are demonstrated:

1. Exactly three account types, with one account switcher and explicit scope in each task.
2. One canonical Add card component, request lifecycle and issuing command; no guided-plus-legacy creation forms.
3. Repeated or concurrent submissions of the same request create one card/provider operation. Independent approved requests can create multiple legitimate cards.
4. The selected account and cardholder survive prerequisite completion and reload without duplicating membership or facility setup.
5. Role and resource scopes apply to every read, mutation, export, document and background action; a client-supplied account or role cannot grant access.
6. A Household member cannot see another person's private Personal activity; a Seller viewer cannot create cards, refund payments or approve payouts.
7. Supervised participants cannot independently borrow, create merchant identities or expand their limits. Their existing funded balances are preserved.
8. Concurrent holds and payouts cannot overspend the same backing funds. Parent freezes and lower limits apply consistently across cards.
9. Genuine late clearing, partial refunds and disputes are recorded and reconciled rather than discarded or silently relabeled.
10. One practice-purchase action works without teaching the customer provider event orchestration; pending/failure behavior remains truthful and replay-safe.
11. Membership economics and all existing financial invariants survive the migration. Same original membership year, same shared Premier cap, no duplicate reward credit.
12. Same-origin protections, email verification, session encryption, MFA and revocation remain effective. No demo impersonation or real-money processing is enabled by the redesign.
13. Existing account/card balances and references reconcile before and after cutover; historical events are not re-posted.
14. Old card-creation API paths are tested adapters or intentionally retired; they are never a second authorization policy or independent writer.
15. Desktop/mobile browser tests cover the actual canonical screens and server/database writes. A user unfamiliar with the internals can create a card, understand who can use it, and locate the resulting transaction without choosing between old and new flows.

The final usability test is a user acceptance criterion, not an existing measured result. Do not invent a completion-time improvement or claim a complete accessibility certification from a small automated scan.

## 15. What this step delivers

This document defines the replacement model, workflow contracts, policy rules, schema mapping, migration gates and research basis. It does not implement those API routes, apply new migrations, delete existing UI, alter existing balances, or publish a replacement backend. It is intentionally not another runnable parallel system.

The first implementation slice should be **Accounts + access + one card workflow**, replacing the duplicate card paths together. Building additional guidance on top of `GuidedPlatform` is out of scope for that slice.

## References

### Project evidence

- [P1] Current main ref, inspected 8 September 2026: https://github.com/nidcyj-haXqer-3disti/etail-depot-member-commerce/tree/54e38a1aee392fefcb2341e11a2b67cef9c95a59
- [P2] Guided presentation: https://github.com/nidcyj-haXqer-3disti/etail-depot-member-commerce/blob/54e38a1aee392fefcb2341e11a2b67cef9c95a59/src/ui/guided-platform.tsx
- [P3] Legacy presentation, spending method: https://github.com/nidcyj-haXqer-3disti/etail-depot-member-commerce/blob/54e38a1aee392fefcb2341e11a2b67cef9c95a59/src/ui/platform.tsx
- [P4] Existing issuing application service: https://github.com/nidcyj-haXqer-3disti/etail-depot-member-commerce/blob/54e38a1aee392fefcb2341e11a2b67cef9c95a59/src/application/spending.ts
- [P5] Existing permission helper: https://github.com/nidcyj-haXqer-3disti/etail-depot-member-commerce/blob/54e38a1aee392fefcb2341e11a2b67cef9c95a59/src/auth/security.ts
- [P6] Supplied `Master_AI_Agent_Prompt_Netlify_Member_Commerce_Platform.md`, sections 2–3, 6, 13–14, 17, 25 and 28; extracted from the user's original build package. Project rules take precedence over example-provider practices.

### Public American Express documentation

Reviewed 8 September 2026. Sources are product documentation, not internal backend specifications.

- [A1] Additional Card Member FAQs: https://www.americanexpress.com/en-us/support/additional-card-member/faqs/
- [A2] Account Manager: https://global.americanexpress.com/card-benefits/detail/account-manager/open-benefits
- [A3] Employee Cards: https://www.americanexpress.com/en-us/business/blueprint/help-center/business-card/employee-cards/index.shtml
- [A4] Merchant Payments Support Center: https://www.americanexpress.com/us/merchant/support-center/payments.html
- [A5] Merchant Manage Locations: https://www.americanexpress.com/us/merchant/support-center/account-services/manage-locations.html
- [A6] Employee-card versus virtual-card control semantics: https://www.americanexpress.com/en-us/business/blueprint/help-center/business-card/virtual-card/faq.how-are-the-limits-and-controls-i-set-on-my-employee-card-different-than-limits-and-controls-i-set-for-my-virtual-card.html
