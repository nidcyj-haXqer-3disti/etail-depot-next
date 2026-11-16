import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { payoutExceptionsArticle } from "./payout-exceptions-content";

export function PayoutExceptionsPage() {
  return <BlogArticlePage article={payoutExceptionsArticle}>
    <p>Imagine a business paying twelve overseas contractors at the end of the month. The invoices are approved, the payment file is accepted and the person handling the run moves on. Later, one contractor asks where the money is.</p>
    <p>The reply is easy to write: “We processed the batch.” It is much harder to use. The contractor cannot pay a bill with a successful upload.</p>
    <p>Cross-border payouts need a record for each recipient, not just a record that the business sent a file. The useful question is what happened to this payment, for this obligation, and what someone is doing about it now.</p>

    <section id="batch-and-recipient-status" aria-labelledby="batch-and-recipient-status-title">
      <h2 id="batch-and-recipient-status-title">A batch can finish before the money does</h2>
      <p>The word “completed” deserves a second look. In Wise Platform’s batch documentation, a completed group has been closed to changes and is ready for funding. That status does not establish that its payouts succeeded. The distinction is specific to that provider’s terminology, but it is a useful warning against interpreting a label without its definition.</p>
      <p>Individual transfer status needs the same care. Wise documents that a sent transfer does not prove the recipient’s bank account has been credited; funds can also come back after sending. Your provider’s own definitions should determine what your team tells recipients.</p>
      <p>Keep the batch reference, the individual transfer reference and the invoice or other obligation connected. The invoice explains why the business owes money. The transfer record explains the attempt to pay it. Replacing one attempt should not create a new invoice or erase the first instruction.</p>
      <p>Before release, confirm the approved recipient, amount, currency and destination details used for each payment. Record which version of those details was authorized. If someone changes a bank account after the batch was reviewed, the earlier approval is not evidence that the reviewer approved the new destination.</p>
      <p>The available funding also matters. Money expected from tomorrow’s sales is not the same as funds available for today’s payment run. Confirm the provider’s funding requirement and currency arrangement before promising when recipients will be paid.</p>
    </section>

    <section id="recover-the-unresolved-payment" aria-labelledby="recover-the-unresolved-payment-title">
      <h2 id="recover-the-unresolved-payment-title">Fix the exception without repeating the success</h2>
      <p>Suppose each of those twelve contractors is owed EUR 250, with fees handled separately. Eleven recipients have confirmed receipt; one payment remains unresolved. The obligations total EUR 3,000. Confirmed receipts total EUR 2,750. EUR 250 still needs an answer. These are hypothetical amounts, not a payment-service quote.</p>
      <p>Resending the whole batch would put the eleven completed payments at risk of duplication. The unresolved payment needs investigation on its own, using its original reference.</p>
      <p>Find out whether the instruction was rejected before money moved, is still processing, was sent but has not been credited, or has returned. Ask the provider for the evidence behind that status. A recipient saying “I cannot see it” is important information, but it does not establish that the original transfer is safe to repeat.</p>
      <p>If the destination was wrong, correct the recipient record through the approved process. Verify a changed account independently before using it. The FBI advises confirming account-number and payment-procedure changes with the requesting party, using contact information obtained independently of a suspicious message.</p>
      <p>Then establish whether a replacement is needed and permitted. Do not treat a cancellation request as proof that a transfer was cancelled, or a returned status as proof that the money is already available to spend again. Get the original outcome, required correction and funding position clear before authorizing another attempt.</p>
      <p>Retain both attempts against the same obligation. A clean-looking screen with the failed attempt deleted is less useful than an honest history showing what was sent, what failed and what replaced it.</p>
    </section>

    <section id="give-the-recipient-an-answer" aria-labelledby="give-the-recipient-an-answer-title">
      <h2 id="give-the-recipient-an-answer-title">The waiting recipient needs an owner</h2>
      <p>Give the exception to a named person or team. Keep the unresolved amount, its age, the provider reference and the next action visible. A high percentage of successful payments should not make the remaining recipient disappear from the work queue.</p>
      <p>For the hypothetical contractor whose transfer has been sent but not confirmed received, a useful update could read:</p>
      <blockquote><p>“The provider confirms it sent your EUR 250 payment. We do not yet have confirmation of the bank credit. Our payments team is investigating the original transfer and will update you tomorrow, even if the investigation is still open.”</p></blockquote>
      <p>That is a sample communication, not a promised service deadline. It states what is known, what remains unknown and who will follow up. Share a suitable tracking reference through the agreed channel, without exposing another recipient’s details or a whole batch file.</p>
      <p>Also be precise about the service your business needs. Paying your own contractor, distributing money to third-party sellers and receiving your own merchant payout are different arrangements. Confirm that the provider permits your business’s role, the recipients and the payment purpose. A platform integration does not establish that authority.</p>
      <p>For a Trolleys merchant, the relevant incoming payment is the <Link href="/services/payouts" prefetch={false}>merchant payout</Link>. Trolleys, an Etail Depot service, helps connect eligible payment activity and account adjustments with that deposit. Our current <Link href="/company/legal/payouts-and-reserves#scope" prefetch={false}>funding schedule</Link> covers USD payouts to approved US bank accounts, not international contractor or seller disbursements.</p>
      <p>If a merchant payout needs attention, our <Link href="/company/contact#account-support" prefetch={false}>account support team</Link> can work from its amount, reference and status. If your software business needs to distribute funds to other sellers, <Link href="/company/legal/software-platforms#merchant-relationship" prefetch={false}>seller transfers require a separately approved arrangement</Link>. Do not build a promise to recipients around a capability the account does not have.</p>
      <p>The purpose of a payout process is not to finish uploading files. It is to make each payment traceable and leave no unpaid obligation without an explanation and a next step.</p>
    </section>
  </BlogArticlePage>;
}
