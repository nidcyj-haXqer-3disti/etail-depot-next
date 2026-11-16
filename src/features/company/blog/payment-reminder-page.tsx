import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentReminderArticle } from "./payment-reminder-content";

export function PaymentReminderPage() {
  return <BlogArticlePage article={paymentReminderArticle}>
    <p>By the time you write another payment reminder, you may already be frustrated. The work is finished. The invoice has been sent. You would rather be running the business than finding a more forceful way to ask for money that is due.</p>
    <p>The customer may be looking at a different problem: an invoice missing from their system, a charge they do not recognize or a transfer they believe already settled the account. A stronger subject line cannot tell you which one it is.</p>
    <p>A useful outstanding-payment letter makes the obligation clear and gives the recipient a way to resolve it. That requires an accurate balance, an identifiable invoice and a request someone can answer.</p>

    <section id="make-it-easy-to-reply" aria-labelledby="make-it-easy-to-reply-title">
      <h2 id="make-it-easy-to-reply-title">Make the next reply useful</h2>
      <p>Start with the account. Check the invoice against payments applied, approved credits and agreed changes. If there is a receipt waiting to be matched, investigate it before asking the customer to pay again. The balance you request should be the amount still owed, rather than the original invoice total copied into a template.</p>
      <p>Confirm who handles the payment too. Our article on <Link href="/company/blog/important-invoice-management-tips" prefetch={false}>invoice management</Link> explains why the person who ordered the work may not be the person processing the bill. Repeatedly contacting the wrong person can leave a perfectly clear message unanswered.</p>
      <p>Stripe’s guidance on overdue letters recommends including the invoice reference, due date, outstanding amount, business contact details and payment instructions. Keep those facts easy to find. A short reminder can read like this, with the brackets replaced by your actual details:</p>
      <blockquote aria-label="Payment reminder wording">
        <p><strong>Subject: Balance due on invoice [reference]</strong></p>
        <p>Hello [name],</p>
        <p>Our records show a remaining balance of [amount and currency] on invoice [reference] for [work or order], due [original due date]. I have attached a copy.</p>
        <p>Please arrange payment using the instructions on the invoice and confirm the expected payment date. If payment has already been sent, please share its date and reference so we can trace it. If something on the invoice needs clarification, reply here and I will look into it.</p>
        <p>Thank you,<br />[Your name and business]<br />[Contact details]</p>
      </blockquote>
      <p>Attach the correct invoice before sending. If a partial payment or credit has been applied, briefly acknowledge it so the remaining balance makes sense. Use the original agreed due date, and keep a record of when you sent the reminder.</p>
      <p>The wording asks for payment directly without requiring the customer to reconstruct the account or guess whom to contact. It also avoids the unhelpful instruction to disregard the message if they have paid. If the payment is missing from your records, you still need the reference to find it.</p>
      <p>Do not add a new fee, shortened deadline or threatened consequence just because a template contains one. Any such step needs a basis in the applicable agreement and rules. This is ordinary reminder wording, not a formal legal demand.</p>
    </section>

    <section id="respond-to-the-answer" aria-labelledby="respond-to-the-answer-title">
      <h2 id="respond-to-the-answer-title">Let the answer change your next move</h2>
      <p>A reply saying payment was sent calls for a search of the records. Check the date, reference and allocation before sending another request for the same balance. If a line item is disputed, identify that charge and review the agreement or delivery record behind it. Our article on <Link href="/company/blog/types-of-invoice-discrepancies" prefetch={false}>invoice discrepancies</Link> covers that conversation.</p>
      <p>If the customer cannot pay as agreed, someone with authority in your business needs to decide whether a different arrangement is acceptable. The UK Small Business Commissioner advises putting agreed payment plans in writing. Record the amounts and dates, who approved the arrangement and what both parties have agreed to do.</p>
      <p>A promised payment date is useful for follow-up, but it does not settle the invoice. Keep the balance open until the payment is confirmed and applied. Make a dated note of the conversation so a colleague can continue it without asking the customer to start again.</p>
      <p>If there is no response, verify that the message reached the right person and try direct contact. The Commissioner recommends a call or meeting after an unanswered reminder. Have the invoice and account history available so the conversation can address the delay, rather than simply repeat the demand.</p>
      <p>Automation should support that work. Stripe, for example, offers configurable invoice reminders and one-off invoice emails. A scheduled message cannot know about a separate conversation unless the process or record reflects it. Check what happens after an outside payment, an agreed credit or a new payment arrangement, and pause messages that no longer fit.</p>
      <p>Keep one person responsible for the next action. Two colleagues and an automated sequence contacting the same customer can leave your business giving inconsistent instructions. A shared record of the latest response and next contact is more useful than a growing count of reminders sent.</p>
      <p>When ordinary follow-up has failed, decide deliberately whether to seek professional help with recovery. Formal notices, fees and collection action need review against the contract and the relevant jurisdiction. Do not treat a generic reminder schedule as permission to take those steps.</p>
      <p>The aim is to bring the unpaid invoice closer to resolution: payment located, a question answered, an arrangement recorded or a next action chosen. A firmer tone alone does none of those jobs.</p>
    </section>
  </BlogArticlePage>;
}
