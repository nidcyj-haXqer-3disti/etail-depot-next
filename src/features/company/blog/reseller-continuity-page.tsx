import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { resellerContinuityArticle } from "./reseller-continuity-content";

export function ResellerContinuityPage() {
  return <BlogArticlePage article={resellerContinuityArticle}>
    <p>The familiar support email stops answering. The salesperson’s number no longer connects. Payments may still be working, which can make the problem seem less urgent than it is.</p>
    <p>Working payments answer only the immediate question of whether sales can continue. They do not show who can recover access, explain a charge or deal with the next interruption. The missing contact exposes a dependency that daily trading may have concealed: the business knows the person who sold the account better than it knows the organizations responsible for it.</p>

    <section id="an-introduction-is-not-the-whole-service" aria-labelledby="an-introduction-is-not-the-whole-service-title">
      <h2 id="an-introduction-is-not-the-whole-service-title">Separate the sales relationship from the operating relationship</h2>
    <p>A reseller, acquiring provider, gateway and software platform can have different roles and agreements. The disappearance of one party does not, by itself, establish that every account has closed, that every fee has ended or that another party has assumed every support duty.</p>
    <p>Use the accepted account documents and verified statements to identify the responsible providers and account references. Reach them through known official channels. An unsolicited offer to “rescue” the account is not a reason to disclose passwords, payment data or banking details.</p>
    <p>Ask for the status of the account and the correct route for the issue at hand. A billing correction, lost login and processing interruption can require different teams. Keep a record of the unresolved issue and any promised transfer of responsibility so the next contact does not have to reconstruct it from the beginning.</p>
    </section>

    <section id="design-for-continuity" aria-labelledby="design-for-continuity-title">
      <h2 id="design-for-continuity-title">The protection is in the handoff you receive at the start</h2>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#service-order" prefetch={false}>Merchant Service Order</Link> identifies the roles of the responsible providers and the support contacts for the account. Its <Link href="/company/legal/merchant-services#service-commitments" prefetch={false}>service responsibilities</Link> distinguish duties within Etail’s control from those belonging elsewhere. Using a provider does not erase the obligations Etail itself accepted.</p>
    <p>A strong relationship with a salesperson can save time and make a complicated service easier to navigate. The weakness arises when that person becomes the only route to the agreement, authorized access or responsible organization. The merchant should retain those connections directly, with essential records available to the business rather than confined to the salesperson’s inbox.</p>
    <p>If service is interrupted, establish the verified transaction state before retrying payments elsewhere. If the business decides to leave, confirm remaining obligations and closure with each relevant party. A failed contact channel is a problem to escalate; it is not evidence that the old account has stopped processing or charging.</p>
    <p>The salesperson’s disappearance should leave the merchant with a contact to replace, not a payment relationship to rediscover. That is why the quality of the original handoff matters long after the sale.</p>
    </section>
  </BlogArticlePage>;
}
