import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { instantAchArticle } from "./instant-ach-content";
import s from "./blog.module.css";

const paymentChoices = [
  ["Who starts the payment", "A payer sends an ACH credit, or a business collects an authorized ACH debit.", "The payer instructs a transfer. A request for payment asks the payer to act; it does not collect a debit."],
  ["When it processes", "Payments clear in batches and settle on banking days. Eligible payments can use Same Day ACH.", "FedNow and RTP process individual payments around the clock, including weekends and holidays."],
  ["Scheduled collections", "An authorized recurring debit can collect agreed payments on a schedule.", "Check whether the bank supports scheduling or payment requests. Sending a transfer is different from authorizing a business to collect."],
  ["Access to the service", "Confirm the account’s debit or credit service, limits and submission deadlines.", "Confirm sending access, the recipient’s reachability, limits and the features available through the bank."],
] as const;

export function InstantAchPage() {
  return <BlogArticlePage article={instantAchArticle}>
    <p>Start with the job the payment needs to do. Collecting a monthly bill and reimbursing a contractor on a Saturday are different tasks. One business can use different methods for each.</p>
    <section id="direction-and-time" aria-labelledby="direction-and-time-title">
      <h2 id="direction-and-time-title">Compare direction as well as speed</h2>
      <p>ACH can move money in either direction: a credit sends it, while an authorized debit collects it. FedNow and RTP support credit transfers. A payment request is a message asking for payment, not permission to take money from an account.</p>
      <table className={s.comparison}>
        <caption>ACH and instant payments in a business workflow</caption>
        <thead><tr><th scope="col">What matters</th><th scope="col">ACH</th><th scope="col">Instant payments</th></tr></thead>
        <tbody>{paymentChoices.map(([choice, ach, instant]) => <tr key={choice}>
          <th scope="row">{choice}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">ACH</span>{ach}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Instant payments</span>{instant}</td>
        </tr>)}</tbody>
      </table>
      <p>Network availability is not the same as access through your account. A bank may support receiving instant payments without offering you a way to send them. Confirm the actual service before promising a payment deadline. Our <Link href="/company/blog/fednow-vs-rtp" prefetch={false}>FedNow and RTP comparison</Link> covers the two networks in more detail.</p>
      <h3>Monthly bills and an urgent reimbursement</h3>
      <p>A property service collects agreed monthly maintenance fees. Its priorities are clear authorization, a predictable schedule and handling failed collections. A <Link href="/company/blog/how-recurring-ach-payments-work" prefetch={false}>recurring ACH debit</Link> may fit that process.</p>
      <p>The same business needs to reimburse a contractor urgently on a weekend. If its account can send an instant payment to that contractor’s account, the transfer may fit the deadline. It does not need to replace the monthly collection arrangement.</p>
    </section>
    <section id="operations" aria-labelledby="operations-title">
      <h2 id="operations-title">Plan around the payment your business needs</h2>
      <p>Ask the bank or provider to show how these four parts work for your account.</p>
      <ol>
        <li><strong>Collection or transfer.</strong> Does the business need to collect an authorized debit, or can the payer approve a transfer or arrange a supported schedule?</li>
        <li><strong>The deadline.</strong> Does the recipient need the funds outside banking days? Check the payment method, destination, limits and any review that must happen before sending.</li>
        <li><strong>The payment record.</strong> Can your team match the payment reference and status to the invoice or reimbursement? Keep the confirmation with that record.</li>
        <li><strong>Approval and support.</strong> Decide who reviews a new recipient or changed bank details, who releases the payment and who handles an issue outside office hours.</li>
      </ol>
      <p>Same Day ACH still follows processing windows and deadlines. It does not turn ACH into a continuous instant network. Ask your provider for its submission cutoff and expected availability. Conversely, instant settlement does not remove the time your team needs to review and approve an instruction.</p>
    </section>
    <section id="exceptions" aria-labelledby="exceptions-title">
      <h2 id="exceptions-title">Compare recovery and operating cost</h2>
      <p>Ask separately about a rejected instruction, a returned ACH payment and an instant transfer sent to the wrong recipient. They need different responses.</p>
      <p>The Clearing House states that RTP settlement is final and a sending institution cannot revoke or recall a submitted payment. The network supports a request for the return of funds. That request does not undo settlement or guarantee recovery.</p>
      <p>ACH is not freely reversible either. Nacha limits reversals to specific sender errors, such as a duplicate payment or incorrect amount, with applicable deadlines. A reversal is different from a return and cannot simply cancel a legitimate payment because the sender changed their mind. Contact the bank or provider for the appropriate procedure.</p>
      <p>Compare the fees quoted for your account alongside reporting, support and staff time. Try one defined workflow before changing every payment. Record whether it met the deadline, matched the right invoice and left your team able to resolve an exception.</p>
      <p>For merchants using Trolleys, an Etail Depot service, <Link href="/services/ach-payments" prefetch={false}>ACH availability, fees, limits and payout terms</Link> depend on your account. Confirm those terms for your setup. An instant payment network’s speed does not establish the payout schedule for your merchant account.</p>
    </section>
  </BlogArticlePage>;
}
