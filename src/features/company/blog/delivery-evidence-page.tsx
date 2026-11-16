import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { deliveryEvidenceArticle } from "./delivery-evidence-content";
import s from "./blog.module.css";

const deliveryRecords = [
  ["Order confirmation", "What the customer bought, its price and the delivery promise.", "It does not show what was packed or received."],
  ["Packing and shipment records", "Which items went into the parcel associated with that tracking number.", "Creating a label does not establish delivery."],
  ["Carrier delivery record", "Where and when the parcel was recorded as delivered, with any available recipient details.", "It still needs to match the parcel and items being disputed."],
] as const;

export function DeliveryEvidencePage() {
  return <BlogArticlePage article={deliveryEvidenceArticle}>
    <p>The customer says the order never arrived. Someone on your team opens the tracking page, sees “Delivered” and prepares to send a screenshot. It feels like the answer is already there.</p>
    <p>Sometimes it is the beginning of the answer. Sometimes it is a record for the wrong parcel.</p>
    <p>A goods-not-received chargeback challenges whether the customer received the purchase. Payment approval establishes neither packing nor delivery. Before defending the sale, find out exactly what is missing.</p>

    <section id="one-order-two-parcels" aria-labelledby="one-order-two-parcels-title">
      <h2 id="one-order-two-parcels-title">One order can contain two different stories</h2>
      <p>Imagine a customer buys a lamp for $90 and a shade for $30. The store charges $120. The lamp ships immediately; the shade is delayed. A week later, the lamp has arrived and the shade still has not left the warehouse.</p>
      <p>If the customer disputes the missing $30 shade, the lamp’s tracking number does not show that the shade arrived. Sending it as proof of the complete order would leave the actual complaint unanswered.</p>
      <p>If the customer disputes the entire $120, the same records matter differently. They can establish which part of the purchase was delivered and how its value relates to the disputed amount. Stripe’s published evidence guidance expressly recognizes split shipments and claims exceeding the value of the goods not received. The applicable case requirements still govern the response.</p>
      <p>The distinction is worth making before anyone writes a defense. Read the customer’s claim alongside the amount, item list and shipment history. “Order delivered” in your store software may mean the first parcel was delivered. It may not describe every line on the receipt.</p>
      <p>Check the original delivery promise too. An agreed future delivery date is different from a missed date. A later update in your shipping system is not evidence that the customer accepted a new promise. Preserve what was communicated and any agreement to a change.</p>
      <p>This is also a customer-service opportunity before a dispute exists. A clear message explaining which item is delayed is more useful than another automated “your order has shipped” email. Our article on <Link href="/company/blog/write-delivery-promise" prefetch={false}>delivery promises</Link> looks at what customers need to know before they pay.</p>
    </section>

    <section id="connect-the-records" aria-labelledby="connect-the-records-title">
      <h2 id="connect-the-records-title">Connect the receipt to the parcel</h2>
      <p>The useful evidence is the connection between records. A receipt describes the purchase. A packing record associates its items with a shipment. The carrier record describes what happened to that shipment. None should be asked to prove more than it contains.</p>
      <table className={s.comparison}>
        <caption>What each record contributes to the delivery story</caption>
        <thead><tr><th scope="col">Record</th><th scope="col">What it can show</th><th scope="col">What remains to check</th></tr></thead>
        <tbody>{deliveryRecords.map(([record, shows, check]) => <tr key={record}>
          <th scope="row">{record}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it can show</span>{shows}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What remains to check</span>{check}</td>
        </tr>)}</tbody>
      </table>
      <p>A signature deserves the same care. FedEx distinguishes direct signatures at the delivery address from indirect signatures that may come from a neighbor or building manager. A signature can help explain the handoff without necessarily proving that the named buyer personally accepted the parcel. Check the service used and the actual delivery record.</p>
      <p>Obtain the available proof of delivery rather than relying on a cropped status message. FedEx makes proof of delivery, including a signature image when available, accessible through its tracking service. Keep the address and shipment reference needed to connect that record to the order, and investigate inconsistencies before treating them as resolved.</p>
      <p>A missing parcel also does not establish that the customer is dishonest. A wrong address, split shipment or incomplete packing record can create a genuine gap. Describe what the records establish and what remains uncertain. Accusing the buyer adds no delivery evidence.</p>
      <p>Make the response readable without access to your systems. Include the relevant documents in the accepted format, with a short explanation linking them. Do not assume the reviewer can sign in to your warehouse portal or follow a tracking link later. Keep the originals, and avoid editing away dates or details that change the meaning.</p>
    </section>

    <section id="respond-to-the-right-case" aria-labelledby="respond-to-the-right-case-title">
      <h2 id="respond-to-the-right-case-title">Give your payment team the case, not just the screenshot</h2>
      <p>Trolleys, an Etail Depot service, helps merchants <Link href="/services/disputes" prefetch={false}>manage disputes through the claim, deadline and supporting records</Link>. For a delivery dispute, bring the affected merchant account, original payment reference, disputed amount and the item or parcel in question together. The payment record and fulfillment record need to describe the same sale.</p>
      <p>That matters for businesses with several DBAs or locations. The company may have one support inbox, while the disputed payment belongs to a particular merchant account. Identify that account before sending documents or requesting help. A correct tracking number attached to the wrong case is still the wrong response.</p>
      <p>Follow the deadline and submission instructions in the actual notice. Visa directs merchants to their acquirer or processor for case-specific rules. If a delivery detail is missing, <Link href="/company/contact" prefetch={false}>contact our team</Link> promptly and share records through the requested secure channel. Do not wait for a carrier investigation to finish without checking the response deadline.</p>
      <p>If the records show that the disputed item was never sent, say so. Accepting a valid claim may be more appropriate than defending it with unrelated delivery evidence. If you have already refunded the purchase, preserve the amount, date and reference. For a payment already under dispute, follow the case instructions before issuing another <Link href="/services/refunds" prefetch={false}>refund</Link>; returning money does not automatically close the case.</p>
      <p>Keep the submission confirmation and follow the case through its outcome and any account adjustment. Our team can help with the account process, but neither a delivery scan nor a well-prepared response guarantees the decision.</p>
    </section>

    <p>In the lamp order, the strongest answer starts with acknowledging the shade. That is the habit worth keeping: know which part of the sale you can prove, explain it clearly and take responsibility for the part you cannot.</p>
  </BlogArticlePage>;
}
