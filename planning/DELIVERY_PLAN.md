# Etail Depot — active delivery plan

> **D81 active override — 14 September 2026 (Tokyo):** [Cohesive service experience](../docs/COHESIVE_SERVICE_EXPERIENCE.md) governs channel marketing and sharing, modern dashboards, actual service settings, clean customer paths and versioned personal profile editing. D73 authority/money, D76 exact invitations and D80 unified card/terminal workspaces remain. Implementation and local verification are complete; see D81 delivery evidence. Review/publication remains separate, and no D81 deployment is claimed.

> **D80 active override — 13 September 2026:** [Unified resource workspaces](../docs/UNIFIED_RESOURCE_WORKSPACES.md) makes cards and terminals follow the same create-for-self/others, detail, controls and sharing pattern. Card details contain their own controls and invitations; Merchant Overview is one credit/debit statement, with Terminals owning channels and assigned people. Personal profile/login and service account settings remain separate. D73 money/authority and D76 contact-bound invitations remain.

> **D79 active override — 13 September 2026:** [Consolidated service workflows](../docs/CONSOLIDATED_SERVICE_WORKFLOWS.md) puts card Add money on Account home and Return unused money in owner settings; card filters describe use rather than names. Merchant has one Overview / Payments / Team & terminals / Channels / Settings menu, with balance and payouts on Overview and terminal context inside the same workspace. Existing financial, permission and recovery rules remain.

> **D78 active override — 13 September 2026:** [Clear service workspaces](../docs/SERVICE_DASHBOARD_CLARITY.md) makes Amex the Cardholder reference and Stripe the Merchant reference. Separate account overview from named-card detail; use one personal account menu with no authenticated footer. Merchant collection, settlement and payouts have distinct views; routine merchant top-ups are retired server-side while posted receipts remain recoverable. D73 money/permissions and D76 invitations/checkout remain.

> **D77 navigation override — 13 September2026:** [Service menu hierarchy](../docs/SERVICE_MENU_HIERARCHY.md) separates account home, cards/payments, resource management, account balance and settings. New top-ups use one money-account workspace; historical funding reviews retain recovery. D76 invitations/network checkout and D73 money/permission rules are unchanged.

> **D76 active override — 12 September 2026:** [Network cards and resource invitations](../docs/NETWORK_CARDS_AND_RESOURCE_INVITATIONS.md) governs Visa product intent, create-card-first recipient assignment, exact terminal invitations and public external-card checkout. It supersedes the internal-Etail-only payment path and person-first/member-code invitation requirements. D73 separate balances, total card allowances and owner/holder/terminal isolation remain in force. Historical text below is dated context.

> **D73 active override — 12 September 2026:** [Owner, cards and terminals](../docs/OWNER_CARDS_TERMINALS_DESIGN.md) governs the current rebuild. The user explicitly chose **separate card and merchant money** and **per-card total allowances with no monthly reset**. Owners manage cards and one merchant’s flat terminals; invited holders/users have only their own resource access. Primary/secondary customer tiers, per-person monthly limits, submerchant responsibility and shared card/merchant balances are superseded. The text below retains the dated D69–D72 baseline for migration and review history; it does not override D73.


12 September 2026 · D72: the user accepted D71 and requests customer-copy/dead-code cleanup, full verification and deployment. Follow [D72 release evidence](../docs/PRODUCTION_UI_CLEANUP.md) for the exact candidate. Preserve current schema, saved data, two-service permissions and disabled real-money controls.

12 September 2026 · D71 experience refinement: [simpler consumer entry and dashboards](../docs/CONSUMER_ENTRY_REDESIGN.md) are implemented and locally verified on the existing prepaid slice. Review the revised desktop/mobile customer experience next; the financial contract and remaining release/product sequence below remain in force. D71 changes no schema or hosted resource and does not constitute a deployment.

