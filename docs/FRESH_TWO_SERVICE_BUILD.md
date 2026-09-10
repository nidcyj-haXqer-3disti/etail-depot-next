# Fresh two-service application — D52

The user approved a fresh application and database model on 2026-09-10. This supersedes D51's requirement to retain internal Personal/Household/Merchant types and historical compatibility inside the active application. The prior source is preserved at commit 3d67ee996743eae30a80648298110af3b8268e33 and in the private recovery archive. Prior local databases remain untouched.

Implemented and verified locally at application revision `9cbf2e764aa43edbcd700e8701b1550520d1242c`. [Delivery evidence](FRESH_TWO_SERVICE_EVIDENCE.md) records executed checks, recovery boundaries, preview links and remaining scope.

## One service model

A service names its primary person and has exactly one kind: CARDHOLDER or MERCHANT. Service memberships and explicit action grants belong to that service. Primary/secondary relationships derive from its named primary; permission bundles do not establish responsibility. Identity binding creates no financial service. Enrollment is an explicit command.

Cardholder cards, requests, activity and financial entries belong to their recorded service. A primary oversees that group's cards; a secondary reads and controls only their own permitted cards. Accepted invitations establish membership directly. There are no inferred enrollment rules, profile/default-account indirections or account-type choices.

A Merchant service owns a primary merchant and its submerchants. The primary remains responsible for collection, fees, refunds and disputes. Submerchants are separately attributed collection units; users receive exact merchant assignments and cannot read siblings or Cardholder data. Direct submerchant creation replaces former two-host consent. Payment channels cover SMS, email, invoice, bill, social, QR and website/link. Receipt links identify actual completed sandbox payments.

Operator access is a separate, explicit service assignment. Customer roles do not confer operator privileges. The support console reads assigned cases and records attributed replies and resolution with optimistic versions and retry receipts.

Every card requires its actual issuance request. The old sample-card fallback, unused balance snapshots, historical settlement projections and disconnected dispute-response pipeline are retired. Available card money comes from the ledger. Merchant payment, refund and transfer history comes from actual sandbox commands. A future merchant dispute intake must reference those merchant payments and implement its own reviewed lifecycle; an old Cardholder-activity foreign key is not a substitute.

## Experience and retained foundations

The selected card, money, controls and recent activity stay together. Merchant payment/refund/transfer tables retain filters and exact-record links. These journeys follow the published Amex experience reference in AMEX_EXPERIENCE_CORRECTION.md; no private Amex architecture or full parity is claimed.

Opaque sessions, CSRF checks, exact minor-unit money, the single immutable balanced ledger, canonical card/merchant commands, atomic limits and idempotent effects are retained and rebound to service ownership. The active application has one implementation; the recovery archive is not executable fallback code.

## Fresh database and delivery

Fresh fixed local databases: etail_depot_next_services_test and etail_depot_next_services_preview. Setup must reject unrelated name collisions. Generate a clean schema baseline plus the required financial SQL guards. Never apply it to prior databases. Preview preparation is explicit; ordinary startup verifies completion without migrations or seeds. Use new fictional fixtures only. No real money, live card issuance, processor settlement, verification decisions, external messages or public release are enabled.

Completion requires new-schema database tests, privacy/revocation/concurrency regressions, desktop/mobile and accessibility journeys, source architecture checks and production packaging. Prior test totals do not establish the fresh build's correctness. The larger commercial/provider backlog remains tracked independently.

## Local demonstration and limits

The fictional primary, Alex Morgan, manages two issued cards and Etail Studio with Online store and Pop-up shop. Jamie Morgan sees only the assigned secondary card and Pop-up shop. Morgan Support has explicit customer-care assignments, without customer money authority. The clean preview includes two purchases, seven-format payment channels, completed merchant payments, a full refund, a transfer and Jamie's private support question. Setup and actions use the same domain commands as the tested application.

The finished sandbox covers explicit enrollment, primary/secondary access, invitations and revocation, card issuance and controls, purchases and reports, primary/submerchant creation and management, payment-channel previews, approved/declined payments, full refunds, bounded transfers and assigned support replies. Preview messages, QR codes and payment links require the signed-in sandbox; no external messages are sent. Named invitation recipients are restricted to fictional demo people.

Billing payments, live fees/rewards, real issuance/MIDs, KYC/KYB approval, processor settlement, bank transfers and a new merchant-payment dispute lifecycle are not implemented by this sandbox. The broader [experience gap audit](../planning/EXPERIENCE_GAP_AUDIT.md) remains open. The rebuild does not claim private Amex knowledge or a percentage of Amex parity.
