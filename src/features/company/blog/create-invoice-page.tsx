import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { createInvoiceArticle } from "./create-invoice-content";

export function CreateInvoicePage() {
  return <BlogArticlePage article={createInvoiceArticle}>
    <p>In a case reported by the UK Small Business Commissioner, a small business was waiting for payment of more than £5,000. The customer said the invoice did not make clear what the services were. After the details were confirmed and the invoice was reissued with a fuller description, the business received full payment.</p>
    <p>The published account does not name the businesses or give a collection timeline. It does identify what changed: the customer received enough information to understand the charge. Another copy of the same vague bill would have left that question unanswered.</p>
    <p>That does not make every late payment the supplier’s fault. It does give a business something useful to examine before sending an invoice: how much knowledge does this document assume its reader already has?</p>
    <p>The person preparing the bill remembers the work. The person approving it may have only the document. Creating an invoice means carrying enough of the agreement into that document for someone else to check it.</p>

    <section id="describe-the-charge" aria-labelledby="describe-the-charge-title">
      <h2 id="describe-the-charge-title">Describe the work in the buyer’s language</h2>
      <p>A line called services rendered tells the customer very little. A description can identify the service, the period it covers and the relevant project without becoming a transcript of every conversation. For goods, use names or product references the buyer can match to the order, with the quantity and unit price.</p>
      <p>Choose detail that explains the price. Hourly work needs the time and agreed rate. A fixed project fee needs the deliverable or stage being billed, rather than an invented breakdown of hours. When a supporting timesheet or delivery record is needed, reference it clearly and provide it through the customer’s agreed process.</p>
      <p>Internal abbreviations deserve particular attention. A code that helps your team schedule work may be meaningless to accounts payable. Keep it if you need it, but add a readable description. The buyer should not have to ask the person who placed the order to translate the invoice.</p>
      <p>The references around those lines matter too. Identify the selling business, the customer being billed and a contact for questions. Label the document as an invoice, give it a unique identifier and include the purchase order or project reference where applicable. Your invoice number identifies your bill; the buyer’s purchase order identifies their order. One does not replace the other.</p>
      <p>Stripe supports memos and custom invoice fields for this context, including purchase order numbers. Its documentation says custom fields can be changed while the invoice is a draft but not after finalization. Treat the draft as the point to check the references, not simply a screen to click through before sending.</p>
      <p>Show how the lines reach the total. Keep quantities, rates and line amounts readable, then identify applicable discounts, tax and other agreed charges. State the currency. Legal and tax requirements depend on the transaction and jurisdiction, so a downloaded template is only a starting point.</p>
    </section>

    <section id="make-the-request-clear" aria-labelledby="make-the-request-clear-title">
      <h2 id="make-the-request-clear-title">Make the payment request unambiguous</h2>
      <p>The invoice date, the period of work and the payment due date answer different questions. Show them distinctly where relevant. Use the due date required by the agreed terms rather than accepting a software default that changes the arrangement.</p>
      <p>The total value of the work may also differ from what is payable now. Show prior payments or credits through the accounting system’s proper treatment. A deposit is not a discount on the work. If it was separately invoiced, check the earlier billing before creating the final charge. Our article on <Link href="/company/blog/contract-invoices" prefetch={false}>contract invoices</Link> examines that relationship in more detail.</p>
      <p>Give the customer a usable way to pay and explain the reference to include. If you offer a payment page, confirm that it requests the current balance and connects the result to this invoice. The article on <Link href="/company/blog/pay-invoice-by-credit-card" prefetch={false}>paying an invoice by card</Link> covers what that connection needs to preserve.</p>
      <p>Review the version the customer will actually receive. A description visible in your editing screen may be shortened in a PDF or pushed onto another page. Check that the charge, supporting explanation and amount due remain understandable together. A large logo cannot compensate for a missing service period or an unreadable total.</p>
      <p>Keep the issued invoice with its supporting records. The IRS identifies invoices and receipts among the documents supporting entries in business books, and applies the same basic recordkeeping principles to electronic and paper records. Preserve a traceable correction if the issued bill changes rather than leaving two unexplained versions in circulation.</p>
      <p>A useful final review is to read the invoice without filling in the gaps from memory. Can you identify what was supplied, follow the amount being requested and find when and how to pay? The clearer those answers are on the page, the less explaining remains after the invoice leaves your desk.</p>
    </section>
  </BlogArticlePage>;
}
