import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentProcessingArticle } from "./payment-processing-content";

export function PaymentProcessingPage() {
  return <BlogArticlePage article={paymentProcessingArticle}>
    <p>A credit card processing system connects your checkout with the services that approve a payment, collect it and make funds available to your business. Your customer sees one payment page. Behind it, several companies and financial institutions may handle different parts of the sale.</p>
    <section id="parts-of-a-system" aria-labelledby="parts-of-a-system-title">
      <h2 id="parts-of-a-system-title">Who handles each part</h2>
      <p>The <strong>payment gateway</strong> carries payment information from checkout to the processing service and returns the result. The <strong>payment processor</strong> handles transaction messages between the merchant side and the card networks.</p>
      <p>The <strong>issuer</strong> is the financial institution that provides your customer’s card. The <strong>acquirer</strong> is the financial institution on the merchant side. A <strong>card network</strong>, such as Visa or Mastercard, connects the two sides under its payment rules.</p>
      <p>Your <strong>merchant account arrangement</strong> supports accepting card payments. Your <strong>business bank account</strong> is where you receive payouts. These serve different purposes, even when a provider helps you arrange both.</p>
      <p>“Merchant services” is the broader offer around accepting and managing payments. It can include processing, software, reporting and support. One provider may bring several services together, so ask who handles each part and which services are included.</p>
    </section>
    <section id="payment-to-payout" aria-labelledby="payment-to-payout-title">
      <h2 id="payment-to-payout-title">From checkout to payout</h2>
      <p>For a typical online card purchase, the process has five stages. Some happen together in your checkout, but they mean different things.</p>
      <ol>
        <li><strong>Checkout.</strong> The customer reviews the purchase and submits a payment. Opening a payment page alone does not make a payment.</li>
        <li><strong>Authorization.</strong> A request reaches the card issuer through the payment system. The issuer approves or declines it. Approval can reserve available credit, but the money has not reached your bank.</li>
        <li><strong>Capture.</strong> The approved amount is submitted for collection. Your setup may capture automatically or let you capture separately. An authorization can expire if it is not captured in time.</li>
        <li><strong>Clearing and settlement.</strong> The payment details are exchanged and the funds are transferred between the issuing and acquiring sides.</li>
        <li><strong>Payout.</strong> Available funds are sent to your business bank account according to your account terms. A payout can combine several sales with fees, refunds and other adjustments.</li>
      </ol>
      <p>A checkout approval, a captured payment and a bank deposit are separate milestones. Check the payment’s actual status before deciding what happens next with the order. Your account terms, processing cutoffs, reviews, reserves and bank holidays can affect when funds arrive. See <Link href="/services/payouts" prefetch={false}>how merchant payouts work</Link>.</p>
    </section>
    <section id="choose-a-workflow" aria-labelledby="choose-a-workflow-title">
      <h2 id="choose-a-workflow-title">Choose how customers pay</h2>
      <p>Start with where your customer agrees to buy. An order arranged by email may only need a payment link. A store with a shopping cart needs checkout connected to its orders, inventory and refunds. A subscription needs a billing schedule, customer consent, cancellation and a way to handle failed payments.</p>
      <p>A QR code can open a hosted payment page from a phone. It is another way to share the link, rather than a card terminal. For that workflow, see <Link href="/company/blog/how-to-create-a-payment-link" prefetch={false}>how to create and share a payment link</Link>.</p>
      <p>Trolleys, an Etail Depot service, uses Cybersource for gateway checkout and supports recurring payments when enabled for the merchant account. Pay by Link also requires account activation. Choose the connection your business needs and confirm its setup and fees. The <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify</Link> and <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce</Link> guides explain those store connections.</p>
    </section>
    <section id="check-your-records" aria-labelledby="check-your-records-title">
      <h2 id="check-your-records-title">Follow the payment records</h2>
      <p>Keep an order reference that connects the purchase, payment, delivery and any later refund. Match the amount, currency and transaction reference as well as the customer’s name. A customer’s screenshot does not replace checking your account record.</p>
      <p>With Trolleys, the Cybersource Business Center shows gateway transactions. The Back Office Operations Portal provides merchant account activity and funding records. For <Link href="/services/reconciliation" prefetch={false}>payment reconciliation</Link>, compare the corresponding merchant and gateway accounts using the same currency, reporting period and payment status.</p>
      <p>Then follow the payout separately. Review which payments and adjustments it includes, and match its reference and amount to the bank credit. A sales total before deductions will not necessarily equal the deposit. If something is missing, check the reporting dates and status before treating it as a failed payment.</p>
    </section>
    <section id="compare-total-cost" aria-labelledby="compare-total-cost-title">
      <h2 id="compare-total-cost-title">Understand the costs</h2>
      <p>Processing prices often combine a percentage of the sale with a fixed transaction fee. The fixed part takes a larger share of a small order than a large one. Compare offers using your usual order amounts, monthly volume, customer locations and payment methods.</p>
      <p>Ask about charges beyond the headline rate, including international cards, currency conversion, disputes, optional services and any monthly fees. Check how refunds affect fees and which additional charges apply to payment links or QR payments. Trolleys’ <Link href="/pricing" prefetch={false}>pricing and additional fees</Link> explain its current offer; your accepted fee schedule governs your account.</p>
      <p>A processing fee calculation is not a payout forecast. Refunds, disputes, reserve movements and other adjustments can change the amount available for your bank deposit.</p>
    </section>
    <section id="questions-before-applying" aria-labelledby="questions-before-applying-title">
      <h2 id="questions-before-applying-title">One sale, several records</h2>
      <p>Imagine that an order is ready to ship, but the payment record shows only an authorization. The checkout worked, yet the next task is still to confirm the capture required for that order. If the payment was captured and its payout is delayed, asking the customer to pay again would address the wrong problem.</p>
      <p>That is the value of understanding the system: your team can connect the customer’s order to the payment stage that needs attention. Keep the order, gateway and funding references together, and assign the next action to the person responsible for that stage.</p>
    </section>
  </BlogArticlePage>;
}
