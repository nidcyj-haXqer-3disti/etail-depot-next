import { BlogArticlePage } from "./article-page";
import { pickupWalletArticle } from "./pickup-wallet-content";

export function PickupWalletPage() {
  return <BlogArticlePage article={pickupWalletArticle}>
    <p>The customer chooses pickup because they will be near the store this afternoon. Then the wallet opens and shows their home address. Have they changed to delivery? Is that the billing address? Which location will prepare the order?</p>
    <p>The business may have mapped the fields correctly behind the scenes. That does not help a customer who cannot tell where their purchase will be waiting.</p>
    <p>The saved address may describe billing details or where the customer usually receives deliveries. The selected store answers what they want for this purchase. One cannot stand in for the other simply because the wallet supplies it more conveniently.</p>

    <section id="choose-the-store" aria-labelledby="choose-the-store-title">
      <h2 id="choose-the-store-title">The location comes before the payment.</h2>
    <p>Apple’s payment guidance puts the pickup choice before the payment sheet and calls for the selected location’s address to appear there. Other wallets have their own supported flows. The merchant’s obligation to make the destination clear survives those differences.</p>
    <p>On the merchant’s page, identify the location in terms a customer can use: store name, address and the relevant availability. A location code that helps staff allocate inventory is not a useful destination for the buyer.</p>
    <p>Availability belongs to the whole order. A store with one of the two items is not necessarily a pickup location for both. From the customer’s perspective, the question is whether the trip will accomplish the purchase they planned. Separate collection arrangements may be acceptable, but the customer needs to choose them before paying, rather than discover the second trip at the counter.</p>
    <p>Saved contact information serves a different purpose. A customer’s home or billing address must not silently replace the selected pickup location. Equally, the store’s address should not become the customer’s billing address merely because it is the destination displayed for collection. The web team should preserve those distinct meanings through the payment and order records.</p>
    </section>

    <section id="ready-when" aria-labelledby="ready-when-title">
      <h2 id="ready-when-title">Payment complete does not mean ready for collection.</h2>
    <p>A purchase confirmation and a ready-for-pickup message describe different stages. Tell the customer whether to wait for confirmation that the order is ready, or whether the business supports a specific collection window. Do not let a successful payment screen imply that staff have already found and prepared the items.</p>
    <p>A collection window is another commitment that needs a place attached to it. For someone buying while traveling, “4 pm” is incomplete if the page leaves the time zone unclear. The store’s date, time and availability have to agree across the selection and confirmation.</p>
    <p>Apple allows supported pickup timing to be represented in the payment sheet. The merchant still needs an operational process that can honor the chosen arrangement. The wallet does not reserve stock, staff a counter or decide when an order is ready.</p>
    </section>

    <section id="one-instruction" aria-labelledby="one-instruction-title">
      <h2 id="one-instruction-title">Give the buyer and the store the same instruction.</h2>
    <p>The final order should identify the selected location, what was purchased and the actual next step. Staff should see the same fulfillment choice the customer confirmed. A payment reference attached to the wrong store does not resolve the pickup obligation.</p>
    <p>A location change is not a harmless substitution. Another branch may have stock and still be useless to someone collecting on the way to work. Returning from the wallet should retain the chosen location or ask for clear reconfirmation. If stock has changed, another store can be offered as an option, not silently assigned as the solution.</p>
    <p>For a business with several DBAs or merchant accounts, confirm the correct account association as well as the customer-facing collection point. A pickup location is not automatically a separate merchant account.</p>
    <p>The last confirmation should give the customer a destination and a reason to leave home, or tell them to wait. A payment receipt on its own does neither.</p>
    </section>
  </BlogArticlePage>;
}
