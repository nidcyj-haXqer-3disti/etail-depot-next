import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { fednowRtpArticle } from "./fednow-rtp-content";
import s from "./blog.module.css";

const networkComparison = [
  ["Operator", "Federal Reserve Banks.", "The Clearing House."],
  ["Processing", "Individual payments processed and settled within seconds, including weekends and holidays.", "Individual payments processed and settled in real time, including weekends and holidays."],
  ["Payment instruction", "A credit transfer sends money from the payer to the recipient.", "A credit push sends money on the payer’s instruction."],
  ["Business access", "Through a participating financial institution and the services it offers your account.", "Through a participating financial institution and the services it offers your account."],
] as const;

export function FednowRtpPage() {
  return <BlogArticlePage article={fednowRtpArticle}>
    <section id="compare-networks" aria-labelledby="compare-networks-title">
      <h2 id="compare-networks-title">Two networks, similar purpose</h2>
      <p>FedNow and the RTP network move money between bank accounts. Neither name describes a complete business banking product: the bank or provider supplies the customer interface, account terms and controls.</p>
      <table className={s.comparison}>
        <caption>Compare the network separately from the service your bank offers</caption>
        <thead><tr><th scope="col">Feature</th><th scope="col">FedNow Service</th><th scope="col">RTP network</th></tr></thead>
        <tbody>{networkComparison.map(([feature, fednow, rtp]) => <tr key={feature}>
          <th scope="row">{feature}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">FedNow Service</span>{fednow}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">RTP network</span>{rtp}</td>
        </tr>)}</tbody>
      </table>
      <p>The networks are separate. Ask which route the bank will use to reach the recipient. Do not assume that seeing “instant payments” on both banks’ websites establishes a supported route for your particular accounts.</p>
      <p>These services also differ from ACH and wire transfers. If you are choosing among several bank payment options, start with the payment’s deadline and the recipient’s requirements. Our <Link href="/company/blog/ach-vs-wire-transfers" prefetch={false}>ACH and wire comparison</Link> explains those alternatives.</p>
    </section>
    <section id="check-access" aria-labelledby="check-access-title">
      <h2 id="check-access-title">Check access for your business account</h2>
      <p>A participating institution may receive payments without offering outbound payments to your business. FedNow explicitly allows receive-only participation. Confirm the product available to your account before promising an instant payment.</p>
      <ol>
        <li><strong>Sending and receiving.</strong> Can this account send, receive or do both? Which online banking, file or provider connection must your team use?</li>
        <li><strong>Recipient access.</strong> Can the service reach the intended recipient account? Ask how the bank checks that before you approve a payment.</li>
        <li><strong>Limits and fees.</strong> Confirm your account’s transaction limits, any daily limits and the price charged to your business. A network’s published fee is not necessarily your bank’s customer price.</li>
        <li><strong>Approvals and support.</strong> Ask about a second approver, recipient verification and help outside office hours. Continuous network processing does not itself promise continuous customer support.</li>
      </ol>
      <p>For a weekend supplier payment, establish both outbound access and the supplier’s receiving route first. If either is unavailable, agree another payment arrangement before the order becomes urgent.</p>
    </section>
    <section id="payment-workflow" aria-labelledby="payment-workflow-title">
      <h2 id="payment-workflow-title">Compare the work around the payment</h2>
      <p>Ask the bank to show how your team creates, approves and confirms a payment. Check the difference between a saved instruction, a submitted payment and confirmed completion. Keep the payment identifier and the invoice allocation together.</p>
      <p>Request for payment messaging can ask a customer to pay a bill. It is not proof that money moved or permission to pull money from an account. Confirm whether the bank’s product offers it and how it records the request separately from the resulting payment.</p>
      <p>Inspect the report your accounts team will actually use, including recipient details, status and payment references. Our <Link href="/company/blog/customer-reference-in-credit-transfers" prefetch={false}>payment reference article</Link> explains how to check whether invoice information survives into those records.</p>
    </section>
    <section id="payment-recovery" aria-labelledby="payment-recovery-title">
      <h2 id="payment-recovery-title">Understand completion and recovery</h2>
      <p>Completed instant payments have final settlement. Do not plan on canceling a settled payment through a routine undo button. RTP supports a message requesting a return of funds, but requesting a return does not itself reverse the original payment.</p>
      <p>Before sending, verify the recipient and any changed bank instructions through a known contact. The FBI recommends confirming changes to account numbers or payment procedures directly and treating pressure to act quickly with caution.</p>
      <p>If a payment is mistaken or suspicious, contact your financial institution immediately. If its outcome is unclear, obtain a confirmed status before sending again. Ask the bank about its investigation and recovery process; do not treat a request for help as a guarantee of recovery.</p>
      <p>Choose the bank service that supports the whole job: the right recipient, controlled approval, clear confirmation, usable records and an understood exception process.</p>
    </section>
  </BlogArticlePage>;
}
