# Two services, clear responsibility

The [latest dashboard correction](SERVICE_DASHBOARD_DESIGN.md) supersedes residual account-container selection and merchant creation behavior in this delivery-stage design. Its privacy rules remain applicable.

Latest user direction, 9 September 2026. This supersedes the three customer account types and tier differences in D46. Customer navigation offers **Cardholder services** and **Merchant services**. A person may be primary in one group and secondary in another. Service access is independent; none is inferred from access to the other service.

## Customer experience

Start at `/services` and choose a service. Cardholder services shows permitted cards and their named card group. Primary cardholders manage primary and secondary cards, review their group's activity and grant narrowly scoped secondary access. Secondary cardholders see their assigned cards, their own activity/reports, their preferences and their own support cases. They cannot view other cardholders, group-wide balances, other requests or other people's activity through search, exports or direct links.

Merchant services shows primary merchants and individually accessible submerchants. A primary merchant opens a network overview and drills into a named merchant's channels, people, setup and payments. A submerchant opens its own merchant directly. It does not receive primary/sibling transactions, balances, refunds, payout records or private working data. The responsible primary's name may appear to explain who manages payments; that is not a link to its financial data.

Card workflows remain one Add card form and one saved request; payments remain one channel form and the same approved/declined practice command for SMS/text, email, invoice, bill/receipt, social, QR and web. Old context types no longer choose available channel formats or sharing features. Primary controls, secondary card use, payment collection and financial administration remain separate permissions. No role or service label creates spending rights.

Old exact-resource URLs remain usable through these same scoped loaders/components. `/accounts` returns the two-service chooser and `/merchants` returns Merchant services. Opening a submerchant never automatically redirects into its primary merchant. The named selection remains in the URL; there is no first-account fallback.

## Cardholder hierarchy and permissions

A primary **cardholder** is the named responsible person for a card group. Cards held by that person are presented as primary cards; cards assigned to other accepted members are secondary cards. Responsibility belongs to the durable service relationship, not to a physical card number. Freezing or replacing one primary card therefore cannot orphan every secondary card.

| Access | Named primary | Secondary |
|---|---|---|
| Cards and activity | All cards in that exact group, with read permission | Only own cards and card-linked activity |
| Reports/search/export | Same authorized group scope | Own card-linked rows; no unattributed/group totals |
| Create/request cards | Explicit primary creation/request grants | Unavailable |
| Freeze/unfreeze | Own card or explicitly permitted secondary management | Own cards, with the relevant grant |
| Practice purchase | Own held card only | Own held card only |
| People/access | Primary governance and explicit delegation ceiling | No cardholder directory or onward delegation |
| Support | Own cases; linked transaction must be currently visible | Own cases and own visible transaction links |

An old OWNER or MANAGER role does not substitute for named primary cardholder responsibility. A missing/suspended service, revoked primary membership, revoked actor membership or closed group removes card service authority without selecting a replacement. A member's current holder relationship and permission are rechecked before protected retry results and data are returned.

New cardholder invitations offer only own-card read/use/control/activity/preferences, not primary governance or Merchant permissions. They do not transfer the primary role. Previously recorded memberships/grants stay auditable, but the new scope ceiling limits their effect. Primary reassignment requires a separately reviewed lifecycle; there is no unrestricted customer transfer endpoint in this delivery.

Card access has its own state, role and version. Changing or revoking it affects only card permissions and card invitations. The original membership record and merchant grants remain unchanged, including the version used by merchant connection consent and explicitly dependent assignments. A revoked cardholder can accept a new card invitation without losing or regaining any merchant authority. A separately revoked underlying membership cannot be reopened through a card invitation.

## Merchant hierarchy and permissions

The existing immutable MASTER/SUB database relationships now appear as Primary merchant/Submerchant. A current accepted responsible-Merchant Owner/Manager with explicit merchant read permission has primary oversight. An invitation into one merchant unit, or a Viewer role, never creates network oversight. Reads still require the relevant explicit channel/payment/people permission. Each financial command checks its own current permission.

Primary network reads are a separate exact-primary projection. Individual merchant endpoints remain exact-unit projections. Primary oversight covers its own submerchants' merchant records, including creator-private channel work, as requested; this explicitly replaces the earlier exclusion of such work from primary oversight. No cardholder data is included. A submerchant's own channel privacy and scoped assignments continue to restrict other secondary users.

