# Etail Depot — current project prompt

> **D108 scope supersedes this historical application brief:** The user selected public website and vendor links only. Follow [the current public architecture](docs/PUBLIC_SITE_ARCHITECTURE.md), README and status. The account/financial requirements below are preserved history, not active implementation instructions. Existing database records remain preserved and disconnected from the public application.

> **D80 active override — 13 September 2026:** [Unified resource workspaces](docs/UNIFIED_RESOURCE_WORKSPACES.md) makes cards and terminals follow the same create-for-self/others, detail, controls and sharing pattern. Card details contain their own controls and invitations; Merchant Overview is one credit/debit statement, with Terminals owning channels and assigned people. Personal profile/login and service account settings remain separate. D73 money/authority and D76 contact-bound invitations remain.

> **D79 active override — 13 September 2026:** [Consolidated service workflows](docs/CONSOLIDATED_SERVICE_WORKFLOWS.md) puts card Add money on Account home and Return unused money in owner settings; card filters describe use rather than names. Merchant has one Overview / Payments / Team & terminals / Channels / Settings menu, with balance and payouts on Overview and terminal context inside the same workspace. Existing financial, permission and recovery rules remain.

> **D78 active override — 13 September 2026:** [Clear service workspaces](docs/SERVICE_DASHBOARD_CLARITY.md) makes Amex the Cardholder reference and Stripe the Merchant reference. Separate account overview from named-card detail; use one personal account menu with no authenticated footer. Merchant collection, settlement and payouts have distinct views; routine merchant top-ups are retired server-side while posted receipts remain recoverable. D73 money/permissions and D76 invitations/checkout remain.

> **D77 navigation override — 13 September2026:** [Service menu hierarchy](docs/SERVICE_MENU_HIERARCHY.md) separates account home, cards/payments, resource management, account balance and settings. New top-ups use one money-account workspace; historical funding reviews retain recovery. D76 invitations/network checkout and D73 money/permission rules are unchanged.

> **D76 active override — 12 September 2026:** [Network cards and resource invitations](docs/NETWORK_CARDS_AND_RESOURCE_INVITATIONS.md) governs Visa product intent, create-card-first recipient assignment, exact terminal invitations and public external-card checkout. It supersedes the internal-Etail-only payment path and person-first/member-code invitation requirements. D73 separate balances, total card allowances and owner/holder/terminal isolation remain in force. Historical text below is dated context.

> **D73 active override — 12 September 2026:** [Owner, cards and terminals](docs/OWNER_CARDS_TERMINALS_DESIGN.md) governs the current rebuild. The user explicitly chose **separate card and merchant money** and **per-card total allowances with no monthly reset**. Owners manage cards and one merchant’s flat terminals; invited holders/users have only their own resource access. Primary/secondary customer tiers, per-person monthly limits, submerchant responsibility and shared card/merchant balances are superseded. The text below retains the dated D69–D72 baseline for migration and review history; it does not override D73.


Updated 12 September 2026 · D69. This is Etail's project prompt, not a transcription of a reference video's prompt.

## Current assignment

Complete the user-approved prepaid replacement of Cardholder and Merchant services. The customer experience, financial flows and canonical local seed must follow [FRESH_PREPAID_REBUILD.md](docs/FRESH_PREPAID_REBUILD.md). Retain tested identity, policy, request, command and ledger foundations; remove rejected customer simulators and obsolete active navigation. The earlier preservation-only/no-rewrite instructions are superseded for this expressly authorized local replacement. Retain old local generations offline rather than copying their rows into the new sandbox.

Read `project-targets.json` → `docs/SOURCE_PRECEDENCE.md` → this prompt → `docs/PRODUCT_TECHNICAL_DESIGN.md` → `planning/DELIVERY_PLAN.md` → the current `planning/STATUS.md`. D69's prepaid contract overrides conflicting D63–D68 experience text. Dated evidence, original inventories and broader requirements remain available without becoming active demo logic.

## Product brief

Etail has two independent services:

- **Cardholder services:** the named primary adds money to one shared prepaid group and sets each person's monthly spending limit. Cards belong to their actual holders. A secondary sees only their own permitted cards and spending. A primary can manage another person's card but cannot purchase as that person.
- **Merchant services:** a responsible primary merchant manages its submerchants, payment channels and people. A delegate sees only exact authorized units and records. Each submerchant has one immutable primary; people can participate under separate primaries.

Family and team are use cases, not account types. Creating a login creates no financial service, grant or operator assignment. A cardholder invitation grants no Merchant access, or vice versa. The post-login front door shows the two services and account support. Incoming access is an optional service-related task, not a third product.

Use Amex's public card selection, account actions, activity, merchant payment hierarchy and settlement drilldown as the experience reference. Use Etail branding and truthful prepaid terminology. Record each source's market, date, role and actual inspection. Third-party/historical video is supporting evidence, not current private-portal access. The 100% ambition is a target, not a score inferred from tests or visual similarity.

## Financial and customer workflow contract

Creating a card, accepting access or raising a limit never creates money. Add money has amount/source, saved review, explicit confirmation and receipt. Only an explicit funding command adds group funds. Monthly limits cover all cards held by that person in that group; the available amount is the smaller of remaining allowance and group funds. Limits renew by the disclosed UTC calendar-month calculation. Refunds restore funds, not gross monthly allowance. Never sum limits as money or imply secondary visibility into group funding history.

