# MASTER AI-AGENT BUILD PROMPT
## Netlify Member Commerce Platform
### Full customer website, member application, management operating system, wholesale-partner portal, public API, database, and provider-adapter architecture

---

## 0. Your role and execution mandate

Act as an autonomous, senior cross-functional delivery team comprising:

- Group Product Manager
- Principal Technical Product Manager
- Staff Product Designer
- Staff Full-Stack Engineer
- Staff Platform Engineer
- Payments Product Architect
- Data Architect
- Security Engineer
- QA / Test Automation Lead
- DevOps / Netlify Deployment Lead

Your job is to **build the working product**, not merely produce mockups, diagrams, recommendations, or a product requirements document.

Deliver a production-shaped, fully functioning **Netlify deployment** with:

1. A public marketing and pricing website.
2. A responsive customer/member web application.
3. An installable mobile-ready PWA.
4. Public guest-payment pages.
5. A management and operations console.
6. A wholesale-partner portal.
7. A versioned REST API with OpenAPI documentation.
8. A relational database, migrations, seeds, and auditable financial records.
9. Working mock PayFac and issuer providers.
10. Clean provider interfaces for future real PayFac and issuer APIs.
11. Background jobs, webhooks, notifications, audit logs, and operational cases.
12. Automated tests and Netlify deployment configuration.

Do not stop at a static frontend. Do not leave core flows as `TODO`, hardcoded screenshots, disconnected buttons, or JSON-only prototypes. The application must persist state in the database and execute the workflows described below.

When information is not explicitly specified, make a commercially reasonable, security-conscious decision, record it in `docs/decision-log.md`, and continue. Do not block delivery by repeatedly asking questions.

---

# 1. Required source material and source-of-truth order

Use these attached files as product foundations:

1. `Select_Premier_Customer_Service_Lifecycle.xlsx`
2. `Select_Premier_Management_Enterprise_Cost_Model.xlsx`

Use this priority when sources conflict:

1. **This master prompt**
2. The latest customer workbook
3. The latest management cost-model workbook
4. Earlier project notes only as background

Important conflict resolution:

- Both Select and Premier have the **same 0.50% base cashback**.
- Premier does **not** have a 1.00% base cashback.
- Premier may earn an **additional 0.50% spending bonus**, subject to the shared Premier Bonus cap.
- Any older document or cell that says otherwise is superseded.

Before coding, inspect both workbooks and write a concise mapping in:

- `docs/source-mapping.md`
- `docs/decision-log.md`

Map workbook concepts to application modules, database entities, routes, API resources, and acceptance tests.

---

# 2. Product thesis

Build a **member commerce platform** around one verified person.

The same member can manage three financial contexts:

- **Personal** — the member's own private activity.
- **Household** — activity shared with named people through explicit permissions.
- **Seller** — approved commercial activity and records.

The same membership supports four customer services:

- **Get Paid**
- **Pay & Spend**
- **Share & Control**
- **Help & Resolve**

The same relationship follows a clear lifecycle:

- **Join**
- **Verify**
- **Activate**
- **Use**
- **Manage**
- **Renew or Exit**

Customer-facing structure:

> **One membership. Three workspaces. Four services. One clear lifecycle.**

Management structure:

> **Membership defines entitlement. Workspaces define context. Services define customer outcomes. Playbooks deliver the services. Cases handle exceptions. A shared data model connects everything. Economics measures the result.**

This is a modular monolith for the first production version. Do not split it into premature microservices. Keep module boundaries clean so provider adapters and high-volume workers can later be extracted.

---

# 3. Immutable commercial rules

## 3.1 No free membership tier

There are exactly two active membership plans at launch:

### Select

- Annual membership: **$120**
- Personal: included
- Household: included
- Seller: included, subject to approval
- Domestic online card processing: **2.90% + $0.30 per customer payment**
- Base cashback: **0.50% of eligible purchases**
- Member support
- Initial 60-day membership-fee refund window

### Premier

- Annual membership: **$300**
- Same product access as Select
- Domestic online card processing:
  - actual card-brand costs passed through
  - plus **0.50% + $0.30 per customer payment**
- Base cashback: **0.50% of eligible purchases**
- Additional spending bonus: **0.50% of eligible purchases**
- Processing-fee bonus: **20% of eligible Premier provider fees**
- The two additional Premier bonuses share **one $300 cap per membership year**
- Priority support
- Initial 60-day membership-fee refund window

Premier provides additional economics and service priority. It does not unlock essential security, Personal, Household, Seller, or ordinary operational capabilities withheld from Select.

## 3.2 Pricing formulas

Use decimal-safe money and rate calculations. Never use binary JavaScript floating-point arithmetic for posted financial values.

Let:

- `V` = annual eligible seller sales volume
- `N` = annual eligible settled customer-payment count
- `S` = annual eligible purchases through approved Personal, Household, and Seller spending accounts
- `C` = actual annual card-brand costs for Premier seller payments
- all amounts are in USD for launch

Select processing charge:

```text
select_processing = 0.029 × V + 0.30 × N
```

Premier provider fee:

```text
premier_provider_fee = 0.005 × V + 0.30 × N
```

Premier processing charge:

```text
premier_processing = C + premier_provider_fee
```

Base cashback for either plan:

```text
base_cashback = 0.005 × S
```

Premier additional spending bonus before cap:

```text
premier_spending_bonus_before_cap = 0.005 × S
```

Premier provider-fee bonus before cap:

```text
premier_fee_bonus_before_cap = 0.20 × premier_provider_fee
```

Combined Premier Bonus:

```text
premier_bonus = min(
  300,
  premier_spending_bonus_before_cap + premier_fee_bonus_before_cap
)
```

Customer net annual cost:

```text
select_net_cost =
  120
  + select_processing
  - base_cashback
```

```text
premier_net_cost =
  300
  + premier_processing
  - base_cashback
  - premier_bonus
```

Use a configuration table so future approved commercial changes do not require code changes.

## 3.3 Reward rules

Base cashback:

- 0.50% for both plans.
- Accrues on eligible settled purchases.
- Post monthly in the mock implementation.
- Reverses proportionally when a purchase is reversed or refunded.

Premier Bonus:

- The spending and provider-fee sources share one $300 membership-year cap.
- Track each source separately internally.
- Display one combined bonus to the customer.
- Show accrued, pending, reversed, credited, and remaining-cap amounts.
- Credit the annual bonus within 30 days after membership-year end in the mock lifecycle.
- Renewal must not be required to receive an already-earned bonus.
- On upgrade during a membership year, prorate the bonus cap to the remaining period.
- Downgrade becomes effective at renewal unless management applies an approved exception.
- Prevent a cap reset through repeated upgrade/downgrade actions.

Exclude from rewards:

- transfers
- collateral deposits
- repayments
- cash-like transactions
- refunded or reversed purchases
- fees
- artificial self-payments
- circular household transfers
- any provider-defined ineligible merchant categories

## 3.4 Guest payer rule

A customer paying a member Seller:

- does not need membership
- does not need a platform account
- may use a public payment link or invoice checkout
- receives a receipt and public payment status
- must not see member, household, or management data