A primary can review historical records of a paused submerchant through a read-only oversight mode. Pause, consent withdrawal and revocation continue to block operating commands. Read access to an old payment cannot reactivate a channel or create a new payment. Refund/payout authority remains with the responsible primary Merchant. Fees, refunds, chargebacks and proceeds stay attributed to the existing primary responsibility and exact merchant unit; multiple separately authorized primary connections remain possible.

## Backend and database

The modular monolith retains one server policy evaluator, one issuing lifecycle, one acquiring command family, one invitation lifecycle and one immutable exact-money ledger. React consumes authorized projections; it does not calculate eligibility or balances.

Migration 9 adds `cardholder_services(accountId, primaryPersonId, status, version)`. The primary person has a composite foreign key to membership in the same group. Card ownership remains `cards(accountId, holderId)`, and activity points to the exact scoped card. This avoids duplicating card-parent trees, financial balances or transaction ownership. A primary with several cards still has one responsibility binding.

Migration 10 corrects the merchant-grant database check to accept `payments.read` and `payments.simulate`, which the canonical submerchant invitation contract already offered. Actual invitation acceptance exposed this mismatch. The fix changes the finite constraint, adds no grants and preserves current assignments. The accepted invitation, channel activation, practice payment and primary network projection are verified together.

Migration 11 adds `cardAccessRole`, `cardAccessState` and `cardAccessVersion` to membership, initialized from the existing values. The original `role`, `state` and `version` continue to represent the underlying membership used by merchant responsibility and assignment dependencies. Card commands write only the independent card fields and a finite set of card permissions. Optimistic versions and retry receipts therefore continue to work without canceling the person's separately authorized merchant connection.

The migration backfills only groups with exactly one accepted Owner. Ambiguous or ownerless groups get no inferred primary authority. New identity binding records explicit cardholder responsibility transactionally. The later dashboard correction makes new Merchant setup independent: it creates no cardholder binding or card grants. Old account enum values remain internal provenance for the existing data and financial responsibility records; they are not customer products, navigation categories or card/channel tiers. No ledger entry is rewritten or moved between owners.

Scope is enforced at list, detail, report/export, saved-report rerun, linked support record, mutation and replay boundaries. Current report authorization and row filtering occur in the same transaction. Secondary projections do not serialize other cardholders' data and then hide it in CSS. Existing merchant setup, cardholder finance and merchant money remain independently scoped.

Historical merchant sales without a linked card and legacy merchant payout/reserve snapshots stay out of Cardholder services. Authorized merchant dispute operations remain available through their independent merchant permissions. The selected merchant's Primary/Submerchant label describes its position in the hierarchy; it does not grant network authority to a read-only user of that unit.

## Preservation, sandbox and remaining delivery

Before migration, private read-only snapshots captured all existing tables. Comparison after migration preserved **84,728 test rows** and **285 preview rows**, across **50 original tables**, byte-equivalent at the normalized row-value level. The new hierarchy was additive. Explicit preview preparation afterwards creates fictional secondary examples using the canonical invitation/card/payment commands; routine startup does not overwrite choices.

The separate migration 10 comparison preserved **102,670 test rows** and **333 preview rows** across **51 original tables**. Counts reflect subsequent deliberate test and preview activity between the two snapshots, not unexplained migration changes.

Migration 11 preserved **132,868 test rows** and **352 preview rows** across the same **51 original tables**, including every original shared membership version and merchant grant.

The existing public Amex research remains a reference for clear primary responsibility, additional-card servicing and merchant drill-down. This service model follows the user's latest simplification; it is not a claim about Amex private architecture or complete product parity. [Earlier card/control references](research/amex/THREE_ACCOUNT_CARD_EXPERIENCE.md) and [merchant references](research/amex/THREE_ACCOUNT_MERCHANT_REDESIGN.md) retain source limitations.

Real money, live provider enrollment/verification, public payment delivery, partial refunds, asynchronous settlement/reconciliation, guardian funding and unresolved D14–17 economic writes remain outside this local slice. No new numerical card limits, credit facilities, fees or liability assumptions are invented. The one shared membership bonus cap remains unchanged. See the delivery evidence for executed checks and final source revisions.
