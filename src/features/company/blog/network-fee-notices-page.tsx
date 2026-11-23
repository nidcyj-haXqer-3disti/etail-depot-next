import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { networkFeeNoticesArticle } from "./network-fee-notices-content";

export function NetworkFeeNoticesPage() {
  return <BlogArticlePage article={networkFeeNoticesArticle}>
    <p>A provider attributes a new charge to a card network. That may explain where a cost originated. It does not yet explain why this merchant owes this amount, from this date.</p>
    <p>The missing steps are the payment activity affected, the pricing arrangement and the calculation used to pass the change through. Without them, the merchant cannot distinguish a genuine upstream adjustment from a broader change in the provider’s price.</p>

    <section id="follow-the-change" aria-labelledby="follow-the-change-title">
      <h2 id="follow-the-change-title">A change needs a defined path to the bill</h2>
    <p>Visa distinguishes interchange between financial institutions from the merchant discount negotiated with the merchant’s provider. That distinction matters here. A published network schedule and a merchant’s accepted fee schedule are related records, not interchangeable prices.</p>
    <p>Under an arrangement that passes through specified costs, a qualifying upstream change may flow into the bill through that mechanism. Under a blended arrangement, the commercial terms may handle it differently. The actual agreement determines which explanation applies.</p>
    <p>To examine the increase, hold the payment activity still. Ask what the same representative set of payments would cost under the old schedule and the proposed one. Comparing this month’s total with last month’s cannot isolate the price change if the volume or payment mix also changed.</p>
    <p>That comparison gives the explanation something concrete to account for. If the cited change concerns only one kind of transaction but the new schedule raises charges across the account, there is a further question to resolve: whether the agreement passes through the specific cost or permits broader repricing. A real upstream increase does not make those two explanations equivalent.</p>
    </section>

    <section id="keep-the-explanation-complete" aria-labelledby="keep-the-explanation-complete-title">
      <h2 id="keep-the-explanation-complete-title">The label cannot do the work of the evidence</h2>
    <p>A line called a network fee is not proof that the network set the merchant’s exact charge. Nor does the presence of a provider margin make a charge improper if that margin was disclosed and agreed. The question is whether the explanation matches the agreement and the arithmetic.</p>
    <p>For Trolleys merchants, account variations and charging rules are recorded in the <Link href="/company/legal/fees#billing-record" prefetch={false}>billing terms</Link>. Material changes also follow the applicable <Link href="/company/legal/merchant-services#changes" prefetch={false}>notice and acceptance process</Link>, including its stated exceptions. A later invoice cannot supply permission that was missing when the charge was imposed.</p>
    <p>The result may be a justified increase, a billing correction or a decision to renegotiate. In each case, the merchant is dealing with a price it can examine. “Network fee” should help explain the bill, not end the conversation about it.</p>
    </section>
  </BlogArticlePage>;
}
