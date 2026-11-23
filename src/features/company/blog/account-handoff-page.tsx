import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { accountHandoffArticle } from "./account-handoff-content";

export function AccountHandoffPage() {
  return <BlogArticlePage article={accountHandoffArticle}>
    <p>Sales knows why the merchant chose the service. Implementation knows what must connect. Support will eventually hear what did not work. If those teams receive different versions of the agreement, the merchant becomes the messenger between them.</p>
    <p>The loss goes beyond repeating a conversation. A receiving team can finish the tasks it was given while missing the reason the merchant bought the service. The owner then discovers that the account has moved forward, but the problem that prompted the purchase has stayed behind.</p>
    <p>A useful handoff carries decisions, not just a contact record. The receiving team needs the approved business and accounts, selected services, accepted commercial variations and unresolved launch tasks. It also needs enough context to understand which tasks matter to the merchant’s operating plan. The reason for choosing a service does not expand the agreed scope, but it helps the team see why an unfinished part cannot be dismissed as a minor detail.</p>
    <p>Unfinished work needs a named owner and a condition for completion. “Gateway setup pending” is less useful than a precise statement of the missing approval or connection step, who must supply it and what can proceed meanwhile. A customer’s planned launch date should not quietly become a promise of activation before the responsible provider approves it.</p>
    <p>The same discipline applies to exceptions. If a proposed feature or price was discussed but never accepted, it should not be handed over as a commitment. If a variation was accepted, it should not disappear when the account reaches standard billing. The handoff needs to distinguish both states.</p>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#service-order" prefetch={false}>Merchant Service Order</Link> records account scope, providers, commercial terms and support contacts. The <Link href="/company/legal/merchant-services#agreement-acceptance" prefetch={false}>acceptance record</Link> preserves what was actually agreed. Those records support continuity when the people handling the account change.</p>
    <p>A merchant does not necessarily need the same individual forever. It needs the next person to arrive informed, explain the current state of the work and identify what happens next. Where that person lacks authority, the route to someone who has it should already be clear. The merchant can then judge progress from a shared record instead of comparing competing recollections of the sale.</p>
    <p>The quality of a payment service is visible in this ordinary moment: the first person after the salesperson already understands what the merchant bought.</p>
  </BlogArticlePage>;
}
