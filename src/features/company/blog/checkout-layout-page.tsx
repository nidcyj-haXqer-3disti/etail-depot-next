import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { checkoutLayoutArticle } from "./checkout-layout-content";
import s from "./blog.module.css";

const layoutChecks = [
  ["Seeing progress", "Group the information clearly so a long page does not feel like an unstructured form.", "Name each stage and show the current position and what remains."],
  ["Changing details", "Let customers edit a section and see any effect on delivery or the total.", "Make completed stages easy to revisit without losing unrelated details."],
  ["Using a phone", "Check scrolling, the open keyboard and access to the order summary.", "Keep each stage readable and the next action easy to find."],
  ["Fixing errors", "Identify the affected field even when it is outside the visible screen.", "Show the error in the right stage and preserve the rest of the order."],
] as const;

export function CheckoutLayoutPage() {
  return <BlogArticlePage article={checkoutLayoutArticle}>
    <p>A shorter looking checkout is not necessarily easier to finish. Customers still need to understand the purchase, provide the required details and know whether their payment completed. Evaluate those tasks before deciding how many pages to use.</p>
    <section id="start-with-order" aria-labelledby="start-with-order-title">
      <h2 id="start-with-order-title">Start with what the order needs</h2>
      <p>List the information required to fulfill the order and process payment. A physical order needs a delivery destination. A digital purchase may not need a shipping address, although billing or other required information can still apply. Ask why each field is present before removing or rearranging it.</p>
      <p>Separate necessary information from optional requests. A newsletter invitation or account registration should not obscure the payment task. Where your platform allows guest checkout, make it easy to find. Useful saved details can reduce typing without changing the number of pages.</p>
      <p>Baymard’s checkout research finds that the fields customers must consider matter more to usability than the step count alone. That supports a useful starting point: reduce unnecessary work before moving the remaining fields into a different layout.</p>
      <p>Then identify what depends on an earlier answer. A new address can change delivery options, tax or the total. Show those changes before the customer commits to payment. Our <Link href="/company/blog/accelerated-guest-checkout" prefetch={false}>guest checkout article</Link> explains how saved information and order review work together.</p>
    </section>
    <section id="compare-layouts" aria-labelledby="compare-layouts-title">
      <h2 id="compare-layouts-title">Compare the work in each layout</h2>
      <p>One page can keep the order and its details together. Multiple stages can divide a longer form into manageable tasks. Either approach needs clear editing, progress and recovery. Use the same order and required information when comparing them.</p>
      <table className={s.comparison}>
        <caption>What to check in both checkout layouts</caption>
        <thead><tr><th scope="col">Customer task</th><th scope="col">One page</th><th scope="col">Multiple stages</th></tr></thead>
        <tbody>{layoutChecks.map(([task, single, multiple]) => <tr key={task}>
          <th scope="row">{task}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">One page</span>{single}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Multiple stages</span>{multiple}</td>
        </tr>)}</tbody>
      </table>
      <p>W3C recommends logical groups and visible progress for longer forms split into stages. Customers should be able to review completed steps without losing information already entered. A progress indicator helps only when it accurately describes the journey.</p>
      <p>In either layout, keep labels visible and explain errors with words, not color alone. Make the affected field easy to reach and say how to correct it. Include keyboard navigation and zoom in the review, rather than testing only with a mouse.</p>
    </section>
    <section id="check-platform" aria-labelledby="check-platform-title">
      <h2 id="check-platform-title">Check what your platform controls</h2>
      <p>Your storefront, checkout platform and payment connection may control different parts of the journey. Confirm which layout options your setup supports before commissioning a redesign. A gateway connection does not by itself replace the store’s delivery, tax or order management screens.</p>
      <p>Shopify documents one page and three page layouts that collect the same information and offer the same checkout analytics. It also advises checking the storefront after saving a layout change because the editor does not preview that change in real time. Review customized wording, translations and branding in the actual checkout.</p>
      <p>For a Trolleys connection, use the relevant <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify</Link> or <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce guide</Link>. Those guides address payment setup; they do not mean every checkout layout or extension is supported.</p>
      <p>For a custom website, give your developer the complete customer journey to test, including hosted payment fields, enabled wallets and any bank verification. Our <Link href="/developers/testing" prefetch={false}>testing guidance</Link> covers the payment checks alongside the visual review.</p>
    </section>
    <section id="test-corrections" aria-labelledby="test-corrections-title">
      <h2 id="test-corrections-title">Test corrections before comparing results</h2>
      <p>Use a test environment with the provider’s test payment details. Ask someone unfamiliar with the checkout to complete these four tasks on a phone and a desktop:</p>
      <ol>
        <li><strong>Change the delivery address.</strong> Move toward payment, then edit the address. Check that delivery options and the total update clearly, while unrelated details remain intact.</li>
        <li><strong>Fix an invalid field.</strong> Leave required information incomplete or use a supported validation test. Check that the message explains the problem and helps the customer reach the field.</li>
        <li><strong>Return to an earlier decision.</strong> Change a delivery option or review the cart. Check both the page’s edit controls and browser Back. The order should remain understandable when the customer returns.</li>
        <li><strong>Complete and recover from payment.</strong> Test success and a provider-supported decline or verification cancellation. Check that the customer gets an accurate result and can continue appropriately without an unintended duplicate order or payment.</li>
      </ol>
      <p>Watch where the person hesitates, loses information or cannot explain the final total. Fix those problems before treating a difference in completion as evidence that one layout is better. The <Link href="/company/blog/optimize-your-mobile-checkout-experience" prefetch={false}>mobile checkout guide</Link> gives additional checks for small screens and payment recovery.</p>
    </section>
    <section id="measure-completion" aria-labelledby="measure-completion-title">
      <h2 id="measure-completion-title">Measure completed orders, not fewer clicks</h2>
      <p>Agree on what counts as a checkout start and a completed order before comparing results. Google Analytics defines events for beginning checkout, providing shipping or payment information and purchasing. These actions can be measured without treating every page view as a checkout stage.</p>
      <p>Use equivalent groups: device, guest or returning customer, saved details and available payment methods. Do not compare a returning customer using a wallet with a guest entering every field and attribute the difference to layout. Keep other material changes separate where possible, including price, shipping offers and traffic campaigns.</p>
      <p>Check completed orders alongside form errors, payment failures, backtracking and requests for help. Verify that tracking still works after the change and that reloads do not count the same purchase twice. Analytics alone should not be used as proof that a payment was successful.</p>
      <p>Our <Link href="/company/blog/cart-abandonment-vs-checkout-abandonment" prefetch={false}>abandonment guide</Link> explains how to define the stages and denominators. If there is too little traffic for a reliable comparison, use observed usability problems to guide the next change rather than claiming a conversion lift.</p>
      <p>Choose the layout that makes your actual orders easiest to complete and correct. Page count is one design choice, not the result customers are buying.</p>
    </section>
  </BlogArticlePage>;
}
