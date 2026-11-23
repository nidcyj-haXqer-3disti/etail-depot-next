import { BlogArticlePage } from "./article-page";
import { splitShippingPriceArticle } from "./split-shipping-price-content";

export function SplitShippingPricePage() {
  return <BlogArticlePage article={splitShippingPriceArticle}>
    <p>A shopper adds an item to the basket and the shipping charge doubles. Both products come from the same storefront. Nothing on the page explains why buying more changed the delivery cost so sharply.</p>
    <p>Inside the business, the explanation may be obvious: different warehouses, a supplier shipment or a product that needs special handling. None of those arrangements is visible to the buyer.</p>
    <p>The rate calculation answers what the store will charge. It does not explain what the buyer receives for that charge. That missing connection is what makes a correct total look arbitrary.</p>

    <section id="what-the-charge-covers" aria-labelledby="what-the-charge-covers-title">
      <h2 id="what-the-charge-covers-title">Explain the purchase the customer is actually making.</h2>
    <p>The buyer needs to know which items arrive together, which may arrive separately and what the selected delivery service covers. They do not need the names of warehouse groups or the internal rule that produced the rate.</p>
    <p>Do not assume that more parcels always mean more customer fees. Shopify’s shipping-profile documentation, for example, describes cases where rates combine and cases where a flat rate remains single across locations within the same group. The outcome depends on the setup. Other platforms and shipping arrangements have their own rules.</p>
    <p>This distinction matters when writing checkout copy. “Shipping for two deliveries” is useful only when that is the actual arrangement. “Additional warehouse charge” may expose an internal term without explaining any customer benefit or choice.</p>
    <p>A combined total can coexist with shipment detail. Show the items and delivery expectation for each group, then make the order-level shipping total clear. If the customer can choose services independently for each shipment, keep each choice associated with the right items. If only one combined option is available, do not imply that its fastest component applies to the whole basket.</p>
    </section>

    <section id="a-choice-must-mean-something" aria-labelledby="a-choice-must-mean-something-title">
      <h2 id="a-choice-must-mean-something-title">An upgrade should identify what arrives sooner.</h2>
    <p>Imagine an order containing an in-stock item and a made-to-order item. Faster transit for the first does not shorten production for the second. A label such as “Express” can become misleading if it appears to describe the entire order without those distinctions.</p>
    <p>If the made-to-order item is the reason for the purchase, paying to accelerate the other parcel may offer little value to that buyer. Separate preparation from transit so the customer can judge the upgrade on the item that matters to them. Where operations can reliably offer a choice between sending available items sooner and waiting to send together, explain the price and timing of each.</p>
    <p>Changes to the basket need a fresh explanation too. Removing the last item from one shipment may remove a charge. Adding a product may introduce another delivery group or change a threshold. Show the revised total before payment, without leaving an old free-shipping message elsewhere in the checkout.</p>
    <p>The customer bought from one store, even if fulfillment involves several places. The store owes them one coherent explanation: these items will arrive together, those will follow, and this is the total delivery price. Understanding the purchase should not require understanding the warehouse arrangement behind it.</p>
    </section>
  </BlogArticlePage>;
}
