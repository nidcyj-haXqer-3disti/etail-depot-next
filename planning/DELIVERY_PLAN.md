# Etail Depot — active delivery plan

11 September 2026 · D63–D67 · **Current stage: Merchant experience locally verified and publishing for review.** D65's connected slices and D66's Cardholder redesign are implemented and pushed for review. D67 applies the [Merchant experience contract](../docs/MERCHANT_EXPERIENCE_REDESIGN.md) to the existing commands and scope rules, with payments first, persistent context, truthful channel readiness and simpler people access. It adds no migration or financial writer. Deployment still requires the previously requested narrow release-setting approval.

One source of product/technical truth: [PRODUCT_TECHNICAL_DESIGN.md](../docs/PRODUCT_TECHNICAL_DESIGN.md). One working prompt: [02_MASTER_BUILD_PROMPT.md](../02_MASTER_BUILD_PROMPT.md). [STATUS.md](STATUS.md) records evidence, not a substitute scope definition. This is the active sequence; [M0–M7 backlog](backlog.json) remains the original requirement inventory with stable ticket IDs, not the current implementation model.

## Why the sequence changes

Repeated UI changes and authentication patches have not established an accepted end-to-end experience. Active documents also retained the retired three-account model. The current two-service code has useful foundations; the missing discipline is a single current specification, visible gaps and customer acceptance before declaring a deployment complete.

No new application rewrite or provider replacement is justified by this audit. Preserve source, migrations, sessions, policy, commands and ledger. Remove contradictions in active instructions; fix or extend the existing owners one reviewed slice at a time.

## Dependency-ordered work

| ID | Reviewable outcome | Depends on | Exit gate | Current status |
|---|---|---|---|---|
| P0 | Consolidated brief, role matrix, journey/state inventory, architecture/ERD, gap register and adapted prompt | None | Conflicting active instructions resolved; source-based existing/proposed distinction; independent review | Baseline prepared; user accepted proceeding to P1 |
| P1 | Complete desktop/mobile design walkthrough for all four customer roles plus operator | P0 review | Demonstrate first use, normal use, denied/expired/waiting and failure recovery; record and resolve scope/copy misunderstandings | Interactive walkthrough prepared and internally reviewed; customer task/usability acceptance pending |
| P2 | Reliable hosted entry and operating runbook | P0; P1 entry design | Actual authorized mailbox confirmation, password login, recovery, reload and logout; configuration ownership/drift diagnosis; both services reachable with persisted correct access | User confirms hosted sign-in reaches Your services; full lifecycle/current-release acceptance and drift cause remain open |
| P3 | Accepted Cardholder experience | P1, P2 | Primary creates an own card directly and can then invite/issue/manage; secondary waiting/own-card/purchase/help; persisted result; no cross-holder reads/spending; desktop/mobile/accessibility and operator handoff | D65 person/request management and separate primary/holder freeze ownership implemented; local integrated checks passed; hosted task acceptance pending |
| P4 | Accepted Merchant experience | P1, P2; reuse P3 support contract where applicable | Primary network/period drilldown; exact-unit collector channel/payment/receipt; refund/transfer authority; merchant support→assigned operator→resolution | D65 network activity/export and shared support plus D67 Merchant redesign implemented; local integrated checks passed; hosted task acceptance pending |
| P5 | Complete payment distribution and lifecycle simulation | P4; detailed operation/order design | Guest-safe order/checkout; independent channel delivery; durable pending/retry/event reconciliation; partial refunds, disputes, reserves/settlement/transfer failures with balanced effects | P5a public offer, private guest order, durable review/confirmation/receipt and publish/revoke controls implemented; local integrated checks passed. Delivery, asynchronous processing and payment exceptions remain |
| P6 | Remaining issuing, commercial and operating product | Relevant P3–P5 slices; D14–D17 for affected money | Funding/facilities, replacement/closure, billing/rewards/calendar, cost evidence, partner/API, notifications/private files/PWA and required operations pass source-mapped acceptance | Retained scope; not silently removed |
| P7 | Full sandbox release review and demonstration | All scope promised for that release; complete-product claim requires P3–P6 | Exact revision/schema/CI/package; hosted positive journeys; money/scope isolation/recovery; human desktop/mobile walkthrough; actual remaining scope stated | Local source, database, browser, visual, recovery and packaging checks passed; publication and hosted acceptance in progress |

P3 and P4 can be built independently after shared contracts are fixed. P5 should be split into guest orders, durable processing, delivery and payment exceptions; each must have its own reviewed states and data invariants before implementation. P6 can proceed on independent nonfinancial work while unresolved financial decisions block only affected writes. This sequence is dependency-based, not an unsupported calendar estimate.

A smaller sandbox release may happen at an accepted P3/P4 slice, with accurately limited marketing and explicit missing features. It cannot be called the full product. Local design and tests may continue while external mailbox acceptance needs the owner; do not claim that gate passed from elapsed time or negative probes.

## Current work and next steps

