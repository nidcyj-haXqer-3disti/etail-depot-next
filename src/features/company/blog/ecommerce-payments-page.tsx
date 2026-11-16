import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { ecommercePaymentsArticle } from "./ecommerce-payments-content";
import s from "./blog.module.css";

const records = [
  ["Order and delivery", "What the customer bought, the agreed total and the fulfillment commitment.", "Order reference, items, delivery status and any cancellation or return."],
  ["Payment", "Attempts to collect the order amount and their verified results.", "Gateway reference, amount, currency, authorization, capture and any refund."],
  ["Settlement and payout", "How processed payments contribute to funds sent to the business.", "Transaction references, reporting period, deductions, adjustments and payout reference."],
] as const;

export function EcommercePaymentsPage() {
  return <BlogArticlePage article={ecommercePaymentsArticle}>
    <section id="three-records" aria-labelledby="three-records-title">
      <h2 id="three-records-title">Keep three records connected</h2>
      <p>The customer sees a checkout page. Your team also needs to know what was ordered, whether the payment succeeded and how that payment appears in later reports. Give staff a way to move between those records using references, rather than matching names and amounts by guesswork.</p>
      <table className={s.comparison}>
        <caption>Three views of the same online sale</caption>
        <thead><tr><th scope="col">Record</th><th scope="col">What it explains</th><th scope="col">What to retain</th></tr></thead>
        <tbody>{records.map(([record, purpose, details]) => <tr key={record}>
          <th scope="row">{record}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it explains</span>{purpose}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to retain</span>{details}</td>
        </tr>)}</tbody>
      </table>
      <p>For a card payment, <Link href="/company/blog/card-authorization" prefetch={false}>authorization</Link> is the issuer’s decision on the request. An approval can reserve the requested amount. Capture submits the approved payment for further processing. Neither an approval nor a submitted capture proves that a deposit has reached your bank.</p>
      <p>Your checkout may request authorization and capture together or support a later capture. Confirm the sequence, permitted timing and fulfillment requirements with your provider. Do not assume that every payment method uses the same stages.</p>
    </section>
    <section id="worked-order" aria-labelledby="worked-order-title">
      <h2 id="worked-order-title">Follow one order through the records</h2>
      <p>Suppose a retailer uses a supported setup that authorizes a card at checkout and captures when the goods are ready to dispatch. Follow the order through four checks:</p>
      <ol>
        <li><strong>Confirm the order.</strong> Retain the agreed items, total, currency and delivery details under one order reference.</li>
        <li><strong>Verify the authorization.</strong> Match the gateway result to that order, including the amount, currency and merchant account.</li>
        <li><strong>Record capture and dispatch.</strong> Check the capture result under the agreed workflow, and keep the shipment record separately. A payment result does not prove the goods were sent.</li>
        <li><strong>Follow the reporting.</strong> Match the processed payment to the merchant records and, when included in a payout, review the payout detail.</li>
      </ol>
      <p>A payout can combine several sales with refunds, fees or other adjustments. A deposit below an order’s total does not by itself mean the customer underpaid. Identify the transactions and deductions in the relevant report before explaining the difference.</p>
      <p>For merchants using Trolleys, an Etail Depot service, <Link href="/services/reconciliation" prefetch={false}>payment reconciliation</Link> compares merchant account reports with gateway reports. Matching a payout to its bank receipt is a separate check. Use the corresponding business, currency and reporting period in each comparison.</p>
      <p>If the customer later cancels or returns an item, retain the connection to the original order and payment. Ask which operation applies to its current status. Releasing an authorization, canceling a capture and refunding a completed payment are not interchangeable actions.</p>
    </section>
    <section id="uncertain-results" aria-labelledby="uncertain-results-title">
      <h2 id="uncertain-results-title">Check an uncertain result before collecting again</h2>
      <p>A browser timeout does not prove that a payment failed. The request may have reached the provider even though the customer never received the confirmation. Find the original attempt and its verified result before requesting another payment.</p>
      <p>Stripe’s Payment Intents documentation illustrates one provider’s approach: reuse the payment record when an interrupted checkout resumes, and use server notifications to follow outcomes. Other providers have their own recovery mechanisms. Ask your integration team how your store resolves the original attempt.</p>
      <ul>
        <li><strong>Confirmed failure.</strong> Keep the order unpaid and explain the next permitted action, such as choosing another payment method.</li>
        <li><strong>Pending or unknown.</strong> Keep the order identifiable, investigate the existing attempt and avoid a fresh collection while its outcome is unresolved.</li>
        <li><strong>Confirmed payment result.</strong> Check whether it represents authorization, capture or a later stage, then apply the store’s fulfillment rules.</li>
      </ul>
      <p>Keep payment status separate from delivery status. A successful result still needs an order and a fulfillment decision. A customer closing the checkout window is not, by itself, a confirmed cancellation of the payment.</p>
    </section>
    <section id="choose-fit" aria-labelledby="choose-fit-title">
      <h2 id="choose-fit-title">Evaluate the whole operating flow</h2>
      <p>Ask a prospective provider to demonstrate an approved payment, a decline, an interrupted checkout, a cancellation and a refund using your store’s integration. Include the person who answers customer questions and the person who reconciles payment reports.</p>
      <p>Start in the sandbox and agree any live validation separately. On desktop and mobile, check whether a returning customer can understand the order’s status, whether staff can find the original payment, and whether repeated messages or clicks can duplicate a charge or fulfillment action. Our <Link href="/developers/testing" prefetch={false}>checkout testing guide</Link> covers those checks.</p>
      <p>Before choosing the service, review supported methods, total charges, capture settings, payout arrangements and who handles exceptions. Ask for the reports your team will actually receive, including their references and status definitions.</p>
      <p>Payment success, delivery success and profitability are different outcomes. Track each one, and make sure the people responsible can connect them without reconstructing the sale from emails.</p>
    </section>
  </BlogArticlePage>;
}
