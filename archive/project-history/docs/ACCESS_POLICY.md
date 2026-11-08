# One action-policy and control model

> **Historical account-model specification — superseded for active work.** Follow [Product and technical design](PRODUCT_TECHNICAL_DESIGN.md) and [Delivery plan](../planning/DELIVERY_PLAN.md). References below to “current” account scopes, host relationships, role templates and implementation status describe an earlier model, not instructions to restore it.
>
> This notice changes model/status authority only. Existing deny-by-default security, privacy, financial responsibility, release approval and commercial obligations remain required unless explicitly superseded by an authorized decision. Retained requirements are not current validation evidence.

Current override: [Two-service design](TWO_SERVICE_DESIGN.md) governs customer navigation, named primary/secondary card scope and primary/submerchant scope. Conflicting three-tier and broad secondary visibility rules below are historical. Financial invariants and unrelated requirements remain.


This is an implementation contract. The action matrix is refined into executable policy tests before release; UI visibility is not an enforcement mechanism. The merchant hierarchy follows [Merchant hierarchy and payment channels](MERCHANT_HIERARCHY_AND_CHANNELS.md). The local typed scope, consent, invitation and channel-draft subset is implemented; provider and financial policies below remain target requirements. See [current evidence](MERCHANT_CHANNEL_EVIDENCE.md).

## Evaluation

One `evaluate(serverContext, action)` returns `{allowed, reasonCode, remediation, scope, policyVersion}`. Inputs are server-loaded and include current product status, accepted access, legal responsibility, guardian relationship, sponsor eligibility, session/MFA level and environment. Default deny. A feature capability is not permission, and a role is not product approval.

The policy uses typed account and merchant contexts (`ACCOUNT` or `MERCHANT_UNIT`). Keep `loadAccountScope` and its Personal-owner/privacy checks for account operations. The implemented transaction-aware `loadMerchantUnitScope` feeds the same evaluator; it loads the merchant, immutable master ancestry, accepted host/sponsor relationship, direct or explicit oversight access, grant dependencies and current restrictions. It does not require an outside merchant helper to join the host account. Browser-supplied scope, role, provider MID or capability output never establishes authority.

Use the same evaluator for routes, list projections, document access, exports, approval submissions and operator commands. Workers have narrow machine capabilities bound to an existing operation/event; they do not get an arbitrary system-owner bypass. Verified clearing must reconcile a legitimately started operation even if the initiating member later loses access; no new user command is authorized on that basis.

Backend capability projection examples: `cards.create`, `spend.authorize`, `payments.request`, `payments.refund`, `payouts.request`, `funding.deposit`, `funding.release`, `people.invite`, `people.changeRole`, `controls.update`, `activity.readOwn`, `activity.readShared`, `statements.read`, `documents.read`, `account.close`. Every denied action has a safe plain-language reason and, when allowed, a canonical remediation link that preserves the saved request.

## Role templates

| Capability | Owner | Manager | Cardholder | Viewer |
|---|---|---|---|---|
| Read account summary | Yes, permitted financial scope | Explicit shared scope | Own assignments and necessary available allocation | Assigned read scope |
| Read all private Personal history | Only that Personal owner | No default | No | No |
| Spend on an assigned active card | Only when eligible holder/explicit spend grant | No default; separate holder assignment | Yes within assigned controls | No |
| Submit card issuance | Product-eligible owner, step-up where required | Only explicit `cards.create` grant | No default | No |
| Freeze assigned card | Own or managed permitted cards | Explicit managed scope | Own card; cannot unfreeze a parent freeze | No |
| Raise limit | Within product ceiling and role authority | Only delegated controls ceiling | No | No |
| Invite/manage people | Within account and delegable ceiling | Explicit permission | No | No |
| Refund/payout/release collateral | Separate action, appropriate step-up/approval | Only specific delegated permission, not generic admin | No | No |
| See/approve management economics | Separate staff role only | No customer-role implication | No | No |

Owner denotes governance, not blanket legal authorization. A business representative cannot exceed the financial responsible party/product approval. Managers can also be cardholders through an explicit assignment; the policies are orthogonal. Role-template defaults are least-privilege; user-approved templates may be versioned, not silently expanded.

One invitation lifecycle binds the intended person and exact typed target. Account acceptance creates account membership; merchant acceptance creates merchant access only. Keep `PENDING → ACCEPTED | DECLINED | REVOKED | EXPIRED`, expiry, single use, optimistic versions and retry receipts. A merchant offer records its named unit and sponsor, exact actions, channel assignments/types, amount/currency ceilings, access expiry and authority dependencies. Acceptance rechecks the current grantor, reviewed scope, parent relationship, ceiling and applicable guardian/product prerequisites. It cannot silently narrow or widen the offer. Account roles remain account roles; merchant permission presets do not create them.

An email or phone string is not identity. Hosted invitation delivery requires verified intended-person binding; local fictional invitations retain the isolated fixture guard. Decline creates no access. Acceptance creates no unrelated membership or membership charge. A person cannot delegate powers they lack or exceed their live delegable ceiling. Two-person approvals bind action payload digest, typed target, requester, independent approver and current permissions; editing the payload invalidates approval. The requester cannot approve their own action.

## Household boundaries

Membership of a Household shares only its explicitly shared content. Delegated adult spending points to a specific allocation backed by a responsible person's facility; no automatic visibility into that adult's unrelated transactions, funding totals or Merchant records. An independent adult can keep a separate private Personal context and provide only declared budget/activity data.

A supervised participant is guardian-funded; the parent retains funding/limit/merchant/Merchant authority. Role edits cannot convert the child into a borrower, independently activate Merchant, create credit, change payout destinations or grant another person access. Minimize stored child data. No fabricated age verification; use declared fictional persona only in mock tests.