Guest checkout is not a free membership tier.

---

# 4. Customer and operational personas

Implement role-based and relationship-based access for the following personas.

## Customer-side roles

- Guest payer
- Primary member
- Household co-manager
- Household adult participant
- Supervised child or teen participant
- Independent adult household participant
- Seller owner
- Seller administrator
- Seller spender
- Seller accounting viewer

## Partner-side roles

- Partner owner
- Partner administrator
- Partner operations user
- Partner finance analyst
- Partner developer
- Partner read-only analyst

## Management roles

- Customer-support agent
- Membership operations agent
- Seller operations agent
- Payments operations agent
- Issuing operations agent
- Risk analyst
- Compliance analyst
- Dispute specialist
- Finance analyst
- Partner operations manager
- Product administrator
- Platform administrator
- Super administrator

Use Netlify Identity only for authentication and coarse global roles. Store resource-level relationships and permissions in Postgres.

Do not authorize access merely because a user has a broad JWT role. Every data access must also confirm the user is related to the specific member, household, Seller, partner, account, case, or transaction.

---

# 5. Product information architecture

## 5.1 Public website

Build these public pages:

- `/`
- `/membership`
- `/how-it-works`
- `/personal`
- `/household`
- `/seller`
- `/get-paid`
- `/pay-and-spend`
- `/security`
- `/help`
- `/pricing`
- `/legal/terms`
- `/legal/privacy`
- `/legal/rewards`
- `/legal/seller`
- `/legal/spending`
- `/status`
- `/api-docs`

Required homepage language:

```text
One membership. Three workspaces.

Personal. Household. Seller.

Get paid. Pay & spend. Share & control. Help & resolve.
```

Do not market "cards" as the primary product category. Customer copy should use:

- spending access
- physical payment access
- virtual payment access
- payment credentials
- purpose-based access

Use "card" only where legally or technically necessary.

## 5.2 Customer application

Authenticated routes:

- `/app`
- `/app/home`
- `/app/membership`
- `/app/lifecycle`
- `/app/value`
- `/app/rewards`
- `/app/personal`
- `/app/household`
- `/app/seller`
- `/app/services`
- `/app/get-paid`
- `/app/pay-and-spend`
- `/app/share-and-control`
- `/app/help`
- `/app/cases`
- `/app/notifications`
- `/app/documents`
- `/app/settings`
- `/app/security`

Use a workspace switcher:

- Personal
- Household
- Seller

Use a service launcher:

- Get Paid
- Pay & Spend
- Share & Control
- Help & Resolve

Always show:

- current membership
- current workspace
- active service status
- next action
- relevant balances or totals
- open cases or requirements
- value received
- clear privacy boundary

## 5.3 Guest-payment experience

Public routes:

- `/pay/[slug]`
- `/invoice/[publicId]`
- `/receipt/[publicId]`

Support in mock mode:

- payment link
- QR representation
- invoice checkout
- payment success
- payment failure
- receipt
- refund status
- payment-status lookup using a public token

## 5.4 Management console

Routes:

- `/manage`
- `/manage/command-center`
- `/manage/value-streams`
- `/manage/customer-lifecycle`
- `/manage/service-portfolio`
- `/manage/operations`
- `/manage/members`
- `/manage/households`
- `/manage/sellers`
- `/manage/payments`
- `/manage/payouts`
- `/manage/disputes`
- `/manage/spending`
- `/manage/rewards`
- `/manage/cases`
- `/manage/economics`
- `/manage/cost-drivers`
- `/manage/rate-cards`
- `/manage/cost-center`
- `/manage/partners`
- `/manage/integrations`
- `/manage/audit`
- `/manage/settings`
- `/manage/feature-flags`

The management landing page must mirror the current Command Center concept:

- customer scenario
- Select customer cost
- Premier customer cost
- customer saving
- Select contribution
- Premier contribution
- cost basis
- cost completeness
- missing rate lines
- value-stream status
- open operational queues
- provider-adapter health

## 5.5 Partner portal

Routes:

- `/partner`
- `/partner/program`
- `/partner/branding`
- `/partner/customers`
- `/partner/onboarding`
- `/partner/pricing`
- `/partner/economics`
- `/partner/statements`
- `/partner/invoices`
- `/partner/api-keys`
- `/partner/webhooks`
- `/partner/support`
- `/partner/settings`

---

# 6. Workspace behavior

## 6.1 Personal

Customer promise:

> Your own activity, private by default.

### Get Paid: Quick Sell

After acceptance verification, a member can:

- create one-time payment links
- create QR checkout
- add a short item or service description
- set amount and expiration
- receive a receipt
- issue a basic refund
- see simple sales history
- tag related expenses

The verified primary member is the Seller.

Quick Sell is not anonymous person-to-person money movement. Every commercial payment must be recorded as a sale for an approved Seller identity.

### Pay & Spend

In mock issuer mode:

- apply for secured consumer pay-in-full access
- view requirements and application state
- add refundable collateral
- receive an approved spending amount
- create physical or virtual payment access
- use merchant- or subscription-specific credentials
- freeze and unfreeze access
- set alerts and limits
- view purchases, receipts, statement, reward accrual, and repayment
- pay the statement in full on the configured consumer schedule

Do not force daily automatic repayment on the consumer product.

## 6.2 Household

Customer promise:

> Shared by permission, without sharing everything.

Support:

- household creation
- invite and acceptance
- owner
- co-manager
- adult participant
- independent adult participant
- supervised child or teen
- explicit data visibility
- budgets
- allowances
- per-person limits
- merchant/category controls
- instant access freeze
- activity by person and shared budget

### Household-assisted selling

A Household may help a named Seller:

- share the approved Seller's payment link
- view activity when permission allows
- help issue a refund when delegated
- help manage simple seller tasks

The Household is never an anonymous merchant identity.

For a child or teen seller use case:

- an approved parent or guardian owns and manages the Seller relationship
- the guardian controls payout destination, refunds, disputes, required information, and records
- the minor cannot independently activate a Seller profile at launch

### Household spending

Adults may receive authorized access to an approved owner's account.

Children and teens use a funded supervised balance at launch:

- no independent credit application
- no independent borrowing obligation
- guardian sets amount, limits, and controls
- no credit repayment bill for the supervised participant

Household access does not create more spending capacity. It allocates an existing approved amount or a separately funded balance.

## 6.3 Seller

Customer promise:

> Run ongoing commerce and keep commercial activity organized.

Support:

- Seller application for an individual, sole proprietor, or business
- KYC / KYB requirement collection
- ownership and role records
- status and missing requirements
- payment links
- QR checkout
- invoices
- deposits
- recurring payment schedules
- mock online checkout
- mock Tap to Pay / POS capability flag
- payments
- refunds
- disputes
- payouts
- reserves and availability states
- receipts
- expenses
- accounting categories
- reconciliation
- team roles and approvals
- exportable statements

### Seller spending

In mock issuer mode:

