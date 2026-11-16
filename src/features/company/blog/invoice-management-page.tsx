import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { invoiceManagementArticle } from "./invoice-management-content";

export function InvoiceManagementPage() {
  return <BlogArticlePage article={invoiceManagementArticle}>
    <p>An invoice can be correct and still go nowhere. The work is finished, the amount is agreed and the email has been sent. Yet the person who can approve payment may never have seen it.</p>
    <p>The UK’s Small Business Commissioner describes a case with exactly that problem. A supplier sent an invoice to its business contact, who did not pass it to the finance team. After the invoice reached the right department, the customer paid that week.</p>
    <p>The useful lesson is where the delay happened. Sending more copies to the same person would not necessarily have fixed the handoff. Invoice management means following a bill through the customer’s process, recording what has been paid and keeping the remaining obligation clear.</p>
    <p>That work deserves a place in the business before an invoice becomes overdue. Otherwise, the owner ends up reconstructing it from an estimate, a sent email, a bank entry and someone’s memory of a phone call.</p>

    <section id="give-the-invoice-somewhere-to-go" aria-labelledby="give-the-invoice-somewhere-to-go-title">
      <h2 id="give-the-invoice-somewhere-to-go-title">Give the invoice somewhere to go</h2>
      <p>When agreeing the work, ask how the customer processes bills. The Commissioner recommends confirming the receiving department or portal, including a purchase order reference when one has been issued, and agreeing payment terms in advance. A clear description helps the person approving payment understand what was supplied.</p>
      <p>You can make this part of an ordinary sales conversation. Who receives the invoice? Does someone else approve it? Is there a reference the customer needs before their system will accept it? Finding out while everyone is discussing the work is easier than reopening the conversation after the due date.</p>
      <p>Give each invoice its own reference and retain the version you actually sent. If billing follows milestones, make each request correspond to the agreed stage. A deposit already collected needs to be accounted for when you bill the remaining balance. Showing the whole project price again without making the earlier payment clear invites confusion.</p>
      <p>Think about the person reading the document without the background conversation. They should be able to identify the work, the period or delivery covered, the amount currently due and the agreed payment date. Internal shorthand that means something to your team may mean nothing to theirs.</p>
      <p>The way to pay should be equally clear. Offer the methods your business actually accepts and explain how the customer should identify the invoice when paying. Our article on <Link href="/company/blog/b2b-payment-methods" prefetch={false}>business payment methods</Link> considers the practical differences. A convenient payment option helps only after the buyer knows which obligation they are settling.</p>
      <p>Keep a contact for questions on the invoice. A customer querying a charge should be able to reach someone who can resolve it. If the only reply route leads to another automated payment demand, a small clarification can turn into a longer disagreement.</p>
    </section>

    <section id="keep-the-balance-and-conversation-together" aria-labelledby="keep-the-balance-and-conversation-together-title">
      <h2 id="keep-the-balance-and-conversation-together-title">Keep the balance and the conversation together</h2>
      <p>An outstanding-invoice list is most useful when it explains what is still owed and what happens next. Keep the original amount, payments applied, approved credits, remaining balance and due date together. Add the latest meaningful contact and the person responsible for the next action.</p>
      <p>That makes the review more specific than asking whether a bill has been sent. An invoice awaiting the customer’s approval needs a different conversation from one with a disputed charge. A promised payment date calls for a follow-up on that promise. Money received without a usable reference needs investigation before another collection message goes out.</p>
      <p>Software labels can conceal some of those differences. Stripe, for example, distinguishes an open invoice from a paid one and keeps an invoice open when payment fails or it is not fully paid. It also allows a merchant to mark an invoice paid when payment occurred outside Stripe. A status is useful only when the underlying record reflects what happened.</p>
      <p>Before sending reminders, reconcile payments against the invoices they settle. A partial payment reduces the remaining balance; it does not justify requesting the original total again. If a customer says they have paid, use the reference and your own records to trace the payment. A promise to pay and a confirmed receipt should remain separate in the record.</p>
      <p>This is where automation needs attention. Check how your reminder system handles payments made elsewhere, credits and open disputes. Pause a message that asks for an amount you know is wrong. Correct the balance or resolve the issue, then decide what communication is appropriate. Automating an outdated record only sends the mistake more efficiently.</p>
      <p>Give corrections a history too. Retain the original invoice and link any replacement or adjustment so the customer can tell which amount remains payable. The IRS identifies invoices, paid bills, receipts and other supporting documents as evidence for entries in the books. Electronic records carry the same basic recordkeeping responsibilities as paper ones.</p>
      <p>The same discipline matters when you are paying a supplier. Confirm that the bill relates to what your business received, has the necessary approval and has not already been settled. The distinction between money owed to you and money you owe is covered in <Link href="/company/blog/accounts-payable-vs-accounts-receivable" prefetch={false}>accounts payable and receivable</Link>.</p>
      <p>Take particular care with changed payment instructions. The FBI’s Internet Crime Complaint Center recommends verifying requests to change account information through a separate channel with the intended recipient. Use a trusted contact route before redirecting a supplier payment. A familiar email thread alone should not authorize a new destination for the money.</p>
      <p>A regular review should leave each open invoice with a current balance, a reason it remains open and someone responsible for moving it forward. No process can make every customer pay on time. It can keep your own paperwork, records and unanswered questions from adding to the delay.</p>
    </section>
  </BlogArticlePage>;
}