Household collection uses its named sub-MID under an explicitly accepted Merchant master relationship. A Household member or outside helper needs an accepted grant on that merchant unit. Household membership alone is insufficient; outside merchant access must not create Household or Merchant membership. Review may explicitly make a member's merchant assignment depend on continued Household membership. Leaving then invalidates that assignment; a separately accepted direct merchant appointment is separately visible and managed, never silently substituted as a fallback.

A supervised person cannot independently establish a merchant relationship, select legal/settlement responsibility, invite helpers, change routing, refund or request payouts. Any later supervised collection requires verified guardian/age/product prerequisites and a narrow assignment; it stays unavailable while these are absent. The Household is not made an independent borrower or merchant of record by its sub-MID label. Attribution follows the explicitly approved responsibility model rather than a family relationship or role.

## Merchant hierarchy and channel boundaries

A Merchant hosts a master merchant unit; Personal and Household host sub-units with exactly one immutable master parent each. Sponsorship requires both authorized master and host acceptance. Personal financial access remains owner-only, and Personal merchant access is owner-only by default. A master administrator may receive explicit descendant merchant oversight, not a wildcard covering current/future children, host cards/balances/spending, Household people or creator-private channel drafts. Use the separately consented merchant identity for an outside operator's view.

Effective merchant authority intersects accepted unexpired access, its still-valid grant lineage, accepted host/sponsor relationship, master ceiling, sub-unit controls, channel/record visibility, assigned channel IDs/types, amount/currency bounds and action prerequisites. Creator-private content requires owner scope; reading shared merchant records needs its own explicit permission. Separate channel preparation, publication/pause, distribution, delegation, financial servicing, routing and payout controls. Permission to send a link is not permission to change its amount, publish a channel, refund, spend or change settlement instructions.

Outside helpers have no onward delegation by default. Changing a permission preset cannot broaden the recorded assignment. Revocation permanently invalidates dependent grants; a replacement grant has a new identity and does not revive an old chain. Temporary parent suspension instead blocks affected new use. A child unpause cannot override a master restriction. Recheck current authority before returning protected retry results and before queued user-initiated delivery; already established payment events retain their narrow reconciliation authority.

The user confirmed master Merchant responsibility for sub-MID sales, fees, refunds and chargebacks, and multiple separate Merchant associations per host. Each sub-unit records one immutable responsible Merchant. Provider merchant-of-record/debit routing, settlement beneficiary and payout configuration must be compatible and independently evidenced. Draft work can proceed with gateway disconnected; acceptance, a role or a mock identifier cannot bypass processing prerequisites. Pending relationship review/acceptance uses named host/master authority without preexisting child grants; intended recipients use pending-offer scope. Both are narrow contexts in the same evaluator, not operating access. A MASTER root has no parent-sponsorship prerequisite.

Public SMS/email/social/QR/web presentations use a separate limited guest-access boundary. Store only hashes of opaque public/checkout tokens, bound to their channel or exact order, permitted audience/actions, expiry and revocation state. A reusable public token may identify a stable channel; each new order pins the authorized immutable revision and processing/responsibility bindings. An order token cannot be substituted for another order. These tokens grant no merchant-management or account API access and contain no recipient, session or provider credentials. Public views disclose only the information required for that guest interaction. Old distributed URLs must recheck current parent/channel restrictions before new checkout/payment; pausing new use does not rewrite established payments or receipts.

## Spending restriction composition

Available backing and all applicable ceilings are enforced atomically. Card policy may narrow but never widen account/facility policy. Limit edits preserve committed/held usage. Hard declines and informational alerts are distinct; do not promise provider-enforced behavior absent the capability.

Freeze hierarchy: facility/account freeze blocks new authorizations on every downstream card; participant freeze blocks that person's new activity; card freeze affects that card. A downstream unfreeze cannot override a parent freeze. Historical genuine settlement/chargeback/reversal events still process with reconciliation evidence.

Parent rule changes invalidate stale capability projections. Writes re-read live policy; a revoked grant fails immediately on subsequent protected request and background user-initiated operations recheck authority before irreversible submission. Scope all cache keys by actor, typed target and all effective policy/relationship versions, or use no-store.

## Acceptance examples

Owner of A with Viewer in B cannot issue a B card by changing account ID, resource ID, request body or browser state. A Viewer cannot read an A attachment or export by guessing its identifier. Cardholder cannot invoke issuance even on their own funding assignment. Two accounts backed by the same facility cannot bypass combined limits. A partner credential cannot act as staff. A support role does not imply payout or finance approval. Stale sessions cannot resurrect a revoked relationship.

For sensitive financial-data boundaries, test both that unauthorized requests fail and that authorized scoped operations still succeed. Avoid privacy fixes that make every user unable to work.

An outside operator can use an accepted assigned sub-MID while every Household card, balance, directory, sibling merchant and private draft endpoint stays denied. Test acceptance against grantor withdrawal, membership-dependent exit, parent suspension against child writes, replacement grants without descendant resurrection, permitted versus forbidden channels/amounts and old public URLs after restriction. Concurrent one-time channel use must not create multiple independently payable orders; publication and public possession never imply account access. Verify both successful authorized journeys and rejected scope substitutions through real API and PostgreSQL concurrency tests.

### Merchant-owned merchant-service navigation

The Merchant account is the management home for its immutable master and permitted child units. The account-scoped merchant projection requires accepted account access, directory membership for the exact unit, and current per-unit policy; it rechecks master/host identity. Personal/Household contexts can select only their own host units. Merchant-wide navigation is not a new permission grant and does not expose creator-private channels or host financial data. Outside helpers keep resource-only views through accepted assignments. Compatibility links may resolve the exact responsible Merchant or host only after the same guard; they cannot infer account membership from merchant access.
