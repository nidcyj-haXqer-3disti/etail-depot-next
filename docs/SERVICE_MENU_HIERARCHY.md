# D77 — account, card and terminal navigation

13 September 2026. The user accepts the dashboard direction but rejects scattered Add money, Requests and Settings menus. This slice reorganizes the existing tasks and removes duplicate entry points. D76 resource invitations, Visa product intent and guest network checkout remain; D73 separate balances, total allowances and resource isolation remain.

## Reference and interpretation

The public Amex US account menu separates Account Home, Statements & Activity, payment and Account Services. Its [merchant payments guide](https://www.americanexpress.com/us/merchant/support-center/payments/explore-payments-default-view.html) also groups payment record types under one payment workspace, with reporting kept in that context. Its [settlement guide](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-settlements.html) retains transaction investigation within a selected settlement. Pages were read on13 September2026. The [Amex app overview](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/) remains supporting context for selected-card money and controls.

Etail adapts this hierarchy to prepaid funding: Account balance replaces credit-bill payment, and top-up does not become bill repayment. Account settings are distinct from a selected card's controls or a terminal's setup. These are documented Etail design choices informed by public navigation, not a certification of Amex parity or access to a private portal. An international corporate PDF search result had mismatched current contents and its screenshot fetch failed; it is not visual evidence for this slice. No new video viewing is claimed.

## Stable hierarchy

| Service | Main navigation | Actions within the section |
|---|---|---|
| Cards & spending | Account home · Cards · Activity · Account balance · Account settings | Cards owns Add card, cardholders and card history. Each created card owns its recipient invitation and controls. Account balance owns the single new top-up and withdrawal flow. |
| Accept payments | Account home · Payments · Terminals · Account balance · Account settings | Payments owns filtered payment/refund/deposit investigation. Terminals owns new terminal creation. The selected terminal owns payment channels, team access, disputes and terminal settings. |

Invited cardholders see their cards, activity and preferences, without owner funding tools. Terminal users see only assigned operational records; account money and business settings require existing owner authority. A user who owns a card account and also receives someone else's card must not have their own account settings or balance silently redirected to that other group.

Open an account is a first-use action. Add card creates an additional card in an established account. Assigning a card uses its existing exact-resource invitation. Unfinished creation appears as Continue card setup, and completed requests remain Card history within Cards. No generic Requests or More section remains in the main card menu.

The merchant Account home is a compact overview. Existing links containing activity filters still open Payments; adding a new default overview must not discard that intent. The service menu stays present inside a terminal and money task. Local terminal tabs describe the selected terminal, not business-wide authority. Filter/date/terminal return context is validated and retained through money review, receipt, history and return links.

## Existing owners and recovery

No database migration, membership change or financial command is required. React still renders server-owned balances and invokes the existing money command owner. All new funding begins at the exact `/money-accounts/{id}` workspace. Historical Cardholder funding reviews/receipts remain readable and confirmable with their saved IDs; they do not offer a second new funding form. Raising a limit or assigning a card creates no money.

During a funding or withdrawal task, the balance panel does not repeat new-task buttons. Saved command identity, uncertain-result recovery, current permissions and one financial effect are retained. Merchant navigation uses its existing pending-operation guard.

## Acceptance

Verify first-use enrollment, owner and invited navigation, exact card/terminal selection, single create/fund actions, keyboard/mobile menus, preserved payment filters and money return context. Existing browser cases retain financial/privacy/recovery assertions; update only the changed navigation paths and labels. Verify unit/contracts, impacted database reads, full browser/API/accessibility checks and production packaging. Record original failures, source identity, local review and any publication separately; test totals do not claim measured customer usability or an external provider connection.
