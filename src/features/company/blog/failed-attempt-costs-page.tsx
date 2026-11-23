import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { failedAttemptCostsArticle } from "./failed-attempt-costs-content";

export function FailedAttemptCostsPage() {
  return <BlogArticlePage article={failedAttemptCostsArticle}>
    <p>A fee per transaction sounds straightforward until the merchant discovers that “transaction” includes attempts that never produced a sale.</p>
    <p>Gateway billing can count events differently from processing pricing. Authorize.net’s fee definitions, for example, identify declines, voids and refunds among the transaction types that can carry its gateway transaction charge. A processing offer based on successful sales does not necessarily describe a separate gateway agreement.</p>
    <p>That distinction explains why the bill deserves a closer reading. It also raises a more useful question: why did the checkout need so many attempts?</p>

    <section id="read-the-failed-attempts" aria-labelledby="read-the-failed-attempts-title">
      <h2 id="read-the-failed-attempts-title">The fee may be a symptom</h2>
    <p>A customer retrying after an understandable decline is one situation. A checkout repeatedly submitting the same request is another. So is a fraud attack generating attempts against stolen card details. A total labeled “declines” compresses very different operating problems into one number.</p>
    <p>Start with a small set of payment records behind the increase. Look for attempts grouped around the same order, repeated technical errors or a sudden change unrelated to legitimate sales. This is evidence for the integration or risk team, rather than a reason to loosen fraud controls or repeatedly retry a rejected card.</p>
    <p>An error also does not always establish that nothing happened. A connection can fail after a request has reached another system. The application needs to resolve the original payment’s status before creating a new one. Otherwise a customer can acquire a duplicate payment problem while the merchant is trying to fix a failed payment problem.</p>
    </section>

    <section id="a-price-for-which-event" aria-labelledby="a-price-for-which-event-title">
      <h2 id="a-price-for-which-event-title">Price the event you actually generate</h2>
    <p>The quote should distinguish successful captures from any separately billed gateway requests or checks. Payment count from the store’s order list may be too low to reproduce a gateway bill because one order can generate several events.</p>
    <p>Trolleys’ standard processing fee does not apply to an authorization, decline or cancellation before capture. Separately agreed event fees retain their own charging rules. That is why the <Link href="/company/legal/fees#calculation" prefetch={false}>calculation terms</Link> matter more than a loose promise about what “a transaction” costs.</p>
    <p>An avoidable attempt can leave more than a fee: another support inquiry, an uncertain order or a duplicate charge to resolve. If the extra volume comes from retries or abuse, a cheaper event price will not repair the checkout. If the attempts are legitimate, their agreed price still deserves scrutiny.</p>
    </section>
  </BlogArticlePage>;
}