12 September 2026 · D69 · **Current stage: review the locally verified prepaid replacement and its connected customer/operator journey.** The working candidate replaces starting allocations, customer-authored purchase simulators, guest payment mutations and instant transfers. Both old local generations are preserved offline; active generations use `fresh-services-d69`. D69 tests, 33 visual views and offline packaging pass; [evidence](../docs/PREPAID_REBUILD_EVIDENCE.md) separates these results from hosted release acceptance.

[FRESH_PREPAID_REBUILD.md](../docs/FRESH_PREPAID_REBUILD.md) is the active replacement contract, consolidated in [the product design](../docs/PRODUCT_TECHNICAL_DESIGN.md) and [project prompt](../02_MASTER_BUILD_PROMPT.md). [Status](STATUS.md) holds actual evidence. D65–D68 and their draft reviews remain history, not competing execution instructions. [M0–M7](backlog.json) retains original requirements and stable IDs without restoring retired account types.

## Current sequence

1. Complete and freeze the prepaid slice: primary funding, group/person limits, one issuance flow, own-card checkout, linked Merchant payment/refund and genuine saved settlement/deposit states. Remove customer simulator routes, global invitation entry and obsolete active copy; retain service-related invitations and access boundaries.
2. Verify each current role and money boundary on the new canonical test generation. Migrate obsolete test assumptions to the real connected flow; preserve permission, replay, concurrency, exact-money and immutable-history assertions. Retired mutation routes must return 404 without effects.
3. Correct any confirmed candidate failures through the existing owners. Verify malformed success shapes, later denied retries, hidden private context, durable funding/payment review URLs and independent operator outcome processing. Then run final source, database, browser/accessibility and packaging gates for the exact candidate.
4. Show the complete desktop/mobile experience using the new marked preview. Preserve before/after projection and source evidence during read-only visual capture. Record usability and remaining scope; do not restore rejected sample records to make a screenshot look complete.
5. Record the exact source/tree/schema and release evidence. Push/review/deploy only within current authorization and existing project rules. Hosted lifecycle and persisted customer tasks remain separate from local provider harnesses and earlier hosted sign-in evidence.
6. Continue remaining P5/P6 work as separately reviewed slices. A prepaid sandbox delivery does not complete external rails, provider reconciliation, partial refunds/disputes, membership billing/rewards or the 100% comparison inventory.

## Retained dependency map

| ID | Outcome | Dependencies and exit gate | D69 status |
|---|---|---|---|
| P0 | One current brief, roles, money model, architecture and gap register | User decisions reflected without conflicting active instructions | D69 prepaid override replaces the earlier allocation/charge interpretation. |
| P1 | Clear desktop/mobile journeys for four customer roles and operators | First use, normal use, waiting, denied, stale and recovery states; observed task acceptance | Earlier walkthrough retained; D69 candidate needs its own final visual/customer acceptance. |
| P2 | Reliable hosted entry and operating runbook | Authorized mailbox confirmation/login/recovery/reload/logout and persisted scoped service tasks | Prior user sign-in report and D68 evidence retained; current-revision hosted acceptance remains separate. |
| P3 | Accepted prepaid Cardholder experience | Explicit funding and per-person limits, one zero-funding issuance path, own-card payment, management/privacy and recovery | Implemented and locally verified for the D69 scope; hosted acceptance remains. |
| P4 | Accepted Merchant experience | Exact merchant/date scope, customer publications, linked payments/full refunds, genuine deposit records, access and support | D69 connected money/deposit model and customer language replace simulator/instant-transfer behavior; local acceptance passes, hosted acceptance remains. |
| P5 | Complete payment distribution and exception lifecycle | Independent delivery, durable processing/reconciliation, partial refunds, disputes/reserves and reliable settlement/deposit effects | Customer publication + signed-in checkout + full refund + explicit operator deposit outcomes are the active slice. Automatic provider processing/delivery and broader exceptions remain. |
| P6 | Remaining issuing, commercial and operating product | Relevant P3–P5 dependencies and D14–D17 for affected money | Retain replacement/closure, facilities if resumed, billing/rewards/calendar, actual source costs, partner/API, notifications/files/PWA and broader operations. |
| P7 | Release review and demonstration | Exact revision/schema, appropriate CI/package, desktop/mobile/privacy/recovery and actual hosted acceptance | D69 release evidence to be filled from final runs; no completed release claimed here. |

