# D73 — Owner, cards and terminals

12 September 2026. Active product contract for the user-requested redesign. Implementation and release evidence belong in `planning/STATUS.md`; this document does not claim completion.

## Confirmed decisions

The account owner controls the money and access. There are no primary/secondary cardholder product tiers and no submerchants. Cardholder and Merchant remain two services with independent access and **separate money**. The user explicitly chose separate card and merchant balances, and a **total card allowance with no monthly reset**.

- Cardholder services has one owner-controlled card money account. The owner can add cards without an artificial product count cap and gives each card its own total allowance. The owner need not hold a card. Each invited cardholder sees only their named cards, allowance and activity.
- Merchant services has one merchant and one owner-controlled merchant money account. The owner creates flat terminals and assigns named users. A terminal is a collection tool and record scope, never a separate merchant or wallet. All terminals' settled proceeds enter the same merchant money account.
- Merchant proceeds never automatically become card money. An invitation, card, terminal or allowance change never creates money, ownership or access to the other service.

## Everyday experience

| Person | First screen | Main tasks | Hidden |
|---|---|---|---|
| Card account owner | Card money, cards and recent spending | Add money, Add card, change an allowance, freeze a card, invite/remove a cardholder | Spending using somebody else's card |
| Cardholder | Their own cards and remaining allowance | Select own card, review activity/receipt, freeze own card, get help | Group balance/history, other holders, invitations and allowance controls |
| Merchant owner | Merchant money, payments and terminals | Create terminal, give terminal access, collect, settle payments, refund, withdraw, oversee disputes | Other owners' merchants and money |
| Terminal user | Their terminal's payments and next task | Create/share a payment request, read receipts, respond to disputes | Group money, deposits/withdrawals/refund authority, other terminals, access/business controls |
| Assigned processing operator | Assigned processing queues | Process withdrawals/deposits; independently assigned dispute review | Implied customer ownership or spending access |

Headers, footers, forms and empty/recovery states use plain customer terms. One shared Sandbox badge remains. Service entry shows only actual services and optional setup. Shared-access review is reached when relevant; accepting an invitation is never a mandatory post-login step. Member profile shows the person's name and shareable member code; account ownership and resource assignments are shown in their relevant service rather than as a generic configurable role.

Add card is one sequence: choose the actual cardholder, name the card, set its total allowance, review and create. Creating for someone else requires accepted named access. Changing an allowance edits the total spending ceiling inclusive of already-used gross purchases; the screen shows the resulting amount left before saving. There is no monthly renewal or account/card balance allocation.

Give terminal access is one sequence: choose the terminal and intended member, review the fixed operational access, create the invitation, and let that person explicitly accept. There is no permission matrix, delegation chain or automatically expiring new terminal assignment. Invitations expire; accepted access lasts until removal. Previously agreed historical access expiry is preserved during migration.

## Financial invariants

Each money account has a fixed owner, purpose CARDHOLDER or MERCHANT, and USD currency. Each service has exactly one money-account mapping; a money account cannot link both purposes. The existing ledger remains the only writer. New money-account positions are separate from historical service/terminal positions and use uniquely keyed business effects.

Card available spending is `min(card money available, max(total allowance - lifetime gross card purchases, 0))`. Card A's spending consumes Card A's allowance only. All cards compete atomically for the same card pool. No sum of card allowances is advertised as money. Refunds return money to the original card account and do not restore used gross allowance. Owners can explicitly raise a card's total ceiling.

Collections retain immutable merchant and terminal attribution. Unsettled money remains pending. An owner reviews and settles exact eligible payment membership into the merchant money account. Terminal users cannot settle, refund, withdraw or process outcomes. A refund uses eligible unreserved pending collection before settlement, or the merchant account's available money after settlement, and credits the original payer's card account atomically. If merchant money is insufficient, the command fails truthfully without creating a negative balance.

Withdrawal reserves an exact saved amount. A separately assigned operator records completion or failure. Pending money cannot be spent/refunded/withdrawn again. Existing pending deposit records, exact payment membership and outcomes remain valid historical operations. The shared money-account lock precedes service/resource locks; connected payer/merchant operations lock both distinct money accounts in sorted order.

All amounts are integer minor units on the server and strings on the wire. Commands retain current authority, immutable request identity, version checks and one business effect under retry, timeout or concurrent submission. Creating a card, terminal or service changes no balance.

## Scope and database

