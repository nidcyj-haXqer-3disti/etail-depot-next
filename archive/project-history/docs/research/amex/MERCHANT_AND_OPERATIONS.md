# Amex merchant and operations reference for Etail Depot

Research date: 8 September 2026. This study uses 30 public American Express sources actually read, catalogued in [merchant-sources.json](merchant-sources.json). It extends [the initial assessment](../../AMEX_WORKFLOW_ASSESSMENT.md) against [Etail workflows](../../WORKFLOWS.md) and [the domain specification](../../DATABASE_AND_DOMAIN.md).

## Scope and evidence rules

American Express is the primary behavioral reference for Seller servicing, payments reporting and disputes. The sources concern the U.S. Merchant website unless explicitly marked otherwise. OptBlue, direct merchant acceptance and a PayFac's sponsorship relationship are separate programs. Public direct-merchant portal behavior does not prove identical features are available through an OptBlue processor.

**Observed** below means explicitly described in public documentation; no authenticated merchant account was inspected. **Proposed** means an Etail implementation decision derived from the behavior and our existing invariants. Public documentation does not reveal Amex's internal tables, services, locking, event delivery or complete operator tools. Research coverage is not working-product parity. A 90% target needs a frozen, relevant comparison inventory and implemented acceptance evidence; this document alone establishes neither.

Unless a source has an explicit date, its publication/version is unknown; the access date is not a publication date. Some search results and tracking-parameter URLs contained older cached versions or failed. Canonical pages were retried where necessary and only successfully read sources count. No private portal, enrollment, contractual acceptance, real payment, account change or external write was performed.

## Observed merchant experience

