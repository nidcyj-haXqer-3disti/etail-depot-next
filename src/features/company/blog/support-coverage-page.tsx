import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { supportCoverageArticle } from "./support-coverage-content";

export function SupportCoveragePage() {
  return <BlogArticlePage article={supportCoverageArticle}>
    <p>A store can sell at midnight while the team authorized to change its account works business hours. A provider may accept support requests around the clock without promising that every issue can be resolved then.</p>
    <p>A ticket number may confirm that somebody received the problem. It does not tell the owner whether to keep accepting orders, call another team or wait until morning. That is the gap a support conversation needs to close before the store depends on it.</p>

    <section id="coverage-for-the-actual-problem" aria-labelledby="coverage-for-the-actual-problem-title">
      <h2 id="coverage-for-the-actual-problem-title">Ask who is available for the issue that matters</h2>
    <p>A failed checkout, a question about an invoice and a funding restriction involve different authority. The person answering a general support channel may be able to investigate one, explain another and route the third to a responsible specialist. Knowing that route is more useful than treating a broad coverage label as a universal resolution promise.</p>
    <p>Confirm the time zone, holiday treatment and channels available to the account. Then put a specific event to the provider. In a hypothetical overnight incident, the store cannot tell whether a payment completed. Receiving a response is helpful, but the merchant also needs to know whether the available team can establish the result or must wait for someone else. Ask what information that team needs, who receives an escalation and when the next update is due. An estimate and a contractual service level should be identified as such.</p>
    </section>

    <section id="make-coverage-useful" aria-labelledby="make-coverage-useful-title">
      <h2 id="make-coverage-useful-title">Fit support to the way the business trades</h2>
    <p>Coverage on the provider’s side is only useful if someone on the merchant’s side can work with it. That person needs permission to inspect the account, gather safe diagnostic information and make the business decisions the provider cannot make. An overnight specialist and an unreachable account owner still leave a gap. Planning who will answer is therefore part of buying the support, especially when customer trading hours extend beyond the office day.</p>
    <p>Trolleys’ <Link href="/company/legal/merchant-services#service-commitments" prefetch={false}>service responsibilities</Link> require assistance within the duties assigned to Etail; any service level must be expressly agreed. The <Link href="/company/contact#account-support" prefetch={false}>account support route</Link> is distinct from booking a sales conversation. Merchants should confirm account-specific coverage rather than infer it from a calendar’s available meeting times.</p>
    <p>No support conversation can remove every uncertain hour. It can make that uncertainty manageable by establishing what can be investigated now, what must wait and who keeps the merchant informed. Those answers give the owner a basis for planning the night, rather than merely a ticket number to carry into the morning.</p>
    </section>
  </BlogArticlePage>;
}
