import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { applePayArticle } from "./apple-pay-content";

export function ApplePayPage() {
  return <BlogArticlePage article={applePayArticle}>
    <p>Adding Apple Pay starts with the payment connection your store already uses. A logo tells customers what you accept, but the account, website and checkout must be configured to process the payment behind it.</p>
    <section id="choose-connection" aria-labelledby="choose-connection-title">
      <h2 id="choose-connection-title">Start with your existing checkout</h2>
      <p>Ask your ecommerce platform or payment provider whether its connection supports Apple Pay for your account, country, currencies and accepted cards. Apple Pay does not replace merchant approval or automatically enable every card network.</p>
      <p>Apple supports both direct implementation and setup through participating platforms and payment providers. Approved providers can register merchant websites on their behalf. Confirm which requirements your provider handles before creating your own Apple identifiers or certificates.</p>
      <ul>
        <li><strong>Shopify.</strong> Use the wallet instructions for the payment provider connected to your store. Trolleys merchants can begin with the <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify integration guide</Link>.</li>
        <li><strong>WooCommerce.</strong> Follow the instructions for the installed payment plugin and gateway account. See the <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce integration guide</Link>.</li>
        <li><strong>A custom website.</strong> Ask your web team to follow the chosen provider’s supported checkout integration. Etail’s <Link href="/developers/getting-started#payment-methods" prefetch={false}>developer setup instructions</Link> cover Apple Pay domain verification for Cybersource Unified Checkout.</li>
      </ul>
      <p>Confirm <Link href="/services/payment-methods" prefetch={false}>which payment methods are enabled</Link> for your Trolleys account. A general Apple Pay capability does not establish that a particular store is ready to use it.</p>
    </section>
    <section id="verify-domain" aria-labelledby="verify-domain-title">
      <h2 id="verify-domain-title">Complete the domain setup</h2>
      <p>For a custom website using Cybersource Unified Checkout, the merchant and web team complete domain verification together:</p>
      <ol>
        <li>Sign in to the store’s Business Center and open <strong>Payment Configuration → Unified Checkout</strong>. Choose <strong>Set Up</strong> in the Apple Pay section.</li>
        <li>Download the supplied domain verification file and have your web team place it at <code>/.well-known/apple-developer-merchantid-domain-association</code> on the checkout domain.</li>
        <li>Confirm that the file opens directly over HTTPS on that domain. It must return the file itself, not a login page, redirect or website error page.</li>
        <li>Return to the setup screen, select <strong>Verify Domain</strong> and submit the same domain. Confirm verification succeeds for each domain where the integration requires it.</li>
      </ol>
      <p>This is a public domain verification file. It is different from a private .p12 encryption certificate or an API secret. Never put private credentials at this public address.</p>
      <p>If verification fails, ask the web team to check the exact hostname, file contents, HTTPS certificate and whether Apple can reach the file. Follow your platform’s own process when it manages verification for you.</p>
    </section>
    <section id="customer-experience" aria-labelledby="customer-experience-title">
      <h2 id="customer-experience-title">Make the payment easy to recognize</h2>
      <p>Use the supported Apple Pay button supplied by your integration. Apple distinguishes its payment button from its acceptance mark: the mark communicates availability and is not itself a working payment button.</p>
      <p>The payment sheet should identify the business and show the correct total, currency and relevant delivery details. Request only information needed for the purchase. If the customer changes an address or shipping method, check that the payment total and store order stay aligned.</p>
      <p>Apple Pay availability depends on the customer’s card, device, browser, region and your integration. It is not limited to Safari in every setup. Participating websites can support a code that customers scan with an eligible iPhone or iPad to complete a purchase started in another browser. Do not promise that flow unless your chosen checkout supports it.</p>
      <p>Keep another supported payment option available when Apple Pay cannot be used. Customers should understand how to continue without troubleshooting your wallet configuration.</p>
    </section>
    <section id="test-order" aria-labelledby="test-order-title">
      <h2 id="test-order-title">Test the complete order</h2>
      <p>Domain verification and payment testing are separate tasks. Apple’s sandbox requires a supported device, a sandbox tester and the appropriate test cards. Your gateway connection must also use its matching test environment. Follow the provider’s wallet testing instructions rather than entering a generic test card into a live wallet.</p>
      <ol>
        <li><strong>Review the final amount.</strong> Check products, discounts, taxes, shipping, merchant name and currency. Where the checkout supports address or delivery changes, confirm the final order matches the payment sheet.</li>
        <li><strong>Cancel and recover.</strong> Cancel before payment and check that the customer can return to the order. Test unsuccessful and interrupted attempts without creating duplicate orders or requesting payment again before checking the existing result.</li>
        <li><strong>Confirm the payment record.</strong> Match the order with the gateway reference and required payment status. Browser navigation alone is not proof of a successful charge.</li>
        <li><strong>Check the follow-up.</strong> Confirm the receipt and support references, then test the supported refund or cancellation flow and its connection to the original transaction.</li>
      </ol>
      <p>Apple also calls for production validation using real cards and production settings. Agree a controlled live check with your provider and the cardholder before making a charge, and confirm the refund procedure. Sandbox success alone does not establish that the production setup works.</p>
      <p>Etail’s <Link href="/developers/testing" prefetch={false}>testing checklist</Link> covers the wider checkout and recovery checks. The <Link href="/services/refunds" prefetch={false}>refund service page</Link> explains the merchant follow-up.</p>
    </section>
    <section id="maintain-setup" aria-labelledby="maintain-setup-title">
      <h2 id="maintain-setup-title">Keep the setup working</h2>
      <p>Assign someone to own domain verification, certificate renewal and the account notices relevant to your chosen integration. Apple can recheck domain access, so keep the verification file reachable. If your provider manages certificates, confirm what remains your team’s responsibility.</p>
      <p>Review Apple Pay again when changing the checkout domain, hosting, payment plugin or integration. Include the supported phone and desktop journeys in that review, not just whether the button still appears.</p>
      <p>Confirm processing charges in your accepted provider terms. Adding a wallet does not by itself guarantee more approved payments, faster payouts or protection from every dispute.</p>
      <p>After launch, review completed orders, failed attempts and customer questions. If Apple Pay is missing or setup remains unclear, <Link href="/company/contact#account-support" prefetch={false}>contact account support</Link> with the store domain and integration name. Keep passwords and private keys out of support messages.</p>
    </section>
  </BlogArticlePage>;
}