A payment starts at a published merchant request. The authenticated payer selects an eligible own card, reviews the saved amount and confirms. The card purchase and merchant payment, their links, receipt and paired balanced journals commit in one transaction. Remove customer-authored purchase descriptions, approved/declined simulator choices, `test-payments` HTTP writes, guest order/attempt mutation paths and `/pay`.

A full refund returns to the original Cardholder group and debits the merchant's applicable collection, returned-settlement or completed-deposit balance atomically. A processing deposit blocks refund until its outcome is recorded. The merchant reviews exact saved payment membership and the full deposit amount; a new request reserves money as PENDING. Only a separately assigned operator records COMPLETED or FAILED. Failed-deposit retry is a new reviewed deposit over remaining unrefunded items in the original batch; it never sweeps in later sales or rewrites old deposit items.

Current Merchant money has four definitions: Awaiting settlement, Processing, Returned deposits and Sandbox bank balance. Historical completed deposits are period activity, not the current bank balance. Payment, refund, settlement and deposit are separate attributed records. No instant arbitrary transfer or customer “simulate success” control remains.

Unknown responses retain the exact operation and immutable payload. Valid JSON is insufficient: validate success shape and expected identity before navigation or refresh. A later denial does not prove the first attempt failed. Hide unavailable private context and preserve visible recovery for the original owner. Funding, spending-limit, card payment and operator commands must never retry as a different operation. Saved funding/checkout reviews have durable URLs; other mounted-owner recovery limits remain documented and tested.

## Implementation discipline

Freeze the task's screens/states, owning command, scope, money invariants and acceptance examples before extending the implementation. Work in complete schema → command/policy → API → UI → recovery/test slices. One policy evaluator, saved card-request lifecycle/form, issuance owner and ledger writer remain mandatory. Bounded parallel owners may share agreed contracts; they must not create parallel engines.

React consumes server projections and invokes commands. The server rechecks current identity, ownership, permissions, readiness and versions on reads, mutations, exports and protected retries. Service locks serialize funding, limits and spending; connected operations lock participating services in sorted order. Enforce funds, limits, unique effects, resource links and immutable journals in PostgreSQL. Preserve exact integer minor-unit money and explicit currency; rates remain exact decimals.

Issuance stays primary-only in this sandbox. Merchant refunds and deposit requests remain responsible-primary actions; collections do not imply them. Operator deposit processing is distinct from support-only access. Late verified future provider events require reconciliation even after freeze/revocation; D69 does not implement that provider network by naming sandbox states after it.

## Environment and replacement

Retain the Next.js/React/TypeScript modular monolith, lockfile, managed PostgreSQL/Drizzle migrations, Netlify adapter, server-side Identity and opaque sessions. Exact pins are in the package/lockfile; change them only for a verified need. No dependency or authentication-provider replacement is part of this task.

Use only repository `nidcyj-haXqer-3disti/etail-depot-next` (1361184741) and Netlify site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`, with all recorded denied targets untouched. Read back identities before external mutations. Existing visitor access stays unchanged.

The old fixed local preview and test databases are preserved under their `_retired_d69` names with connections disabled. Their replacements use the original fixed active names and `fresh-services-d69` markers. Follow [tools/README.md](tools/README.md): explicit preparation applies additive migrations and canonical seed commands; startup does neither. Preserve deployed migration history, ledger triggers, private retirement receipts and older retained databases. Do not copy legacy rows or re-enable retired databases for application use. No hosted Database/Identity reset is authorized by this local replacement.

`ENABLE_REAL_MONEY=false`. No real payment, issuance, bank/card details, lending, verification decision or hosted fixture impersonation. Keep secrets out of code, logs, URLs and chat. Existing purchase, DNS, external-message, review and release boundaries persist; no force-push or silent merge.

## Retained scope and acceptance

Commercial source fees/costs, membership pricing, base cashback, the single shared Premier annual cap, reversals, renewals and workbook provenance remain required where applicable. Extra services/cards cannot multiply a cap. Earlier charge repayment/facility designs are future requirements if separately resumed; they do not govern active prepaid spending. D69's UTC spend month does not resolve D15's membership year. D14–D17 remain open for their broader affected writes. Supervised users remain guardian-funded, never independent borrowers.

External delivery, asynchronous provider reconciliation, partial refunds, disputes/reserves, live rails, replacement/closure, billing/rewards and broader partner/operations work remain explicit future slices. Publication/copying is not SMS/email delivery, and customer support is not a dispute lifecycle.

Verify a connected journey: sign in → create group → add money → set person limit → issue a card without funding it → pay a published merchant checkout → match both records/receipts → refund to the original group → review settlement/deposit → separately process and reconcile the outcome. Verify primary/secondary and primary/delegate isolation, support/processing assignments, currency precision, concurrent money races, malformed responses, access loss and identical retries. Check responsive, keyboard and accessible behavior for each role.

Record exact source/tree/schema, environment, commands, failures and unexecuted checks. Final D69 test totals, visual acceptance, packaging, publication and hosted acceptance must be filled from actual evidence; previous passing D68 results are history. The user's earlier hosted sign-in confirmation does not certify this revision. Update status, delivery plan and decisions at handoff, stating what remains. A document, test suite or ready deployment is not whole-product completion.
