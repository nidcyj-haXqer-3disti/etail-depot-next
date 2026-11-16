import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { crmPaymentsArticle } from "./crm-payments-content";

export function CrmPaymentsPage() {
  return <BlogArticlePage article={crmPaymentsArticle}>
    <p>A customer pays, then receives another request for the same money. Your team may see a synchronization problem. The customer sees a business that has not noticed their payment.</p>
    <p>Connecting payments to a customer relationship management system, or CRM, should help prevent that conversation. The purpose is to give the person speaking to the customer an accurate account of the sale: which bill was paid, how much remains and whether anything needs attention.</p>
    <p>A Pay button on a contact record does not establish those facts. Neither does a sales opportunity marked won. The connection has to carry the relationship between the customer, the bill and the payment, then keep that relationship intact when the balance changes.</p>
    <p>For businesses using <Link href="/services/merchant-services" prefetch={false}>Trolleys, an Etail Depot service</Link>, that starts with the correct store and merchant account. Your CRM may bring customer conversations together across several stores or DBAs. The payment still belongs to the account that accepted it, and the customer’s bill must point to that payment.</p>

    <section id="the-balance-belongs-to-the-bill" aria-labelledby="the-balance-belongs-to-the-bill-title">
      <h2 id="the-balance-belongs-to-the-bill-title">The balance belongs to the bill</h2>
      <p>Consider a customer with two open jobs who pays the agreed deposit on one of them. A customer profile marked “paid” says too much. It can hide the balance on that job and the entire amount due on the other. Recording the payment against whichever opportunity was updated most recently is no better.</p>
      <p>The useful record is more specific. Preserve the invoice or order reference, the payment reference and the amount allocated to that bill. If one payment covers several invoices, record each allocation. If a payment cannot be matched, keep it visible for review rather than guessing from the payer’s name or the amount.</p>
      <p>For Trolleys’ Cybersource connection, your developer can use the documented order reference to help locate the transaction. The field’s rules depend on the operation and processor. Keep the returned transaction identifiers and merchant-account association too; an order reference is not a substitute for checking the payment itself.</p>
      <p>The person answering the customer should be able to see:</p>
      <ul>
        <li>The bill and the amount still due under its agreed payment schedule.</li>
        <li>The payment or refund attached to it, including an unresolved or pending result.</li>
        <li>Where that information came from and when it was last updated.</li>
      </ul>
      <p>That is enough to make the next conversation more useful. A partial payment may leave another installment due later. A pending payment needs investigation before another collection request. A refund must remain connected to the original payment and the agreed adjustment to the bill.</p>
      <p>Even a reassuring status label needs context. HubSpot’s documentation, for example, says manually recorded payments receive a Succeeded status by default. That label records the entry; it does not independently establish that money was collected through a connected gateway. Check how your own CRM distinguishes imported payment evidence from a staff member’s entry.</p>
    </section>

    <section id="when-the-customer-record-changes" aria-labelledby="when-the-customer-record-changes-title">
      <h2 id="when-the-customer-record-changes-title">The customer record will change. The payment history must survive.</h2>
      <p>People leave companies. Billing contacts change. Two sales representatives create records for the same buyer. A shared accounts email can represent several people or businesses. These are reasons to preserve record identifiers and their relationships instead of treating an email address as the permanent identity of every sale.</p>
      <p>A CRM cleanup also needs a payment check. Merging contacts can change identifiers, associations or connected workflows, depending on the system. Preserve a way to trace earlier records and review which invoices and payments remain attached. Combining two contact records does not make their companies, bills or merchant accounts interchangeable.</p>
      <p>For a Trolleys merchant with several locations, use the store, DBA, MID and gateway-account mapping supplied during setup. Keep that context even if the CRM presents one customer timeline. Our <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> compares merchant-account and gateway activity; your CRM connection must also preserve the link from that activity to the customer’s specific bill.</p>
      <p>The same care applies to automation. A repeated payment notification must not allocate the amount twice or send a second receipt. A later refund must not disappear because an earlier sale was already processed. Etail’s <Link href="/developers/webhooks#payment-event" prefetch={false}>payment notification guidance</Link> explains matching the account, order and operation before acting on an update.</p>
    </section>

    <p>Before buying a connector, ask its supplier to demonstrate an ordinary sale followed by the changes your business actually handles: a deposit, two open bills, a refund and a merged customer record. Have them delay an update, then recover it. Your team should be able to explain the resulting balance without asking the customer to pay again or manually rebuilding the history.</p>
    <p>A gateway integration does not automatically include a connector for your CRM. Confirm the supported software version, available payment records, permissions and responsibility for maintaining the connection. Sales staff may need to see a payment without being allowed to issue refunds. Keep card details and API secrets out of customer notes.</p>
    <p>If you are planning that connection around Trolleys, bring your CRM, billing software and collection workflow to our <Link href="/company/contact#integration" prefetch={false}>account and integration team</Link>. We can help with the merchant-account and payment side; your software provider or developer needs to confirm the CRM connection and its rules. For software companies building this into their product, our <Link href="/use-cases/software-platforms/partnerships" prefetch={false}>platform partnerships</Link> define the account, integration and support arrangements for that work.</p>
    <p>The customer should not have to prove the same payment to sales, accounts and support. A useful CRM connection lets those teams follow the same bill to the same payment, while keeping the remaining obligation clear.</p>
  </BlogArticlePage>;
}
