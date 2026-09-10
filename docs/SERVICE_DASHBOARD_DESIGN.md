# Service dashboards and connected responsibility

Implementation design, 9 September 2026. This supersedes the residual customer-facing Personal/Household/Merchant directory described by D47. [The two-service privacy rules](TWO_SERVICE_DESIGN.md) remain in force. The front door presents **Cardholder services** and **Merchant services**, each with useful work and its own permissions. Preserved account types describe stored financial provenance; customers do not choose a type before managing a card or merchant.

This document describes the local source implementation. Final production-build, browser, accessibility and preservation receipts belong to the delivery evidence maintained separately. A dashboard is not a new financial engine or proof of complete Amex parity.

## Reference and customer model

[Cardholder dashboard research](research/amex/CARDHOLDER_DASHBOARD_ROLES.md) supports recognizable selected cards, attributed activity, connected secondary holders, focused controls and continuous access-management tasks. [Merchant dashboard research](research/amex/MERCHANT_DASHBOARD_ROLES.md) supports useful payment summaries, persistent merchant selection, primary/dependent hierarchy and task-specific drilldowns. Both distinguish official descriptions, public illustrations, historical footage and Etail recommendations.

Etail deliberately gives secondary cardholders stricter privacy than the account-balance visibility described in the US Amex Additional-card FAQ. Amex Account Manager and corporate administrator roles are not imported as Etail permissions. Amex location MIDs are not evidence that Etail's delegated collection units have received provider approval.

| Customer relationship | Visible work | Authority retained |
|---|---|---|
| Primary cardholder | Own cards, connected secondary cards and their permitted card-linked activity. | Current named responsibility plus each stored scope's action permissions. |
| Secondary cardholder | Own assigned cards, own permitted activity and supported own-card controls. | Accepted Cardholder access; no other holder's card, activity or primary financial totals. |
| Primary merchant | Its own collections and authorized submerchants, with payment/setup attention items. | Current primary merchant authority and the specific read or operation grant. |
| Shared merchant user | Only separately permitted merchant units and tasks. | Exact merchant assignment or current controller authority; no sibling network or Cardholder access. |

A person can be primary in one relationship and secondary in another. The interface may show both; the server never unions their grants. Managing a card does not permit purchasing with another person's card. Merchant management does not authorize card creation, and Cardholder revocation does not revoke Merchant membership.

## Durable profile, unchanged financial ownership

`cardholder_services` remains the named responsibility binding for each stored scope. `cardholder_profiles` adds one customer profile per named primary person. Its optional `defaultAccountId` is a recorded destination for **new** card requests and invitations, initially derived from the person's unique own scope. It is not selected from alphabetical order, last navigation, the first card or whichever scope has broader permissions.

Migration 12 creates and backfills this metadata. A trigger maintains the profile when a named responsibility binding is inserted or its primary changes, filling an absent default when a matching own scope exists. It creates no grants, cards or journal entries. The profile/default foreign keys establish existence; runtime policy checks still establish authority. A stale, missing, suspended or mismatched default cannot silently fall back to another scope.

Existing account, membership, grant, card, request, activity and ledger IDs remain in place. Several old contexts with the same primary appear in one dashboard without merging money, obligations or permissions. The hierarchy is a named primary person's connected cards; it does not invent a physical parent-card link. Freezing one primary card therefore does not redefine which person is responsible for secondary cards.

Card access continues to use its independent role, state and optimistic version. Shared underlying membership role/state/version and Merchant grants remain separate. Primary access administration requires the named primary binding, current Cardholder role and applicable delegation ceiling. Holder selection and issuance separately check holding permission and sandbox eligibility. An independent Merchant Viewer role is neither a card prohibition nor a spending grant.

## Server projection and exact routing

`workspace/dashboard-service.ts` builds the Cardholder projection in a repeatable-read transaction. The context helper loads membership, named primary, primary availability and accepted grants, retaining each grant's account scope. The canonical evaluator decides every action. Card rows are queried using permitted primary scopes or permitted secondary scopes restricted to the signed-in holder; projected controls recheck the exact scope. Activity joins its card by both card ID and account ID. Unlinked merchant sales cannot enter the Cardholder dashboard.

The dashboard has no aggregate financial balance. Practice funds come from the existing ledger for the exact card. Historical illustrations remain distinguishable from funded sandbox cards. The authenticated `GET /api/v1/cardholder-services` is a read projection; existing mutation routes still invoke the same card commands.

