import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { achVerificationArticle } from "./ach-verification-content";
import s from "./blog.module.css";

const verificationQuestions = [
  ["Can the account receive ACH entries?", "Account validation can check whether the account is open and accepts ACH entries.", "Correctly formatted numbers alone do not establish account ownership."],
  ["Who has access, and who owns it?", "Bank linking or microdeposit confirmation can provide access evidence. Ownership data requires the relevant check.", "Access and ownership are different findings. Confirm what the service actually returns."],
  ["May the business collect this payment?", "The customer’s authorization records the permitted collection and its terms.", "A successful account check does not supply permission to debit."],
  ["Are funds available?", "A supported balance check reports account data at a particular time.", "It does not reserve that balance or guarantee that a later debit will succeed."],
] as const;

export function AchVerificationPage() {
  return <BlogArticlePage article={achVerificationArticle}>
    <p>A single Verified label can hide several different decisions. Your team needs to know the method used, when it ran and which result supports the next action. Keep bank checks, customer permission and payment status as separate records.</p>
    <section id="questions" aria-labelledby="questions-title">
      <h2 id="questions-title">Know what you are checking</h2>
      <p>Choose the check for the question you need to answer. Do not assume every verification service provides the same evidence.</p>
      <table className={s.comparison}>
        <caption>Four questions behind an ACH verification decision</caption>
        <thead><tr><th scope="col">Question</th><th scope="col">Useful evidence</th><th scope="col">Limit</th></tr></thead>
        <tbody>{verificationQuestions.map(([question, evidence, limit]) => <tr key={question}>
          <th scope="row">{question}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Useful evidence</span>{evidence}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Limit</span>{limit}</td>
        </tr>)}</tbody>
      </table>
      <p>For example, Stripe documents instant bank verification and a microdeposit alternative. Its Financial Connections service treats ownership information as separately requested data, shared with the user’s permission. Bank linking should not automatically be described as a completed ownership check.</p>
      <p>Balance data also has a time attached to it. Stripe’s documentation distinguishes a requested refresh from a successful result. An unavailable or pending balance response is not evidence that funds are present.</p>
      <p>Authorization answers another question. Nacha’s guidance calls for clear collection terms, a consumer copy and a way to revoke permission. Our <Link href="/company/blog/how-recurring-ach-payments-work" prefetch={false}>recurring ACH article</Link> explains how that permission relates to a billing schedule.</p>
    </section>
    <section id="requirement" aria-labelledby="requirement-title">
      <h2 id="requirement-title">Apply the right account validation requirement</h2>
      <p>Nacha requires account validation within the fraud screening process for WEB debits, which are consumer debits authorized or initiated online. The requirement applies before first use of an account number and when a customer supplies a new number.</p>
      <p>The stated minimum checks whether an account is open and can accept ACH entries. That does not necessarily verify its owner. Additional checks can be appropriate for the business and its risks. Confirm the applicable entry type and controls with your bank or provider.</p>
      <p>Nacha does not prescribe one technology for every business. The provider’s supported process should identify what is checked, what a successful response means and what happens if the account cannot be verified.</p>
      <p>If the process uses microdeposits, the customer must complete the required confirmation. Simply waiting without receiving a return does not complete that check. Do not start live collections while that verification remains unfinished.</p>
    </section>
    <section id="operate" aria-labelledby="operate-title">
      <h2 id="operate-title">Give customers a clear way to finish</h2>
      <p>Tell customers what action remains and where to complete it. A legitimate customer may be unable to use the preferred method. Provide the bank or provider’s approved alternative instead of manually marking the account as verified.</p>
      <ol>
        <li><strong>Explain the next action.</strong> Direct the customer to the supported bank connection or verification screen. Tell them how to return to it if confirmation is still pending.</li>
        <li><strong>Protect the information.</strong> Keep bank passwords and verification values out of ordinary support messages. Use the provider’s secure process for entering or correcting details.</li>
        <li><strong>Record the outcome.</strong> Retain the method, date, result and provider reference in the appropriate secure record. Link it to the relevant payment authorization.</li>
        <li><strong>Resolve incomplete checks.</strong> Follow the provider’s process for a failed, expired or unavailable result. Confirm that any replacement bank details receive the required checks before use.</li>
      </ol>
      <p>When a recurring customer changes bank accounts, confirm the request through an established customer channel, validate the replacement details and review the collection authorization. Passing one check does not complete the others.</p>
      <p>Continue following each payment after verification. An ACH debit can still fail or be returned. The <Link href="/company/blog/how-long-does-it-take-an-echeck-to-clear" prefetch={false}>eCheck clearing article</Link> explains why account checks, collection status and merchant funding are different events.</p>
      <p>For merchants using Trolleys, an Etail Depot service, <Link href="/services/ach-payments" prefetch={false}>ACH availability and terms</Link> depend on the merchant account. Confirm the supported verification process for your setup before promising customers a particular method or completion time.</p>
    </section>
  </BlogArticlePage>;
}
