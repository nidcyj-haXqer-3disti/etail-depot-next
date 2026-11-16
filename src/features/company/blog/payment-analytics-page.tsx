import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentAnalyticsArticle } from "./payment-analytics-content";
import s from "./blog.module.css";

const measures = [
  ["Checkout completion", "How many tracked checkouts became paid orders? Define the starting event and count each checkout once."],
  ["Authorization rate", "How many requests sent for card authorization were approved? Confirm whether the report counts every attempt or groups retries."],
  ["Captured sales", "Which approved payments moved through capture? Keep canceled authorizations and refunds identifiable."],
] as const;

export function PaymentAnalyticsPage() {
  return <BlogArticlePage article={paymentAnalyticsArticle}>
    <p>A falling payment success rate deserves attention, but the percentage alone does not explain the problem. Customers may be retrying the same purchase, leaving during authentication or receiving an issuer decline. Each situation calls for a different response.</p>
    <section id="define-measures" aria-labelledby="define-measures-title">
      <h2 id="define-measures-title">Know what each number counts</h2>
      <p>Write down the question before choosing the chart. An order, a payment attempt and an approved authorization are different records.</p>
      <table className={s.comparison}>
        <caption>Three measures that answer different questions</caption>
        <thead><tr><th scope="col">Measure</th><th scope="col">What to check</th></tr></thead>
        <tbody>{measures.map(([measure, check]) => <tr key={measure}>
          <th scope="row">{measure}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to check</span>{check}</td>
        </tr>)}</tbody>
      </table>
      <p>For a rate, record what is being divided by what. Also record the period, date field, time zone and exclusions. If there are no eligible records, show that there is no data rather than reporting a success rate.</p>
      <p>Provider definitions matter. Stripe’s network authorization rate excludes attempts stopped before reaching the network, while its broader payment success rate includes authentication failures and blocked payments. Neither measure establishes that an approved payment was captured.</p>
      <p>For checkout measurement, use the same starting event and completion rule throughout your comparison. The <Link href="/company/blog/cart-abandonment-vs-checkout-abandonment" prefetch={false}>cart and checkout abandonment guide</Link> explains why changing the starting point changes the result.</p>
    </section>
    <section id="orders-and-retries" aria-labelledby="orders-and-retries-title">
      <h2 id="orders-and-retries-title">Keep retries separate from orders</h2>
      <p>A customer may correct a card detail and try again. That creates another attempt for the same purchase. Counting all attempts answers a different question from counting the purchase’s eventual outcome.</p>
      <p>Stripe distinguishes a raw view, which includes retries, from a deduplicated view that groups related attempts. A provider’s grouping rules may not exactly match your store’s order IDs, so check the definition before comparing it with your own order count.</p>
      <p>Keep both views when available. Fewer unsuccessful attempts can mean a smoother checkout even when the number of paid orders stays the same. More attempts alone do not demonstrate more sales.</p>
      <p>Use the store’s order reference and the gateway’s transaction references to investigate the connection. Keep repeated notifications separate from genuinely new attempts, and leave unresolved outcomes visible until you can verify them.</p>
    </section>
    <section id="compare-fairly" aria-labelledby="compare-fairly-title">
      <h2 id="compare-fairly-title">Compare equivalent groups</h2>
      <p>Before concluding that checkout improved or deteriorated, check whether you are comparing the same kind of business activity.</p>
      <ul>
        <li><strong>Account and currency.</strong> Select the corresponding merchant account, store or DBA. Keep currencies separate unless the report documents how it converts them.</li>
        <li><strong>Customer journey.</strong> Where your data supports it, compare the same device type, payment method and customer market. A change in the mix can change the overall result.</li>
        <li><strong>Time and completeness.</strong> Use comparable periods, the same time zone and the same reporting delay. Show the record count alongside the percentage.</li>
        <li><strong>Tests and exclusions.</strong> Identify test activity, invalid requests and duplicate records consistently. Record what you exclude and why.</li>
      </ul>
      <p>Refunds and disputes require another date check. A dispute opened this week can relate to an older sale. Stripe’s dispute reporting distinguishes dispute date from original payment date and warns that recent sales have had less time to develop disputes.</p>
      <p>Use activity dates to track current workload. To assess a checkout change, also follow the later outcomes of the affected sales. Keep that internal analysis separate from any network monitoring calculation your provider requires.</p>
    </section>
    <section id="check-records" aria-labelledby="check-records-title">
      <h2 id="check-records-title">Connect the chart to payment records</h2>
      <p>When a chart changes unexpectedly, inspect the underlying transactions. Authorization, capture, settlement and refund records represent different stages. Adyen’s reporting documentation illustrates how different reports cover different parts of that lifecycle.</p>
      <p>For merchants using Trolleys, an Etail Depot service, use the Back Office Operations Portal for merchant account activity and the store’s Cybersource Business Center for gateway records. Select the corresponding MID, DBA, currency and period. Available reports and fields depend on the account configuration.</p>
      <p>Cybersource’s Payment Batch Detail report covers sales and refunds submitted to the processor. Its standard fields include batch and request references, status and dates. It does not describe every visitor who began your website’s checkout.</p>
      <p>Match records through their documented references and check the operation and status. An analytics event or a thank-you page alone does not establish the provider’s final payment outcome. Keep unresolved transactions separate while investigating them.</p>
      <p>Trolleys’ <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> concerns merchant account and gateway records. Confirming a deposit in your bank is a separate funding check. The <Link href="/company/blog/how-batch-payment-processing-works" prefetch={false}>batch processing guide</Link> explains how reporting periods can differ.</p>
    </section>
    <section id="choose-action" aria-labelledby="choose-action-title">
      <h2 id="choose-action-title">Turn a finding into a useful change</h2>
      <p>Separate checkout input problems, authentication outcomes, issuer responses and unresolved technical results. Authentication reporting can distinguish an abandoned or failed challenge from unavailable authentication or a flow that was not started. Those findings deserve different investigations.</p>
      <ol>
        <li><strong>Choose a specific problem.</strong> If customers struggle with a field, review its label and error message. If payments are declined, inspect the recorded response instead of assuming the design caused it.</li>
        <li><strong>Record the change.</strong> Note what changed, when it went live and which customers or checkout version it affected.</li>
        <li><strong>Compare the outcome.</strong> Use the same definitions and comparable groups. Check paid orders, repeated attempts and support requests as well as the headline rate.</li>
        <li><strong>Review later effects.</strong> Allow for reporting delays, refunds and disputes. A small or unfinished set of transactions is not enough to establish a lasting improvement.</li>
      </ol>
      <p>Keep enough detail for someone else to repeat the analysis, using order and payment references rather than copying full card details into working files. A useful report ends with a clear finding, an owner and a decision to check.</p>
      <p>For decline investigations, start with <Link href="/company/blog/credit-card-declines" prefetch={false}>what card decline responses mean</Link>. If a Trolleys record remains unclear, <Link href="/company/contact#account-support" prefetch={false}>contact account support</Link> with the relevant references and reporting period.</p>
    </section>
  </BlogArticlePage>;
}
