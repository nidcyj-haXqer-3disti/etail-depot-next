# D80 — matching card and terminal experiences

13 September 2026. This is the current user-requested experience override to D79. Existing owner/recipient authority, separate Card and Merchant money, per-card total allowances, saved financial commands and disabled real-money operation remain. The user requests a familiar pattern across both services, with all object controls on the object's detail page and personal profiles clearly separate from service settings.

## Reference findings and adaptation

Public official sources checked for this task:

| Source | Observed pattern | Etail decision |
|---|---|---|
| [Amex US app](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/) | Account switching and direct card freeze controls in Home/Account. | Keep the named card, available spending, status and direct controls together. No redundant managed-card destination inside a selected card. |
| [Amex security center](https://www.americanexpress.com/en-us/security/) | Card contact details and login authentication details serve distinct purposes. | Preserve the difference between a person's login/profile and controls on a financial service. No inference that an unverified display name or email grants access. |
| [Stripe Dashboard](https://docs.stripe.com/dashboard/basics#dashboard-settings) | Personal, account and product settings have distinct scope; operational access is assigned by role. | Personal details and sign-in stay in the global profile area. Service account settings describe the selected card or merchant account and permitted service controls. |
| [Stripe balance summary](https://docs.stripe.com/reports/balance) | A bank-statement-style report records balance changes and payouts, with drilldown into categorized activity. | Merchant Overview becomes one scoped statement with credit/money-in and debit/money-out columns. Internal settlement movement must not be counted as a second sale. |
| [Apple sharing options](https://support.apple.com/en-ca/guide/iphone/-iphc572ca489/ios) | Sharing presents available destinations and actions in a compact, recognizable control. | Share an invitation using a native share sheet when available and accessible email/text/copy choices. A user chooses and sends through their app; a share action does not prove delivery. |

These are public interaction references, not private-dashboard access, architecture disclosure, product parity or connected financial rails. One guessed Amex merchant user-information URL failed to open and is not evidence. Etail's prepaid owner model and flat online terminals remain explicit product adaptations.

## One customer pattern

1. Open the service overview.
2. Open Cards or Terminals. Use All / For your use / For others where authorized.
3. Add the object, choosing For your use or For someone else.
4. Open that object's detail. See its status, activity, controls and recipient together.
5. Create a contact-bound invitation from the object, then share it. The recipient signs in with the matching verified contact and explicitly accepts.

Owners retain authority over their objects. Received objects appear For your use in the recipient's own view; the recipient never acquires the sender's account settings or money authority. Display names/nicknames describe objects and people; they are not authorization identifiers.

## Cards & spending

Account home remains the owner balance, Add money and account summary. Cards is the single card list and creation destination. A selected card page contains card art/name/status, direct freeze controls, total spending allowance controls where authorized, cardholder/current invitation and card activity. Remove the redundant managed-card route/action from detail. Dedicated historical links can remain valid for saved records, but must return to the exact selected card.

Invitation creation remains the existing card-specific command and email-bound acceptance. Its share controls contain only the invitation locator, never full card credentials. Expiry, pending, accepted, declined, canceled and unavailable states remain explicit. An unknown response retains its original operation and retry access. Opening or dismissing the share panel does not create another invitation.

Account settings concern the selected card account: account identity and ownership, money controls such as Return unused money, and service-scoped preferences. Card-level spending and recipient controls stay on the card. Invited cardholders receive only preferences they can manage, not owner account controls. Personal display names, login passwords and sessions remain in the global personal area.

## Accept payments

The main service menu is Overview / Terminals / Account settings for owners, with only permitted destinations for assigned users. Retire Payments, Team & terminals and Channels as separate top-level destinations. Existing URLs map into the current view or exact terminal section without losing validated return context or recovery of a saved operation.

Overview has the current scoped merchant money and payout action plus a single statement. Rows show time, transaction/detail, terminal where applicable, status, credit and debit. Payments, refunds, payouts and other existing accounting events use authoritative server data and actual ledger effects. Internal settlement or payout reservation cannot appear as duplicate revenue or a second withdrawal. Pending and failed records must not claim completion. Do not invent fees, running balances or financial events absent from the ledger. Date/type/resource filters apply to the statement, and every detail link preserves its exact origin.

Terminals is a unified list. Creating For someone else must survive reload before invitation creation; add an `intendedUse` field with a narrow additive migration rather than guessing solely from whether an invitation exists. Current assigned/pending access also informs owner presentation. This field describes intended use and grants no permissions. Existing terminals, payments, journals and grants are preserved.

A terminal detail combines its name/status, channels/payment requests, assigned people and invitation sharing, relevant activity and customer servicing. Channels belong to this exact terminal. Assigned terminal users see only their own terminals/records and permitted channel/dispute tools; owner refunds, settlements and payouts remain separately protected. Account settings contain merchant account/business/payment configuration, with terminal settings on the terminal where appropriate. Personal login/profile information stays outside service settings.

## Implementation and verification

Use the existing service, access, card, channel, financial and recovery owners. Read projections can be composed or added; never add a parallel ledger or trust browser totals. Reauthorize account/resource reads, writes and stale/retried commands. The only planned schema extension is terminal intended use, with valid defaults, idempotent-command compatibility and preserved existing data.

Verify the complete owner and recipient sequence for both resource types, including create-self/create-other, reload before invite, create/share/cancel/accept and isolated recipient detail. Verify debit/credit rows across payment, refund, internal settlement, payout reservation/completion/failure and historical receipts. Test keyboard/focus/reflow and access/unknown-response recovery. Run affected source/database/browser checks, then integrated packaging and preserved-preview capture. Record actual failures and final evidence separately from D79's published release; no D80 deployment is established by this design document.
