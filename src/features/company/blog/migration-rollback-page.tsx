import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { migrationRollbackArticle } from "./migration-rollback-content";

export function MigrationRollbackPage() {
  return <BlogArticlePage article={migrationRollbackArticle}>
    <p>The team agrees it can return to the old checkout if the new one has trouble. That sounds reassuring until a customer has already paid through the new arrangement.</p>
    <p>Restoring the website does not undo that payment. A rollback changes what happens next; it does not rewrite what already happened.</p>
    <p>Before launch, define who can pause new payment attempts and who can authorize a return to the previous route. Establish what evidence triggers that decision. A confirmed inability to complete purchases, a reporting delay and an unknown payment result require different investigation. A universal “wait fifteen minutes, then switch back” rule cannot distinguish them.</p>
    <p>The previous route must still be authorized and usable if it forms part of the fallback. Confirm its credentials, account status and operational limits before relying on it. A cancellation already completed or a credential already revoked may change the options. Do not keep access beyond its permitted scope simply to preserve a theoretical escape route.</p>
    <p>For payments already attempted, retain the provider and transaction references and determine their outcomes. Cybersource’s timeout guidance makes this distinction explicit: a missing response does not prove the payment failed. Sending another charge through the old provider while the first result is unknown can create another customer problem instead of fixing the first.</p>
    <p>Recurring work needs the same care. A restored job must not collect an invoice already collected by the new system. Someone must reconcile the transition activity and explain which system now owns each outstanding action.</p>
    <p>For a Trolleys migration, agree the responsibilities with the <Link href="/company/contact#account-support" prefetch={false}>implementation and account team</Link>. The service terms do not guarantee uninterrupted access or make a particular fallback available. The plan needs to match the account and the providers involved.</p>
    <p>Judge recovery on two results: new customers have an authorized, usable way to pay, and orders caught in the change have a known next action. Restoring checkout may achieve the first while investigation continues on the second. Keep those unresolved orders visible, with someone responsible for each outcome. A customer waiting to learn whether a payment succeeded still needs an answer after new sales have resumed.</p>
  </BlogArticlePage>;
}
