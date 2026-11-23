import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { woopaymentsAccountArticle } from "./woopayments-account-content";

export function WoopaymentsAccountPage() {
  return <BlogArticlePage article={woopaymentsAccountArticle}>
    <p>A merchant already uses Stripe and adds a WooCommerce store. WooPayments is built with Stripe, so choosing it can sound like a straightforward way to extend the existing setup.</p>
    <p>It is a different account arrangement. WooCommerce’s documentation says WooPayments creates a connected Stripe Express account and cannot attach a pre-existing regular Stripe account. Its separate Stripe extension can connect that regular account.</p>
    <p>The familiar provider name makes it easy to skip an account decision and move straight to a plugin decision. Yet the shared name does not mean the same dashboard, history, permissions or support route. The merchant is choosing where the new store’s payment work will live, as well as how customers will pay.</p>

    <section id="the-account-you-are-choosing" aria-labelledby="the-account-you-are-choosing-title">
      <h2 id="the-account-you-are-choosing-title">Choose the operating relationship deliberately</h2>
    <p>WooPayments places transaction management inside WordPress, with WooCommerce support as the initial contact. Its accounts do not use the standard Stripe Dashboard. A merchant using the separate Stripe extension has a different connection to its Stripe account.</p>
    <p>The store manager and the finance team may reasonably care about different things. Managing activity within WooCommerce may appeal to the person running that store. A business already operating through a regular Stripe account may have reporting, staff access and other processes organized around that relationship. Neither preference settles the choice alone. The useful comparison includes who gains a simpler working day and who would need to change an established process.</p>
    <p>Compare the applicable fees and capabilities for the product and account being selected. A feature available somewhere in Stripe’s product range should not be assumed available through every partner integration.</p>
    </section>

    <section id="moving-is-not-installing" aria-labelledby="moving-is-not-installing-title">
      <h2 id="moving-is-not-installing-title">Treat a change as an account transition</h2>
    <p>Installing another plugin does not establish that existing subscriptions or saved payment methods have moved. Confirm the supported migration route and permissions with the relevant providers. Earlier refunds and disputes may still require access to the arrangement that handled the original payments.</p>
    <p>Test the required payment and renewal flows before retiring the old setup. Keep transaction history accessible through the agreed record process and confirm which account receives each new payment. Two active integrations can be intentional, but the merchant must understand their roles.</p>
    <p>Trolleys is a separate merchant-service option with its own <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce connection</Link>, approval and account terms. It is not an extension of an existing Stripe or WooPayments account. The same evaluation applies: what continues, what changes and which team supports the resulting arrangement?</p>
    <p>The best fit is an arrangement the whole team understands after installation, including where to look for a new sale and where to return for an older problem. Deciding that together beforehand is easier than discovering, during a refund or reconciliation question, that different staff members thought they were extending the same account.</p>
    </section>
  </BlogArticlePage>;
}
