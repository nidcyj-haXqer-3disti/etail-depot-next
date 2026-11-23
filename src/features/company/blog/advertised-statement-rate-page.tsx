import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { advertisedStatementRateArticle } from "./advertised-statement-rate-content";

export function AdvertisedStatementRatePage() {
  return <BlogArticlePage article={advertisedStatementRateArticle}>
    <p>The merchant divides the month’s fees by sales and gets a percentage higher than the one they remember agreeing to. The provider replies that the calculation is more complicated than that.</p>
    <p>It may be. That is the beginning of the explanation the provider owes, not the end of it.</p>
    <p>An effective rate puts the cost into a form the owner can compare with revenue. It is a useful signal. Whether it identifies overbilling depends on what went into the numerator and denominator.</p>

    <section id="reproduce-the-number" aria-labelledby="reproduce-the-number-title">
      <h2 id="reproduce-the-number-title">Make the difference visible</h2>
    <p>An advertised percentage may be one component of an agreement that also contains a fixed charge per payment, monthly services or supplements for particular activity. A monthly service charge can take a larger share of sales in a quiet month even when its dollar amount is unchanged. The effective rate has risen, but the part causing the rise is not a new transaction percentage. That distinction matters when deciding what to question or renegotiate.</p>
    <p>Refunds introduce another distinction. If original processing fees are retained, dividing them by sales after refunds produces a higher percentage than dividing them by the original captured volume. Both ratios can be informative. They answer different questions.</p>
    <p>The payment amount and the fee period also need to match. A bank deposit can contain deductions or timing effects that are not processing fees. Reserve movements, refunded principal and disputed funds should not be silently relabeled as the price of processing. Their effect on cash is real, but they need their own explanation.</p>
    <p>The appropriate response is to reconstruct the bill from the accepted terms and the recorded activity. Identify each charge, its base and its count. The remaining difference is then something specific to investigate.</p>
    </section>

    <section id="the-providers-responsibility" aria-labelledby="the-providers-responsibility-title">
      <h2 id="the-providers-responsibility-title">Complexity should not become a defense</h2>
    <p>A provider should be able to explain the reconciliation without asking the owner to become a payments specialist. “That is your effective rate” simply names the merchant’s result. It does not establish why the result is correct.</p>
    <p>Trolleys’ <Link href="/company/legal/fees" prefetch={false}>fees and billing terms</Link> distinguish the calculation from the billing record and collection. Those distinctions allow a merchant to connect an agreed charge to an actual event. If a line cannot be connected, it warrants investigation rather than a general assurance about industry practice.</p>
    <p>Once the statement is understood, the owner still has a commercial decision. A correctly calculated bill may be too expensive for the service received. Accuracy and value are separate standards, and the merchant is entitled to examine both.</p>
    <p>An unexplained difference erodes trust more quickly than a well-explained cost. The provider has access to the calculation and should be prepared to show its work. The merchant should leave that conversation knowing what changed, what did not and which part of the price is worth revisiting.</p>
    </section>
  </BlogArticlePage>;
}
