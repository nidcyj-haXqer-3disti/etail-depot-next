# American Express issuing and acquiring as a product reference

**Expanded study:** the user's later 90%+ primary-reference direction is captured in [the detailed research package](research/amex/README.md), including issuing/merchant/management studies, upstream source reviews, a proposed architecture and 90 comparison tasks. This earlier focused assessment remains historical context.

Researched 8 September 2026 from public American Express sources. Examples describe U.S. products unless identified as global. This is a focused workflow review, not an inspection of Amex's private systems or a verified provider integration.

## Recommendation

Use American Express as a primary reference for issuing, account control and merchant operations. Use selected open-source libraries to implement those behaviors. The existing Etail account/session foundation supports this direction; the next financial slices should have explicit workflow and exception maps before their screens and commands are built.

The original handoff cited Amex for account organization. This review expands that into applications, liability, controls, settlement reconciliation, disputes and integration boundaries. Etail's account types, economics, shared Premier cap, backing requirements and minor protections remain authoritative.

## Public observations and Etail design implications

| Amex public reference | What to apply to Etail | Required distinction or test |
|---|---|---|
| Additional Card Members have their own login/card; the Basic Card Member remains responsible. Additional users see their own purchases and the account total, with broader administration requiring separate access. [Additional Card Member FAQs](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/) | Separate person, login, cardholder assignment, responsible party and administrative grants. | Etail Household privacy is stricter: do not expose a funding adult's unrelated Personal totals. Cardholder status does not confer issuance authority. |
| Global Apply for Card centralizes administrator-initiated and assisted applications. [@ Work applications](https://www.americanexpress.com/en-us/business/resource-center/card-management/index.html) | One saved Add card request, controlled delegation, explicit prerequisites and review/submit. | Our retry-safe request/operation design is an Etail engineering choice; the public page does not reveal Amex's implementation. Shortcuts resume the same request. |
| Employee Cards group limits, alerts, pause/resume and activity. Amex explains that a card limit does not guarantee usable account capacity and some charges can exceed it. [Employee Card controls](https://www.americanexpress.com/en-us/business/employee-credit-cards/) | Keep controls with the card; distinguish alerts, restrictions on new authorizations and shared backing. | A limit edit cannot create capacity or reset usage. Late clearing must reconcile after a freeze. An alert is not a hard decline. |
| vPayment associates virtual credentials with amounts, permitted dates and expense details, then matches charges for reconciliation. [vPayment](https://www.americanexpress.com/en-us/business/payments/vpayment/) | Make virtual/single-use controls attributes in the canonical request, with transaction correlation. | Keep one issuance command. Actual vPayment requires application approval and potentially further enrollment/integration. |
| Merchant reporting separates pending/posted settlements and drills into submissions, transactions, deductions and amounts paid to the bank. [Viewing settlements](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-settlements.html) | Connect Seller payments to settlement components, adjustments and confirmed payouts. Show expected and confirmed amounts distinctly. | Every payout reconciles to contributing entries; pending sales cannot become settled available funds. |
| Disputes expose deadlines, reason codes, amounts, history and the next response, including whether a refund already occurred. [Managing disputes](https://www.americanexpress.com/us/merchant/support-center/disputes/managing-a-disputes-case.html) | One case linked to the original transaction, with evidence, deadline, response history and refund reconciliation. | Retry or dispute response must not create a second refund; case resolution needs a durable financial result. |
| Merchant-site terms distinguish roles from access levels, including disputes versus payment/account services. [Merchant terms, §6](https://www.americanexpress.com/content/dam/amex/us/merchant/pdf/terms-and-conditions.pdf) | Independently authorize Seller reports, disputes, payout settings and people administration. | Manager status alone cannot grant payout/refund authority. Extend the current central evaluator with explicit grants. |

The Etail mappings are design recommendations, not claims about Amex's schema, concurrency controls or source code.

## Meaning of “build on top of Amex”

**Product design:** apply these public patterns now in Etail's mock sandbox with original branding and our own implementation.

**Merchant acceptance:** U.S. OptBlue providers contract with eligible merchants and set acceptance rates. This is a potential future acquiring-adapter route; it does not establish Etail's approval or supply an issuing product. [OptBlue overview](https://www.americanexpress.com/us/merchant/optblue.html)

**Direct network/issuing integration:** Amex provides manuals to licensed issuers/acquirers under agreements; its Business and Operational Policies manual is confidential. The service-provider program describes registration, NDA/terms and certification. These public sources do not supply a complete downloadable issuing/acquiring backend or establish this project's access. [Network policy](https://network.americanexpress.com/globalnetwork/products-and-services/developers-and-tech-providers/network-policy), [Integrated Payments Providers Program](https://network.americanexpress.com/globalnetwork/v4/partners/integrated-payments-providers-program/)

No enrollment, API transaction, payment, KYC/KYB action or external write was performed. The developer integration overview returned HTTP 403; no endpoint/SDK compatibility or credential entitlement was inferred. Market eligibility and commercial terms need separate current verification. The October 2024 PayFac factsheet and current OptBlue overview show different merchant volume thresholds; neither is imported into Etail's rules. [Dated PayFac factsheet](https://www.americanexpress.com/content/dam/amex/us/merchant/pdf/Payment-Facilitator-FactSheet.pdf)

## Next implementation sequence

1. Complete M1 account, responsibility, membership and delegated-access relationships. Map each action to its actor, prerequisites, visible data and failure behavior.
2. Implement M2's single saved card request and M3's backed issuing lifecycle. Cover approval, decline, duplicate submission, timeout, freeze, late clearing and reversal through the same commands/handlers.
3. Implement M4 Seller collection, settlement, refund/dispute and payout. Connect both financial areas to the one Etail ledger while preserving distinct liabilities and scoped projections.

Retain milestone dependencies, hosted-foundation work and unresolved D14–D17 decisions. Public Amex examples cannot settle Etail's rounding, membership-year, reward-attribution or Household backing choices.
