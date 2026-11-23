import { BlogArticlePage } from "./article-page";
import { bookingDateChangeArticle } from "./booking-date-change-content";

export function BookingDateChangePage() {
  return <BlogArticlePage article={bookingDateChangeArticle}>
    <p>Imagine a customer paying in advance for a Saturday workshop. The organizer moves it to the following weekend. The booking system still says confirmed, and the payment is still successful.</p>
    <p>The customer cannot attend the new date.</p>
    <p>This is a change to the purchase, even if the service is otherwise identical. A merchant review needs to understand how the business handles that change, along with how far in advance it collects money.</p>

    <section id="what-was-reserved" aria-labelledby="what-was-reserved-title">
      <h2 id="what-was-reserved-title">Explain what the payment secures.</h2>
    <p>Does the customer buy a place at a fixed event, reserve an appointment or pay toward a service whose date is agreed later? Describe the actual commitment and any condition that remains unresolved when payment is collected.</p>
    <p>State when the service will be provided, what happens if the organizer changes it and how the customer receives the relevant terms before paying. A broad word such as booking can cover very different obligations.</p>
    <p>Keep the booking reference connected to the payment and customer communication. If the date changes, retain the original promise and the proposed replacement. A record overwritten with the new date loses the history needed to understand the customer’s response.</p>
    </section>

    <section id="agreement-to-change" aria-labelledby="agreement-to-change-title">
      <h2 id="agreement-to-change-title">Give the customer a usable way to respond.</h2>
    <p>A message announcing a new date does not by itself establish acceptance. Explain the options available under the agreement and applicable customer rights, and record the choice through the supported process.</p>
    <p>Where a refund is owed, money already spent on a venue or instructor does not determine the customer’s remedy. Plan how the business would meet those obligations if a whole session were affected. Do not make the customer responsible for the merchant’s supplier dispute.</p>
    <p>If the buyer chooses a replacement date or a credit, keep that agreement clear. Do not record silence as acceptance unless the applicable arrangement and rules actually permit it. The operational record should reflect what the customer chose.</p>
    </section>

    <section id="describe-the-exposure" aria-labelledby="describe-the-exposure-title">
      <h2 id="describe-the-exposure-title">Bring the calendar into the payment application.</h2>
    <p>For Trolleys, explain the advance collection period, the number of bookings the business may hold and the circumstances in which dates change. Substantial advances, extended delivery and relevant restricted activities require the applicable written approval.</p>
    <p>Confirm the payment arrangement rather than assuming an authorization will remain available until a distant service date. Collected deposits, later balances and uncollected authorizations are different payment states.</p>
    <p>The customer’s options after a date change depend on the service agreement, applicable law and account terms. Explain those options before the business accepts advance bookings.</p>
    <p>After a date change, the booking record should tell staff which replacement the customer accepted or which remedy is still owed. A successful payment status cannot answer that question.</p>
    </section>
  </BlogArticlePage>;
}
