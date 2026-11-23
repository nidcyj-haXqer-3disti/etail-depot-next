import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { previousProcessorArticle } from "./previous-processor-content";

export function PreviousProcessorPage() {
  return <BlogArticlePage article={previousProcessorArticle}>
    <p>“We decided to switch” sounds better than “our processor ended the relationship.” If the second statement is what happened, the first creates a problem the new application did not need.</p>
    <p>An account closure can have several causes. Sometimes the provider gives a specific reason. Sometimes its notice is limited. The merchant’s task is to describe what is known accurately, including what remains unresolved. It is not to invent a reassuring explanation.</p>

    <section id="the-record" aria-labelledby="the-record-title">
      <h2 id="the-record-title">Start with the notice, not the sales pitch.</h2>
    <p>Identify the business and account involved, when notice arrived, when processing stopped and the reason actually supplied. Keep the notice and relevant correspondence. If no detailed reason was given, say so. If you disagree with the reason, distinguish the provider’s statement from your explanation and supporting evidence.</p>
    <p>Do not turn a temporary restriction into a permanent termination in the account history, or describe an involuntary closure as a voluntary cancellation. Those differences can affect what the next reviewer asks.</p>
    <p>If the business itself also closed, identify that separately. Our article on <Link href="/company/blog/previous-business-closure-payment-review" prefetch={false}>explaining a previous business closure</Link> covers the company history behind the account. Here, keep the provider’s decision and its stated basis clear.</p>
    </section>

    <section id="what-the-history-means" aria-labelledby="what-the-history-means-title">
      <h2 id="what-the-history-means-title">A closure is not proof of every possible restriction.</h2>
    <p>Mastercard’s MATCH Pro rules require reporting when specified termination circumstances and listed reasons apply. A processor closure alone does not establish that a particular merchant has a MATCH Pro entry. Ask the responsible provider about the actual record instead of inferring it from a rejection email.</p>
    <p>If a listing or restriction is reported, seek its details and the applicable correction or review process through the responsible institution. A new trading name or application is not a way around a binding restriction. Do not pay for a promised guaranteed removal on the strength of a sales claim.</p>
    <p>Trolleys’ published terms distinguish a previous provider’s commercial refusal from a network prohibition. We review the business against the requirements that apply to the proposed account. That distinction allows an honest conversation; it does not promise approval or override a restriction.</p>
    </section>

    <section id="what-changed" aria-labelledby="what-changed-title">
      <h2 id="what-changed-title">Show the change without pretending the old obligations disappeared.</h2>
    <p>If delivery delays contributed, connect each claimed improvement to the problem it is meant to solve. In a hypothetical case, replacing a supplier may help future orders while leaving an older backlog untouched. Explain both the new arrangement and the status of those waiting customers. “We changed suppliers” is a fact about an action; it is not yet evidence that the original problem has been resolved.</p>
    <p>If the disagreement concerns an inaccurate record, provide the correction request and response rather than describing the requested correction as completed. Label operational changes still in progress as unfinished too. Include unresolved refunds, disputes, reserves or other obligations where requested. A settlement between parties should be described according to its actual terms, not treated as a general clearance of every issue. Share sensitive records only through the approved channel.</p>
    <p>The account history has two jobs: explain why the earlier relationship ended and show what can be established about the business today. A candid account can include uncertainty and unfinished work. What weakens it is asking a new provider to rely on a claimed recovery while the evidence still describes an intention to recover.</p>
    </section>
  </BlogArticlePage>;
}
