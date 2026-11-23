import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { fulfillmentStoryArticle } from "./fulfillment-story-content";

export function FulfillmentStoryPage() {
  return <BlogArticlePage article={fulfillmentStoryArticle}>
    <p>The customer pays and receives a receipt. Inside the business, the work may only be starting.</p>
    <p>Someone has to obtain stock, approve a design, book an installer or give the customer access. A payment application that says online sales can leave all of that invisible.</p>
    <p>The most useful explanation of fulfillment follows an ordinary order past the moment that looks successful on the dashboard. It shows what has to happen before the customer has received what they paid for.</p>

    <section id="follow-one-order" aria-labelledby="follow-one-order-title">
      <h2 id="follow-one-order-title">Follow one ordinary order all the way through.</h2>
    <p>A paid order is a promise with work attached. For stocked retail, that may mean allocating an item and dispatching it. For a custom order, payment may only put the job into a production queue. Those businesses can show the same successful charge while carrying very different unfinished obligations.</p>
    <p>Use actual intervals from the operation where they exist. Keep estimates identifiable as estimates. If different products have different delivery arrangements, explain the relevant differences rather than presenting the fastest item as typical of everything you sell.</p>
    <p>The records should connect. An order number can link the purchase to a work order or shipment, while the payment reference connects it to the amount collected. The reviewer does not need a tour of every piece of software to understand those relationships.</p>
    </section>

    <section id="the-point-of-dependence" aria-labelledby="the-point-of-dependence-title">
      <h2 id="the-point-of-dependence-title">Name the part you cannot complete on your own.</h2>
    <p>The customer sees one order. Inside the business, its completion may depend on a supplier releasing stock, a customer approving a proof or a subcontractor attending the site. The weak point is the handoff: passing work to another party can feel like completing it, even though the customer is still waiting.</p>
    <p>Explain who confirms each handoff and how the merchant learns about a failure. A label printed at a warehouse and a parcel collected by a carrier are different events. A contractor assigned to a job and a completed installation are different events. Use language that describes the event you can actually support.</p>
    <p>For Trolleys merchants, the seller remains responsible for fulfillment and customer support under the account terms. Outsourcing a task changes the delivery arrangement; it does not make the customer’s purchase disappear from the merchant’s responsibilities.</p>
    </section>

    <section id="the-exception" aria-labelledby="the-exception-title">
      <h2 id="the-exception-title">Include the order that does not go to plan.</h2>
    <p>A credible explanation includes what happens when stock is unavailable, approval takes longer or the customer cannot receive the service. Who contacts the buyer? What choice do they receive? Who can arrange a refund where one is owed?</p>
    <p>A missed handoff needs an owner as much as an ordinary order does. If the supplier reports a delay to purchasing but customer support still sees the original dispatch date, both teams can give accurate accounts of their own work while the buyer receives an inaccurate promise. Explain how that information reaches the person who can act.</p>
    <p>Trolleys’ <Link href="/resources/merchant-account-setup" prefetch={false}>account setup process</Link> uses the merchant’s sales and delivery information. A material fulfillment change needs to be raised before the business relies on its earlier approval. The description has to keep pace with the operation.</p>
    <p>A good fulfillment explanation is useful beyond underwriting. A colleague should be able to read it and understand what remains to be done for a paid order. If nobody inside the company can answer that, the application has uncovered a business question worth solving.</p>
    </section>
  </BlogArticlePage>;
}
