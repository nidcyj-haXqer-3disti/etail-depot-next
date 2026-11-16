import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { echeckClearingArticle } from "./echeck-clearing-content";
import s from "./blog.module.css";

const paymentEvents = [
  ["Accepted", "The gateway has received the payment instruction.", "It does not establish that the customer’s bank will pay it."],
  ["Sent for settlement", "The instruction has been passed to a bank for processing.", "It does not establish that money is available to your business."],
  ["Completed", "The provider has reached its defined completion point.", "Read that definition. A later return may still be possible."],
  ["Funded", "The provider has deposited the collected proceeds in your bank account.", "Keep monitoring the original payment for returns and account adjustments."],
] as const;

export function EcheckClearingPage() {
  return <BlogArticlePage article={echeckClearingArticle}>
    <p>This article covers eCheck payments collected from a customer’s bank account through the US ACH network. It does not cover a scanned paper check deposited through a banking app. For the wider timing picture, see <Link href="/company/blog/how-long-do-ach-payments-take-to-process" prefetch={false}>how long ACH payments take</Link>.</p>
    <section id="payment-status" aria-labelledby="payment-status-title">
      <h2 id="payment-status-title">Find out what cleared means</h2>
      <p>There is no single clearing deadline that tells every merchant when to ship. Start with the exact eCheck service you use, its status definitions and the funding terms on your account.</p>
      <table className={s.comparison}>
        <caption>Four payment events to distinguish before releasing an order</caption>
        <thead><tr><th scope="col">Event</th><th scope="col">What it tells you</th><th scope="col">What to keep in mind</th></tr></thead>
        <tbody>{paymentEvents.map(([event, meaning, limit]) => <tr key={event}>
          <th scope="row">{event}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it tells you</span>{meaning}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to keep in mind</span>{limit}</td>
        </tr>)}</tbody>
      </table>
      <p>Labels vary by provider. In Cybersource’s documented eCheck flow, Pending means the gateway received the transaction, while Transmitted means it was sent to a bank for settlement. Completed means no return was received within three days of submission for settlement, but the documentation explicitly allows for a later return. That status is not a universal three day funding promise.</p>
      <p>Cybersource also distinguishes collection from funding to the merchant. Account holding periods, submission cutoffs, banking days and returns affect when proceeds arrive. Use your account’s actual schedule rather than a generic estimate.</p>
    </section>
    <section id="release-order" aria-labelledby="release-order-title">
      <h2 id="release-order-title">Decide when to fulfill the order</h2>
      <p>Cybersource advises waiting until the eCheck holding period is over before shipping or providing access to merchandise, because available funds are not checked in real time. Follow the requirements of your own provider and account.</p>
      <p>Then consider what fulfilling the order commits your business to. A downloadable template and a custom fabrication job create different costs if payment is later returned. Waiting for a status change is only one part of that decision.</p>
      <ol>
        <li><strong>Confirm the payment.</strong> Match the transaction to the order and check its latest result. An accepted instruction is not enough to confirm collection.</li>
        <li><strong>Confirm the release condition.</strong> Check the required holding period and any account review. Record which event your team must see before releasing goods or starting work.</li>
        <li><strong>Identify the commitment.</strong> Know when an order becomes difficult to recover or cancel, such as dispatch, immediate digital access or the start of custom production.</li>
        <li><strong>Set the customer’s expectation.</strong> Explain when fulfillment will begin and who will contact them if payment needs attention. Keep an expected date separate from a confirmed release.</li>
      </ol>
      <p>No waiting period guarantees that a payment can never be returned. Make the release decision explicit so sales, fulfillment and accounting follow the same policy.</p>
    </section>
    <section id="after-release" aria-labelledby="after-release-title">
      <h2 id="after-release-title">Keep checking after fulfillment</h2>
      <p>An eCheck can pass the gateway’s initial validation and fail a later bank check. Cybersource lists insufficient funds, authorization issues and administrative problems such as a closed or invalid account among return reasons.</p>
      <p>Keep return reports linked to the original order or invoice. If money is returned after fulfillment, record the account adjustment and review whether unfinished work should pause or the outstanding balance needs attention. Tell the customer what happened using the actual reason supplied by the provider.</p>
      <p>A return is not an instruction to debit the customer again automatically. Check the return code and the provider’s rules before another attempt. An authorization issue needs a different response from insufficient funds. Our <Link href="/company/blog/ach-debit" prefetch={false}>ACH debit article</Link> explains the role of customer permission.</p>
      <p>A useful answer to “Has it cleared?” names the event: the payment was accepted, the holding period ended or the proceeds reached the bank. That gives your team something concrete to act on while it continues monitoring returns.</p>
    </section>
  </BlogArticlePage>;
}
