import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { reportingContinuityArticle } from "./reporting-continuity-content";

export function ReportingContinuityPage() {
  return <BlogArticlePage article={reportingContinuityArticle}>
    <p>The first report from the new provider looks cleaner. Its total is also different from the figure the business used before. That might reflect a real change in sales. It might reflect a different definition of the number.</p>
    <p>A processing migration can quietly become a reporting break. An owner who reads the difference as growth may give a campaign credit it has not earned or set the next sales target against a figure the team cannot reproduce. The reporting definition belongs in the explanation of the result.</p>

    <section id="keep-the-meaning" aria-labelledby="keep-the-meaning-title">
      <h2 id="keep-the-meaning-title">Preserve the meaning behind the column</h2>
    <p>Start with the question the report is meant to answer. Orders placed, payments captured, refunds processed and net funds paid out describe different events. Two columns labeled “sales” are not comparable until the business knows which events, accounts and dates each includes.</p>
    <p>The transition period is especially easy to misread. A new order may run through the new provider while a refund for an earlier sale remains associated with the old arrangement. Reviewing only the new dashboard can make the period look better without improving the business’s economics.</p>
    <p>Keep a documented bridge between the reports: the reporting time zone, period boundaries, included accounts and treatment of fees, refunds and unsettled activity. Retain the original identifiers alongside the store’s order references. Different providers can issue similar-looking numbers; the provider and account are part of the identity.</p>
    </section>

    <section id="prove-one-period" aria-labelledby="prove-one-period-title">
      <h2 id="prove-one-period-title">Reconstruct one complete period before trusting the trend</h2>
    <p>Choose a period spanning the change and explain its activity from the underlying records. Investigate the difference rather than inserting a balancing amount to make the totals agree. A late refund, duplicated import or different cutoff has a different remedy.</p>
    <p>For Trolleys merchants, <Link href="/services/reconciliation" prefetch={false}>reconciliation</Link> connects merchant-account and gateway records for the same scope. Bank receipt is a further check, not a substitute for explaining those records. A processor migration adds a second historical source; it does not remove that distinction.</p>
    <p>Payment credential transfer is also separate from accounting history. Stripe explicitly excludes payment history and subscription objects from its card export. A completed vault transfer therefore does not mean the new reporting system contains a complete past.</p>
    <p>The old report does not have to remain the permanent standard. If the underlying records support it, rebuild earlier periods using the new definition and explain that choice. If they do not, mark where the comparison stops being reliable. A visible break in the trend tells the owner more than a continuous line joining numbers that mean different things.</p>
    </section>
  </BlogArticlePage>;
}
