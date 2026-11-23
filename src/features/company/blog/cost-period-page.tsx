import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { costPeriodArticle } from "./cost-period-content";
import s from "./blog.module.css";

export function CostPeriodPage() {
  return <BlogArticlePage article={costPeriodArticle}>
    <p>A seasonal retailer sends a prospective payment provider its three busiest statements. The proposed savings look convincing. Sales are high, fixed charges spread comfortably across the revenue, and much of the return season is still ahead.</p>
    <p>Every calculation may be correct. The merchant can still choose the more expensive offer.</p>
    <p>The missing information is the rest of the year. Choosing which statements to compare determines which version of the business a proposal describes. A saving during the holiday rush says little about the cost of staying open through a quiet spring.</p>

    <section id="choose-the-cycle" aria-labelledby="choose-the-cycle-title">
      <h2 id="choose-the-cycle-title">The months you leave out can change the winner</h2>
      <p>Consider a fictional store that processes $100,000 in each of three busy months and $10,000 in each of the other nine. Offer A charges 2.5% with no monthly fee. Offer B charges 2.2% plus $150 a month. For this comparison, assume no other charges. These are hypothetical offers, not Trolleys prices.</p>
      <table className={s.comparison}>
        <caption>Two offers applied to the same seasonal business</caption>
        <thead><tr><th scope="col">Period</th><th scope="col">Payment volume</th><th scope="col">Offer A cost</th><th scope="col">Offer B cost</th></tr></thead>
        <tbody>
          <tr><th scope="row">Three busy months</th><td><span className={s.comparisonLabel} aria-hidden="true">Payment volume</span>$300,000</td><td><span className={s.comparisonLabel} aria-hidden="true">Offer A cost</span>$7,500</td><td><span className={s.comparisonLabel} aria-hidden="true">Offer B cost</span>$7,050</td></tr>
          <tr><th scope="row">Nine quieter months</th><td><span className={s.comparisonLabel} aria-hidden="true">Payment volume</span>$90,000</td><td><span className={s.comparisonLabel} aria-hidden="true">Offer A cost</span>$2,250</td><td><span className={s.comparisonLabel} aria-hidden="true">Offer B cost</span>$3,330</td></tr>
          <tr><th scope="row">Full year</th><td><span className={s.comparisonLabel} aria-hidden="true">Payment volume</span>$390,000</td><td><span className={s.comparisonLabel} aria-hidden="true">Offer A cost</span>$9,750</td><td><span className={s.comparisonLabel} aria-hidden="true">Offer B cost</span>$10,380</td></tr>
        </tbody>
      </table>
      <p>Offer B saves $450 during the busy period. It costs $1,080 more over the quieter months, leaving the merchant $630 worse off for the year. A proposal built only from the three strong statements would have identified the wrong winner for this business.</p>
      <p>The cheaper percentage did not change. Neither did the monthly fee. The comparison changed because it finally included the months when the fixed charge mattered most.</p>
      <p>A real agreement has more moving parts: charges per payment, card mix, refunds, account minimums and optional services. Both offers need to be applied to the same activity. Otherwise, a difference in what was counted can pass for a difference in price.</p>
    </section>

    <section id="keep-months-visible" aria-labelledby="keep-months-visible-title">
      <h2 id="keep-months-visible-title">A full year helps only if it still describes the business</h2>
      <p>For an established seasonal store, a full annual cycle is a sensible starting point. It includes the rush, the quiet period and the returns that follow the rush. But twelve months is not a rule that makes every comparison reliable.</p>
      <p>Last year’s store might have sold expensive equipment. This year it may sell replacement parts, with smaller orders and more payments. Using the complete old year would produce a detailed forecast of a business the owner no longer runs. Recent activity, with explicit estimates for the missing seasons, may tell the more useful story.</p>
      <p>The owner should be able to distinguish recorded sales from expectations. A proposal that works only if revenue grows is making a bet on growth. That may be a reasonable bet, but it should be visible before a fixed commitment is accepted.</p>
      <p>The reporting dates matter too. December sales and a January bank deposit are not the same period of activity. Refunds and fee adjustments may arrive after the original payment. Stripe’s reporting guidance identifies date ranges, time zones and included activity as reasons apparently similar reports disagree. Comparing like records comes before comparing their totals.</p>
      <p>Keep the monthly results visible even when the annual total favors an offer. An owner may accept higher annual costs for a service that saves staff time, or prefer a plan that costs less during the months when cash is tight. The calculation gives the owner a price for that choice.</p>
      <p>A Trolleys proposal belongs in the same comparison. Use the charges and collection terms recorded for the account in its <Link href="/company/legal/fees#billing-record" prefetch={false}>accepted billing terms</Link>, alongside the corresponding terms from the other provider. Include selected services consistently, rather than comparing one base price with another complete bill.</p>
      <p>The useful question is whether the saving survives the business’s ordinary year. A quote that wins only when the store is busiest has answered a much easier question.</p>
    </section>
  </BlogArticlePage>;
}