- `money_accounts` and `money_account_services`: owner and purpose; one exact service mapping, immutable ownership and currency.
- `card_spending_limits` and immutable change records: card-specific total allowance, independent version and cutover review state. Existing card/holder/request identities remain stable.
- `merchant_terminals`: flat merchant-service child with name, status and version. Historical terminal IDs remain the attribution keys for channels, publications, payments and receipts. Old hierarchy metadata is retained as migration history, not active authority.
- `terminal_assignments` and `terminal_invitation_terms`: direct named owner grants, fixed terminal tasks, no onward delegation. Scoped invitation acceptance/revocation uses the existing canonical invitation lifecycle.
- Disputes: actual payment/terminal-bound case, response/evidence text, submitted review and explicit independently assigned outcome. Private support remains a separate Help workflow.

The single policy evaluator derives owner, actual cardholder, terminal operator and explicit platform-operator authority. A forged client role or permission list cannot grant money control. Reads, exports, details, publication checkout and protected retries recheck current scope. Pausing a terminal or revoking its user prevents further unauthorized work; historical records are retained.

## Disputes

A payer raises a dispute for their own completed, unrefunded payment. The terminal's assigned user or merchant owner supplies a response and supporting evidence text, then submits it for review. A separately authorized reviewer may request more information or close with a nonfinancial outcome, including a refund recommendation. Only the owner's explicit refund command moves money. A dispute response is not a chargeback, and no case status silently creates a journal.

## Migration and rollback

Use additive, ordered migrations on the exact existing new-project resources. Never edit deployed migrations, rewrite posted journal amounts, reset Identity, import retired databases or pick an arbitrary first owner/merchant. Existing services receive separate purpose-matching money accounts. Existing master/sub units become flat terminals under their current merchant service; historical attribution is retained.

Move spendable historical positions through uniquely keyed balanced cutover effects, reconciling the exact old and new totals. Preserve pending deposits and immutable receipts. Card allowances migrate from lifetime gross usage plus a conservative share of the old currently remaining monthly allowance; neither duplicate cards nor the cutover may increase aggregate immediately available card allowance. Mark migrated allowances for owner review. New cards use only the total-allowance model.

Archive replaced hierarchy/access metadata. Expired, revoked or otherwise invalid access is not reactivated. Unverifiable legacy delegation requires a fresh owner invitation. A failed migration must roll back atomically rather than leave mixed financial authority. Preview startup continues to verify preparation without migrating or seeding; controlled test/preview preparation remains explicit.

## Acceptance and delivery

First freeze this contract, then implement schema → canonical commands/policy → routes → projections/UI → recovery. Update landing/product/help pages, profiles and invitation screens to the same model. Preserve one Sandbox display and ordinary production layout.

Required proofs include owner without own card; multiple cards for one holder with independent lifetime allowances; pooled card exhaustion under concurrency; isolated terminal users; forged-grant and cross-record denial; no automatic movement between card and merchant money; all terminals settling into one merchant account; insufficient-funds refund; invitation/access loss and identical retries; genuine dispute response/review; pending withdrawal exclusivity; exact migration reconciliation; desktop/mobile/keyboard/accessibility; authentication regressions; production and Netlify build; exact revision CI and hosted deployment verification.

## Public reference checked

Amex's public employee-card guidance supports clear card management, individual controls and an owner overview; its product count limit and charge-account economics are not imported. Its public merchant support separates payments, disputes and account tasks. Its merchant access terms distinguish operational access from banking/account authority. Etail's separate prepaid money accounts, total card allowances and flat terminals are the user's product decisions.

- [US Employee Cards guide](https://www.americanexpress.com/en-us/business/blueprint/help-center/business-card/employee-cards/), inspected 12 September 2026.
- [US Employee Card Spending Limits terms](https://www.americanexpress.com/content/dam/amex/us/customer-service/account-management/emp-controls-spending-limits-terms-and-conditions.pdf), inspected 12 September 2026; billing-period rules intentionally differ from Etail's total allowance.
- [US Merchant Support Center](https://www.americanexpress.com/us/merchant/support-center.html), inspected 12 September 2026.
- [US Merchant Site terms](https://www.americanexpress.com/content/dam/amex/us/merchant/pdf/terms-and-conditions.pdf), inspected 12 September 2026; public role/feature separation, not private architecture evidence.

No authenticated Amex portal, private design, full video audit or parity percentage is claimed in this pass.
