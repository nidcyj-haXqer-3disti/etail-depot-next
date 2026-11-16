import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { chargeCardsArticle } from "./charge-cards-content";

export function ChargeCardsPage() {
  return <BlogArticlePage article={chargeCardsArticle}>
    <p>The supplier needs paying now. Your customer is expected to pay next week. A charge card can make those two dates easier to manage, provided the money arrives before the card payment is due.</p>
    <p>If the customer pays late, the supplier has still been paid and the card bill still needs settling. The business has moved the payment date. It has not removed the need for cash.</p>
    <p>A traditional charge card requires each statement balance to be paid in full by its due date. A revolving credit card allows an unpaid balance to carry forward under its terms, usually with interest. Some modern card products combine full repayment with optional financing, so the agreement and statement matter more than the label on the card.</p>
    <section id="repayment-options" aria-labelledby="repayment-options-title">
      <h2 id="repayment-options-title">One account can have two repayment rules</h2>
      <p>Some American Express business cards offer Pay Over Time for eligible purchases, subject to a separate limit. That balance can be carried with interest. Amounts outside it must be paid in full each month. This is a feature of those products, not a promise attached to every charge card.</p>
      <p>A purchase may be approved without its full amount qualifying for financing. Check the repayment terms before buying, then follow the required payment on the statement. A financing option does not mean the business can choose any smaller payment.</p>
      <p>Full repayment also does not make the card free. Traditional charge cards can have annual fees and late payment charges. Where financing is available, its <Link href="/company/blog/credit-card-interest" prefetch={false}>interest terms</Link> add another cost to consider. Rewards do not change the payment obligation.</p>
    </section>
    <section id="spending-capacity" aria-labelledby="spending-capacity-title">
      <h2 id="spending-capacity-title">Flexible spending still has boundaries</h2>
      <p>“No preset spending limit” can sound like an invitation to make a larger purchase. American Express says capacity adapts to purchase, payment and credit history, and a preset limit can be applied. An earlier approval does not establish unlimited capacity for the next purchase.</p>
      <p>The amount an issuer lets a business spend and the amount it lets that business carry over are separate questions. Other charge card programs use explicit credit limits. The repayment schedule can differ too: Stripe describes programs with weekly or monthly collection, among other arrangements. Do not build a cash forecast around a monthly bill until that is the schedule in the agreement.</p>
    </section>
    <section id="cash-timing" aria-labelledby="cash-timing-title">
      <h2 id="cash-timing-title">Put the card bill beside the customer invoice</h2>
      <p>Return to the supplier purchase. In a cash forecast, place the required card payment on its due date and the customer receipt on the date it is realistically expected. Then move the customer receipt later. If that leaves the card payment uncovered, the purchase depends on the customer paying promptly.</p>
      <p>An invoice can be valid, profitable and overdue at the same time. Its value may appear in <Link href="/company/blog/calculate-working-capital" prefetch={false}>working capital</Link>, but that does not put the money in the account used to pay the card. Payroll, rent and other commitments may already have a claim on the cash that is there.</p>
      <p>That timing is worth resolving before placing the order. A smaller purchase, a different supplier payment schedule or separately agreed financing may fit the business better. None should be assumed available after a full payment has already fallen due.</p>
      <p>A charge card can work well for spending the business expects to clear on schedule. The difficult question is whether it could still do so if the expected sale arrived late. Answer that before treating the card’s spending capacity as money the business can afford to use.</p>
    </section>
  </BlogArticlePage>;
}
