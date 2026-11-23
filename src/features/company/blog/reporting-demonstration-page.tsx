import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { reportingDemonstrationArticle } from "./reporting-demonstration-content";

export function ReportingDemonstrationPage() {
  return <BlogArticlePage article={reportingDemonstrationArticle}>
    <p>A provider opens a dashboard and shows a rising sales total. The presentation is easy to follow because nothing has gone wrong.</p>
    <p>The finance team has a different question: how much work will it take to explain a difficult day after the presenter has gone? A partial refund, activity crossing a reporting cutoff, an adjustment or a payment appearing in one view before another can reveal that work. The exception gives the demonstration a purpose beyond proving that the dashboard contains numbers.</p>

    <section id="make-the-demo-account-for-the-difference" aria-labelledby="make-the-demo-account-for-the-difference-title">
      <h2 id="make-the-demo-account-for-the-difference-title">Choose a period with something to explain</h2>
    <p>Ask for a permitted, anonymized demonstration period containing at least one meaningful exception. Do not send another provider an unredacted customer export simply to improve a sales presentation. The aim is to test the proposed reporting workflow, not to disclose more information than necessary.</p>
    <p>Follow a payment through the relevant gateway and merchant account records. Establish what each status means, which references connect the records and when the activity belongs to each report. Then introduce the exception. Can the provider show where a later refund or adjustment appears without silently rewriting the original event?</p>
    <p>A mismatch should have an explanation or a clear investigation route. Matching totals alone are weak evidence: different missing and duplicated entries can offset one another. The report needs to let the merchant find the underlying items and distinguish timing from an actual error.</p>
    <p>Provider reports have defined scope. Stripe, for example, explains different reconciliation treatment for automatic and instant payouts. A report designed for one funding arrangement should not be presented as proof that every payout can be traced in exactly the same way.</p>
    <p>For Trolleys merchants, <Link href="/services/reconciliation" prefetch={false}>reconciliation</Link> includes comparing merchant account and gateway activity. Confirm the reports and references available for the proposed account. Following an explained payout to the receiving bank is a further check, not a substitute for reconciling the underlying payment records.</p>
    <p>Let the person who closes the books drive part of the demonstration and locate the exception again without the presenter choosing every filter. A guided answer can borrow the presenter’s expertise and hide the effort the merchant will later supply. If an extra spreadsheet or manual step is needed, make that work visible. It may be an acceptable part of the process; the problem is buying as though it does not exist.</p>
    <p>The useful result is an explanation the finance team can reproduce: which items belong together, why the amounts differ and what still needs investigation. That is what the merchant will need again at the next close. A demonstration earns confidence when the answer survives the end of the presentation.</p>
    </section>
  </BlogArticlePage>;
}
