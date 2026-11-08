# Amex comparison catalog v1

Research date: 2026-09-08. **90 proposed comparison tasks; no task has been certified as implemented by this study.** The machine-readable owner is [amex-comparison.json](../../../planning/amex-comparison.json). These are proposed Etail acceptance criteria, not statements that Amex uses our internals or that every Amex product supports every task.

The [research index](README.md) defines scope, evidence and scoring. Each domain has 18 equal-weight tasks. A completed row needs outcome, role/data scope, interaction/navigation, status/recovery and desktop/mobile/accessibility evidence, including exact implementation SHA. Target: at least 90% overall and per domain, all 71 critical rows, and all 20 mandatory gates. At 18 tasks per domain, the per-domain floor requires at least 17 tasks in each area. No paper design, static screenshot or unsupported button earns completion credit.

Source IDs resolve in [issuing sources](issuing-sources.json), [merchant sources](merchant-sources.json) and [architecture sources](architecture-sources.json). They identify the public starting reference; the acceptance conditions below are Etail engineering proposals. The work remains on the existing EDN issues and milestone dependencies. User-requested feature similarity does not silently adopt foreign pricing, liability or eligibility rules.

## Account control and delegated access

| ID / source | Comparable task | Existing issue | Critical | Proposed acceptance |
|---|---|---|---|---|
| AX-CONTROLS-01 / I10 | Select the intended account or card | EDN-005 | Yes | Selection persists through reload and is visible in every action review; revoked selection asks for a new choice. |
| AX-CONTROLS-02 / I01 | Give an additional holder an individual login | EDN-007 | Yes | The invited holder uses their own identity and sees only authorized activity; sponsorship does not create another fee. |
| AX-CONTROLS-03 / A02 | Inspect a person's exact access | EDN-006 | Yes | A role summary lists action and resource grants; administrative status does not imply spending or payout authority. |
| AX-CONTROLS-04 / A02 | Delegate account management | EDN-007 | Yes | The invitation previews exact permitted actions and resources; the grant cannot exceed the sender's delegable ceiling. |
| AX-CONTROLS-05 / A02 | Revoke a delegated manager | EDN-007 | Yes | Subsequent reads, exports and commands deny revoked scope while retaining auditable historical actions. |
| AX-CONTROLS-06 / A04 | Assign a card to an authorized participant | EDN-012 | Yes | The assignment names the holder and resource; adding visibility cannot issue a new card or create backing. |
| AX-CONTROLS-07 / A03 | Inspect a commercial reporting hierarchy | EDN-020 | No | The hierarchy shows only approved Seller relationships; a reporting group is not a new account type or liability. |
| AX-CONTROLS-08 / M25 | Assign location visibility | EDN-020 | Yes | Authorized location access is explicit and adding a location cannot confer merchant ownership. |
| AX-CONTROLS-09 / I01, A03 | Distinguish responsibility from cardholder access | EDN-005 | Yes | The product names the responsible party and holder separately without exposing unrelated Personal balances. |
| AX-CONTROLS-10 / I03 | Set or change a spending limit | EDN-012 | Yes | The review shows ceiling, usage and effective period; changing a limit cannot restore consumed capacity. |
| AX-CONTROLS-11 / I03, I08 | Pause and resume permitted card activity | EDN-012 | Yes | Effective versus pending restriction is visible; a child unfreeze never overrides a parent restriction. |
| AX-CONTROLS-12 / I03 | Configure a category alert | EDN-012 | No | The UI explains merchant classification and labels alert-only behavior; it never promises basket-level blocking. |
| AX-CONTROLS-13 / I03 | Configure spend-threshold notifications | EDN-025 | No | The chosen threshold/channel persists; delivery retries do not create financial effects or leak revoked scope. |
| AX-CONTROLS-14 / M20 | Verify a sensitive setting change | EDN-019 | Yes | A fresh purpose-bound step-up is checked on submit; stale verification cannot authorize a changed payload. |
| AX-CONTROLS-15 / A03 | Delegate payment execution | EDN-015 | Yes | Only an explicit payer grant can schedule a permitted obligation payment; generic Manager status is insufficient. |
| AX-CONTROLS-16 / A03 | Separate bank-setting authority from payer authority | EDN-019 | Yes | Destination changes and execution use independent capabilities; in-flight instructions retain their reviewed destination. |
| AX-CONTROLS-17 / M24 | Manage operational and marketing contacts | EDN-025 | Yes | Authentication, operational notifications and marketing consent are distinguished; verified change status is visible. |
| AX-CONTROLS-18 / M25 | Review people with access to a merchant | EDN-020 | Yes | The audit lists current authorized grants and location scope; export enforces the same scope as the screen. |

