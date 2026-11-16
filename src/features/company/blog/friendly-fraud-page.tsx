import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { friendlyFraudArticle } from "./friendly-fraud-content";

export function FriendlyFraudPage() {
  return <BlogArticlePage article={friendlyFraudArticle}>
    <p>A customer disputes a renewal. Your support team recognizes the name, finds months of successful payments and spots a recent login. The conclusion comes quickly: they used the service and now want it free.</p>
    <p>That may be what happened. It may also be the wrong conclusion from a perfectly accurate set of records.</p>
    <p>“Friendly fraud” commonly describes a customer disputing their own purchase without a valid basis, sometimes deliberately and sometimes through confusion. The term is useful for discussing a risk. It is a poor substitute for investigating a particular payment. A valid cancellation complaint, a billing mistake and an unauthorized purchase need different responses, even when the account looks familiar.</p>

    <section id="follow-the-timeline" aria-labelledby="follow-the-timeline-title">
      <h2 id="follow-the-timeline-title">The login is real. So is the cancellation.</h2>
      <p>Consider a hypothetical subscription business. Its support screen shows an active customer and a successful renewal. The customer says they canceled before the charge. Looking only at those two screens, the business sees a contradiction.</p>
      <p>Now put the underlying events in order. All times here use the same time zone.</p>
      <ol>
        <li><strong>9:14 am:</strong> The customer completes cancellation and receives confirmation that no further renewal will be taken.</li>
        <li><strong>9:15 am:</strong> The update to the billing system fails. The support record still shows the subscription as active.</li>
        <li><strong>9:20 am:</strong> A queued renewal runs against the unchanged billing record.</li>
        <li><strong>10:02 am:</strong> The customer logs in to find out why they were charged.</li>
      </ol>
      <p>The login happened after the problem. It does not demonstrate that the customer agreed to another renewal. In this example, the business has a cancellation failure to correct, not a dishonest customer to catch.</p>
      <p>Change the facts and the response may change. Perhaps cancellation took effect at a later date, as clearly disclosed and confirmed. Perhaps the customer disputes an entirely different charge. The terms shown at purchase, cancellation confirmation, payment reference and actual billing events belong in the same investigation.</p>
      <p>A useful case note states what a record establishes: cancellation confirmed at 9:14 am; renewal processed at 9:20 am. “Customer is abusing chargebacks” adds a conclusion the timeline does not support. Precise notes also let a second person find the mistake without inheriting the first person’s assumption.</p>
    </section>

    <section id="answer-the-claim" aria-labelledby="answer-the-claim-title">
      <h2 id="answer-the-claim-title">Build the response around the claim</h2>
      <p>A <Link href="/company/blog/what-is-a-chargeback" prefetch={false}>chargeback notice</Link> gives you a reason to answer and a deadline to meet. Start there. If the claim is cancellation, a pile of delivery records may miss the point. If it is nonreceipt, the relevant question is what reached the customer, not simply whether their card was approved.</p>
      <p>For an unrecognized charge, compare the statement description with the name the customer knows from the store and receipt. A company with several DBAs can create avoidable confusion when those names do not line up. Through your established support channel, explain which purchase the charge relates to and check whether that resolves the misunderstanding.</p>
      <p>For an unauthorized-payment claim, do not assume that a familiar email address, household member or device settles who had permission to pay. Prior activity can be relevant evidence. It is not automatic proof of authorization for the disputed transaction.</p>
      <p>And sometimes the evidence does contradict the claim. A customer may acknowledge receiving the exact order they later report as missing. Preserve the complete relevant exchange, connect it to the disputed purchase and explain the conflict plainly. You do not need an accusation about their character to present a factual response.</p>
      <p>Organize records chronologically and give each one a purpose. A brief explanation beside the cancellation confirmation or delivery record helps a reviewer understand why it matters. Submit the requested material through the case channel, within its deadline, rather than assuming a conversation with the customer has paused the process.</p>
    </section>

    <section id="resolve-and-learn" aria-labelledby="resolve-and-learn-title">
      <h2 id="resolve-and-learn-title">Protect the revenue you have earned</h2>
      <p>For a Trolleys merchant, a disputed payment should lead to a specific case review. Trolleys, an Etail Depot service, helps merchants work through <Link href="/services/disputes" prefetch={false}>the claim, supporting records and account adjustment</Link>. Keep the original gateway payment associated with the correct merchant account, MID and DBA so the conversation concerns the right sale.</p>
      <p>If the records show a merchant mistake, acknowledge it and follow the provider’s instructions for resolving the case. If the charge is valid and the evidence supports it, use the available response process. Neither accepting every complaint nor challenging every complaint is a substitute for that decision.</p>
      <p>Keep two things separate: agreement with the customer and closure of the dispute. A promise to withdraw does not itself close the case. Stripe’s withdrawal guidance explains why merchants may still need to submit evidence even when a customer retracts a claim. Confirm the requirements and status with your provider before treating the matter as finished.</p>
      <p>Likewise, check earlier credits and the open dispute before issuing a separate refund. A support agent trying to put things right should not accidentally return the same funds twice. Keep any <Link href="/services/refunds" prefetch={false}>refund reference and status</Link> with the original transaction.</p>
      <p><Link href="/company/contact#payment-review" prefetch={false}>Ask our team to review an unclear case</Link> while there is still time to act. Relevant records should go through the requested secure channel. The outcome follows the applicable dispute process; support is not a promise that every disputed payment will be recovered.</p>
      <p>Afterward, look for the repeatable cause. Several customers questioning the same statement name may call for clearer receipts. Repeated cancellation complaints may reveal a broken handoff between support and billing. Visa’s prevention guidance emphasizes clear policies, communication and timely handling. Those fixes can protect future revenue without making every customer work harder to prove they are honest.</p>
    </section>

    <p>The strongest response is the one your records support. In the renewal example, that means fixing the cancellation. In another case, it may mean challenging an unsupported claim. A payment partner should help you make that distinction, while your team keeps the customer’s actual complaint in view.</p>
  </BlogArticlePage>;
}
