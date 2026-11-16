import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { ecommerceShippingArticle } from "./ecommerce-shipping-content";
import s from "./blog.module.css";

const costs = [
  ["Packing", "Materials, packing time and any repeated handling.", "Use the same product and order quantity for each trial."],
  ["Transport", "The packed weight, dimensions, destination, service and applicable fees.", "Compare the complete charge for the same delivery commitment."],
  ["Damage", "Damaged orders, replacement goods and the cost of sending them again.", "Record actual outcomes rather than assuming a damage rate."],
  ["Support", "Customer contacts, returns and time spent resolving delivery problems.", "Check whether a cheaper parcel creates more work after dispatch."],
] as const;

export function EcommerceShippingPage() {
  return <BlogArticlePage article={ecommerceShippingArticle}>
    <section id="map-work" aria-labelledby="map-work-title">
      <h2 id="map-work-title">Locate the waiting and rework</h2>
      <p>Follow an order through release, picking, checking, packing, labeling and carrier handoff. Record where it waits and why someone touches it again. Separate address corrections, stock shortages and payment holds from packing time so the team solves the actual delay.</p>
      <p>Group similar work when useful, but protect order identity. Batch picking can reduce walking while increasing the risk of mixing items unless the sorting and checking process is clear. Test a small batch and compare errors as well as speed before increasing its size.</p>
      <p>Set a dispatch cutoff that leaves time for checks and the carrier’s collection schedule. Give every held order an owner and a reason. An order waiting for a stock decision should not disappear into a general packing queue.</p>
      <p>Keep payment and fulfillment states distinct. A successful payment does not show that an item has been packed or dispatched. Our <Link href="/company/blog/ecommerce-payment-processing" prefetch={false}>ecommerce payment processing article</Link> explains the payment side of the order.</p>
    </section>
    <section id="packaging" aria-labelledby="packaging-title">
      <h2 id="packaging-title">Compare the cost of the delivered order</h2>
      <p>A cheaper label is only one part of shipping cost. Compare packaging options using actual packing trials and delivery evidence, including what happens when an item arrives damaged. Keep the product, destination and service commitment comparable.</p>
      <table className={s.comparison}>
        <caption>What to include in a shipping cost comparison</caption>
        <thead><tr><th scope="col">Cost</th><th scope="col">What to record</th><th scope="col">How to compare</th></tr></thead>
        <tbody>{costs.map(([cost, record, comparison]) => <tr key={cost}>
          <th scope="row">{cost}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to record</span>{record}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">How to compare</span>{comparison}</td>
        </tr>)}</tbody>
      </table>
      <p>Measure the parcel after packing. Dimensional weight reflects the space a parcel occupies, so a large box containing a light item can cost more than its scale weight suggests. FedEx’s guidance explains this pricing approach and recommends packaging suited to the item’s size and fragility. Check the rules for the service you actually use.</p>
      <p>Reducing empty space can help, but removing necessary protection can make the delivered order more expensive. Record the packaging used for each trial so you can connect later damage reports to the change. A short trial with no damage is useful evidence, not a guarantee.</p>
    </section>
    <section id="handoff" aria-labelledby="handoff-title">
      <h2 id="handoff-title">Distinguish a label from a handoff</h2>
      <p>Creating a label does not prove the carrier has the parcel. UPS describes “Label Created” as receipt of shipment and billing information. Its status updates after the carrier has the parcel and it is moving through the network. Match your dispatch record to evidence of handoff, such as a pickup receipt or carrier acceptance scan.</p>
      <ul>
        <li><strong>Unpacked order.</strong> Assign a reason and owner before the expected dispatch time passes. Decide what must happen next and when to update the customer.</li>
        <li><strong>Printed but uncollected.</strong> Check the packing area and pickup record. Do not tell the customer the parcel is already moving just because a label exists.</li>
        <li><strong>Carrier exception.</strong> Review the carrier’s update, contact the relevant party and keep the customer’s order record current.</li>
      </ul>
      <p>A gap between scans is not proof that a parcel is lost. UPS notes that long distance shipments may not receive another scan until they reach a destination hub. Check the latest status and expected delivery date before deciding what action is needed.</p>
    </section>
    <section id="improve" aria-labelledby="improve-title">
      <h2 id="improve-title">Improve one constraint at a time</h2>
      <p>Track the share of orders dispatched as planned, picking errors, damage, shipping cost and time spent handling exceptions. Separate the results by product and destination when averages conceal a difficult group. A fragile item may need a different packaging rule from the rest of the catalog.</p>
      <p>Make one operational change and compare similar orders before and after it. Keep a way to return to the previous process if accuracy or damage gets worse. Once dispatch is dependable, use that evidence to set customer expectations. Distinguish the time you need to prepare an order from the carrier’s estimated transit time.</p>
      <p>For US merchandise orders covered by the FTC’s rule, sellers need a reasonable basis for the advertised shipping time, or for shipping within 30 days when none is stated. If you cannot ship as promised, the rule requires the buyer’s consent to a delay or a refund for the unshipped merchandise. An updated tracking message alone does not replace that process.</p>
      <p>A shorter promise should follow a better process, not substitute for one. If you are still preparing your store, include dispatch, delivery and returns in your <Link href="/company/blog/create-an-online-shop" prefetch={false}>online shop setup</Link>.</p>
    </section>
  </BlogArticlePage>;
}
