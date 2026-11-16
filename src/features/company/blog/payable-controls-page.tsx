import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { payableControlsArticle } from "./payable-controls-content";
import s from "./blog.module.css";

const paymentChecks = [
  ["Prepared", "The bill and proposed payment details are recorded.", "Check the amount, recipient, due date and supporting documents."],
  ["Approved", "An authorized person has approved the payment.", "Keep the approval record. Approval alone does not mean money was sent."],
  ["Submitted", "The instruction has been sent to the bank or payment provider.", "Keep its reference and check the reported outcome. Do not assume submission means completion."],
  ["Recorded as paid", "The reported payment outcome and relevant bank activity have been checked against the bill.", "Retain the confirmation and reconciliation evidence. Update the record if a later return or reversal occurs."],
] as const;

export function PayableControlsPage() {
  return <BlogArticlePage article={payableControlsArticle}>
    <section id="capture-and-validate" aria-labelledby="capture-and-validate-title">
      <h2 id="capture-and-validate-title">Verify the bill before it reaches the payment queue</h2>
      <p>Use one intake process to record incoming invoices and their status. Keep received but unapproved items visible so they remain part of the workload and period-end review. A disputed payment request may need investigation; an incurred obligation should not disappear simply because approval is pending.</p>
      <ul className={s.actionChecklist} role="list">
        <li><strong>Confirm the purchase.</strong> Compare the bill with agreed prices and quantities, and check that the goods or services were received. Record differences and who will resolve them.</li>
        <li><strong>Search for duplicates.</strong> Compare the supplier, invoice number, date and amount with bills and payments already recorded. A PDF and its emailed reminder may be the same obligation.</li>
        <li><strong>Check the account and approver.</strong> Use the correct accounting period and account. Send the bill to someone who can verify the purchase and has authority to approve it.</li>
      </ul>
      <p>Retain the invoice, purchase evidence and approval together. Keep accounting recognition separate from permission to release money. The <Link href="/company/blog/accounts-payable-journal-entry" prefetch={false}>accounts payable journal entry guide</Link> explains why recording a bill and paying it are different events.</p>
    </section>
    <section id="destination-control" aria-labelledby="destination-control-title">
      <h2 id="destination-control-title">Check changed bank details separately</h2>
      <p className={s.accountingScenario}>A manager approves an equipment invoice after confirming delivery. A later email asks for payment to a different account. <strong>The approved purchase does not approve the new bank details.</strong></p>
      <p>Pause the account change and verify it through an independently established supplier contact. Call a trusted number already on file or obtained independently, not a number supplied only in the change request. An email that appears to come from a familiar sender can still be compromised.</p>
      <p>Keep a record of what was verified, by whom and when. Require the appropriate authorization before updating the supplier record or releasing the payment. An urgent message should not bypass this check.</p>
      <p>If money may already have been diverted, contact your financial institution immediately through a trusted channel and preserve the messages and payment references. The FBI also directs businesses to report business email compromise to its Internet Crime Complaint Center. Recovery is not guaranteed.</p>
    </section>
    <section id="separate-and-review" aria-labelledby="separate-and-review-title">
      <h2 id="separate-and-review-title">Separate sensitive actions and check the outcome</h2>
      <p>Where staffing allows, separate supplier-detail changes, bill approval, payment release and reconciliation. Limit access to what each person needs, use individual logins and retain change history. For a small team, an owner who did not make the change can review supplier updates and released payments. That adds a check, but cannot replace every separation of duties.</p>
      <figure className={s.accountingControls}>
        <figcaption>Keep payment preparation separate from the actual outcome</figcaption>
        <ol role="list">{paymentChecks.map(([stage, meaning, check]) => <li key={stage}>
          <h3>{stage}</h3>
          <div><p>{meaning}</p><p className={s.accountingNote}><strong>Check:</strong> {check}</p></div>
        </li>)}</ol>
      </figure>
      <p>These are workflow distinctions, not universal bank status labels. Check what your provider’s status actually means. <strong>A missing response is not proof that no payment was made.</strong> Investigate a timeout, rejection or missing confirmation before sending another instruction.</p>
      <p>Review duplicate attempts, approval overrides, recent bank-detail changes and unresolved payments regularly. Give each exception an owner and keep its resolution with the original record. Use the <Link href="/company/blog/accounting-reconciliation" prefetch={false}>accounting reconciliation process</Link> to compare the records and investigate differences. Controls reduce opportunities for errors and fraud; they do not guarantee prevention.</p>
    </section>
  </BlogArticlePage>;
}
