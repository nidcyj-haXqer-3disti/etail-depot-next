import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { deliveryPromiseArticle } from "./delivery-promise-content";
import s from "./blog.module.css";

const timeline = [
  ["Order cutoff", "Friday, 2 p.m. Eastern Time", "The deadline for that day’s dispatch schedule."],
  ["Order received", "Friday, 4 p.m. Eastern Time", "The order misses the cutoff. This warehouse has no weekend dispatch."],
  ["Expected dispatch", "Monday", "The order is ready for the scheduled carrier handoff."],
  ["Estimated arrival", "Wednesday to Thursday", "Two to three business days after Monday handoff, under the stated assumptions."],
] as const;

export function DeliveryPromisePage() {
  return <BlogArticlePage article={deliveryPromiseArticle}>
    <section id="inputs" aria-labelledby="inputs-title">
      <h2 id="inputs-title">Build the estimate from operational facts</h2>
      <p>Start with the time needed to release, pick and pack an order. Then add the selected carrier service’s transit estimate for the destination. Account for pickup days, weekends, holidays and the order cutoff, including its time zone.</p>
      <p>Use the stock and service you can actually provide. An item made to order or waiting for replenishment needs its own lead time. A carrier’s general transit range does not include every warehouse delay or apply to every destination.</p>
      <p>Check how your store calculates the displayed date. Shopify’s manual delivery dates, for instance, combine fulfillment time and transit time using documented calendar and cutoff rules. Your warehouse schedule and the checkout configuration need to agree. Do not assume a shipping rate’s transit label already includes preparation.</p>
      <p>Review recent dispatch and delivery records before shortening the promise. Our <Link href="/company/blog/ecommerce-shipping-efficiency" prefetch={false}>ecommerce shipping efficiency article</Link> explains how to separate preparation, carrier handoff and delivery performance.</p>
    </section>
    <section id="calendar" aria-labelledby="calendar-title">
      <h2 id="calendar-title">Turn the calculation into a clear statement</h2>
      <p>Consider an in stock order at a warehouse that closes its Friday dispatch schedule at 2 p.m. Eastern Time. Assume it can prepare the late order for Monday pickup, and the selected service takes two to three business days after that handoff. There are no holidays or other delays in this calculation.</p>
      <figure className={s.editorialDelivery} aria-labelledby="delivery-calendar-caption">
        <figcaption id="delivery-calendar-caption">From a Friday order to its estimated arrival</figcaption>
        <ol className={s.editorialCalendar} role="list">
          {timeline.map(([stage, timing, meaning]) => <li key={stage}>
            <p className={s.editorialCalendarDate}>{timing}</p>
            <div><h3>{stage}</h3><p>{meaning}</p></div>
          </li>)}
        </ol>
      </figure>
      <p className={s.editorialDeliveryPromise}>A clear customer statement is: <strong>Expected dispatch Monday. Estimated delivery Wednesday to Thursday.</strong></p>
      <p>Calling this only “two day delivery” would hide both the wait for dispatch and the arrival range. On an actual order, show the calendar dates so a customer reading the confirmation later knows which week you mean.</p>
      <p>Recalculate when the destination, stock position or service changes. If a Monday holiday moves the carrier handoff, the same Wednesday to Thursday window cannot simply be carried forward. Use the service calendar and a supported revised estimate.</p>
    </section>
    <section id="mixed-order" aria-labelledby="mixed-order-title">
      <h2 id="mixed-order-title">Explain conditions before payment</h2>
      <ul>
        <li><strong>Several items.</strong> Say whether everything ships together or arrives in separate parcels. Show which item determines the later date.</li>
        <li><strong>Destination.</strong> Update the estimate when the customer enters the relevant destination details. Explain any excluded areas before they pay.</li>
        <li><strong>Service choice.</strong> Show what an upgrade changes: transit time, preparation priority or both. Faster transit alone does not remove a stock delay.</li>
        <li><strong>Estimate or guarantee.</strong> Describe uncertain arrival timing as an estimate. If you offer a guarantee, state its actual conditions and what the customer receives if it is missed.</li>
      </ul>
      <p>Use consistent wording across the product page, cart, checkout and confirmation. If the customer’s choices change the date, make the revised date clear before payment. The <Link href="/company/blog/create-an-online-shop" prefetch={false}>online shop setup article</Link> includes checking the full purchase journey.</p>
      <p>Save the delivery wording with the order so support can see what the customer was told. Changing today’s estimate must not overwrite what you promised on an earlier order.</p>
    </section>
    <section id="delays" aria-labelledby="delays-title">
      <h2 id="delays-title">Respond when an order is delayed</h2>
      <p>Assign someone to review orders at risk before the expected dispatch time. Tell the customer what changed, give a revised date only when you can support it, and explain their available choices. If the parcel has already left, use the carrier’s latest information to update the arrival estimate.</p>
      <p>For US merchandise sales covered by the FTC’s Mail, Internet, or Telephone Order Merchandise Rule, sellers need a reasonable basis for stated or implied shipment timing. If you cannot ship on time, the rule requires a timely delay option notice and appropriate consent to wait, or cancellation and a prompt refund for unshipped merchandise. A changed tracking estimate alone does not meet those requirements.</p>
      <p>The FTC guidance addresses shipment obligations, not a universal rule for when every parcel must arrive. Its notice, consent and refund requirements depend on the circumstances; follow the full guidance linked in Sources when handling a covered delay.</p>
      <p>Keep the original promise, later updates and customer response with the order. Review repeated misses by cause, such as unavailable stock, packing delays or missed pickup, then improve the process and the wording used for future orders.</p>
    </section>
  </BlogArticlePage>;
}
