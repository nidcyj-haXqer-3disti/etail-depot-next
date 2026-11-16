import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achCreditArticle } from "./ach-credit-content";
import s from "./blog.module.css";

const paymentDirections = [
  ["Who starts it?", "The payer instructs its bank or provider to send money.", "The collecting business initiates an authorized collection."],
  ["Direction", "Money is pushed to the recipient’s account.", "Money is pulled from the payer’s account."],
  ["Supplier invoice", "The customer sends the agreed payment.", "The supplier collects under the agreed authorization."],
] as const;

export function AchCreditPage() {
  return <BlogArticlePage article={achCreditArticle}>
    <p>Before sending an ACH credit to a supplier, check whether the same invoice is already scheduled for collection. A payment can become a duplicate when the buyer plans to send money and the supplier plans to debit it. Agree who will act before either instruction goes out.</p>
    <section id="direction" aria-labelledby="direction-title">
      <h2 id="direction-title">Agree who will start the payment</h2>
      <p>Nacha describes ACH credits as payments that push funds to a receiving account. ACH debits collect funds from an account under an authorization. Neither term describes a card payment.</p>
      <table className={s.comparison}>
        <caption>ACH credit and debit for a supplier payment</caption>
        <thead><tr><th scope="col">What to compare</th><th scope="col">ACH credit</th><th scope="col">ACH debit</th></tr></thead>
        <tbody>{paymentDirections.map(([detail, credit, debit]) => <tr key={detail}>
          <th scope="row">{detail}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">ACH credit</span>{credit}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">ACH debit</span>{debit}</td>
        </tr>)}</tbody>
      </table>
      <h3>One invoice, two possible instructions</h3>
      <p>Suppose a shop approves a supplier’s invoice and asks its bank to send an ACH credit. The supplier expects to receive that payment and match it to the invoice.</p>
      <p>If the supplier already has permission to collect an ACH debit, the shop should first check whether that collection is scheduled. Sending a separate credit could pay the same invoice twice.</p>
      <p>Record which arrangement applies before either side acts. “Bank payment” is too vague when one team means send the money and the other means wait for collection. Our <Link href="/company/blog/ach-debit" prefetch={false}>ACH debit article</Link> explains the collection process.</p>
    </section>
    <section id="prepare" aria-labelledby="prepare-title">
      <h2 id="prepare-title">Check the destination, reference and date</h2>
      <p>Your bank or payment provider supplies the service for sending an ACH credit. Before submitting the instruction, confirm these four details.</p>
      <ol>
        <li><strong>Recipient.</strong> Verify the intended account holder and receiving instructions for ACH. Independently confirm any changed account details through a known contact, as the FBI recommends.</li>
        <li><strong>Invoice allocation.</strong> Include a useful payment reference. If one payment covers several invoices, send remittance advice showing how the total should be allocated.</li>
        <li><strong>Payment date.</strong> Select the service and date supported by your bank. Allow for its cutoff, weekends and relevant banking holidays. Confirm any fees and limits before approving the transfer.</li>
        <li><strong>Approval record.</strong> Keep the amount, purpose, approver and submission confirmation together. This helps your team distinguish the payment from similar transactions later.</li>
      </ol>
      <p>Nacha’s guidance distinguishes the requested effective date from the bank’s processing requirements. Same Day ACH can move eligible payments on the same banking day, but the instruction must meet the bank’s deadline. It does not make every payment instant.</p>
      <p>A scheduled payment in a banking app is not confirmation of receipt. Follow the processing result and any exception instead of treating the instruction alone as proof that the supplier has been paid. See our <Link href="/company/blog/how-long-do-ach-payments-take-to-process" prefetch={false}>ACH timing article</Link> for the stages involved.</p>
    </section>
    <section id="confirm" aria-labelledby="confirm-title">
      <h2 id="confirm-title">Confirm receipt before closing the invoice</h2>
      <p>Once funds arrive, match the payment to the intended invoice or invoices. A credit reaching the bank account and the supplier applying it to a bill are separate events. Clear <Link href="/company/blog/customer-reference-in-credit-transfers" prefetch={false}>payment references</Link> help the recipient complete that second step.</p>
      <p>If the supplier cannot locate the payment, compare the amount, destination, reference and dates with the initiating bank or provider. Ask for the ACH trace number when available. The supplier may also need its own bank to investigate the incoming entry. Nacha directs questions about individual payments to the bank or initiating organization because it does not process or track those payments itself.</p>
      <h3>Investigate before sending a replacement</h3>
      <p>Check whether the original instruction is still scheduled, has been sent, or has been rejected or returned. Sending another payment while the first is unresolved can create a duplicate.</p>
      <p>An ACH reversal is available only for certain errors and within applicable deadlines. Nacha’s guidance identifies situations such as a duplicate, incorrect amount or unintended account. It is not a general cancellation right, and a reversal does not guarantee recovery.</p>
      <p>Contact the bank promptly about an error or suspected fraud and follow its process. Record the confirmed outcome against the invoice before deciding what to do next.</p>
    </section>
  </BlogArticlePage>;
}
