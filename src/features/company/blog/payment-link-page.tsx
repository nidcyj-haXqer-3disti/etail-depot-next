import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentLinkArticle } from "./payment-link-content";

export function PaymentLinkPage() {
  return <BlogArticlePage article={paymentLinkArticle}>
    <p>A payment link can be useful when you have agreed on a sale by email, over the phone or in person. It gives the customer a payment page to open without asking them to send card details in a message. You can share the link without building your own website checkout.</p>
    <section id="before-you-begin" aria-labelledby="before-you-begin-title">
      <h2 id="before-you-begin-title">Before you begin</h2>
      <p>First, ask the Trolleys team to confirm that Pay by Link is enabled for your merchant account. Account approval alone does not activate it. Cybersource requires Unified Checkout to be enabled as well. If the option is missing, <Link href="/company/contact#account-support" prefetch={false}>contact account support</Link> before continuing.</p>
      <p>Agree on what the customer is buying, the total amount and currency, and when they will receive it. Make the business name, delivery or completion arrangements, and refund or cancellation terms clear.</p>
      <p>Keep an order reference with these details. It will help you connect your customer’s message, the payment and any later refund to the same purchase.</p>
    </section>
    <section id="create-the-request" aria-labelledby="create-the-request-title">
      <h2 id="create-the-request-title">Create the request</h2>
      <p>Once access is confirmed, sign in to the Cybersource Business Center for the correct store and open <strong>Pay by Link</strong>. This is your payment gateway account, separate from the Back Office Operations Portal.</p>
      <p>Create a request with a description the customer will recognize and the agreed amount. Use a fixed price when the purchase has a set total. Check the available currency, quantity, shipping and expiry options in your account. The Business Center’s <strong>Support → Help</strong> section has instructions for its current screens.</p>
      <p>Keep the order reference in your records and the accompanying message. Explain any delivery details that are not shown on the payment page.</p>
    </section>
    <section id="check-before-sending" aria-labelledby="check-before-sending-title">
      <h2 id="check-before-sending-title">Check the payment page</h2>
      <p>Open the exact link you plan to send. Check the business name, description, currency and amount against the order. Correct any mismatch before sharing, then open the link again to check the result.</p>
      <p>If you add a website button, follow that button to check its destination. For a printed QR code, scan the finished print with a phone and check the page it opens.</p>
    </section>
    <section id="share-the-link" aria-labelledby="share-the-link-title">
      <h2 id="share-the-link-title">Share the link or QR code</h2>
      <p>Copy the payment link and share it by email, text or direct message. You can also connect a website button to it or display a QR code that opens the same payment page.</p>
      <p>Give the customer enough context to recognize the purchase. Your message could say:</p>
      <blockquote><p>Here is the payment link for your order. Please check the order details and agreed total before paying.</p></blockquote>
      <p>Add your actual payment link and the agreed delivery details. Keep a copy of the message with the order. The customer enters their payment details on the provider’s payment page.</p>
    </section>
    <section id="confirm-the-payment" aria-labelledby="confirm-the-payment-title">
      <h2 id="confirm-the-payment-title">Confirm the payment</h2>
      <p>After your customer pays, check the transaction in the correct store’s Cybersource Business Center. Match the amount, currency, date and payment reference to your order, and read the payment’s actual status. A matching customer name or authorization alone does not establish that the funds have settled.</p>
      <p>Opening a link or scanning its QR code does not mean the order is paid. A customer’s screenshot or message alone does not confirm the result either. If the payment is unclear, check the account record before marking the order as paid or asking the customer to try again.</p>
      <p>A successful payment and money arriving in your bank are separate steps. Your account’s payout schedule applies, and fees, refunds, disputes, holds or reserves can affect available funds. See <Link href="/services/payouts" prefetch={false}>how payouts reach your bank account</Link>.</p>
    </section>
    <section id="payment-link-fees" aria-labelledby="payment-link-fees-title">
      <h2 id="payment-link-fees-title">Check the fees</h2>
      <p>Payment links and QR payments carry an additional charge per successful payment, alongside the applicable processing fees. Review <Link href="/pricing" prefetch={false}>pricing and additional fees</Link> before using them. Your accepted fee schedule determines your charges.</p>
      <p>The payment link belongs to the merchant account that created it. Keep the completed payment reference with the purchase details and any delivery, completion or refund records so you can find them together later.</p>
    </section>
  </BlogArticlePage>;
}
