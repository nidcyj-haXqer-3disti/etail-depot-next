import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { openInvoicesArticle } from "./open-invoices-content";

export function OpenInvoicesPage() {
  return <BlogArticlePage article={openInvoicesArticle}>
    <p>A customer can have paid you and still appear on an unpaid-invoice report. Xero’s aged receivables report includes invoices that were outstanding on the selected report date, even when they have been paid since. The report can be correct while the reminder you are about to send is wrong.</p>
    <p>That is an easy mistake to make when you work from an export. The list has names, balances and dates. It looks ready to act on. But a historical record of money owed does not establish what each customer owes today.</p>
    <p>Before sending another payment request, open the invoice itself. Check what has happened since the list was produced. You need the current balance, the agreed due date and the result of any payment already in progress.</p>

    <section id="what-open-actually-tells-you" aria-labelledby="what-open-actually-tells-you-title">
      <h2 id="what-open-actually-tells-you-title">What “open” actually tells you</h2>
      <p>An open invoice generally means an issued bill still awaiting payment or resolution in the billing system. It does not, by itself, mean the customer is late. Stripe uses open for a finalized invoice awaiting payment and keeps that status when payment fails or the invoice is not fully paid. A draft is a different stage.</p>
      <p>Even the label on the screen needs context. Stripe documents an open invoice that shows Pending in the invoice list while a payment is processing, but Open on its details page. Those labels describe the same invoice from different views. Neither is a reason to assume the payment failed.</p>
      <p>Check the date behind an aging column too. Xero lets businesses age receivables by invoice date or due date. An invoice that has existed for a month is not necessarily a month overdue. Use the agreed payment terms when deciding whether the customer has missed a deadline.</p>
      <p>The UK’s Small Business Commissioner starts its advice on unpaid invoices with checking the original invoice and contract, confirming the terms and looking for errors. That is useful discipline before choosing the tone of a reminder. If payment is not yet due, a question about whether the invoice reached the right person should not read like an accusation of late payment.</p>
    </section>

    <section id="find-the-payment-first" aria-labelledby="find-the-payment-first-title">
      <h2 id="find-the-payment-first-title">Find the payment before asking for another</h2>
      <p>A pending payment needs its own place in the review. Stripe updates the paid and remaining amounts when a payment succeeds. Until then, a balance can remain visible while an attempt to collect it is still underway. Stripe also warns that multiple open payments can result in an invoice being overpaid.</p>
      <p>Do not treat that visible balance as permission to start another collection attempt. Check the original payment’s status first. If the customer says they paid elsewhere, ask for the date and payment reference, then trace it in your records. A statement that money was sent is a reason to investigate, not enough to mark the invoice paid or demand payment again.</p>
      <p>Our article on <Link href="/company/blog/pay-invoice-by-credit-card" prefetch={false}>connecting payments to invoices</Link> explains the matching work. Once a confirmed payment is applied, follow up on the actual remainder. Include approved credits as well. Keep a proposed adjustment separate until the business has agreed and recorded it.</p>
      <p>A disputed charge needs a person who can answer the question. Repeating the same request without reviewing the disputed item leaves the customer with the same objection. Record what is being challenged, who will resolve it and when they will respond. That gives the next conversation somewhere to go.</p>
      <p>When the balance is verified, overdue and not covered by a pending payment, send a <Link href="/company/blog/writing-a-letter-for-outstanding-payment" prefetch={false}>clear payment reminder</Link>. Identify the invoice, the remaining amount and the way to pay. Make it easy for the customer to tell you what is holding payment up.</p>
    </section>

    <section id="what-cleared-the-balance" aria-labelledby="what-cleared-the-balance-title">
      <h2 id="what-cleared-the-balance-title">Check what cleared the balance</h2>
      <p>There is another trap at the end of the review: treating a shorter open-invoice list as proof that more money arrived. Stripe allows invoices to be voided or marked uncollectible. A credit note can also reduce an open balance to zero. These are different outcomes from collecting a payment.</p>
      <p>Keep the reason for each adjustment with the record. When reviewing progress, separate money collected from credits, cancellations and amounts judged unlikely to be recovered. Your team should be able to explain what changed without reopening every customer conversation.</p>
      <p>The most useful invoice review leaves you with fewer unanswered questions: which customers are late, which payments need tracing and which charges need a decision. Then the next message can ask for the right thing.</p>
    </section>
  </BlogArticlePage>;
}
