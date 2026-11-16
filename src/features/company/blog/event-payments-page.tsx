import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { eventPaymentsArticle } from "./event-payments-content";
import s from "./blog.module.css";

const recovery = [
  ["Paid", "The original payment completed, but the ticket or confirmation is missing.", "Find the matching order and provide access to its valid ticket. Do not collect payment again."],
  ["Pending", "The provider has not returned a final result, or staff cannot yet verify it.", "Keep the order identifiable, check its status and follow the reservation rule before a new attempt."],
  ["Failed", "The original payment failed and no successful payment exists for the order.", "Explain the retry options and confirm ticket availability before the customer tries again."],
  ["Authorized", "The card payment was approved but still requires capture.", "Follow the agreed capture workflow. An authorization alone is not a completed collection."],
] as const;

export function EventPaymentsPage() {
  return <BlogArticlePage article={eventPaymentsArticle}>
    <section id="ticket" aria-labelledby="ticket-title">
      <h2 id="ticket-title">Define what a successful ticket sale creates</h2>
      <p>Connect each order to its payment reference, ticket quantity and admission status. A payment receipt and an admission credential serve different purposes. Decide how a customer retrieves a missing ticket and how staff verify an order without charging again simply because an email did not arrive.</p>
      <p>Eventbrite, for example, lets buyers find tickets in their account as well as through a confirmation email. Give attendees the retrieval route for your own ticketing system and a contact for help. Staff should verify the correct order before sharing or changing its ticket details.</p>
      <p>Capacity must also be controlled. Specify when a seat or ticket allocation is reserved, when it expires and when it becomes confirmed. Test the last available ticket with competing purchases; payment collection and inventory allocation need a coordinated outcome.</p>
      <p>Before selling, confirm that your provider supports the event, advance sales period and expected volume. Check the payout schedule and any funding conditions before relying on ticket proceeds to pay venue or supplier bills.</p>
    </section>
    <section id="uncertainty" aria-labelledby="uncertainty-title">
      <h2 id="uncertainty-title">Rehearse an interrupted payment</h2>
      <p>A customer buys two tickets, then closes the browser before seeing confirmation. The order may exist, but the customer is unsure whether to try again. Staff first find the original order and its payment result. A confirmed collection should lead to ticket retrieval, not a fresh charge.</p>
      <table className={s.comparison}>
        <caption>Check the original payment before asking the buyer to retry</caption>
        <thead><tr><th scope="col">Result</th><th scope="col">What you know</th><th scope="col">Next action</th></tr></thead>
        <tbody>{recovery.map(([result, meaning, action]) => <tr key={result}>
          <th scope="row">{result}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What you know</span>{meaning}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Next action</span>{action}</td>
        </tr>)}</tbody>
      </table>
      <p>Use the provider’s payment record, not a screenshot of an unverified message. For a custom connection, the developer should verify payment status and handle repeated requests safely. Stripe’s Payment Intents guidance, for example, recommends reusing the original payment attempt when checkout resumes and monitoring server notifications for its result.</p>
      <p>The admission team needs the resulting ticket status. Confirm what happens if payment completes after a seat reservation expires, so a paid order is not silently left without a seat. Our <Link href="/company/blog/payment-capture" prefetch={false}>payment capture article</Link> explains the difference between approval and collection.</p>
    </section>
    <section id="venue" aria-labelledby="venue-title">
      <h2 id="venue-title">Plan the venue separately from online sales</h2>
      <p>If you sell at the door or operate merchandise stands, assess network coverage, power, device availability and staff training at the actual venue. Ask providers which fallback modes exist, what their limits are and who bears failed collection risk.</p>
      <p>An offline reader or stored payment request is not automatically a confirmed payment. Stripe Terminal’s offline mode, for example, attempts authorization after connection is restored and leaves the merchant with decline risk. Availability depends on the provider, device and setup. Do not assume that an online checkout includes this capability.</p>
      <ul>
        <li><strong>Separate vendors.</strong> Identify who sells each item and receives its proceeds. Multiple sellers may require separate accounts and contracts; do not assume one shared checkout can settle everyone.</li>
        <li><strong>Escalation.</strong> Give staff one route for payment uncertainty and another for admission problems. Assign someone to check unresolved transactions after a connection returns.</li>
        <li><strong>Cancellation.</strong> Publish the relevant event cancellation and refund terms, consistent with applicable requirements. Plan the funds, records and staff capacity needed to apply them.</li>
      </ul>
      <p>Test what a refund does to admission. Eventbrite distinguishes a fully refunded ticket, which becomes invalid, from a partially refunded ticket, which remains valid. Your platform may handle this differently; verify the payment result and ticket status separately.</p>
    </section>
    <section id="closeout" aria-labelledby="closeout-title">
      <h2 id="closeout-title">Close the event using matched records</h2>
      <p>After the event, compare confirmed ticket sales, refunds and admitted attendees without assuming the totals must be identical: some paid buyers will not attend. Match ticket orders to payment references, then reconcile collected amounts, fees and adjustments to payouts separately. Retain the order references needed to answer later questions.</p>
      <p>Keep unresolved payments and refunds on a follow up list with a responsible person. A refund request is not the same as a completed refund, and closing the event does not resolve a pending payment automatically. Our <Link href="/services/refunds" prefetch={false}>refunds page</Link> explains how to follow a refund through its payment record.</p>
      <p>Review where staff had to improvise. Missing ticket emails, repeated payment attempts and mismatched vendor reports point to different fixes. Use those findings to choose the next improvement rather than purchasing more payment methods without evidence that attendees need them.</p>
    </section>
  </BlogArticlePage>;
}