## Issuing and card lifecycle

| ID / source | Comparable task | Existing issue | Critical | Proposed acceptance |
|---|---|---|---|---|
| AX-ISSUING-01 / I06 | Start a card application in context | EDN-010 | Yes | All entry points open one saved request with selected account and server-provided prerequisites. |
| AX-ISSUING-02 / I01 | Select an eligible additional cardholder | EDN-010 | Yes | Server checks person, accepted relationship, product and funding assignment; tampered identifiers fail. |
| AX-ISSUING-03 / I06 | Save and resume an application | EDN-010 | Yes | Draft and request identity survive refresh/session recovery; a stale version reports a recoverable conflict. |
| AX-ISSUING-04 / I05 | Ask an applicant to complete their part | EDN-010 | Yes | A scoped applicant task exposes only required fields; expiry or revocation leaves the original request intact. |
| AX-ISSUING-05 / I04 | Verify prefilled application details | EDN-010 | No | Existing relationship data is reviewed and versioned; edits cannot mutate someone else's identity record. |
| AX-ISSUING-06 / I06 | Review product terms and consent | EDN-010 | Yes | Consent references the exact terms version and person; missing required consent blocks submission. |
| AX-ISSUING-07 / I06 | Review the final card request | EDN-011 | Yes | Holder, account, backing and controls are shown together; submit binds the reviewed version. |
| AX-ISSUING-08 / I05 | Track application stage and next actor | EDN-010 | Yes | A pending screen names the missing information or responsible reviewer and preserves a safe status reference. |
| AX-ISSUING-09 / I05 | Record company or guardian approval | EDN-010 | Yes | Required approval binds the payload; editing it invalidates approval and approval alone cannot issue the card. |
| AX-ISSUING-10 / I05 | Show the issuing decision separately | EDN-010 | Yes | Submitted, simulated approval and issued remain distinct; timeout triggers reconciliation with the same operation. |
| AX-ISSUING-11 / I19 | Explain a declined application | EDN-010 | Yes | Show a safe simulated reason and next step; never present fictional checks as real underwriting. |
| AX-ISSUING-12 / I20 | Request review of a decision | EDN-021 | No | A linked case preserves the original decision and evidence; request-for-review is not a changed outcome. |
| AX-ISSUING-13 / I07 | Configure amount and date controls for virtual use | EDN-012 | Yes | Optional controls remain in the canonical request; unsupported restrictions are explicitly unavailable. |
| AX-ISSUING-14 / I07, A11 | Create a transaction-specific virtual card | EDN-010 | Yes | The request correlates its intended payment and produces at most one card despite repeated submission. |
| AX-ISSUING-15 / I10 | Activate an issued card | EDN-012 | Yes | Only an actor authorized by the applicable holder/guardian/product policy can perform supported mock activation; issuance and activation remain separate. |
| AX-ISSUING-16 / I09 | Replace a card with an explicit reason | EDN-012 | Yes | Replacement uses the same command family, links its predecessor and preserves obligations, usage and reward history. |
| AX-ISSUING-17 / I06, I09 | Track card fulfillment separately from approval | EDN-012 | No | Delivery pending/failed is explicit; a shipment or acknowledgment cannot silently activate the card. |
| AX-ISSUING-18 / I02 | Cancel an additional card | EDN-012 | Yes | Card closure blocks new authorizations while existing holds, clearing and disputes remain reconcilable. |

## Consumer and cardholder experience

