import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { onlineShopArticle } from "./online-shop-content";
import s from "./blog.module.css";

const costs = [
  ["Order income", "Item price after discounts, plus any delivery charge paid by the customer.", "Keep tax collected for remittance separate from the income available to cover your costs."],
  ["Product", "What it costs to obtain or make the item you will supply.", "Use the actual variant and quantity in the order, including any supplier charges."],
  ["Delivery", "Packaging, handling and the carrier charge for the destination.", "Free shipping removes the customer’s charge, not your cost of sending the order."],
  ["Payment", "The collection costs under your payment and platform agreements.", "Use your own fee schedule, including any relevant refund or other transaction charges."],
] as const;

export function OnlineShopPage() {
  return <BlogArticlePage article={onlineShopArticle}>
    <section id="offer" aria-labelledby="offer-title">
      <h2 id="offer-title">Define the smallest complete offer</h2>
      <p>Choose a product you can obtain, describe and support. Record its variants, stock, cost, packaging needs and delivery destinations. Write what the customer receives, what is excluded and how returns or defects are handled. Photos and descriptions should represent the item actually supplied.</p>
      <p>Identify the business and contact details customers need. Check registration, tax and consumer obligations for the places where the business operates and sells. Those requirements depend on the circumstances; opening an account with a store platform does not resolve them automatically.</p>
      <p>For a US business, the Small Business Administration’s launch guidance covers registration, tax identification, licenses and permits. Confirm the requirements for your own location and products. Publish contact, delivery, return and privacy information that reflects how the shop will actually operate.</p>
    </section>
    <section id="cost-order" aria-labelledby="cost-order-title">
      <h2 id="cost-order-title">Price an order you can fulfill</h2>
      <p>Work through an order using your supplier prices, delivery quotes and payment agreement. The amount paid at checkout is not the amount left after fulfilling it. A product can sell well while leaving too little to cover the work behind each order.</p>
      <table className={s.comparison}>
        <caption>Build the order calculation using your own figures</caption>
        <thead><tr><th scope="col">Entry</th><th scope="col">What to include</th><th scope="col">What to check</th></tr></thead>
        <tbody>{costs.map(([entry, include, check]) => <tr key={entry}>
          <th scope="row">{entry}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to include</span>{include}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to check</span>{check}</td>
        </tr>)}</tbody>
      </table>
      <p>Subtract the relevant order costs from the income you retain. Then consider whether the remainder can support marketing, returns, staff time and overhead, including fixed platform costs. This planning calculation is not the same as the bank deposit or the business’s final profit.</p>
      <p>If you advertise free shipping without changing the item price, check how much of the delivery cost the business must absorb. Recalculate for discounts, remote destinations and multiple items rather than assuming every order has the same margin.</p>
      <p>Make the customer’s full payable total clear before payment. Configure taxes and delivery rules for the destinations you actually serve, and have the responsible adviser confirm the tax treatment when needed.</p>
    </section>
    <section id="assemble" aria-labelledby="assemble-title">
      <h2 id="assemble-title">Connect the minimum operating tools</h2>
      <p>Select a store platform, a compatible payment connection and a way to manage stock and dispatch. Use a platform your team can maintain. Our <Link href="/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store" prefetch={false}>shopping cart article</Link> explains how to test product options, discounts and delivery before choosing.</p>
      <p>Connect the store domain, confirm that it opens over HTTPS, and prepare the product page, cart, checkout and order confirmation. Check the pages on a phone as well as a desktop. A first launch needs a coherent buying journey, not a large collection of unfinished features.</p>
      <p>For a Trolleys payment connection, complete <Link href="/resources/merchant-account-setup" prefetch={false}>merchant account setup</Link> and confirm the store’s gateway access and enabled methods. Then follow the relevant <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify</Link> or <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce</Link> integration guide. Creating the storefront does not itself approve or activate a payment account.</p>
      <p>Assign a person to review orders and a person to handle customer messages; in a small business, the same owner may hold both roles. Decide where order references, tracking and refund records will be found.</p>
      <p>Use the payment provider’s supported confirmation process before releasing an order. A thank you page alone is not proof that an order is paid. Stripe’s documentation, for example, distinguishes payment success from the customer reaching a return page and describes checking payment status and notifications. Your platform or integration must also handle failed and delayed outcomes without dispatching an order twice.</p>
    </section>
    <section id="rehearsal" aria-labelledby="rehearsal-title">
      <h2 id="rehearsal-title">Run a launch rehearsal</h2>
      <p>Use your payment provider’s documented test facilities and your own product configuration. Shopify recommends test orders during setup and after payment settings change, covering checkout, stock, shipping, tax and notifications. A simulated payment does not verify live funding into your bank account.</p>
      <ul>
        <li><strong>Purchase.</strong> Confirm the product, delivery charge and applicable tax agree across the cart, checkout and confirmation. Read the order email on a phone.</li>
        <li><strong>Failure.</strong> Try an unsuccessful payment in the provider’s test environment. Check that staff do not fulfill it as paid and that a retry can be matched to the original order.</li>
        <li><strong>Fulfillment.</strong> Rehearse picking, packing and recording dispatch using the process planned for customers. Confirm that stock and tracking records update as expected.</li>
        <li><strong>Correction.</strong> Cancel an unfulfilled order and rehearse a refund using supported test facilities. Verify the order and payment records agree; cancelling an order is not automatically the same as returning its payment.</li>
        <li><strong>Support.</strong> Send a realistic customer question and confirm someone can answer it using the available records.</li>
      </ul>
      <p>Before opening to customers, confirm the approved live payment connection is active, test settings are removed, delivery options work and staff know how to investigate an uncertain result. Any live payment check should be separately authorized and may incur charges.</p>
      <p>Launch to an audience small enough that you can handle exceptions. Review the first orders for repeated confusion, inaccurate stock or delivery problems before expanding the catalog or marketing spend.</p>
    </section>
  </BlogArticlePage>;
}
