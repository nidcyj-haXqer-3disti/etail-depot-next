import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardRefundsArticle } from "./card-refunds-content";

export function CardRefundsPage() {
  return <BlogArticlePage article={cardRefundsArticle}>
    <p>The return is approved. Your team has clicked Refund. Then the customer writes again: the money is still missing.</p>
    <p>From your side, the job may look finished. From theirs, you still have their money. Replying with the same confirmation email does little to close that gap, especially if nobody can explain what the confirmation actually confirms.</p>
    <p>A card payment refund returns all or part of an eligible payment through the payment provider. But agreeing to a return, submitting the refund and seeing a credit on a card statement are different events. Good customer service keeps those differences visible without making the customer learn the payment system.</p>

    <section id="what-refunded-means" aria-labelledby="what-refunded-means-title">
      <h2 id="what-refunded-means-title">“Refunded” needs a little more explanation</h2>
      <p>Start with the payment record, not the support ticket. An approved return tells you what your business intends to do. A canceled order tells you what happened in your store. Neither, by itself, proves that the money has gone back.</p>
      <p>The payment’s stage matters. An uncaptured authorization may need a supported reversal to release the reserved amount. A captured transaction may still qualify for a void before settlement. An eligible captured or settled payment can require a refund. The available action depends on the processor and account permissions.</p>
      <p>Once a refund is submitted, read the provider’s actual status. A request can pass an initial check and still encounter a later failure. Adyen’s documentation, for example, distinguishes successful validation and submission to the card network from a refund that subsequently fails. An early success message is not a reason to stop following the record.</p>
      <p>The customer’s view needs checking too. Some card returns appear as a reversal: the original charge disappears rather than being followed by a separate credit. Someone searching only for a new positive amount may miss what changed.</p>
      <p>That is a useful explanation when the record supports it. It should not become a convenient guess whenever a customer says the money has not arrived.</p>
    </section>

    <section id="avoid-paying-twice" aria-labelledby="avoid-paying-twice-title">
      <h2 id="avoid-paying-twice-title">A second payment can turn a delay into a loss</h2>
      <p>There is an understandable temptation to make the complaint go away. The first refund looks stuck, so someone offers a bank transfer. Or another member of staff opens the order and issues a second partial refund, unaware that a colleague has already acted.</p>
      <p>Before either happens, look at the original payment and every return already linked to it. Confirm the amount, currency, previous refunds and any pending request. Check for an open dispute as well. A customer complaint, a refund and a chargeback can concern the same purchase without being the same process.</p>
      <p>An interrupted screen is particularly easy to misread. A timeout means your system did not receive the expected response; it does not prove that the refund failed. Cybersource’s timeout guidance warns that submitting another refund without checking the original result can produce an unintended duplicate.</p>
      <p>A changed card is another reason to investigate, not improvise. For an ordinary card refund, use the original payment’s refund route. An expired or replaced card does not automatically mean that route is broken. The issuer handles how funds reach the cardholder. If the refund genuinely fails, follow the provider’s confirmed recovery instructions before arranging an alternative.</p>
      <p>For a Trolleys merchant, our <Link href="/services/refunds" prefetch={false}>refunds service</Link> follows this same principle: keep the action, eligible amount and outcome connected to the original payment. If a dispute is already open, follow its instructions. Issuing a refund does not automatically close the dispute.</p>
      <p>The practical improvement is often simple: leave the next person a record they can trust. A note saying “customer refunded” is less useful than the refund reference, amount, submission time and current status. The next conversation should start where the previous one ended.</p>
    </section>

    <section id="give-a-traceable-answer" aria-labelledby="give-a-traceable-answer-title">
      <h2 id="give-a-traceable-answer-title">Give the customer something better than “please wait”</h2>
      <p>A useful update says what you can verify. Identify the order, the amount and currency being returned, when the refund was submitted and what its current status means. Distinguish a pending request from one the provider reports as processed. Neither statement needs to pretend you can see the customer’s bank account.</p>
      <p>If a processed card refund cannot be found, ask for an available bank tracing reference. Depending on the network and provider, this may be an Acquirer Reference Number, or ARN, a System Trace Audit Number, or STAN, or a Retrieval Reference Number, or RRN. The customer can give the applicable reference to their card issuer to help trace the return.</p>
      <p>Your order number is useful to your team, but it is not a substitute for that reference. Tracing details are not always available immediately, and not every type is supported for every refund. Confirm what is available rather than promising an ARN for every case.</p>
      <p>When discussing timing, use the estimate supplied for the actual payment and describe it as an estimate. Bank posting is separate from processing. If that window has passed, give the customer a specific next action and take responsibility for your part of the investigation instead of repeating the same waiting period.</p>
      <p>Trolleys, an Etail Depot service, supports merchants with their payment and account questions. When <Link href="/company/contact" prefetch={false}>contacting our team</Link> about a refund, identify the store, original transaction, refund reference and the status that needs explaining. Keep passwords, full card numbers and security codes out of the message. A clear record helps us understand the question; it does not let us promise when a card issuer will display the credit.</p>
    </section>

    <p>The sale may be over, but the customer is still deciding whether to trust your business. A refund handled well leaves them with a clear answer, a traceable payment and no need to tell the same story again.</p>
  </BlogArticlePage>;
}
