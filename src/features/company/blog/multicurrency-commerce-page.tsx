import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { multicurrencyCommerceArticle } from "./multicurrency-commerce-content";
import s from "./blog.module.css";

export function MulticurrencyCommercePage() {
  return <BlogArticlePage article={multicurrencyCommerceArticle}>
    <p>A customer chooses euros on your store, finds the price reasonable and buys. To the customer, the transaction is straightforward. Inside your business, someone still has to explain why the payment record is in euros, the proceeds are in dollars and a later refund costs a different dollar amount.</p>
    <p>Multicurrency ecommerce means accepting payment in more than one currency. A currency selector that changes the displayed price does not, by itself, make that happen. The final charge, the payment arrangement and the money your business receives have to work together.</p>
    <p>Local prices can make a store easier to understand. They also create a pricing decision: which amount are you keeping stable, and who absorbs the movement in exchange rates?</p>

    <section id="price-and-charge-currency" aria-labelledby="price-and-charge-currency-title">
      <h2 id="price-and-charge-currency-title">Keep the price promise through checkout</h2>
      <p>A shopper should know the final charge amount and currency before confirming payment. “$” alone leaves an avoidable question for a store serving customers who use US, Canadian or Australian dollars. Use the currency code where the symbol could be ambiguous.</p>
      <p>If your product page offers an approximate conversion but checkout charges USD, say so before the payment is confirmed. Test the cart, shipping, discounts, final total and confirmation email together. A clear product price loses its value if the last screen quietly changes the currency.</p>
      <p>Payment documentation distinguishes the customer’s card-account currency, the currency you charge and the currency used for settlement. Stripe’s currency documentation makes these separate roles explicit. A customer’s issuer may convert the charge when the card account uses another currency; that is separate from conversion of your merchant proceeds.</p>
      <p>Keep the original charged amount and currency in the order record even when your reports translate sales into dollars. A converted reporting figure should not replace the evidence of what the customer paid.</p>
      <p>Then decide how prices change. A fixed EUR price stays familiar to the shopper while its USD equivalent can move. A price recalculated from USD follows your conversion policy but may look different on the next visit. Neither approach is automatically wrong. Choose deliberately, decide when an accepted price is fixed and give someone responsibility for reviewing the margin.</p>
      <p>Shopify’s local-pricing documentation describes both changing exchange rates and exposure under fixed prices. Its product rules are specific to the supported setup. A pricing feature visible in a store’s administration screen does not establish that every connected gateway can charge or settle every currency.</p>
    </section>

    <section id="conversion-and-refund" aria-labelledby="conversion-and-refund-title">
      <h2 id="conversion-and-refund-title">The refund can cost more than the sale brought in</h2>
      <p>Consider a hypothetical EUR 120 order that a provider converts into USD. Assume the sale uses USD 1.10 per euro and a later full refund requires a new conversion at USD 1.14 per euro. All fees are excluded so the currency effect is visible on its own.</p>
      <figure className={s.financialStatement} aria-labelledby="currency-example-caption">
        <figcaption id="currency-example-caption">One hypothetical order. Assumed exchange rates, with fees excluded.</figcaption>
        <dl>
          <div><dt><span>Customer pays</span><span>EUR 120.00</span></dt><dd>The amount and currency charged at checkout.</dd></div>
          <div><dt><span>Sale in USD</span><span>USD 132.00</span></dt><dd>EUR 120 × USD 1.10 per euro, before any deductions.</dd></div>
          <div><dt><span>Refund in USD</span><span>USD 136.80</span></dt><dd>Returning EUR 120 at an assumed USD 1.14 per euro.</dd></div>
          <div className={s.financialTotal}><dt><span>Extra USD</span><span>USD 4.80</span></dt><dd>The currency difference alone. Processing fees, any retained charges and the cost of handling a return are separate.</dd></div>
        </dl>
      </figure>
      <p>The customer’s full refund is still EUR 120 in this example. Your business needs more dollars to fund it because the assumed rate changed. If the rate moved the other way, the conversion could work in your favor. This is a calculation under stated assumptions, not a live exchange quote or a Trolleys conversion policy.</p>
      <p>Shopify’s local-currency refund documentation describes this kind of exposure: the refund returns the original payment currency, while a required conversion uses the current rate. Other providers and products can apply different terms. Check the actual refund rule and fees for your account before using an earlier conversion to forecast the cost.</p>
      <p>A partial refund needs the same discipline. Start with the amount due back in the original charge currency and the remaining refundable balance. Preserve its connection to the original payment. Do not turn a rounded USD sales-report value into the customer’s refund instruction.</p>
      <p>The converted sale amount is not your net bank deposit or your profit. Fees, refunds and other account adjustments may change the payout. Product, delivery and operating costs still have to be covered. Review the final economics by market rather than treating a larger foreign-currency sales total as evidence that the expansion is paying off.</p>
    </section>

    <section id="approved-currency-setup" aria-labelledby="approved-currency-setup-title">
      <h2 id="approved-currency-setup-title">Agree the payment setup before adding the menu</h2>
      <p>Bring a proposed market to your payment team as a concrete customer journey: the countries you plan to serve, the price currency, the methods customers will use and the currency you expect at your bank. Confirm support for the exact account and connection, including refunds. A successful test of one combination does not approve the others.</p>
      <p>Trolleys, an Etail Depot service, connects enabled checkout methods with merchant payment records and <Link href="/services/refunds" prefetch={false}>eligible refunds</Link>. For a Trolleys merchant, the <Link href="/company/legal/merchant-services#approval" prefetch={false}>activation confirmation</Link> identifies approved methods, currencies and territories. Confirm a proposed change with our team before offering it to customers.</p>
      <p>Our current <Link href="/company/legal/payouts-and-reserves#scope" prefetch={false}>funding schedule</Link> covers USD payouts to approved US bank accounts. It does not promise euro balances or foreign-currency bank deposits. Use the <Link href="/services/payouts" prefetch={false}>payout records</Link> to connect the included activity and adjustments with the amount received.</p>
      <p>When you <Link href="/company/contact#payment-review" prefetch={false}>discuss the checkout plan with Trolleys</Link>, include the refund journey as well as the sale. Your team should be able to explain the customer’s original charge and the merchant’s resulting proceeds without treating them as the same amount.</p>
      <p>A customer should not need to understand your currency conversion to trust the price. Your business should understand it well enough to protect the margin and return the right amount when an order comes back.</p>
    </section>
  </BlogArticlePage>;
}
