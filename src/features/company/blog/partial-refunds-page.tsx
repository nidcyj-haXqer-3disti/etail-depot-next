import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { partialRefundsArticle } from "./partial-refunds-content";
import s from "./blog.module.css";

const returnAmounts = [
  ["Original payment", "$120", "Three items after the discount."],
  ["Completed partial refund", "$40", "The amount paid for the returned item."],
  ["Remaining purchase", "$80", "The two items the customer kept, before considering merchant processing costs."],
] as const;

export function PartialRefundsPage() {
  return <BlogArticlePage article={partialRefundsArticle}>
    <p>A customer buys three items and wants to return one. The other two are exactly what they wanted. There is still a good sale here, provided the return does not turn into an argument about the amount.</p>
    <p>A partial refund returns less than the original payment. It might cover a returned item, an agreed price adjustment or a part of a service that was not delivered. The customer should be able to understand what changed without doing the merchant’s accounting.</p>
    <p>That sounds simple until the order includes a promotion, a colleague has already promised a credit, or the refund screen closes before showing a result. These are the moments when a small adjustment can consume more attention than the original purchase.</p>

    <section id="refund-the-price-paid" aria-labelledby="refund-the-price-paid-title">
      <h2 id="refund-the-price-paid-title">Start with what the customer actually paid</h2>
      <p>Consider a hypothetical order with three items priced at $50 each and a 20% discount applied equally to every item. The merchandise total falls from $150 to $120. If one item is returned for its full discounted price, the merchandise refund is $40, not the $50 on its original price tag.</p>
      <p>This illustration leaves out tax and delivery charges to isolate the discount. Once the $40 refund completes, the merchandise amounts look like this:</p>
      <table className={s.comparison}>
        <caption>One returned item in a discounted order</caption>
        <thead><tr><th scope="col">Record</th><th scope="col">Amount</th><th scope="col">What it means</th></tr></thead>
        <tbody>{returnAmounts.map(([record, amount, meaning]) => <tr key={record}>
          <th scope="row">{record}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">Amount</span>{amount}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it means</span>{meaning}</td>
        </tr>)}</tbody>
      </table>
      <p>The arithmetic is easy to explain because the original discount is visible. It becomes harder when support sees only a product price while finance sees the discounted payment. Keep the original order breakdown available to the person handling the return.</p>
      <p>Real promotions are not always evenly allocated. Bundles, free items and order-level offers need their own treatment under the purchase terms and applicable law. Resolve tax, delivery and other adjustments with the appropriate accounting guidance. A payment gateway can accept an amount without deciding whether it is the correct customer remedy.</p>
      <p>If the business offers a goodwill adjustment instead, record what was agreed. A customer keeping a damaged item for a reduced price is a different arrangement from returning it. Make that distinction clear before sending money back, and do not use a partial offer to replace a full remedy the customer is entitled to.</p>
    </section>

    <section id="recognize-the-same-request" aria-labelledby="recognize-the-same-request-title">
      <h2 id="recognize-the-same-request-title">Two helpful colleagues can refund the same item twice</h2>
      <p>Now consider the moment before that $40 refund completes. One colleague has submitted it. The customer calls again, and a second colleague sees that the original payment was $120. Another $40 might still fit within the payment’s overall limit. It would nevertheless refund the same return twice.</p>
      <p>The original charge limit and the amount actually owed to the customer answer different questions. Payment systems can support several partial refunds against one charge. Your team still needs to recognize whether the next instruction concerns a new adjustment or a request already being handled.</p>
      <p>Use one shared return record that identifies the item or agreed adjustment, its amount and currency, who approved it, and the provider refund reference. Record pending activity as well as completed refunds. The next person should be able to see that the $40 request is already in progress without searching a colleague’s inbox.</p>
      <p>A timeout is not evidence that nothing happened. Cybersource’s recovery guidance warns that an uncertain refund must be checked before another is submitted. The first request may have succeeded even though its confirmation never reached the screen. Look up the existing record and investigate an unresolved result rather than trying again to obtain a more reassuring message.</p>
      <p>The same care applies when software and staff can both issue refunds. An online return, a support adjustment and an action in the gateway should lead back to the same payment history. Use the supported controls in your actual system; a note in a separate spreadsheet is not a guarantee that another channel will see it.</p>
      <p>Before acting, also check the payment’s current stage and any open dispute. The permitted action may be a cancellation or reversal rather than a refund. If a dispute is active, follow its instructions and coordinate the response without delaying a required customer remedy.</p>
    </section>

    <section id="make-the-adjustment-understandable" aria-labelledby="make-the-adjustment-understandable-title">
      <h2 id="make-the-adjustment-understandable-title">Leave the customer with an answer they can follow</h2>
      <p>A useful message identifies the returned item, explains the amount after any discount and states the actual refund status. For the hypothetical order, that means explaining the $40 adjustment and the $80 purchase that remains once it completes. It does not mean telling the customer that their bank has credited the money when you only have a pending request.</p>
      <p>Keep the order correction and the payment result linked. A credit note can explain the reduced sale; it does not, by itself, prove that a refund completed. Retain the refund reference and follow the result. If it fails, the customer’s agreed remedy still needs attention.</p>
      <p>Merchant costs need their own treatment. Under the published Trolleys fee schedule, original processing and currency conversion fees are not returned on a refund. That affects the merchant’s net proceeds. It does not automatically reduce the refund owed to the customer or turn the $80 remaining purchase into an $80 payout.</p>
      <p>For a Trolleys merchant, our <Link href="/services/refunds" prefetch={false}>refunds service</Link> keeps the eligible action, amount and status connected to the original payment. Trolleys, an Etail Depot service, supports full or partial returns where the payment and account permit them. Availability depends on the payment’s status, processor support and account permissions.</p>
      <p>If the records do not agree, <Link href="/company/contact#payment-review" prefetch={false}>ask our team to help review the payment</Link>. Include the merchant account, original transaction reference, refund reference and the adjustment you intended. Our <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> helps trace related merchant and gateway records. Keep full card details and credentials out of the support message.</p>
    </section>

    <p>A partial return can leave most of the purchase intact. Handle it so the customer knows what happened, the next colleague knows what has already been done and the remaining sale still makes sense. That is how a routine return stays routine.</p>
  </BlogArticlePage>;
}
