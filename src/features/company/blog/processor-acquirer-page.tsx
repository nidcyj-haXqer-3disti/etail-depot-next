import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { processorAcquirerArticle } from "./processor-acquirer-content";
import s from "./blog.module.css";

const paymentRoles = [
  ["Gateway", "Connects the checkout to payment processing and passes payment information securely.", "The gateway screen does not identify every party responsible for the account."],
  ["Processor", "Handles transaction messages and related services, such as authorization routing and capture records.", "Tracing a payment does not give the processing team authority over every account decision."],
  ["Acquirer", "Supports merchant card acceptance under network rules and the associated settlement relationship.", "Your acceptance arrangement may be direct or involve a payment facilitator."],
  ["Issuer", "Provides the customer’s card account and normally makes the card authorization decision.", "A checkout failure does not always mean that the issuer declined the payment."],
] as const;

export function ProcessorAcquirerPage() {
  return <BlogArticlePage article={processorAcquirerArticle}>
    <p>You may speak to one company about your payments while several organizations perform the work. The distinction becomes useful when support needs to trace a transaction, explain a payout or review a restriction.</p>
    <section id="separate-payment-roles" aria-labelledby="separate-payment-roles-title">
      <h2 id="separate-payment-roles-title">Look at the responsibilities behind the name</h2>
      <p>The processor handles the technical processing of payment messages. The acquirer supports the merchant’s acceptance arrangement with the card networks. Adyen explains that an acquirer can work with a separate processor or perform processing itself.</p>
      <table className={s.comparison}>
        <caption>Four roles you may encounter in a card payment</caption>
        <thead><tr><th scope="col">Role</th><th scope="col">What it handles</th><th scope="col">What to remember</th></tr></thead>
        <tbody>{paymentRoles.map(([role, work, note]) => <tr key={role}>
          <th scope="row">{role}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it handles</span>{work}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to remember</span>{note}</td>
        </tr>)}</tbody>
      </table>
      <p>These are responsibilities, not necessarily four separate contracts or dashboards. The card networks connect the acquiring and issuing sides, while your merchant service provider may coordinate several parts of the arrangement.</p>
      <p>Authorization, capture, settlement and payout are also different stages. Finding an approved payment does not establish that it was captured or that a deposit reached your bank. Our <Link href="/company/blog/payment-processing-systems" prefetch={false}>payment processing overview</Link> explains the sequence.</p>
    </section>
    <section id="combined-services" aria-labelledby="combined-services-title">
      <h2 id="combined-services-title">One provider can perform several roles</h2>
      <p>A provider can combine gateway, processing and acquiring services, or coordinate them through other companies. Visa explicitly recognizes that one service provider can perform multiple roles while meeting the obligations of each.</p>
      <p>A payment facilitator can also sit between the merchant and acquirer. Visa describes payment facilitators that sign merchant acceptance agreements on an acquirer’s behalf or receive settlement proceeds for sponsored merchants. This does not make every payment facilitator a bank or eliminate the acquiring relationship.</p>
      <p>Ask your provider to identify what it performs directly, what it arranges through others and which agreements apply to your account. The logo at checkout is not a complete map of those responsibilities. The <Link href="/company/blog/merchant-accounts-and-acquiring" prefetch={false}>merchant accounts article</Link> covers the account relationship in more detail.</p>
    </section>
    <section id="route-the-question" aria-labelledby="route-the-question-title">
      <h2 id="route-the-question-title">Send the question to the team that can resolve it</h2>
      <p>Your usual support contact can coordinate the investigation. Describe the problem precisely and ask who owns the decision, rather than trying to contact every company in the payment chain:</p>
      <ol>
        <li><strong>A payment result is missing.</strong> Provide the order and payment references, merchant account, amount, currency and time. Ask the gateway or processing team to establish what happened and the next permitted action.</li>
        <li><strong>A payout is restricted.</strong> Provide the account reference and restriction notice. Ask which funding or risk team can review it, what information is required and what conditions govern release.</li>
        <li><strong>A refund has not reached the customer.</strong> First confirm its status with the provider. Request a trace reference when available; the customer may need it when contacting their card issuer.</li>
        <li><strong>A dispute needs a response.</strong> Use the case reference, submission channel and deadline in the notice. Ask the designated disputes team what evidence is needed; support cannot promise a successful outcome.</li>
      </ol>
      <p>Send only the information needed through the approved support channel. Payment references are different from passwords, API secrets or full card details. Our <Link href="/resources/help" prefetch={false}>Help center</Link> provides the current route for Trolleys account and payment questions.</p>
    </section>
    <section id="keep-incidents-separate" aria-labelledby="keep-incidents-separate-title">
      <h2 id="keep-incidents-separate-title">Keep a payment issue separate from an account review</h2>
      <p>An order times out at checkout. Separately, the provider requests information about a change in the business. These events may involve the same merchant account, but one answer does not resolve both questions.</p>
      <p>For the payment, establish whether the request failed, succeeded or remains uncertain. Cybersource’s timeout guidance explains that a response can be lost after processing. Check the original operation and follow the provider’s recovery process before submitting another payment.</p>
      <p>For the account review, identify the notice, requested information, decision owner and review process. A working connection or an authorization response does not prove that a funding restriction has been removed.</p>
      <p>Keep the cases linked but track their outcomes separately. Record the confirmed transaction result in one and the account review decision in the other. Do not create another charge simply to test whether a restriction has cleared.</p>
      <p>Etail’s <Link href="/company/legal/payouts-and-reserves" prefetch={false}>payout and reserve terms</Link> distinguish the responsible funding provider, available funds and any reserve conditions. Follow the documents supplied for the affected account.</p>
    </section>
    <section id="keep-account-map" aria-labelledby="keep-account-map-title">
      <h2 id="keep-account-map-title">Keep a clear record of your account arrangement</h2>
      <p>Keep your agreements, fee schedule, merchant IDs, gateway account references and support contacts together. Include the teams responsible for payment investigations, funding, disputes and account changes. For several stores or DBAs, make the store and account mapping explicit.</p>
      <p>For a Trolleys setup, the welcome email pairs each store’s MID with its gateway login details. The Back Office Operations Portal and Cybersource Business Center serve different purposes; their names do not replace the provider responsibilities in your account documents. The <Link href="/developers/getting-started" prefetch={false}>after approval guide</Link> explains how to match the accounts and access both portals.</p>
      <p>The <Link href="/company/legal/acquirer-disclosure" prefetch={false}>acquirer disclosure</Link> identifies Etail’s United States arrangement and the limits of each party’s role. An acquiring relationship does not remove the merchant’s obligations for its sales, refunds, disputes or security.</p>
      <p>The practical aim is simple: know which record answers the question, which team investigates it and which party has authority to resolve it.</p>
    </section>
  </BlogArticlePage>;
}
