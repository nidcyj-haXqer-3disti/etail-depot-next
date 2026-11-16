import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { representmentArticle } from "./representment-content";

export function RepresentmentPage() {
  return <BlogArticlePage article={representmentArticle}>
    <p>You remember packing the order. You remember the customer’s second purchase. Then a dispute arrives saying the customer was charged twice for the same thing.</p>
    <p>Your first reaction may be that this is obviously wrong. But the person reviewing the case was not beside you when the orders came in. They need the connection between the payment, the purchase and the fact that answers the complaint.</p>
    <p>Chargeback representment is the merchant’s challenge to a chargeback through its acquirer or payment provider. It uses supporting records to contest the stated claim. Network terminology and response routes differ; Mastercard calls its acquirer response a second presentment. It is a dispute response, not permission to charge the customer’s card again.</p>

    <section id="two-charges-two-stories" aria-labelledby="two-charges-two-stories-title">
      <h2 id="two-charges-two-stories-title">Two matching amounts, two possible stories</h2>
      <p>Imagine a customer buys one desk lamp and, later that day, orders another for a different room. Both purchases cost $45. Both charges appear on the statement. The customer disputes the second as a duplicate.</p>
      <p>The merchant finds two orders. That is a starting point, not the whole explanation. The response needs to connect each payment to the separate purchase and its fulfillment. Two order numbers created by the same failed checkout attempt would tell a different story.</p>
      <p>If the records support two purchases, a short explanation could begin like this:</p>
      <blockquote>
        <p>The disputed $45 payment relates to the second lamp order. The attached records connect each charge to a separate purchase and show fulfillment for both orders.</p>
      </blockquote>
      <p>That is wording for this hypothetical case, not evidence by itself. The attachments have to establish what the sentence says. A customer order confirmation, the matching payment reference and the relevant dispatch or delivery record should tell the same story. Any difference in names, dates or amounts needs an explanation.</p>
      <p>Now change one fact. There was only one customer purchase, but the checkout sent the payment twice. A polished letter cannot turn that into two sales. The records support a processing error. Follow the provider’s instructions for accepting or resolving the dispute and check any money already returned before creating another credit.</p>
      <p>Doing this work before drafting the response matters. Otherwise, a team can spend an afternoon assembling proof that it shipped a lamp when the real question is why it charged for two.</p>
    </section>

    <section id="write-for-the-reviewer" aria-labelledby="write-for-the-reviewer-title">
      <h2 id="write-for-the-reviewer-title">Write for someone who has never seen the order</h2>
      <p>Start with the notice, including the customer’s actual explanation where available. Check the disputed amount, reason and submission deadline. A cancellation claim needs a different answer from a delivery claim. A successful authorization does not establish that a parcel arrived.</p>
      <p>Build the response around the fact you can establish. Put the events in order, identify the records that support them and remove material that does not help answer the claim. Readable excerpts are more useful than a complete inbox or an entire terms document with the relevant passage buried inside.</p>
      <p>Do not make the reviewer reconstruct your business. Your team may know that the order number in the store differs from the gateway transaction reference. Someone outside the company will not. Explain that connection once, clearly, instead of assuming that matching amounts make it obvious.</p>
      <p>A refund creates another connection to explain. Identify which payment it belongs to, how much was returned and when. If only part of the purchase was refunded, make the remaining amount understandable. A refund record from a different order does not answer this case.</p>
      <p>Use the evidence formats and submission channel required for the case. Do not rely on a link to a private dashboard that the reviewer cannot open. Include only relevant customer information through the approved channel. Missing facts should remain missing facts, not become confident guesses in the covering explanation.</p>
      <p>There is also a commercial decision here. The disputed amount, available evidence, staff time and applicable fees all matter. Challenging every case is not automatically good management. Neither is abandoning a valid response simply because the records are scattered across three teams.</p>
    </section>

    <section id="follow-the-submitted-case" aria-labelledby="follow-the-submitted-case-title">
      <h2 id="follow-the-submitted-case-title">Submission is a stage, not an outcome</h2>
      <p>Check the packet before sending it. Some providers limit changes after submission. A saved draft, an uploaded document or an email to support may not complete the formal response. Confirm the case status and keep the submission confirmation with the records you sent.</p>
      <p>Use the deadline in your case instructions. Do not substitute a general network time limit found online for the date your provider requires. Assign someone to subsequent notices so a request for more action does not sit unread while everyone assumes the job is finished.</p>
      <p>If the customer says they have withdrawn the dispute, keep following the open case. Their message is useful information, but it is not the same as confirmation that the issuer has closed it. Check whether evidence or another response is still required.</p>
      <p>For a Trolleys merchant, begin with the correct merchant account, dispute reference and original payment. Trolleys, an Etail Depot service, helps merchants <Link href="/services/disputes" prefetch={false}>review the claim, organize supporting records and follow the outcome</Link>. Your team supplies the facts about the sale. The decision follows the applicable network process; support does not guarantee that a challenge will succeed.</p>
      <p><Link href="/company/contact#payment-review" prefetch={false}>Contact our team</Link> if a notice or account adjustment is unclear. Bring the case reference and the specific question. A response marked submitted, a case decided in your favor and funds appearing in your merchant account are different records to verify. Further escalation, where available, is a separate decision with its own requirements and costs.</p>
    </section>

    <p>The value of a good response is not its length. It is that a stranger can follow the sale without having to trust your memory of it.</p>
    <p>And when the case ends, keep the operational lesson. Two genuine purchases may need clearer receipts. One purchase charged twice needs a checkout fix. Better evidence can defend a sale; understanding what caused the dispute can prevent the next one.</p>
  </BlogArticlePage>;
}
