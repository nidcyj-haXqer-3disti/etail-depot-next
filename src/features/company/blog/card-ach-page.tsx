import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardAchArticle } from "./card-ach-content";
import s from "./blog.module.css";

const paymentComparison = [
  ["Starting the payment", "The customer provides card or supported wallet details for the purchase.", "The customer authorizes a collection from a US bank account. Required bank account checks are separate."],
  ["The first result", "An authorization approval can reserve funds or available credit. Capture and settlement still matter.", "An accepted submission can still be processing. Account validation does not guarantee collection."],
  ["Later exceptions", "Refunds and disputes can affect the payment after the sale.", "A debit can be returned, including for insufficient funds or an authorization problem."],
] as const;

export function CardAchPage() {
  return <BlogArticlePage article={cardAchArticle}>
    <p>A repeat invoice and an urgent online order do not necessarily need the same payment experience. The useful question is what your business needs to know before delivering the goods or service, and what the customer is comfortable authorizing.</p>
    <section id="payment-signal" aria-labelledby="payment-signal-title">
      <h2 id="payment-signal-title">Understand what an approval tells you</h2>
      <p>An online card authorization can reserve spending capacity for later capture. Capture, settlement and the merchant’s payout are separate steps. An approval should not be described as money already deposited into the business’s bank account.</p>
      <p>An ACH debit starts with permission to collect from a bank account. Submission or account validation does not establish that the debit has settled or that no return can follow. Ask the provider what each status means before using it to release goods.</p>
      <table className={s.comparison}>
        <caption>Card payments and merchant-initiated ACH debits</caption>
        <thead><tr><th scope="col">What to compare</th><th scope="col">Cards</th><th scope="col">ACH debit</th></tr></thead>
        <tbody>{paymentComparison.map(([stage, card, ach]) => <tr key={stage}>
          <th scope="row">{stage}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Cards</span>{card}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">ACH debit</span>{ach}</td>
        </tr>)}</tbody>
      </table>
      <p>A card payment and an ACH payment need their own status handling. Neither method removes the need to check unsuccessful payments, refunds and later adjustments.</p>
    </section>
    <section id="sale-fit" aria-labelledby="sale-fit-title">
      <h2 id="sale-fit-title">Match the method to the sale</h2>
      <p>For an established client with a regular service invoice, an agreed recurring bank debit may fit the relationship. The business can document the schedule and has a known contact if a collection fails. Keep the authorization current when the arrangement changes.</p>
      <p>For a new buyer placing an urgent online order, a card checkout may better fit the buying experience. The business still needs its fraud and fulfillment checks. The choice follows from the service promise and customer relationship, not the order amount alone.</p>
      <p>Offering both can make sense when customers have different purchasing processes. Some companies approve an invoice before sending a bank payment; others use purchasing cards. With an ACH credit, the customer starts the transfer. With an <Link href="/company/blog/ach-debit" prefetch={false}>ACH debit</Link>, the business starts an authorized collection. Confirm which arrangement the customer expects.</p>
      <p>Recurring billing is not exclusive to ACH. Card arrangements can also support repeat payments when the account and integration allow them. In either case, a previous payment is not permission for every future charge.</p>
    </section>
    <section id="compare-proposals" aria-labelledby="compare-proposals-title">
      <h2 id="compare-proposals-title">Compare the complete arrangement</h2>
      <p><strong>Cost.</strong> Compare the actual transaction, monthly, return, dispute, refund and payout charges for your expected mix. Include the work needed to investigate exceptions. A lower headline rate does not establish the lowest overall cost for your business.</p>
      <p><strong>Funding.</strong> Request the merchant funding schedule and any holds separately from processing speed. Confirm the submission cutoff, banking-day rules and when funds become available. Same Day ACH does not automatically mean a same-day merchant bank deposit.</p>
      <p><strong>Exceptions.</strong> Identify who investigates a failed debit, handles a card dispute, contacts the customer and updates the invoice. Check the provider’s return or dispute process instead of assuming both methods use the same rules.</p>
      <p>For merchants using Trolleys, an Etail Depot service, <Link href="/services/payment-methods" prefetch={false}>payment methods</Link> depend on account setup. <Link href="/services/ach-payments" prefetch={false}>ACH availability, fees, limits and payout terms</Link> must be confirmed for your account. A card-processing agreement alone does not establish your ACH terms.</p>
    </section>
    <section id="before-launch" aria-labelledby="before-launch-title">
      <h2 id="before-launch-title">Check the whole payment journey</h2>
      <ol>
        <li><strong>Review what the customer agrees to.</strong> Make the amount, purpose and any recurring schedule clear. Use the authorization and account checks required for that method.</li>
        <li><strong>Define when to fulfill.</strong> Decide which verified status allows delivery and what your team does while a payment is pending. Keep that decision separate from the payout date.</li>
        <li><strong>Test an unsuccessful payment.</strong> Check a decline or return and an interrupted checkout. Find the original result before requesting another payment attempt.</li>
        <li><strong>Follow the records.</strong> Connect the order, payment reference, invoice and later adjustment. Make sure the team can distinguish an unpaid invoice from a payment awaiting payout.</li>
      </ol>
      <p>Before retrying a returned debit, read the reason and confirm the permitted next step with the provider. If a refund or bank dispute is already underway, check its status before sending another credit to the customer.</p>
      <p>The <Link href="/company/blog/card-authorization" prefetch={false}>card authorization guide</Link> explains what approval does and does not establish. Use that distinction alongside your ACH process so the customer receives a clear result and your team knows what to do next.</p>
    </section>
  </BlogArticlePage>;
}
