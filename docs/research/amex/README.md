# American Express as Etail's primary business and product reference

> **Research archive and comparison reference — active design superseded on 11 September 2026.** Use [Product and technical design](../../PRODUCT_TECHNICAL_DESIGN.md) and [Delivery plan](../../../planning/DELIVERY_PLAN.md) for current product decisions, scope and acceptance. Dated observations and proposals below preserve their original evidence limits; old account models and historical implementation instructions do not govern new work. The current ambition is **100% of the retained public-workflow inventory**, recorded as `amex-public-v2`, not the original 90% threshold. No parity or completion score is awarded here.

Latest D69 screen/workflow refresh (12 September 2026): [Prepaid replacement reference findings](../../FRESH_PREPAID_REBUILD.md#reference-findings), including current official cardholder/merchant guides, the historical Amex UK merchant walkthrough and MagnifiedMoney cardholder video. The record distinguishes complete available transcripts from inspected player moments, market/date limitations and Etail's explicit prepaid adaptation. It does not claim private portal access or parity.

Latest marketing refresh (10 September 2026): [Amex people and card positioning](MARKETING_POSITIONING_2026_09_10.md) and [delegated collection research](MERCHANT_MARKETING_FIT_2026_09_10.md). These support [the redesigned landing page](../../MARKETING_REFRESH.md); proposed audience jobs remain hypotheses for customer testing.

Latest dashboard/role refresh: [Cardholder dashboards](CARDHOLDER_DASHBOARD_ROLES.md) and [Merchant dashboards](MERCHANT_DASHBOARD_ROLES.md), with official sources, observed illustrations, historical video and evidence limits. These inform [the implemented service design](../../SERVICE_DASHBOARD_DESIGN.md).

**Latest correction: front-end experience. Start with [the actual screen and interaction reference](FRONTEND_EXPERIENCE.md).** The user wants the Amex layouts, navigation, controls, page sequences and visible feedback for issuing, account management and merchant servicing. This supersedes the business-audit emphasis below. The front-end reference includes visually inspected official screenshots and identifies missing visual evidence.

Research date: 8 September 2026. **Direction for that research pass:** focus the 360° check on issuing, account control and merchant operations: product behavior, management responsibilities, customer experience and complete operating workflows. Amex was the primary reference with the user's original 90%+ target. The user raised the ambition to 100% on 9 September; the retained inventory is now `amex-public-v2`. Technical supplier/architecture research remains background, not the focus of the customer experience review.

**Research is complete for this documented pass; implementation parity is not assessed.** This is a broad relevant-source review, not a claim to have found every resource or inspected all Amex products. The local account/session foundation was partial at the time of that pass; this is not a current application assessment. No new financial feature, Amex integration, dependency installation or deployment was performed in that research task.

## Read the findings

The earlier [360° business review](BUSINESS_360_REVIEW.md) follows each relationship from application and setup through daily use, payment, exception handling, change and closure. It is supporting context after the front-end references above. The issuing, account-control and merchant reviews identify actors, decisions, normal paths, exceptions, handoffs, evidence gaps and practical acceptance scenarios. Twelve connected walkthroughs join the three areas.

| Document | What it answers |
|---|---|
| [360° business review](BUSINESS_360_REVIEW.md) | Complete operating perimeter, substantive findings, unresolved business rules and connected journeys. |
| [Issuing 360](ISSUING_360.md) | Product choice, application, approval, delivery, activation, use, repayment, servicing and exit. |
| [Account control 360](ACCOUNT_CONTROL_360.md) | Who can see, request, approve, spend, change, pay, delegate or remove access across distinct programs. |
| [Merchant operations 360](MERCHANT_360.md) | Merchant setup, acceptance, fulfillment, submission, funds, refunds, disputes, reporting and closure. |
| [Architecture and supplier blueprint](ARCHITECTURE_BLUEPRINT.md) | Verified subsystem map, evidence gaps and proposed end-to-end Etail design. |
| [Disclosed payments platform](PLATFORM_ARCHITECTURE.md) | Actual routing, runtime, recovery and migration disclosures from Amex engineers. |
| [Vendor systems](VENDOR_SYSTEMS.md) | Finastra, Pega, Salesforce, IBM and other bounded provider relationships; related entities kept distinct. |
| [Payments, fraud and data](PAYMENTS_DATA_ARCHITECTURE.md) | Named serving components, analytical infrastructure, research and unresolved conflicting claims. |
| [Engineering code and patents](ENGINEERING_AND_PATENTS.md) | Revision-pinned source behavior, workflow/data boundaries and proposed inventions. |
| [Issuing and consumer experience](ISSUING_AND_CONSUMER.md) | Applications, approvals, holders, activation/replacement, controls, activity, statements, repayments, rewards, fraud/support and recovery. |
| [Merchant and operations](MERCHANT_AND_OPERATIONS.md) | Merchant/location setup, settlements, submissions, deductions, disputes, evidence, account changes, access and reports. |
| [Architecture and management](ARCHITECTURE_AND_MANAGEMENT.md) | Relationships, module ownership, linked financial lifecycles, management responsibilities, screens and actual Amex integration fit. |
| [Open-source components](OPEN_SOURCE_COMPONENTS.md) | Upstream code/architecture/license/maintenance evidence and the decision to reuse, reference or defer each candidate. |
| [90-task comparison catalog](COMPARISON_CATALOG.md) | Public task references, proposed Etail acceptance criteria, criticality and existing EDN issue ownership. |
| [Machine-readable comparison](../../../planning/amex-comparison.json) | Versioned task inventory and future implementation evidence fields. Every task currently says `not_assessed`. |

The earlier workflow/component pass contains **137 records representing 135 distinct URLs: 62 Amex product/program/reporting sources and 73 upstream technology references**, including 12 principal component candidates and four additional Amex repositories. Its registers are [issuing](issuing-sources.json), [merchant](merchant-sources.json), [architecture](architecture-sources.json) and [open source](opensource-sources.json). Its historical validation is preserved in [VALIDATION.md](VALIDATION.md).

The deeper architecture pass adds **46 included records across four registers**, with provenance-only and limited-adoption sources clearly marked; these are not 46 independently verified deployments. Excluded/failed leads do not count. See [architecture validation](ARCHITECTURE_VALIDATION.md) for deduplicated counts, review corrections and the new proposed gates. Every register records direct URLs, access date, scope, evidence and limitations.

## Historical conclusions that informed the build

**The current review is about completing the business relationship.** Use the [business findings and walkthroughs](BUSINESS_360_REVIEW.md) before the background technology material. A feature name or available screen is insufficient when a customer cannot finish the task, the wrong person can act, money status is unclear or an exception has no owner.

**Amex should determine the depth of each task.** A card screen needs the holder, responsibility, usable capacity, effective restrictions and service history. Merchant activity needs traceability through submissions, settlements, adjustments and payouts. Management needs granular authority, actionable queues and reconciled reports. The detailed studies map these into Etail commands, projections and failure handling; an attractive overview page alone would not meet this benchmark.

**Management is part of the product.** Amex's corporate guide separates bank-setting authority from payment execution and offers hierarchy/exposure views. For Etail, the proposed roles, queues and approval boundaries should be designed alongside each financial slice and fully delivered through M5. [US corporate guide](https://www.americanexpress.com/en-us/business/resource-center/statements-payments/articles/company-profile-guide/index.html)

**There is a concrete route to investigate for actual Amex-backed commercial virtual cards.** Amex Sync supports selected partners, eligible existing US Business/Corporate accounts and integrated transaction data; it currently requires partner operations in the US. It deserves first evaluation for that specific Seller use case. It does not settle Etail's consumer/Household product model or acquiring arrangement. No program application was sent. [Amex Sync](https://www.americanexpress.com/en-us/business/sync/)

**Specific internal architecture is now supported by engineering and supplier evidence.** Read [the deeper blueprint](ARCHITECTURE_BLUEPRINT.md) before making further architecture choices. Etail's modular monolith, PostgreSQL transactions, one policy, one ledger and durable events are our explicit implementation decisions. The new disclosures refine recovery and ownership requirements without silently replacing that architecture.

**GitHub should supply focused implementation help.** Evaluate upstream code for the specific missing component, with license, compatibility, security and operational fit checked at the selected revision. A general ledger, switch, billing system or web framework is not by itself an Amex-like product. Read the component assessment before introducing any dependency or replacing an existing single owner.

## Retained comparison inventory and the current 100% target

The original `amex-public-v1` research used a 90%+ target. The user's 9 September update raised both overall and per-domain targets to 100%, recorded in [the `amex-public-v2` inventory](../../../planning/amex-comparison.json). The denominator remains the same 90 public comparison tasks. This is the **proposed measurement method**, not a claim that the user has approved every researched capability or that the project reaches the target.

The initial denominator is 90 documented, relevant comparison tasks: 18 each for issuing, account controls, consumer experience, merchant servicing and management. Each task has equal weight. For a task to earn one verified point, it must pass all five dimensions:

1. **Outcome:** the intended task completes against real persisted application state.
2. **Authority and data:** each role sees and acts on the right resources, including negative cases.
3. **Interaction and navigation:** account context, information hierarchy, task sequence and confirmations are recognizable and coherent, using Etail branding.
4. **Status and recovery:** pending, rejected, failed, expired and uncertain outcomes have truthful, usable next steps.
5. **Desktop, mobile and accessibility:** the task works at supported widths with keyboard and assistive access, with visual review and actual user walkthrough evidence.

Future score = verified complete tasks / 90 × 100. The current target is all 90 tasks, including all 18 tasks in each domain and all 71 critical tasks, plus all 20 mandatory Etail gates. The historical v1 threshold was at least 90% overall and in each domain, requiring at least 17 of 18 per domain; it is no longer the target. All mandatory product acceptance remains required. A static mock, implementation plan, successful HTTP response without a durable effect, unsupported button, or inaccessible-source assumption receives no completion credit.

Evidence for a completed row must record exact source revision/SHA, test names/results, role fixtures, desktop/mobile views, recovery exercise and reviewer/date. Reuse existing foundation evidence only after mapping its precise coverage; this pass does not automatically award it whole-workflow credit. **No implementation percentage is asserted now.**

Keep the current `amex-public-v2` inventory and its historical v1 provenance explicit. New discoveries become versioned additions with a documented rationale; never drop a hard or unsupported task just to increase the score. Unsupported features such as unproven Identity passkey integration remain visible gaps. Benefit enrollment must have an actual specified Etail benefit before implementation; research does not invent a travel/offers business.

The target concerns observable product/workflow and experience fidelity. Pixel similarity, Amex branding and private architecture cannot honestly share this percentage. Visual hierarchy and interaction fidelity remain in the rubric, using original Etail assets. Architecture is reviewed against explicit relationship, ownership, safety and recovery gates instead of an invented percentage of private Amex systems.

## Scope, regions and unresolved evidence

The primary baseline is the US consumer/business/merchant material, consistent with the current USD requirements. Canadian app tutorials and UK/global corporate guides supplement workflow details; Japan merchant material is a regional cross-check. The deployment's operating jurisdiction is not inferred from the user's time zone. Each region/product requires its own provider and commercial validation before a live product is considered.

This pass inspected official help/FAQs, illustrated corporate and merchant guides, reporting references, program pages, public financial reporting, network integration descriptions and upstream GitHub code/license/release documents. Four PDF pages were rendered and visually inspected: Account Manager terms pp. 3–4, reconciliation admin p. 21, and global reporting p. 13. These are illustrative source screens, not a hands-on audit of authenticated portals. No videos were claimed as watched merely because a page embedded them.

Remaining unknowns include current signed-in screens and role variants, actual customer task timings, all mobile edge cases, current staff-tool integrations, private underwriting/fraud decisions, issuer-ledger schema, detailed partner message contracts, negotiated costs, reserve/settlement schedules and independently verified production service levels. The deeper study now documents certain transport and runtime choices, rather than treating all protocols or internals as unknown. Some developer endpoints failed retrieval; legacy gateway snippets are discovery leads only. The source registers identify failed, stale and excluded materials. Search visibility does not make a confidential document appropriate design material; the identified confidential GAFC handoff document was excluded.

Before each financial slice, revisit the relevant current public sources, resolve the exact adapter contract, and run the proposed task and exception paths. If later authorized product demonstrations or partner documentation become available, record their scope and provenance and update this catalog. Do not request customer credentials in chat or pretend unseen private behavior is known.

## Deliberate Etail differences and retained obligations

The original research assumed PERSONAL, HOUSEHOLD and SELLER account types; that model is superseded by Cardholder and Merchant services. Family and team relationships do not create additional account types. Select/Premier terms, the shared Premier cap, responsible-party relationships, guardian-funded supervised spending, personal privacy and source-defined repayment policies remain obligations unless explicitly changed. Amex public examples do not silently decide fees, liability, age, interest, automatic unfreeze or rewards values. D14–D17 retain their recorded decision status for affected writes; this research does not resolve them. Comparison gaps caused by deliberate product differences must remain visible rather than importing incompatible economics.

Etail's guest checkout, QR/payment links, invoices, recurring mock collection, membership cost model and partner portal remain in the existing backlog even where they are not comparable Amex merchant-portal tasks. Travel, lounges, deposits, investment products and unrelated Amex businesses are outside this comparison inventory. Financial integrity, accessible operation, fresh resources and real-money-disabled simulation are mandatory gates, never optional tradeoffs within the remaining percentage.

## Historical implementation handoff

The original handoff proposed M0/M1 identity/account/responsibility/invitation/grant work, then M2's one application/card lifecycle and M3's backed transaction/statement/repayment lifecycle, followed by M4's merchant settlement/dispute/payout journey. It proposed corresponding operator projections within each slice and M5 management workflows through the same commands, with M6/M7 verification of the catalog and hosted release gates. [Historical implementation sequence](ARCHITECTURE_AND_MANAGEMENT.md#implementation-order-and-review-gates). Use the current [Delivery plan](../../../planning/DELIVERY_PLAN.md) to choose the next work; this paragraph is not a current backlog or instruction to restart completed foundations.

During the original research handoff, the branch stayed on the existing feature work; no remote push, merge, visitor-setting change or public release occurred as part of that research. The earlier workbook-export decision was independent of the research. Consult current delivery evidence for later publication and approval history.