| Selection | Resolution and result |
|---|---|
| `?card={id}` | Resolve the card's stored scope; require that card in the current authorized projection. Open existing card controls. |
| `?request={id}` | Resolve the saved request's scope; require primary request authority there. Resume that same request. |
| `?transaction={id}` | Resolve the transaction's scope; require a currently visible card-linked row. Open its detail. |
| `?new=1` | Resolve the actor's persisted profile default; require current primary request authority. Opening the form creates nothing. |
| `?manage={profileId}` | Resolve the actor's own profile default and require primary access administration. This is the destination for invitations for new cards. |
| `?manage={storedScopeId}` | Review access for existing cards in that exact authorized primary scope. No lookup of a more permissive substitute. |

Malformed, conflicting, missing or unauthorized selections produce an unavailable view. Closing returns to the dashboard page. The same stored card/request IDs continue to identify the same resources. Query parameters choose a view; they do not carry an authorization decision.

## Connected workflows and bounded lists

The Cardholder dashboard groups **Cards you manage**, **Your secondary cards**, **Secondary cardholders**, **Recent activity** and **Saved card requests**. Card rows retain nickname, masked ending, holder, state and actual practice funds. Primary and secondary relationships remain explicit when a person has both.

**Add card** opens the existing single saved-request form. It uses the bound scope's eligible holder options, reviews exact practice allocation and calls the existing submit command. Issuance and funding retain their unique request/business effects. **Try a purchase** remains an explicit own-card sandbox command with current permission, holder, frozen-state and atomic funds checks. Errors and uncertain replies use existing refresh, version and retry behavior; the dashboard adds no second writer.

Cards use stable nickname/ID ordering and pages of 30. Counts describe the authorized set; card search and the secondary-holder list describe only the loaded page. Recent activity shows the latest 25 permitted card transactions, and unfinished requests show up to 20 recent drafts or blocked requests. These are dashboard windows, not completeness claims. Exact resource links can resolve records beyond the dashboard window. Offset pagination is not an immutable export snapshot: inserting a card between separate page loads can shift a later page.

Cardholder **People** is deliberately a compatibility task over existing independent scopes. Reviewing one card's access can affect other cards held in that same scope; the editor shows affected cards. If the same person holds cards in two old scopes, reviewing one does not change the other. The global invitation action targets the persisted default for new cards. This delivery does not introduce a global person-level revoke, merge grant sets or imply that an invitation automatically covers every existing card. Existing reports and support likewise retain their exact authorized scope; service-wide report aggregation is not added here.

After access changes, refreshed projections remove inaccessible cards, activity and controls. Exact details fail authorization; saved reports and exports rerun against current access. If no report source remains available, the service denies the request. Revocation preserves historical financial records rather than deleting them.

## Merchant dashboard and service independence

`acquiring/dashboard-service.ts` now projects merchant work directly for `/merchant-services`. Candidate discovery is followed by the existing exact merchant scope loader. The repeatable-read projection separates primary networks from shared units and supports all-permitted, exact-network and exact-unit views. It displays server-calculated collections, refunds, transfers and available practice funds, plus channel readiness and next steps. A restricted metric is unavailable, not zero; combined metrics remain unavailable if an included unit lacks the relevant read permission.

Payment and transfer rows name the collecting merchant. Recent lists disclose their 12-payment and 6-transfer limits and link to the exact merchant's permitted history. Existing channel, People, verification and payment commands remain under that merchant. The same seven presentation formats continue to share one channel form and lifecycle. Selecting a merchant or creating a submerchant does not insert Cardholder grants. Primary oversight remains bounded to its own network; delegated access never inherits sibling or primary financial data.

Migration 13 replaces the old unique master/controller pair constraint with one primary unit per responsible merchant account. Multiple named submerchants can share a controller, while every submerchant keeps one immutable primary and separately attributed ledger records. The new primary creation command resolves the authenticated applicant binding; the submerchant command resolves its controller server-side and records both consents atomically only when the actor currently controls both sides. Neither creates Cardholder access.

The merchant implementation is present in source; final test/browser receipts are recorded in [delivery evidence](SERVICE_DASHBOARD_EVIDENCE.md), not inferred from this design. Sandbox gateway/enrollment, test purchases, refunds and transfers are not real approval, live processing, bank settlement or external message delivery.

## Verification and remaining boundaries

`tests/integration/service-dashboard.test.ts` exercises profile collapse without moving financial records, primary/secondary grant separation, exact detail resolution, forged selectors, persisted default denial without fallback, revocation of detail/report/export access and suspended profile metadata. The independent-role regression additionally exercises issuance and purchase for a Merchant Viewer with Cardholder use, then rejects both retry and new purchase after card revocation despite a broad base role and retained grants.

This design does not create real cards/PANs, underwriting, primary responsibility transfer, official billing statements, live repayments, commercial fees or live acquiring. Supervised-card guardian setup remains a separate unmet requirement. Delivery evidence records the actual checks executed, failures and fixes, and preserved database comparisons; this document awards no completion percentage.
