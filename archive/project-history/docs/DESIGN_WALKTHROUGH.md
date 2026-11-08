# Etail Depot — design walkthrough

11 September 2026 · P1 review companion · Proposed experience, using fictional data.

The user accepted proceeding from the [product design baseline](PRODUCT_TECHNICAL_DESIGN.md) to this interactive walkthrough. This is a review artifact for the [active delivery plan](../planning/DELIVERY_PLAN.md), not acceptance of every screen or evidence that the remaining product is implemented. The [video planning review](research/VIDEO_PLANNING_REVIEW.md) records the reference evidence.

## Artifact and review controls

The response-content artifact is:

```text
/Users/yu/.codex/visualizations/2026/09/08/01a0804d-84a3-73c2-b819-693f4edfdd05/etail-depot-walkthrough.html
```

It is an interactive design illustration, not a second application. Its JavaScript changes fictional, in-memory records; a starting-state change resets the example. It does not call the application backend, authenticate anyone, send email, persist financial effects or prove authorization. Its calculations and role switches must not become production policy or ledger code.

Use **Journey** to select a role, **Starting state** to choose a scenario, and **Desktop / Mobile** to compare layouts. Mobile constrains the preview frame to 390px; automated reflow includes 320px, while actual-device and customer usability acceptance remain separate checks. **Design notes for this screen** distinguishes proposals and important meanings. Sample confirmation/reset links are review controls outside the customer interface; email/password fields are inert examples.

## Clickable journey inventory

These paths are present in the artifact's source. The verification section below distinguishes paths checked in the prototype from production and customer acceptance.

| Review choice | Connected path to inspect | Recovery and boundary scenarios |
|---|---|---|
| New member & sign-in | Create your login → Check your email → Open sample email link → Confirm email → sign in → Your services → explicit sandbox participation → chosen service. Forgot password → sample reset link → new-password screen → sign in. Sign-in security → sign out. | Wrong password, expired email link, reset pending and email unavailable. Registration does not change an existing password. No service or operator authority follows merely from signing in. |
| Primary cardholder | First card → Create your first card → one Add a card form → review → Create card → selected card/activity. Save for later → Requests → resume. Invite a cardholder → review → acceptance → same card form. Freeze/unfreeze; practice purchase on the primary's own card. | Uncertain request → recover the existing result; changed request → review again; cannot load; access removed. Managing Jamie's card must not permit purchasing as Jamie. |
| Secondary cardholder | Invitation → accept or decline → named waiting state → own card when prepared → practice purchase/review → activity detail → card help. | Waiting for card, frozen card, expired invitation and access removed. Jamie gets their own card/activity, without primary setup or group management. |
| Primary merchant | First collection → sandbox setup → own payment channel → amount/presentation review → test checkout → payment detail/receipt. Overview → named merchant or network + period → Payments/Refunds/Transfers → exact record → back. Full-refund review; one-merchant transfer review. People → optional submerchant/collector invitation. | Paused channel → review resume; declined or uncertain payment/refund; cannot load; removed access. Current funds remain distinct from period totals. Refund/transfer remain responsible-primary tasks. |
| Submerchant collector | Accept Weekend Stall invitation → assigned merchant → permitted channel → test checkout → receipt → payment help. | Paused channel, removed access, invitation and waiting-for-primary-setup states. No Harbor Goods/Workshop Desk network data, refund or transfer controls. The responsible primary stays visible. |
| Assigned support | Assigned cases → exact case → customer/payment context → reply → resolve → requester conversation. Role switching allows inspection of both ends of the sample conversation. | Unassigned case → unavailable. Support does not impersonate the customer, move funds or grant access. Merchant-linked support is a proposed extension. |

The channel form offers text message, email, invoice, bill, social, QR code and website/link presentations of one payment request. Each has a visual presentation preview with the same request identity, amount and merchant. The sample QR encodes “Etail Depot design preview only”; it has no payment destination. A used channel returns to its existing payment. These examples do not establish working delivery or production-quality documents.

## Money example: period activity versus funds now

