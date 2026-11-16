import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { guestCheckoutArticle } from "./guest-checkout-content";

export function GuestCheckoutPage() {
  return <BlogArticlePage article={guestCheckoutArticle}>
    <p>A returning shopper may already have a delivery address and payment method saved with a checkout service. Reusing those details can shorten the purchase. The design challenge is to make the shortcut convenient while keeping the customer in control of this order.</p>
    <section id="what-accelerates" aria-labelledby="what-accelerates-title">
      <h2 id="what-accelerates-title">Understand the shortcut</h2>
      <p><strong>Guest checkout</strong> means the customer can buy without creating an account with your store. It does not mean that the order needs no contact details or that the customer has no account with a wallet or payment service.</p>
      <p><strong>Accelerated checkout</strong> can reduce repeated entry by using saved contact, delivery or payment details, depending on the service. Recognition and verification follow that provider’s flow. Removing store registration alone does not add those features.</p>
      <p><strong>Express buttons</strong> provide a shorter route into checkout. Some can skip the cart and open a payment method directly. Check the actual behavior: a button that skips a page may still require the customer to enter details.</p>
      <p>PayPal’s Fastlane is one example of a service designed for guest shopper recognition. Shopify also supports accelerated checkout options. Each has its own availability, connection requirements and terms. A feature offered by one provider is not automatically part of another provider’s checkout.</p>
    </section>
    <section id="review-details" aria-labelledby="review-details-title">
      <h2 id="review-details-title">Keep order review visible</h2>
      <p>Consider a customer who normally ships purchases home but is now buying a gift for someone else. Reusing the saved address without a clear chance to change it could send the order to the wrong place.</p>
      <p>Before the customer authorizes payment, make the recipient, delivery address, shipping choice and final total easy to review. Let them correct the address without losing the cart. If the change affects shipping or tax, show the updated total before they confirm.</p>
      <p>Check discounts, delivery notes and product options too. If an express button bypasses the cart, information collected only on the cart page may be missed. Test the whole order rather than judging the experience by the payment button alone.</p>
      <p>The confirmation and fulfillment record should reflect the customer’s final choices. For physical goods, verify the delivery address and selected items. For digital goods or services, check the delivery email, access details or appointment information your business actually needs.</p>
    </section>
    <section id="fallback" aria-labelledby="fallback-title">
      <h2 id="fallback-title">Make the other routes work</h2>
      <p>Try checkout with a recognized customer and with someone using it for the first time. Keep a clear route for customers who cannot or do not want to use saved details.</p>
      <ul>
        <li><strong>No saved profile:</strong> The customer can enter the required details and buy without being forced to create a store account.</li>
        <li><strong>Verification does not finish:</strong> An expired code or unavailable device has a clear recovery route. The customer can return to an appropriate supported checkout option.</li>
        <li><strong>Shared device:</strong> Follow the provider’s recognition and verification flow. Do not build a shortcut that exposes saved personal information merely because someone types an email address.</li>
        <li><strong>Changed choice:</strong> The customer can use another address or supported payment method without rebuilding the order.</li>
        <li><strong>Unsupported wallet or browser:</strong> The page still offers a usable payment route and explains any relevant limitation.</li>
      </ul>
      <p>If a payment has already been submitted, check its result before starting another attempt. Returning from a wallet, closing its window or seeing a spinner stop does not establish the payment outcome. The <Link href="/company/blog/credit-card-declines" prefetch={false}>decline and retry guide</Link> explains how to handle an uncertain result.</p>
    </section>
    <section id="setup" aria-labelledby="setup-title">
      <h2 id="setup-title">Check your payment setup</h2>
      <p>Start with the checkout your store already uses. Confirm which accelerated options it supports, which customer devices are eligible and which methods are enabled on your merchant account. Use the provider’s approved buttons and verification flow.</p>
      <p>For Trolleys merchants using Cybersource Unified Checkout, available options can include Apple Pay, Google Pay and Click to Pay when configured for the account and connection. Click to Pay can let eligible customers reuse payment details; it is separate from a login to your store. Apple Pay also needs the applicable domain verification setup.</p>
      <p>A wallet option does not by itself complete the rest of your store’s guest checkout. Confirm which contact and delivery details the integration supplies and what your store must still collect. Trolleys’ <Link href="/services/payment-methods" prefetch={false}>payment methods page</Link> explains the account and customer eligibility conditions.</p>
      <p>Follow the relevant <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify</Link> or <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce guide</Link> for those platforms. A custom website team can start with the <Link href="/developers/getting-started" prefetch={false}>approved account connection steps</Link>. Test each enabled method using its supported test setup before launch.</p>
    </section>
    <section id="measure" aria-labelledby="measure-title">
      <h2 id="measure-title">Measure completed orders</h2>
      <p>Track completed paid orders alongside time to finish, form errors, address corrections and support contacts. A shorter checkout is not an improvement if it creates incorrect deliveries or duplicate orders.</p>
      <p>Separate customers who were offered the accelerated option from those who selected it and those who completed payment. Recognized returning shoppers may behave differently from first time visitors, so comparing those groups alone does not show that the shortcut caused an improvement.</p>
      <p>Use the same starting event, observation period and counting rules when comparing results. If an express button skips the cart, make sure your reporting still captures that route. The <Link href="/company/blog/cart-abandonment-vs-checkout-abandonment" prefetch={false}>cart and checkout abandonment guide</Link> explains why stage definitions matter.</p>
      <p>Review the results by device and payment method, then fix the specific point where customers struggle. Keep a normal guest route working alongside the shortcut.</p>
    </section>
  </BlogArticlePage>;
}