1. Publish the exact verified D67 Merchant tree in a draft review stacked on D66. D65/66 remain pushed; no merge or release-setting change while the earlier explicit approval remains pending.
2. Verify the exact deployed revision, additive migrations and hosted service pages. Retain the user's successful sign-in report; full current-release mailbox/recovery and customer task acceptance remain separately recorded.
3. Demonstrate the finished Cardholder, Merchant and guest sandbox journeys. Preserve every failed-run record and distinguish local provider harnesses from hosted evidence.
4. Continue P5 delivery, asynchronous provider processing and payment exceptions, followed by P6 issuing/commercial scope. Publishing/copying a payment link does not send SMS or email. Do not reintroduce account types or restart settled responsibility decisions.

## Vertical-slice contract

Every implementation PR names:

- The exact customer task and observable result, with its role and selected resource.
- Screens/states and the existing source owner being changed; a reason for every new abstraction.
- Command input, server authorization, state transitions, idempotency identity, failure/recovery and scoped projections.
- Data/migration changes and preserved IDs, records, amounts, permissions and recovery evidence.
- Operator handoff and diagnostic evidence that excludes credentials/private data.
- Relevant automated and human checks; which hosted checks were actually executed.

Do not write a new module or feature because a generic master prompt says “complete everything.” The selected slice and its reviewed contract define the immediate work. Later scope remains visible here.

## Acceptance scripts

| Actor | Task | Required negative/recovery case |
|---|---|---|
| New email member | Confirm email; sign in; reload; open chosen service; sign out | Wrong password, expired confirmation, pending reset, provider unavailable; no automatic financial enrollment |
| Primary cardholder | Manage each person's cards/access; search/resume saved requests and open exact issued card; issue via one flow; freeze/inspect activity | Double submit/timeout/stale version creates no duplicate; cannot purchase as secondary; holder unfreeze cannot remove the primary restriction |
| Secondary | Accept invitation, understand waiting state, use own issued card, find own activity, get help | Sibling URLs/API/export denied; revoked access fails on next request; no forced primary enrollment |
| Primary merchant | See last week's network collections; drill down to exact records; manage submerchant and permitted refund/transfer | Same scope/date on back; cannot reuse paid-out funds; concurrent/replayed actions have one effect |
| Collector | Accept exact-unit invitation, use allowed channel, follow payment result/receipt | Sibling/other-primary data denied; expired/paused/used request honest; no financial authority inferred from collection |
| Assigned support | Open customer-linked case, understand context, reply and resolve/escalate | Unassigned case denied; stale response handled; no customer impersonation or manual balance edit |
| Guest (P5a) | Open published request without merchant login; create private order; review/confirm practice attempt; revisit receipt/refund | HttpOnly session and separate-browser denial; expiry/revocation; same-attempt recovery; shared one-time-use guard; no duplicate payment |

For each script record build/tree, environment, role, starting state, steps, persisted result, errors, assistance and desktop/mobile outcome. Keep public proof redacted and data-isolated. Retain failed attempts and corrections. Do not replace these scripts with a single “all tests passed” assertion.

## Retained scope mapping

| Original requirement family | Active interpretation / stage |
|---|---|
| M0 foundation; M1 accounts/access | Existing resources and two services; P0–P3. Retired account labels do not return. |
| M2 card requests | One canonical saved request/form/issuance owner; P3. |
| M3 issuing/backing/repayment/events | Current practice effects retained; full funding/provider/billing lifecycle P5–P6. |
| M4 acquiring/delegation/guest checkout | Primary/submerchant scope P4; distribution/guest/payment exceptions P5. |
| M5 economics/rewards/operations/partner | Source contracts and open D14–D17 preserved; P4 support and P6 broader scope. |
| M6 tests/security/UX | Per-slice checks plus P1 observed usability and P7 acceptance. |
| M7 hosting/release | Existing owned site; each release earns P7 evidence. No reprovisioning mandate. |
| Public site/SEO/PWA | Accurate product availability, customer language, public metadata and approved indexing; P1/P6/P7. Existing sandbox noindex policy changes only with relevant release decision. |
| Notifications/workers/private documents | Real delivery/status and bounded durable workers; private scoped access; P5/P6. |
| Amex comparison | Preserve 90 tasks and all mandatory gates; 100% remains target, with no completion points from this plan. |

## Decision and evidence gates

Already decided: two services, primary/secondary privacy, primary merchant responsibility, multiple separate primary relationships, seven payment presentations, simulated money, retained provider boundaries and existing visitor-access preference.

Open only for affected financial scope: D14 rounding; D15 membership calendar/refund/proration boundaries; D16 sponsoring-membership attribution; D17 responsible funded/credit allocation. Live provider eligibility, real money and legal launch readiness remain outside the current sandbox authorization. Sender/DNS/purchases and external messages retain their existing authorization boundaries.

P7 requires checks appropriate to the final change: lint/types, domain and real PostgreSQL integration, adapter/replay/concurrency, API contract, architecture, security/dependencies, Playwright desktop/mobile/accessibility, production Next and Netlify packaging, reviewed migrations and actual hosted end-to-end acceptance. Preserve exact source/tree/schema/deploy identities. Record jobs still running or blocked accurately. No merge or publication occurs merely because this document exists.
