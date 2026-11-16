import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { checkoutAbandonmentArticle } from "./checkout-abandonment-content";
import s from "./blog.module.css";

const abandonmentRates = [
  ["Left before checkout", "(100 − 60) ÷ 100 × 100 = 40%", "40 of the 100 cart journeys never started checkout."],
  ["Left during checkout", "(60 − 45) ÷ 60 × 100 = 25%", "15 of the 60 checkout journeys did not complete an order."],
  ["No completed order overall", "(100 − 45) ÷ 100 × 100 = 55%", "55 of the 100 cart journeys ended without an order."],
] as const;

export function CheckoutAbandonmentPage() {
  return <BlogArticlePage article={checkoutAbandonmentArticle}>
    <p>Two reports can show different abandonment rates for the same store without either calculation being wrong. They may count different stages, different shoppers or different periods. Before changing checkout, find out what each number includes.</p>
    <section id="define-stages" aria-labelledby="define-stages-title">
      <h2 id="define-stages-title">Define the stages first</h2>
      <p>A <strong>cart</strong> contains an item the shopper has selected. <strong>Checkout</strong> starts when the shopper begins placing the order. A <strong>completed order</strong> needs a consistent definition in your store and reporting setup.</p>
      <p>“Cart abandonment” is used in different ways. Some reports count all carts without a completed order, including those that reached checkout. Others count only shoppers who left before checkout began. Use the label <strong>left before checkout</strong> when you mean that narrower group.</p>
      <p><strong>Checkout abandonment</strong> concerns shoppers who started checkout but did not complete an order. It can therefore be part of the broader unfinished cart total. Check your platform’s definitions before comparing its rate with another report.</p>
      <p>Google Analytics provides separate <code>add_to_cart</code>, <code>begin_checkout</code> and <code>purchase</code> events. Your implementation determines when they are sent. Adding another item or refreshing a page should not turn one shopping journey into several journeys in your calculation.</p>
    </section>
    <section id="worked-example" aria-labelledby="worked-example-title">
      <h2 id="worked-example-title">Calculate the rates</h2>
      <p>In this worked example, follow the same 100 shopping journeys over one observation period. Of those journeys, 60 start checkout and 45 complete an order. Each journey is counted once at each stage, and every completed order passes through the tracked cart and checkout steps.</p>
      <table className={s.comparison}>
        <caption>Three measures for the same 100 shopping journeys</caption>
        <thead><tr><th scope="col">Measure</th><th scope="col">Calculation and meaning</th></tr></thead>
        <tbody>{abandonmentRates.map(([measure, calculation, meaning]) => <tr key={measure}>
          <th scope="row">{measure}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Calculation and meaning</span><strong>{calculation}</strong><br />{meaning}</td>
        </tr>)}</tbody>
      </table>
      <p>The unfinished journeys are 40 before checkout and 15 during checkout: 55 in total. Do not add 40% and 25%. The first percentage divides by 100 cart journeys; the second divides by 60 checkout journeys.</p>
      <p>The general rule is to divide the number that did not reach the next stage by the number that entered the stage you are measuring, then multiply by 100. State those stages beside the result so readers know what it means.</p>
    </section>
    <section id="validate" aria-labelledby="validate-title">
      <h2 id="validate-title">Check the counts</h2>
      <p>Choose one counting unit and use it throughout. Shopping journeys, users, sessions and orders are not interchangeable. Decide how returning shoppers are handled and how long they have to complete a purchase. Today’s cart starts and today’s orders may belong to different journeys.</p>
      <p>If your report requires each step in sequence, a missing cart event can exclude a real purchase from that sequence. A customer using an express checkout may also take a different route. Check the report’s entry rules before interpreting a missing step as someone leaving.</p>
      <p>Run a normal test order, refresh its confirmation page and try a return visit using your provider’s approved test setup. Look for missing or repeated events. Google Analytics uses a unique transaction ID to identify duplicate purchase events for the same transaction. Ask your web team to verify that the ID is populated and is not reused for unrelated orders.</p>
      <p>Keep test traffic separate from customer activity. Record known gaps from consent choices, tracking restrictions or journeys that continue on another device. An analytics purchase event is a reporting signal, not independent proof that a payment completed. Use the order and gateway records to confirm the <Link href="/company/blog/payment-processing-systems" prefetch={false}>payment’s actual status</Link>.</p>
    </section>
    <section id="investigate" aria-labelledby="investigate-title">
      <h2 id="investigate-title">Find the next problem to test</h2>
      <p>The rate shows where to look, not why a shopper left. Someone may be comparing products, waiting to buy or encountering a fault. Use repeatable test journeys and relevant customer feedback to identify the problem.</p>
      <ul>
        <li><strong>Before checkout:</strong> Check that the checkout button works, items can be edited and delivery charges or estimates are clear. Review missing product or delivery information that customers ask about.</li>
        <li><strong>During checkout:</strong> Check address errors, account requirements, loading behavior and the supported payment methods. Try the same steps on a phone with the keyboard open.</li>
        <li><strong>At payment:</strong> Separate confirmed declines, canceled bank verification and payments whose outcome is still unknown. An unfinished checkout does not automatically mean the card was declined.</li>
      </ul>
      <p>For a practical set of recovery checks, see <Link href="/company/blog/optimize-your-mobile-checkout-experience" prefetch={false}>how to improve a mobile checkout experience</Link>. Your web team can use the <Link href="/developers/testing" prefetch={false}>checkout testing guidance</Link> to verify order and payment outcomes together.</p>
    </section>
    <section id="measure-changes" aria-labelledby="measure-changes-title">
      <h2 id="measure-changes-title">Measure after the fix</h2>
      <p>If a test reveals a delivery calculation that blocks checkout, fix it and repeat that test first. Then compare the reporting results using the same event definitions, counting unit and observation rules.</p>
      <p>Review both the counts and the rates. A different device mix, campaign or payment method can change the result even when the page is unchanged. If tracking code changed, confirm that you are still measuring the same journey.</p>
      <p>Keep a short record of the issue, correction and result. That gives the next checkout change a useful starting point without treating every unfinished cart as the same problem.</p>
    </section>
  </BlogArticlePage>;
}
