# Amex 360° business review: issuing, account control and merchant operations

Review date: 2026-09-08. This review follows the user's correction to focus on product behavior, operating workflows, management responsibilities and customer experience.

## Main finding

The Amex reference needs to cover the whole relationship: who applies, who is responsible, who can act, how a card or merchant becomes usable, what happens to a purchase, how money is accounted for, how problems are resolved and how the relationship ends. Issuing, account control and merchant operations must work together through those stages.

The earlier 90-task catalog names many individual functions. Several rows need more operating detail, especially employee exit, card replacement and recurring billing, returned repayments, overpayments, missing merchant deposits, partial fulfillment, overlapping refunds/disputes and closure with outstanding work. A screen for each function would not establish a complete service.

This pass reviews the public Amex operating reference and the completeness of Etail's proposed business requirements. It does not certify the current application: the local account/access foundation is still partial and these financial journeys have not been implemented or tested end to end.

The audit contains **85 detailed checks: 24 issuing, 25 account control, 24 merchant operations and 12 connected journeys**. The evidence is documented for 35, partial for 42 and a gap for 8. These labels measure the available reference for each check, not product similarity or implementation completion.

## The complete review perimeter

| Relationship stage | Issuing | Account control | Merchant operations |
|---|---|---|---|
| Choose and qualify | Product suitability, terms, applicant, responsible payer, application, missing information, review or decline | Who may request, approve, supply information or act for someone else | Merchant identity, service provider, application, required information, locations and settlement responsibility |
| Open and prepare | Approval, cardholder onboarding, virtual availability, physical delivery, activation | Invitations, exact authority, information visibility, holder/manager/payer distinctions | Approval, merchant/location setup, contacts, receiving-bank details, staff access and acceptance readiness |
| Use each day | Purchase eligibility, usable amount, pending/posted activity, recurring charges and statements | Limits, alerts, freezes, changes, security checks, account switching and permitted exports | Sale acceptance, receipts, fulfillment, submission, invoices, recurring requests and transaction search |
| Pay and receive | Amount owed, due date, one-time repayment, AutoPay, returned payment and credit balance | Who can pay, who can change a bank, who can see balances and who can approve a change | Expected settlement, fees/deductions, reserves, refunds, net deposit and missing funds |
| Handle exceptions | Declined use, lost/stolen card, delayed delivery, fraud, billing dispute and payment difficulty | Urgent restriction, lost access, conflicting permissions, sensitive change and failed notification | Duplicate/late submission, incorrect amount, partial delivery, dispute response, failed deposit and shortfall |
| Change the relationship | Replacement, renewal, product change, contact change and card/account cancellation | Role change, additional holder removal, employee exit, reporting access and responsible-party review | Bank/location/legal-detail changes, business transfer or closure, remaining settlement/dispute work |
| Complete and review | Correct final charge, repayment, refund, statement and accessible history | All intended access removed, needed records retained and remaining responsibility explicit | Final reconciled deposit/adjustment, evidence of case outcome and a responsible contact for unresolved work |

Every detailed check asks: **who starts; what they need; who decides; what each party sees; what can go wrong; who takes over; what proves completion.** Customer, administrator, support and merchant views are considered together. Mobile usability, accessible information and clear help remain part of the operating review.

## Detailed findings by business area

| Review | Contents |
|---|---|
| [Issuing 360](ISSUING_360.md) | Application through delivery, activation, use, repayment, replacement, cancellation and servicing; normal and exception paths. |
| [Account control 360](ACCOUNT_CONTROL_360.md) | Product-specific authority matrix; delegation, spending, visibility, payment/bank powers, revocation and life-event gaps. |
| [Merchant operations 360](MERCHANT_360.md) | Onboarding through acceptance, settlement, deposits, refunds, disputes, reporting, changes and closure. |
| [Connected business walkthroughs](cross-domain-360-checks.json) | Twelve scenarios that require all relevant parties to reach a consistent result. |

The companion review files carry exact source and check IDs. Each check identifies the relationship to the earlier comparison catalog, the remaining Etail business detail and an acceptance scenario. A cited comparison row means related scope; it does not mean the full new scenario was already covered or implemented.

## Findings that change the product review

### 1. Approval, possession, responsibility and authority need separate answers

The product must tell a requester whether they are waiting for an applicant, a company/guardian approver, an issuing decision, delivery or activation. It must also name who is responsible for payment and who is simply allowed to spend or manage. Read the program-specific issuing and control matrices before giving any person an action. An Amex Personal additional card, a Business employee card and a Corporate program role cannot be treated as the same arrangement.

**Etail business requirement:** the review of a card request shows the account, intended holder, responsible party, funding arrangement, approver where applicable and initial controls. A Manager role alone must not imply spending, issuing, refund or payout authority. Exactly PERSONAL, HOUSEHOLD and SELLER remain the account types.

