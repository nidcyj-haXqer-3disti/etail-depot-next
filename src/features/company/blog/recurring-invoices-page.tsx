import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { recurringInvoicesArticle } from "./recurring-invoices-content";

export function RecurringInvoicesPage() {
  return <BlogArticlePage article={recurringInvoicesArticle}>
    <p>An invoice can be correct when you set up the schedule and wrong later without anyone changing a setting. The customer reduces the work. A temporary arrangement ends. A different price takes effect. The software keeps producing the bill you originally asked it to produce.</p>
    <p>The customer sees a new payment request carrying your business name. Explaining that it was automatic will not explain why it was sent. Someone still has to check the agreement, correct the account and tell the customer what remains payable.</p>
    <p>Recurring invoices are useful precisely because they remove repeated preparation. To keep that benefit, the business needs a reliable way to get changes into the schedule before the next bill leaves.</p>

    <section id="decide-what-repeats" aria-labelledby="decide-what-repeats-title">
      <h2 id="decide-what-repeats-title">Decide what is allowed to repeat</h2>
      <p>A fixed service fee and a monthly bill for approved hours may share a billing date, but they need different treatment. One can repeat an agreed amount. The other needs current information before the amount is known. Copying last month’s hours would turn a convenient template into an unsupported charge.</p>
      <p>Use the level of automation that fits the work. QuickBooks distinguishes scheduled transactions, reminders to create them and unscheduled templates. It also describes creating an invoice ahead of sending so it can be reviewed. A regular billing date does not require every bill to leave without review.</p>
      <p>Dates need the same care. Monthly billing is different from billing every 30 days. Stripe’s documented monthly schedule anchored on January 31 moves to the last day of February, then March 31 and April 30. Check how your own system handles short months, and confirm that the first partial period follows the agreement. A software default should not decide whether that period is free or charged.</p>
      <p>Keep the service period visible on the invoice. QuickBooks says recurring templates do not automatically populate its service date field. A new invoice date therefore does not establish that every description or service date inside the document has advanced with it.</p>
      <p>Payment collection is another decision. QuickBooks describes customer enrollment in autopay separately from creating a recurring invoice. Sending regular bills does not by itself authorize automatic charges. If you intend to collect automatically, confirm the provider’s requirements and the customer’s permission for those payments. Our article on <Link href="/company/blog/card-on-file" prefetch={false}>keeping a card on file</Link> explains that distinction.</p>
    </section>

    <section id="carry-the-change-through" aria-labelledby="carry-the-change-through-title">
      <h2 id="carry-the-change-through-title">A corrected invoice can leave the next one wrong</h2>
      <p>There are two places to look when a recurring charge changes: the current invoice and the instructions that will produce the next one. Fixing the amount the customer queried today can leave the same mistake waiting to appear again.</p>
      <p>QuickBooks makes the scope of an edit explicit in some workflows. When changing an item or customer used by a recurring template, it offers a choice between applying the change to relevant templates and applying it only to the current transaction. Read that choice carefully. A one-time credit should not accidentally become a permanent discount; a lasting change should not disappear next month.</p>
      <p>Record the effective date alongside the agreed change. A price beginning next month should not silently rewrite a bill for this month’s work. If an invoice has already been issued, check its status and use the accounting system’s appropriate correction process. Keep the customer’s copy and your records consistent.</p>
      <p>The person agreeing to the change may not be the person managing billing. Give that handoff an owner and a deadline before the next invoice is created or sent. Our article on <Link href="/company/blog/contract-invoices" prefetch={false}>contract invoices</Link> examines the record that connects an agreed change to its charge.</p>
    </section>

    <section id="close-the-schedule" aria-labelledby="close-the-schedule-title">
      <h2 id="close-the-schedule-title">The final bill needs a deliberate ending</h2>
      <p>For a finite engagement, record when the schedule should stop. For an ongoing arrangement, decide how a cancellation or service reduction reaches billing. Confirm the final service period and any agreed remaining charge before closing the schedule.</p>
      <p>Stopping future invoices and resolving invoices already created are separate jobs. Xero explicitly says deleting a repeating template stops new invoices while leaving existing ones unaffected. An invoice generated before cancellation still needs to be reviewed against the agreement; removing its template does not settle its balance or correct its contents.</p>
      <p>The same distinction matters when moving to another billing system. Compare the last old-system invoice and the first new-system invoice by the work or period they cover. New invoice numbers and different creation dates do not rule out billing the same period twice.</p>
      <p>A recurring schedule should make an established arrangement easier to maintain. Its first invoice deserves attention, and so does the point when the arrangement changes. Let the schedule repeat only as long as the agreement still supports it.</p>
    </section>
  </BlogArticlePage>;
}
