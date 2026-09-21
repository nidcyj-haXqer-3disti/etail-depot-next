# Dispute and accounting evidence matrix

D133 · 21 September 2026 · Product design, not a network certification

Start with the actual processor notice and its reason, permitted evidence, format and deadline. The rows below organize likely evidence needs; they do not map every network's reason codes, predict win rates or create an exhaustive legal defense. Declining an optional document add-on does not remove mandatory receipts or customer rights.

| Issue raised | Relevant documents and actual evidence | What does not establish the defense |
| --- | --- | --- |
| Unrecognized or unauthorized payment | Processor authentication/authorization records; actual account/order relationship; applicable network-specific evidence | A signed-looking agreement, invoice or email address alone |
| Goods not received | Agreed order/destination/date; carrier or pickup confirmation linked to this sale | “Paid” receipt or shipment label alone |
| Services not provided | Agreed scope/time; attendance, work delivery or completion records | Advance invoice or deposit payment alone |
| Not as described/defective | Description at purchase; specifications; communications; relevant fulfillment and remedy records | Blanket “no refunds” clause |
| Incorrect amount | Agreed itemization, currency, adjustments and actual processed amount | Revised invoice with no accepted change history |
| Duplicate/paid another way | Distinct orders and payment references, or correction/refund record | Two different receipt numbers for one purchase |
| Cancellation/return | Terms shown before purchase; actual acceptance; cancellation/return chronology; credits | Terms added after payment |
| Refund not received | Verified refund/reversal amount, date, status and processor reference | Credit note or “refund requested” email alone |
| Authorization/processing error | Processor records and applicable network response criteria | A customer contract overriding payment-processing rules |

Visa's published guidance distinguishes fraud, authorization, processing and consumer dispute categories. Its examples call for fulfillment, agreed terms, or actual credit records depending on the claim; valid claims should be accepted. This matrix is a proposed organization layer, not a replacement for current processor instructions. [Visa dispute guidance](https://usa.visa.com/content/dam/VCOM/global/support-legal/documents/merchants-dispute-management-guidelines.pdf)

## Common-business modules

| Use case | Information to agree before payment | Actual records to add later |
| --- | --- | --- |
| Booking/deposit | Service, date, deposit applied to total, remaining amount, reviewed cancellation terms | Confirmation, reschedule/cancel messages, service or refund record |
| Completed professional service | Scope/deliverables, price, delivery method, revision agreement | Actual deliverables, relevant client correspondence, completed payment |
| Physical product order | Item/specification, quantity, shipping/pickup promise, return terms | Shipment and delivery/pickup proof, returns and refunds |
| Remaining balance | Original order, prior payments, agreed changes, balance due | Prior linked receipts, actual completion and final payment |
| Class or event | Named class/event, date/location, number of places, cancellation treatment | Booking and attendance/cancellation records |
| Business order | Buyer/seller, items, any purchase order, contact's authority, delivery obligations | Fulfillment, authorized changes, payment and reconciliation |

These are proposed simple transaction modules. They do not imply support for milestone automation, subscriptions, escrow or an industry-specific contract. A customer must not be forced to falsely acknowledge completion before paying a deposit.

## Tax/accounting package

Maintain a traceable connection between the sale, taxes charged, captured payment, refunds/credits, processor and document-service fees, dispute adjustments and the net payout. Preserve the source transaction detail alongside accounting exports. Tax treatment, exemption documents and reporting obligations depend on the business and jurisdiction; selecting the Agreement option does not establish tax compliance. [IRS recordkeeping](https://www.irs.gov/businesses/small-businesses-self-employed/recordkeeping)

## Evidence quality controls

**Source:** distinguish provider data, merchant uploads and customer actions. Preserve originals and append explanations rather than altering evidence.

**Completeness:** show missing relevant records. An automatically generated cover page is not proof that missing evidence exists.

**Consistency:** match amounts, currency, parties, dates, item descriptions, policy versions and related transaction references. Explain legitimate changes with their real chronology.

**Proportionality:** include relevant material only; redact unnecessary personal information and never include prohibited payment authentication data.

**Review:** let an authorized merchant assess whether the customer is right, whether a remedy is due, whether a refund already exists, and whether the evidence actually answers the claim. Avoid duplicate credit while following the processor's dispute/refund instructions.

**Submission:** preserve the reviewed package and submission receipt if actually filed. A generated document is neither processor submission nor an adjudicated result.

## Required pre-release tests for a future vendor implementation

1. Authorization-only, declined and failed-capture states cannot generate a paid receipt.
2. Repeated provider events cannot create duplicate documents or fees for the same selected service effect.
3. Partial captures/refunds reconcile without relabeling the original sale or fabricating a payout.
4. Changing price, scope or cancellation terms cannot reuse stale agreement acceptance.
5. Every delivery method preserves the same document version and amount; public sharing reveals no private evidence.
6. Required basic receipts remain available when no paid document option is selected.
7. A missing delivery record stays visibly missing; no templated confirmation substitutes for proof.
8. A valid customer complaint can be accepted/remedied without a compulsory “defense” workflow.
9. Fee selections and total merchant charges are visible before confirmation; the buyer is not silently charged a merchant add-on.
10. Records export and retention/deletion behavior match applicable contracts, legal holds and the approved privacy schedule.

These tests are specifications for the separately hosted service. They have not been executed against a vendor and do not introduce a financial backend into this website.