- separate secured commercial charge account
- pledged cash and, when the adapter supports it, eligible available Seller funds
- daily full repayment at launch
- no revolving balance
- owner, administrator, spender, and viewer roles
- vendor controls
- merchant category controls
- country controls
- per-transaction and period limits
- project and department budgets
- virtual credentials
- single-use credentials
- receipt collection
- accounting coding

Pending seller sales, reserves, refunds, and disputed funds must never be counted as available spending funds.

---

# 7. Service and lifecycle model

Implement this hierarchy:

- Business capability
- Business service
- Service offering
- Customer entitlement / subscription
- Service instance / financial account
- Workflow / playbook
- Case / task
- Vendor service

Seed these business services:

- Membership
- Get Paid
- Pay & Spend
- Share & Control
- Help & Resolve
- Reward & Retain

Seed these service offerings:

- Select Membership
- Premier Membership
- Quick Sell
- Household Seller Support
- Full Seller Acceptance
- Personal Spend
- Household Spend
- Seller Spend
- Household Permissions
- Seller Roles & Policies
- Payment & Payout Support
- Dispute / Complaint
- Value Statement
- Wholesale Partner Program

## Lifecycle stages

Customer lifecycle:

- Discover
- Join
- Verify
- Activate
- Use
- Grow
- Support
- Renew or Exit

Service lifecycle:

- Requested
- Information Required
- In Review
- Approved
- Configuring
- Active
- Limited
- Suspended
- Closing
- Closed

Every application and service page must show:

- current stage
- current status
- responsible party
- next action
- deadline or SLA when relevant
- related account or service
- activity history

---

# 8. Required state machines

Use explicit enums and transition guards. Do not rely on free-form status strings.

## Membership

```text
DRAFT
PENDING_PAYMENT
ACTIVE
PAST_DUE
SUSPENDED
CANCEL_AT_PERIOD_END
ENDED
```

## Seller profile

```text
DRAFT
SUBMITTED
NEEDS_INFORMATION
IN_REVIEW
APPROVED
ACTIVE
RESTRICTED
SUSPENDED
REJECTED
CLOSING
CLOSED
```

## Payment link

```text
DRAFT
ACTIVE
EXPIRED
PAUSED
COMPLETED
CANCELED
```

## Invoice

```text
DRAFT
SENT
VIEWED
PARTIALLY_PAID
PAID
OVERDUE
VOID
REFUNDED
```

## Payment

```text
CREATED
REQUIRES_ACTION
AUTHORIZED
CAPTURED
SETTLED
FAILED
PARTIALLY_REFUNDED
REFUNDED
DISPUTED
CHARGEBACK
REVERSED
```

## Payout

```text
PENDING
AVAILABLE
IN_TRANSIT
PAID
FAILED
RETURNED
HELD
CANCELED
```

## Spending account

```text
DRAFT
SUBMITTED
NEEDS_INFORMATION
IN_REVIEW
APPROVED
ACTIVE
FROZEN
RESTRICTED
SUSPENDED
CLOSING
CLOSED
```

## Payment credential

```text
PENDING
ACTIVE
FROZEN
REPLACED
CANCELED
EXPIRED
```

## Authorization

```text
RECEIVED
APPROVED
DECLINED
REVERSED
CLEARED
```

## Reward

```text
PENDING
EARNED
REVERSED
CREDITED
FORFEITED
```

Do not use `FORFEITED` for an earned Premier Bonus merely because the membership does not renew.

## Case

```text
NEW
TRIAGE
WORKING
WAITING_CUSTOMER
WAITING_PARTNER
WAITING_INTERNAL
RESOLVED
CLOSED
REOPENED
```

## Partner program

```text
DRAFT
DUE_DILIGENCE
CONTRACTING
SANDBOX
PILOT
LIVE
SUSPENDED
ENDING
ENDED
```

---

# 9. Management operating model

## 9.1 Command Center

Show:

- customer economics
- company economics
- current scenario
- plan comparison
- value-stream health
- open work
- cost completeness
- missing rate lines
- PayFac adapter state
- issuer adapter state
- webhook failures
- jobs in retry or dead-letter
- cases near SLA
- risk or compliance work awaiting action

## 9.2 Value Streams

Seed:

- Attract & Join
- Verify & Activate
- Get Paid
- Pay & Spend
- Serve & Protect
- Reward & Retain
- Use

For each value stream show:

- customer outcome
- process stages
- owner
- service offerings
- key metrics
- cost
- contribution where relevant
- open cases
- SLA health
- process variant / exception count

## 9.3 Customer Lifecycle

Provide unified search and profile view across:

- member
- membership
- household
- Seller profiles
- service entitlements
- spending accounts
- payments
- payouts
- rewards
- cases
- documents
- consents
- audit history

## 9.4 Operations Workspace

Provide queues and saved views for:

- membership onboarding
- Seller onboarding
- personal spending application
- Seller spending application
- household participant request
- payment inquiry
- payout inquiry
- refund
- acquiring dispute
- issuing dispute
- fraud review
- compliance review
- complaint
- renewal
- cancellation
- partner onboarding

Every case must have:

- type
- priority
- status
- member / Seller / partner context
- owner
- SLA
- related transaction or account
- activity timeline
- tasks
- internal notes
- customer-visible messages
- attachments
- resolution code
- audit trail

## 9.5 Service Portfolio

Management can view and edit:

- capabilities
- business services
- service offerings
- plan entitlement
- availability
- approval requirement
- support commitment
- feature flag
- PayFac capability requirement
- issuer capability requirement
- related cost centers and cost drivers

---

# 10. Cost and economics engine

Reproduce the management workbook's structure in the application.

## 10.1 Cost dimensions

Every cost line must include:

- cost ID
- cost center
- engine
- value stream
- cost group
- workspace
- service offering
- cost element
- vendor or internal owner
- driver ID
- driver unit
- planning rate
- contracted rate
- actual rate
- enabled flag
- source / basis
- notes
- effective date
- expiration date
- currency

Engines:

- Membership
- PayFac
- Issuing
- Shared
- Partner

Cost centers:

- Membership Ops
- Growth & Retention
- Seller Ops & Risk
- Issuing Ops & Risk
- Customer Service
- Technology & Data
- Compliance & Finance
- Partner & Channel
- Future

Cost groups:

- Vendor & processing
- Risk & loss
- Funding & liquidity
- Labor & support
- Technology & data
- Compliance & legal
- Membership benefits
- Partner & channel
- Future cost

## 10.2 Rate bases

Support three mutually exclusive bases:

- Planning
- Contracted
- Actual

Rules:

- Do not mix bases automatically.
- Contracted does not silently fall back to Planning.
- Actual does not silently fall back to Contracted or Planning.
- A missing active rate contributes zero to the calculation but must be visibly marked missing.
- Do not allow commercial approval while required cost lines are missing unless an authorized user records a documented override.

## 10.3 Cost drivers

Seed all cost drivers from the management workbook, including:

