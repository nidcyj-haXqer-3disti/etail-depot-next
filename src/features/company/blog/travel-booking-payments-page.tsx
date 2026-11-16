import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { travelBookingPaymentsArticle } from "./travel-booking-payments-content";

export function TravelBookingPaymentsPage() {
  return <BlogArticlePage article={travelBookingPaymentsArticle}>
    <p>Imagine a customer booking the last room for a long weekend. The card payment takes longer than expected, the browser closes and the room returns to availability. A few minutes later, the payment is confirmed. Another guest has already booked the room.</p>
    <p>Your payment report can be correct while your customer has a problem. They have paid for a stay you can no longer provide. A receipt alone cannot resolve that conversation.</p>
    <p>International travel payments bring that gap into focus. The booking may be made months before arrival, in a currency the customer does not normally use, with a deposit now and a balance later. The business needs to keep each payment connected to what it has promised to deliver.</p>
    <p>That promise also matters when arranging merchant services. Trolleys, an Etail Depot service, requires <Link href="/company/legal/acceptable-use#review" prefetch={false}>specific written approval for travel activities</Link>, including agencies, booking platforms, tours and travel sold before delivery. An existing account does not automatically cover those activities or collecting money for other suppliers. Explain the model before taking payments.</p>

    <section id="confirm-the-booking" aria-labelledby="confirm-the-booking-title">
      <h2 id="confirm-the-booking-title">What exactly did the deposit secure?</h2>
      <p>The customer should be able to answer that from the confirmation. Did the deposit secure a specific room, a place on a confirmed departure or a reservation still waiting for a supplier? Name the seller, the service, the travel dates and the booking reference. Make any remaining condition visible before payment.</p>
      <p>Then make sure the booking system follows the same promise. Decide how long inventory can be held while a payment is unresolved and what happens if the result arrives after that hold ends. A pending payment should not quietly become a confirmed reservation, and an expired room hold should not make a successful payment disappear from the work that needs attention.</p>
      <p>In the last-room scenario, someone needs to review the original payment and availability, contact the customer and arrange a suitable resolution. That might mean an agreed alternative or returning the money. It should not mean asking the customer to pay again simply because the booking screen looks empty.</p>
      <p>For everyday operations, keep the booking reference beside the payment reference. Customer service should be able to see the reservation status, amount collected and amount still due without asking the traveler to forward a card statement. A customer calling about a hotel change is already dealing with enough uncertainty.</p>
    </section>

    <section id="keep-the-balance-clear" aria-labelledby="keep-the-balance-clear-title">
      <h2 id="keep-the-balance-clear-title">The balance should be easy to explain</h2>
      <p>Consider a hypothetical EUR 600 booking with EUR 200 collected as a deposit and EUR 400 due later. If an agreed change reduces the booking price by EUR 50, the revised total is EUR 550 and the outstanding balance is EUR 350. The change belongs in the booking record and the next payment request.</p>
      <p>That is a price adjustment. Currency conversion is a separate calculation. A customer whose card account uses dollars may see different dollar equivalents for the deposit and balance, even when both charges are correctly made in euros. The charge currency, the card account currency and the merchant’s settlement currency can differ.</p>
      <p>Show the amount and currency actually being charged. If you also show an estimated home-currency equivalent, label it clearly and explain that the customer’s issuer may apply its own conversion and fees. The euro figures here illustrate booking arithmetic; they are not a statement of the currencies available on a particular Trolleys account.</p>
      <p>Explain when the remaining balance is due and how it will be collected. A deposit does not, by itself, give the business permission to charge any later amount. If a later card charge is planned, confirm the customer agreement and the supported payment arrangement before promising automatic collection.</p>
      <p>Do not assume an authorization obtained at booking will remain usable until the trip. Cybersource documents reauthorization for situations where an authorization expires before fulfillment. Your payment team needs to confirm the appropriate process for your processor, account and transaction. An authorization is also different from a deposit that has actually been collected.</p>
      <p>When dates, guests or services change, send a revised confirmation that keeps the same booking history. State the new total, payments already received, any refund due and the remaining balance. That gives both the traveler and your accounts team one version of the agreement to work from.</p>
    </section>

    <section id="handle-the-cancellation" aria-labelledby="handle-the-cancellation-title">
      <h2 id="handle-the-cancellation-title">The cancellation is part of the sale</h2>
      <p>A travel business can pay a supplier long before the customer arrives. If a cancellation later requires a refund, the fact that the deposit has already been spent does not settle what the customer is owed. Plan how refunds will be funded, and identify who is responsible for handling them before the first booking.</p>
      <p>Cancellation terms need to fit the actual service and applicable customer rights. Airfare provides a specific example: the US Department of Transportation says a ticket agent acting as merchant of record is responsible for proper airfare refunds when an airline cancels or significantly changes a flight to, from or within the United States and a refund is due. The seller shown on the payment record matters. That rule should not be generalized to every hotel or tour cancellation.</p>
      <p>When returning money, connect the refund to the original payment and the agreed booking adjustment. Confirm the amount, currency and current refund status before telling the customer it is complete. If the status is unclear, check the existing request before submitting another one.</p>
      <p>For approved merchants, Trolleys <Link href="/services/refunds" prefetch={false}>refund services</Link> help teams follow eligible full or partial refunds against the original transaction. <Link href="/services/reconciliation" prefetch={false}>Reconciliation</Link> helps connect payment activity in the merchant account with gateway records. Your booking record supplies the other essential part: why the amount was collected, changed or returned.</p>
      <p>If you are planning a travel offering, <Link href="/company/contact#payment-review" prefetch={false}>discuss the payment model with our team</Link>. Bring the time between payment and travel, the supplier arrangements and the cancellation terms. Those details are more useful than a checkout screenshot when deciding whether the service can support your business.</p>
      <p>The traveler should finish each conversation knowing what is booked, what has been paid and what happens next. When those answers remain consistent from the first deposit through the final change, the payment experience becomes part of the reason to book with you again.</p>
    </section>
  </BlogArticlePage>;
}
