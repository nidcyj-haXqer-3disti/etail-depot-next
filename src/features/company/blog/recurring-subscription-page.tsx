import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { recurringSubscriptionArticle } from "./recurring-subscription-content";

export function RecurringSubscriptionPage() {
  return <BlogArticlePage article={recurringSubscriptionArticle}>
    <p>A customer can receive a subscription credit for time they have not paid for. Stripe documents this possibility when a customer changes plans while the current invoice is unpaid: its proration calculation assumes the earlier invoice will eventually be paid.</p>
    <p>The calculation can follow the billing rules while the money tells a different story. That is why a subscription business needs more than a schedule that repeats a charge. It needs to know what was promised, what is now owed and what has actually been collected.</p>
    <p>Recurring payments handle repeated collection under an agreed arrangement. Subscription billing determines the charges for continuing access or service as the plan, usage or billing period changes. The two often work together, but they do different jobs.</p>

    <section id="a-subscription-does-not-require-autopay" aria-labelledby="a-subscription-does-not-require-autopay-title">
      <h2 id="a-subscription-does-not-require-autopay-title">A subscription does not have to mean autopay</h2>
      <p>A business can sell an ongoing subscription and send invoices for the customer to pay manually. Stripe supports this separately from automatic collection. The service still has a price, a billing period and renewal terms even when nobody is charging a saved card.</p>
      <p>The reverse matters too. Agreed installments can collect the price of a finite purchase. Repeating those payments does not turn that purchase into an indefinitely renewing service. The collection schedule needs an ending tied to the agreement and the remaining balance.</p>
      <p>When choosing a system, describe the arrangement you sell before asking whether it supports recurring payments. Can customers add seats, change plans or pay for measured usage? Does the price change immediately or at renewal? Those decisions determine what must be calculated before collection starts. Our article on <Link href="/company/blog/billing-models" prefetch={false}>billing models</Link> looks at how those choices affect the customer’s experience.</p>
      <p>Payment permission is another part of the arrangement. Saving a card does not give a business permission for every future charge. Stripe requires consent for the intended later use, with the timing, frequency and amount or calculation basis explained, and subscription cancellation terms included. Keep the required agreement and follow your actual provider’s rules.</p>
    </section>

    <section id="a-plan-change-needs-a-payment-history" aria-labelledby="a-plan-change-needs-a-payment-history-title">
      <h2 id="a-plan-change-needs-a-payment-history-title">A plan change needs a payment history</h2>
      <p>A proportional adjustment for a plan change is commonly called proration. Agree when the change takes effect and how unused time will be treated. The customer should be able to see which service period each charge or credit covers.</p>
      <p>Stripe allows a preview of these adjustments. Its documentation also distinguishes creating a credit from refunding money, and calculating an additional amount from collecting it immediately. Previewing the next bill helps you explain the change without promising that a refund or charge has already happened.</p>
      <p>The unpaid-invoice case deserves particular attention. Before applying an adjustment, check whether the period being credited was paid for. Then resolve the old invoice and the changed plan together. Leaving both available for collection without checking their contents can make the customer pay for overlapping obligations.</p>
      <p>This is also a useful way to evaluate billing software. Ask to see a plan change when everything is paid, then the same change with an outstanding invoice. The important result is whether your team can explain both balances afterward. A polished upgrade screen is only the beginning of that job.</p>
    </section>

    <section id="say-what-actually-ended" aria-labelledby="say-what-actually-ended-title">
      <h2 id="say-what-actually-ended-title">Say what actually ended</h2>
      <p>A failed renewal payment should not be interpreted as a customer’s request to cancel. In Stripe, retry and failure settings affect whether an unpaid subscription remains past due or moves to unpaid or canceled. An active status can also coexist with older unpaid invoices, depending on the configured status rules. Read the relevant invoice and payment records alongside the subscription status.</p>
      <p>Decide how access and communication should behave during that period. A customer may need to update a payment method, complete a payment or resolve a billing question. Tell them which action is needed and what it means for the service. Do not make them infer the outcome from an unexplained account label.</p>
      <p>When the customer does ask to stop something, distinguish ending the service from changing the way they pay. For US consumer bank debits, the CFPB explains that stopping automatic payments does not itself cancel the underlying contract or erase what is owed. That distinction is not permission to keep debiting after authorization has been withdrawn.</p>
      <p>Make the confirmation specific: when service ends, whether renewal and automatic collection have stopped, and whether a valid final balance or credit remains. If the customer only wants to change payment methods, confirm the new arrangement. Our article on <Link href="/company/blog/customer-billing-portals" prefetch={false}>customer billing portals</Link> considers how to make those outcomes visible.</p>
      <p>Customers experience the plan, the bill and the payment as one relationship with your business. Behind the scenes, those records have different jobs. Keeping them in agreement is what makes a subscription feel dependable when something changes.</p>
    </section>
  </BlogArticlePage>;
}
