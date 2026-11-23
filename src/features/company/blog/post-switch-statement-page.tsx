import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { postSwitchStatementArticle } from "./post-switch-statement-content";

export function PostSwitchStatementPage() {
  return <BlogArticlePage article={postSwitchStatementArticle}>
    <p>The first bill arrives and the total is lower. That can be encouraging without proving the switch delivered the saving the merchant expected.</p>
    <p>Perhaps only part of the month ran through the new provider. Perhaps a promotion offset a fee. Perhaps the old account still collected a separate monthly charge. The comparison needs a complete view before a headline saving becomes a business conclusion.</p>
    <p>Use the first complete period that reasonably represents the intended new arrangement. That may require looking beyond the opening statement. Establish which transactions moved, which services were active and whether the period includes unusual refunds or a materially different customer mix.</p>
    <p>Separate billing accuracy from savings. First, recalculate the new charges from the accepted offer using the actual transaction counts, amounts, methods and separately billed services. Then, where the old terms support a meaningful comparison, price that same activity under the previous arrangement. A correct bill can still deliver less saving than expected, and a lower bill can simply reflect fewer sales. Show changed services separately so a difference in what the business bought does not masquerade as a price reduction.</p>
    <p>Then account for temporary overlap. The old provider’s final charges and the new provider’s setup work belong in the overall cost of switching, but they should not be mistaken for the permanent monthly cost. Conversely, do not remove an ongoing subscription from the comparison simply because it arrives on another invoice.</p>
    <p>For a Trolleys account, the <Link href="/company/legal/fees#billing-record" prefetch={false}>billing record</Link> identifies the accepted rates, calculation, collection method and optional services. Match the bill against that record and raise an unexplained difference through the designated channel. The question is what was agreed and charged, not whether the sales illustration looked attractive.</p>
    <p>Keep the result useful for the next month. Record any temporary credits, incomplete activity or unresolved discrepancies so they do not quietly become assumptions in the next comparison. If the saving falls short, that separation helps locate the cause: an incorrect charge, different activity, a changed service or unfinished migration work.</p>
    <p>The outcome may still justify the move even if the saving is smaller than forecast. Better support or a needed capability can have value of its own. But the merchant should be able to see that trade clearly, rather than mistake an incomplete first bill for proof that the quoted saving arrived.</p>
  </BlogArticlePage>;
}