P3 and P4 share the explicit connected payment contract; neither may invent a second financial owner. P5's automatic processing, external delivery and broader exceptions each require their own states, data invariants and acceptance. Independent nonfinancial work can proceed while unresolved commercial decisions block only affected writes.

## Connected acceptance scripts

| Actor | Task | Required negative/recovery proof |
|---|---|---|
| New member | Sign in or confirm/register; choose one of the two services; reload and sign out | No automatic service/operator grant; no global invitation requirement; existing email/session failure cases retained. |
| Primary Cardholder | Create group; add money via saved review; set person limit; issue a card without funding; use own card at a published merchant checkout | Funding/limit/issuance remain distinct; malformed/replayed requests create one effect; cannot spend as another holder. |
| Secondary | Accept service-related access; understand no-card waiting; use own eligible card; find receipt/activity/help | Other people's cards, group funding/history and management remain hidden; primary freeze and current grants enforced. |
| Primary Merchant | Select network/unit and dates; publish collection; match customer payment; full refund; review full settlement/deposit batch | Scope survives detail/back; stale batch fails; pending funds/refunds are protected; no arbitrary instant transfer or customer completion control. |
| Merchant delegate | Accept exact-unit access; create/share permitted channels; follow own unit's payments and support | Siblings/other primaries denied; no implied refund, deposit, processing or Cardholder rights; publication is not message delivery. |
| Payer | Public request → sign in → own eligible card → saved review → confirm → exact receipt/refund | Current card/readiness/funds/limit checks; foreign card denied; same saved identity after loss/denial; one-time use once. |
| Support operator | Read assigned private case and permitted payment context; reply/resolve | Separate assignment, no impersonation or money mutation; support-only access cannot process deposits. |
| Deposit operator | Read assigned pending batch; explicitly record COMPLETED or FAILED; recover identical result | One terminal event; conflicting result/command denied; returned-batch review excludes later payments and retains old item history. |

For every script record source/tree, environment, actor, starting records, steps, persisted results, errors, assistance and desktop/mobile result. Keep failures and corrected reruns. Automated totals do not replace these task proofs or actual hosted acceptance.

## Local generation and preservation gate

The user-authorized D69 replacement covers both fixed local preview and test generations. Preserve their original database OIDs/rows under `_retired_d69` with `ALLOW_CONNECTIONS=false`; use fresh `fresh-services-d69` markers on the fixed active names. Do not connect the application to a retained database, copy old rows or reset hosted Database/Identity. Canonical seeding explicitly funds, limits, issues, checks out, refunds and processes a deposit. Startup verifies completed preparation without writes. Follow [tools/README.md](../tools/README.md) for exact targets and private preservation receipts.

## Per-slice and release discipline

Each implementation change names the task, role/resource, state contract, existing owner, any schema change, command identity, current authority, money effects, operator recovery and tests. Preserve one policy, issuance lifecycle and ledger writer. A new abstract engine is not a substitute for finishing a bounded journey.

The final candidate needs relevant lint/types, domain and PostgreSQL integration, adapter/replay/concurrency, API contracts, architecture/security/dependency review, desktop/mobile/accessibility, production Next and Netlify packaging, migration/seed isolation and actual release evidence. Record running or failed checks accurately, bind logs to exact code/schema, and retain historical results without borrowing them as D69 proof.

## Remaining requirements and decisions

Keep original M0–M7 IDs and the 90-task `amex-public-v2` inventory. The denominator/gates do not shrink when a feature is deferred. Plans, source economics and the shared Premier annual cap are separate from services/cards. D69 resolves active prepaid group funding and UTC person spending limits; it does not resolve broader fee rounding, membership-year, sponsor attribution or supervised/facility economics. Real rails, licensing/verification, external delivery and public release keep their existing boundaries.
