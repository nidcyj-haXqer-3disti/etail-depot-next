# D84 — secured Visa card product references

Research date: 17 September 2026 (Tokyo). Public primary sources only. This is research and a proposed design direction, not a selected issuer program, credit offer, implementation receipt or release approval. No applications, provider enrollment, private dashboards, customer records or live financial actions were used. Source pages were read as text; this pass does not establish visual parity or private architecture.

The latest user direction replaces the prepaid interpretation with a Visa credit/charge product requiring an initial security deposit and daily/monthly repayment. The user subsequently confirmed monthly pay-in-full with optional earlier/manual daily repayments. The deposit-to-limit policy and remaining program terms are not yet confirmed. The earlier [Amex research](amex/README.md) remains a workflow reference; its historical prepaid adaptation is not evidence for the new economics. Root owns changes to the active design and delivery documents.

## Verified distinctions

| Question | Verified finding and implication |
| --- | --- |
| Does Visa define the product? | Visa states that financial institutions issue its cards and hold customer statements. Visa branding therefore does not select the issuer, deposit arrangement, credit limit or repayment terms. [Visa FAQ](https://www.visa.com/en-jm/personal/cards/frequently-asked-questions) |
| What is a secured revolving card? | OpenSky describes a deposit-backed Visa credit line with separate monthly payments that restore credit. Its secured products publish APRs and permit minimum payments. This is a useful secured-credit reference, not evidence for an interest-free pay-in-full product. [OpenSky FAQ](https://openskycc.com/faq) |
| Must deposit equal the credit limit? | No universal rule follows from the label. OpenSky describes equal initial deposit/limit, but also possible later increases without more deposit. Capital One currently offers an initial line of at least $200 against a required deposit of $49, $99 or $200. These are issuer-specific examples, not proposed Etail pricing. [OpenSky FAQ](https://openskycc.com/faq), [Capital One Platinum Secured](https://www.capitalone.com/credit-cards/platinum-secured/) |
| What is a pay-in-full charge product? | Stripe's US commercial guide separates borrowing and later full repayment from prepaid spending. It treats lending, program funding and repayment collection as separate program responsibilities. Repayment frequency is configurable; it is not determined by the network logo. [Stripe charge-card guide](https://stripe.com/guides/charge-cards-101) |
| Are daily and monthly repayment real patterns? | Brex supports daily and monthly business charge-card cycles and monthly early payments. It expressly says its cards are **not secured**. Ramp's one-day configuration collects cleared charges daily and applies to the whole business, not individual cards. These sources support schedule/workflow patterns only. [Brex card features](https://www.brex.com/support/brex-cards-supported-features), [Brex repayments](https://www.brex.com/support/paying-brex-statements), [Ramp one-day terms](https://support.ramp.com/1-day-payment-terms/) |
| Does the deposit always remain untouched until closure? | No. Capital One holds collateral separately during use. Chime's secured Visa product can use its secured deposit account to pay monthly charges automatically. Those are different money models; neither should be silently inferred from “secured Visa.” [Capital One secured-card management](https://www.capitalone.com/help-center/credit-cards/understanding-and-managing-secured-cards/), [Chime card](https://www.chime.com/credit/chime-card/) |
| Can the existing Amex reference determine borrowing terms? | No. Amex's current Pay Over Time offering includes eligible balances with interest, alongside amounts requiring full payment. Retain clear account, activity, statement and payment navigation; do not copy mixed financing terms into an unconfirmed Etail charge product. [Amex Pay Over Time](https://www.americanexpress.com/us/benefits/payment-flexibility/pay-over-time/) |
| Is a provider integration already available? | No integration is established here. Stripe's charge guide is commercial/US-oriented; its separate consumer credit documentation currently labels availability US-only private preview. Access, consumer/family eligibility, permitted additional users, collateral support and issuer terms require actual program confirmation. [Stripe consumer credit documentation](https://docs.stripe.com/issuing/consumer-issuing) |

## Balances and events that must stay distinct

**Observed issuer behavior:** Pending purchases reduce available credit before they enter the posted account balance, and their final amounts can change. A release of a pending authorization is not a merchant refund. [Capital One pending transactions](https://www.capitalone.com/help-center/credit-cards/card-pending-transactions/)

**Proposed Etail terminology and model:** Keep these server-owned values separate, even when two happen to be numerically equal:

| Customer term | Meaning in the proposed held-collateral model |
| --- | --- |
| Security deposit | Collateral received and held; show pending deposits separately. It is neither the purchase balance nor a routine repayment. |
| Credit limit | The account's approved maximum credit exposure under its program terms. Card creation or an owner's card-limit change cannot increase it. |
| Available credit | Remaining account capacity after posted exposure and open authorizations, according to the program's credit-release policy. Never add collateral to the approved limit. |
| Current balance | Posted debt after accepted payments, refunds and adjustments. Keep pending purchases separate. |
| Statement balance / amount still due | A saved billing-period obligation and its remaining unpaid amount; later activity must not rewrite the original statement. |
| Payment processing | A repayment in progress, with its own receipt and outcome. Submission is not final settlement. |
| Card spending limit | The owner's control for a particular card, distinct from account credit. The existing lifetime total allowance is retained; repayments and refunds do not reset it. |

Illustration for a proposed 1:1 held-deposit, no-fee model: $1,000 settled collateral supports a $1,000 approved line. A $200 authorization leaves $800 available and $0 posted debt. Capture replaces that hold with $200 debt; availability stays $800, not $600. A settled $200 repayment clears debt and restores $1,000 capacity while collateral remains $1,000. This example assumes no other holds, arrears or restrictions; it does not choose Etail's final terms.

Stripe's credit documentation independently separates collecting a repayment from recording it against the funding obligation. It also distinguishes platform-funded refunds, which reduce the obligation, from refunds to an account-funded balance. Refunds exceeding charges can produce a customer credit requiring return. These mechanisms are useful reconciliation references, not an API contract already integrated into Etail. [Stripe obligations and refunds](https://docs.stripe.com/issuing/credit/manage-account-obligations)

## Lifecycle recommendations for the sandbox

The following are design recommendations, not claims about Visa rules or implemented behavior:

1. **Establish the account.** Record the approved product terms, credit decision and required deposit separately. Confirm receipt of collateral before enabling the corresponding credit. Keep failed/returned deposits visible and prevent double credit from retries.
2. **Create and share cards.** Retain owner/cardholder identity and exact invitation acceptance. The owner controls the account, debt and collateral; a recipient sees their own cards and activity. Issuance and acceptance neither borrow funds nor create collateral. A recipient's spending ceiling must not be presented as their own bank balance or independent debt.
3. **Authorize, clear or release.** Reserve capacity atomically across all cards. Replace holds when purchases clear; reconcile partial captures, reversals and late/forced presentments. Freezing or revoking access blocks new use but must not discard previously incurred obligations.
4. **Bill and pay.** Generate an immutable statement from eligible posted activity. Keep statement close, due date, automatic payment schedule and optional early payment distinct. Bind reviews to the exact account/amount/source and preserve same-command recovery. Prevent an early payment and scheduled collection from paying the same obligation twice.
5. **Handle payment uncertainty.** Use explicit scheduled/processing/succeeded/failed/returned states. Decide when capacity becomes reusable. Brex documents both clearing delays and program-dependent early credit; its behavior is evidence that initiation and credit restoration are separate decisions. [Brex repayments](https://www.brex.com/support/paying-brex-statements)
6. **Refund and dispute.** A merchant refund reduces debt or creates a customer credit; it does not automatically increase collateral. Preserve original purchase/card attribution after invitation revocation. Separate authorization reversals, merchant refunds, provisional dispute credits and final dispute outcomes. Brex explicitly distinguishes provisional credit from a merchant refund. [Brex dispute process](https://www.brex.com/support/dispute-transaction)
7. **Default and closure.** Model delinquency, new-spend restriction, collateral application and residual debt explicitly. Capital One's agreement permits collateral application after default or closure and keeps the customer responsible for a shortfall; closing the account does not erase debt. These are that issuer's terms, not an Etail collection authorization. [Capital One secured agreement, security/default sections](https://ecm.capitalone.com/WCM/card/credit-card-agreement-for-consumer-secured-cards-in-capital-one-na.pdf)
8. **Release collateral.** Show review, processing and completed release separately. Confirm unresolved exposure and agreement conditions before releasing it. Capital One and OpenSky publish different return processes/timelines; do not promise instant return or copy either timetable without selecting it. [Capital One secured-card management](https://www.capitalone.com/help-center/credit-cards/understanding-and-managing-secured-cards/), [OpenSky FAQ](https://openskycc.com/faq)

Keep one financial ledger with distinct account purposes for collateral held, card receivables, repayment clearing and release/application of collateral. Merchant balances, settlement and payouts remain separate. Neither merchant receipts nor cardholder payments should silently move between these services.

Do not relabel historical prepaid funding as collateral or historical prepaid purchases as unpaid borrowing. Specify an auditable cutover and treatment of existing balances/receipts before any data migration; this research authorizes no reset or conversion.

## Recommended initial experience, subject to answers

For the user's simple daily/monthly payoff goal, prefer **a deposit-secured, pay-in-full card account** with one account-level schedule and optional early payment, consistent with the user's subsequent pay-in-full confirmation. Start with a 1:1 sandbox collateral policy only if explicitly selected; keep approved limit and deposit as separate records. This is a product recommendation assembled from the sources above, not a claim that any one referenced issuer offers this exact combined product.

Owner Home should prioritize **Available credit**, **Current balance**, **Payment due / next payment**, and **Make a payment**. Place **Security deposit** in a clearly separate summary with its own deposit/release history. Card detail keeps the card's spending control, own activity, freeze and invitation. Recipient views should not expose the owner's collateral, payment source, aggregate debt or other cards. Initial setup can say **Add security deposit**; routine payment must say **Make a payment**, not “Top up.” Final copy depends on whether the deposit is held or routinely consumed.

## Exact unresolved decisions

| Decision | Why it changes implementation |
| --- | --- |
| **Confirmed:** full monthly repayment with optional earlier/manual daily payment. | No revolving minimum-payment or interest model is selected. Billing calendar and settlement details still need explicit program settings. |
| **Already asked:** 1:1 deposit/limit, or an issuer-approved limit different from collateral? | Determines collateral sufficiency and limit approval. A customer-controlled card allowance must never substitute for issuer approval. |
| Is the initial deposit held until approved release/default, or used for routine bills like Chime? | Determines whether repayment needs separate funds and whether repayment reduces collateral and future capacity. |
| **Confirmed:** earlier/manual daily repayment within monthly full-payment billing. | No required daily cycle or automatic collection is selected. Billing timezone, cutoff and payment settlement remain explicit program settings. |
| **Retained:** each card keeps its lifetime total allowance. | Account repayment may restore account credit under the future program, but cannot reset the card's gross allowance usage. |
| When do deposits/payments restore credit, and how are returned payments handled? | Requires an explicit settlement/hold policy and compensating records. Avoid promising immediate reusable credit by default. |
| What happens to refunds after repayment, excess payments, failed collections and overdue balances? | Requires customer-credit return/allocation, retry rules, spend restrictions and a separately authorized collateral-application process. |
| Who is the customer/obligor and which jurisdiction/issuer program applies? | Consumer/family, minors as authorized users, and commercial programs cannot be treated as interchangeable. No live issuer, underwriting, bureau reporting, insurance or legal compliance claim is established by this research. |

Acceptance should prove exact deposit → credit → authorization → capture → statement → repayment and refund/default/release lifecycles, concurrent cards, retries/returned funds and owner/recipient isolation. Public mockups or renamed balances cannot establish that conversion.
