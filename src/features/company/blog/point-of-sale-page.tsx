import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { pointOfSaleArticle } from "./point-of-sale-content";

export function PointOfSalePage() {
  return <BlogArticlePage article={pointOfSaleArticle}>
    <p>A checkout demonstration usually ends at the satisfying part. The card is accepted, the receipt appears and the next customer can be served. For the business, that sale may still have a long life ahead of it.</p>
    <p>Someone might collect the order tomorrow. Someone else might return part of it next week. A colleague who was not working that day might need to explain the price, locate the payment or decide whether the item belongs back on the shelf. The quality of a point-of-sale system becomes much clearer in those moments.</p>
    <p>A point-of-sale system, or POS, combines sales software with compatible checkout equipment. Depending on the setup, it can bring together products, prices, taxes, payments, receipts, inventory and fulfillment. Its value is in keeping those records connected well enough for the next person to act.</p>
    <p>Square’s Orders API shows that relationship explicitly: an order can contain item details, price adjustments and fulfillment information, with payment activity linked to the sale. An amount collected is only part of the story. It does not, by itself, explain what was promised or whether the customer received it.</p>

    <section id="stock-already-promised" aria-labelledby="stock-already-promised-title">
      <h2 id="stock-already-promised-title">The last item may already belong to an order</h2>
      <p>Picture an item waiting behind the counter for an online customer to collect. It is physically in the store. It is not available for the next person who asks for it. A stock figure that ignores that distinction can invite the business to make the same promise twice.</p>
      <p>Shopify separates inventory on hand from inventory available to sell. Its committed quantity includes units set aside for orders that have not been fulfilled. Damaged goods and other stock held out of sale can also remain on the premises without being available.</p>
      <p>Those distinctions matter when choosing how your POS and website work together. Seeing the same product on both screens is a weak test. Ask the provider to reserve it through the website, retrieve that order at the counter and complete collection. Then inspect what changed. The collection should fulfill the existing order, rather than create a second sale.</p>
      <p>If separate systems handle the website, stock and counter, establish which one controls the quantity available to sell and how the others receive changes. Ask how staff can recognize a delayed update. A connection described as automatic still needs a clear answer when the screens disagree.</p>
      <p>This is also why a sale entered as a generic amount deserves thought. The payment may be correct, but the product detail needed for stock and later returns may be absent. A service business has its own version of the same problem: the record needs to identify which service was paid for and whether anything remains to be delivered.</p>
    </section>

    <section id="refund-and-stock" aria-labelledby="refund-and-stock-title">
      <h2 id="refund-and-stock-title">Returning money does not make an item sellable</h2>
      <p>A damaged item can justify a refund without becoming stock for the next customer. An unopened return might go back into inventory, but at a different location from the original sale. Money and goods need related records, not an assumption that they always move together.</p>
      <p>Shopify POS makes restocking a choice within its return process. Its documentation distinguishes the refund from adding returned items to inventory and explains that restocked goods normally go to the device’s assigned location, with a separate rule for third-party fulfillment. The actual setup matters.</p>
      <p>For your own business, follow a partial return from the original order through the refund and inventory decision. Can a colleague see what was kept, what came back and what money was returned? Can they understand why an item was not put back into available stock? Those are more useful questions than whether the software has a refund button.</p>
      <p>Keep that history attached to the sale. A replacement receipt or an edited note should not leave staff guessing which payment belongs to which order. Clear references also make <Link href="/company/blog/transaction-details-reports" prefetch={false}>payment reconciliation</Link> possible without treating every difference between a sales report and a payment report as missing money.</p>
    </section>

    <section id="the-next-person" aria-labelledby="the-next-person-title">
      <h2 id="the-next-person-title">The next shift should not need your memory</h2>
      <p>A system can hold the right information and still make it difficult for the right person to use it. A cashier may need to find an order but require approval to change a price or issue a refund. Those decisions should survive a change of shift.</p>
      <p>Shopify’s POS permissions illustrate the distinction. Its POS Pro roles can allow, deny or require manager approval for actions such as discounts and returns. Permissions also distinguish managing orders across locations from working only at the current one. These controls are plan dependent, so confirm what is included in the version being quoted.</p>
      <p>Before choosing a system, watch an ordinary staff account handle an exception while the manager is signed out. Then have another person find the resulting record. Include a connection interruption in the demonstration: our article on <Link href="/company/blog/offline-credit-card-processing" prefetch={false}>offline payments</Link> explains why reconnecting a reader is not enough to establish that every payment succeeded.</p>
      <p>A small business does not need every feature a POS supplier can sell. It needs a dependable account of its own work. The useful system is the one that lets someone who missed the sale understand it, finish it or correct it without starting the story again.</p>
    </section>
  </BlogArticlePage>;
}
