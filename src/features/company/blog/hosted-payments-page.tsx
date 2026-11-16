import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { hostedPaymentsArticle } from "./hosted-payments-content";

export function HostedPaymentsPage() {
  return <BlogArticlePage article={hostedPaymentsArticle}>
    <p>You do not always need to build a payment form to sell online. A provider can host the payment page, and your customer can reach it from a message, a website button or your store’s checkout. The important question is what happens around that page: how the customer recognizes the purchase and how your team knows it is ready to fulfill.</p>
    <section id="checkout-options" aria-labelledby="checkout-options-title">
      <h2 id="checkout-options-title">Choose how customers reach checkout</h2>
      <p>“Hosted” describes who supplies the payment interface. It does not mean every product has the same setup. There are three common ways a customer can reach it:</p>
      <ul>
        <li><strong>A payment link.</strong> You create a payment request in a provider’s portal, then share the link or connect it to a button or QR code. This can work without building a checkout on your own website.</li>
        <li><strong>A redirect from your store.</strong> Your store passes the purchase to a supported integration, and the customer opens a provider-hosted payment page. The order and payment still need to stay connected.</li>
        <li><strong>An embedded checkout.</strong> The provider’s supported payment interface appears within your website. Integration work is still required; a shareable payment link is not automatically an embeddable checkout.</li>
      </ul>
      <p>Choose around the sale you need to handle. A purchase agreed by email may suit a link. A store with a cart, stock records and shipping options needs a connection that preserves those details. Confirm which payment methods, currencies, recurring payments and customization options the chosen product and account support.</p>
    </section>
    <section id="payment-result" aria-labelledby="payment-result-title">
      <h2 id="payment-result-title">Connect the payment to the order</h2>
      <p>A customer can pay successfully and lose their connection before your confirmation page opens. The return page cannot be your only record of the result.</p>
      <p>For a manually managed sale, match the provider’s transaction reference, amount, currency and status to the order. For an automated store, use its supported integration and verified payment notifications, often called webhooks, to update orders independently of the customer’s browser.</p>
      <p>The integration should handle a repeated notification or reopened confirmation page without creating a second fulfillment. Payment methods that finish later also need a way to update the order when the final result arrives.</p>
      <p>A customer’s screenshot, a page that says “success” or an unfinished payment status is not enough on its own. If the result is unclear, check the account record before asking the customer to pay again. Our <Link href="/company/blog/payment-processing-systems" prefetch={false}>payment processing guide</Link> explains the stages behind the checkout message.</p>
    </section>
    <section id="customer-experience" aria-labelledby="customer-experience-title">
      <h2 id="customer-experience-title">Make the handoff clear</h2>
      <p>The payment page should feel like a recognizable part of the purchase, even if it opens on a different domain. Walk through it from the same message, button or QR code your customer will use.</p>
      <ul>
        <li><strong>Business and purchase.</strong> Check that the merchant name and description match what the customer expects to buy.</li>
        <li><strong>Final total.</strong> Confirm the amount and currency, including any shipping, tax or other applicable charges. The cart and payment page should agree.</li>
        <li><strong>Corrections.</strong> Check how the customer changes an address or returns to the cart. Make sure the next payment attempt uses the corrected order.</li>
        <li><strong>Next step.</strong> Show a clear outcome for a successful, declined or pending payment, with a way to get help when the result is uncertain.</li>
      </ul>
      <p>Open the page on a phone as well as a desktop. Check text size, the keyboard, address entry and the final payment action. A provider’s standard form still needs testing inside your actual sales journey. See our <Link href="/company/blog/optimize-your-mobile-checkout-experience" prefetch={false}>mobile checkout checklist</Link>.</p>
    </section>
    <section id="responsibilities" aria-labelledby="responsibilities-title">
      <h2 id="responsibilities-title">Know what your team still manages</h2>
      <p>Your business still owns the offer, the order record, delivery promises and customer support. Decide who checks unresolved payments, handles refunds and keeps the relevant purchase records. Hosted checkout does not make those tasks disappear.</p>
      <p>Using a provider can reduce your direct handling of card data, but it does not remove every PCI DSS responsibility. The PCI Security Standards Council says merchants must confirm the provider’s compliance for the service used, maintain written responsibility agreements and monitor its compliance status at least annually. Confirm the validation required for your complete setup with your acquirer or the organization managing your compliance program.</p>
      <p>If your store uses an integration, assign someone to maintain its supported version, access settings and payment notifications. For a payment link, decide who creates it, checks the destination and stops using it when the offer changes. Never ask customers to send card details by email to work around a checkout problem.</p>
      <p>Payment confirmation and a <Link href="/services/payouts" prefetch={false}>deposit to your bank</Link> are separate events. Keep a way to find the payment and follow any <Link href="/services/refunds" prefetch={false}>refund</Link> after the sale.</p>
    </section>
    <section id="before-launch" aria-labelledby="before-launch-title">
      <h2 id="before-launch-title">Check the setup before launch</h2>
      <p>For a Trolleys merchant, first confirm which connection is available for your account. Pay by Link requires account enablement and Unified Checkout access. Merchant approval alone does not activate it. If the option is missing, <Link href="/company/contact#account-support" prefetch={false}>ask account support to check availability</Link>.</p>
      <ol>
        <li><strong>Choose the connection.</strong> Confirm whether you will manage payment links in the portal, use a store integration or have a developer connect a custom website.</li>
        <li><strong>Check the commercial details.</strong> Review supported payments, the final customer total, delivery terms and the fees for your account.</li>
        <li><strong>Test the whole purchase.</strong> Use the provider’s approved test setup to check successful and unsuccessful attempts, customer corrections and the payment record.</li>
        <li><strong>Check what happens afterward.</strong> Verify how your team confirms payment, fulfills the order, handles a refund and resolves an uncertain result.</li>
      </ol>
      <p>For the portal route, follow <Link href="/company/blog/how-to-create-a-payment-link" prefetch={false}>how to create and share a payment link</Link>. For a website integration, start with <Link href="/developers/getting-started" prefetch={false}>the approved-account setup guide</Link>. Payment links and QR payments carry an additional charge per successful payment; review <Link href="/pricing" prefetch={false}>pricing and additional fees</Link> alongside your accepted fee schedule.</p>
    </section>
  </BlogArticlePage>;
}
