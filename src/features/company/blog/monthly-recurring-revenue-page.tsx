import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { monthlyRecurringRevenueArticle } from "./monthly-recurring-revenue-content";

export function MonthlyRecurringRevenuePage() {
  return <BlogArticlePage article={monthlyRecurringRevenueArticle}>
    <p>A customer switches from monthly billing to a discounted annual plan and pays for the year upfront. Collections look stronger that month. Yet, if your recurring revenue calculation reflects the discount, the monthly value of that subscription has fallen.</p>
    <p>That is not necessarily a bad deal. Earlier cash and a longer paid term may be valuable to the business. But calling the annual payment a jump in monthly recurring revenue would conceal the tradeoff you made to get it.</p>
    <p>Monthly recurring revenue, or MRR, puts qualifying recurring subscription value on a monthly basis. It helps compare subscriptions with different billing schedules. It is an operating measure, separate from cash collected and from the revenue your accounting records recognize for a period.</p>

    <section id="compare-billing-periods" aria-labelledby="compare-billing-periods-title">
      <h2 id="compare-billing-periods-title">Put the subscriptions on the same clock</h2>
      <p>For a simple subscription with a fixed recurring price, the starting calculation is:</p>
      <p><strong>Monthly contribution = qualifying recurring amount ÷ months covered.</strong></p>
      <p>A monthly plan contributes its qualifying monthly amount. An annual plan contributes one twelfth of its qualifying annual amount while it remains included in the measure. Add those monthly contributions across the subscriptions included at the reporting date.</p>
      <p>ChartMogul’s documentation follows this principle, using the recurring amount and the plan’s billing interval. It excludes charges that do not recur and offsets MRR by discounts. A setup fee can belong on the customer’s invoice without becoming part of their recurring subscription value.</p>
      <p>Do not count the full annual charge in the month it is collected and nothing in the following months. That describes the timing of the payment rather than the continuing subscription. Likewise, a renewal on unchanged terms should not be counted as a newly acquired subscription simply because another annual invoice appeared.</p>
      <p>Keep the calculation tied to the subscription and its effective terms. A customer can have more than one subscription; those values may all contribute to MRR without representing several different customers. For partial periods and plan changes, inspect how the reporting system converts the charge into an ongoing monthly value instead of assuming the invoice total is the answer.</p>
    </section>

    <section id="explain-the-movement" aria-labelledby="explain-the-movement-title">
      <h2 id="explain-the-movement-title">Explain the increase before celebrating it</h2>
      <p>The difference between opening and closing MRR is useful only if you can explain what moved. ChartMogul separates new business, expansion, reactivation, contraction and churn. Those categories tell different stories even when they produce the same net increase.</p>
      <p>New customers indicate acquisition. Existing customers buying more indicate expansion. A former customer returning is a reactivation, not another first acquisition. Downgrades and cancellations remain losses even when successful sales elsewhere more than offset them.</p>
      <p>Keep the individual subscription changes behind the totals. If a discount expires, the higher recurring value does not by itself mean the customer added seats or adopted another product. If an exchange rate changes, the reporting-currency value can move while the customer’s price in their own currency stays the same.</p>
      <p>A movement report should account for those differences, including currency effects or corrections where relevant. Investigate an unexplained remainder rather than assigning it to new sales so the totals agree.</p>
      <p>Also look at where growth is concentrated. A large expansion can outweigh losses across smaller accounts. Our article on <Link href="/company/blog/net-revenue-retention-for-saas-businesses" prefetch={false}>net revenue retention</Link> examines the starting customer group separately from new business. Total MRR and retention answer related questions, but neither replaces the other.</p>
    </section>

    <section id="read-the-reporting-rules" aria-labelledby="read-the-reporting-rules-title">
      <h2 id="read-the-reporting-rules-title">The definition belongs beside the number</h2>
      <p>Stripe’s standard Billing Analytics MRR definition includes active and past-due subscriptions, while excluding taxes and metered products. A past-due account can therefore remain in that MRR total even though collection needs attention. Our article on <Link href="/company/blog/saas-payment-processing" prefetch={false}>SaaS payment processing</Link> explains why subscription status and payment results need separate records.</p>
      <p>Discount settings matter as well. Stripe lets businesses configure whether recurring and one-time discounts are subtracted, while permanent recurring discounts are always deducted. Two reports can show different MRR from the same commercial activity because they apply different rules.</p>
      <p>Record which subscriptions qualify, how discounts and variable usage are treated, the reporting date and the currency method. When a policy changes, label the break in the series or provide a comparable calculation. A revised definition should not be presented as a customer win.</p>
      <p>Multiplying MRR by 12 gives an annualized run rate under the same definition, as ChartMogul’s ARR report does. It does not guarantee twelve months of renewals or collections. Costs and service obligations still matter too; neither MRR nor its annualized figure is a profit measure.</p>
      <p>Return to the customer who paid annually. The useful report shows both the cash brought forward and the recurring value after the discount. With both visible, you can judge whether the deal serves the business instead of asking one attractive number to make the decision for you.</p>
    </section>
  </BlogArticlePage>;
}
