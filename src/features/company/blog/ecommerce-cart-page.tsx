import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { ecommerceCartArticle } from "./ecommerce-cart-content";
import s from "./blog.module.css";

const checks = [
  ["Products", "Change a size, color and quantity, including an unavailable combination.", "The selected item, image, stock and price stay consistent. Any restriction is explained before payment."],
  ["Promotions", "Apply and remove a coupon, then change the basket so it no longer qualifies.", "Discount eligibility, combinations and the revised total match the promotion you offered."],
  ["Delivery", "Switch the address or delivery method, including an address you cannot serve.", "Estimated charges are identified, restrictions are explained and the payable total is clear before confirmation."],
  ["Return visit", "Leave the cart and return later. Test signed in and guest visits separately.", "Saved items behave as promised, while expired offers and changed availability are checked again."],
] as const;

export function EcommerceCartPage() {
  return <BlogArticlePage article={ecommerceCartArticle}>
    <section id="map-rules" aria-labelledby="map-rules-title">
      <h2 id="map-rules-title">Start with the baskets you sell</h2>
      <p>List a simple basket, your most common mixed basket and the hardest legitimate combination. A clothing store might combine sizes, a bundle discount and an unavailable color. A food seller might need delivery restrictions or a minimum order. These cases reveal requirements that a list of generic features can hide.</p>
      <p>Separate required behavior from preferences. A cart that cannot represent a required product option is unsuitable even if its design is appealing. Conversely, a rarely used promotional rule may be cheaper to simplify than to support through permanent custom development.</p>
      <p>Keep the cart and payment connection distinct. The cart organizes the purchase; checkout collects the details needed to place it; the payment service processes the payment. They must agree on the order and total, but choosing a cart does not by itself activate a merchant account or every advertised payment method.</p>
    </section>
    <section id="change-test" aria-labelledby="change-test-title">
      <h2 id="change-test-title">Test what happens when the basket changes</h2>
      <p>Imagine a customer has enough units in a basket to earn a quantity discount. Before they pay, another order reduces available stock below that quantity. Adding an item to a cart does not necessarily reserve it; check the platform’s rule rather than promising a reservation your store cannot honor.</p>
      <p>Shopify, for example, says it checks inventory during checkout and holds it when the customer submits payment information. A failed payment releases that hold. Other platforms and extensions may behave differently.</p>
      <p>Test whether the customer sees the changed availability before paying, whether removing a unit recalculates the discount, and whether the final charge matches the revised total. The important result is an understandable correction, not a silently different order.</p>
      <p>Discount combinations need their own check. Shopify distinguishes product, order and shipping discounts, with eligibility and configuration rules for combining them. A cart that accepts two coupon codes does not necessarily apply both. Test the exact promotion and explain any rejected code.</p>
    </section>
    <section id="evaluation" aria-labelledby="evaluation-title">
      <h2 id="evaluation-title">Use a short acceptance script</h2>
      <p>Run the same cases on each candidate using a test store and the payment provider’s documented test mode. Ask for a demonstration of the complete order, not just a polished product page.</p>
      <table className={s.comparison}>
        <caption>Four shopping cart checks before choosing a platform</caption>
        <thead><tr><th scope="col">Check</th><th scope="col">What to try</th><th scope="col">What to confirm</th></tr></thead>
        <tbody>{checks.map(([check, action, result]) => <tr key={check}>
          <th scope="row">{check}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to try</span>{action}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to confirm</span>{result}</td>
        </tr>)}</tbody>
      </table>
      <p>Do not assume that a guest cart will follow a customer from a phone to a laptop. Ask which sign in, browser and session conditions preserve it, then test those conditions.</p>
      <p>Include keyboard use and a narrow mobile screen. Customers should be able to identify errors and change an item without losing the rest of the basket. W3C guidance recommends clear feedback explaining what went wrong and how to fix it. Check that updates are understandable without relying only on color.</p>
      <p>Try the enabled express payment options as well as the ordinary checkout. Confirm that the selected products, discounts and delivery details reach the final order correctly. Our <Link href="/company/blog/optimize-your-mobile-checkout-experience" prefetch={false}>mobile checkout article</Link> covers the phone journey in more detail.</p>
    </section>
    <section id="ownership" aria-labelledby="ownership-title">
      <h2 id="ownership-title">Choose the amount of control you can maintain</h2>
      <p>A cart supplied within a hosted store can reduce the components you manage, but verify which rules are configurable and which require an app or specialist. A custom cart may support unusual flows while leaving your team responsible for keeping pricing, inventory and checkout connections consistent.</p>
      <ul>
        <li><strong>Compatibility.</strong> Confirm the required payment connection, product types, shipping tools and promotions work together on the plan you intend to use.</li>
        <li><strong>Upkeep.</strong> Name the person responsible for updates, backups, testing and restoring a working store after a problem.</li>
        <li><strong>Costs.</strong> Compare platform fees, required extensions, payment charges and ongoing development. A low starting price does not describe the full operating cost.</li>
        <li><strong>Leaving later.</strong> Ask what product and order data can be exported, in which format, and what would have to be rebuilt elsewhere.</li>
      </ul>
      <p>For WooCommerce, the official update guidance recommends a current backup and testing changes on a staging copy before production. Include the theme, extensions and payment connection in those checks. Hosted platforms still require you to check your own settings and apps.</p>
      <p>Ask who repairs a broken promotion after an update and how staff can reproduce a customer’s problem without exposing payment details. Evaluate the complete commerce platform separately; cart behavior is one important part of that larger decision.</p>
      <p>Once you have chosen the platform and confirmed account access, our <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify integration</Link> and <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce integration</Link> guides explain the payment connection. They do not replace configuring your products, stock, delivery and promotions.</p>
    </section>
  </BlogArticlePage>;
}
