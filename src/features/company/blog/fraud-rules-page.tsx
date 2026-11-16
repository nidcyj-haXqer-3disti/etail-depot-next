import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { fraudRulesArticle } from "./fraud-rules-content";

export function FraudRulesPage() {
  return <BlogArticlePage article={fraudRulesArticle}>
    <p>Imagine Monday’s payment report shows that a new fraud rule stopped 100 attempts over the weekend. The number looks reassuring. Then customer support forwards messages from buyers who could not complete their orders.</p>
    <p>Both reports can be accurate. The rule did what it was told to do. Whether it helped the business is a different question.</p>
    <p>Fraud detection analytics connects a payment decision to what happened afterward. The useful result includes fraud caught, legitimate customers affected and the effort needed to tell them apart. An alert count gives you only the starting point.</p>

    <section id="read-the-hundred-alerts" aria-labelledby="read-the-hundred-alerts-title">
      <h2 id="read-the-hundred-alerts-title">Read the 100 alerts before celebrating them</h2>
      <p>Consider a hypothetical evaluation set of 1,000 past payments whose outcomes have been established: 40 fraudulent and 960 legitimate. A proposed rule flags 100 of them. Within those alerts are 30 fraudulent payments and 70 legitimate ones. The other 10 fraudulent payments escape the rule.</p>
      <ul>
        <li><strong>30 of 100 alerts are fraud.</strong> That is 30% precision: how often the flag is right.</li>
        <li><strong>30 of 40 fraudulent payments are caught.</strong> That is 75% recall: how much of the known fraud the rule finds.</li>
        <li><strong>70 legitimate payments are flagged.</strong> Those are the customers affected by whatever action follows.</li>
      </ul>
      <p>The arithmetic describes this made-up dataset, not a performance claim or a forecast for your store. It shows why “100 payments stopped” cannot stand in for “100 fraudulent payments prevented.”</p>
      <p>If every flag would trigger a block, the rule would reject those 70 legitimate payments as well. If every flag would create a review, the team would receive 100 cases. The same rule can have very different consequences depending on its action.</p>
      <p>There is another limit in live use: you generally cannot observe what every blocked payment would have become. A provider’s estimate of prevented fraud is still an estimate. Stripe, for example, explicitly labels its rule-level fraud prevention and false-positive figures as estimates. Keep those separate from investigated outcomes.</p>
    </section>

    <section id="give-outcomes-time" aria-labelledby="give-outcomes-time-title">
      <h2 id="give-outcomes-time-title">Last weekend is too young to tell the whole story</h2>
      <p>A payment can look uneventful today and receive a fraud report or dispute later. Comparing this weekend’s new rule with last month’s older payments can therefore make the new rule look better before its outcomes have had time to emerge.</p>
      <p>Choose comparable groups and a consistent observation period. Record the payment date, when a concern was reported and what the later review established. Leave unresolved cases marked unresolved. The absence of a dispute so far does not prove that a payment is legitimate.</p>
      <p>Stripe’s analytics documentation distinguishes payment date from fraud arrival date and lets users separate payment counts from monetary volume. Those distinctions are useful beyond one provider: a chart can change meaning when its date basis or denominator changes.</p>
      <p>Repeated attempts matter too. One buyer trying three times is different from three buyers making one attempt each. Keep both the attempts and their connection to the order visible. Otherwise a checkout problem can inflate the apparent number of customers or suspicious events.</p>
      <p>Keep the reasons separate as well. An issuer decline, a gateway risk block and a goods-not-received dispute describe different events. A delivery complaint should not quietly become a confirmed stolen-card case in your analysis. Our article on <Link href="/company/blog/credit-card-declines" prefetch={false}>card declines</Link> explains why identifying the decision comes before trying to fix it.</p>
    </section>

    <section id="count-the-business-cost" aria-labelledby="count-the-business-cost-title">
      <h2 id="count-the-business-cost-title">The review queue belongs in the calculation</h2>
      <p>Sending an uncertain order to a person can be sensible. Sending every uncertain order to a team that cannot respond before dispatch creates a different problem. Record how long reviews take, how many remain open and what happens to the order while it waits.</p>
      <p>Look at money as well as case counts. Catching several small fraudulent orders and missing one expensive shipment can produce an attractive alert report and an uncomfortable loss. Compare the exposure prevented with remaining losses, review effort and the contribution from legitimate sales you can show were lost. A blocked order’s full sale price is not automatically lost profit.</p>
      <p>Ask what changed around the rule. A new product, promotion, delivery promise or checkout update can change who buys and how they behave. A sudden rise in alerts deserves investigation before someone assumes the entire difference is an attack.</p>
      <p>Review a sample of affected orders against the rule’s intended purpose. If a condition mainly catches ordinary customers making an understandable choice, consider a more specific condition or a different supported action with your provider. Do not broadly allow suspicious traffic just to make the approval chart improve.</p>
      <p>The question for the business is concrete: does this decision reduce meaningful loss while leaving a workable route for legitimate customers to buy?</p>
    </section>

    <section id="make-a-measured-change" aria-labelledby="make-a-measured-change-title">
      <h2 id="make-a-measured-change-title">Bring a specific pattern to your payment team</h2>
      <p>For Trolleys, an Etail Depot service, a useful support conversation starts with the affected merchant account, payment references, time period and observed behavior. “Fraud is up” is hard to investigate. A set of matching transactions and a record of what changed gives the team something to examine.</p>
      <p>Connect the gateway result with the original order and merchant account record. If your business has several DBAs, keep the account association intact. Our <Link href="/company/blog/transaction-details-reports" prefetch={false}>transaction reporting article</Link> explains why matching the references matters before drawing conclusions from separate reports.</p>
      <p>Ask which fraud controls, reports and testing options are enabled for that account. Cybersource describes Decision Manager Replay as a way to test strategies against historical transactions. Its availability is an account and product question; a Cybersource login alone does not establish access. Historical results also do not guarantee how tomorrow’s traffic will behave.</p>
      <p>Before an authorized change, record the existing setting, the intended improvement, who will monitor it and what would trigger a return to the previous configuration. Use the provider’s supported testing process. Changing a fraud rule should not become an unrecorded experiment on every customer at once.</p>
      <p><Link href="/company/contact" prefetch={false}>Bring the pattern to our team</Link> through the requested support channel, without sending full card numbers or credentials. For existing disputes, continue following each case’s <Link href="/services/disputes" prefetch={false}>response requirements and deadlines</Link>. Tuning future decisions does not resolve earlier claims.</p>
    </section>

    <p>The customer behind a false alarm still wanted to place an order. Good fraud analysis keeps that person in view while taking the real losses seriously. Give both sides a place in the report before deciding that a stricter rule is a better one.</p>
  </BlogArticlePage>;
}
