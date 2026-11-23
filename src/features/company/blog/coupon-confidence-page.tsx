import { BlogArticlePage } from "./article-page";
import { couponConfidenceArticle } from "./coupon-confidence-content";

export function CouponConfidencePage() {
  return <BlogArticlePage article={couponConfidenceArticle}>
    <p>A shopper is ready to pay until a large empty coupon box introduces a new possibility: perhaps everyone else knows how to buy this for less.</p>
    <p>The merchant meant to provide a convenience. The customer may read it as unfinished research. Baymard’s checkout testing has observed participants pausing or leaving to search for codes after encountering the field.</p>
    <p>That does not mean hiding a promised offer. It means treating the coupon control as part of the price conversation, rather than an innocent piece of form furniture.</p>

    <section id="prominence" aria-labelledby="prominence-title">
      <h2 id="prominence-title">Make the real offer clearer than the possibility of another one.</h2>
    <p>If a campaign tells customers to use a code, they should be able to find where it goes. If most customers have no code, a discoverable “Add a promo code” control may be less distracting than a dominant empty box. Test the actual audience and offer; there is no universal conversion gain attached to collapsing a field.</p>
    <p>Automatic savings should be visible where customers judge the price. Show the applicable reduction and the resulting amount. Do not invite the shopper to enter a code to receive a benefit already applied, or leave them wondering whether an advertised offer has been forgotten.</p>
    <p>When a code cannot be used, explain the relevant condition. A message about an excluded product is more useful than “Invalid code” when the code itself exists. If offers cannot combine, say which offer remains and let the customer understand the result. Do not claim the system selected the best possible deal unless it actually compares the applicable choices.</p>
    </section>

    <section id="threshold-example" aria-labelledby="threshold-example-title">
      <h2 id="threshold-example-title">A smaller merchandise subtotal can produce a larger payment.</h2>
    <p>Consider an illustrative store with an $80 merchandise basket. Its free-shipping threshold is $75 after product discounts. Shipping below that threshold costs $10. Tax is excluded from this example.</p>
    <p>With no code, the customer pays $80 and shipping is free. A 10% product discount takes $8 off the merchandise, leaving $72. That falls below the assumed threshold, so $10 shipping applies. The new total is $82. The product is cheaper; the order is $2 more expensive.</p>
    <p>This is not a universal checkout rule. Shopify’s shipping troubleshooting documentation says its price-based rates use the cart value after discounts and before tax. A merchant must confirm the calculation used by its own platform and configuration.</p>
    <p>The interface should make this consequence visible when the code is applied. Show the merchandise saving, the changed delivery charge and the payable total together. Allow the customer to remove the code where supported and see the recalculated result. A green “Discount applied” message alone describes only the favorable part.</p>
    <p>In this example, the promotion and shipping rule pull in opposite directions. One rewards the customer for applying the code; the other charges them for the smaller subtotal it creates. Each rule can be working exactly as configured while their combined offer defeats the reason for using a coupon. The merchant should decide whether that is the offer it wants, rather than leaving support to defend the arithmetic.</p>
    </section>

    <section id="one-agreed-total" aria-labelledby="one-agreed-total-title">
      <h2 id="one-agreed-total-title">The amount sent for payment must match the final order.</h2>
    <p>Discounts can interact with quantity changes, delivery choices and eligibility. Recalculate before the customer commits, and keep the order summary, payment request and confirmation consistent. A payment connection cannot repair a contradictory offer.</p>
    <p>The customer in the example would pay less by removing the successful code. That is the fact a green “Discount applied” message alone conceals. A useful checkout lets the buyer understand the whole offer, and a useful promotion gives the merchant a reason to stand behind that offer once shipping is included.</p>
    </section>
  </BlogArticlePage>;
}
