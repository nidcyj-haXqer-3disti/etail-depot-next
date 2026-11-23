import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { renewalImportArticle } from "./renewal-import-content";

export function RenewalImportPage() {
  return <BlogArticlePage article={renewalImportArticle}>
    <p>A migration report says every customer was imported. That is a useful result, but it answers a data question. The merchant still owes each customer the right next bill.</p>
    <p>A customer may have paid annually, hold a credit, be in a trial or have canceled at the end of the current term. Recreating every record as an active monthly subscription would preserve the customer count while breaking the commercial relationship.</p>

    <section id="follow-the-obligation" aria-labelledby="follow-the-obligation-title">
      <h2 id="follow-the-obligation-title">Start from what the customer is owed</h2>
    <p>Establish what each continuing arrangement should do next using its current agreed state. The important distinction is between a customer, a usable payment method and a billing instruction. Those records can move through different processes and finish at different times.</p>
    <p>Stripe’s subscription migration toolkit treats the next billing date, trials, discounts and related settings as part of a separate import. It also warns against leaving old subscriptions able to bill after replacements are created. These are specific controls in Stripe’s product, but the business problem applies more widely: the same obligation must not be collected twice.</p>
    <p>For the migration plan, name the system responsible for the last old collection and the first new one. Check cases where a collection fails or is delayed. A scheduled retry in the old system can matter even when the regular renewal has been moved.</p>
    </section>

    <section id="test-the-exceptions" aria-labelledby="test-the-exceptions-title">
      <h2 id="test-the-exceptions-title">Review the unusual accounts before the ordinary ones hide them</h2>
    <p>One revealing test is whether the new setup can correctly leave a customer alone. Consider a hypothetical annual subscriber halfway through a paid term. A successful migration should preserve that paid period; an immediate new bill would be a failure even if the payment succeeded. Check the expected amount and date, including cases where nothing is due, against the customer’s agreement.</p>
    <p>Keep a record of unresolved cases and their owner. Do not activate a guessed schedule to make the migration count reach one hundred percent. Report “imported” and “next billing action verified” separately, so an incomplete billing decision cannot disappear inside a successful transfer total.</p>
    <p>Trolleys supports recurring payments where enabled for the approved arrangement. That does not establish compatibility with every subscription app or transfer process. Confirm the <Link href="/services/payment-methods" prefetch={false}>specific account and integration</Link> before changing live schedules.</p>
    <p>Completion means the customer receives the service already paid for and the next permitted collection happens once, at the right time. A successful import is evidence along the way, not the finish line.</p>
    </section>
  </BlogArticlePage>;
}
