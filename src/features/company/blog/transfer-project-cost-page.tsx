import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { transferProjectCostArticle } from "./transfer-project-cost-content";

export function TransferProjectCostPage() {
  return <BlogArticlePage article={transferProjectCostArticle}>
    <p>The sales conversation reaches saved cards. The answer sounds reassuring: the data transfer is free. The merchant may hear that moving its returning customers will cost nothing.</p>
    <p>That is a much larger promise.</p>
    <p>Helcim, for example, states that it does not charge for its card import or export service. That tells the merchant something specific about Helcim’s part of the transfer. It does not price work in the merchant’s subscription app, a receiving provider’s services or the effort needed to resolve records that cannot be matched.</p>
    <p>A useful migration estimate separates those jobs. One provider releases eligible data through an approved secure process. Another receives it. The business’s software must associate the new references with the right customers and permitted billing arrangements. Exceptions need a decision and, sometimes, customer action.</p>
    <p>Consider a hypothetical import that accepts the file but leaves some records without a matching customer in the store. The transfer may be complete within the provider’s quoted scope, while the merchant still has to pay someone to investigate the exceptions. Agree who owns that work, whether the estimate includes an agreed final update and who can authorize additional charges. Those answers reveal where a free transfer stops and a billable project begins.</p>
    <p>A quote that ends at “file delivered” may accurately describe the supplier’s job. The merchant’s budget still needs to reach usable records in the receiving setup, with exceptions accounted for. If nobody has accepted responsibility for that remaining work, the estimate has an unpriced gap even when every quoted charge is accurate.</p>
    <p>Keep the sensitive transfer between authorized providers using their approved process. A merchant spreadsheet of full card details is not a shortcut around a quoted fee. Billing schedules and customer permissions also require their own continuity; moving credentials does not expand the authority to charge them.</p>
    <p>For a proposed Trolleys account, discuss the existing vault and software before committing to a move. The <Link href="/company/legal/merchant-services#termination" prefetch={false}>account transition terms</Link> require an authorized, secure process. Account approval alone does not promise a transfer or establish its price.</p>
    <p>The most useful number is the cost of reaching a working, verified arrangement. A zero beside one line of the project can be good news without being the total.</p>
  </BlogArticlePage>;
}
