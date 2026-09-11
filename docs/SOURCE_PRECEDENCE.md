# Current source precedence

11 September 2026 · D63–D67. The user identified missing capabilities in the walkthrough and explicitly resumed the actual full sandbox build. D65 lifts the design-only pause. Build complete slices from the consolidated plan; the walkthrough is review evidence, not executable backend behavior. The active build contract is [ACTIVE_SANDBOX_BUILD.md](ACTIVE_SANDBOX_BUILD.md), refined by the [Cardholder](CARDHOLDER_EXPERIENCE_REDESIGN.md) and [Merchant](MERCHANT_EXPERIENCE_REDESIGN.md) experience contracts.

## Authority order

1. Latest explicit user decisions, within the established resource, privacy and financial boundaries.
2. `project-targets.json` for allowed/excluded resources and release boundaries; this file for conflict resolution.
3. [Current project prompt](../02_MASTER_BUILD_PROMPT.md), [product and technical design](PRODUCT_TECHNICAL_DESIGN.md) and [active delivery plan](../planning/DELIVERY_PLAN.md). These replace conflicting model/navigation/provisioning/sequence instructions in earlier briefs, contracts and milestone prompts.
4. [Commercial rules](../contracts/commercial-rules.json), original master §3 and original workbooks for retained economic formulas and feature outcomes not explicitly overridden. Missing rates and unresolved financial policy remain missing/unresolved.
5. Executable schema, commands and tests for what exists; dated [status/evidence](../planning/STATUS.md) for what was actually verified. Schema enums, source inventories, passing local tests and a ready deploy each prove different things.
6. Public official Amex references and labelled reviewer observations for experience evidence. They do not determine Etail liability/economics, prove private architecture or certify parity. Official vendor documentation governs implementation facts when verified for a concrete change.

The [historical precedence chronology](SOURCE_PRECEDENCE_HISTORY.md) preserves the earlier decisions and references. “Current” or “latest” inside a historical artifact refers to its date, not this authority order.

## Settled active model

Exactly CARDHOLDER and MERCHANT services in the schema, backend and customer interface (D52). A named primary person oversees their card group; a secondary reads only their own permitted cards/data. A primary merchant oversees its separately attributed submerchants; delegates have exact authorized scope. Each submerchant has one immutable primary, and a person may participate in separate units under multiple primaries. Primary responsibility for sales, fees, refunds and chargebacks is already decided.

Personal/Household/Seller account types, host-account ancestry, compatibility account selection, dual consent for obsolete host containers and card-to-card parent records are retired. Family/team/supervised use cases and their financial/privacy requirements remain. Identity, service participation, spending/issuance, merchant delegation and operator access are separate authorities. One policy engine, request lifecycle, issuance owner and ledger remain mandatory.

Seven channel presentations remain SMS/text, email, invoice, bill, social, QR and website/link. A receipt follows authoritative payment success. Explicit publication now opens a separate guest practice checkout with private, persistent orders/reviews/receipts; the signed-in preview remains separate. Copying a published link does not send a message. External delivery and asynchronous payment processing remain required and unimplemented.

## Current scope and evidence

D60 authorizes deliberate sandbox participation for verified email members; D61 calls for connected customer journeys; D62 records the email repair and its remaining hosted acceptance. D63 consolidates planning before further implementation; D64 provides the [interactive review companion](DESIGN_WALKTHROUGH.md). The current application already exists on the exact new-project resources in `project-targets.json`; no new-project provisioning is needed merely to resume work.

[The active delivery plan](../planning/DELIVERY_PLAN.md) supersedes the execution order and account model of [M0–M7](../planning/backlog.json). The original JSON/CSV, 72 acceptance cases, API/workflow inventories and milestone prompts remain source-to-scope records with stable IDs. They are not an instruction to reseed GitHub issues or implement obsolete account architecture. Preserve their economic, security, operating and full-feature outcomes under the current model.

[The original experience gap audit](../planning/EXPERIENCE_GAP_AUDIT.md) and earlier delivery totals are historical. The current design's source-backed capability table governs today's implemented/missing distinction. D65 implements per-person Cardholder management, saved request history, primary/holder freeze protection, Merchant period activity/export, private payment-linked support and the bounded published-link/guest-order slice. Integrated local database/browser/visual/recovery checks passed; hosted release acceptance remains separately recorded. Open work includes external delivery, asynchronous provider reconciliation, partial refunds/disputes/reserves/settlement and transfer exceptions, broader issuing/billing/rewards and partner/operations capabilities.

The user confirms that hosted sign-in reaches Your services. Record this as user-reported positive entry evidence; it does not establish the entire confirmation/recovery/reload/logout lifecycle or the current candidate's hosted task acceptance. Preserve the unresolved checks in the status and email evidence records.

The user's 100% target uses the unchanged 90-task comparison denominator and mandatory gates in [the v2 inventory](../planning/amex-comparison.json). Historical 90%/v1 references explain earlier research, not a competing active target. No parity credit is awarded by changing the target or writing this plan.

## Preserved boundaries and decisions

Only the new owned repository/site/database/Identity/secrets may be used. Denied targets and old customer/source imports remain forbidden. Real money and hosted fixture identity remain disabled. Existing visitor access is unchanged. Existing user authorization persists; review, publication, purchases, DNS and external messages retain their relevant boundaries. Do not introduce new approval requirements from historical wording.

Keep exact minor-unit money, explicit currency/rates, immutable balanced journals, atomic backing/limits, distinct liabilities and unique business effects. Select/Premier are plans, not services. More cards/services cannot create more shared Premier bonus caps. Preserve source costs, reward reversals, billing/refund/renewal rules and workbook provenance; an estimate is not financial posting.

D14–D17 remain unresolved for their affected money: rounding, membership calendar, sponsor attribution and explicit responsible funding. Resolve them using service/person/funding relationships without restoring retired account types. Minors remain guardian-funded, never independent borrowers. Continue unaffected design/testing while affected writes remain unavailable; do not guess policy.

Original XLSX bytes and [cell-addressed extraction](../sources/workbook-extract.json) stay unchanged. The extraction contains cached values/formula text, not recalculated results. Trace financial fixtures to authoritative cells and formulas; missing is different from zero.
