import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { invoiceCardPaymentArticle } from "./invoice-card-payment-content";

export function InvoiceCardPaymentPage() {
  return <BlogArticlePage article={invoiceCardPaymentArticle}>
    <p>Receiving a payment reminder after paying a bill creates an awkward question: did the payment fail, or did the business lose track of it? The customer now has to check a card statement, find a receipt and explain something they thought was finished.</p>
    <p>Offering card payment should remove that work. Yet a payment link and an invoice can be two separate records. The link collects money; the invoice continues to say that money is owed. Unless the connection between them is reliable, a convenient checkout can leave an inconvenient mess behind it.</p>
    <p>When a customer asks to pay an invoice by credit card, the first thing to check is whether your invoicing system offers a payment page tied to that bill, with card payments enabled for your account. The customer should recognize the business, invoice number, currency and amount currently due before entering a card.</p>
    <p>Stripe’s hosted invoice page illustrates the distinction. It gives each invoice a private URL where the customer can review the bill, use an enabled payment method and download the invoice and receipt. The value is that the payment happens in the context of a particular obligation, rather than asking the customer to identify it again.</p>
    <p>A separate <Link href="/company/blog/how-to-create-a-payment-link" prefetch={false}>payment link</Link> can still be useful. But establish how its payment reference will reach the invoice record. If your tools do not make that connection automatically, someone needs to apply the confirmed payment to the correct bill. A matching amount alone is weak evidence when several customers owe the same total.</p>
    <p>The amount matters just as much as the reference. A deposit already applied should reduce the balance requested. If partial payments are offered, make clear what the customer is paying now and what will remain. Stripe’s partial-payment documentation distinguishes an individual successful payment from a fully paid invoice: the latter requires the remaining balance to be cleared. That distinction should survive any connection between your payment and accounting tools.</p>
    <p>Keep card entry inside the provider’s approved payment flow. Do not turn an invoice email into a request for full card details or security codes in an ordinary reply. PCI SSC prohibits sending unprotected card numbers through email, messaging and similar channels. Sending a payment-page link is different from collecting the card details in your inbox.</p>

    <section id="payment-and-deposit" aria-labelledby="payment-and-deposit-title">
      <h2 id="payment-and-deposit-title">A smaller deposit does not mean the customer underpaid</h2>
      <p>Processing fees can make the amount reaching your bank smaller than the amount the customer paid. If you apply only that net deposit to the invoice, you can accidentally leave a balance that the customer does not owe.</p>
      <p>Intuit’s guidance for third-party merchant services records the customer payment against the invoice and records the deducted service fee separately as an expense. The payment settles the customer’s obligation by the amount actually paid; the fee explains part of the difference in your funding. It does not turn that difference into an unpaid portion of the bill.</p>
      <p>That is why the invoice, payment and deposit need connected but distinct records. Keep the payment reference and amount with the invoice, then reconcile funding and deductions separately. Our article on <Link href="/company/blog/important-invoice-management-tips" prefetch={false}>invoice management</Link> looks at the broader responsibility for keeping the balance current.</p>
      <p>Also be precise about what counts as a completed payment. An approval that still needs capture is different from a completed charge. A checkout page that timed out tells you what the customer saw, not necessarily what happened to the transaction. Check the original attempt in the provider’s records before asking them to pay again. Stripe’s status documentation explicitly separates incomplete, uncaptured and successful payments.</p>
      <p>Once payment is confirmed and applied, the customer should be able to see the amount paid and any balance still due. Reminders should follow that updated balance. Keep later refunds or disputes connected to the same payment history rather than making the customer reconstruct it from separate messages.</p>
      <p>The practical test is simple: can someone return to the invoice and understand what happened without calling you? Offering a card button is the easy part. Making the payment resolve the bill is what lets the customer move on.</p>
    </section>
  </BlogArticlePage>;
}
