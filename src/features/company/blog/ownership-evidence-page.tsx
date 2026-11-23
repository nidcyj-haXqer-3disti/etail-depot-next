import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { ownershipEvidenceArticle } from "./ownership-evidence-content";

export function OwnershipEvidencePage() {
  return <BlogArticlePage article={ownershipEvidenceArticle}>
    <p>An investor buys in. A cofounder leaves. A holding company acquires the shares. The business continues selling under the same name, so the original formation certificate stays in the folder marked Company documents.</p>
    <p>When payment onboarding asks who owns the applicant, that folder may be a starting point. It may not be the answer.</p>
    <p>This is where a merchant application can expose an internal recordkeeping problem that nobody needed to solve while the store was busy.</p>

    <section id="what-the-record-proves" aria-labelledby="what-the-record-proves-title">
      <h2 id="what-the-record-proves-title">Existence and ownership are different facts.</h2>
    <p>A formation document establishes facts about the entity’s creation. It does not necessarily identify everyone who owns it now. Texas, for example, explains that its Secretary of State generally does not maintain corporation shareholder or LLC ownership information. Registry practices vary, so a public search should not be treated as a universal ownership register.</p>
    <p>The missing evidence may be in the company’s own records: a current ownership register, governing documents or a later transfer. Which records the reviewer accepts depends on the structure and the request. The important gap is between a document that was correct on formation day and a declaration about ownership today.</p>
    <p>If company records disagree, get the discrepancy resolved by the people responsible for them. Choosing the most convenient version transfers an unresolved internal question into a financial application.</p>
    </section>

    <section id="follow-the-chain" aria-labelledby="follow-the-chain-title">
      <h2 id="follow-the-chain-title">Explain every step between the applicant and its owners.</h2>
    <p>Where another company owns the applicant, naming that company can leave the next question unanswered. A simple dated ownership diagram can help explain the relationship, alongside whatever supporting evidence the reviewer requests.</p>
    <p>The diagram should make it possible to follow each relationship from the applicant to its owners. Show the parent company’s stake in the applicant and the individual’s stake in that parent separately. Labeling both simply as “owner” hides the relationship the reviewer is trying to follow. Complicated interests and calculations need the responsible adviser’s review; the diagram still needs supporting records.</p>
    <p>Its value is practical: a reviewer can ask about a particular link instead of sending the entire application back with a general request for ownership details.</p>
    </section>

    <section id="ownership-and-responsibility" aria-labelledby="ownership-and-responsibility-title">
      <h2 id="ownership-and-responsibility-title">Ownership and responsibility need separate answers.</h2>
    <p>FinCEN’s CDD guidance distinguishes an ownership test from responsibility for controlling or managing a legal entity, and recognizes that no individual may meet the applicable ownership test. That guidance governs covered financial institutions; it is not a universal document list for every merchant application.</p>
    <p>The Trolleys form shown in our <Link href="/resources/merchant-account-setup" prefetch={false}>setup guide</Link> asks about owners at its displayed threshold and separately asks for a control person. Answer those actual questions. Do not change anyone’s ownership percentage to make the form easier to complete, or leave management unexplained because ownership is widely distributed.</p>
    <p>A well prepared application makes the current business intelligible. It should tell the reviewer who owns it, who runs it and which records support those answers, even when none of those facts fits on the original certificate.</p>
    </section>
  </BlogArticlePage>;
}
