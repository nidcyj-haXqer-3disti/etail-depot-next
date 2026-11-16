import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { settlementPayoutsArticle } from "./settlement-payouts-content";
import s from "./blog.module.css";

const payoutRecords = [
  ["Included sales", "Identify the eligible transactions assigned to this payout. Other sales may belong to a later period."],
  ["Fees", "Check which accepted charges were deducted here and which are billed separately. Do not subtract the same fee twice."],
  ["Refunds and disputes", "Match each adjustment to its original payment and the period when it affected the payout."],
  ["Reserve and balance movements", "Check withheld funds, releases, prior balances and other adjustments against their supporting records."],
] as const;

export function SettlementPayoutsPage() {
  return <BlogArticlePage article={settlementPayoutsArticle}>
    <p>Your sales report shows successful payments, but your bank balance has not changed. Before assuming something is wrong, find out which payments are included in the next payout, whether it has been sent and when your bank is expected to receive it.</p>
    <section id="payment-stages" aria-labelledby="payment-stages-title">
      <h2 id="payment-stages-title">Separate the payment from the payout</h2>
      <p>An authorization approves a card payment and can reserve funds on the customer’s card. Capture submits that authorized payment for further processing. Settlement concerns the movement of funds through the processing arrangement. A payout is the transfer to your business’s receiving account.</p>
      <p>These stages do not all finish when the customer sees the order confirmation. Cybersource’s capture documentation explains that the processor handles the later transfer and that merchants should compare their capture requests with processor reports.</p>
      <p>Adyen likewise describes capture, assignment to a payable batch and bank processing as separate steps. Providers use different models and labels, so read the status definitions for your account rather than assuming that “processed” means the bank has credited you.</p>
      <p>The <Link href="/company/blog/card-authorization" prefetch={false}>card authorization guide</Link> explains the difference between approval and capture. For the grouped records that follow, see <Link href="/company/blog/how-batch-payment-processing-works" prefetch={false}>how payment batches work</Link>.</p>
    </section>
    <section id="payout-timing" aria-labelledby="payout-timing-title">
      <h2 id="payout-timing-title">Know when the timing starts</h2>
      <p>A quoted number of days needs a starting point. Ask whether it measures time from capture to available funds, time until the payout is sent, or time until the receiving bank posts it. Those are different commitments.</p>
      <p>Confirm the cutoff, time zone and definition of a business day. Also ask whether the first payout follows a different schedule and how verification, holidays or account restrictions affect it. A sale after the cutoff may enter a later processing period.</p>
      <p>More frequent payouts do not necessarily make pending funds available sooner. Stripe explicitly distinguishes settlement timing from payout frequency: changing when payouts are sent does not shorten the wait for the balance to become available.</p>
      <p>For merchants using Trolleys, an Etail Depot service, use the schedule in your accepted account documents. The <Link href="/company/legal/payouts-and-reserves" prefetch={false}>payouts and reserves terms</Link> distinguish fund availability, payout initiation and bank receipt. Instant payouts and accelerated settlement are not included in that schedule.</p>
      <p>Plan cash flow around the confirmed arrangement for your account. Another provider’s advertised timing, or a previous payout that arrived early, does not establish your next deposit date.</p>
    </section>
    <section id="payout-amount" aria-labelledby="payout-amount-title">
      <h2 id="payout-amount-title">Explain the amount you receive</h2>
      <p>A bank deposit may combine several sales and account adjustments. Start with the payout report’s included activity rather than comparing the deposit with today’s checkout total.</p>
      <table className={s.comparison}>
        <caption>Records to check when a payout differs from sales</caption>
        <thead><tr><th scope="col">Record</th><th scope="col">What to check</th></tr></thead>
        <tbody>{payoutRecords.map(([record, check]) => <tr key={record}>
          <th scope="row">{record}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to check</span>{check}</td>
        </tr>)}</tbody>
      </table>
      <p>A refund for an older order can affect a later payout. That difference needs a transaction reference and an explanation; it does not mean the newer sales were underpaid. Check whether the adjustment is a deduction or a credit before calculating the net amount.</p>
      <p>Report labels vary. Adyen’s settlement details report, for example, identifies payout entries with a reference, batch and receiving account. Use the equivalent documented fields in your provider’s records to connect the payout with the bank credit.</p>
      <p>Check the currency too. If conversion applies, use the reported conversion and any applicable charges. A matching total alone does not establish that you have found the right transfer.</p>
    </section>
    <section id="reserves" aria-labelledby="reserves-title">
      <h2 id="reserves-title">Keep reserves separate from fees</h2>
      <p>Funds withheld for risk are different from a processing charge. Track what was withheld, what was released and what remains restricted. Use the account agreement and reserve notice to establish the calculation, review process and release conditions.</p>
      <p>Names can be misleading across providers. Adyen calls its withheld risk funds a “Deposit” and distinguishes that from its “Reserve” balance. Here, “deposit” does not mean money arriving at your bank.</p>
      <p>For Trolleys merchants, the applicable reserve notice should identify the responsible holder and decision authority, along with the terms that apply. Do not assume a universal percentage or release date. Ask account support about unexplained deductions or a restriction you cannot reconcile with your records.</p>
    </section>
    <section id="missing-deposit" aria-labelledby="missing-deposit-title">
      <h2 id="missing-deposit-title">Find the last confirmed stage</h2>
      <p>Investigate the point where the records stop, using the expected timing for your account.</p>
      <ol>
        <li><strong>Captured, but not assigned to a payout.</strong> Check settlement status, eligible funds, batch allocation and any restriction with the funding provider.</li>
        <li><strong>Scheduled, but not sent.</strong> Check the scheduled date, cutoff, holidays and any outstanding account requirement.</li>
        <li><strong>Sent, but not credited.</strong> Confirm the destination and transfer status. Ask the provider for available trace information and ask your bank to check the incoming transfer.</li>
        <li><strong>Failed or returned.</strong> Establish why the transfer failed and whether the funds returned before arranging a replacement through the provider’s supported process.</li>
      </ol>
      <p>Transfer status can change after an initial success indication. Stripe documents that a payout may first appear paid and later be marked failed when the bank reports a problem. Check the current record before assuming the funds arrived.</p>
      <p>For Trolleys merchants, use the Back Office Operations Portal for merchant activity and funding records, and the store’s Cybersource Business Center for gateway payment records. Match the correct MID, DBA and reporting period. That merchant account and gateway comparison supports <Link href="/services/reconciliation" prefetch={false}>reconciliation</Link>; confirming a bank credit is a separate funding check.</p>
      <p>When contacting support, provide the payment and payout references, amount, currency, expected date and masked destination details through the approved support channel. Use the secure account process for bank changes. An email alone should not redirect a payout.</p>
      <p>A delayed payout is not a reason to charge the customer again. Review <Link href="/services/payouts" prefetch={false}>Trolleys’ payout service</Link> or <Link href="/company/contact#account-support" prefetch={false}>contact account support</Link> to investigate the existing payment and transfer records.</p>
    </section>
  </BlogArticlePage>;
}