| Area | Observed Amex behavior | Consequence to evaluate for Etail |
|---|---|---|
| Payments navigation | Separate settlement, submission, transaction, adjustment and report views; authorization information sits in additional options. Newly enrolled users may wait for data. [M01](https://www.americanexpress.com/us/merchant/support-center/payments/explore-payments-default-view.html) | One Seller activity entry point with distinct financial stages and explicit data-readiness state. |
| Settlements | Pending/posted views expand into deductions, paid-to-bank amounts and transaction detail, with downloadable breakdowns. [M02](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-settlements.html?intlink=merchant-supportcenterhp-payments-viewingyoursettlements) | Trace expected and confirmed payouts back to immutable components. |
| Submissions | Rows associate submission/invoice and settlement references with charges, credits, deductions, counts and distinct submitting/payee locations. [M03](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-submissions.html?intlink=merchant-supportcenter-paymentshp-viewingyoursubmissions) | Preserve merchant, location, batch and destination identities separately. |
| Submission search | Filters include invoice reference, amount range/type, date basis and payee/submitter location; exports can reflect revised filter choices. [M04](https://www.americanexpress.com/us/merchant/support-center/payments/search-filter-download-submissions.html?intlink=merchant-supportcenter-paymentshp-searchfilterdownloadsubmissions) | Persist and display export filters; authorize every requested location. |
| Drill-down | Expanding a submission exposes transaction detail and additional fee/credit information. [M05](https://www.americanexpress.com/us/merchant/support-center/payments/view-transaction-details-submissions.html?intlink=merchant-supportcenter-paymentshp-viewtransactiondetailsofasubmission) | Use progressive disclosure over one underlying payment record. |
| Transaction search | Location/date filtering, configurable columns and CSV/XLS/PDF downloads are documented. [M06](https://www.americanexpress.com/us/merchant/support-center/payments/view-transactions.html?intlink=merchant-supportcenter-paymentshp-viewtransactions) | Reuse the same authorized query for list and export; provide accessible mobile detail. |
| Adjustments | Adjustments and chargebacks appear separately; a dispute cross-link depends on enrollment in Disputes. [M07](https://www.americanexpress.com/us/merchant/support-center/payments/navigating-adjustments-and-chargeback-data.html?intlink=merchant-supportcenter-paymentshp-navigatingadjustmentsandchargebacks) | A financial deduction and permission to inspect its case are distinct. |
| Adjustment investigation | Search supports adjustment reference, amount, date and locations, with downloads. Amex also documents card-number search. [M08](https://www.americanexpress.com/us/merchant/support-center/payments/search-filter-download-adjustments-and-chargebacks.html?intlink=merchant-supportcenter-paymentshp-searchfilterdownloadadjustmentsandchargebacks) | Etail uses safe transaction/reference IDs; do not import raw-card search into the sandbox. |
| Statements | Select merchant, statement category and monthly/annual period; PDF/XLS downloads. Newly enrolled users' statements begin the following month. [M09](https://www.americanexpress.com/us/merchant/support-center/payments/downloading-e-statements.html?intlink=merchant-supportcenter-paymentshp-downloadingestatements) | Differentiate not-yet-issued statements from an empty period. |
| Report templates | Choose grouping, detail level, format, locations, date range and date basis; name/save/reuse templates. [M10](https://www.americanexpress.com/us/merchant/support-center/payments/downloading-reports.html?intlink=merchant-supportcenter-paymentshp-downloadingreports) | Treat report definition, generated artifact and statement as separate resources. |
| Report library | Scheduled and monthly scheduled downloads appear in a library. [M11](https://www.americanexpress.com/us/merchant/support-center/payments/report-library.html) | Make background export status and retrieval discoverable. |
| Dispute queue | Response Needed, Review in Progress and Closed views; urgent cases first, sorted by expiration. Inquiry precedes debit; chargeback involves debit before evidence. Mixed bulk submissions are separated by case type. [M12](https://www.americanexpress.com/us/merchant/support-center/disputes/disputes-summary-table.html?intlink=merchant-supportcenter-disputeshp-howtousedisputessummarytable) | Queue state, case type and money movement require separate fields. |
| Dispute detail | Deadline, reason/code, distinct disputed/transaction amounts, history and next response action are visible. [M13](https://www.americanexpress.com/us/merchant/support-center/disputes/managing-a-disputes-case.html?intlink=merchant-supportcenterhp-disputes-managingadisputecase) | Let the case explain what happened, who acts next and when. |
| Contesting a claim | Choose a reason, attach evidence, comment, attest and submit. The documented partial-refund option applies to inquiries. [M14](https://www.americanexpress.com/us/merchant/support-center/disputes/disagreeing-with-cm-claim-partial-refund.html?intlink=merchant-supportcenter-disputeshp-disagreeingwithcmclaimpartialrefund) | Offer response choices according to case type and adapter capability. |
| Accepting a claim | The response distinguishes authorizing an Amex chargeback from directly crediting the cardholder. [M15](https://www.americanexpress.com/us/merchant/support-center/disputes/agreeing-with-cm-claim-full-refund.html?intlink=merchant-supportcenter-disputeshp-agreeingwithcmclaimfullrefund) | Selecting a resolution and confirming its financial effect are separate steps. |
| Additional evidence | Open cases can accept documents after a response. Format/size/page limits apply; processing failures are surfaced in the queue. [M16](https://www.americanexpress.com/us/merchant/support-center/disputes/adding-documents-to-a-case.html?intlink=merchant-supportcenter-disputeshp-addingdocumentstoacase) | Uploaded does not mean accepted; persist document processing and retry states. |
| Closed cases | Archived cases remain filterable/exportable; a win/loss report has its own date handling. [M17](https://www.americanexpress.com/us/merchant/support-center/disputes/reviewing-closed-disputes.html?intlink=merchant-supportcenter-disputeshp-reviewingcloseddisputes) | Keep an outcome with its period semantics and historical evidence. |
| Case lookup | Case/charge references and cardholder identifiers can locate a case, which opens into action/detail. [M18](https://www.americanexpress.com/us/merchant/support-center/disputes/searching-for-disputes.html?intlink=merchant-supportcenter-disputeshp-searchingfordisputes) | Etail lookup stays scoped; no customer-wide or raw-PAN discovery. |
| Merchant hierarchy | Primary and dependent Merchant IDs can be expanded; standalone IDs remain separate. Legal name/tax identifier are view-only in the documented account editor. [M19](https://www.americanexpress.com/us/merchant/support-center/account-services/view-and-update-account.html?intlink=merchant-supportcenter-accountserviceshp-viewandupdateaccount) | Model locations within an approved Seller relationship; material legal changes need their own process. |
| Bank changes | Select credit/debit destinations, verify identity with a one-time code, then provide replacement information and confirm. [M20](https://www.americanexpress.com/us/merchant/support-center/account-services/edit-bank-information.html?intlink=merchant-supportcenter-accountserviceshp-editupdatebankinfo) | Sensitive destination changes need step-up, explicit target scope and a result record. |
| New merchant IDs | Eligible users save progress; choose dependent/headquarter/independent relationships; verify business/financial/ownership data; distinguish submitter from payee; receive a request acknowledgment. Some affiliations require support. [M21](https://www.americanexpress.com/us/merchant/support-center/account-services/create-new-merchantid.html) | Use one resumable merchant application with prerequisites and truthful pending status. |
| Batch setup | Multiple IDs can inherit shared headquarters details, with selected sections reviewed per account. [M22](https://www.americanexpress.com/us/merchant/support-center/account-services/create-multiple-merchantid.html) | If later needed, bulk tools invoke the same per-location commands with per-item results. |
| Change tracking | Attempt date, merchant, type/activity and success/failure/pending status form a chronological change log. [M23](https://www.americanexpress.com/us/merchant/support-center/account-services/view-account-updates.html) | Show submitted configuration changes independently from currently effective values. |
| Notifications | Payment, dispute and marketing preferences are separate; enrolled features affect visibility and some destinations can differ. Identity verification protects contact changes. [M24](https://www.americanexpress.com/us/merchant/support-center/account-services/online-account-contact-information-and-alerts.html?intlink=merchant-supportcenter-accountserviceshp-contactinfoalerts) | Separate operational subscriptions, marketing consent and authentication contacts. |
| Locations/access audit | A location lists enrolled online services; an existing accepting location can be added; a user-list report audits access to each merchant. [M25](https://www.americanexpress.com/us/merchant/support-center/account-services/manage-locations.html?intlink=merchant-supportcenter-accountserviceshp-managelocations) | Adding visibility is different from creating/approving a merchant. Provide scoped access reviews. |
| Roles and entitlements | Merchant-site roles and access levels limit different features, including a dispute-only example. [M26](https://www.americanexpress.com/content/dam/amex/us/merchant/pdf/terms-and-conditions.pdf) | Keep Seller administration, money movement, cases, exports and delegation separately granted. |
| Support | Public support separates account, payment and dispute help; authenticated chat and telephone routes have stated hours. [M30](https://www.americanexpress.com/us/merchant/support-center.html) | Contextual help should carry a safe case/operation reference and disclose support availability. |

## Proposed Etail workflow and state model

Everything in this section is a proposed implementation contract, not a reconstruction of Amex internals. Exactly PERSONAL, HOUSEHOLD and SELLER remain the account types. Merchant locations, processor relationships, headquarters and payee mappings are resources beneath a named legal Seller relationship; they are not new account types and cannot grant access to unrelated businesses. Additional location support should be staged after one complete merchant lifecycle, while retaining a schema that can represent it.

### Merchant activation and changes

1. An authorized Seller actor starts or resumes one saved merchant request. It binds Seller account, responsible party, sponsorship, requested service, jurisdiction and provider environment.
2. Collect the minimum fictional sandbox business data; show explicit missing prerequisites and preserve work. Quick Sell opens this same request. Never collect real bank/KYB data in this project.
3. Review scope, destination reference and supplied information; submit a versioned digest with stable business identity.
4. Return request received/pending while a durable operation completes. Proposed application states: `DRAFT`, `NEEDS_INFORMATION`, `SUBMITTED`, `PENDING_REVIEW`, `APPROVED`, `RESTRICTED`, `DECLINED`, `CLOSED`. Actual mock outcomes follow the owning command and event handler.
5. An approved merchant exposes the supported payment-request capability. Restricted merchants retain authorized history/case resolution while new-money actions follow policy.

Configuration changes use `DRAFT → SUBMITTED → PENDING → APPLIED | FAILED | NEEDS_REVIEW`; these are Etail labels. Keep old and proposed values, field-level redaction, actor, version, operation and result references. A bank-change receipt is not proof that a new payout destination is verified or effective. Mock destination tokens and fictional labels replace bank numbers. A later real adapter must define destination-verification, effective-time and in-flight-payout semantics before activation.

### Collection and reconciliation

Use the existing canonical payment request for one-time/reusable links, QR distribution and invoices. The request creates deliberate payment identities, followed by authorization, capture, settlement and payout effects. Source M21's submitter/payee distinction is useful for relationship modeling, but does not authorize Etail to receive third-party funds or become a PayFac.

Proposed reconciled views:

| View | Required meaning | Record ownership |
|---|---|---|
| Payment activity | Original amount/currency, credited/refunded amounts, lifecycle, safe payer reference and request/invoice allocations | Acquiring |
| Settlement components | Captures, refunds, fees, reserve movements and adjustments allocated to one settlement with source references | Acquiring + Ledger posting commands |
| Seller funds | Separate pending, settled, reserved, disputed, pledged and available amounts; no overlapping reuse | Ledger projections |
| Payout | Requested amount, reserved backing, fictional destination, delivery attempts and confirmed result | Acquiring + Integrations |
| Exception | Expected/observed amounts, currency, unmatched references, cause, assigned operator, next action and linked corrections | Cases/Operations |

An expected settlement is computed from included signed components under the agreed fee model. A confirmed payout is reconciled to its payout reservation and provider delivery result. These are different equations and records; a processor deposit can contain multiple settlements, and individual transactions can have several later effects. Do not force a one-payment/one-deposit relationship.

Build candidate tables/relationships only as justified extensions to the normative model: `merchant_locations`, explicit submitter/payee provider mappings, `settlement_components`, `reconciliation_matches`, `reconciliation_exceptions`, `merchant_change_requests`, `report_definitions`, `report_runs`. Retain `payments`, `refunds`, `disputes`, `reserves`, `payouts`, one financial ledger and one integration outbox. These names are proposals, not compiled migrations or claims about Amex.

Every external event passes provider/environment verification and inbox dedupe, then a domain command resolves stable business identity, validates causality and posts a unique financial effect. Matching records are appendable evidence; corrections never rewrite posted journals. Unknown references, contradictory totals and nonmatching currency enter a review queue. A source mismatch must not be hidden by editing the displayed balance.

### Disputes, evidence and refunds

Use separate fields for external case type, work status, resolution, disputed amount, deadline and financial adjustment. A case can await a merchant response after money has already been debited; a submitted response can remain under review. Proposed queue projections can use Amex's understandable Response Needed / Review in Progress / Closed labels without pretending those three values fully model the internal lifecycle.

The command sequence is `ReceiveDispute → PrepareResponse → ValidateEvidence → SubmitResponse → ApplyResponseAcknowledgment → ApplyCaseOutcome`. Refund/chargeback commands remain separately linked to the original payment and case. A choice to refund must reference any existing refund, paid amount and refundable remainder. Acknowledgment preserves a provider reference and next action; closing a case does not itself invent a credit or release a reserve.

Evidence states should distinguish `UPLOADING`, `SCANNING`, `READY`, `REJECTED`, `SUBMISSION_PENDING`, `ACCEPTED`, `PROCESSING_FAILED`. These are Etail engineering choices. Store private blob references, content hashes, validated media type/size and account/case ownership. Render attachments as untrusted content; authorize preview/download every time. MIME/extension mismatch, malware or provider rejection leaves a repairable case with an explicit reason. Do not adopt Amex's file limits as universal; put actual supported limits in the adapter capability contract and show them before upload.

Bulk operations are a later efficiency feature: select only authorized cases, partition by supported response semantics, validate each item and return per-case results. Never turn one checkbox into permission for every case, and never retry successful items as new financial requests.

### Reports and permissions

Report definitions bind account/location scope, amount currency, date field, timezone, interval boundaries, filters, columns, format and version. `report_runs` capture the effective definition, authorized actor, source cutoff, generation status and private artifact. A saved template is a preference, not an authorization token. Re-evaluate access at generation and download; expiration/revocation invalidates access to old artifacts. Avoid embedding confidential fields merely because a user hid their columns in a table.

Use explicit report readiness: never requested, queued, generating, ready, failed, expired, unavailable before enrollment. Show source freshness separately from genuine zero results. CSV/XLSX output must treat spreadsheet formula-looking text as data and preserve money precision. Statement periods remain immutable after issue except for documented amended statements/corrections. Financial calendars and scheduled report execution use separate enablement and idempotency gates.

Proposed action groups for the existing server policy: `merchant.read`, `merchant.apply`, `merchant.settings.change`, `merchant.destination.change`, `payment.read`, `refund.request`, `payout.request`, `dispute.read`, `dispute.respond`, `evidence.upload`, `report.generate`, `report.download`, `access.audit`, `access.delegate`. Role templates may suggest grants; Manager does not automatically obtain payout/refund or unrestricted delegation. A report-only user must not mutate a case. An operator assignment is explicit and audited, not a customer cross-account wildcard.

### Operations queues and recovery

Provide separate saved queue views over owning module records, not a second CRUD/workflow engine:

- Merchant applications and changes: missing information, awaiting review, failed verification, provider timeout.
- Financial reconciliation: missing settlement, unmatched line, duplicate business effect, inconsistent currency, unresolved fees.
- Payout delivery: pending, failed, contradictory delivery result, return after apparent success.
- Disputes: nearing deadline, awaiting evidence repair, submitted without acknowledgment, resolved without reconciled money.
- Report generation: failed, expired or no longer authorized.

Each queue item has a source entity, accountable assignee, age/deadline, reason code, allowed next command, retry policy and safe support reference. Operators correct through the owning command; they cannot directly alter posted amounts or manufacture successful provider responses. A failed worker remains retriable with the same operation identity. Support receives safe identifiers and authorized context, never tokens or full credentials.

## Negative acceptance cases to implement

These are proposed Etail acceptance requirements derived from the above workflows and existing project invariants; none is claimed to have passed.

| ID | Trigger | Required result |
|---|---|---|
| MER-01 | Cardholder or report viewer starts merchant approval/change | Deny without creating an operation; explain an allowed next step. |
| MER-02 | Saved application references another Seller or stale version | Reject scope/version conflict; preserve the legitimate draft. |
| MER-03 | Submit times out and the user retries | Same business operation; pending/reconciliation, no second merchant. |
| MER-04 | Merchant request received but approval not confirmed | Keep collection unavailable; no invented approval. |
| MER-05 | User adds an existing location for visibility | Do not treat enrollment as merchant creation, ownership or service approval. |
| MER-06 | Proposed destination change lacks current step-up | Deny sensitive mutation; existing effective destination stays explicit. |
| MER-07 | Destination changes while a payout is in flight | Payout retains its reviewed destination snapshot; no silent rerouting. |
| MER-08 | Batch contains one unauthorized location | Reject it independently; disclose no data and do not broaden scope. |
| MER-09 | Captured payment is not settled | Exclude it from payout/pledge availability. |
| MER-10 | Payout and commercial pledge compete for the same funds | At most eligible backed commitments succeed under one lock/transaction. |
| MER-11 | Refund and payout race | Do not overspend the Seller's eligible backing; outcome reconciles. |
| MER-12 | Duplicate provider IDs or different IDs describe the same refund | One business effect and one reward/fee reversal as applicable. |
| MER-13 | Settlement has wrong currency or unknown component | Quarantine/review; do not assume exchange or force-match. |
| MER-14 | Payout failure event repeats | Restore only the eligible reservation once. |
| MER-15 | A late genuine debit arrives after account restriction | Record/reconcile the existing financial event; keep new writes restricted. |
| MER-16 | Fee source missing | Display unknown/unconfirmed; never use zero as a confirmed fee. |
| MER-17 | Chargeback case already debited Seller | Show case and debit separately; response submission does not debit again. |
| MER-18 | Case response chooses unsupported partial-refund action | Reject with adapter/case prerequisite; do not generalize inquiry-only behavior. |
| MER-19 | A prior direct refund exists when the dispute arrives | Reconcile it before authorizing any additional customer credit. |
| MER-20 | Evidence upload completes but scanning/provider processing fails | Preserve failure state and replacement path; do not label evidence accepted. |
| MER-21 | Attachment from another case/account is submitted | Deny without leaking filename, content or signed URL. |
| MER-22 | Deadline expires while response form is open | Recheck at submit using server/provider rules and show the actual next step. |
| MER-23 | Bulk request mixes cases and one times out | Per-item results; no duplicate effect for previously successful items. |
| MER-24 | Case is marked closed but money is unmatched | Keep a reconciliation exception; no fictitious refund/reserve release. |
| MER-25 | Report template stores locations the user later loses | Re-evaluate generation and artifact download scope. |
| MER-26 | Hidden UI column includes unauthorized sensitive data | Omit server-side from both response and export. |
| MER-27 | Enrollment/report generation delay produces no rows | Show unavailable/pending state distinct from a zero result. |
| MER-28 | Report date field differs from statement settlement period | Label basis/timezone/cutoff; reconcile with the appropriate period. |
| MER-29 | CSV cell begins with a spreadsheet formula marker | Export as inert text, retaining intended displayed value. |
| MER-30 | Revoked employee follows old report/case links | Deny subsequent access; retain lawful historical audit and provider processing. |
| MER-31 | Case/settlement email points to another account after login | Re-authorize target and preserve safe navigation; no automatic first-account fallback. |
| MER-32 | Account closure has unresolved disputes/refunds/payouts | Block final closure with specific outstanding work; do not delete history. |

## Acquiring integration boundaries

**Observed:** OptBlue providers contract with eligible merchants and set pricing; acceptance can arrive through certified participating channels. The current overview and October 2024 PayFac factsheet contain different merchant-volume figures. This study deliberately imports no threshold or pricing into Etail. [M27 — OptBlue](https://www.americanexpress.com/us/merchant/optblue.html)

**Observed:** Amex's PayFac factsheet describes merchant-of-record/settlement responsibility for program merchants, registration through a certified participant and partner-specified transaction submissions. It is a dated commercial overview, not an executable onboarding/API specification. [M28 — PayFac factsheet](https://www.americanexpress.com/content/dam/amex/us/merchant/pdf/Payment-Facilitator-FactSheet.pdf)

**Observed:** The Integrated Payments Providers Program covers certification/specification support for POS, e-commerce and host capabilities, including authorization, submissions and reconciliation. Company registration includes NDA/terms. [M29 — Provider program](https://network.americanexpress.com/globalnetwork/v4/partners/integrated-payments-providers-program/)

**Proposed:** maintain an acquiring adapter contract with explicit capabilities and separately verified entitlement. Merchant dashboard features, gateway integration, network acquiring and PayFac operation must not be collapsed into one “Amex enabled” flag. Etail remains a mock sandbox with `ENABLE_REAL_MONEY=false`.

**Unknown/private:** applicable markets/legal entity, processor approval, negotiated fees/reserves, settlement SLA/cutoffs, available webhooks/files, signing/replay protocols, program-specific dispute deadlines/reason codes, certification, production credentials and partner liability. Public sources do not support a claim that Etail can already issue or acquire through Amex. Nor do they establish Amex's internal system topology, database schema, transaction-isolation strategy, audit retention, staffing or case decision rules.

## Delivery implications

Retain the implemented account/session/policy foundation. M1 must finish responsibility, accepted participation and granular grants. M4 should deliver one complete Seller application → payment → settlement → refund/dispute → payout/reconciliation slice with the same Ledger and Integrations modules used by issuing. M5 owns the full operator assignment, access-review and reporting work under EDN-021; M6 completes scheduled-report delivery, usability and coverage verification after individual actions work. Bulk efficiency remains staged behind complete single-item commands.

The first comparison walkthrough should cover one Seller with two differently authorized users, a complete payment with deductions, one partial refund, one inquiry, one already-debited chargeback, a rejected evidence attachment, a failed payout and a revoked report permission. Each view must be traceable to its state, command, financial effect and test. This is a bounded route toward strong functional comparability without claiming to reproduce an inaccessible institution's entire platform.