- memberships
- member months
- membership revenue
- renewal events
- new members
- household participants
- participant months
- Seller profiles
- Seller profile months
- sales volume
- settled payments
- authorization attempts
- refunds
- acquiring disputes
- payouts
- KYC / KYB checks
- review hours
- support hours by engine
- ACH volume and transactions
- instant payout volume and events
- hardware units
- eligible purchases
- purchase transactions
- purchase authorization attempts
- personal and Seller spending accounts
- account months
- physical credentials
- virtual credentials
- wallet tokens
- replacements
- issuing disputes
- statements
- average funded receivable
- collateral balance
- compliance hours
- finance / reconciliation hours
- complaints
- internal user months
- partner members
- partner provider-fee revenue
- partner issuer income
- partner support hours
- partner programs

## 10.4 Cost formula

```text
annual_cost =
  driver_quantity_for_plan
  × active_rate_for_selected_basis
```

Roll up cost by:

- plan
- engine
- cost center
- value stream
- cost group
- workspace
- service offering
- vendor
- period

Cost completeness:

```text
enabled lines with a non-missing active rate
÷
all enabled lines
```

Show:

- enabled lines
- missing lines
- Planning lines
- Contracted lines
- Actual lines
- disabled optional lines
- cost completeness percentage

## 10.5 Seed planning case and regression values

For this fixture:

- annual sales: **$100,000**
- customer payments: **1,000**
- eligible purchases: **$24,000**
- card-brand costs: **1.90%**
- purchase mix:
  - Personal 50%
  - Household 25%
  - Seller 25%

Customer values must equal:

- Select customer net cost: **$3,200**
- Premier customer net cost: **$2,600**
- Premier customer saving: **$600**

Using the seeded Planning rates from the management workbook, the system must reproduce within one cent:

- Select modeled operating cost: **$968.8336866137948**
- Premier modeled operating cost: **$982.6970199471282**
- Select contribution: **$667.1663133862053**
- Premier contribution: **$53.30298005287182**
- Premier contribution change: approximately **-$613.8633333333335**
- enabled cost lines: **60**
- missing active Planning rate lines: **25**
- cost completeness: **58.33333333333333%**

These are regression fixtures, not validated forecasts.

## 10.6 Prebuilt future cost capacity

Include disabled rate-card rows for:

- ACH
- instant payouts
- hardware
- international payments
- FX
- tax reporting
- lending
- collections
- additional physical credentials
- paper statements
- identity monitoring
- insurance
- partner revenue shares
- partner minimums
- co-brand implementation
- white-label support
- reseller billing
- partner marketing funds
- generic future costs

---

# 11. Wholesale partner program

Support four program models:

## Direct

- platform owns and bills the member
- partner may refer
- partner commission can be fixed, per-active-member, or revenue share

## Referral / distribution

- platform contracts with and bills the member
- partner owns the distribution channel
- configurable referral and ongoing commissions

## Wholesale reseller

- platform bills the partner
- partner sets or applies end-customer pricing
- partner may own first-line support
- partner economics and customer economics must remain separate

## Embedded / co-branded

- configurable ownership of:
  - branding
  - billing
  - onboarding
  - support
  - rewards
  - risk
  - pricing
  - revenue sharing
  - customer communications

Partner-program fields:

- partner
- program type
- brand configuration
- status
- available plans
- available services
- jurisdiction
- customer scope
- support responsibility
- risk responsibility
- fee ownership
- membership pricing
- PayFac pricing
- issuing revenue-share basis
- partner commission
- program minimum
- settlement schedule
- statement schedule
- API scopes
- webhook endpoints
- effective dates
- approval history

Revenue-share bases must explicitly distinguish:

- membership fee
- gross provider fee
- net provider fee after processor costs
- gross issuer income
- net issuer income received by the platform
- per-active-member amount
- per-active-Seller amount
- fixed implementation fee
- support fee

Provide three views for the same activity:

1. End-customer economics
2. Partner economics
3. Platform economics

Do not count the same revenue share or supplier cost twice.

Partner portal features:

- partner onboarding
- due-diligence checklist
- program configuration
- branding preview
- customer list
- onboarding status
- pricing and revenue-share view
- monthly statement
- invoice
- payout or amount due
- support cases
- API keys
- webhook endpoint management
- sandbox event simulator
- CSV export

---

# 12. Provider adapter architecture

Use ports-and-adapters / hexagonal architecture.

No domain or UI module may import a real provider SDK directly.

Directory shape:

```text
src/integrations/payfac/
  payfac-adapter.ts
  payfac-types.ts
  payfac-capabilities.ts
  mock-payfac-adapter.ts
  provider-registry.ts

src/integrations/issuer/
  issuer-adapter.ts
  issuer-types.ts
  issuer-capabilities.ts
  mock-issuer-adapter.ts
  provider-registry.ts
```

Provider selection:

```text
PAYFAC_PROVIDER=mock
ISSUER_PROVIDER=mock
ENABLE_REAL_MONEY=false
```

The shipped system must be fully usable in mock mode.

## 12.1 PayFac adapter contract

Implement at minimum:

```ts
interface PayFacAdapter {
  capabilities(): Promise<PayFacCapabilities>;

  createSellerProfile(input: CreateSellerInput): Promise<ProviderSeller>;
  updateSellerProfile(input: UpdateSellerInput): Promise<ProviderSeller>;
  getSellerRequirements(providerSellerId: string): Promise<Requirement[]>;
  getSellerStatus(providerSellerId: string): Promise<ProviderSellerStatus>;

  createPaymentLink(input: CreatePaymentLinkInput): Promise<ProviderPaymentLink>;
  expirePaymentLink(providerLinkId: string): Promise<void>;

  createInvoice(input: CreateInvoiceInput): Promise<ProviderInvoice>;
  sendInvoice(providerInvoiceId: string): Promise<void>;
  voidInvoice(providerInvoiceId: string): Promise<void>;

  createPaymentIntent(input: CreatePaymentIntentInput): Promise<ProviderPaymentIntent>;
  capturePayment(providerPaymentId: string, amount?: Money): Promise<ProviderPayment>;
  getPayment(providerPaymentId: string): Promise<ProviderPayment>;
  refundPayment(input: RefundPaymentInput): Promise<ProviderRefund>;

  createPayout(input: CreatePayoutInput): Promise<ProviderPayout>;
  getPayout(providerPayoutId: string): Promise<ProviderPayout>;

  getDispute(providerDisputeId: string): Promise<ProviderDispute>;
  submitDisputeEvidence(input: SubmitDisputeEvidenceInput): Promise<ProviderDispute>;

  estimateCardBrandCost(input: CostEstimateInput): Promise<CardBrandCostEstimate>;

  verifyWebhook(request: Request): Promise<VerifiedWebhook>;
  normalizeWebhook(event: VerifiedWebhook): Promise<NormalizedPayFacEvent>;
}
```

PayFac capability flags:

- payment links
- QR checkout
- invoices
- recurring payments
- online checkout
- Tap to Pay
- terminals
- ACH
- instant payouts
- partial refunds
- disputes
- reserves
- itemized card-brand cost data
- delegated Seller access

Mock PayFac behavior:

