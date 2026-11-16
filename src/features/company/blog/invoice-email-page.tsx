import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { invoiceEmailArticle } from "./invoice-email-content";

export function InvoiceEmailPage() {
  return <BlogArticlePage article={invoiceEmailArticle}>
    <p>The invoice had been sent. The finance team had never received it.</p>
    <p>That was the problem in a case published by the UK Small Business Commissioner. A small business had completed work for a larger client and was waiting to be paid. Its invoice had reached the business contact but had not been passed to finance. Once it reached the correct department, payment followed that same week.</p>
    <p>The case does not establish how quickly another customer will pay. It does show why improving an invoice email starts with where the message goes. A beautifully written request cannot help someone who never receives it.</p>
    <p>Even when the route is right, the next reader may have missed every conversation about the work. The email needs enough context to travel beyond the person who knows you.</p>

    <section id="give-the-next-reader-context" aria-labelledby="give-the-next-reader-context-title">
      <h2 id="give-the-next-reader-context-title">Give the next reader enough to act on</h2>
      <p>Confirm the billing route before the first invoice. The Commissioner recommends checking whether the customer expects delivery to a particular department or through a portal. If a procurement system is required, an email to your project contact may be a useful courtesy, but it does not necessarily complete the submission.</p>
      <p>A subject such as “As discussed” assumes the recipient remembers the discussion. Use the invoice reference and your business name instead, adding the project or service period where useful. Stripe’s invoice-email guidance recommends a descriptive subject, recognizable sender and clear invoice details. Those details also give someone a practical way to find the message later.</p>
      <p>The body can be brief. State what the bill covers, the amount currently due, its currency and the agreed due date. Say where the full invoice can be found. Keep the line-by-line explanation in that document rather than maintaining two versions of it in the email and attachment.</p>
      <p>For a first delivery, wording this simple can be enough. Replace the brackets with confirmed information and choose the delivery description that actually applies:</p>
      <blockquote aria-label="First invoice email wording">
        <p><strong>Subject: Invoice [reference] from [business]</strong></p>
        <p>Hello [name],</p>
        <p>Invoice [reference] covers [work or service period]. The amount due is [amount and currency], payable by [agreed due date].</p>
        <p>You can find the invoice [in the attached PDF / in your usual billing portal]. Please use the payment instructions shown there.</p>
        <p>If anything needs correcting, contact [billing contact].</p>
        <p>Thank you,<br />[Name and business]</p>
      </blockquote>
      <p>Add the customer’s purchase-order reference when needed, and ensure it appears on the invoice. If a deposit or credit has reduced the balance, the message should request what remains due. The article on <Link href="/company/blog/create-an-invoice" prefetch={false}>creating a clear invoice</Link> covers the document behind this short introduction.</p>
      <p>There is no need to apologize for sending an agreed bill or make it sound overdue on arrival. A direct request with an accurate date is sufficient. Keep payment reminders for the point when a reminder is actually needed.</p>
    </section>

    <section id="make-the-request-verifiable" aria-labelledby="make-the-request-verifiable-title">
      <h2 id="make-the-request-verifiable-title">Make the request easy to verify</h2>
      <p>Payment emails ask the reader to trust both a document and a destination. The FBI warns that criminals can impersonate familiar senders and gain access to genuine billing conversations. A familiar name or an existing email thread is therefore not proof that new payment instructions are legitimate.</p>
      <p>If your bank details or payment procedure change, use an independently established verification route. The FBI recommends confirming such changes directly and warns against relying on a phone number supplied in a suspicious message. Give customers time to complete their checks. Artificial urgency makes a legitimate invoice harder to distinguish from a fraudulent request.</p>
      <p>For ordinary delivery, use a consistent business identity and explain the destination of any payment link. Customers who normally use a billing portal should be able to reach the invoice through that familiar route. Do not ask them to send card numbers or security codes back by email.</p>
      <p>Check the message your customer receives, including the attachment and destination, rather than reviewing only the text in your editor. A missing PDF, an inaccessible invoice or a reply address nobody monitors leaves the recipient with work you could have avoided.</p>
      <p>After sending, keep delivery and payment separate. Stripe distinguishes invoice notifications, unpaid-invoice reminders and receipts following successful payment. A sent email is not a settled invoice. If delivery fails, correct the delivery problem; if the customer asks for another copy, resend the existing invoice rather than creating another bill.</p>
      <p>Before a later reminder, check payments and credits against the balance. Our article on <Link href="/company/blog/writing-a-letter-for-outstanding-payment" prefetch={false}>outstanding-payment letters</Link> covers that next conversation. The first email has a simpler job: help the right person recognize the charge, find the document and act with confidence.</p>
    </section>
  </BlogArticlePage>;
}
