import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardFloatArticle } from "./card-float-content";

export function CardFloatPage() {
  return <BlogArticlePage article={cardFloatArticle}>
    <p>Pay a supplier from the business bank account and the balance falls. Pay with a credit card and the bank balance can stay exactly where it was. The purchase feels finished either way.</p>
    <p>The difference shows up at the next spending decision. There appears to be room for another stock order, a new piece of equipment or an extra advertising campaign. Some of that room exists because the earlier purchase has not reached the bank account yet.</p>
    <p>Credit card float is the interval between buying on the card and paying the issuer. During that interval, the business retains its cash and owes a card balance. BILL’s explanation of float identifies the practical danger: the bank account can look healthy while a substantial card bill remains unpaid.</p>
    <p>There is value in the interval. A business may be able to receive and sell stock before paying the card bill. Keeping cash available until the agreed payment date can give it flexibility. The problem starts when the same cash is treated as available for a second commitment without a plan to cover the first.</p>
    <section id="payment-calendar" aria-labelledby="payment-calendar-title">
      <h2 id="payment-calendar-title">The calendar decides how much time you have</h2>
      <p>Float is often described as if every purchase comes with the same number of days. The statement cycle makes that unlikely. A purchase included near the end of a cycle reaches its payment deadline sooner than one included near the beginning of the next cycle.</p>
      <p>Chase’s business card guidance distinguishes the statement period, its closing date and the payment due date. Use those actual dates, along with the statement on which a purchase posts. A checkout date alone does not establish when that purchase will need to be repaid.</p>
      <p>The interest question is separate. A purchase grace period can allow eligible purchases to avoid interest when its conditions are met. The CFPB’s consumer guidance explains that carrying a balance can remove that benefit. For a business card, check the commercial account agreement directly rather than assuming consumer card terms apply.</p>
      <p>If interest applies during the interval, include it in the cost of using the card. Paying only the minimum may meet the required payment while leaving a balance that continues to cost money. The <Link href="/company/blog/credit-card-interest" prefetch={false}>interest terms</Link> determine that cost; the word “float” does not make borrowing free.</p>
      <p>Some accounts require full repayment, and schedules can differ. A <Link href="/company/blog/charge-cards" prefetch={false}>charge card</Link> or another commercial card program may collect on a timetable that does not match the monthly cycle you expected. Plan from the agreement and the current statement.</p>
    </section>
    <section id="cash-commitments" aria-labelledby="cash-commitments-title">
      <h2 id="cash-commitments-title">The next purchase is where float becomes risky</h2>
      <p>Imagine the stock has arrived and the supplier has been paid by card. Payroll is approaching. Another supplier offers a discount for ordering early. The bank balance looks large enough to take the offer, but it is also the balance expected to cover payroll and the card repayment.</p>
      <p>No single screen necessarily shows that competition for cash. The bank shows what remains there. The card statement shows a bill for a completed billing period. Purchases made after that period may already be building the next bill. Looking only at the latest statement can leave those newer commitments out of the decision.</p>
      <p>A useful cash forecast puts each repayment on the date money is expected to leave, alongside payroll, rent and other commitments. Start with the cash actually available, then add expected receipts on realistic dates. Xero’s forecasting guidance uses that distinction between the starting balance, incoming cash and outgoing payments to reveal future shortfalls.</p>
      <p>Keep the purchase connected to its payment without counting it twice. Once an existing supplier bill has been paid by card, it should no longer remain in the forecast as another bank payment to that supplier. The cash obligation has moved to the issuer. Intuit’s guidance makes the bookkeeping counterpart explicit: record the payment against the existing bill so it no longer appears unpaid.</p>
      <p>Then move an expected customer receipt later. Review the balance on the card payment date, including the other payments due before it. A comfortable month-end total can conceal a shortfall earlier in the month. That is the moment the business needs to understand before accepting another commitment.</p>
      <p>A company that also accepts customers’ cards has a second payment timetable to consider. Its sales proceeds and its own card repayments are separate flows. Use the actual expected payout date in the forecast. An approved customer payment is not a promise that the proceeds will be in the bank before the issuer collects.</p>
      <p>Having enough cash already reserved for the bill is different from relying on future sales to provide it. Both can appear behind the same bank balance today. If every repayment depends on pushing more spending onto the card, examine the recurring cash gap before treating the arrangement as a timing benefit.</p>
      <p>The card can create breathing room between buying and paying. Keep the unpaid purchase visible throughout that interval, so the next decision does not spend its repayment money again.</p>
    </section>
  </BlogArticlePage>;
}