Start **Primary merchant / Everyday use**, select **All my merchants** and the last-week period. Dates are fixed for this illustration; “now” means 11 September 2026.

| Display | Fictional amount | Meaning and expected drilldown |
|---|---:|---|
| Payments received, 31 Aug–6 Sep | $450 | Four payments: $120 + $80 + $200 + $50. Open the same merchants and period in Payments. |
| Refunds completed, 31 Aug–6 Sep | $80 | Refund R-2001 completed 4 Sep. Open Refunds using the refund's event date. |
| Available practice funds, through 11 Sep | $295 | Current funds across the three merchants, irrespective of the selected activity period. Open current funds, then select one merchant for a transfer. |

Payment **P-1004**, $50 at Weekend Stall, was received on **6 September** and refunded on **8 September**. Its payment belongs to last week; its refund belongs to this week. The receipt/detail must make this understandable without changing either event date.

The fictional current position is $585 all-time payments minus $130 refunds minus $160 practice transfers = $295. Per-merchant funds are Harbor Goods $95, Weekend Stall $60 and Workshop Desk $140. This is an explanatory example, not a settlement calculation, fee quote, customer balance or verified ledger result. Runtime money must continue to come from authorized server projections and the sole ledger owner.

## Existing foundation versus proposed experience

“Existing” below refers to the baseline source audit in the product design, not checks rerun for this companion.

| Area | Existing sandbox foundation | What this walkthrough proposes or does not prove |
|---|---|---|
| Entry | Registration, confirmation, password/recovery lifecycle, opaque sessions and explicit participation. | Revised connected entry screens. Real hosted mailbox/password acceptance remains pending under [email reliability evidence](EMAIL_ACCESS_RELIABILITY.md); sample links prove nothing about delivery. |
| Cards | Invitations, one saved request/issuance path, controls, practice purchases, private activity and Cardholder cases. | Short own-card first use, clear accepted-without-card waiting and connected recovery. Browser state changes do not prove persistence or issuance uniqueness. |
| Merchant | Primary/submerchant units, explicit delegates, channels, authenticated sandbox payment/receipt, full refund and practice transfer. | Network-period drilldown and clearer current-funds detail. Guest checkout, external delivery, disputes/reserves/settlement and live processing are not implemented by this artifact. |
| Support | Private Cardholder cases and separately assigned operator replies/resolution. | Typed merchant/payment cases with safe requester/operator context. The sample merchant conversation is not an existing end-to-end merchant support service. |
| Recovery and isolation | Current commands recheck authority, expected versions and operation identity. | User-facing uncertain-result/status journeys. No production status endpoint, durable worker, retry safety or privacy proof follows from this local model. |

## P1 review criteria

Record each role, starting state, screen size, task, observed result, assistance, misunderstanding and recovery. Keep unresolved findings visible; do not convert a source inventory into “all journeys passed.”

- The person can identify the selected cardholder/merchant and responsible primary before confirming an action.
- First use works for the primary's own card or own merchant without requiring delegation. A secondary understands waiting without being sent to primary enrollment.
- The merchant reviewer explains $450/$80 for last week versus $295 now, follows P-1004's later refund, and returns with the same merchant/period/view.
- A collector sees only Weekend Stall. A primary cannot purchase as Jamie. An unassigned operator has no case access. Prototype screens illustrate these requirements; API, export, direct-link and replay isolation must be tested in the application.
- Forms offer review, edit/cancel and clear outcomes. An uncertain result leads to checking the same operation, not silently creating a replacement.
- Keyboard order/focus, names, contrast, 320px reflow and readable mobile detail are observed before acceptance. The 390px preview toggle alone does not pass these checks.
- Merchant support conveys the exact payment/refund dates without exposing unrelated records or letting support move money.
- Every core task is completed without facilitator navigation help; blocked tasks or mistaken financial confirmations fail the design gate. Measure the first walkthrough before choosing speed targets.

## Implementation contract after review