- configurable approval outcomes
- configurable requirements
- simulated payment success/failure
- simulated settlement delay
- simulated payout
- partial and full refund
- dispute creation and resolution
- duplicate webhook delivery
- out-of-order webhook delivery
- provider-fee and card-brand cost breakdown
- public checkout flow

## 12.2 Issuer adapter contract

Implement at minimum:

```ts
interface IssuerAdapter {
  capabilities(): Promise<IssuerCapabilities>;

  createConsumerApplicant(input: ConsumerApplicantInput): Promise<ProviderApplicant>;
  createCommercialApplicant(input: CommercialApplicantInput): Promise<ProviderApplicant>;
  getRequirements(providerApplicantId: string): Promise<Requirement[]>;
  getApplicationStatus(providerApplicantId: string): Promise<ProviderApplicationStatus>;

  createConsumerAccount(input: CreateConsumerAccountInput): Promise<ProviderSpendingAccount>;
  createCommercialAccount(input: CreateCommercialAccountInput): Promise<ProviderSpendingAccount>;
  getAccount(providerAccountId: string): Promise<ProviderSpendingAccount>;

  updateCollateral(input: CollateralUpdateInput): Promise<ProviderCollateralState>;
  getAvailableAmount(providerAccountId: string): Promise<Money>;

  createCredential(input: CreateCredentialInput): Promise<ProviderCredential>;
  freezeCredential(providerCredentialId: string): Promise<void>;
  unfreezeCredential(providerCredentialId: string): Promise<void>;
  replaceCredential(input: ReplaceCredentialInput): Promise<ProviderCredential>;
  cancelCredential(providerCredentialId: string): Promise<void>;

  setSpendingControls(input: SpendingControlsInput): Promise<ProviderControls>;
  getSpendingControls(providerAccountId: string): Promise<ProviderControls>;

  getAuthorization(providerAuthorizationId: string): Promise<ProviderAuthorization>;
  getPurchase(providerPurchaseId: string): Promise<ProviderPurchase>;

  createRepayment(input: CreateRepaymentInput): Promise<ProviderRepayment>;
  getStatement(providerAccountId: string, period: DateRange): Promise<ProviderStatement>;

  createDispute(input: CreateIssuingDisputeInput): Promise<ProviderIssuingDispute>;
  getDispute(providerDisputeId: string): Promise<ProviderIssuingDispute>;

  verifyWebhook(request: Request): Promise<VerifiedWebhook>;
  normalizeWebhook(event: VerifiedWebhook): Promise<NormalizedIssuerEvent>;
}
```

Issuer capability flags:

- consumer secured pay-in-full
- commercial secured charge
- authorized adults
- supervised youth funded access
- physical credentials
- virtual credentials
- single-use credentials
- wallet provisioning
- real-time authorization controls
- merchant controls
- category controls
- country controls
- velocity controls
- dynamic funding
- collateral
- daily repayment
- statement repayment
- disputes
- credit reporting

Mock issuer behavior:

- configurable approval and requirements
- collateral deposit and release
- available amount
- physical and virtual credential creation
- authorization simulator
- decline reason simulator
- clearing and reversal
- statement generation
- daily Seller repayment
- consumer statement repayment
- dispute lifecycle
- reward-eligible and ineligible transactions
- duplicate and out-of-order webhooks

## 12.3 Provider object mapping

Create an internal mapping table:

- provider
- provider object type
- provider object ID
- internal object type
- internal object ID
- current provider version
- raw event reference
- created / updated timestamps

Store normalized events and a redacted raw payload for audit. Never store secrets in raw payloads.

---

# 13. Financial ledger and invariants

Implement an append-only double-entry ledger.

Tables:

- ledger accounts
- journal entries
- journal lines
- balance snapshots

Separate ledgers or account categories for:

- Personal funds
- Household funds
- Seller receivables
- Seller available funds
- Seller reserves
- Seller payouts
- consumer collateral
- commercial collateral
- consumer spending obligation
- commercial spending obligation
- repayment
- card-brand cost
- provider fee
- processor cost
- issuer income
- base reward liability
- Premier Bonus liability
- partner payable
- platform cash / clearing
- dispute and loss reserve

Invariants:

- every posted journal entry balances
- money is stored in integer minor units or exact decimal types
- currency is explicit
- posted journal lines are immutable
- corrections use reversing entries
- no cross-workspace movement without an explicit authorized transaction
- pending sales, reserves, disputed funds, and collateral are not double-counted
- collateral is never revenue
- rewards already earned are liabilities until credited or reversed
- provider webhooks are idempotent
- one provider event cannot post the same financial effect twice

Provide ledger-reconciliation jobs and a management reconciliation view.

---

# 14. Database architecture

Use **Netlify Database**, a managed Postgres database.

Use:

- `@netlify/database`
- Drizzle ORM
- SQL migrations in `netlify/database/migrations/`
- deploy-preview database branches
- seed scripts
- transactional writes
- Postgres constraints and indexes
- row-level security where practical
- application-level relationship checks in every service

Core tables should include at minimum:

## Identity and member

- users
- member_profiles
- member_security_settings
- memberships
- membership_periods
- membership_changes
- terms_versions
- terms_acceptances
- consents
- notifications
- notification_preferences

## Service catalog and entitlements

- business_capabilities
- business_services
- service_offerings
- plan_entitlements
- service_subscriptions
- feature_flags
- provider_capability_requirements

## Household

- households
- household_members
- household_invites
- household_roles
- household_permissions
- household_budgets
- household_budget_members
- household_allowances

## Seller and PayFac

- seller_profiles
- seller_owners
- seller_team_members
- seller_applications
- seller_requirements
- seller_agreements
- seller_payout_accounts
- payment_links
- invoices
- invoice_items
- payment_intents
- payments
- payment_events
- processor_fee_breakdowns
- refunds
- disputes
- dispute_evidence
- payouts
- seller_reserves

## Issuing and spending

- spending_applications
- spending_accounts
- account_participants
- collateral_accounts
- collateral_events
- payment_credentials
- spending_controls
- authorizations
- purchases
- purchase_events
- statements
- statement_items
- repayments
- issuing_disputes

## Rewards and value

- reward_rules
- reward_periods
- reward_accruals
- reward_reversals
- reward_credits
- premier_bonus_periods
- value_statements

## Operations

- cases
- case_tasks
- case_messages
- case_attachments
- case_state_history
- sla_policies
- sla_instances
- queue_definitions
- work_assignments
- complaints

## Cost and economics

- cost_scenarios
- cost_centers
- cost_elements
- cost_drivers
- cost_driver_values
- rate_cards
- rate_card_versions
- cost_allocations
- cost_results
- vendor_contracts
- contribution_snapshots

## Partners

- partners
- partner_users
- partner_programs
- partner_branding
- partner_service_entitlements
- partner_pricing_rules
- partner_revenue_share_rules
- partner_customers
- partner_api_keys
- partner_webhook_endpoints
- partner_statements
- partner_statement_lines
- partner_invoices
- partner_settlements

## Platform and integrations

- provider_object_mappings
- webhook_events
- webhook_attempts
- idempotency_keys
- outbox_events
- background_jobs
- dead_letter_jobs
- audit_logs
- documents
- export_jobs