| ID / source | Comparable task | Existing issue | Critical | Proposed acceptance |
|---|---|---|---|---|
| AX-CONSUMER-01 / I10, I11 | Understand the selected account overview | EDN-011 | Yes | Amounts use distinct labels for backing, pending purchases, obligations and availability; role scope is apparent. |
| AX-CONSUMER-02 / I11, I15 | Inspect a pending versus posted purchase | EDN-013 | Yes | Status, dates and amount are consistent with durable events; pending activity is not final expense or reward. |
| AX-CONSUMER-03 / I11 | Find activity using filters | EDN-013 | No | Search/date/card filters retain context, enforce scope and distinguish no results from unavailable data. |
| AX-CONSUMER-04 / I11 | Export selected activity | EDN-025 | Yes | Export preserves authorized scope, exact amounts and chosen filters; formula-like text is inert. |
| AX-CONSUMER-05 / I11 | Read a period statement | EDN-015 | Yes | The statement reconciles to posted activity and identifies period, due obligations and corrections. |
| AX-CONSUMER-06 / I11 | Request an archived statement | EDN-025 | No | Requested/ready/failed states survive reload and give a safe retry without leaking private documents. |
| AX-CONSUMER-07 / I13 | Review and make a repayment | EDN-015 | Yes | Show the actual obligation and authorized fictional source; durable confirmation distinguishes processing from applied. |
| AX-CONSUMER-08 / I13 | Schedule a future repayment | EDN-015 | Yes | Amount meaning, date and obligation are reviewed; execution rechecks live policy and follows a defined race policy. |
| AX-CONSUMER-09 / I12 | Enroll in automatic repayment | EDN-015 | Yes | Effective date and first execution are explicit; any current amount still due remains visible. |
| AX-CONSUMER-10 / I14 | Cancel an eligible scheduled payment | EDN-015 | Yes | Server determines cancelability; a completion race returns the actual recorded outcome. |
| AX-CONSUMER-11 / A03, I13 | Track repayment status and history | EDN-015 | Yes | Scheduled, applied, failed and returned are distinct; returns use linked corrections. |
| AX-CONSUMER-12 / I16 | Report suspected fraud promptly | EDN-021 | Yes | A suspicious pending event can start a safety/support case without inventing a posted chargeback. |
| AX-CONSUMER-13 / I15 | Open and follow a transaction dispute | EDN-021 | Yes | One linked case shows reason, evidence and next step; status does not promise reimbursement. |
| AX-CONSUMER-14 / I15 | Withdraw a dispute with a reason | EDN-021 | No | Withdrawal is capability- and state-dependent, auditable, and does not erase existing financial effects. |
| AX-CONSUMER-15 / I18 | Understand rewards by stage and source | EDN-016 | Yes | Use Etail accrual/posting rules and one membership-year cap; reversals link to original accrual. |
| AX-CONSUMER-16 / I17 | Inspect and enroll in an eligible benefit | EDN-025 | No | Only an actually specified Etail benefit can be enrolled; absent product support remains a scored gap. |
| AX-CONSUMER-17 / I16, A09 | Manage devices and authentication methods | EDN-004 | Yes | Recovery and revocation work through the one Identity integration; unverified passkey support remains visible as a gap. |
| AX-CONSUMER-18 / I21 | Read accessible statements and obtain help | EDN-025 | Yes | Keyboard and assistive reading can reach statement details and support; automated accessibility checks alone do not pass. |

## Merchant servicing and money visibility

