import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { multipleProcessorsArticle } from "./multiple-processors-content";
import s from "./blog.module.css";

const paymentRecords = [
  ["Order", "The customer’s purchase reference, amount and currency, shared across its payment attempts."],
  ["Attempt", "A distinct reference for each attempt, its time, selected provider and current outcome."],
  ["Merchant account", "The legal business, store or DBA and merchant account associated with the payment."],
  ["Provider transaction", "The gateway or processor reference needed to retrieve the result and handle capture, cancellation or refund."],
  ["Later activity", "Refunds, disputes, fees and funding references linked back to the original payment."],
] as const;

export function MultipleProcessorsPage() {
  return <BlogArticlePage article={multipleProcessorsArticle}>
    <p>Using two providers is an operating decision, not just another button at checkout. Someone must decide where each payment goes and help staff find it afterward. Two provider names do not automatically make the payment journey more reliable.</p>
    <section id="identify-gap" aria-labelledby="identify-gap-title">
      <h2 id="identify-gap-title">Identify the gap a second provider would fill</h2>
      <p>A business might need a payment method, market or acquiring arrangement that its current provider cannot support. Another might need an alternative for a particular service outage. Establish that need before comparing prices or building another integration.</p>
      <p>Check where the failure actually occurs. Two processing connections may still depend on the same storefront, internet connection or checkout software. A second processor does not repair a shared component that has stopped working.</p>
      <p>Several merchant accounts are not necessarily several processors. Stores or DBAs can have separate MIDs under one service arrangement. Likewise, displaying several payment methods does not establish that payments use independent processing routes. Map the actual account and provider relationships.</p>
      <p>Start by asking whether your existing provider can meet the requirement. If a second relationship is needed, compare the account terms and supported connection using our <Link href="/company/blog/choose-a-merchant-services-provider" prefetch={false}>provider selection checklist</Link>.</p>
    </section>
    <section id="weigh-the-work" aria-labelledby="weigh-the-work-title">
      <h2 id="weigh-the-work-title">Include the work behind the connection</h2>
      <p>Compare the expected benefit with integration costs, account charges, ongoing maintenance, reporting and staff time. A lower transaction rate may not outweigh another set of fees and daily reconciliation work. Use your own processing activity rather than a hypothetical saving.</p>
      <p>Assign responsibility for the connection, payment rules, finance reports and customer support. Staff need to know which system holds the original transaction, including when a customer contacts you after the preferred provider has changed.</p>
      <p>An <strong>orchestration service</strong> can apply rules that select among supported processors. Check exactly what it handles. Stripe’s documentation, for example, says that its third party processors retain their own fees and transaction responsibilities. Their dashboards still handle disputes and settlement activity; a shared interface does not combine every operation.</p>
      <p>Confirm supported payment methods, account eligibility and access before planning around a routing product. General orchestration capabilities do not establish that your store or Trolleys account has automatic routing or retries across providers.</p>
    </section>
    <section id="payment-records" aria-labelledby="payment-records-title">
      <h2 id="payment-records-title">Keep each payment traceable</h2>
      <p>Use one order history that connects the purchase to each payment attempt and its provider records. The names and fields differ between systems, but your team should be able to answer these questions without guessing.</p>
      <dl className={s.identifierList}>
        {paymentRecords.map(([label, detail]) => <div key={label}>
          <dt>{label}</dt><dd>{detail}</dd>
        </div>)}
      </dl>
      <p>For a capture, cancellation or refund, follow the original transaction through its provider’s supported process. A new preferred route does not move an older payment. If an orchestration interface offers refunds, confirm which processor administers them.</p>
      <p>Saved payment details need a separate plan. A token issued by one system is not automatically usable in another. Ask both providers about supported sharing or secure migration, customer permissions and any subscription changes. Stripe’s migration process, for example, includes coordination with the previous processor and mapping old records to new identifiers. Do not move raw card details through ordinary spreadsheets or email.</p>
      <p>For merchants using Trolleys, an Etail Depot service, match merchant account and gateway records for the correct MID, reporting period and transaction status. Then follow funding separately. The <Link href="/services/reconciliation" prefetch={false}>reconciliation</Link> and <Link href="/services/payouts" prefetch={false}>payout</Link> pages describe those tasks.</p>
    </section>
    <section id="uncertain-results" aria-labelledby="uncertain-results-title">
      <h2 id="uncertain-results-title">Resolve uncertainty before changing routes</h2>
      <p>A timeout means the response did not arrive as expected. It does not prove the payment failed. Cybersource instructs merchants to resolve an unknown transaction outcome before taking further payment actions. Sending the purchase to another processor too soon can create another authorization or charge.</p>
      <p>Check the original provider’s transaction status, notifications and supported recovery process. Search results may take time to appear, so an immediate empty search is not enough evidence to retry elsewhere. Keep the customer’s order in a clear pending state while the result is investigated.</p>
      <p>Developers also need duplicate protection. An <strong>idempotency key</strong> lets a supported API recognize a repeat of the same operation. Follow that API’s rules and retention period. Do not assume that sending the same key to a different provider protects the order across both systems; the integration must coordinate that decision.</p>
      <p>A confirmed decline is different from an unknown result. Retry eligibility depends on the response, required authentication, processor capabilities and applicable rules. Stripe’s orchestration documentation lists cases where another processor will not be tried, including certain 3D Secure and unsupported feature scenarios. Do not treat every failure as permission to try again elsewhere.</p>
      <p>Our <Link href="/company/blog/credit-card-declines" prefetch={false}>decline and timeout article</Link> explains how to give the customer an appropriate next step.</p>
    </section>
    <section id="prove-the-route" aria-labelledby="prove-the-route-title">
      <h2 id="prove-the-route-title">Start with one defined use case</h2>
      <p>Begin with a limited, approved group of payments. Define who owns the rules and when new traffic should stop using the connection. Before expanding it, verify:</p>
      <ol>
        <li><strong>The intended route.</strong> Confirm that the eligible payment reaches the correct provider and merchant account in the approved test environment.</li>
        <li><strong>Uncertain and unsuccessful results.</strong> Test timeouts, declined payments, interrupted authentication and delayed notifications. Establish how one order avoids duplicate payment or fulfillment.</li>
        <li><strong>Work after the sale.</strong> Demonstrate capture, refund, dispute handling where available for testing, and the reports needed to follow fees and funding.</li>
        <li><strong>A controlled stop.</strong> Stop new traffic on the route while retaining access to existing payments, refunds and other outstanding obligations.</li>
      </ol>
      <p>Compare results for similar payment methods, markets and customer activity. Count completed orders as well as attempts, and include fees, disputes and support effort before calling the change an improvement. Use the <Link href="/company/blog/payment-analytics" prefetch={false}>payment analytics guide</Link> to keep the measures consistent.</p>
      <p>Etail’s <Link href="/developers/testing" prefetch={false}>checkout testing guidance</Link> covers the supported Trolleys connection, not a general orchestration service. If the aim is to replace an existing provider, also review the <Link href="/use-cases/switch-merchant-services" prefetch={false}>switching checklist</Link>.</p>
      <p>A second processor is worthwhile when it solves a confirmed problem and your team can operate both arrangements reliably. Improving one supported connection may be the better choice when the added work exceeds the benefit.</p>
    </section>
  </BlogArticlePage>;
}