Use UTC timestamps. Use UUID or ULID primary keys. Use public opaque IDs for URLs.

---

# 15. API requirements

Create a versioned REST API under `/api/v1`.

Generate and publish OpenAPI 3.1 documentation at `/api-docs`.

Use:

- Zod schemas
- typed request and response DTOs
- cursor pagination
- `application/problem+json` errors
- request IDs
- idempotency
- HMAC-signed partner webhooks
- scoped partner API keys
- consistent authorization middleware

Require `Idempotency-Key` on money-impacting POST endpoints.

## Public endpoints

- `GET /api/v1/public/plans`
- `POST /api/v1/public/value-estimates`
- `GET /api/v1/public/payment-links/:slug`
- `POST /api/v1/public/payment-links/:slug/checkout`
- `GET /api/v1/public/invoices/:publicId`
- `POST /api/v1/public/invoices/:publicId/pay`
- `GET /api/v1/public/receipts/:publicId`

## Member endpoints

- `/api/v1/me`
- `/api/v1/membership`
- `/api/v1/membership/upgrade`
- `/api/v1/membership/cancel`
- `/api/v1/households`
- `/api/v1/households/:id/invites`
- `/api/v1/households/:id/members`
- `/api/v1/households/:id/budgets`
- `/api/v1/sellers`
- `/api/v1/sellers/:id/application`
- `/api/v1/sellers/:id/payment-links`
- `/api/v1/sellers/:id/invoices`
- `/api/v1/sellers/:id/payments`
- `/api/v1/sellers/:id/payouts`
- `/api/v1/sellers/:id/disputes`
- `/api/v1/spending-applications`
- `/api/v1/spending-accounts`
- `/api/v1/spending-accounts/:id/credentials`
- `/api/v1/spending-accounts/:id/controls`
- `/api/v1/spending-accounts/:id/transactions`
- `/api/v1/spending-accounts/:id/repayments`
- `/api/v1/rewards`
- `/api/v1/value-statements`
- `/api/v1/cases`
- `/api/v1/documents`

## Management endpoints

- `/api/v1/manage/members`
- `/api/v1/manage/households`
- `/api/v1/manage/sellers`
- `/api/v1/manage/applications`
- `/api/v1/manage/payments`
- `/api/v1/manage/payouts`
- `/api/v1/manage/disputes`
- `/api/v1/manage/spending`
- `/api/v1/manage/rewards`
- `/api/v1/manage/cases`
- `/api/v1/manage/queues`
- `/api/v1/manage/cost-scenarios`
- `/api/v1/manage/cost-drivers`
- `/api/v1/manage/rate-cards`
- `/api/v1/manage/cost-results`
- `/api/v1/manage/partners`
- `/api/v1/manage/integrations`
- `/api/v1/manage/audit`

## Partner endpoints

- `/api/v1/partner/program`
- `/api/v1/partner/customers`
- `/api/v1/partner/onboarding`
- `/api/v1/partner/pricing`
- `/api/v1/partner/statements`
- `/api/v1/partner/invoices`
- `/api/v1/partner/api-keys`
- `/api/v1/partner/webhooks`
- `/api/v1/partner/cases`

## Provider webhooks

- `/api/webhooks/payfac/:provider`
- `/api/webhooks/issuer/:provider`

Webhook requirements:

- verify signature before processing
- store event before applying effects
- unique provider event ID
- acknowledge quickly
- queue normalized processing
- retry safely
- record attempts
- dead-letter after configured retries
- support replay from management
- tolerate out-of-order events

---

# 16. Netlify implementation architecture

Use the current stable versions supported by Netlify at build time.

Required stack:

- Next.js App Router
- React
- TypeScript in strict mode
- Tailwind CSS
- accessible component library such as shadcn/ui
- Netlify OpenNext adapter, automatically applied
- Netlify Database / Postgres
- Drizzle ORM
- Netlify Functions
- Netlify Background Functions
- Netlify Scheduled Functions
- Netlify Blobs
- Netlify Identity
- Netlify Secrets Controller
- pnpm
- Zod
- Decimal.js or an equivalent exact-decimal library
- Vitest
- Playwright

Do not pin an obsolete Next.js runtime plugin. Use Netlify's current OpenNext support.

## Function responsibilities

Use synchronous Netlify Functions or Next.js route handlers for:

- reads
- short writes
- validation
- customer actions requiring immediate response

Use Background Functions for:

- provider webhook processing
- reward batch calculations
- statement generation
- reconciliation
- large exports
- notification batches
- partner statement generation
- replaying dead-letter events

Use Scheduled Functions only as short dispatchers because scheduled executions have a shorter limit. A scheduled function should identify due work, enqueue it, and invoke a background worker.

Suggested jobs:

- daily reward accrual check
- daily repayment-status check
- daily stale-case escalation
- nightly cost rollup
- nightly ledger reconciliation
- monthly statement creation
- annual Premier Bonus credit
- membership renewal reminders
- webhook retry dispatcher

## Netlify Blobs

Use Blobs only for:

- case attachments
- receipts
- generated statements
- generated exports
- redacted provider payload archives

Do not use Blobs as the relational system of record or financial ledger.

Use opaque keys, validate file type and size, and authorize every download.

## Netlify Identity

Use server-side login, signup, logout, and current-user verification.

Use coarse global roles in identity claims:

- member
- partner
- operations
- admin

Store granular permissions in Postgres.

Use CSRF origin verification for server-side auth mutations.

Add application-level step-up authentication using WebAuthn or TOTP for:

- changing payout bank details
- changing repayment details
- creating a co-manager
- issuing sensitive new physical access
- changing collateral instructions
- rotating partner API keys
- management privilege elevation
- replaying provider events
- approving commercial exceptions

## Secrets

Store secrets only in Netlify environment variables marked as secret:

- database access
- auth secrets
- PayFac adapter keys
- issuer adapter keys
- webhook secrets
- encryption keys
- email-provider credentials
- observability keys

Provide `.env.example` with names only.

## Security controls

Configure:

- Content Security Policy
- secure headers
- HSTS in production
- CSRF protection
- rate limits on login, public checkout, API keys, and webhook endpoints
- WAF / firewall rules where available
- no caching of authenticated financial responses
- redaction of secrets and sensitive PII in logs
- dependency scanning
- secret scanning

---

# 17. Authentication, privacy, and security boundaries

Do not store:

- raw PAN
- CVV
- full bank-account credentials
- raw SSN
- raw identity-document numbers when a provider token can be stored instead

Store only:

- provider token
- last four where needed
- status
- requirement state
- audit reference
- encrypted minimal PII required by the application

Encrypt sensitive application fields with an application encryption key stored in Netlify Secrets Controller.

Implement:

- audit log for every privileged action
- before/after value for controlled admin changes
- actor
- reason
- IP / request ID
- timestamp
- related resource
- exportable audit report

Privacy rules:

- Personal activity private by default
- Household users see only explicitly shared activity
- Seller activity separate from Personal and Household
- partner users see only partner-authorized customers and programs
- support users receive least-privilege access
- sensitive fields are masked by role