| ID / source | Comparable task | Existing issue | Critical | Proposed acceptance |
|---|---|---|---|---|
| AX-MERCHANT-01 / M21 | Save and submit a merchant application | EDN-017 | Yes | One named Seller request retains draft/version; received status does not imply merchant approval. |
| AX-MERCHANT-02 / M21 | Add a location within an approved relationship | EDN-017 | Yes | Location, submitter and payee identities are explicit and cannot create an unrelated legal merchant. |
| AX-MERCHANT-03 / M22 | Review a batch of location requests | EDN-020 | No | Each item uses the same scoped command, has its own outcome and retries without duplicating successful items. |
| AX-MERCHANT-04 / M19 | Inspect and update merchant information | EDN-017 | Yes | Material legal information uses a dedicated review path; submitted values stay separate from effective values. |
| AX-MERCHANT-05 / M20 | Change a permitted settlement destination | EDN-019 | Yes | Review names exact scope and destination; step-up and approval checks precede a tracked change operation. |
| AX-MERCHANT-06 / M06 | View merchant transaction activity | EDN-018 | Yes | Payments retain safe payer/request references and exact money; list queries enforce Seller/location scope. |
| AX-MERCHANT-07 / M03 | Inspect submitted batches | EDN-019 | Yes | Batch totals reconcile to included payments and retain both submitting and payee relationships. |
| AX-MERCHANT-08 / M02 | Inspect pending and posted settlements | EDN-019 | Yes | Expected components and confirmed payout are distinct; unsettled amounts cannot be withdrawn or pledged. |
| AX-MERCHANT-09 / M07 | Understand deductions and adjustments | EDN-019 | Yes | Each fee/reserve/refund/adjustment has a source and status; unknown costs are never confirmed zero. |
| AX-MERCHANT-10 / M02, M05 | Drill from settlement to an individual payment | EDN-019 | Yes | A stable correlation chain explains all included effects without exposing private issuer information. |
| AX-MERCHANT-11 / M04 | Search submissions by amount, date and location | EDN-019 | No | The date basis and filters are explicit; unauthorized location queries disclose no data. |
| AX-MERCHANT-12 / M09 | Read a merchant period statement | EDN-019 | Yes | Issued statements reconcile by period and currency; not-yet-issued differs from a zero-activity statement. |
| AX-MERCHANT-13 / M08 | Investigate an adjustment reference | EDN-019 | Yes | Lookup finds the linked financial effect within scope using safe references; case access is separately authorized. |
| AX-MERCHANT-14 / M13 | Inspect a dispute and reply deadline | EDN-019 | Yes | Transaction amount, disputed amount, case type and deadline source are distinct fields. |
| AX-MERCHANT-15 / M14 | Contest a claim with permitted evidence | EDN-019 | Yes | Response choices follow case/provider capability; stale deadlines and unsupported partial refund actions are checked. |
| AX-MERCHANT-16 / M13, M15 | Accept a claim or reconcile a prior refund | EDN-019 | Yes | Before any credit, account for existing refunds/debits and refundable remainder to prevent duplicate reimbursement. |
| AX-MERCHANT-17 / M16 | Add evidence after an initial response | EDN-019 | Yes | Upload, validated, submitted and provider-accepted states are separate; failed processing is repairable. |
| AX-MERCHANT-18 / M17 | Review a closed dispute and financial outcome | EDN-019 | Yes | Case result and reconciled money remain distinguishable; unmatched effects stay in an exception queue. |

## Management and operating workflows

