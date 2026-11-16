import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { bicSwiftArticle } from "./bic-swift-content";
import s from "./blog.module.css";

const paymentFields = [
  ["BIC / SWIFT code", "The organization or branch identified in the bank’s instructions.", "Which customer account should receive the money."],
  ["IBAN or account number", "The account identifier required for the payment route.", "Whether an emailed change was authorized by your supplier."],
  ["Beneficiary name", "The intended recipient, using the details required by the bank.", "That every other field is correct or has been verified."],
  ["Invoice reference", "The purchase or balance the recipient should apply the payment to.", "The bank or account destination."],
] as const;

export function BicSwiftPage() {
  return <BlogArticlePage article={bicSwiftArticle}>
    <p>Imagine an overseas supplier sends an updated invoice. The amount is familiar. The bank name is unchanged. You look up the SWIFT code and it returns the institution you expected, so the instruction feels reassuring.</p>
    <p>But the account number has changed. The code lookup has not told you whether the new account belongs to the supplier or whether the supplier authorized the change.</p>
    <p>That is the distinction worth understanding before the next international payment. A correct piece of bank information can sit inside an incorrect payment instruction.</p>

    <section id="different-fields-different-jobs" aria-labelledby="different-fields-different-jobs-title">
      <h2 id="different-fields-different-jobs-title">One code cannot do every job</h2>
      <p>BIC means Business Identifier Code. Payment forms commonly call it a SWIFT code. It identifies an organization and can also identify a branch or unit, rather than an individual customer’s bank account.</p>
      <p>The standard BIC has eight characters, with an optional three-character branch element. Swift administers its registration under ISO 9362. BICs can identify financial and non-financial organizations, and having one does not by itself establish a connection to the Swift messaging network.</p>
      <p>For a supplier payment, use the bank details supplied for that recipient, currency and transfer route. If a form expects eleven characters and you were given eight, ask the bank what it requires. Do not invent a branch ending to get past the form.</p>
      <table className={s.comparison}>
        <caption>Payment fields answer different questions</caption>
        <thead><tr><th scope="col">Detail</th><th scope="col">What it identifies</th><th scope="col">What it does not establish</th></tr></thead>
        <tbody>{paymentFields.map(([detail, purpose, limit]) => <tr key={detail}>
          <th scope="row">{detail}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it identifies</span>{purpose}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it does not establish</span>{limit}</td>
        </tr>)}</tbody>
      </table>
      <p>An IBAN is an International Bank Account Number. Countries using it have their own registered formats. It belongs in the account part of the instruction; it does not replace a BIC when the payment service separately requires one.</p>
      <p>Not every country uses IBANs. The United States does not, for example. Request the receiving bank’s instructions instead of trying to turn a US account number into an IBAN or assuming every international transfer needs the same fields.</p>
      <p>The complete instruction can also depend on currency and any intermediary bank involved. Confirm the required fields, charges and expected receipt with the provider handling the transfer. The BIC alone does not establish the route’s cost or delivery time.</p>
    </section>

    <section id="verify-the-change" aria-labelledby="verify-the-change-title">
      <h2 id="verify-the-change-title">Check who changed the instruction</h2>
      <p>Return to the imagined invoice. Nothing about the unchanged bank name proves that the new account is the right destination. Equally, a genuine supplier may have changed accounts. The useful response is verification, not guessing which explanation feels more likely.</p>
      <p>Contact an authorized supplier representative through a channel you already trust or a number obtained independently. Do not rely on the telephone number included in the message requesting the change. Confirm the recipient, account details, invoice and reason for the revision before replacing the saved instructions.</p>
      <p>The FBI recommends independent checks of payment requests and changes to account information. A familiar email thread is not enough: compromised accounts can make an instruction look like part of an ordinary conversation. Urgency should not remove the check.</p>
      <p>Keep a record of who confirmed the change and which instructions were approved. Where your process requires another person’s approval, give that person the changed details and verification record, not just the invoice total. An approval that never shows the new account is a poor way to catch a destination error.</p>
      <p>When details remain inconsistent, resolve the discrepancy before sending. If money has already been sent and you suspect fraud, contact the financial institution immediately and report the incident through the appropriate channel. Ask about the available recovery process. Prompt action matters, but it does not guarantee that the money can be recovered.</p>
    </section>

    <section id="separate-payment-records" aria-labelledby="separate-payment-records-title">
      <h2 id="separate-payment-records-title">Keep the sale, the payout and the supplier payment distinct</h2>
      <p>A merchant may collect customer payments, receive a deposit and then pay a supplier. These are related business events, but they are not one transfer with one reference. A supplier’s BIC does not explain a missing merchant payout, and a gateway transaction ID is not the bank’s reference for an outgoing wire.</p>
      <p>For a Trolleys merchant, <Link href="/services/payouts" prefetch={false}>Trolleys, an Etail Depot service</Link>, helps follow merchant payouts under the accepted account terms. The published funding schedule covers USD payouts to approved US bank accounts. It does not establish an international supplier wire service.</p>
      <p>Use the secure account process to establish or change your merchant payout destination. If a payout fails or is returned, its status needs to be established before a replacement is sent. <Link href="/company/contact#account-support" prefetch={false}>Ask our account team</Link> to help with available merchant payout records; use the sending bank’s process for a separate supplier transfer.</p>
      <p>For that supplier transfer, keep the approved instructions, amount, currency, invoice reference and bank transaction reference together. If the recipient cannot locate it, take those records to the sending provider. Repeating the payment because a code lookup looks correct can create a second problem without resolving the first.</p>
      <p>The code tells you something useful. The complete, verified instruction tells your business where it has agreed to send the money. Keep those two checks separate.</p>
    </section>
  </BlogArticlePage>;
}
