import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achWireArticle } from "./ach-wire-content";
import s from "./blog.module.css";

const paymentDifferences = [
  ["Direction", "Send an ACH credit, or collect an authorized ACH debit.", "The payer instructs a bank to send money to the recipient."],
  ["Processing", "Entries are processed in batches. Same Day ACH may be available.", "Fedwire settles individual transfers between participating banks in real time."],
  ["Timing to confirm", "The available processing option and when the recipient can use the funds.", "The sending bank’s cutoff, any review and the recipient bank’s handling."],
  ["Cost to compare", "The provider’s fees and any applicable account or return charges.", "Sending and receiving fees, plus any currency conversion costs."],
] as const;

export function AchWirePage() {
  return <BlogArticlePage article={achWireArticle}>
    <p>“Bank transfer” is a broad description. It does not tell you whether a payment uses ACH or a wire, when it will arrive or how an error will be handled. This comparison focuses on US business payments; international transfers involve additional banks, currencies and local requirements.</p>
    <section id="compare-routes" aria-labelledby="compare-routes-title">
      <h2 id="compare-routes-title">Know which payment you are sending</h2>
      <p>ACH supports credits that send money and debits that collect it with authorization. A wire is a payment sent on the payer’s instruction. It does not give a seller ongoing permission to debit the buyer’s account.</p>
      <table className={s.comparison}>
        <caption>Compare the payment service available through your bank or provider</caption>
        <thead><tr><th scope="col">Question</th><th scope="col">ACH</th><th scope="col">Wire transfer</th></tr></thead>
        <tbody>{paymentDifferences.map(([question, ach, wire]) => <tr key={question}>
          <th scope="row">{question}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">ACH</span>{ach}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Wire transfer</span>{wire}</td>
        </tr>)}</tbody>
      </table>
      <p>A domestic wire may travel through Fedwire. Its settlement between participating banks is final and irrevocable once made. That describes the bank settlement, not every stage between a customer entering an instruction and the recipient being able to use the money.</p>
      <p>Same Day ACH is a processing option, not a promise that every ACH payment arrives that day. Check eligibility and submission deadlines with the provider. The <Link href="/company/blog/ach-payments" prefetch={false}>ACH payments article</Link> explains the bank roles in more detail.</p>
    </section>
    <section id="choose-payment" aria-labelledby="choose-payment-title">
      <h2 id="choose-payment-title">Match the method to the deadline</h2>
      <p>A retailer paying a known supplier on a regular schedule may choose an ACH credit when the supplier accepts it and the payment can be initiated early enough. The repeatable process matters as much as the speed of an individual transfer.</p>
      <p>An urgent replacement shipment is different. If the supplier requires a wire before releasing the order, confirm that your bank can meet the receipt deadline. Entering a wire request after the bank’s cutoff does not make it timely just because the underlying network settles quickly.</p>
      <p>For customer collections, an authorized ACH debit may fit an invoice or recurring arrangement. Permission, account checks and the available service still matter. Trolleys’ <Link href="/services/ach-payments" prefetch={false}>ACH payment service</Link> is subject to account availability, fees, limits and payout terms.</p>
    </section>
    <section id="verify-instructions" aria-labelledby="verify-instructions-title">
      <h2 id="verify-instructions-title">Check before sending</h2>
      <ol>
        <li><strong>Receiving instructions.</strong> Confirm the recipient and the details for the chosen method. Some banks use different routing numbers for ACH and wires.</li>
        <li><strong>Usable funds deadline.</strong> Confirm the required arrival date, the sending cutoff and its time zone. Ask about any bank review or receiving delay.</li>
        <li><strong>Complete charges.</strong> Check the actual quote and applicable recipient fees. For international transfers, include exchange rates and intermediary charges rather than comparing the sending fee alone.</li>
        <li><strong>Independent verification.</strong> Verify new or changed payment details through a known contact method. Do not rely on a telephone number supplied in the same unexpected email.</li>
      </ol>
      <p>The FBI recommends verifying changes to account numbers or payment procedures. A familiar sender name and an urgent request are not enough to establish that new bank details are genuine.</p>
    </section>
    <section id="follow-result" aria-labelledby="follow-result-title">
      <h2 id="follow-result-title">Follow the result and act on errors</h2>
      <p>Keep the bank confirmation, payment reference, amount, recipient and intended invoice together. If a payment is missing, ask the bank or initiating provider what its status means and what reference the receiving bank needs. For ACH, an <Link href="/company/blog/ach-trace-number" prefetch={false}>ACH trace number</Link> can help identify the entry.</p>
      <p>If the destination is wrong or fraud is suspected, contact the sending bank immediately. Ask what cancellation or recovery action is still available and keep the case reference. A recovery request is not a guarantee that the money can be returned.</p>
      <p>ACH also has return and correction rules; it is not a payment you can always undo. Follow the provider’s process for the specific entry. Before sending a replacement, confirm the original outcome so the recipient is not paid twice.</p>
      <p>Record the confirmed result against the invoice. Choosing a payment method is only part of the job; the business also needs a reliable record of what was sent and received.</p>
    </section>
  </BlogArticlePage>;
}