| ID / source | Comparable task | Existing issue | Critical | Proposed acceptance |
|---|---|---|---|---|
| AX-MANAGEMENT-01 / A05 | Review cardholder spending reports | EDN-021 | No | Reports identify authorized scope, period, freshness and missing enrichment, with drill-down to source activity. |
| AX-MANAGEMENT-02 / A05 | Review virtual-card exposure and overages | EDN-021 | Yes | Unused/partly used allocations and genuine overages remain visible without creating new available capacity. |
| AX-MANAGEMENT-03 / A05 | Find participants approaching limits | EDN-012 | No | The report uses effective controls and committed usage, and links to a permitted control review. |
| AX-MANAGEMENT-04 / A05, A03 | Review aging repayment obligations | EDN-015 | Yes | Age is computed under the product calendar; a case assignment does not authorize debt or fee changes. |
| AX-MANAGEMENT-05 / A03 | Review consolidated commercial exposure | EDN-021 | Yes | Only authorized accounts aggregate; separate currencies and pending/posted obligations remain identifiable. |
| AX-MANAGEMENT-06 / A12 | Allocate expenses to accounting categories | EDN-021 | No | Allocation totals match the source expense; recoding never edits posted financial journals. |
| AX-MANAGEMENT-07 / A12 | Attach and review receipts | EDN-025 | Yes | Evidence is private, scoped and versioned; malformed or rejected files leave a recoverable task. |
| AX-MANAGEMENT-08 / A12 | Approve accounting exceptions | EDN-021 | Yes | An independent eligible reviewer approves the exact allocation version; self-approval and stale payloads fail. |
| AX-MANAGEMENT-09 / A04 | Validate accounting values and combinations | EDN-021 | No | Versioned values and valid combinations are checked before export; historical classifications remain traceable. |
| AX-MANAGEMENT-10 / A04 | Inspect import job outcomes | EDN-021 | Yes | The job reports accepted/rejected counts, actor and timing; failed/retried jobs cannot silently replace source history. |
| AX-MANAGEMENT-11 / A12, A04 | Generate an accounting-system extract | EDN-021 | Yes | A private artifact records definition/version, source cutoff and row count, with totals reconciled to its scope. |
| AX-MANAGEMENT-12 / M10 | Save and rerun a report definition | EDN-021 | No | Saved filters and columns are versioned preferences; permissions are rechecked on every run and download. |
| AX-MANAGEMENT-13 / M11 | Find a scheduled or generated report | EDN-025 | No | Queued/generating/ready/failed/expired states are visible and a lost permission blocks old artifact access. |
| AX-MANAGEMENT-14 / M12 | Work a dispute response queue | EDN-021 | Yes | Priority uses actual reply deadlines; case type and current financial debit do not collapse into one status. |
| AX-MANAGEMENT-15 / M13 | Review case history and the next action | EDN-021 | Yes | Customer/internal/provider records have separate visibility and safe correlation; actions use owning domain commands. |
| AX-MANAGEMENT-16 / M16 | Repair rejected evidence | EDN-021 | Yes | An operator sees the safe failure reason, can request replacement and cannot fabricate provider acceptance. |
| AX-MANAGEMENT-17 / M23 | Audit pending and failed account changes | EDN-021 | Yes | Before/proposed/effective values and actor/status are distinguishable; a receipt alone cannot imply applied change. |
| AX-MANAGEMENT-18 / M30 | Continue contextual support across channels | EDN-021 | No | Help retains authorized account/case context and actual service availability; support access does not grant money movement. |

## Mandatory Etail architecture and release gates

These gates are outside the Amex similarity percentage. They cannot be traded for visual or feature parity. Their research status is unassessed; earlier foundation evidence remains valid only within its recorded scope.

- **AG01:** One issuing command, saved request and Add card form; replacement and virtual formats use the same ownership.
- **AG02:** One financial ledger; balanced immutable postings with exact minor units and currency.
- **AG03:** One server policy; scoped reads/commands/files/exports and immediate revocation.
- **AG04:** Atomic shared backing across cards/accounts, payouts, refunds and pledges.
- **AG05:** Stable business identities and unique effects despite retries, duplicate or out-of-order events.
- **AG06:** Genuine late clearing reconciles after freeze/revocation without authorizing new activity.
- **AG07:** PERSONAL, HOUSEHOLD, SELLER only; liability, sponsor, role and card format stay distinct.
- **AG08:** Guardian-funded supervised spending creates no independent borrowing or child repayment bill.
- **AG09:** Household sharing never exposes unrelated Personal/Seller totals or history.
- **AG10:** Etail rates, membership years, rewards and one Premier cap retain source provenance; D14–D17 resolved for affected writes.
- **AG11:** No secrets or real PAN/CVV/bank/KYB data in the sandbox; provider credentials remain behind adapters.
- **AG12:** Money controls, task order, navigation and status are understandable on desktop/mobile with keyboard and assistive access.
- **AG13:** Mock provider uses the same commands/events; real money is enforced off.
- **AG14:** Practice purchase completes through durable events; no customer manual-clearing button or fabricated client success.
- **AG15:** Account/card offboarding blocks new activity, explains outstanding obligations and preserves in-flight reconciliation/history.
- **AG16:** Guest payments, QR/links, partial invoices and recurring mock collection remain retained Etail scope even outside Amex portal comparisons.
- **AG17:** Sensitive adjustments/destination changes require explicit scope, current approval and payload binding.
- **AG18:** Operations, economics and partner API/portal scope remains in backlog; no second generic CRUD/financial engine.
- **AG19:** Meaningful PostgreSQL, provider replay, concurrency, contract, accessibility, browser, security and build checks pass for release SHA.
- **AG20:** Fresh hosted resources, real hosted acceptance, feature review and public-release approval remain independent gates.