Do not claim PCI, SOC, banking, lending, or regulatory certification. State that the implementation is production-shaped but requires provider, bank, legal, security, and compliance approval before live financial use.

---

# 18. Background-job architecture

Implement a Postgres-backed job and outbox system.

Tables:

- outbox_events
- background_jobs
- job_attempts
- dead_letter_jobs

Job properties:

- unique job ID
- job type
- related resource
- payload
- scheduled time
- priority
- status
- attempt count
- maximum attempts
- lease owner
- lease expiration
- idempotency key
- last error
- created / updated / completed time

Use transactional outbox:

- domain write and outbox event commit in the same database transaction
- background worker claims jobs with a lease
- duplicate execution is safe
- failed jobs retry with backoff
- unrecoverable jobs move to dead-letter
- management can inspect and replay with an audited reason

---

# 19. Notifications

Implement:

- in-app notifications
- email notifications through Netlify Email Integration or a configured email provider
- local console transport for development
- version-controlled email templates

Required notifications:

- welcome
- email confirmation
- household invite
- Seller information needed
- Seller approved or rejected
- spending application information needed
- spending access active
- payment received
- payment failed
- refund issued
- payout sent or failed
- dispute opened
- action required
- case update
- statement ready
- reward credited
- Premier cap nearing limit
- renewal reminder
- cancellation confirmation
- partner program status

Do not put full sensitive transaction details into email.

---

# 20. Mobile-ready product

Deliver a responsive PWA, not a separate native application.

Requirements:

- installable manifest
- mobile navigation
- touch-friendly controls
- safe-area support
- responsive tables converted to cards
- mobile camera upload for receipts
- QR presentation and scan handoff
- biometric-capable step-up through WebAuthn where supported
- accessible loading and error states
- offline shell for non-sensitive static content
- no offline financial writes
- no caching of authenticated API responses in the service worker
- API designed so native iOS and Android applications can be added later without replacing the backend

---

# 21. UX and design system

Use the workbook's clean visual language:

- teal primary
- navy operational headings
- light teal success / linked information
- amber for value or attention
- pale yellow for unconfirmed assumptions
- blue input fields in management
- green linked calculations
- red only for risk, failure, or missing critical inputs

Customer design principles:

- plain language
- progressive disclosure
- show one next action
- avoid internal terms such as PayFac, BIN sponsor, interchange share, or rate card in customer navigation
- explain card-brand costs in plain language
- show privacy and responsibility boundaries
- show status and expected next step
- show value received

Management design principles:

- role-based landing pages
- saved filters
- queue counts
- status chips
- drill-down from KPI to records
- bulk actions only when safe
- explicit confirmation for high-risk actions
- visible cost basis and completeness
- data export
- immutable audit trail

Meet WCAG 2.2 AA.

---

# 22. Analytics and event taxonomy

Create a typed domain-event taxonomy.

Examples:

- `member.created`
- `membership.selected`
- `membership.activated`
- `membership.upgraded`
- `membership.cancel_requested`
- `household.created`
- `household.invite_sent`
- `household.member_activated`
- `seller.application_submitted`
- `seller.information_requested`
- `seller.approved`
- `payment_link.created`
- `payment.succeeded`
- `payment.failed`
- `refund.succeeded`
- `dispute.opened`
- `payout.paid`
- `spending.application_submitted`
- `spending.account_activated`
- `credential.created`
- `authorization.approved`
- `authorization.declined`
- `purchase.settled`
- `repayment.succeeded`
- `reward.earned`
- `reward.reversed`
- `premier_bonus.credited`
- `case.created`
- `case.resolved`
- `partner.program_live`
- `cost.rate_updated`
- `cost.scenario_changed`

Do not send financial PII to third-party analytics.

Store first-party product analytics in Postgres or privacy-safe logs sufficient to calculate:

- conversion
- activation time
- time to first payment
- time to first purchase
- payment success
- payout SLA
- purchase approval
- fraud and loss
- support resolution
- reward utilization
- cross-service adoption
- renewal
- contribution

---

# 23. Repository structure

Use a single modular repository.

Suggested structure:

```text
app/
  (marketing)/
  (auth)/
  app/
  manage/
  partner/
  pay/
  invoice/
  receipt/
  api/
src/
  modules/
    identity/
    membership/
    household/
    seller/
    payfac/
    issuing/
    rewards/
    ledger/
    cases/
    partners/
    cost/
    notifications/
    audit/
  domain/
  application/
  infrastructure/
  integrations/
    payfac/
    issuer/
  auth/
  db/
  api/
  ui/
  lib/
netlify/
  functions/
    payfac-webhook.mts
    issuer-webhook.mts
    job-worker.mts
    scheduled-dispatch.mts
    statement-generator.mts
    export-generator.mts
  database/
    migrations/
  emails/
public/
docs/
  product-requirements.md
  architecture.md
  data-model.md
  api.md
  provider-adapters.md
  security.md
  operations.md
  cost-model.md
  partner-program.md
  deployment.md
  source-mapping.md
  decision-log.md
tests/
  unit/
  integration/
  contract/
  e2e/
openapi/
  openapi.yaml
netlify.toml
.env.example
README.md
```

Use dependency boundaries so:

- UI calls application services or API clients
- application services call domain modules
- domain modules do not import Netlify or provider SDKs
- infrastructure implements repositories and adapters
- provider SDKs are isolated to adapter implementations

---

# 24. Seed data and demo users

Provide deterministic seed data.

Suggested demo identities:

- `select.member@example.test`
- `premier.member@example.test`
- `household.owner@example.test`
- `seller.owner@example.test`
- `partner.admin@example.test`
- `support.agent@example.test`
- `payments.ops@example.test`
- `issuing.ops@example.test`
- `finance.analyst@example.test`
- `platform.admin@example.test`

Create a development-only seed/login method. Do not ship fixed production passwords.

Seed:

- Select and Premier plans
- service catalog
- value streams
- lifecycle stages
- roles
- permissions
- demo household
- demo Seller
- payment link
- invoice
- payments
- payout
- spending accounts
- virtual credentials
- purchases
- reward accruals
- open and resolved cases
- partner program
- cost centers
- cost drivers
- management workbook's rate-card rows
- current planning scenario

Provide a management event simulator for mock PayFac and issuer events.

The simulator must be disabled in production unless:

```text
ENABLE_SANDBOX_SIMULATOR=true
```

---

# 25. Testing requirements

Use:

- Vitest for unit tests
- integration tests against local Netlify Database / Postgres
- Playwright for end-to-end tests
- contract tests for both adapters
- migration tests
- authorization tests
- accessibility checks
- API schema validation

Required tests:

## Commercial regression

- exact Select formula
- exact Premier formula
- common 0.50% base cashback
- Premier shared cap
- spending-only cap
- fee-only cap
- mixed bonus
- reward reversal
- upgrade proration
- no cap reset abuse
- default fixture outputs

## Access and privacy

