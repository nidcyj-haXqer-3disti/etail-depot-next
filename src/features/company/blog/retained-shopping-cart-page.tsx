import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { retainedShoppingCartArticle } from "./retained-shopping-cart-content";

export function RetainedShoppingCartPage() {
  return <BlogArticlePage article={retainedShoppingCartArticle}>
    <p>The merchant likes its website. Customers know how to buy, staff understand the order screens and the store has no appetite for another redesign. A payment proposal that preserves the cart has an immediate advantage.</p>
    <p>It deserves a fair hearing. It also deserves a more detailed question than “Does it work with our platform?”</p>
    <p>Name the platform, its version and the actual payment integration. Then establish which approved account and payment methods the proposed connection supports. The platform’s name on a compatibility page does not describe every plugin, subscription app or custom extension the store uses.</p>
    <p>The card-entry screen is only the beginning. Staff may capture payment when an order ships, issue a partial refund from the order page or rely on a payment update to release fulfillment. Suppose the proposed connection preserves checkout but requires staff to issue refunds in a separate dashboard and then update the order manually. That may be an acceptable trade, but it exchanges a one-time redesign for repeated operating work. “We kept the cart” does not tell the owner which cost was saved.</p>
    <p>Saved methods and subscriptions deserve particular attention. Familiar last-four digits on an account screen do not prove the new connection can use the saved credential. A successful one-time order does not establish recurring-payment compatibility. Our <Link href="/company/blog/shopify-subscription-payment-provider" prefetch={false}>Shopify subscription article</Link> explains that boundary in a concrete platform setting.</p>
    <p>Ask for a demonstration of the tasks your team performs, using the proposed supported arrangement. Include a declined payment, an incomplete browser return and the relevant refund or capture actions. Establish how orders and payment records stay connected. Keep testing within the provider’s approved process; a sales demonstration is not permission to experiment with customer payments.</p>
    <p>For Trolleys merchants, the <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify</Link> and <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce</Link> guides document specific connections. They are a starting point for verifying the store, not a promise that every third-party app or customization is compatible.</p>
    <p>Keeping the cart is a good outcome when it preserves what customers like and gives staff a workable way to manage the resulting orders. Any changed routine belongs in the decision before the owner counts the avoided redesign as a saving.</p>
  </BlogArticlePage>;
}
