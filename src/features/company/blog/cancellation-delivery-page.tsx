import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cancellationDeliveryArticle } from "./cancellation-delivery-content";

export function CancellationDeliveryPage() {
  return <BlogArticlePage article={cancellationDeliveryArticle}>
    <p>An owner puts the contract’s renewal date in the calendar and plans to review alternatives a week before it arrives. That can be too late if the agreement requires an earlier notice of nonrenewal.</p>
    <p>The renewal anniversary is the visible date. The decision may need to happen much earlier, and delivery may have its own permitted window. Putting only the anniversary in the calendar can preserve the date while losing the choice it was meant to protect.</p>

    <section id="delivery-matters" aria-labelledby="delivery-matters-title">
      <h2 id="delivery-matters-title">A decision inside the business is not a delivered notice</h2>
    <p>Some processing contracts specify a notice window as well as a delivery method. The Minnesota Attorney General describes agreements where an early or late cancellation can miss that window. Its warning is a reason to read the actual clause, not a universal timetable for every merchant account.</p>
    <p>Identify the party that must receive notice and the method the agreement accepts. A message to a former salesperson may not reach the contractual recipient. A support conversation about possible closure may also be different from an explicit request to end the service.</p>
    <p>Keep evidence of what was sent, when it was received and what the provider confirmed. Ask for the effective closure or nonrenewal date and any steps still required. If dates or delivery requirements are disputed, resolve that promptly rather than assuming an unanswered message settled them.</p>
    </section>

    <section id="use-your-own-terms" aria-labelledby="use-your-own-terms-title">
      <h2 id="use-your-own-terms-title">Do not borrow a deadline from another account</h2>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#termination" prefetch={false}>public merchant terms</Link> allow the merchant to request account closure at any time through the identified support channel. They do not impose a general 30-day cancellation window. Separate provider or platform agreements continue under their own terms unless ended, so a merchant still needs to identify the services it is closing.</p>
    <p>Notice of a price change, a period to correct a breach and notice of nonrenewal serve different purposes. A number found in one clause should not be used as the deadline for another. Account-specific terms and applicable law also matter.</p>
    <p>The review and the delivery should be separate calendar events. Start the review early enough to consider a replacement, authorized recurring arrangements and record retention. Then follow the actual notice clause. Where it defines a window, simply moving the cancellation reminder further back could put the message outside that window at the other end.</p>
    <p>This is why a renewal date cannot do all the planning work. Management needs time to decide; the provider needs the required notice; operations needs a workable transition. A confirmed end date becomes useful when all three fit together.</p>
    </section>
  </BlogArticlePage>;
}
