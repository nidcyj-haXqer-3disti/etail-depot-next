import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achPaymentsArticle } from "./ach-payments-content";
import s from "./blog.module.css";

const paymentRecords = [
  ["Was it permitted?", "The relevant instruction or authorization, including any changes.", "Whether the payment should be initiated."],
  ["What happened to the entry?", "The payment reference, status, dates and any rejection or return reason.", "What the bank or provider reports about processing."],
  ["What happens to the invoice?", "The receipt, invoice allocation and any later adjustment.", "Which bill the money covers and what remains unpaid."],
] as const;

export function AchPaymentsPage() {
  return <BlogArticlePage article={achPaymentsArticle}>
    <p>An ACH instruction can pass through several organizations while the invoice remains your responsibility. Your team needs to know whether the payment was permitted, what happened to the entry and what balance remains due. Those are separate questions, and each needs its own record.</p>
    <section id="direction" aria-labelledby="direction-title">
      <h2 id="direction-title">Start with who instructs the payment</h2>
      <p>With an <strong>ACH credit</strong>, the payer starts the transfer. A customer can approve an invoice and instruct their bank to send the money. The supplier then matches the incoming payment to the invoice.</p>
      <p>With an <strong>ACH debit</strong>, the collecting business starts the payment under the customer’s authorization. The supplier needs both evidence of that permission and the result of the collection. Knowing the customer’s account number does not create permission to debit it.</p>
      <p>Payroll and supplier payments are familiar credit uses. An authorized utility collection is a familiar debit. In this context, credit and debit describe the payment instruction, rather than whether your accounting software records income or expense.</p>
      <p>The <Link href="/company/blog/ach-debit" prefetch={false}>ACH debit article</Link> covers collection permissions in more detail. Agree on the payment direction before giving a customer instructions.</p>
    </section>
    <section id="participants" aria-labelledby="participants-title">
      <h2 id="participants-title">Follow the instruction through the banks</h2>
      <ol>
        <li><strong>The Originator starts the instruction.</strong> This is the payer for a credit or the authorized collector for a debit. A payment provider may handle the submission on the business’s behalf.</li>
        <li><strong>The originating bank submits it.</strong> Called the ODFI, this bank sends the payment entry into ACH processing, commonly with other entries in a batch.</li>
        <li><strong>An ACH operator routes the entry.</strong> The Federal Reserve or The Clearing House sorts and delivers entries and handles settlement between participating banks.</li>
        <li><strong>The receiving bank handles the entry.</strong> Called the RDFI, it credits or debits the Receiver’s account as applicable, or sends a return when the entry cannot be completed as instructed.</li>
      </ol>
      <p>The Receiver is not always the person receiving money. For a debit, it is the account holder whose account receives the debit entry. The roles follow the payment instruction.</p>
      <p>Nacha governs the network’s rules. It does not process individual payments or hold their transaction histories. Your bank or payment provider supplies the records for your payment.</p>
      <p>ACH processing and merchant funding are separate questions. Ask your provider about submission cutoffs, the expected settlement date and when money will be available to your business. A network processing window is not a promise of your merchant payout date.</p>
    </section>
    <section id="separate-statuses" aria-labelledby="separate-statuses-title">
      <h2 id="separate-statuses-title">Keep three questions separate</h2>
      <table className={s.comparison}>
        <caption>The records behind an ACH payment</caption>
        <thead><tr><th scope="col">Question</th><th scope="col">Keep this record</th><th scope="col">What it tells you</th></tr></thead>
        <tbody>{paymentRecords.map(([question, record, meaning]) => <tr key={question}>
          <th scope="row">{question}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Keep this record</span>{record}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it tells you</span>{meaning}</td>
        </tr>)}</tbody>
      </table>
      <p>A form confirmation is not proof that money arrived. Use the provider’s definitions for submitted, processing, settled and returned entries. Account validation is another check; it does not guarantee that a debit will be collected.</p>
      <p>Keep the invoice reference with the payment from the start. If one receipt covers several invoices, retain the allocation and any agreed credits. The <Link href="/company/blog/edi-payment-how-does-it-differ-from-ach-and-eft" prefetch={false}>EDI and remittance article</Link> explains how payment information helps the recipient make that match.</p>
      <p>For merchants using Trolleys, an Etail Depot service, <Link href="/services/ach-payments" prefetch={false}>ACH availability, fees, limits and payout terms</Link> depend on the account. Confirm how your team receives status updates and return information before relying on the service.</p>
    </section>
    <section id="trace-payment" aria-labelledby="trace-payment-title">
      <h2 id="trace-payment-title">Trace a missing or returned payment</h2>
      <p>Start with the bank or provider that accepted the instruction. If you are waiting for a customer’s ACH credit, ask the customer to confirm that it was sent and obtain the available reference. For a debit your business initiated, review the collection record with your provider.</p>
      <p>Have the payment amount, submission date, expected date, invoice reference and available ACH trace information ready. A provider’s transaction ID and an ACH trace number may be different references. Confirm which one the investigating bank needs, and share account details only through its secure process.</p>
      <p>If an entry was returned, read the reason before taking action. Insufficient funds, a closed account and a disputed authorization call for different follow-up. Passing initial checks does not prevent a later return.</p>
      <p>Check the original payment before sending another instruction. A missing receipt alone does not establish that the first attempt failed. For a returned collection, ask whether correction, renewed authorization or another permitted action is required.</p>
      <p>If a return arrives after the invoice was marked paid, record the adjustment and resolve the outstanding balance with the customer. Keep the original payment and its return connected so the next person reviewing the account can see what happened.</p>
    </section>
  </BlogArticlePage>;
}
