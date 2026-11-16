import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardInterestArticle } from "./card-interest-content";

export function CardInterestPage() {
  return <BlogArticlePage article={cardInterestArticle}>
    <p>The payment went through before the deadline. No late notice arrived. Then the next statement included an interest charge. Paying on time can feel like the whole job, but a card can let you carry a balance while charging for the time you keep it.</p>
    <p>For a business owner, that distinction belongs in the purchase decision. A card can put stock on the shelf before the sales arrive. The cost of that stock may keep growing after checkout if the balance carries interest. The expected margin needs to cover the borrowing as well as the purchase.</p>
    <p>This article concerns cards that allow balances to be carried with interest. Use the actual agreement for a US business card: many federal consumer credit protections do not apply to business purpose cards in the same way. Some card products require full payment instead of offering a revolving balance.</p>
    <section id="grace-period" aria-labelledby="grace-period-title">
      <h2 id="grace-period-title">The minimum payment and the interest bill</h2>
      <p>The minimum amount due is the payment required under the account’s terms for that billing cycle. Meeting it on time does not necessarily satisfy the conditions for avoiding interest. If the rest of the balance carries an interest charge, it continues to cost money even though the payment was punctual.</p>
      <p>A purchase grace period can change that result. Where the account offers one and you meet its conditions, paying the required balance in full by the due date can avoid interest on eligible purchases. Grace periods are not universal, and an account that already carries a balance may have lost that benefit.</p>
      <p>That can make the next purchase more expensive than expected. Without an applicable grace period, new purchases can start accruing interest from their transaction dates. Waiting until the next payment deadline may therefore add cost even when you intend to pay that new purchase off promptly.</p>
      <p>Cash advances generally do not receive a purchase grace period. Balance transfers can have separate rates, fees and promotional conditions. Treat each type of balance according to its terms rather than assuming the purchase rate or a promotional headline covers everything on the account.</p>
      <p><strong>The useful question is how much must be paid, by when, to avoid interest on the purchases you are making.</strong> If the grace period has been lost, ask the issuer what restores it. Do not assume one payment will immediately return the account to its previous treatment.</p>
      <p>Autopay needs the same attention. An instruction to pay the minimum may help meet the due date while leaving an interest bearing balance. Confirm the selected amount, keep enough money available for the debit and check that the payment was credited. Automation carries out a repayment choice; it does not choose the least expensive one for you.</p>
    </section>
    <section id="daily-cost" aria-labelledby="daily-cost-title">
      <h2 id="daily-cost-title">The cost can keep running between statements</h2>
      <p>APR means annual percentage rate. It expresses the interest rate over a year, but many issuers calculate the charge using daily balances. The bill depends on the rate that applies, the balance subject to it and how long that balance remains unpaid.</p>
      <p>A daily periodic rate is commonly derived by dividing the APR by 360 or 365, depending on the issuer. That rate is applied using the agreement’s balance calculation. Some methods add interest to the balance daily, so later interest can include earlier interest. Purchases, payments, credits and posting dates can all affect the result. Multiplying the statement’s closing balance by the annual rate will not reproduce that calculation.</p>
      <p>When interest is already accruing daily, a payment credited earlier can reduce the balance exposed to interest for more days. That is why two repayment schedules can cost different amounts even when they eventually repay the same principal. The benefit depends on the account’s method, rates and how the payment is allocated.</p>
      <p>The statement date creates another trap. If you have been carrying an interest bearing balance, interest may continue accruing after the statement closes and before your payment is credited. Paying the displayed statement balance can therefore leave residual interest to appear later. Ask the issuer for the amount needed to clear the account on the intended payment date, and check the following statement.</p>
      <p>Before financing a business purchase this way, connect repayment to realistic receipts. Include interest and applicable fees in the comparison with other <Link href="/company/blog/b2b-payment-methods" prefetch={false}>business payment methods</Link>. If a promotion is involved, use its actual end date and the rate that follows it. Rewards alone do not establish that carrying the balance is worthwhile.</p>
      <p>Borrowing costs also help explain why strong sales can leave less <Link href="/company/blog/gross-vs-net-profit" prefetch={false}>net profit</Link> than expected. The purchase decision is incomplete until the repayment has a place in the cash plan. Knowing that the minimum is affordable tells you far less than knowing when the debt will be gone and what it will cost to get there.</p>
    </section>
  </BlogArticlePage>;
}