Employee exit illustrates the operational detail: Amex's @ Work guide describes different removal timing for portal access and reporting, including continuing scheduled emails during the reporting transition. Etail therefore needs an exit review that includes report recipients and notifications as well as people and cards. [C06 — @ Work Access Center](https://www.americanexpress.com/en-us/business/resource-center/atwork-access-center/index.html)

### 2. One amount labelled “balance” is insufficient

Amex distinguishes statement, remaining statement and total balances. These definitions account differently for subsequent payments, returned payments, credits and disputes. [B05 — balance definitions](https://www.americanexpress.com/us/customer-service/faq.balance-details.html)

**Etail business requirement:** explain amount owed, due amount, pending purchases, backed spending capacity and available merchant funds separately. Apply Etail's pay-in-full and supervised-funding rules. The review must show what a refund or returned payment changes, which amount is still due and whose responsibility it is.

### 3. Issuing controls must explain their practical limits

A cardholder needs to understand the difference between pausing a card, replacing it, cancelling it, stopping a merchant subscription and closing the account. The detailed reviews record the program-specific Amex behavior and evidence gaps.

**Etail business requirement:** each action previews its effect on future purchases, recurring commitments, existing charges and refunds. Show who must take any remaining action. The customer should not discover an unpaid subscription or continuing charge through a surprise statement.

### 4. Recognizable activity and refund visibility are part of dispute prevention

Amex's public merchant learning hub connects recognizable business names and receipts with fewer recognition questions, and describes showing a refund while it is pending. It also distinguishes merchant inquiries from upfront chargebacks and directs provider-served merchants to their Merchant Services Provider. [B01 — merchant disputes learning hub](https://www.americanexpress.com/us/merchant/tpp/manage-disputes.html)

**Etail business requirement:** a transaction should explain the merchant, order or payment purpose, amount, date, status and available receipt. A refund should have its own visible progress. Merchant response work must identify the right provider, requested evidence, reply deadline and financial effect. Do not promise a refund merely because a case was opened.

### 5. Fraud help and an ordinary purchase complaint need different routes

The US dispute FAQ recommends merchant contact for a billing dispute and provides a transaction-linked dispute entry. The security center offers direct help for suspected fraud. [B03 — dispute a charge](https://www.americanexpress.com/us/customer-service/faq.dispute-a-charge.html), [I16 — security help](https://www.americanexpress.com/en-us/security/)

**Etail business requirement:** offer recognition help, merchant problem/dispute and suspected fraud as understandable choices. Do not delay protective support by requiring the customer to negotiate with a possibly fraudulent merchant. Preserve the transaction context when moving into help.

### 6. Payment problems need a servicing journey

Amex documents returned-payment handling and conditional re-presentation. It separately describes possible assistance for financial difficulty, including implications for card use. A credit-balance refund also has its own account-specific request route. [B04 — returned payments](https://www.americanexpress.com/us/customer-service/faq.returned-payment-insufficient-funds.html), [B06 — payment assistance](https://www.americanexpress.com/us/customer-service/faq.financial-struggles-payment-accommodation.html), [B02 — credit-balance refund](https://www.americanexpress.com/us/customer-service/faq.credit-balance-refund.html)

**Etail business requirement:** provide returned/failed payment explanations, clear remaining obligations, an authorized recovery action and a human-help route. Overpayment return, multiple funders, hardship and closed-account credit require explicit product decisions. Amex's fees, retry counts, relief programs and lending terms are not adopted as Etail rules.

### 7. “Case closed” must explain the money outcome

Amex exposes dispute status, document submission, draft editing and closure actions, and separately gives general expectations for resolution time. Those expectations are not the merchant's reply deadline. [B07 — dispute status](https://www.americanexpress.com/us/customer-service/faq.dispute-status.html), [B08 — resolution timing](https://www.americanexpress.com/us/customer-service/faq.resolve-dispute-case.html)

**Etail business requirement:** show whether the case is waiting on the customer, merchant, reviewer or an actual financial adjustment. Explain the final charge/refund separately from the case result. The operator must recognize an existing refund before approving another credit.

## Twelve connected walkthroughs to review before claiming completeness

These are proposed Etail acceptance walkthroughs. Amex evidence is classified within each record; no walkthrough is claimed as an executed application test.

| Scenario | The complete business outcome |
|---|---|
| X360-01 — Employee leaves with pending purchases | Access, cards and report recipients are reviewed separately; the responsible account still handles outstanding activity. |
| X360-02 — Company approval, unfinished issuance | Every participant sees the real outstanding step; company approval is not presented as a usable card. |
| X360-03 — Frozen/replaced card and subscription | Customer knows which card action applies and which merchant cancellation action remains. |
| X360-04 — Successful purchase, missing merchant funds | Merchant can identify submission, settlement, deductions and bank-deposit progress and the team handling the gap. |
| X360-05 — Partial delivery and partial refund | Both sides can explain the fulfilled amount, refunded amount and remaining issue. |
| X360-06 — Refund during an open dispute | Existing credits and the claim are reconciled so the customer is not credited twice. |
| X360-07 — Bank change with funds in flight | Pending/effective destination and each affected deposit remain understandable. |
| X360-08 — Returned bill repayment | Current obligation, possible further attempt and assistance route are explicit. |
| X360-09 — Credit balance during closure | Entitled recipient and outstanding checks are established; a late credit remains recoverable. |
| X360-10 — Unfamiliar charge | Recognition help, billing dispute and urgent fraud protection are separate usable routes. |
| X360-11 — Supervised participant becomes an adult | Privacy, funding and permission changes are reviewed; no automatic borrowing or transfer of another person's activity. |
| X360-12 — Merchant closes with open cases | Remaining refunds, disputes, held funds and expected deposits retain an owner and a completion path. |

## Management operations to include in every area

An operator needs a usable work queue, not only totals. For each unresolved item, show the affected customer/account/merchant, issue, current stage, responsible person or team, age, deadline where established, documents needed, permitted next action and the result expected from that action. Show customer-facing progress separately from internal notes.

The business review should inspect these queues: applications awaiting information or approval; card delivery/activation problems; permission and sensitive-change requests; returned repayments and credit-balance requests; expected deposits not received; refunds waiting for completion; merchant disputes approaching a reply deadline; and closures with outstanding work. Formal complaints need a separate escalation owner and jurisdiction-specific process.

Reporting should answer operational questions: Which approvals are stuck? Which cards or people should lose access? Which obligations are overdue? Which merchant deposits do not reconcile? Which disputes need a response today? Which closure cannot finish, and why? A report that identifies a problem should let an authorized person reach the relevant case.

## Decisions and evidence gaps that remain visible

| Gap | Required resolution |
|---|---|
| Product/program differences | Confirm the exact Amex reference program for each behavior and retain Etail's own three account types and economic rules. |
| Conflicting delegation guidance | Resolve applicable product/channel and current terms; do not expand powers based on the more permissive summary. |
| Complete employee/manager exit | Specify access removal, card treatment, reports, messages and responsibility for existing activity as one review. |
| Overpayment or late credit after closure | Specify recipient entitlement, original funding checks, expected progress and escalation. |
| Returned payment and assistance | Specify recovery, user notices, any allowed future attempt and permitted support action without inventing fees or relief. |
| Merchant bank-change timing | Specify which instructions use old versus new details and how failed deposits are investigated. |
| Reserves, shortfalls and closure tail | Establish program-specific terms and responsible service routes; public portal guides do not provide every release/collection rule. |
| Household transition and responsible-party changes | Make the Etail-specific policy explicit; another Amex card program is not a complete substitute. |
| Complaints and exceptional life events | Verify jurisdiction, required representative evidence and escalation process. Public contact information alone does not prove the full procedure. |
| Current signed-in experience | Validate each role's actual task, next action, failure recovery and accessible/mobile presentation when an authorized demonstration or Etail implementation is available. |

The existing questions about rounding, membership-year dates, shared reward attribution and Household backing (D14–D17) remain unresolved for their affected business rules. No Amex fee, liability, age, automatic-unfreeze or lending policy silently decides them.

## What “90%+ like Amex” should demonstrate

A person can finish the relevant task, sees only the appropriate information, understands the result, can recover when something goes wrong and can get effective help. An administrator and a merchant should see consistent consequences of that same task. This should be demonstrated for normal, pending, declined, failed, changed and closed states on supported devices.

The earlier 90-task benchmark remains preserved for comparison. This 360° audit adds explicit operational depth and exposes gaps; it does not award a similarity score. Before claiming the target, review the detailed checks, resolve applicable product differences and demonstrate the connected journeys against actual working behavior.

## What to complete first

1. **Responsibility and authority:** finish the business matrix for owner, responsible payer, holder, approver, manager, Seller staff and support. Include invitations, sensitive changes, removal and unfinished obligations.
2. **One complete ordinary cycle:** follow a card request through usable spending, a recognizable purchase, merchant settlement and cardholder repayment. Each participant must understand their next action and the money outcome.
3. **The exception and exit cycle:** exercise the twelve connected walkthroughs, beginning with employee exit, missing deposits and refunds during disputes. Resolve the policy gaps before promising a completion date, release of funds or final closure.

This order completes the operating model while keeping the three areas connected. It is a recommendation for the next review and implementation sequence; no new commercial policy is approved here.

Source registers: [issuing](issuing-360-sources.json), [account control](account-control-360-sources.json), [merchant operations](merchant-360-sources.json), [cross-party guidance](business-360-sources.json). Review checks: [issuing](issuing-360-checks.json), [control](account-control-360-checks.json), [merchant](merchant-360-checks.json), [cross-party](cross-domain-360-checks.json). [Review evidence and limitations](BUSINESS_360_VALIDATION.md).
