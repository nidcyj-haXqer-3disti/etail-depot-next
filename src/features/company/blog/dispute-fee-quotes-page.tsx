import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { disputeFeeQuotesArticle } from "./dispute-fee-quotes-content";

export function DisputeFeeQuotesPage() {
  return <BlogArticlePage article={disputeFeeQuotesArticle}>
    <p>A merchant wins a dispute and expects the financial damage to be undone. The sale may be restored while some fees and all the time spent assembling evidence remain.</p>
    <p>That is why “the chargeback fee” is too narrow a phrase for a serious comparison. An agreement may distinguish receiving a dispute, responding to it and what happens to a response charge after the decision. The disputed principal is separate from all of those fees.</p>

    <section id="follow-the-case" aria-labelledby="follow-the-case-title">
      <h2 id="follow-the-case-title">Read the price through the whole case</h2>
    <p>Trolleys’ <Link href="/company/legal/fees#refund-treatment" prefetch={false}>published fee terms</Link> distinguish a $35 received-dispute fee from a $15 manual response fee. The response fee is returned when the merchant wins. That does not mean every cost associated with the dispute is returned.</p>
    <p>This is the kind of distinction a merchant needs before comparing offers. A low initial fee can be followed by a separate response charge. A higher initial fee may cover different work. The outcome treatment can change the final cost. Comparing a single line without its trigger can make unlike arrangements look interchangeable.</p>
    <p>The principal needs to remain visible too. Returning a disputed payment to the merchant is recovery of that sale, not a fee credit. A report that combines the amounts can obscure what was recovered and what was spent.</p>
    </section>

    <section id="the-work-before-the-fee" aria-labelledby="the-work-before-the-fee-title">
      <h2 id="the-work-before-the-fee-title">The quality of the evidence matters more than a few dollars</h2>
    <p>Once a case arrives, a fee already incurred and unaffected by the response decision cannot be saved by declining to respond. The decision concerns the additional expense and work, the amount at stake and the evidence the merchant actually has. Relevant records that can be submitted within the deadline matter more than the understandable desire to recover everything the dispute has cost.</p>
    <p>A lower response fee cannot repair a missing delivery record or a refund that the merchant promised but never issued. Nor does paying for assistance guarantee the outcome. The provider supports the process; it does not simply decide the case in the merchant’s favor.</p>
    <p>There is therefore value in the ordinary operational work before a dispute arrives: clear order descriptions, accessible support, accurate fulfillment records and a consistent refund process. When a case does arrive, somebody needs responsibility for it. A notification in an unattended inbox is not effective dispute management.</p>
    <p>The merchant should know what a response costs before a deadline forces the decision. Discovering the price while trying to recover a disputed sale puts a commercial question in the middle of an already difficult operational one.</p>
    </section>
  </BlogArticlePage>;
}
