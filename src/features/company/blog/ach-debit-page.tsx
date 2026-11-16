import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achDebitArticle } from "./ach-debit-content";
import s from "./blog.module.css";

const paymentDirections = [
  ["ACH credit", "The payer starts the transfer.", "The customer instructs their bank to send the invoice payment to the supplier."],
  ["ACH debit", "The payee starts an authorized collection.", "The customer authorizes the supplier to collect the invoice payment from their account."],
] as const;

export function AchDebitPage() {
  return <BlogArticlePage article={achDebitArticle}>
    <p>With an ACH debit, your business takes responsibility for starting the collection. That can suit repeat invoices, but it also puts the agreed amount, collection date and customer permission into your operating process. Having the bank details ready is only the beginning.</p>
    <section id="debit-credit" aria-labelledby="debit-credit-title">
      <h2 id="debit-credit-title">Who starts the payment?</h2>
      <p>ACH supports both money sent by a payer and money collected by a payee. Receiving money does not automatically make a payment an ACH credit.</p>
      <table className={s.comparison}>
        <caption>Two ways to pay the same invoice</caption>
        <thead><tr><th scope="col">Payment type</th><th scope="col">Who starts it?</th><th scope="col">For an invoice</th></tr></thead>
        <tbody>{paymentDirections.map(([type, initiator, invoice]) => <tr key={type}>
          <th scope="row">{type}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Who starts it?</span>{initiator}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">For an invoice</span>{invoice}</td>
        </tr>)}</tbody>
      </table>
      <p>Direct deposit of wages is a common ACH credit. An authorized utility collection is a common ACH debit. A debit-card purchase uses card processing; the word “debit” in its name does not make it an ACH payment.</p>
    </section>
    <section id="how-it-works" aria-labelledby="how-it-works-title">
      <h2 id="how-it-works-title">How the instruction reaches the bank</h2>
      <p>The collecting business sends the authorized instruction through its bank or payment provider. The originating bank submits the entry to an ACH operator, which routes it to the account holder’s bank for handling.</p>
      <p>In ACH records, the collecting business is the <strong>Originator</strong>. The account holder whose account receives the debit entry is the <strong>Receiver</strong>. The banks may be called the ODFI, the originating bank, and the RDFI, the receiving bank.</p>
      <p>Nacha governs the network’s rules. The Federal Reserve and The Clearing House operate the ACH network. Your bank or provider supplies the payment status and any return information; an accepted instruction is not proof of completed collection.</p>
    </section>
    <section id="authorization" aria-labelledby="authorization-title">
      <h2 id="authorization-title">Check what the authorization covers</h2>
      <p>Routing and account numbers alone are not permission to collect money. The authorization must cover the arrangement, including whether it is a single payment or recurring collection. Keep evidence of what the customer agreed to and use the provider’s supported authorization process.</p>
      <p>Permission to collect one invoice does not automatically cover the next invoice. Before changing the amount, date or arrangement, check the existing permission and any required notices. Nacha’s guidance calls for clear consumer authorization terms, a copy for the consumer and instructions for revoking authorization.</p>
      <p>Consumer and business accounts can have different requirements. The account type and how authorization is obtained affect the applicable Standard Entry Class, or SEC, code. A business collecting from a consumer does not become a corporate ACH payment just because the seller is a company.</p>
      <p>Account validation answers a separate question about the bank details. Nacha requires validation as part of fraud screening for consumer debits authorized online or through mobile devices, called WEB debits, when an account number is first used or changed. Confirm the required method with your provider. Passing that check neither grants permission to debit nor guarantees funds.</p>
      <p>Keep authorization, validation and payment status as distinct records. If the customer revokes permission, route the request through the supported cancellation process and prevent future collections outside that permission.</p>
    </section>
    <section id="timing-costs" aria-labelledby="timing-costs-title">
      <h2 id="timing-costs-title">Confirm timing and costs with the provider</h2>
      <p>ACH supports regular and Same Day processing. Ask separately about the submission cutoff, expected settlement date and when your provider makes collected funds available. Same Day ACH does not automatically promise a same-day merchant bank deposit.</p>
      <p>Banking days, eligibility and account conditions matter. A submitted debit can still be returned, including for insufficient funds or account problems. Use the recorded payment status when deciding whether to update an invoice or release an order.</p>
      <p>For merchants using Trolleys, an Etail Depot service, <Link href="/services/ach-payments" prefetch={false}>ACH payments</Link> depend on account availability, fees, limits and payout terms. Confirm the charge for a collection, the treatment of returned payments and any separately priced services before relying on a cost estimate. Card pricing does not establish the price of ACH.</p>
    </section>
    <section id="before-use" aria-labelledby="before-use-title">
      <h2 id="before-use-title">Submit the debit and follow the result</h2>
      <ol>
        <li><strong>Confirm the setup.</strong> Check that the provider and merchant account support the intended payment, customer account type and authorization channel.</li>
        <li><strong>Check the collection.</strong> Retain the authorization, complete the required account validation and verify the invoice, amount and collection date.</li>
        <li><strong>Follow the status.</strong> Keep the payment reference with the customer and invoice records. Monitor processing, completion and any later return.</li>
        <li><strong>Handle exceptions.</strong> Read a return reason before trying again. Ask whether correction, new authorization or another permitted action is required.</li>
      </ol>
      <p>Do not treat every returned debit as an invitation to retry. Use the bank or provider’s process for returns, cancellations and disputed authorizations, and check whether a separate refund is already in progress before making another adjustment.</p>
      <p>The <Link href="/company/blog/transaction-details-reports" prefetch={false}>transaction report guide</Link> helps you connect references and status changes. For the wider flow, the <Link href="/company/blog/payment-processing-systems" prefetch={false}>card payment processing article</Link> explains why submitting a payment and receiving funds are different events.</p>
      <p>Recurring collection removes the need for the customer to start every payment. Your team still needs to monitor failures, respect changes in permission and resolve what remains unpaid.</p>
    </section>
  </BlogArticlePage>;
}
