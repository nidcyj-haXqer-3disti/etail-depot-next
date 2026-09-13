# Current source precedence

> **D78 active override — 13 September 2026:** [Clear service workspaces](SERVICE_DASHBOARD_CLARITY.md) makes Amex the Cardholder reference and Stripe the Merchant reference. Separate account overview from named-card detail; use one personal account menu with no authenticated footer. Merchant collection, settlement and payouts have distinct views; routine merchant top-ups are retired server-side while posted receipts remain recoverable. D73 money/permissions and D76 invitations/checkout remain.

> **D77 navigation override — 13 September2026:** [Service menu hierarchy](SERVICE_MENU_HIERARCHY.md) separates account home, cards/payments, resource management, account balance and settings. New top-ups use one money-account workspace; historical funding reviews retain recovery. D76 invitations/network checkout and D73 money/permission rules are unchanged.

> **D76 active override — 12 September 2026:** [Network cards and resource invitations](NETWORK_CARDS_AND_RESOURCE_INVITATIONS.md) governs Visa product intent, create-card-first recipient assignment, exact terminal invitations and public external-card checkout. It supersedes the internal-Etail-only payment path and person-first/member-code invitation requirements. D73 separate balances, total card allowances and owner/holder/terminal isolation remain in force. Historical text below is dated context.

> **D73 active override — 12 September 2026:** [Owner, cards and terminals](OWNER_CARDS_TERMINALS_DESIGN.md) governs the current rebuild. The user explicitly chose **separate card and merchant money** and **per-card total allowances with no monthly reset**. Owners manage cards and one merchant’s flat terminals; invited holders/users have only their own resource access. Primary/secondary customer tiers, per-person monthly limits, submerchant responsibility and shared card/merchant balances are superseded. The text below retains the dated D69–D72 baseline for migration and review history; it does not override D73.


12 September 2026 · D69. The user has approved a fresh prepaid replacement of both sandbox experiences. [FRESH_PREPAID_REBUILD.md](FRESH_PREPAID_REBUILD.md) is the active override for money, checkout, customer navigation and local data replacement. The [product design](PRODUCT_TECHNICAL_DESIGN.md), [project prompt](../02_MASTER_BUILD_PROMPT.md) and [delivery plan](../planning/DELIVERY_PLAN.md) apply that decision. D63–D68 plans and evidence retain their dated history; their allocation demo, guest simulator and preservation-only instructions do not override D69.

## Authority order

1. Latest explicit user decisions within the established resource, privacy and financial boundaries.
2. `project-targets.json` for allowed/excluded resources and release boundaries; this file for conflicts.
3. [D69 prepaid contract](FRESH_PREPAID_REBUILD.md), current project prompt, product design and delivery plan. D69 overrides conflicting historical charge-card, starting-allocation, simulator, navigation and local-generation instructions.
4. [Commercial rules](../contracts/commercial-rules.json), original master §3 and source workbooks for retained outcomes not explicitly superseded. Preserve source costs, membership/reward rules and provenance. The active prepaid product does not acquire borrowing or repayment obligations by implication.
5. Executable schema, commands and tests for implemented behavior; dated [status](../planning/STATUS.md) and evidence for verification. A schema, passing test or ready deploy proves a different fact.
6. Public Amex sources and clearly labelled reviewer observations for experience evidence. They do not determine Etail economics, reveal private architecture or certify parity.

The [historical precedence chronology](SOURCE_PRECEDENCE_HISTORY.md) preserves earlier decisions. “Current” inside a historical artifact refers to its date.

## Active product and money model

Exactly CARDHOLDER and MERCHANT services remain. A named primary funds one prepaid Cardholder group and controls each person's monthly limit across that person's cards. A secondary reads only their own permitted cards/spending. Creating a card, accepting an invitation or raising a limit adds no money. Limits are ceilings, not reserved balances. Spending requires both actual group funds and remaining personal allowance; refunds restore group money but do not restore gross monthly allowance. The disclosed UTC calendar month is an Etail sandbox rule, independent of unresolved membership-year economics.

A primary merchant remains responsible for its own and its submerchants' sales, fees, refunds and chargebacks. Each submerchant has one immutable primary. Delegates have exact authorized units; a person may participate under multiple separate primaries. Merchant enrollment or invitations confer no Cardholder access. Operator processing requires a separate explicit assignment.

After sign-in, the front door offers the two services and account support. There is no global Invitations product or required invitation step. Service-related access review and acceptance remain available without automatic enrollment or permission expansion. Personal/Household/Seller containers, card-to-card ancestry, “Try purchase,” merchant-authored payment outcomes and `/pay` are retired customer paths.

Seven payment presentations remain SMS/text, email, invoice, bill, social, QR and website/link. A merchant explicitly publishes a customer-safe payment request; the payer signs in, selects an eligible own Etail card, reviews the saved amount and confirms. Card activity/debit and Merchant payment/credit commit together through existing owners and paired ledger journals. A full refund returns to the original card group atomically. Publication/copying does not send a message.

Deposits use persisted settlement membership and a reviewed full amount, then remain pending until an explicitly assigned sandbox operator records COMPLETED or FAILED. Pending money is unavailable for refund or another deposit. A failed deposit can lead to a new reviewed attempt for the remaining unrefunded payments in that batch; later collections are separate. Current balances distinguish Awaiting settlement, Processing, Returned deposits and Sandbox bank balance. No customer control declares payment or deposit success.

## Local generation and recovery boundary

D69 replaces the two fixed active local generations. Their originals remain at `etail_depot_next_services_preview_retired_d69` and `etail_depot_next_services_test_retired_d69`, with original OIDs, preserved records and `ALLOW_CONNECTIONS=false`. Fresh databases reuse only the fixed active names, with marker generation `fresh-services-d69`. The canonical seed explicitly funds, sets limits, issues cards, pays published checkouts, refunds and processes a reviewed deposit. Historical rows are not copied or reactivated.

Preparation verifies exact runtime, owner, name, marker and the migration-owned prepaid cutover row. It never adopts a populated unrelated database. Preview startup only verifies a completed generation; it never migrates or seeds. Completed preparation never restores sample permissions or overwrites customer edits. [Tools instructions](../tools/README.md) govern preparation and retained-database recovery. Hosted Database and Identity are unchanged by this local replacement.

## Evidence and remaining scope

The D69 implementation candidate requires its own final integrated evidence. Preserve D68's successful local audit and earlier hosted revision as history, not proof that D69 passed or deployed. The user's earlier confirmation that hosted sign-in reaches Your services remains positive entry evidence; it does not prove this candidate's hosted tasks or complete mailbox/recovery/logout lifecycle.

The unchanged `amex-public-v2` inventory retains 90 comparison tasks and all mandatory gates. The user's 100% ambition remains a target, with no points awarded for documentation or raw test totals. D69's official and third-party screen research is summarized in [the prepaid contract](FRESH_PREPAID_REBUILD.md), with market/date and inspection limits.

External message delivery, automatic provider processing/reconciliation, partial refunds, disputes, reserves, real bank/card rails, broader issuing, billing/rewards and partner operations remain separately scoped. D14–D17 still apply to affected commercial/supervised/facility work; D69 resolves the active adult prepaid funding model, not those broader products. Minors remain guardian-funded, never independent borrowers.

Only the owned new-project resources may be used. Real money and hosted fixture impersonation remain disabled; denied projects, old customer/source imports and unrelated credentials remain forbidden. Existing visitor access and relevant release/review authorizations persist. No merge, deployment or public release is established by these documents. Original XLSX bytes and [cell-addressed extraction](../sources/workbook-extract.json) remain unchanged.