1. Record accepted screens and corrections in the same design baseline. Resolve copy/scope misunderstandings before selecting an implementation slice; retain broader scope in the delivery plan.
2. Name the exact actor, resource, route/query state and result. Define server projections for period activity and current funds separately, with validated exact-record links and no fallback to another record.
3. Reuse the existing identity, access/policy, workspace, acquiring, ledger and cases/operations owners. Specify command input, expected version, durable operation identity, current authorization, states and safe unknown-result recovery; do not copy the prototype's local writer.
4. Design merchant-case references, requester visibility and assigned-operator context before implementing that missing slice. Treat guest checkout, delivery and asynchronous payment processing as separate planned work.
5. Identify any migration and preservation evidence explicitly. This companion authorizes no database reset, provisioning, dependency change, deployment or real-money operation.
6. Execute the relevant domain/PostgreSQL/API/concurrency, desktop/mobile/accessibility and hosted acceptance checks on the implemented slice. Record exact revision/environment and failures; only then claim persisted completion.

The companion was initially drafted from source inspection. The root review added the browser verification below; none of these checks are hosted, financial or backend security acceptance.


## Prototype verification — 11 September 2026

Final fragment: 95,284 bytes; SHA-256 `cbc9549de335bb3fdcfb399092cbd6720ade776f1e75b350fdacd340554204e6`. This fingerprint identifies the response-content design, not an application build. Evidence and the two focused browser scripts are retained under `artifacts/design-walkthrough/`.

| Check | Observed outcome | Limit |
|---|---|---|
| JavaScript syntax and fragment contract | `node --check` passed; fragment under 1 MB; no fetch/XHR/WebSocket, cookie or browser-storage access, or document wrapper | Static design checks only |
| Scenario rendering | 33 starting states across six review choices, each at 1024, 736, 390 and 320px: 132 renders, no measured horizontal overflow or runtime errors | Reflow and rendering, not completion of every possible path |
| Connected interactions | Own-card creation/purchase/freeze; optional invite → acceptance → waiting → primary issuance → private secondary view; network/date drilldown; full refund; exact receipt/support reply/resolution; denied navigation; sample confirmation → sign-in → neutral services | Fictional, in-memory outcomes; no identity/provider/database integration |
| Focused recovery and revisions | Eight grouped checks passed: collector waits for primary setup; device-switch form preservation; seven presentations/text escaping; used request returns to its payment; uncertain refund; exact transfer/return filters; saved card draft preservation and uncertain-card recovery; reachable mobile Help/security (grouping retained in JSON) | No concurrent commands, persisted idempotency or production access-control proof |
| Accessibility automation | Five rendered-wrapper scans and twelve direct-prototype scans covering six roles in light/dark: no WCAG A/AA tagged violations or incomplete checks | Automated selected-screen scan, not a WCAG certification or assistive-technology audit |
| Visual review | Representative desktop/mobile/light/dark screenshots inspected, including 320px merchant layout. Mobile navigation wraps and retains Help/security. | Physical-device and unassisted customer task review remain pending |

Executed locally against a generic static server bound to `127.0.0.1:3164`, with the visualization skill's standalone renderer and installed Playwright/Chromium/Axe. Final commands: `node /private/tmp/check-etail-design.cjs` and `node /private/tmp/check-etail-design-detail.cjs`, both exit 0. `review.json`, `detail-review.json` and `identity.json` hold the results; the scripts are copied beside them. The rendered iframe was tested with its actual script-only sandbox. No application server endpoint, provider setting, customer record, external message or deployment was involved.

Initial failed checks were retained in the task history: the script-only iframe blocked native form submission; local review actions were corrected to stay inside the fragment. Source/browser review also corrected revoked navigation, duplicated/hidden mobile Help, overwritten review values, paid-channel re-entry, a collector's premature setup path, wrong support context, saved-request replacement, and ambiguous accessible names. Harness setup/locator errors (browser context, package resolution and receipt/channel labels) were corrected before the final passing runs. These failures are not represented as hosted product defects or hidden by the final result.

P1 status: prepared for customer review. The user's acceptance of proceeding to P1 is not approval of every screen. No unassisted customer timing/comprehension study, real mailbox/password journey, backend persistence/security test, migration or deployment was completed in this task. P2's hosted email acceptance remains the next implementation prerequisite after entry design review.
