import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { securedCardsArticle } from "./secured-cards-content";

export function SecuredCardsPage() {
  return <BlogArticlePage article={securedCardsArticle}>
    <p>You put money down to get the card. You buy something. Then a bill arrives asking you to pay. For someone using a secured credit card for the first time, that can feel like being charged twice.</p>
    <p>On a traditional secured card, the two payments have different jobs. The deposit backs the account if you fail to repay. The monthly payment settles what you borrowed. Buying something does not normally spend down the deposit as it would a prepaid balance.</p>
    <p>That distinction matters to a business owner weighing up a new card. The offer may make credit accessible, but it can also tie up cash that was available to run the business. Approval is only part of the decision. What does committing that money help you accomplish?</p>
    <section id="deposit-and-bill" aria-labelledby="deposit-and-bill-title">
      <h2 id="deposit-and-bill-title">The deposit and the bill can need separate money</h2>
      <p>A secured credit card is a credit account backed by collateral, usually a cash deposit. The approved credit limit is often linked to that deposit, although the amounts need not be equal. The balance you owe is a third amount, created by purchases and any applicable charges, then reduced by payments and credits.</p>
      <p>With a traditional arrangement, paying off a purchase restores borrowing capacity once the payment is credited and credit becomes available. It does not release an equivalent piece of the security deposit. The issuer continues to hold that collateral under the agreement.</p>
      <p>Some products handle this differently. Chime’s published Safer Credit Building terms, for instance, allow customers to authorize automatic payments from the secured deposit account to the card account. That is a specific repayment arrangement. The word “secured” alone does not tell you whether deposited funds will pay the monthly bill.</p>
      <p>For cash planning, resolve that point before moving the money. If the deposit stays locked up, a larger limit can leave less cash available for suppliers or payroll. A deposit matched by the same credit limit does not, by itself, create extra money for the business. The card may change when you pay for a purchase while the collateral remains unavailable.</p>
      <p>That is a question of <Link href="/company/blog/calculate-working-capital" prefetch={false}>working capital</Link>, not just card eligibility. A card meant to help the business should not leave the next unavoidable bill without funding.</p>
    </section>
    <section id="credit-history" aria-labelledby="credit-history-title">
      <h2 id="credit-history-title">The credit history has to be worth building</h2>
      <p>A reason to accept that tradeoff is the opportunity to establish a record of repayment. Where the issuer reports activity, responsible use of a secured card can help build or rebuild credit. The deposit gives the issuer security; what you do with the account creates the payment history.</p>
      <p>That opportunity comes with consequences. Missed payments can still hurt credit even when the issuer holds your money. Approval, a better score and an eventual unsecured card are not guaranteed simply because you can fund the deposit.</p>
      <p>For an owner, “build credit” also leaves an important question unanswered: whose? Personal and business credit records are distinct. Issuers’ reporting practices vary, and a business card may involve personal responsibility for the debt. Confirm whether the account reports to consumer bureaus, business bureaus or both. Do not assume a card builds the company’s credit just because you use it for company purchases.</p>
      <p>The cost matters alongside reporting. Annual or monthly charges are expenses, not refundable collateral. Interest may apply to a carried balance. Compare those costs with the credit history you are trying to establish, and understand the <Link href="/company/blog/credit-card-interest" prefetch={false}>repayment conditions for avoiding interest</Link>. A small opening deposit says little about the eventual cost of keeping the account.</p>
    </section>
    <section id="deposit-return" aria-labelledby="deposit-return-title">
      <h2 id="deposit-return-title">Know how the deposit comes back</h2>
      <p>“Refundable” does not necessarily mean available whenever you need it. An issuer may return collateral after an eligible upgrade or account closure. Outstanding debt may be paid from the deposit first, and a remaining balance can still be your responsibility if the collateral falls short.</p>
      <p>Before opening the account, ask what releases the deposit, how the return is paid and how long it takes. Do not build a cash forecast around an upgrade that has not been approved or a refund date the issuer has not confirmed.</p>
      <p>A secured card can be useful when the reporting, repayment and deposit terms serve a clear purpose. The decision is whether that purpose is worth the cash you must commit and the cost of the account. Getting a card is the beginning; improving your position is the point.</p>
    </section>
  </BlogArticlePage>;
}
