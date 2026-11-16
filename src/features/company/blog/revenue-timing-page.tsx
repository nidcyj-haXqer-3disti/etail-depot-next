import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { revenueTimingArticle } from "./revenue-timing-content";
import s from "./blog.module.css";

const revenueSequences = [
  ["Payment before service", "Debit cash and credit deferred revenue for the advance payment. The business still owes the service.", "As the service is provided, debit deferred revenue and credit revenue for the earned portion. That entry does not move cash again."],
  ["Service before billing", "When the recognition criteria are met, debit the appropriate asset and credit revenue for the earned amount.", "Reclassify the asset when required as the right to payment becomes unconditional. When payment arrives, debit cash and credit the receivable. Do not record the same revenue again."],
] as const;

export function RevenueTimingPage() {
  return <BlogArticlePage article={revenueTimingArticle}>
    <section id="three-dates" aria-labelledby="three-dates-title">
      <h2 id="three-dates-title">Track delivery, billing and payment separately</h2>
      <p>A customer can pay before you begin work, receive an invoice after completion or pay while a service is underway. Keep those dates separate. <strong>The payment date alone does not tell you when revenue is earned.</strong></p>
      <p>For customer contracts within their scope, US GAAP Topic 606 and IFRS 15 tie revenue to meeting the relevant performance obligation. That means fulfilling a promise to transfer goods or services to the customer. Recognition may happen at a point in time or over time. Time spent working does not automatically qualify as revenue.</p>
      <p>Review the promises, delivery evidence and payment rights in the contract. Separate deliverables, milestones, variable charges, refunds and cancellations can affect the amount and timing. A payment report shows money received; it does not replace that review.</p>
    </section>
    <section id="opposite-sequences" aria-labelledby="opposite-sequences-title">
      <h2 id="opposite-sequences-title">Compare two payment sequences</h2>
      <p>Consider two separate service arrangements under accrual accounting. In the first, a customer prepays for support delivered evenly over the agreed term. In the second, a service meets the revenue recognition criteria before it is billed or paid. Assume fixed prices, no taxes, refunds, separate setup deliverables or other adjustments.</p>
      <figure className={s.accountingSequences}>
        <figcaption>How the order of service and payment changes the records</figcaption>
        <div>{revenueSequences.map(([sequence, initial, later]) => <div key={sequence}>
          <h3>{sequence}</h3>
          <ol role="list">
            <li><strong>Initial record</strong><p>{initial}</p></li>
            <li><strong>What happens later</strong><p>{later}</p></li>
          </ol>
        </div>)}</div>
      </figure>
      <p>For the prepaid support service, recognizing revenue evenly is appropriate only if that pattern reflects how the service benefits the customer. It is not a rule for every subscription or deposit. The unearned portion remains a liability until the relevant obligation is satisfied.</p>
      <p><strong>Unbilled revenue is not always an ordinary receivable.</strong> A receivable represents an unconditional payment right, with only time remaining before payment is due. An earned amount still conditional on further performance can be a contract asset. The contract determines the classification, not whether someone has sent an invoice.</p>
      <p>An amount due before service can also create a receivable and a contract liability even before cash arrives. Review the payment terms with your accountant. The <Link href="/company/blog/accounts-payable-vs-accounts-receivable" prefetch={false}>payables and receivables guide</Link> explains the difference between money owed by the business and money owed to it.</p>
    </section>
    <section id="maintain-evidence" aria-labelledby="maintain-evidence-title">
      <h2 id="maintain-evidence-title">Keep a schedule of what is earned and owed</h2>
      <p>Keep the contract, delivery records, invoices and payment references together. A useful schedule answers three questions:</p>
      <ul>
        <li><strong>What was promised?</strong> Identify the goods or services and the evidence that the customer received them. Payment status alone is not enough.</li>
        <li><strong>What has been recognized?</strong> Track the contract amount, earned revenue and remaining obligation or unbilled amount. Keep each customer and contract identifiable.</li>
        <li><strong>What changed?</strong> Record amendments, credits and cancellations with their effective dates and approvals. Update the schedule and accounting entries through the approved process.</li>
      </ul>
      <p>Compare the schedule with the relevant ledger balances at the same reporting date. A larger deferred balance can reflect payment for future work. A larger unbilled balance can reflect work awaiting billing. Neither movement alone proves strong profitability or a cash problem.</p>
      <p>The <Link href="/company/blog/profit-and-loss-statement" prefetch={false}>profit and loss statement</Link> shows recognized revenue and expenses for a period. Read it alongside the outstanding obligations and payment records to understand what has been earned, collected and still needs to be delivered.</p>
    </section>
  </BlogArticlePage>;
}
