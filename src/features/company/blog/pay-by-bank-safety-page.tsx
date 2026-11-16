import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { payByBankSafetyArticle } from "./pay-by-bank-safety-content";
import s from "./blog.module.css";

const paymentDirections = [
  ["The business collects an authorized debit", "Check the customer’s permission, the bank account and the agreed amount and date.", "A valid account does not make every debit authorized or guarantee that it will succeed."],
  ["The customer sends a transfer", "Check the payment request, receiving account and amount before approval.", "A real receiving account does not prove that a request to pay it is genuine."],
] as const;

export function PayByBankSafetyPage() {
  return <BlogArticlePage article={payByBankSafetyArticle}>
    <p>A familiar bank logo or a successful sign in is only part of the picture. The service also needs clear payment permission, appropriate handling of account information and a process for mistakes or disputed payments.</p>
    <section id="direction" aria-labelledby="direction-title">
      <h2 id="direction-title">Know who starts the payment</h2>
      <p>Ask the provider which network moves the money and whether the business collects it or the customer sends it. These arrangements put different decisions in different hands.</p>
      <table className={s.comparison}>
        <caption>Two payment directions, different checks</caption>
        <thead><tr><th scope="col">Payment direction</th><th scope="col">What to check</th><th scope="col">What a check cannot prove</th></tr></thead>
        <tbody>{paymentDirections.map(([direction, check, limit]) => <tr key={direction}>
          <th scope="row">{direction}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to check</span>{check}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What a check cannot prove</span>{limit}</td>
        </tr>)}</tbody>
      </table>
      <p>For consumer ACH debits authorized online, Nacha distinguishes minimum account validation from ownership verification. Confirming that an account is open and accepts ACH entries does not necessarily confirm who owns it. Our <Link href="/company/blog/ach-verification" prefetch={false}>account verification article</Link> explains how validation, access, ownership and debit permission differ.</p>
      <h3>When an email changes the payment destination</h3>
      <p>A business receives an email that appears to come from its regular supplier and asks for payment to a replacement account. The account may be real and able to receive money. Those facts do not establish that the supplier requested the change.</p>
      <p>Confirm the request using a contact method already on file, rather than a number supplied in the message. The FBI recommends verifying payment requests and changes to account details independently. Signing in to your bank does not resolve whether that email is genuine.</p>
    </section>
    <section id="controls" aria-labelledby="controls-title">
      <h2 id="controls-title">Check the provider and your own process</h2>
      <p>Review the actual customer journey before offering the method. Ask the provider to show what the customer approves, which information is shared and how your team sees the result.</p>
      <ol>
        <li><strong>Understand data access.</strong> Ask who handles bank sign in, what data the connection can retrieve, who receives it and how access can be disconnected. Keep bank passwords and verification codes out of support messages.</li>
        <li><strong>Confirm payment permission.</strong> Check how a debit authorization is recorded or a transfer is approved. Review the amount, date and recipient before release, with additional review for a new destination or a change to payment instructions.</li>
        <li><strong>Keep useful records.</strong> Make sure support can connect the order, authorization, account check and payment outcome. Limit access to full bank details and use the provider’s secure records when investigating an issue.</li>
        <li><strong>Plan the response.</strong> Identify who can pause future instructions, contact the provider and preserve the relevant records. Confirm the reporting channel and applicable deadlines before an incident occurs.</li>
      </ol>
      <p>Bank linking does not mean that no account data is processed. For example, Stripe’s Financial Connections documentation separates the bank connection from data retrieval and describes permissions for different information. Evaluate the permissions and data handling of the service you actually use.</p>
      <p>Protect the accounts your staff use, too. Enable multifactor authentication where available and restrict who can change payment instructions. A secure connection cannot replace a review of an unexpected request.</p>
    </section>
    <section id="recovery" aria-labelledby="recovery-title">
      <h2 id="recovery-title">Understand what recovery can involve</h2>
      <p>Do not assume that every bank payment can be cancelled after approval. The Clearing House explains that RTP settlement is final and that a sending financial institution cannot recall a submitted payment. The network supports a request for the return of funds, but that request is not a unilateral undo button. The <Link href="/company/blog/fednow-vs-rtp" prefetch={false}>FedNow and RTP comparison</Link> covers network and bank service differences.</p>
      <p>Account type also matters. The CFPB’s Regulation E definition covers consumer accounts established primarily for personal, family or household use. Do not assume the same protections apply to a business account. Ask the bank or provider which procedures and protections apply to the account and payment involved.</p>
      <p>If a payment request appears fraudulent, contact the financial institution promptly through a known channel. The FBI advises contacting the financial institution immediately after suspected business email compromise and reporting it to IC3. Preserve the request, payment reference and communications. A recovery request is not confirmation that funds have been recovered.</p>
      <p>For merchants using Trolleys, an Etail Depot service, <Link href="/services/ach-payments" prefetch={false}>ACH availability and terms</Link> depend on the merchant account. Confirm authorization, validation, return handling and reporting for your connection. Assess the controls for that service rather than relying on a blanket promise that bank payments are safer than every other way to pay.</p>
    </section>
  </BlogArticlePage>;
}
