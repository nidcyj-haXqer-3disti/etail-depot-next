import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { batchProcessingArticle } from "./batch-processing-content";

export function BatchProcessingPage() {
  return <BlogArticlePage article={batchProcessingArticle}>
    <p>Your checkout can approve a payment immediately while later processing happens in a group. That is why a day’s orders, a gateway batch and a merchant funding report may show different totals. Start by finding the same transactions across the relevant records before deciding that money is missing.</p>
    <section id="which-batch" aria-labelledby="which-batch-title">
      <h2 id="which-batch-title">Identify what the batch represents</h2>
      <p>The word “batch” describes a group, but the group’s purpose matters. Your team may encounter several different records:</p>
      <ul>
        <li><strong>A submission file.</strong> A set of payment instructions sent through a provider’s supported file service. Each instruction still needs a processing result.</li>
        <li><strong>A processing batch.</strong> Transactions grouped for a stage such as capture or submission to a processor.</li>
        <li><strong>A payout batch.</strong> Funds grouped according to the provider’s payout arrangement. Adjustments and fees can affect the amount sent.</li>
      </ul>
      <p>Cybersource’s <strong>Payment Batch Detail</strong> report describes sales and refunds submitted to the processor. Its standard fields include the batch ID, request ID and status. Its <strong>Batch Upload Reply File</strong> serves a different purpose: results for merchants using offline transaction file submission.</p>
      <p>Do not assume that seeing a batch report means your team needs to upload a file or close a batch manually. Confirm what your connection handles and what your account requires. Our <Link href="/company/blog/payment-processing-systems" prefetch={false}>payment processing guide</Link> explains where authorization, capture and settlement fit.</p>
    </section>
    <section id="cutoff" aria-labelledby="cutoff-title">
      <h2 id="cutoff-title">Check the cutoff and reporting period</h2>
      <p>A business day and a batch period may end at different times. A transaction submitted before the cutoff can appear in one batch while another submitted afterward appears in the next, even when both orders were placed on the same calendar day.</p>
      <p>Cybersource documents that request dates and batch dates can differ, and that one business day can span two batches. A report run too early can also miss the latest batching activity.</p>
      <p>Before comparing reports, check the account’s cutoff, time zone, report interval and generation time. Keep timestamps and their time zone in your working records. Reducing everything to a date can hide the reason a transaction appears in a different group.</p>
      <p>Use the schedule for your account. There is no single cutoff or bank deposit time that applies to every merchant and processor.</p>
    </section>
    <section id="match-transactions" aria-labelledby="match-transactions-title">
      <h2 id="match-transactions-title">Match the individual transactions</h2>
      <p>Compare the total and the number of records, then match the transactions themselves. Two lists can have the same total while containing different payments. For example, an expected payment could be missing and a different payment for the same amount could appear instead.</p>
      <p>Use the documented transaction or operation reference, together with the amount and currency. Keep captures and refunds distinct, and retain each refund’s connection to the original payment. A customer name or matching amount alone is not a reliable match.</p>
      <p>For merchants using Trolleys, an Etail Depot service, compare the relevant merchant account records in the Back Office Operations Portal with the gateway records in the store’s Cybersource Business Center. Choose the corresponding MID, DBA, currency and reporting period. Available reports and shared reference fields depend on your account configuration.</p>
      <p>Our <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> focuses on that merchant account and gateway comparison. Checking whether a deposit arrived in your bank is a separate funding check.</p>
    </section>
    <section id="check-results" aria-labelledby="check-results-title">
      <h2 id="check-results-title">Read the processing results</h2>
      <p>If your setup uses file submission, receipt of the file is only one checkpoint. Check the processing outcome for its individual items. Cybersource’s offline submission reports include <strong>Reply.All</strong> and <strong>Reply.Rejected</strong>; use the report that corresponds to your submission and review its documented results.</p>
      <p>A missing row and an explicitly rejected request need different follow-up. For a missing row, check the reporting period, generation status and related batches. For a rejected request, investigate the reported reason. Keep an unknown result marked as unresolved until you can establish what happened.</p>
      <p>An authorization approval is also different from a completed capture. Check the operation and status rather than treating every successful response as a completed sale. The <Link href="/company/blog/card-authorization" prefetch={false}>card authorization guide</Link> explains that distinction.</p>
    </section>
    <section id="resolve-differences" aria-labelledby="resolve-differences-title">
      <h2 id="resolve-differences-title">Resolve differences before retrying</h2>
      <p>If a connection fails during submission, check whether the provider received it before sending it again. Repeating a whole batch can repeat successful instructions as well as unresolved ones. Use the provider’s supported recovery procedure for the confirmed problem.</p>
      <ol>
        <li><strong>Confirm the scope.</strong> Record the merchant and gateway accounts, batch reference, currency, period and time zone.</li>
        <li><strong>List the differences.</strong> Identify missing, unexpected, rejected or unresolved items by reference and amount. Keep sales and refunds separate.</li>
        <li><strong>Check before correcting.</strong> Review the original submission, available results and neighboring batches. Ask support about outcomes you cannot establish.</li>
        <li><strong>Keep the resolution.</strong> Preserve the original records, link any supported correction to its original reference and assign an owner to remaining questions.</li>
      </ol>
      <p>Once the processing records agree, follow the related funding activity under your account’s payout terms. Fees, refunds and other adjustments can affect the payout, and bank processing is another step. A batch total alone does not confirm a deposit date.</p>
      <p>See <Link href="/services/payouts" prefetch={false}>how merchant payouts work</Link>, or <Link href="/company/contact#account-support" prefetch={false}>contact account support</Link> with the account, batch and transaction references when a difference remains unexplained.</p>
    </section>
  </BlogArticlePage>;
}