- Personal records not visible to unrelated household adults
- Household participant sees only granted data
- supervised participant cannot create credit
- household helper cannot change Seller payout unless permitted
- Seller accounting viewer cannot spend
- partner user cannot access another partner
- support agent cannot perform finance-admin actions
- audit created for every privileged action

## PayFac

- Quick Sell
- full Seller
- guest payer
- payment success and failure
- duplicate webhook
- out-of-order webhook
- partial refund
- dispute
- payout
- reserve / unavailable funds
- self-payment abuse flag

## Issuing

- consumer application
- commercial application
- collateral update
- credential creation
- authorization approval and decline
- purchase clearing and reversal
- consumer repayment
- daily Seller repayment
- reward eligibility
- issuing dispute
- duplicate webhook
- pending Seller funds excluded from spend capacity

## Cost engine

- Planning, Contracted, and Actual do not mix
- missing rates remain visible
- disabled rows do not contribute
- driver × rate formula
- engine totals reconcile
- value-stream totals reconcile
- cost-center totals reconcile
- cost-group totals reconcile
- default workbook regression
- partner rows remain zero until enabled

## Cases and operations

- SLA created
- status transition guard
- assignment
- waiting state
- escalation
- resolution
- reopen
- attachment authorization
- customer-visible versus internal messages

## API

- OpenAPI schema matches implementation
- idempotency keys
- cursor pagination
- problem-details errors
- HMAC partner webhook
- rate limits
- role and resource authorization

E2E happy paths:

1. Join Select.
2. Upgrade to Premier.
3. Create Household and invite an adult.
4. Add a supervised participant.
5. Activate Quick Sell.
6. Create a payment link.
7. Complete guest checkout.
8. Receive mock payout.
9. Activate full Seller.
10. Create and pay an invoice.
11. Apply for Personal spending.
12. Add collateral.
13. Create virtual access.
14. Simulate a purchase.
15. See base reward and Premier accrual.
16. Apply for Seller spending.
17. Add a Seller spender and vendor limit.
18. Create a support case.
19. Resolve it in management.
20. Change cost basis and confirm management calculations.
21. Create a wholesale partner program and issue an API key.

---

# 26. Netlify configuration and deployment

Create:

- `netlify.toml`
- current Node LTS pin
- pnpm configuration
- Netlify Database setup
- database migrations
- local database seed
- environment variables
- redirects and headers
- function configuration
- scheduled-function configuration
- background-function configuration
- CSP
- rate limiting where supported

Local commands must work:

```bash
pnpm install
netlify database init
pnpm db:migrate
pnpm db:seed
netlify dev
pnpm test
pnpm test:e2e
pnpm build
netlify build
```

Provide:

- deploy-preview support
- database branch support
- migration safety
- production seed separation
- backup and restore notes
- rollback notes
- secrets setup
- custom-domain instructions

If `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` are available, deploy and return the live URL.

If credentials are not available:

- do not invent a URL
- still deliver a deploy-ready repository
- run `netlify build`
- provide exact deploy commands

---

# 27. Operational safeguards

Implement:

- feature flags
- adapter health checks
- webhook replay
- dead-letter queue
- maintenance mode
- provider outage banners
- safe retry
- duplicate-event detection
- immutable financial records
- cost-scenario locking
- two-person approval option for:
  - payout bank change
  - high-value refund
  - collateral release
  - reward adjustment
  - rate-card override
  - partner revenue-share change
  - provider event replay
- reason codes for manual overrides
- exportable audit history

Never let a management user silently modify a settled payment, posted journal entry, credited reward, or completed payout. Use adjustment or reversal records.

---

# 28. Non-goals and prohibited shortcuts

Do not:

- process real money in the shipped mock configuration
- store PAN or CVV
- store raw SSN when provider references suffice
- use one undifferentiated account for Personal, Household, and Seller
- make a Household an anonymous merchant
- allow minors to independently activate Seller at launch
- treat collateral as revenue
- reuse pending or reserved Seller funds
- double-count PayFac and issuer economics
- double-charge bundled vendor services
- hide missing vendor costs as confirmed zero
- mix Planning, Contracted, and Actual rates
- make customer processing savings depend on using the platform's spending product
- call the product merely a "card app"
- expose management cost data to customers
- expose one partner's data to another partner
- create a frontend-only prototype
- leave core buttons nonfunctional
- use a public Blob URL without authorization
- cache sensitive authenticated responses
- claim regulatory certification

---

# 29. Required final deliverables

Deliver all of the following:

1. Working source repository.
2. Netlify-deployable application.
3. Public website.
4. Customer/member app.
5. Guest checkout.
6. Management console.
7. Partner portal.
8. Versioned REST API.
9. OpenAPI 3.1 file and rendered docs.
10. Netlify Database migrations.
11. Deterministic seed data.
12. Mock PayFac adapter.
13. Mock issuer adapter.
14. Adapter interfaces and contract tests.
15. Double-entry ledger.
16. Reward and Premier Bonus engine.
17. Cost drivers, rate cards, and cost center.
18. Planning / Contracted / Actual scenarios.
19. Case and operations system.
20. Background jobs and webhook processing.
21. Audit logs.
22. PWA.
23. Unit, integration, contract, and E2E tests.
24. `README.md`.
25. Architecture and data-model documentation.
26. Security and operational-runbook documentation.
27. `.env.example`.
28. Deployment instructions.
29. Test report.
30. Final implementation summary that includes:
    - live URL or exact deploy command
    - demo users
    - modules completed
    - tests passed
    - known external dependencies
    - issuer adapter readiness
    - PayFac adapter readiness
    - remaining business decisions
    - no unreported unfinished core flow

---

# 30. Definition of done

The project is complete only when:

- a new user can join Select or Premier
- membership is persisted
- customer can understand Membership → Workspace → Service → Lifecycle
- customer can activate mock Seller services
- guest can complete a mock payment
- customer can activate mock Personal and Seller spending
- Household roles and supervised access work
- rewards and cap calculations are correct
- cases flow from customer to management
- management can operate queues
- management can switch cost basis
- cost completeness is visible
- partner program works in sandbox
- API documentation is generated
- all key writes are audited
- duplicate webhooks are safe
- financial ledger entries balance
- all specified tests pass
- the application builds with `netlify build`
- the repository can be deployed without rewriting the architecture

---

# 31. Start execution

Begin by:

1. Reading the two workbook inputs.
2. Creating `docs/source-mapping.md`.
3. Creating `docs/architecture.md` and `docs/decision-log.md`.
4. Scaffolding the Netlify Next.js application.
5. Provisioning or initializing Netlify Database.
6. Creating migrations and seed data.
7. Implementing authentication and authorization.
8. Implementing the shared service catalog, lifecycle, and case foundations.
9. Implementing membership and pricing.
10. Implementing mock PayFac and issuer adapters.
11. Implementing customer, management, and partner workflows.
12. Implementing ledger, rewards, cost engine, jobs, tests, and deployment.
13. Running all tests and `netlify build`.
14. Deploying when credentials exist.
15. Returning the finished system and implementation report.

Do not stop after planning. Build it.
