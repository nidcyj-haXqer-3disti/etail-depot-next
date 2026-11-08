# D74 — Clear customer language

12 September 2026. The user found “pay with an Etail” confusing and asked for language that people without business experience can recognize. This is a presentation change to the deployed D73 owner/cards/terminals model, not a new account, payment network or money flow.

## Customer vocabulary

| Previous wording | Customer wording | Meaning |
|---|---|---|
| Cardholder services | Cards & spending | See cards and purchases; owners add money and manage spending limits. |
| Merchant services | Accept payments | Create payment requests, share links and follow received payments. |
| Card money / group money | Card balance | Actual prepaid funds shared by the account’s cards. |
| Merchant money | Payment balance | Funds from the business’s received payments, kept separate from cards. |
| Total allowance | Total spending limit | Each card’s lifetime spending ceiling, including purchases already made. It never resets automatically. |
| Payment channel | Payment request / sharing method | The amount and purpose, presented by text, email, invoice, bill, social post, QR code or web link. |
| Terminal | Payment terminal | An online place to collect and organize payments for a person, location or activity; no physical card machine is implied. |
| Settlement | Move received payments into the payment balance | The owner’s reviewed movement from pending receipts into available payment money. It is not a transfer between card and payment balances. |

Keep Account owner and Cardholder when explaining permissions. Tell invited people what they can do. Service names, navigation, forms, help, invitations and checkout use the same terms. Internal enums, identifiers, URLs and contracts retain their existing stable names.

## Separate the seller and customer journeys

Its marketing illustration shows a labelled example payment request, so the collector is not presented with a purchase-card visual. The page for accepting payments follows the person collecting money: create a request, share its link, track the payment and receipt. It must not instruct that person to sign in as a paying cardholder. The customer checkout says “Choose a card” and explains that it currently accepts only cards created in Etail Depot. Payment links do not imply acceptance of external bank cards or digital wallets, and creating a link does not send email or text messages.

The cards page explains adding money, setting each card’s total spending limit and inviting a person before creating their card. It distinguishes the balance from a limit with an example. Spending still requires both funds and the card’s remaining limit. Refunds restore funds but do not replenish used spending limits. Older help/error text referring to a monthly limit or primary holder must be corrected.

## Reference check

American Express’s public [Additional Card Member FAQ](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/) uses recognizable card, spending and account tasks. Square’s UK [Payment Links page](https://squareup.com/gb/en/payment-links) explains payment links through creation, sharing and payment tracking. Both were inspected on 12 September 2026 for communication patterns. Their eligibility, credit terms, card acceptance, fees, automatic deposits and other product capabilities are not Etail capabilities by implication. No private-portal or measured usability/parity claim is made.

## Verification and boundaries

Review source changes for copy, accessible labels and decorative presentation only; keep service ownership, total limits, checkout eligibility, permissions, command payloads, routes, database schema and ledger unchanged. Update existing tests only where exact customer labels changed, keeping their behavioral and privacy assertions. Check the built public and authenticated journeys at desktop/mobile widths, navigation, checkout, funding and recovery. Release state and exact evidence belong in the D74 receipt and review PR.

The initial base is local `72f180552f77076637f77520c834b64cb888d33c`, whose tree `ef72c34c2cc549e2a22af0257e7479148842ddd8` matches deployed D73 merge `75eee004a1ded48fb6adbf2bb0ff67c3f5ea7bc8`. No database migration, Identity setting, visitor-access change, indexing approval or real-money action is part of this task.
