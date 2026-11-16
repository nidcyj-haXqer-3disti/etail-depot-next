import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achTimingArticle } from "./ach-timing-content";
import s from "./blog.module.css";

const paymentStages = [
  ["Customer instruction", "The customer authorizes or schedules the payment.", "Has an ACH entry actually been submitted, or is the instruction still waiting?"],
  ["Provider and bank acceptance", "The provider checks the instruction and forwards it through the originating bank.", "Was it accepted before the applicable cutoff, and what effective date was assigned?"],
  ["Network settlement", "The ACH entry settles between the banks on a banking date.", "What settlement date is confirmed for this entry?"],
  ["Bank availability or merchant payout", "The receiving bank posts the funds, or a provider releases a merchant payout under the account arrangement.", "When can the recipient use the money, and is a separate payout still pending?"],
] as const;

export function AchTimingPage() {
  return <BlogArticlePage article={achTimingArticle}>
    <p>Nacha describes ACH debits as settling on the same or next banking day. Both credit and debit timing refer to the ACH entry’s settlement, rather than the entire period since a customer clicked Pay. If you are new to the process, our <Link href="/company/blog/ach-payments" prefetch={false}>ACH payments article</Link> explains who sends the instruction and which banks handle it.</p>
    <section id="payment-timeline" aria-labelledby="payment-timeline-title">
      <h2 id="payment-timeline-title">Identify which stage you are waiting for</h2>
      <p>“Processing” can describe several different events. Use the provider’s status definitions and records to establish what has happened, rather than starting a new countdown whenever a label changes.</p>
      <figure className={s.editorialTiming} aria-labelledby="payment-stages-caption">
        <figcaption id="payment-stages-caption">Four stages that can sit behind a payment timing question</figcaption>
        <ol className={s.editorialTimeline} role="list">
          {paymentStages.map(([stage, event, question], index) => <li key={stage}>
            <span className={s.editorialTimelineNumber} aria-hidden="true">{index + 1}</span>
            <div>
              <h3>{stage}</h3>
              <p>{event}</p>
              <p className={s.editorialStageQuestion}><span>What to confirm</span>{question}</p>
            </div>
          </li>)}
        </ol>
      </figure>
      <p>Same Day ACH requires an eligible entry to reach the bank before its applicable deadline. A website accepting instructions at any hour does not make ACH settlement available around the clock.</p>
      <p>Weekends and applicable federal holidays affect the banking calendar. The effective entry date is the date the originator wants the transaction to occur; the bank’s processing rules and deadlines determine how the file is handled. Ask for the actual date and time zone, not just “tomorrow.”</p>
    </section>
    <section id="find-delay" aria-labelledby="find-delay-title">
      <h2 id="find-delay-title">Find the last confirmed event</h2>
      <p>A customer authorizing a payment late on Friday may immediately see “processing.” That does not establish whether the entry reached the bank before its cutoff or which banking date applies.</p>
      <ol>
        <li><strong>Check submission.</strong> Record when the customer authorized the payment and when the provider accepted it. Confirm whether bank submission occurred.</li>
        <li><strong>Check the calendar.</strong> Ask for the applicable cutoff, time zone and effective date. Include any weekend or holiday before estimating the next event.</li>
        <li><strong>Check the result.</strong> Look for a rejection, return or confirmed settlement. An instruction rejected before submission needs investigation, not more time in the network.</li>
        <li><strong>Check funding separately.</strong> If settlement is confirmed, find the associated payout status and expected bank receipt. Ask whether a schedule, review or account condition affects its release.</li>
      </ol>
      <p>A missing merchant payout is not a reason to debit the customer again. Etail’s <Link href="/services/payouts" prefetch={false}>payout page</Link> explains how included payments and account adjustments connect to a bank deposit. Timing depends on the merchant’s account terms.</p>
      <p>A pending bank deposit can also mean the bank has received notice of money due on a future date. Ask the bank to explain that specific status before assuming the payment is overdue.</p>
    </section>
    <section id="next-milestone" aria-labelledby="next-milestone-title">
      <h2 id="next-milestone-title">Ask what happens next</h2>
      <p>Give the bank or initiating provider the payment reference, amount, intended recipient and dated event history through its secure support channel. Ask for the last completed event, the next expected event and who will investigate if it does not happen.</p>
      <p>Where an ACH entry exists, its <Link href="/company/blog/ach-trace-number" prefetch={false}>trace number</Link> can help the banks identify it. A trace number is not proof of receipt. Nacha sets network rules but does not process payments or provide a public tracking service for individual entries.</p>
      <p>Continue checking for returns. Cybersource explains that an eCheck payment can pass initial validation and still be rejected or returned later. Read the reason and follow the provider’s process before considering another attempt.</p>
      <p>For customers and suppliers, quote the timing that your actual service supports. State whether the date means expected settlement, payout release or usable funds in the bank. Keep estimates separate from confirmed events.</p>
    </section>
  </BlogArticlePage>;
}
