import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentFeatureSubscriptionsArticle } from "./payment-feature-subscriptions-content";

export function PaymentFeatureSubscriptionsPage() {
  return <BlogArticlePage article={paymentFeatureSubscriptionsArticle}>
    <p>The fraud tool is enabled. The reporting subscription is active. The recovery feature is on the invoice. It is possible for all three to be true without anyone in the business having changed what they do.</p>
    <p>Software can automate work. It can also create a new queue, a new exception or a decision that somebody must make. The subscription buys access to a capability. Its value depends on what happens after access is granted.</p>

    <section id="the-work-behind-the-feature" aria-labelledby="the-work-behind-the-feature-title">
      <h2 id="the-work-behind-the-feature-title">Start with the job that is going undone</h2>
    <p>A reporting feature can produce a file every morning while the same person still spends an hour joining it to store records. In that situation, another export has not yet solved the reporting problem. The worthwhile change is less work or a more dependable result, whether that comes from a new tool or better use of the one already installed.</p>
    <p>Fraud tooling creates a different tradeoff. A rule can block, allow, request authentication or send a payment for review, depending on the product and configuration. Stripe’s rules documentation describes these choices. Each action has consequences for legitimate customers as well as suspicious activity. A review queue needs a reviewer. A change to a rule needs a way to evaluate what it did.</p>
    </section>

    <section id="renewal-as-a-decision" aria-labelledby="renewal-as-a-decision-title">
      <h2 id="renewal-as-a-decision-title">A subscription deserves another decision at renewal</h2>
    <p>At renewal, the useful evidence is what changed in the business. Reporting may take less time. Missing records may be found sooner. Staff may spend fewer hours repairing preventable errors. A usage count can show that a feature was opened; those outcomes show why it was worth opening.</p>
    <p>Reviewing value also requires care. A reduction in fraud losses does not by itself show whether legitimate orders were blocked. More recovered payments do not by themselves show what additional attempts cost. The measure should include the important consequences of the tool’s actions.</p>
    <p>For Trolleys merchants, the <Link href="/company/legal/fees#optional-service" prefetch={false}>optional dispute prevention terms</Link> make enrollment and the charging scope explicit. That commercial clarity needs an operational counterpart inside the business: who requested the service, who uses it and who decides whether it still earns its cost.</p>
    <p>Naming an owner is only useful if that person has time to do the work and a way to act on the findings. Someone accountable for a growing review queue but unable to change its rules or obtain help has been given responsibility without the means to carry it. The subscription becomes useful when the team can turn what the tool reveals into a better result.</p>
    </section>
  </BlogArticlePage>;
}
